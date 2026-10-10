export const CATEGORY_LABELS: Record<string, string> = {
  branding: 'Branding',
  textil: 'Diseño textil',
  publicidad: 'Diseño publicitario',
  ilustracion: 'Ilustración',
  '3d': 'Visualización 3D',
  exploracion: 'Experimental',
};

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}
