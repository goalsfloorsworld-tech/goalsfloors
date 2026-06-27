const cheerio = require('cheerio');

async function runSearchBot() {
  const url = 'http://localhost:3000/products';
  console.log(`🤖 Googlebot initialized. Crawling: ${url}\n`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch. Status: ${response.status}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    const metaTitle = $('title').text() || $('meta[property="og:title"]').attr('content') || 'No Title Found';
    const metaDesc = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || 'No Description Found';

    console.log(`\n[META TITLE] ${metaTitle}`);
    console.log(`[META DESC]  ${metaDesc}`);
    console.log('-'.repeat(60) + '\n');

    const targetTags = 'h1, h2, h3, h4, p, th, td, li';

    $(targetTags).each((_, element) => {
      // Exclude elements inside nav, header, or footer
      const isExcluded = $(element).closest('nav, header, footer').length > 0;
      if (isExcluded) return;

      const tagName = element.tagName.toUpperCase();
      const rawText = $(element).text().replace(/\s+/g, ' ').trim();

      if (rawText) {
        console.log(`[${tagName}] ${rawText}`);
      }
    });

  } catch (error) {
    console.error('Crawler Error:', error.message);
  }
}

runSearchBot();
