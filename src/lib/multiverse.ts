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
