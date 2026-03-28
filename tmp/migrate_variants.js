const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'products.json');

try {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const updatedData = data.map(product => {
    if (product.variants && Array.isArray(product.variants)) {
      product.variants = product.variants.map(variant => {
        if (variant.imageUrl) {
          variant.images = [
            {
              url: variant.imageUrl,
              alt: variant.imageAlt || ""
            }
          ];
          delete variant.imageUrl;
          delete variant.imageAlt;
        }
        return variant;
      });
    }
    return product;
  });

  fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8');
  console.log('Migration completed successfully.');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
