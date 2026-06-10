import fs from 'fs';
import path from 'path';

export function aggregateProductKnowledge(productName: string) {
  const dir = path.join(process.cwd(), 'src', 'data', 'products');
  if (!fs.existsSync(dir)) return null;

  const PRODUCT_MAP: Record<string, string> = {
    "SPC Flooring": "spc-flooring.json",
    "Laminate Flooring": "laminate-flooring.json",
    "Herringbone Flooring": "herringbone-laminate-flooring.json",
    "Hybrid Flooring": "hybrid-laminate-flooring.json",
    "Wall Panels": "wall-panels.json",
    "Cobra PU Stone": "cobra-pu-stone.json",
    "Exterior Louvers": "wpc-exterior-louvers.json",
    "Charcoal Moulding": "tokyo-charcoal-moulding.json",
    "Baffle Ceiling": "wpc-baffle-ceiling.json",
    "WPC Timber Tubes": "wpc-timber-tubes.json",
    "Upfit Panels": "upfit-panels.json"
  };

  const fileName = PRODUCT_MAP[productName];
  if (!fileName) return null;

  const filePath = path.join(dir, fileName);
  if (!fs.existsSync(filePath)) return null;

  let matchedData;
  try {
    matchedData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error("Failed to parse JSON for", productName);
    return null;
  }

  const variants = matchedData.variants || [];
  
  const thicknesses = new Set<string>();
  const prices = new Set<string>();
  const seriesNames = new Set<string>();

  variants.forEach((v: any) => {
    // Extract exact thicknesses/dimensions
    if (v.details?.Thickness) thicknesses.add(v.details.Thickness.trim());
    else if (v.details?.Height) thicknesses.add(v.details.Height.trim());
    
    // Extract exact price and unit
    if (v.price && v.unit) {
      prices.add(`${v.price.trim()} ${v.unit.trim()}`);
    } else if (v.price) {
      prices.add(v.price.trim());
    }
    
    // Extract exact series or variant name
    if (v.details?.Series) {
      seriesNames.add(v.details.Series.trim());
    } else if (v.name) {
      // Clean up names if they contain brackets e.g. "Primo Series (GF-301)" -> "Primo Series"
      const cleanName = v.name.split('(')[0].trim();
      seriesNames.add(cleanName);
    }
  });

  return {
    thickness: Array.from(thicknesses).join(', ') || "Standard",
    price: Array.from(prices).join(', ') || "Varied",
    series: Array.from(seriesNames).join(', ') || "Standard Series"
  };
}
