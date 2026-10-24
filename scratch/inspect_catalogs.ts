import { inspectUrl } from '../src/lib/seo';
   
async function main() {
  const urls = [
    'https://goalsfloors.com/catalogs/upfit-panels.pdf',
    'https://goalsfloors.com/catalogs/upfit-panels',
    'https://goalsfloors.com/catalogs/primo-series.pdf',
    'https://goalsfloors.com/catalogs/primo-series',
    'https://goalsfloors.com/catalogs'
  ];

  for (const url of urls) {
    console.log(`\n=================== ${url} ===================`);
    try {
      const res = await inspectUrl(url);
      console.log('Verdict:', res?.indexStatusResult?.verdict);
      console.log('Coverage State:', res?.indexStatusResult?.coverageState);
      console.log('Robots Txt State:', res?.indexStatusResult?.robotsTxtState);
      console.log('Indexing State:', res?.indexStatusResult?.indexingState);
      console.log('Last Crawl Time:', res?.indexStatusResult?.lastCrawlTime);
      console.log('Page Fetch State:', res?.indexStatusResult?.pageFetchState);
      console.log('User Canonical:', res?.indexStatusResult?.userCanonical);
      console.log('Google Canonical:', res?.indexStatusResult?.googleCanonical);
      console.log('Referring URLs:', res?.indexStatusResult?.referringUrls);
    } catch (err: any) {
      console.error('Error:', err.message);
    }
  }
}

main();
