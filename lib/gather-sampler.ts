// Convierte los píxeles de una imagen en una nube de puntos (se ejecuta una vez por imagen).
// No depende de three.js: es JavaScript puro para poder probarlo por separado.

export interface GatherSample {
  /** Posición final (reconstruida) de cada punto: x, y, z en unidades de escena. */
  positions: Float32Array;
  /** Color RGB normalizado de cada punto. */
  colors: Float32Array;
  /** Tres números pseudoaleatorios por punto, estables entre recargas. */
  seeds: Float32Array;
  count: number;
  /** Relación de aspecto de la imagen (ancho / alto). */
  aspect: number;
}

export interface GatherSampleOptions {
  /** Número máximo aproximado de puntos. */
  budget: number;
  /** Profundidad máxima en unidades de escena (la luminancia define la profundidad). */
  depth?: number;
  /** Umbral de alfa: los píxeles por debajo se descartan. */
  alphaThreshold?: number;
}

// Hash entero determinista: el mismo píxel siempre produce el mismo valor.
function hash01(n: number): number {
  let x = n | 0;
  x = (x ^ 61) ^ (x >>> 16);
  x = (x + (x << 3)) | 0;
  x ^= x >>> 4;
  x = Math.imul(x, 0x27d4eb2d);
  x ^= x >>> 15;
  return (x >>> 0) / 4294967295;
}

export function sampleImageData(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  options: GatherSampleOptions,
): GatherSample {
  const depth = options.depth ?? 0.9;
  const alphaThreshold = options.alphaThreshold ?? 16;
  const budget = Math.max(1000, Math.floor(options.budget));

  // Paso de muestreo elegido para que la rejilla tenga aprox. "budget" celdas.
  const step = Math.max(1, Math.floor(Math.sqrt((width * height) / budget)));
  const aspect = width / height;

  const cols = Math.ceil(width / step);
  const rows = Math.ceil(height / step);
  const maxCount = cols * rows;

  const positions = new Float32Array(maxCount * 3);
  const colors = new Float32Array(maxCount * 3);
  const seeds = new Float32Array(maxCount * 3);
  let count = 0;

  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      const cellIndex = gy * cols + gx;
      // Jitter dentro de la celda para evitar una rejilla visible.
      const jx = hash01(cellIndex * 3 + 1);
      const jy = hash01(cellIndex * 3 + 2);
      const px = Math.min(width - 1, Math.floor((gx + jx) * step));
      const py = Math.min(height - 1, Math.floor((gy + jy) * step));
      const i = (py * width + px) * 4;

      const alpha = data[i + 3];
      if (alpha < alphaThreshold) continue;

      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      const o = count * 3;
      // Plano de alto 2 centrado en el origen. Y invertido porque la imagen crece hacia abajo.
      positions[o] = (px / width - 0.5) * 2 * aspect;
      positions[o + 1] = -(py / height - 0.5) * 2;
      positions[o + 2] = (luminance - 0.5) * depth;

      colors[o] = r;
      colors[o + 1] = g;
      colors[o + 2] = b;

      seeds[o] = hash01(cellIndex * 7 + 11);
      seeds[o + 1] = hash01(cellIndex * 7 + 23);
      seeds[o + 2] = hash01(cellIndex * 7 + 37);
      count++;
    }
  }

  return {
    positions: positions.slice(0, count * 3),
    colors: colors.slice(0, count * 3),
    seeds: seeds.slice(0, count * 3),
    count,
    aspect,
  };
}
