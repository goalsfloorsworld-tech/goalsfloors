"use server";

import { listGmcProducts, insertGmcProduct, type GmcProduct } from "@/lib/gmc";

export async function fetchGmcProducts(): Promise<{ success: boolean; products?: GmcProduct[]; error?: string }> {
  try {
    const products = await listGmcProducts();
    return { success: true, products };
  } catch (error: any) {
    console.error("Failed to fetch GMC products:", error);
    return { success: false, error: error.message || "Unknown error" };
  }
}

export async function addProductToGmc(
  formData: GmcProduct
): Promise<{ success: boolean; product?: GmcProduct; error?: string }> {
  try {
    const product = await insertGmcProduct(formData);
    return { success: true, product };
  } catch (error: any) {
    console.error("Failed to add GMC product:", error);
    return { success: false, error: error.message || "Unknown error" };
  }
}
