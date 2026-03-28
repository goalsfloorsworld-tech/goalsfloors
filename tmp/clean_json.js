const fs = require('fs');
const path = 'src/data/products.json';

try {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    const cleanedData = data.map(product => {
        const { specifications, ...rest } = product;
        return rest;
    });
    fs.writeFileSync(path, JSON.stringify(cleanedData, null, 2), 'utf8');
    console.log('Successfully removed specifications from all products.');
} catch (err) {
    console.error('Error cleaning JSON:', err);
    process.exit(1);
}
