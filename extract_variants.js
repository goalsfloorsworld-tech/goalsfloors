const fs = require('fs');
const path = require('path');

const productsDir = path.join(__dirname, 'src', 'data', 'products');
const files = fs.readdirSync(productsDir).filter(f => f.endsWith('.json'));

const results = [];

for (const file of files) {
  const filePath = path.join(productsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  try {
    const data = JSON.parse(content);
    if (data.variants && Array.isArray(data.variants)) {
      data.variants.forEach(variant => {
        results.push({
          productName: data.name || file,
          variantName: variant.name || 'Unknown',
          price: variant.priceValue || variant.price || 'N/A',
          currency: variant.currency || 'INR'
        });
      });
    }
  } catch (e) {
    console.error(`Error parsing ${file}:`, e.message);
  }
}

console.table(results);
fs.writeFileSync('variants_summary.json', JSON.stringify(results, null, 2));
console.log(`Extracted ${results.length} variants. Saved to variants_summary.json`);
