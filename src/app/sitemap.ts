import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

const API_BASE_URL = "https://lime-hummingbird-549929.hostingersite.com/wp-json/wp/v2";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://goalsfloors.com';

  // 1. Static Pages
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/blogs',
    '/dealer',
    '/products'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Dynamic Product Pages
  const productsDirectory = path.join(process.cwd(), 'src', 'data', 'products');
  let productRoutes: MetadataRoute.Sitemap = [];
  
  try {
    const filenames = fs.readdirSync(productsDirectory);
    productRoutes = filenames
      .filter((name) => name.endsWith('.json'))
      .map((name) => {
        const filePath = path.join(productsDirectory, name);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const product = JSON.parse(fileContent);
        // Using file modified time as lastModified
        const stats = fs.statSync(filePath);
        
        return {
          url: `${baseUrl}/products/${product.slug || name.replace('.json', '')}`,
          lastModified: stats.mtime.toISOString(),
          changeFrequency: 'weekly' as const,
          priority: 0.9,
        };
      });
  } catch (error) {
    console.error('Error reading product files for sitemap:', error);
  }

  // 3. Dynamic Blog Pages from WordPress
  interface WPPost {
    slug: string;
    modified: string;
  }
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_BASE_URL}/posts?per_page=100`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const posts = await res.json();
      blogRoutes = posts.map((post: WPPost) => ({
        url: `${baseUrl}/blogs/${post.slug}`,
        lastModified: new Date(post.modified).toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Error fetching WordPress blogs for sitemap:', error);
  }

  // 4. Multiverse Dynamic Pages
  const multiverseDirectory = path.join(process.cwd(), 'src', 'data', 'multiverse');
  let multiverseRoutes: MetadataRoute.Sitemap = [];

  try {
    // Add Multiverse Hub
    multiverseRoutes.push({
      url: `${baseUrl}/multiverse`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    });

    const categories = fs.readdirSync(multiverseDirectory);
    categories.forEach(category => {
      const categoryPath = path.join(multiverseDirectory, category);
      if (fs.statSync(categoryPath).isDirectory()) {
        const variants = fs.readdirSync(categoryPath);
        variants.forEach(variantFile => {
          if (variantFile.endsWith('.json')) {
            const variantSlug = variantFile.replace('.json', '');
            const filePath = path.join(categoryPath, variantFile);
            const stats = fs.statSync(filePath);
            
            multiverseRoutes.push({
              url: `${baseUrl}/multiverse/${category}/${variantSlug}`,
              lastModified: stats.mtime.toISOString(),
              changeFrequency: 'weekly' as const,
              priority: 0.9,
            });
          }
        });
      }
    });
  } catch (error) {
    console.error('Error reading multiverse files for sitemap:', error);
  }

  return [...staticRoutes, ...productRoutes, ...blogRoutes, ...multiverseRoutes];
}

