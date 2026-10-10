import portfolio from '@/content/portfolio.generated.json';
import services from '@/content/services.json';
import type { ProjectItem, ServiceItem } from '@/types/content';

const publishedProjects = portfolio as ProjectItem[];
const currentServices = services as ServiceItem[];

export function getPublishedProjects(): ProjectItem[] {
  return publishedProjects;
}

export function getProjectBySlug(slug: string): ProjectItem | undefined {
  return publishedProjects.find(
    (project) => project.slug === slug || project.legacySlugs?.includes(slug),
  );
}

export function getProjectPaths(): { slug: string }[] {
  return publishedProjects.flatMap((project) => [
    { slug: project.slug },
    ...(project.legacySlugs ?? []).map((slug) => ({ slug })),
  ]);
}

export function getActiveServices(): ServiceItem[] {
  const usedServiceIds = new Set(publishedProjects.flatMap((project) => project.services));
  return currentServices.filter((service) => usedServiceIds.has(service.id));
}

export function getProjectsForService(serviceId: string): ProjectItem[] {
  return publishedProjects.filter((project) => project.services.includes(serviceId));
}

export function getServiceTitle(serviceId: string): string {
  return currentServices.find((service) => service.id === serviceId)?.title ?? serviceId;
}

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
