import { getAllProducts } from '@/lib/data';

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export async function GET() {
  const products = getAllProducts();
  const domain = 'https://goalsfloors.com';

  let xmlItems = '';

  products.forEach((product: any) => {
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((variant: any) => {
        // Iterate through variant images if available, else fallback
        const imagesToIterate = variant.images && variant.images.length > 0
          ? variant.images
          : product.images && product.images.length > 0
            ? [{ url: product.images[0].url }]
            : [];

        imagesToIterate.forEach((imageObj: { url: string }, index: number) => {
          const variantNameSafe = variant.name.replace(/\s+/g, '-').toLowerCase();
          const id = `${variantNameSafe}-opt-${index}`;
          const title = `${product.shortTitle} - ${variant.name} (Option ${index + 1})`;
          const description = product.shortDescription;
          const link = `${domain}/products/${product.slug}`;
          const imageLink = imageObj.url;
          const priceValue = variant.priceValue || 0;
          const currency = variant.currency || 'INR';
          const availability = variant.availability || 'in_stock';
          const condition = variant.condition || 'new';
          const brand = variant.brand || 'Goals Floors';

          xmlItems += `
    <item>
      <g:id>${escapeXml(id)}</g:id>
      <g:title>${escapeXml(title)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(imageLink)}</g:image_link>
      <g:price>${priceValue} ${currency}</g:price>
      <g:availability>${escapeXml(availability)}</g:availability>
      <g:condition>${escapeXml(condition)}</g:condition>
      <g:brand>${escapeXml(brand)}</g:brand>
    </item>`;
        });
      });
    }
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Goals Floors Feed</title>
    <link>${domain}</link>
    <description>Goals Floors Products Feed</description>${xmlItems}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
