const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://emmanuelaranguibelgraphicdesigner.netlify.app';

const siteConfig = {
  url: new URL(configuredUrl).origin,
};

export default siteConfig;
