import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

const API_BASE_URL = "https://lime-hummingbird-549929.hostingersite.com/wp-json/wp/v2";

function uniqueStrings(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value && value.trim()))));
}

function collectProductImages(product: any) {
  const imageUrls: Array<string | null | undefined> = [];

  if (Array.isArray(product.images)) {
    imageUrls.push(...product.images.map((image: { url?: string }) => image?.url));
  }

  if (Array.isArray(product.installedImages)) {
    imageUrls.push(...product.installedImages.map((image: { url?: string }) => image?.url));
  }

  if (Array.isArray(product.beforeAfter)) {
    product.beforeAfter.forEach((pair: { before?: { url?: string }; after?: { url?: string } }) => {
      imageUrls.push(pair?.before?.url, pair?.after?.url);
    });
  }

  if (Array.isArray(product.variants)) {
    product.variants.forEach((variant: { images?: Array<{ url?: string }> }) => {
      if (Array.isArray(variant.images)) {
        imageUrls.push(...variant.images.map((image) => image?.url));
      }
    });
  }

  return uniqueStrings(imageUrls);
}

function collectMultiverseImages(data: any) {
  const imageUrls: Array<string | null | undefined> = [];

  if (Array.isArray(data.collections)) {
    data.collections.forEach((collection: { images?: Array<{ url?: string }> }) => {
      if (Array.isArray(collection.images)) {
        imageUrls.push(...collection.images.map((image) => image?.url));
      }
    });
  }

  if (Array.isArray(data.relatedLinks)) {
    imageUrls.push(...data.relatedLinks.map((link: { image?: string }) => link?.image));
  }

  return uniqueStrings(imageUrls);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://goalsfloors.com';

  // 1. Static Pages
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/blogs',
    '/dealer',
    '/products',
    '/privacy',
    '/terms'
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
        const images = collectProductImages(product);
        
        return {
          url: `${baseUrl}/products/${product.slug || name.replace('.json', '')}`,
          lastModified: stats.mtime.toISOString(),
          changeFrequency: 'weekly' as const,
          priority: 0.9,
          images: images.length > 0 ? images : undefined,
        };
      });
  } catch (error) {
    console.error('Error reading product files for sitemap:', error);
  }

  // 3. Dynamic Blog Pages from WordPress
  interface WPPost {
    slug: string;
    modified: string;
    _embedded?: {
      'wp:featuredmedia'?: Array<{
        source_url?: string;
      }>;
    };
  }
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_BASE_URL}/posts?per_page=100&_embed=true`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const posts = await res.json();
      blogRoutes = posts.map((post: WPPost) => ({
        url: `${baseUrl}/blogs/${post.slug}`,
        lastModified: new Date(post.modified).toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
        images: post._embedded?.['wp:featuredmedia']?.[0]?.source_url ? [post._embedded['wp:featuredmedia'][0].source_url as string] : undefined,
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
      images: [
        `${baseUrl}/images/multiverse/hero-bg.png`,
        `${baseUrl}/images/multiverse/flooring.png`,
        `${baseUrl}/images/multiverse/wall-panels.png`,
      ],
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
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const images = collectMultiverseImages(data);
            
            multiverseRoutes.push({
              url: `${baseUrl}/multiverse/${category}/${variantSlug}`,
              lastModified: stats.mtime.toISOString(),
              changeFrequency: 'weekly' as const,
              priority: 0.9,
              images: images.length > 0 ? images : undefined,
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

