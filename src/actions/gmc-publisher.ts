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

function extractOfferId(productId: string): string {
  const parts = productId.split(":");
  return parts.slice(3).join(":");
}

function getBestStatus(
  seenOffer: { isApproved: boolean; isDisapproved: boolean }
): string {
  if (seenOffer.isApproved) return "approved";
  if (seenOffer.isDisapproved) return "disapproved";
  return "pending";
}

export type PublisherProduct = {
  offerId: string;
  title: string;
  status: string;
  price?: { value: string; currency: string };
};

export type PublisherStats = {
  total: number;
  approved: number;
  pending: number;
  disapproved: number;
  products: PublisherProduct[];
};

// ─── 1. Publish a product to GMC ──────────────────────────────────────────────
export async function publishToGmc(formData: {
  offerId: string;
  title: string;
  description: string;
  link: string;
  imageLink: string;
  price: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const merchantId = getMerchantId();
    const content = getContentClient();

    await content.products.insert({
      merchantId,
      requestBody: {
        offerId: formData.offerId,
        title: formData.title,
        description: formData.description,
        link: formData.link,
        imageLink: formData.imageLink,
        contentLanguage: "en",
        targetCountry: "IN",
        channel: "online",
        condition: "new",
        availability: "in stock",
        identifierExists: false,          // bypass GTIN/MPN requirement
        customLabel0: CUSTOM_LABEL,       // tag for tracking
        price: {
          value: formData.price,
          currency: "INR",
        },
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("[GMC Publish Error]:", error?.response?.data || error.message || error);
    
    // Extract a more human-readable error if possible
    const apiError = error?.response?.data?.error?.message || 
                     error?.response?.data?.errors?.[0]?.message || 
                     error.message || 
                     "Unknown GMC error";
                     
    return { success: false, error: apiError };
  }
}

// ─── 2. Fetch publisher stats (only admin-panel tagged products) ───────────────
export async function getPublisherStats(): Promise<{
  success: boolean;
  data?: PublisherStats;
  error?: string;
}> {
  try {
    const merchantId = getMerchantId();
    const content = getContentClient();

    // Fetch ALL products (paginated)
    let allProductsRaw: any[] = [];
    let pageToken: string | undefined;
    do {
      const res: any = await content.products.list({
        merchantId,
        pageToken,
        maxResults: 250,
      });
      if (res.data.resources) allProductsRaw.push(...res.data.resources);
      pageToken = res.data.nextPageToken;
    } while (pageToken);

    // Filter: only our tagged products
    const tagged = allProductsRaw.filter(
      (p) => (p.customLabel0 || "") === CUSTOM_LABEL
    );

    // Fetch statuses (paginated)
    let allStatusesRaw: any[] = [];
    let statusPageToken: string | undefined;
    do {
      const res: any = await content.productstatuses.list({
        merchantId,
        pageToken: statusPageToken,
        maxResults: 250,
      });
      if (res.data.resources) allStatusesRaw.push(...res.data.resources);
      statusPageToken = res.data.nextPageToken;
    } while (statusPageToken);

    // Build offerStatus map using approvedCountries (same logic as gmc.ts)
    const offerStatusMap = new Map<string, { isApproved: boolean; isDisapproved: boolean }>();
    allStatusesRaw.forEach((s: any) => {
      const offerId = extractOfferId(s.productId || "");
      if (!offerId) return;
      const current = offerStatusMap.get(offerId) ?? { isApproved: false, isDisapproved: false };
      (s.destinationStatuses || []).forEach((ds: any) => {
        const approved = (ds.approvedCountries || []).map((c: string) => c.toUpperCase());
        const disapproved = (ds.disapprovedCountries || []).map((c: string) => c.toUpperCase());
        if (approved.includes("IN") || approved.includes("INDIA")) current.isApproved = true;
        if ((disapproved.includes("IN") || disapproved.includes("INDIA")) && !current.isApproved)
          current.isDisapproved = true;
      });
      offerStatusMap.set(offerId, current);
    });

    // Deduplicate tagged products by offerId + compute status
    const seenOfferIds = new Set<string>();
    const uniqueTagged: PublisherProduct[] = [];
    for (const p of tagged) {
      if (!p.offerId || seenOfferIds.has(p.offerId)) continue;
      seenOfferIds.add(p.offerId);
      uniqueTagged.push({
        offerId: p.offerId,
        title: p.title,
        price: p.price,
        status: getBestStatus(offerStatusMap.get(p.offerId) ?? { isApproved: false, isDisapproved: false }),
      });
    }

    const data: PublisherStats = {
      total: uniqueTagged.length,
      approved: uniqueTagged.filter((p) => p.status === "approved").length,
      pending: uniqueTagged.filter((p) => p.status === "pending").length,
      disapproved: uniqueTagged.filter((p) => p.status === "disapproved").length,
      products: uniqueTagged,
    };

    console.log(`[Publisher] Total: ${data.total} | Approved: ${data.approved} | Pending: ${data.pending} | Issues: ${data.disapproved}`);
    return { success: true, data };
  } catch (e: any) {
    console.error("[GMC Publisher] Stats error:", e?.response?.data || e.message);
    return { success: false, error: e?.message };
  }
}
