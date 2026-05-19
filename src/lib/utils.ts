export function optimizeCloudinaryUrl(url: string): string {
  if (url.includes('cloudinary.com/') && url.includes('/upload/')) {
    if (!url.includes('f_auto,q_auto')) {
      return url.replace('/upload/', '/upload/f_auto,q_auto/');
    }
  }
  return url;
}
