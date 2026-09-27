export const WP_ORIGIN = "https://blog.goalsfloors.com";
export const SITE_ORIGIN = "https://goalsfloors.com";

/**
 * Converts a WordPress Hostinger image URL into a domain-level goalsfloors.com URL.
 * e.g. https://lime-hummingbird-549929.hostingersite.com/wp-content/uploads/2026/05/pic.jpg
 * -> https://goalsfloors.com/wp-content/uploads/2026/05/pic.jpg
 */
export function toDomainImageUrl(url?: string | null): string {
  if (!url) return "";
  return url.replace(
    /https?:\/\/blog\.goalsfloors\.com\/wp-content\/uploads\//g,
    `${SITE_ORIGIN}/wp-content/uploads/`
  );
}

/**
 * Replaces all Hostinger image URLs inside blog HTML content (in src, srcset, data-src, style, etc.)
 * with our domain-level goalsfloors.com proxy URL.
 */
export function transformContentImages(html?: string | null): string {
  if (!html) return "";
  return html.replace(
    /https?:\/\/blog\.goalsfloors\.com\/wp-content\/uploads\//g,
    `${SITE_ORIGIN}/wp-content/uploads/`
  );
}

/**
 * Cleans WordPress HTML entities like &amp;, &#8211;, &#8217;, and [&hellip;]
 * into clean, human-readable UTF-8 characters for metadata, titles, and structured data.
 */
export function cleanHtmlEntities(text?: string | null): string {
  if (!text) return "";

  return text
    .replace(/<[^>]*>?/gm, "") // Strip HTML tags
    .replace(/\[&hellip;\]/g, "...")
    .replace(/&hellip;/g, "...")
    .replace(/&amp;/g, "&")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}
