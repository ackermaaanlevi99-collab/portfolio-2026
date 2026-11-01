// Funciones puras que traducen la posición del scroll en el estado de la escena de partículas.
// Son independientes del DOM para poder razonar sobre ellas y probarlas por separado.

/**
 * Progreso de 0 a 1 de una sección alta con un marco pegado (sticky) de altura de pantalla.
 * @param sectionTop distancia entre el borde superior de la sección y la parte superior de la pantalla
 * @param sectionHeight altura total de la sección
 * @param viewportHeight altura de la ventana
 */
export function scrollProgress(sectionTop: number, sectionHeight: number, viewportHeight: number): number {
  const range = sectionHeight - viewportHeight;
  if (range <= 0) return 0;
  return Math.min(1, Math.max(0, -sectionTop / range));
}

/**
 * Estado de reconstrucción de la escena (0 dispersa, 1 reconstruida).
 * La imagen empieza reconstruida, se dispersa a mitad de la sección y vuelve a formarse al final.
 */
export function gatherForProgress(progress: number): number {
  const p = Math.min(1, Math.max(0, progress));
  return p < 0.5 ? 1 - p * 2 : (p - 0.5) * 2;
}

/** Índice del paso de texto activo para un progreso dado. */
export function stepForProgress(progress: number, stepCount: number): number {
  if (stepCount <= 0) return 0;
  const index = Math.floor(Math.min(1, Math.max(0, progress)) * stepCount);
  return Math.min(stepCount - 1, index);
}
