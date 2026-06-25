/**
 * Schema Analyzer — generates a clean readable report file
 * Usage: node schema-analyze.js
 * Output: schema-summary.txt
 */

const http = require('http');
const fs = require('fs');

const url = process.argv[2] || 'http://localhost:3000/products/wall-panels';
const outputFile = 'schema-summary.txt';

http.get(url, { headers: { 'User-Agent': 'SchemaChecker/1.0 (like Googlebot)' } }, (res) => {
  let html = '';
  res.on('data', (d) => (html += d));
  res.on('end', () => {
    // Extract all JSON-LD blocks
    const re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
    const schemas = [];
    let m;
    while ((m = re.exec(html)) !== null) {
      try {
        schemas.push(JSON.parse(m[1].trim()));
      } catch (e) {
        schemas.push({ __err: true, raw: m[1].trim().slice(0, 100) });
      }
    }

    const lines = [];
    const sep = '='.repeat(65);
    const dash = '-'.repeat(65);

    lines.push(sep);
    lines.push('  GOALSFLOORS.COM — SCHEMA ANALYSIS REPORT');
    lines.push(sep);
    lines.push('  URL   : ' + url);
    lines.push('  Date  : ' + new Date().toLocaleString('en-IN'));
    lines.push('  Total schemas found on page: ' + schemas.length);
    lines.push(sep);
    lines.push('');

    schemas.forEach((s, idx) => {
      const type = s['@type'] || 'Unknown';
      lines.push(dash);
      lines.push('  Schema #' + (idx + 1) + '  |  @type = ' + type);
      lines.push(dash);

      if (s.__err) {
        lines.push('  STATUS  : ERROR - JSON parse failed');
        lines.push('  RAW     : ' + s.raw);
        lines.push('');
        return;
      }

      if (type === 'FAQPage') {
        const qs = s.mainEntity || [];
        lines.push('  STATUS      : OK');
        lines.push('  Questions   : ' + qs.length);
        qs.slice(0, 5).forEach((q, i) => {
          lines.push('  Q' + (i + 1) + '         : ' + (q.name || '').slice(0, 80));
          const ans = (q.acceptedAnswer && q.acceptedAnswer.text) || '';
          lines.push('  A' + (i + 1) + '         : ' + ans.slice(0, 80) + (ans.length > 80 ? '...' : ''));
        });
      }

      else if (type === 'ProductGroup') {
        const v = s.hasVariant || [];
        lines.push('  STATUS        : OK');
        lines.push('  name          : ' + (s.name || 'MISSING'));
        lines.push('  productGroupID: ' + (s.productGroupID || 'MISSING'));
        lines.push('  brand         : ' + ((s.brand && s.brand.name) || 'MISSING'));
        lines.push('  variesBy      : ' + (s.variesBy || 'MISSING'));
        lines.push('  description   : ' + (s.description || '').slice(0, 90) + '...');
        lines.push('  hasVariant    : ' + v.length + ' variants');
        lines.push('  additionalProp: ' + ((s.additionalProperty || []).length) + ' specs');

        if (v[0]) {
          lines.push('');
          lines.push('  [First Variant Sample]');
          lines.push('  name          : ' + (v[0].name || 'MISSING'));
          lines.push('  sku           : ' + (v[0].sku || 'MISSING'));
          lines.push('  mpn           : ' + (v[0].mpn || 'MISSING'));
          lines.push('  brand         : ' + ((v[0].brand && v[0].brand.name) || 'MISSING'));
          lines.push('  price         : ' + ((v[0].offers && v[0].offers.price) || 'MISSING') + ' INR');
          lines.push('  priceCurrency : ' + ((v[0].offers && v[0].offers.priceCurrency) || 'MISSING'));
          lines.push('  availability  : ' + ((v[0].offers && v[0].offers.availability) || 'MISSING').replace('https://schema.org/', ''));
          lines.push('  itemCondition : ' + ((v[0].offers && v[0].offers.itemCondition) || 'MISSING').replace('https://schema.org/', ''));
          lines.push('  seller        : ' + ((v[0].offers && v[0].offers.seller && v[0].offers.seller.name) || 'MISSING'));
          lines.push('  images        : ' + ((v[0].image || []).length) + ' images');
          lines.push('  specs         : ' + ((v[0].additionalProperty || []).length));
          (v[0].additionalProperty || []).forEach((p) => {
            lines.push('    - ' + p.name + ': ' + p.value);
          });
        }

        if (v.length > 1) {
          lines.push('');
          lines.push('  [All Variant Names]');
          v.forEach((variant, i) => {
            lines.push('  [' + (i + 1) + '] ' + (variant.name || 'Unknown') + '  |  SKU: ' + (variant.sku || '-') + '  |  Price: ' + ((variant.offers && variant.offers.price) || '-') + ' INR');
          });
        }
      }

      else if (type === 'BreadcrumbList') {
        const items = s.itemListElement || [];
        lines.push('  STATUS        : OK');
        lines.push('  items count   : ' + items.length);
        items.forEach((it, i) => {
          lines.push('  item[' + (i + 1) + ']       : ' + it.name + ' → ' + (it.item || '(no URL - last item)'));
        });
      }

      else if (type === 'Organization' || type === 'LocalBusiness') {
        lines.push('  STATUS        : OK');
        lines.push('  name          : ' + (s.name || 'MISSING'));
        lines.push('  url           : ' + (s.url || 'MISSING'));
        lines.push('  logo          : ' + (s.logo || 'MISSING'));
        const cp = s.contactPoint || {};
        lines.push('  phone         : ' + (cp.telephone || 'MISSING'));
        lines.push('  areaServed    : ' + (cp.areaServed || 'MISSING'));
        lines.push('  language      : ' + (Array.isArray(cp.availableLanguage) ? cp.availableLanguage.join(', ') : (cp.availableLanguage || 'MISSING')));
      }

      else if (type === 'Article') {
        lines.push('  STATUS        : OK');
        lines.push('  headline      : ' + (s.headline || 'MISSING'));
        lines.push('  description   : ' + (s.description || 'MISSING').slice(0, 80) + '...');
        lines.push('  datePublished : ' + (s.datePublished || 'MISSING'));
        lines.push('  author        : ' + (s.author && s.author.name || 'MISSING'));
        lines.push('  publisher     : ' + (s.publisher && s.publisher.name || 'MISSING'));
        lines.push('  image         : ' + (s.image ? (Array.isArray(s.image) ? s.image.join(', ') : s.image) : 'MISSING'));
      }

      else {
        lines.push('  STATUS        : OK (unrecognized type — manual check needed)');
        lines.push('  raw keys      : ' + Object.keys(s).join(', '));
      }

      lines.push('');
    });

    // ── Coverage Summary ──
    const types = schemas.filter((s) => !s.__err).map((s) => s['@type'] || '');
    const checks = {
      'Article'       : types.includes('Article'),
      'FAQPage'       : types.includes('FAQPage'),
      'ProductGroup'  : types.includes('ProductGroup') || types.includes('Product'),
      'BreadcrumbList': types.includes('BreadcrumbList'),
      'Organization'  : types.includes('Organization') || types.includes('LocalBusiness'),
    };

    lines.push(sep);
    lines.push('  COVERAGE SUMMARY');
    lines.push(sep);
    Object.entries(checks).forEach(([name, ok]) => {
      lines.push('  ' + (ok ? '[OK]     ' : '[MISSING]') + ' ' + name);
    });
    lines.push('');

    const allOk = Object.values(checks).every(Boolean);
    lines.push('  RESULT: ' + (allOk ? 'ALL SCHEMAS PRESENT — READY FOR GOOGLE RICH RESULTS!' : 'SOME SCHEMAS MISSING — SEE ABOVE'));
    lines.push(sep);
    lines.push('');
    lines.push('  Next step: https://search.google.com/test/rich-results');
    lines.push(sep);

    const output = lines.join('\n');

    fs.writeFileSync(outputFile, output, 'utf8');
    console.log(output);
    console.log('\nReport saved to: ' + outputFile);
  });
}).on('error', (e) => {
  console.error('Fetch ERROR:', e.message);
  console.error('Kya dev server chal raha hai? (npm run dev)');
  process.exit(1);
});
