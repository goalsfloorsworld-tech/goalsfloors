import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/tmp/', '/private/'],
    },
    sitemap: 'https://goalsfloors.com/sitemap.xml',
  };
}
