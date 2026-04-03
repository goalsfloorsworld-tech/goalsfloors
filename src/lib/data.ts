import fs from "fs";
import path from "path";

const productsDir = path.join(process.cwd(), "src/data/products");
const projectsDir = path.join(process.cwd(), "src/data/projects");

export function getAllProducts() {
  if (!fs.existsSync(productsDir)) return [];
  const fileNames = fs.readdirSync(productsDir);
  return fileNames
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => {
      const filePath = path.join(productsDir, fileName);
      const fileContents = fs.readFileSync(filePath, "utf8");
      return JSON.parse(fileContents);
    });
}

export function getProductBySlug(slug: string) {
  try {
    const filePath = path.join(productsDir, `${slug}.json`);
    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch {
    return null;
  }
}

export function getAllProjects() {
  if (!fs.existsSync(projectsDir)) return [];
  const fileNames = fs.readdirSync(projectsDir);
  return fileNames
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => {
      const filePath = path.join(projectsDir, fileName);
      const fileContents = fs.readFileSync(filePath, "utf8");
      return JSON.parse(fileContents);
    });
}

export function getProjectBySlug(slug: string) {
  try {
    const filePath = path.join(projectsDir, `${slug}.json`);
    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch {
    return null;
  }
}
