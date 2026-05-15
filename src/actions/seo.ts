"use server";

import { requestUrlIndexing, inspectUrl } from "@/lib/seo";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function submitUrlForIndexing(url: string) {
  try {
    await requestUrlIndexing(url);
    
    // Store/Update as indexed in Supabase with current timestamp
    await supabase.from("indexed_urls").upsert(
      [{ url, last_requested_at: new Date().toISOString() }], 
      { onConflict: 'url' }
    );
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to submit URL for indexing" };
  }
}

export async function getSitemapData() {
  try {
    const res = await fetch("https://goalsfloors.com/sitemap.xml", { next: { revalidate: 3600 } });
    if (!res.ok) {
      throw new Error(`Failed to fetch sitemap: ${res.statusText}`);
    }
    const xml = await res.text();
    
    const regex = /<loc>(.*?)<\/loc>/g;
    const allUrls: string[] = [];
    let match;
    while ((match = regex.exec(xml)) !== null) {
      allUrls.push(match[1]);
    }

    // Fetch previously indexed URLs from Supabase with timestamps
    const { data: indexedRows } = await supabase.from("indexed_urls").select("url, last_requested_at");
    const indexedMap = new Map((indexedRows || []).map((row) => [row.url, row.last_requested_at]));

    const newUrls: string[] = [];
    const indexedUrls: { url: string; last_requested_at: string }[] = [];

    allUrls.forEach((url) => {
      const lastRequested = indexedMap.get(url);
      if (lastRequested) {
        indexedUrls.push({ url, last_requested_at: lastRequested });
      } else {
        newUrls.push(url);
      }
    });

    return { newUrls, indexedUrls, allUrls };
  } catch (error: any) {
    console.error("CRITICAL: Error fetching sitemap data:", error);
    return { newUrls: [], indexedUrls: [], allUrls: [] };
  }
}

// Temporary fallback for stale clients
export async function fetchSitemapUrls() {
  console.log("Stale client calling fetchSitemapUrls, redirecting to getSitemapData");
  const data = await getSitemapData();
  return data.allUrls;
}

export async function inspectUrlAction(url: string) {
  try {
    const result = await inspectUrl(url);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to inspect URL" };
  }
}
