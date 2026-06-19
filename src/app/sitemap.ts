import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const API_BASE_URL = "https://lime-hummingbird-549929.hostingersite.com/wp-json/wp/v2";

function uniqueStrings(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value && value.trim()))));
}

function processImageUrls(baseUrl: string, urls: Array<string | null | undefined>) {
  const unique = uniqueStrings(urls);
  return unique.map(url => {
    if (url.startsWith('/')) return `${baseUrl}${url}`;
    if (url.startsWith('http') && !url.includes(baseUrl)) {
      // Force Googlebot to index the image via our domain instead of dropping it as cross-domain
      return `${baseUrl}/_next/image?url=${encodeURIComponent(url)}&amp;w=3840&amp;q=75`;
    }
    return url;
  });
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
    '/terms',
    '/compare',
    '/catalogs',
  ].map((route) => {
    let images: string[] | undefined = undefined;
    
    if (route === '/about') {
      images = processImageUrls(baseUrl, [
        "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775755978/Shakti_FTN.jpg",
        "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775749425/Goals_Floors_Wpc_Exterior_Louvers.png",
        "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775749444/Spc_FlooringInstalled_In_Bedrooom.png"
      ]);
    }

    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1.0 : route === '/compare' ? 1.0 : 0.8,
      images: images,
    };
  });

  // 2. Dynamic Product Pages
  const productsDirectory = path.join(process.cwd(), 'src', 'data', 'products');
  let productRoutes: MetadataRoute.Sitemap = [];
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch latest installed images to update lastModified date
    const { data: installedImagesData } = await supabase
      .from('page_installed_images')
      .select('page_slug, created_at');

    const latestImageDates: Record<string, string> = {};
    if (installedImagesData) {
      installedImagesData.forEach((img: any) => {
        if (!latestImageDates[img.page_slug] || new Date(img.created_at) > new Date(latestImageDates[img.page_slug])) {
          latestImageDates[img.page_slug] = img.created_at;
        }
      });
    }

    const filenames = fs.readdirSync(productsDirectory);
    productRoutes = filenames
      .filter((name) => name.endsWith('.json'))
      .map((name) => {
        const filePath = path.join(productsDirectory, name);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const product = JSON.parse(fileContent);
        const slug = product.slug || name.replace('.json', '');
        const images = processImageUrls(baseUrl, collectProductImages(product));
        
        const stats = fs.statSync(filePath);
        let lastMod = stats.mtime.toISOString();
        
        // If there is a newer installed image for this slug, force a recrawl
        if (latestImageDates[slug] && new Date(latestImageDates[slug]) > new Date(lastMod)) {
          lastMod = new Date(latestImageDates[slug]).toISOString();
        }
        
        return {
          url: `${baseUrl}/products/${slug}`,
          lastModified: lastMod,
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
        images: post._embedded?.['wp:featuredmedia']?.[0]?.source_url ? processImageUrls(baseUrl, [post._embedded['wp:featuredmedia'][0].source_url as string]) : undefined,
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
      images: processImageUrls(baseUrl, [
        `${baseUrl}/images/multiverse/hero-bg.png`,
        `${baseUrl}/images/multiverse/flooring.png`,
        `${baseUrl}/images/multiverse/wall-panels.png`,
      ]),
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
            const images = processImageUrls(baseUrl, collectMultiverseImages(data));
            
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

  // 5. Dynamic Comparison Pages from Supabase
  let compareRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabaseCompare = createClient(supabaseUrl, supabaseKey);

    const { data: comparisons } = await supabaseCompare
      .from('product_comparisons')
      .select('slug, created_at');

    if (comparisons) {
      compareRoutes = comparisons.map((row: { slug: string; created_at: string }) => ({
        url: `${baseUrl}/compare/${row.slug}`,
        lastModified: new Date(row.created_at).toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Error fetching compare slugs for sitemap:', error);
  }

  // 6. Dynamic Catalog Pages (PDFs)
  let catalogRoutes: MetadataRoute.Sitemap = [];
  try {
    const catalogsPath = path.join(process.cwd(), 'src', 'data', 'catalogs.json');
    if (fs.existsSync(catalogsPath)) {
      const catalogs = JSON.parse(fs.readFileSync(catalogsPath, 'utf8'));
      const stats = fs.statSync(catalogsPath);
      catalogRoutes = catalogs.map((catalog: any) => ({
        url: `${baseUrl}/catalogs/${catalog.slug}.pdf`,
        lastModified: stats.mtime.toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
        images: catalog.image ? processImageUrls(baseUrl, [catalog.image]) : undefined,
      }));
    }
  } catch (error) {
    console.error('Error reading catalogs for sitemap:', error);
  }

  return [...staticRoutes, ...productRoutes, ...blogRoutes, ...multiverseRoutes, ...compareRoutes, ...catalogRoutes];
}

