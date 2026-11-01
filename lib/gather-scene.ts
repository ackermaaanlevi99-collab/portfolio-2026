import * as THREE from 'three';
import type { GatherSample } from './gather-sampler';

export interface GatherController {
  /** 0 = partículas dispersas, 1 = imagen reconstruida. */
  setGather: (value: number) => void;
  dispose: () => void;
}

export interface GatherMountOptions {
  /** Reduce la densidad de puntos y la resolución en dispositivos táctiles o pequeños. */
  mobile: boolean;
}

// La dispersión y la reconstrucción se calculan en la GPU. La CPU solo actualiza unos pocos uniformes por fotograma.
const vertexShader = /* glsl */ `
  uniform float uGather;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec2 uPointer;
  uniform float uPointerRadius;
  uniform float uPointerForce;

  attribute vec3 aColor;
  attribute vec3 aSeed;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 base = position;

    // Dirección y amplitud de dispersión propias de cada punto.
    vec3 dir = normalize(aSeed * 2.0 - 1.0 + vec3(0.0001));
    float spread = 1.2 + aSeed.z * 1.8;
    float wobble = 0.75 + 0.25 * sin(uTime * 0.9 + aSeed.x * 6.2831);
    vec3 scattered = base + dir * spread * wobble;
    scattered.y += sin(uTime * 0.5 + aSeed.y * 12.0) * 0.12;

    // Curva suave (smoothstep) entre disperso y reconstruido.
    float g = uGather * uGather * (3.0 - 2.0 * uGather);
    vec3 pos = mix(scattered, base, g);

    // Repulsión suave alrededor del puntero, en espacio de pantalla.
    vec4 clip = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vec2 ndc = clip.xy / clip.w;
    vec2 d = ndc - uPointer;
    float influence = smoothstep(uPointerRadius, 0.0, length(d)) * uPointerForce;
    pos.xy += normalize(d + vec2(0.00001)) * influence * 0.6;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio / max(0.1, -mv.z);

    vColor = aColor;
    vAlpha = mix(0.55, 1.0, g);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.15, r) * vAlpha;
    gl_FragColor = vec4(vColor, a);
  }
`;

/**
 * Monta la escena en `host`. Lanza una excepción si WebGL no está disponible;
 * el componente que la llama debe mostrar la imagen original en ese caso.
 */
export function mountGatherScene(host: HTMLDivElement, sample: GatherSample, options: GatherMountOptions): GatherController {
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
  const dpr = Math.min(window.devicePixelRatio || 1, options.mobile ? 1 : 1.5);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);

  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const fov = 35;
  // El plano de la imagen mide 2 unidades de alto; la cámara encuadra ese alto con un margen.
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
  camera.position.z = (1 / Math.tan(THREE.MathUtils.degToRad(fov / 2))) * 1.15;

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(sample.positions, 3));
  geometry.setAttribute('aColor', new THREE.Float32BufferAttribute(sample.colors, 3));
  geometry.setAttribute('aSeed', new THREE.Float32BufferAttribute(sample.seeds, 3));
  geometry.computeBoundingSphere();

  const uniforms = {
    uGather: { value: 0 },
    uTime: { value: 0 },
    uSize: { value: options.mobile ? 14 : 18 },
    uPixelRatio: { value: dpr },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uPointerRadius: { value: 0.28 },
    uPointerForce: { value: 0 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Estado animado: el valor objetivo lo fija la interfaz y el valor actual se acerca con un easing independiente del fotograma.
  let targetGather = 1;
  let currentGather = 0;
  let pointerTarget = new THREE.Vector2(0, 0);
  const pointerCurrent = new THREE.Vector2(0, 0);
  let pointerActive = false;
  let raf = 0;
  let visibleInViewport = true;
  const clock = new THREE.Clock();

  function resize() {
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  resize();

  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    currentGather += (targetGather - currentGather) * (1 - Math.pow(0.0025, dt));
    pointerCurrent.lerp(pointerTarget, 1 - Math.pow(0.001, dt));
    uniforms.uGather.value = currentGather;
    uniforms.uTime.value += dt;
    uniforms.uPointer.value.copy(pointerCurrent);
    uniforms.uPointerForce.value += ((pointerActive ? 0.6 : 0) - uniforms.uPointerForce.value) * (1 - Math.pow(0.01, dt));
    points.rotation.y = pointerCurrent.x * 0.12;
    points.rotation.x = -pointerCurrent.y * 0.08;
    renderer.render(scene, camera);
  }

  function start() {
    if (!raf && visibleInViewport && !document.hidden) {
      clock.getDelta();
      raf = requestAnimationFrame(frame);
    }
  }
  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }
  function syncRunning() {
    if (visibleInViewport && !document.hidden) start();
    else stop();
  }

  const resizeObserver = new ResizeObserver(() => resize());
  resizeObserver.observe(host);

  const intersection = new IntersectionObserver((entries) => {
    visibleInViewport = entries.some((entry) => entry.isIntersecting);
    syncRunning();
  });
  intersection.observe(host);
  document.addEventListener('visibilitychange', syncRunning);

  function pointerFromEvent(event: PointerEvent) {
    const rect = host.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    return new THREE.Vector2(x, y);
  }
  // Solo el ratón influye en el puntero. En táctil no se interceptan los gestos de desplazamiento.
  function onPointerMove(event: PointerEvent) {
    if (event.pointerType !== 'mouse') return;
    pointerActive = true;
    pointerTarget = pointerFromEvent(event);
  }
  function onPointerLeave() {
    pointerActive = false;
  }
  host.addEventListener('pointermove', onPointerMove);
  host.addEventListener('pointerleave', onPointerLeave);

  start();

  return {
    setGather(value: number) {
      targetGather = Math.min(1, Math.max(0, value));
    },
    dispose() {
      stop();
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', syncRunning);
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerleave', onPointerLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
