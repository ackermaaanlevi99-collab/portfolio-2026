// Helpers compartidos por los componentes de partículas: muestreo de una imagen del
// navegador y detección de WebGL. No dependen de three.js.
import { sampleImageData, type GatherSample } from '@/lib/gather-sampler';

const MAX_SAMPLE_SIDE = 360;

/** Carga una imagen, la reduce a un lado máximo y la convierte en nube de puntos. */
export async function sampleProjectImage(src: string, budget: number): Promise<GatherSample> {
  const image = new window.Image();
  image.decoding = 'async';
  image.src = src;
  await image.decode();

  const scale = Math.min(1, MAX_SAMPLE_SIDE / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Canvas 2D no disponible');
  context.drawImage(image, 0, 0, width, height);
  const { data } = context.getImageData(0, 0, width, height);
  return sampleImageData(data, width, height, { budget, depth: 0.9 });
}

export function supportsWebGL(): boolean {
  const probe = document.createElement('canvas');
  return Boolean(probe.getContext('webgl2') || probe.getContext('webgl'));
}
