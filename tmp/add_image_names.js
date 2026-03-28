const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'products.json');

try {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const updatedData = data.map(product => {
    if (product.variants && Array.isArray(product.variants)) {
      product.variants = product.variants.map(variant => {
        if (variant.images && Array.isArray(variant.images)) {
          variant.images = variant.images.map(img => {
            img.name = variant.name; // Use variant name for the image name
            return img;
          });
        }
        return variant;
      });
    }
    return product;
  });

  fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8');
  console.log('Image names added successfully.');
} catch (error) {
  console.error('Update failed:', error);
  process.exit(1);
}
