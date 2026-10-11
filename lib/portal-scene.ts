import * as THREE from 'three';

type PortalCallbacks = {
  onReady: () => void;
  onError: () => void;
};

export type PortalSceneController = {
  setActive: (active: boolean) => void;
  setVisible: (visible: boolean) => void;
  dispose: () => void;
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float r = length(p);
    float a = atan(p.y, p.x);
    float time = uTime;
    float swirl = 0.5 + 0.5 * sin(a * 5.0 + r * 25.0 - time * 0.7 + sin(a * 3.0) * 0.8);
    float filament = pow(max(0.0, swirl), 5.0);
    float rim = exp(-pow((r - 0.48) * 5.5, 2.0));
    float inner = exp(-r * 8.0);
    float mask = 1.0 - smoothstep(0.72, 1.0, r);
    vec3 deep = vec3(0.004, 0.035, 0.008);
    vec3 neon = vec3(0.13, 1.0, 0.035);
    vec3 color = mix(deep, neon, clamp(rim * (0.28 + filament * 0.9) + inner * 0.22, 0.0, 1.0));
    float alpha = mask * clamp(0.16 + rim * (0.25 + filament * 0.48) + inner * 0.2, 0.0, 0.88);
    gl_FragColor = vec4(color, alpha);
  }
`;

function createNoopController(): PortalSceneController {
  return { setActive: () => undefined, setVisible: () => undefined, dispose: () => undefined };
}

export function mountPortalScene(host: HTMLDivElement, callbacks: PortalCallbacks): PortalSceneController {
  const mobileViewport = window.matchMedia('(max-width: 760px)');
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
      preserveDrawingBuffer: false,
    });
  } catch {
    callbacks.onError();
    return createNoopController();
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobileViewport.matches ? 1 : 1.35));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.16;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.className = 'hero-portal__webgl';
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 30);
  camera.position.set(0, 0, 4.35);

  scene.add(new THREE.HemisphereLight(0x9dff8b, 0x061007, 1.35));
  const keyLight = new THREE.PointLight(0x4bff2e, 4.3, 8, 2);
  keyLight.position.set(-1.2, 1.4, 2.2);
  scene.add(keyLight);
  const rimLight = new THREE.PointLight(0x169e15, 2.2, 7, 2);
  rimLight.position.set(1.1, -1.1, -1.3);
  scene.add(rimLight);

  const portal = new THREE.Group();
  scene.add(portal);

  const centerMaterial = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const center = new THREE.Mesh(new THREE.CircleGeometry(0.79, 64), centerMaterial);
  center.position.z = -0.2;
  portal.add(center);

  const outerMaterial = new THREE.MeshStandardMaterial({
    color: 0x198b12,
    metalness: 0.38,
    roughness: 0.24,
    emissive: 0x0c6410,
    emissiveIntensity: 0.72,
  });
  const outerRing = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.12, 10, 80), outerMaterial);
  outerRing.rotation.x = 0.12;
  portal.add(outerRing);

  const brightMaterial = new THREE.MeshStandardMaterial({
    color: 0x4bff2e,
    metalness: 0.18,
    roughness: 0.2,
    emissive: 0x26c719,
    emissiveIntensity: 0.55,
  });
  const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.69, 0.024, 6, 80), brightMaterial);
  innerRing.position.z = 0.11;
  portal.add(innerRing);

  const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x1d8015, transparent: true, opacity: 0.68 });
  const orbit = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.009, 4, 96), orbitMaterial);
  orbit.rotation.x = -0.22;
  orbit.rotation.y = 0.25;
  portal.add(orbit);

  const cubeGeometry = new THREE.BoxGeometry(0.16, 0.16, 0.16);
  const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0x4bff2e,
    metalness: 0.22,
    roughness: 0.3,
    emissive: 0x0d7508,
    emissiveIntensity: 0.5,
  });
  const cubeCount = 12;
  const cubes = new THREE.InstancedMesh(cubeGeometry, cubeMaterial, cubeCount);
  cubes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  portal.add(cubes);
  const cubeTransform = new THREE.Object3D();

  const particleCount = 44;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let index = 0; index < particleCount; index += 1) {
    const angle = index * 2.399963;
    const radius = 1.25 + (index % 4) * 0.08;
    particlePositions[index * 3] = Math.cos(angle) * radius;
    particlePositions[index * 3 + 1] = Math.sin(angle) * radius * 0.74;
    particlePositions[index * 3 + 2] = ((index % 7) - 3) * 0.045;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x5cfa42,
    size: 0.022,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.66,
    depthWrite: false,
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  portal.add(particles);

  let active = false;
  let visible = false;
  let failed = false;
  let scrollProgress = 0;
  let targetPointerX = 0;
  let targetPointerY = 0;
  let pointerX = 0;
  let pointerY = 0;

  const resize = () => {
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobileViewport.matches ? 1 : 1.35));
    renderer.setSize(width, height, false);
    if (!active || !visible) renderer.render(scene, camera);
  };

  const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
  resizeObserver?.observe(host);
  if (!resizeObserver) window.addEventListener('resize', resize);
  resize();

  const updateCubes = (time: number) => {
    for (let index = 0; index < cubeCount; index += 1) {
      const angle = (index / cubeCount) * Math.PI * 2 + time * (index % 2 === 0 ? 0.11 : -0.08);
      const radius = 1.08 + (index % 3) * 0.115;
      const bob = Math.sin(time * 0.7 + index * 1.7) * 0.08;
      cubeTransform.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.82 + bob, Math.sin(index * 2.1) * 0.13);
      cubeTransform.rotation.set(time * 0.15 + index * 0.3, time * 0.2 + index, time * 0.12 - index * 0.2);
      cubeTransform.scale.setScalar(index % 4 === 0 ? 0.72 : 0.48 + (index % 3) * 0.08);
      cubeTransform.updateMatrix();
      cubes.setMatrixAt(index, cubeTransform.matrix);
    }
    cubes.instanceMatrix.needsUpdate = true;
  };

  const renderFrame = (timestamp: number) => {
    if (failed) return;
    const time = active ? timestamp * 0.001 : 0;
    pointerX += (targetPointerX - pointerX) * 0.075;
    pointerY += (targetPointerY - pointerY) * 0.075;
    portal.rotation.x = -0.12 + pointerY * 0.1;
    portal.rotation.y = pointerX * 0.15 + Math.sin(time * 0.18) * 0.025;
    portal.rotation.z = scrollProgress * 0.04 + Math.sin(time * 0.13) * 0.018;
    centerMaterial.uniforms.uTime.value = time;
    if (active) updateCubes(time);
    else updateCubes(0);
    renderer.render(scene, camera);
  };

  let lastRenderedAt = 0;
  const animate = (timestamp: number) => {
    const frameInterval = mobileViewport.matches ? 1000 / 30 : 1000 / 60;
    if (timestamp - lastRenderedAt < frameInterval) return;
    lastRenderedAt = timestamp;
    renderFrame(timestamp);
  };
  const syncLoop = () => {
    if (failed) return;
    if (active && visible && document.visibilityState === 'visible') {
      renderer.setAnimationLoop(animate);
    } else {
      renderer.setAnimationLoop(null);
      renderFrame(0);
    }
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!active || event.pointerType !== 'mouse') return;
    const bounds = host.getBoundingClientRect();
    targetPointerX = ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 2;
    targetPointerY = ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * 2;
  };
  const clearPointer = () => {
    targetPointerX = 0;
    targetPointerY = 0;
  };
  const handleScroll = () => {
    scrollProgress = Math.min(1, Math.max(0, window.scrollY / Math.max(window.innerHeight, 1)));
  };
  const handleVisibilityChange = () => syncLoop();
  const handleContextLost = (event: Event) => {
    event.preventDefault();
    failed = true;
    renderer.setAnimationLoop(null);
    callbacks.onError();
  };

  host.addEventListener('pointermove', handlePointerMove, { passive: true });
  host.addEventListener('pointerleave', clearPointer, { passive: true });
  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('visibilitychange', handleVisibilityChange);
  renderer.domElement.addEventListener('webglcontextlost', handleContextLost, { passive: false });
  callbacks.onReady();
  renderFrame(0);

  return {
    setActive(nextActive) {
      active = nextActive;
      if (!active) {
        targetPointerX = 0;
        targetPointerY = 0;
        scrollProgress = 0;
      } else {
        handleScroll();
      }
      syncLoop();
    },
    setVisible(nextVisible) {
      visible = nextVisible;
      syncLoop();
    },
    dispose() {
      renderer.setAnimationLoop(null);
      resizeObserver?.disconnect();
      if (!resizeObserver) window.removeEventListener('resize', resize);
      host.removeEventListener('pointermove', handlePointerMove);
      host.removeEventListener('pointerleave', clearPointer);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);

      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) geometries.add(mesh.geometry);
        if (Array.isArray(mesh.material)) mesh.material.forEach((material) => materials.add(material));
        else if (mesh.material) materials.add(mesh.material);
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
