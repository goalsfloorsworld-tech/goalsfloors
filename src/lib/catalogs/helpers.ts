/**
 * Helper function to generate clean direct-download URLs for catalogs.
 * Supports Backblaze B2, Cloudinary fl_attachment, and /api/pdf streaming.
 */
export function getCatalogDownloadUrl(url: string | null | undefined): string {
  if (!url) return "#";
  
  // If the URL is already pointing to our API route
  if (url.includes("/api/pdf")) {
    return url + (url.includes("?") ? "&" : "?") + "action=download";
  }
  
  // If it's a Backblaze B2 URL
  if (url.includes("backblazeb2.com")) {
    const filename = url.split("/").pop()?.split("?")[0];
    if (filename) {
      return `/api/pdf?file=${encodeURIComponent(decodeURIComponent(filename))}&action=download`;
    }
  }
  
  // If it's Cloudinary, append fl_attachment to force browser download
  if (url.includes("cloudinary.com") && !url.includes("fl_attachment")) {
    const parts = url.split("/upload/");
    if (parts.length === 2) {
      return `${parts[0]}/upload/fl_attachment/${parts[1]}`;
    }
  }
  
  return url;
}
