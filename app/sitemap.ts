import type { MetadataRoute } from 'next';
import { getPublishedProjects } from '@/lib/projects';
import siteConfig from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const root = { url: siteConfig.url, priority: 1, changeFrequency: 'monthly' as const };
  const projects = getPublishedProjects().map((project) => ({
    url: `${siteConfig.url}/proyectos/${project.slug}`,
    changeFrequency: 'yearly' as const,
  }));
  return [
    root,
    { url: `${siteConfig.url}/proyectos`, changeFrequency: 'monthly' },
    { url: `${siteConfig.url}/servicios`, changeFrequency: 'monthly' },
    { url: `${siteConfig.url}/sobre-mi`, changeFrequency: 'monthly' },
    ...projects,
  ];
}
