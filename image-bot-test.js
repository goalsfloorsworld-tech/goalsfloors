const cheerio = require('cheerio');

async function runImageBot() {
  const url = 'http://localhost:3000/products/upfit-panels';
  console.log(`📸 Google Image Crawler initialized.\nCrawling: ${url}\n`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch. Status: ${response.status}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    
    let totalImages = 0;
    let missingAlt = 0;

    $('img').each((_, element) => {
      // Get attributes
      const src = $(element).attr('src');
      const alt = $(element).attr('alt');
      const loading = $(element).attr('loading') || 'eager (default)';
      
      // We skip base64/data images as they are usually small placeholders
      if (src && !src.startsWith('data:image')) {
        totalImages++;
        
        const hasAlt = alt && alt.trim() !== '';
        if (!hasAlt) {
          missingAlt++;
        }
        
        console.log(`[IMAGE ${totalImages}]`);
        console.log(`  SRC: ${src}`);
        console.log(`  ALT: ${hasAlt ? `"${alt}"` : '❌ MISSING ALT TEXT'}`);
        console.log(`  LOADING: ${loading}`);
        console.log('----------------------------------------------------');
      }
    });

    console.log(`\n📊 SEO Image Crawl Summary for Googlebot:`);
    console.log(`Total Valid Images Found: ${totalImages}`);
    console.log(`Images Missing Alt Text: ${missingAlt}`);
    
    if (missingAlt > 0) {
      console.log(`\n⚠️ Warning: ${missingAlt} images are missing 'alt' text. Googlebot cannot understand images without alt text!`);
    } else {
      console.log(`\n✅ Perfect! All images have descriptive 'alt' text for SEO and Accessibility.`);
    }

  } catch (error) {
    console.error('Crawler Error:', error.message);
  }
}

runImageBot();
