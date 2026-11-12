"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getMissingAltImages() {
  const missingAltImages: { blogId: string; blogTitle: string; slug: string; imageSrc: string; source: 'Supabase' | 'WordPress'; issueType: string }[] = [];

  // Helper to extract missing alt images from HTML content
  const extractMissingAlts = (content: string, blogId: string, blogTitle: string, slug: string, source: 'Supabase' | 'WordPress') => {
    if (!content) return;
    const imgRegex = /<img\s+([^>]+)>/gi;
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
      const attributes = match[1];
      const srcMatch = attributes.match(/src=["'](.*?)["']/i);
      const src = srcMatch ? srcMatch[1] : "";
      const altMatch = attributes.match(/alt=["'](.*?)["']/i);
      const alt = altMatch ? altMatch[1] : null;

      if (alt === null) {
        if (src) {
          missingAltImages.push({ blogId, blogTitle, slug, imageSrc: src, source, issueType: 'Missing "alt" attribute' });
        }
      } else if (alt.trim() === "") {
        if (src) {
          missingAltImages.push({ blogId, blogTitle, slug, imageSrc: src, source, issueType: 'Empty "alt" attribute' });
        }
      }
    }
  };

  try {
    // Step A: Supabase
    const { data: blogs, error } = await supabase.from("blogs").select("id, title, slug, content");
    if (!error && blogs) {
      for (const blog of blogs) {
        extractMissingAlts(blog.content, blog.id, blog.title, blog.slug, 'Supabase');
      }
    } else {
      console.error("Error fetching Supabase blogs for alt image audit:", error);
    }

    // Step B: WordPress
    try {
      const wpResponse = await fetch("https://lime-hummingbird-549929.hostingersite.com/wp-json/wp/v2/posts?_fields=id,title,content,slug", {
        next: { revalidate: 3600 } // Cache for 1 hour to avoid slow UI
      });
      if (wpResponse.ok) {
        const wpPosts = await wpResponse.json();
        for (const post of wpPosts) {
          const title = post.title?.rendered || "Untitled WP Post";
          const content = post.content?.rendered || "";
          extractMissingAlts(content, post.id.toString(), title, post.slug, 'WordPress');
        }
      }
    } catch (wpError) {
      console.error("Error fetching WordPress posts for alt image audit:", wpError);
    }

    return missingAltImages;
  } catch (error) {
    console.error("Failed to audit missing alt images:", error);
    return [];
  }
}

export async function getMediaAuditStats() {
  try {
    let seoImageUrls: string[] = [];
    let storageImageCount = 0;
    let totalSizeBytes = 0;

    // Step A: Parse Sitemap for SEO Image Count
    try {
      // Fetch the root sitemap (this might be an index or the main sitemap)
      const sitemapRes = await fetch('https://goalsfloors.com/sitemap.xml', { next: { revalidate: 3600 } });
      if (sitemapRes.ok) {
        const sitemapText = await sitemapRes.text();
        
        // Match <image:loc> tags (Common in Yoast/RankMath)
        const imageLocMatches = sitemapText.match(/<image:loc>(.*?)<\/image:loc>/gi) || [];
        // Match standard <loc> tags that end with an image extension
        const locMatches = sitemapText.match(/<loc>(.*?\.(jpg|jpeg|png|webp|gif))<\/loc>/gi) || [];
        
        const allImages = new Set([
          ...imageLocMatches.map(m => m.replace(/<\/?image:loc>/gi, '')),
          ...locMatches.map(m => m.replace(/<\/?loc>/gi, ''))
        ]);
        
        seoImageUrls = Array.from(allImages);
      }
    } catch (e) {
      console.error("Error parsing sitemap for images:", e);
    }

    // Step B: Supabase Data
    const { data: files, error } = await supabase.storage
      .from("blog-images")
      .list("");

    if (error || !files) {
      console.error("Error fetching media audit stats:", error);
      return { seoImageUrls, storageImageCount: 0, totalSizeMB: "0.00" };
    }

    files.forEach((file) => {
      // Exclude placeholder folders
      if (file.name !== ".emptyFolderPlaceholder") {
        storageImageCount++;
        totalSizeBytes += file.metadata?.size || 0;
      }
    });

    const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);

    return { seoImageUrls, storageImageCount, totalSizeMB };
  } catch (error) {
    console.error("Failed to get media audit stats:", error);
    return { seoImageUrls: [], storageImageCount: 0, totalSizeMB: "0.00" };
  }
}
