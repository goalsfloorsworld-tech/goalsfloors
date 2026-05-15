"use server";

import { google } from "googleapis";
import { getSeoAuth } from "@/lib/seo";

const CUSTOM_LABEL = "admin-panel";

function getMerchantId() {
  const id = process.env.GMC_MERCHANT_ID?.trim();
  if (!id) throw new Error("Missing GMC_MERCHANT_ID env variable");
  return id;
}

function getContentClient() {
  const auth = getSeoAuth();
  return google.content({ version: "v2.1", auth });
}

/**
 * Fetch products tagged with 'admin-panel' along with their statuses
 */
export async function getAdminPublishedProducts() {
  try {
    const merchantId = getMerchantId();
    const content = getContentClient();

    // 1. Fetch products
    let allProducts: any[] = [];
    let pageToken: string | undefined;
    do {
      const res: any = await content.products.list({ merchantId, pageToken, maxResults: 250 });
      if (res.data.resources) allProducts.push(...res.data.resources);
      pageToken = res.data.nextPageToken;
    } while (pageToken);

    // Filter by custom label
    const taggedProducts = allProducts.filter(p => p.customLabel0 === CUSTOM_LABEL);

    // 2. Fetch statuses
    let allStatuses: any[] = [];
    let sPageToken: string | undefined;
    do {
      const res: any = await content.productstatuses.list({ merchantId, pageToken: sPageToken, maxResults: 250 });
      if (res.data.resources) allStatuses.push(...res.data.resources);
      sPageToken = res.data.nextPageToken;
    } while (sPageToken);

    const statusMap = new Map(allStatuses.map(s => [s.productId, s]));

    return {
      success: true,
      products: taggedProducts.map(p => ({
        ...p,
        statusInfo: statusMap.get(p.id!) || null
      }))
    };
  } catch (e: any) {
    console.error("[GMC Manage] Fetch error:", e.message);
    return { success: false, error: e.message };
  }
}

/**
 * Delete a product from GMC
 */
export async function deleteGmcProduct(productId: string) {
  try {
    const merchantId = getMerchantId();
    const content = getContentClient();
    await content.products.delete({ merchantId, productId });
    return { success: true };
  } catch (e: any) {
    console.error("[GMC Manage] Delete error:", e.message);
    return { success: false, error: e.message };
  }
}

/**
 * Update/Overwrite a product in GMC
 */
export async function updateGmcProduct(productData: any) {
  try {
    const merchantId = getMerchantId();
    const content = getContentClient();
    
    await content.products.insert({
      merchantId,
      requestBody: {
        ...productData,
        customLabel0: CUSTOM_LABEL,
        identifierExists: false,
      }
    });
    return { success: true };
  } catch (e: any) {
    console.error("[GMC Manage] Update error:", e.message);
    return { success: false, error: e.message };
  }
}
