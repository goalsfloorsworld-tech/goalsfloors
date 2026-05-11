import { getAllProducts } from '@/lib/data';

function escapeXml(unsafe: string | null | undefined) {
  if (!unsafe) return '';
  return String(unsafe).replace(/[<>&'"]/g, function (c) {
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
  const standardProducts = getAllProducts();
  const domain = 'https://goalsfloors.com';

  let xmlItems = '';

  // Process Standard Products
  standardProducts.forEach((product: any) => {
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((variant: any, vIdx: number) => {
        // ONE variant = ONE Merchant Center product
        const variantImages = variant.images && variant.images.length > 0 ? variant.images : [];
        const productImages = product.images && product.images.length > 0 ? product.images : [];
        const allImages = [...variantImages, ...productImages].map((img: any) => img.url).filter(Boolean);
        const uniqueImages = Array.from(new Set(allImages));
        
        if (uniqueImages.length === 0) return; // Skip if no image

        const mainImage = uniqueImages[0] as string;
        const additionalImages = uniqueImages.slice(1, 10).map((url) => `\n      <g:additional_image_link>${escapeXml(url as string)}</g:additional_image_link>`).join('');

        // Improve Title safely
        const safeProductType = product.shortTitle || product.title || '';
        const useCasePart = product.applications && product.applications.length > 0 
          ? ` for ${product.applications[0].replace(/designs/i, 'Design').replace(/walls/i, 'Wall')}`
          : '';
        
        let title = variant.name || safeProductType;
        if (variant.name && !variant.name.toLowerCase().includes(safeProductType.toLowerCase())) {
          title = `${variant.name} ${safeProductType}`;
        }
        title = `${title}${useCasePart}`.trim().substring(0, 140);

        const pSlug = product.slug || product.id || '';
        const id = `${pSlug}-opt-${vIdx}`;
        // Merchant Center feed links should point to stable canonical product URLs ONLY
        const link = `${domain}/products/${pSlug}`;
        
        const priceValue = variant.priceValue || 0;
        const currency = variant.currency || 'INR';
        const brand = variant.brand || 'Goals Floors';

        xmlItems += `
    <item>
      <g:id>${escapeXml(id)}</g:id>
      <g:item_group_id>${escapeXml(pSlug)}</g:item_group_id>
      <g:title>${escapeXml(title)}</g:title>
      <g:description>${escapeXml(product.shortDescription || title)}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(mainImage)}</g:image_link>${additionalImages}
      <g:price>${priceValue} ${currency}</g:price>
      <g:availability>${escapeXml(variant.availability || 'in_stock')}</g:availability>
      <g:condition>${escapeXml(variant.condition || 'new')}</g:condition>
      <g:brand>${escapeXml(brand)}</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
    </item>`;
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
