/**
 * Schema Checker Script
 * Usage: node check-schema.js [url]
 * Default: http://localhost:3000/products/wall-panels
 */

const url = process.argv[2] || 'http://localhost:3000/products/wall-panels';

async function checkSchema(pageUrl) {
  console.log('\n' + '═'.repeat(60));
  console.log(`🔍 Schema Checker`);
  console.log('═'.repeat(60));
  console.log(`📄 URL: ${pageUrl}`);
  console.log('═'.repeat(60) + '\n');

  let html;
  try {
    const res = await fetch(pageUrl, {
      headers: { 'User-Agent': 'SchemaChecker/1.0 (like Googlebot)' }
    });

    if (!res.ok) {
      console.error(`❌ HTTP Error: ${res.status} ${res.statusText}`);
      process.exit(1);
    }
    html = await res.text();
    console.log(`✅ Page fetched successfully (${(html.length / 1024).toFixed(1)} KB)\n`);
  } catch (err) {
    console.error(`❌ Fetch failed: ${err.message}`);
    console.error(`   → Kya dev server chal raha hai? (npm run dev)`);
    process.exit(1);
  }

  // ── Extract all JSON-LD script tags ──
  const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const schemas = [];
  let match;

  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim());
      schemas.push(parsed);
    } catch (e) {
      schemas.push({ __parseError: true, raw: match[1].trim().slice(0, 200) });
    }
  }

  // ── Summary ──
  console.log(`📦 Found ${schemas.length} JSON-LD block(s) on this page\n`);

  if (schemas.length === 0) {
    console.log('⚠️  Koi bhi JSON-LD schema nahi mila!');
    console.log('   → Yeh bahut buri baat hai SEO ke liye.\n');
    printMissingSchemas('wall-panels');
    return;
  }

  // ── Print each schema ──
  const foundTypes = [];

  schemas.forEach((schema, idx) => {
    const type = Array.isArray(schema['@type']) ? schema['@type'].join(', ') : (schema['@type'] || 'Unknown');
    foundTypes.push(type);

    console.log('─'.repeat(60));
    console.log(`📌 Schema #${idx + 1}: @type = "${type}"`);
    console.log('─'.repeat(60));

    if (schema.__parseError) {
      console.log(`❌ JSON Parse Error! Raw:\n${schema.raw}`);
    } else {
      analyzeSchema(schema, type);
      console.log('\n📋 Full JSON:');
      console.log(JSON.stringify(schema, null, 2));
    }
    console.log('');
  });

  // ── Missing Schema Report ──
  printMissingReport(foundTypes);
}

