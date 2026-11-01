'use client';

import { useEffect, useRef, useState } from 'react';

// Experimento "Forma": una nube de puntos que se transforma entre tres formas
// matemáticas. Todo se calcula en el cliente; no hay datos ni assets externos.

export type FormShapeId = 'sphere' | 'torus' | 'knot';

export const FORM_SHAPES: { id: FormShapeId; label: string }[] = [
  { id: 'sphere', label: 'Esfera' },
  { id: 'torus', label: 'Toroide' },
  { id: 'knot', label: 'Nudo' },
];

const POINT_COUNT = 9000;

// Distribución determinista de puntos sobre cada forma.
// Usa secuencias de baja discrepancia para que los puntos se repartan de forma uniforme.
export function buildFormPoints(id: FormShapeId, count: number): Float32Array {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const s = (i + 0.5) / count;
    // Secuencia de Kronecker de dos dimensiones (constantes de R2): cubre el plano
    // uniformemente. Con dos secuencias dependientes los puntos caían en una curva.
    const a = (0.5 + i * 0.7548776662) % 1;
    const b = (0.5 + i * 0.5698402910) % 1;
    let x = 0;
    let y = 0;
    let z = 0;

    if (id === 'sphere') {
      const phi = Math.acos(1 - 2 * s);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      x = 0.9 * Math.cos(theta) * Math.sin(phi);
      y = 0.9 * Math.cos(phi);
      z = 0.9 * Math.sin(theta) * Math.sin(phi);
    } else if (id === 'torus') {
      const R = 0.62;
      const r = 0.26;
      const u = 2 * Math.PI * a;
      const v = 2 * Math.PI * b;
      x = (R + r * Math.cos(v)) * Math.cos(u);
      y = r * Math.sin(v);
      z = (R + r * Math.cos(v)) * Math.sin(u);
    } else {
      // Nudo de trébol: curva con un pequeño desplazamiento radial para darle grosor.
      const t = 2 * Math.PI * s;
      const cx = Math.sin(t) + 2 * Math.sin(2 * t);
      const cy = Math.cos(t) - 2 * Math.cos(2 * t);
      const cz = -Math.sin(3 * t);
      x = 0.3 * cx + (a - 0.5) * 0.12;
      y = 0.3 * cy + (b - 0.5) * 0.12;
      z = 0.3 * cz + (a * b - 0.25) * 0.12;
    }

    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

const vertexShader = `
  uniform float uNoise;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vShade;
  void main() {
    vec3 p = position;
    float n = sin(p.x * 7.0 + uTime * 1.3) * cos(p.y * 6.0 - uTime * 1.1) * sin(p.z * 5.0 + uTime * 0.9);
    p += normalize(p + vec3(1e-5)) * n * uNoise * 0.25;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = max(1.0, uSize * uPixelRatio / -mv.z);
    vShade = 0.45 + 0.55 * clamp((p.y + 1.0) / 2.0, 0.0, 1.0);
  }
`;

const fragmentShader = `
  varying float vShade;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (length(c) > 0.5) discard;
    gl_FragColor = vec4(vec3(0.294, 1.0, 0.18) * vShade, 0.9);
  }
`;

export default function FormExperiment() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [shape, setShape] = useState<FormShapeId>('sphere');
  const [noise, setNoise] = useState(20);
  const [paused, setPaused] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  // Las líneas de animación leen estos valores por referencia, sin reiniciar la escena.
  const shapeRef = useRef(shape);
  const noiseRef = useRef(noise);
  const pausedRef = useRef(paused);
  useEffect(() => {
    shapeRef.current = shape;
    noiseRef.current = noise;
    pausedRef.current = paused;
  }, [shape, noise, paused]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    (async () => {
      const THREE = await import('three');
      if (disposed) return;

      const probe = document.createElement('canvas');
      if (!probe.getContext('webgl2') && !probe.getContext('webgl')) {
        setStatus('error');
        return;
      }

      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      renderer.setPixelRatio(pixelRatio);
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute('aria-hidden', 'true');
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
      camera.position.z = 3.2;

      const targets: Record<FormShapeId, Float32Array> = {
        sphere: buildFormPoints('sphere', POINT_COUNT),
        torus: buildFormPoints('torus', POINT_COUNT),
        knot: buildFormPoints('knot', POINT_COUNT),
      };
      // Posiciones mostradas: se acercan a la forma objetivo en cada cuadro.
      const current = new Float32Array(targets[shapeRef.current]);

      const geometry = new THREE.BufferGeometry();
      const positionAttr = new THREE.BufferAttribute(current, 3);
      geometry.setAttribute('position', positionAttr);

      const uniforms = {
        uNoise: { value: noiseRef.current / 100 },
        uTime: { value: 0 },
        uSize: { value: 10 },
        uPixelRatio: { value: pixelRatio },
      };
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        // Mezcla normal: la mezcla aditiva saturaba los puntos a blanco.
        blending: THREE.NormalBlending,
      });
      const points = new THREE.Points(geometry, material);
      // Inclinación fija para que el toroide se lea como anillo y no de canto.
      points.rotation.x = 0.5;
      scene.add(points);

      const resize = () => {
        const w = Math.max(1, host.clientWidth);
        const h = Math.max(1, host.clientHeight);
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);

      // No se dibuja mientras el experimento está fuera de pantalla.
      let visible = true;
      const intersection = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      intersection.observe(host);

      let raf = 0;
      let last = performance.now();
      const frame = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        const target = targets[shapeRef.current];
        const isPaused = pausedRef.current || reducedMotion;

        // Con movimiento reducido el cambio de forma es inmediato.
        const k = reducedMotion ? 1 : 1 - Math.pow(0.002, dt);
        for (let i = 0; i < current.length; i++) {
          current[i] += (target[i] - current[i]) * k;
        }
        positionAttr.needsUpdate = true;

        uniforms.uNoise.value = noiseRef.current / 100;
        if (!isPaused) {
          uniforms.uTime.value += dt;
          points.rotation.y += dt * 0.25;
        }

        if (visible) renderer.render(scene, camera);
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
      setStatus('ready');

      cleanup = () => {
        cancelAnimationFrame(raf);
        resizeObserver.disconnect();
        intersection.disconnect();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })().catch(() => setStatus('error'));

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div className="playground-form">
      <div className="playground__stage playground__stage--form">
        <div ref={hostRef} className="playground__host" />
        {status === 'loading' && <p className="playground__status playground__status--overlay">Cargando forma…</p>}
        {status === 'error' && (
          <p className="playground__status playground__status--overlay" role="alert">
            Tu navegador no admite WebGL, así que este experimento no puede mostrarse.
          </p>
        )}
      </div>

      <div className="playground__controls" role="group" aria-label="Controles de forma">
        <div className="playground__group" role="group" aria-label="Forma">
          {FORM_SHAPES.map((s) => (
            <button
              key={s.id}
              type="button"
              className="playground__button"
              aria-pressed={shape === s.id}
              onClick={() => setShape(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <label className="playground__range">
          <span>Turbulencia</span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={noise}
            aria-valuetext={`${noise} por ciento`}
            onChange={(event) => setNoise(Number(event.target.value))}
          />
        </label>

        <button type="button" className="playground__button" aria-pressed={paused} onClick={() => setPaused((v) => !v)}>
          {paused ? 'Reanudar movimiento' : 'Pausar movimiento'}
        </button>
      </div>
    </div>
  );
}
