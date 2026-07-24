import { MetadataRoute } from 'next';
import portfolio from '@/content/portfolio.json';
import siteConfig from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const projectUrls = portfolio.map((p) => ({
    url: `${siteConfig.url}/proyectos/${p.slug}`,
    lastModified: new Date(),
  }));

  return [{ url: siteConfig.url, lastModified: new Date(), priority: 1 }, ...projectUrls];
}
