import type { MetadataRoute } from 'next';
import siteConfig from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  const isPreview = process.env.NODE_ENV !== 'production'
    || process.env.VERCEL_ENV === 'preview'
    || ['deploy-preview', 'branch-deploy'].includes(process.env.CONTEXT ?? '');
  if (isPreview) return { rules: { userAgent: '*', disallow: '/' } };
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${siteConfig.url}/sitemap.xml` };
}