function analyzeSchema(schema, type) {
  const checks = [];

  if (type === 'Product') {
    checks.push(check('name', schema.name));
    checks.push(check('description', schema.description));
    checks.push(check('brand', schema.brand?.name));
    checks.push(check('offers / price', schema.offers?.price || schema.offers?.lowPrice));
    checks.push(check('offers / availability', schema.offers?.availability));
    checks.push(check('aggregateRating', schema.aggregateRating?.ratingValue));
    checks.push(check('image', schema.image || (Array.isArray(schema.image) && schema.image.length > 0)));
  }

  else if (type === 'BreadcrumbList') {
    const items = schema.itemListElement || [];
    checks.push(check('itemListElement count', items.length > 0 ? `${items.length} items` : null));
    items.forEach((item, i) => {
      checks.push(check(`  item[${i+1}] name`, item.name));
      checks.push(check(`  item[${i+1}] item (url)`, item.item));
    });
  }

  else if (type === 'FAQPage') {
    const qs = schema.mainEntity || [];
    checks.push(check('mainEntity count', qs.length > 0 ? `${qs.length} questions` : null));
    qs.slice(0, 3).forEach((q, i) => {
      checks.push(check(`  Q${i+1}`, q.name));
      checks.push(check(`  A${i+1}`, q.acceptedAnswer?.text));
    });
  }

  else if (type === 'ProductGroup') {
    checks.push(check('name', schema.name));
    checks.push(check('description', schema.description));
    checks.push(check('productGroupID', schema.productGroupID));
    checks.push(check('brand', schema.brand?.name));
    checks.push(check('variesBy', schema.variesBy));
    const variants = schema.hasVariant || [];
    checks.push(check('hasVariant count', variants.length > 0 ? `${variants.length} variants` : null));
    if (variants.length > 0) {
      const first = variants[0];
      checks.push(check('  variant[0] name', first.name));
      checks.push(check('  variant[0] sku', first.sku));
      checks.push(check('  variant[0] mpn', first.mpn));
      checks.push(check('  variant[0] price', first.offers?.price));
      checks.push(check('  variant[0] image count', first.image?.length > 0 ? `${first.image.length} images` : null));
      checks.push(check('  variant[0] brand', first.brand?.name));
      checks.push(check('  variant[0] additionalProp', first.additionalProperty?.length > 0 ? `${first.additionalProperty.length} specs` : null));
    }
  }

  else if (type === 'Organization' || type === 'LocalBusiness') {
    checks.push(check('name', schema.name));
    checks.push(check('url', schema.url));
    checks.push(check('logo', schema.logo));
    checks.push(check('telephone', schema.telephone));
    checks.push(check('address', schema.address?.addressLocality));
    if (type === 'LocalBusiness') {
      checks.push(check('geo', schema.geo?.latitude));
      checks.push(check('openingHours', schema.openingHoursSpecification));
    }
  }

  else if (type === 'Article' || type === 'BlogPosting') {
    checks.push(check('headline', schema.headline));
    checks.push(check('author', schema.author?.name));
    checks.push(check('datePublished', schema.datePublished));
    checks.push(check('image', schema.image));
    checks.push(check('publisher', schema.publisher?.name));
  }

  if (checks.length > 0) {
    console.log('\n🔎 Field Analysis:');
    checks.forEach(c => console.log(c));
  }
}

function check(label, value) {
  const padded = label.padEnd(30, ' ');
  if (value === null || value === undefined || value === false || value === '') {
    return `  ❌ ${padded} → MISSING`;
  }
  const display = typeof value === 'object' ? JSON.stringify(value).slice(0, 60) : String(value).slice(0, 60);
  return `  ✅ ${padded} → ${display}`;
}

function printMissingReport(foundTypes) {
  const required = {
    'ProductGroup':    '✅ PRESENT (Google Shopping free listing supported)',
    'FAQPage':         '❌ MISSING — "People Also Ask" box miss ho raha hai',
    'BreadcrumbList':  '❌ MISSING — Breadcrumb SERP mein nahi dikhega',
    'Organization':    '⚠️  MISSING — Brand identity weak rahegi',
  };

  // Consider ProductGroup as covering Product requirement
  const hasProduct = foundTypes.includes('Product') || foundTypes.includes('ProductGroup');
  const missing = Object.entries(required).filter(([type, msg]) => {
    if (msg.startsWith('✅')) return false; // skip positive entries from missing list
    if (type === 'Product' && hasProduct) return false;
    return !foundTypes.includes(type);
  });

  console.log('\n' + '═'.repeat(60));
  console.log('📊 Schema Coverage Report');
  console.log('═'.repeat(60));

  foundTypes.forEach(t => console.log(`  ✅ ${t}`));
  if (hasProduct) console.log(`  ✅ Product coverage  → via ProductGroup/Product`);
  missing.forEach(([t, msg]) => console.log(`  ${msg.split('—')[0].trim()} ${t} — ${msg.split('—')[1]?.trim()}`));

  if (missing.length === 0) {
    console.log('\n🎉 Sabhi required schemas present hain!');
  } else {
    console.log(`\n⚠️  ${missing.length} schema(s) missing — SEO improvement possible hai`);
  }

  console.log('\n💡 Google Rich Results Test:');
  console.log('   https://search.google.com/test/rich-results');
  console.log('═'.repeat(60) + '\n');
}

function printMissingSchemas(slug) {
  console.log('📋 Is page pe yeh schemas hone chahiye:');
  console.log('   1. Product  (prices, rating → rich snippets)');
  console.log('   2. BreadcrumbList  (Home > Products > Wall Panels)');
  console.log('   3. FAQPage  (People Also Ask box)');
  console.log('');
}

checkSchema(url);
