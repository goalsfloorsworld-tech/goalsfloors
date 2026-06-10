const fs = require('fs');
const path = require('path');

const dir = 'src/data/products';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

let totalReplacements = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Smartly remove "dealer" when it's part of a list with "supplier" or "wholesaler"
  content = content.replace(/(supplier(s)?)(?:\s*,\s*and\s*|\s*,\s*&\s*|\s*and\s*|\s*&\s*|\s*,\s*)dealer(s)?/gi, '$1');
  content = content.replace(/dealer(s)?(?:\s*,\s*and\s*|\s*,\s*&\s*|\s*and\s*|\s*&\s*|\s*,\s*)(supplier(s)?)/gi, '$2');

  content = content.replace(/(wholesaler(s)?)(?:\s*,\s*and\s*|\s*,\s*&\s*|\s*and\s*|\s*&\s*|\s*,\s*)dealer(s)?/gi, '$1');
  content = content.replace(/(manufacturer(s)?)(?:\s*,\s*and\s*|\s*,\s*&\s*|\s*and\s*|\s*&\s*|\s*,\s*)dealer(s)?/gi, '$1');

  // Now replace standalone dealers with suppliers
  content = content.replace(/\bdealers\b/g, 'suppliers');
  content = content.replace(/\bDealers\b/g, 'Suppliers');
  content = content.replace(/\bDEALERS\b/g, 'SUPPLIERS');

  content = content.replace(/\bdealer\b/g, 'supplier');
  content = content.replace(/\bDealer\b/g, 'Supplier');
  content = content.replace(/\bDEALER\b/g, 'SUPPLIER');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalReplacements++;
  }
}
console.log(`Finished checking files. Smartly replaced in ${totalReplacements} files.`);
