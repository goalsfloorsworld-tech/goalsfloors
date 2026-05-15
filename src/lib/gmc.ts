import { google } from "googleapis";
import { getSeoAuth } from "@/lib/seo";


export type GmcProduct = {
  id?: string;
  offerId: string;
  title: string;
  description: string;
  link: string;
  imageLink: string;
  contentLanguage: string;
  targetCountry: string;
  channel: string;
  availability: string;
  condition?: string;
  price: {
    value: string;
    currency: string;
  };
  brand?: string;
  status?: string;
};

function getGmcClient() {
  const auth = getSeoAuth();
  return google.content({ version: "v2.1", auth });
}

function getMerchantId() {
  const id = process.env.GMC_MERCHANT_ID?.trim();
  if (!id) throw new Error("Missing GMC_MERCHANT_ID env variable");
  return id;
}

export async function listGmcProducts(): Promise<GmcProduct[]> {
  const merchantId = getMerchantId();
  const content = getGmcClient();
  
  try {
    // --- Step 1: Fetch ALL raw products (may include duplicates per channel) ---
    let allProductsRaw: any[] = [];
    let pageToken: string | undefined = undefined;
    do {
      const res: any = await content.products.list({ 
        merchantId: merchantId,
        pageToken: pageToken,
        maxResults: 250
      });
      if (res.data.resources) {
        allProductsRaw = [...allProductsRaw, ...res.data.resources];
      }
      pageToken = res.data.nextPageToken;
    } while (pageToken);

    // --- Step 2: Fetch ALL raw product statuses ---
    let allStatusesRaw: any[] = [];
    let statusPageToken: string | undefined = undefined;
    do {
      const statusRes: any = await content.productstatuses.list({
        merchantId: merchantId,
        pageToken: statusPageToken,
        maxResults: 250
      });
      if (statusRes.data.resources) {
        allStatusesRaw = [...allStatusesRaw, ...statusRes.data.resources];
      }
      statusPageToken = statusRes.data.nextPageToken;
    } while (statusPageToken);

    // --- Step 3: Build status map grouped by offerId ---
    // Each product can have multiple entries (Shopping + Free Listings)
    // Key insight from API: use approvedCountries/pendingCountries/disapprovedCountries
    // NOT the top-level `status` field (it can say "disapproved" even when approved in target country)
    const TARGET_COUNTRY = "IN"; // India
    const offerStatusMap = new Map<string, { isApproved: boolean; isDisapproved: boolean }>();

    allStatusesRaw.forEach((s: any) => {
      // productId format: "online:en:INDIA:offerId" or "surfaces-across-google:en:IN:offerId"
      // We need to extract offerId = everything after the 3rd colon
      const parts = (s.productId || "").split(":");
      const offerId = parts.slice(3).join(":");
      if (!offerId) return;

      const current = offerStatusMap.get(offerId) ?? {
        isApproved: false,
        isDisapproved: false,
      };

      const destStatuses: any[] = s.destinationStatuses || [];

      destStatuses.forEach((ds: any) => {
        // Check if target country is in approvedCountries list
        const approved: string[] = (ds.approvedCountries || []).map((c: string) => c.toUpperCase());
        const disapproved: string[] = (ds.disapprovedCountries || []).map((c: string) => c.toUpperCase());
        const pending: string[] = (ds.pendingCountries || []).map((c: string) => c.toUpperCase());

        // India can appear as "IN" or "INDIA" depending on destination
        const isApprovedInIndia = approved.includes("IN") || approved.includes("INDIA");
        const isDisapprovedInIndia = disapproved.includes("IN") || disapproved.includes("INDIA");

        if (isApprovedInIndia) current.isApproved = true;
        if (isDisapprovedInIndia && !current.isApproved) current.isDisapproved = true;
      });

      offerStatusMap.set(offerId, current);
    });

    // Approved in ANY channel/destination = approved overall
    const getBestStatus = (offerId: string): string => {
      const s = offerStatusMap.get(offerId);
      if (!s) return "pending";
      if (s.isApproved) return "approved";
      if (s.isDisapproved) return "disapproved";
      return "pending";
    };

    // --- Step 4: Deduplicate by offerId (keep first occurrence per offerId) ---
    const seenOfferIds = new Set<string>();
    const uniqueProducts: GmcProduct[] = [];

    for (const p of allProductsRaw) {
      const offerId = p.offerId || "";
      if (seenOfferIds.has(offerId)) continue;
      seenOfferIds.add(offerId);
      uniqueProducts.push({ ...p, status: getBestStatus(offerId) });
    }

    console.log(`[GMC] Raw: ${allProductsRaw.length} | Unique (by offerId): ${uniqueProducts.length}`);
    console.log(`[GMC] Approved: ${uniqueProducts.filter(p => p.status === "approved").length}`);
    console.log(`[GMC] Pending: ${uniqueProducts.filter(p => p.status === "pending").length}`);
    console.log(`[GMC] Disapproved: ${uniqueProducts.filter(p => p.status === "disapproved").length}`);

    return uniqueProducts;
  } catch (error: any) {
    console.error("GMC Full Fetch Error:", error.response?.data || error.message);
    throw error;
  }
}

export async function insertGmcProduct(productData: GmcProduct): Promise<GmcProduct> {
  const merchantId = getMerchantId();
  const content = getGmcClient();
  
  const res = await content.products.insert({
    merchantId: merchantId,
    requestBody: {
      offerId: productData.offerId,
      title: productData.title,
      description: productData.description,
      link: productData.link,
      imageLink: productData.imageLink,
      contentLanguage: productData.contentLanguage || "en",
      targetCountry: productData.targetCountry || "IN",
      channel: productData.channel || "online",
      availability: productData.availability || "in stock",
      condition: productData.condition || "new",
      price: {
        value: productData.price.value,
        currency: productData.price.currency || "INR",
      },
      brand: productData.brand,
    },
  });
  return res.data as GmcProduct;
}
