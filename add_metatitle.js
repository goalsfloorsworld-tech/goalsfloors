const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'data', 'products');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (data.metatitle === undefined) {
    // Reconstruct object to put metatitle right after title
    const newData = {};
    for (const key in data) {
      newData[key] = data[key];
      if (key === 'title') {
        newData.metatitle = "";
      }
    }
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf8');
    console.log(`Updated ${file}`);
  }
});
