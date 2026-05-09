import fs from 'fs';
import path from 'path';

export function getMultiverseData(category: string, variant: string) {
  // Finds the path to the specific JSON file dynamically
  const filePath = path.join(process.cwd(), 'src', 'data', 'multiverse', category, `${variant}.json`);
  
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading data for ${category}/${variant}:`, error);
    return null;
  }
}

export function getAllMultiverseItems() {
  const dataDir = path.join(process.cwd(), 'src', 'data', 'multiverse');
  const items: any[] = [];

  try {
    const categories = fs.readdirSync(dataDir);
    categories.forEach(category => {
      const categoryPath = path.join(dataDir, category);
      if (fs.statSync(categoryPath).isDirectory()) {
        const variants = fs.readdirSync(categoryPath);
        variants.forEach(variantFile => {
          if (variantFile.endsWith('.json')) {
            const variant = variantFile.replace('.json', '');
            const data = getMultiverseData(category, variant);
            if (data) {
              items.push({
                ...data,
                categorySlug: category,
                variantSlug: variant,
                url: `/multiverse/${category}/${variant}`
              });
            }
          }
        });
      }
    });
    return items;
  } catch (error) {
    console.error('Error reading multiverse directory:', error);
    return [];
  }
}
