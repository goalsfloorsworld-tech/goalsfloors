import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cleanSlug = slug.replace('.pdf', '');

  const catalogsPath = path.join(process.cwd(), 'src', 'data', 'catalogs.json');
  let catalogs = [];
  try {
    catalogs = JSON.parse(fs.readFileSync(catalogsPath, 'utf8'));
  } catch (error) {
    console.error("Error reading catalogs.json", error);
  }

  const catalog = catalogs.find((c: any) => c.slug === cleanSlug);

  if (!catalog) {
    return new NextResponse("Catalog not found", { status: 404 });
  }

  const metaTitle = catalog.metaTitle || `${catalog.name} | Goals Floors`;
  const metaDesc = catalog.metaDescription || `View or download the official catalog for ${catalog.name} by Goals Floors. High-quality premium architectural surfaces in Gurgaon & Delhi NCR.`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${metaTitle}</title>
        <meta name="description" content="${metaDesc}">
        ${catalog.seoKeywords ? `<meta name="keywords" content="${catalog.seoKeywords}">` : ''}
        <link rel="icon" href="/icon.png">
        <meta name="robots" content="index, follow">
        <style>
          body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background: #323639; }
        </style>
      </head>
      <body>
        <h1 style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0;">${metaTitle}</h1>
        <iframe src="${catalog.url}" style="width: 100vw; height: 100vh; border: none; margin: 0; padding: 0; overflow: hidden;" title="${catalog.name}"></iframe>
        <script>
          setTimeout(function() {
            var url = "${catalog.url}";
            var downloadUrl = url;
            
            // Format URL for forced download based on the source
            if (url.includes('/api/pdf')) {
              downloadUrl = url + "&action=download";
            } else if (url.includes('cloudinary.com')) {
              downloadUrl = url.replace('/upload/', '/upload/fl_attachment/');
            }
            
            // Create an invisible link and click it
            var a = document.createElement('a');
            a.href = downloadUrl;
            a.style.display = 'none';
            // Use the matched slug for a clean fallback filename
            a.download = "${cleanSlug}.pdf"; 
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }, 1000);
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
