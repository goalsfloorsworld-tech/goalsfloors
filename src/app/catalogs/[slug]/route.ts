import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const actualSlug = slug.replace('.pdf', '');

  const catalogsPath = path.join(process.cwd(), 'src', 'data', 'catalogs.json');
  let catalogs = [];
  try {
    catalogs = JSON.parse(fs.readFileSync(catalogsPath, 'utf8'));
  } catch (error) {
    console.error("Error reading catalogs.json", error);
  }

  const catalog = catalogs.find((c: any) => c.slug === actualSlug);

  if (!catalog) {
    return new NextResponse("Catalog not found", { status: 404 });
  }

  const metaTitle = catalog.metaTitle || `${catalog.name} | Goals Floors`;
  const metaDesc = catalog.metaDescription || `View or download the official catalog for ${catalog.name} by Goals Floors. High-quality premium architectural surfaces in Gurgaon & Delhi NCR.`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": metaTitle,
    "description": metaDesc,
    "image": catalog.image || "https://goalsfloors.com/icon.png",
    "publisher": {
      "@type": "Organization",
      "name": "Goals Floors",
      "logo": {
        "@type": "ImageObject",
        "url": "https://goalsfloors.com/icon.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://goalsfloors.com/catalogs/${actualSlug}.pdf`
    }
  };

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${metaTitle}</title>
        <meta name="description" content="${metaDesc}">
        ${catalog.seoKeywords ? `<meta name="keywords" content="${catalog.seoKeywords}">` : ''}
        <meta name="robots" content="index, follow">
        <script type="application/ld+json">
          ${JSON.stringify(schema)}
        </script>
        <style>
          body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background: #323639; }
          iframe { width: 100%; height: 100%; border: none; }
        </style>
      </head>
      <body>
        <h1 style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0;">${metaTitle}</h1>
        <iframe src="${catalog.url}" title="${catalog.name}"></iframe>
        <script>
          window.onload = function() {
            // Check if mobile device
            var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            // Only auto-download on mobile where iframe PDF viewing is restricted
            if (isMobile) {
              var a = document.createElement('a');
              // Add Cloudinary attachment flag to force download for cross-origin URLs
              var downloadUrl = "${catalog.url}".replace('/upload/', '/upload/fl_attachment/');
              a.href = downloadUrl;
              a.download = "${actualSlug}.pdf";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }
          };
        </script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
