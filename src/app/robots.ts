import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/tmp/', '/private/', '/(admin)/'],
    },
    sitemap: 'https://goalsfloors.com/sitemap.xml',
  };
}
