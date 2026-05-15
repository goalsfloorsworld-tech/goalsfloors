import { google } from "googleapis";

// Helper to assert env vars
const requireEnv = (name: string) => {
  const val = process.env[name];
  if (!val) throw new Error(`Missing ${name}`);
  return val;
};

export function getSeoAuth() {
  const clientId = requireEnv("GOOGLE_CLIENT_ID");
  const clientSecret = requireEnv("GOOGLE_CLIENT_SECRET");
  const refreshToken = requireEnv("GOOGLE_REFRESH_TOKEN");

  const client = new google.auth.OAuth2(clientId, clientSecret);
  client.setCredentials({ refresh_token: refreshToken });
  return client;
}

export type QueryRow = {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export async function getTopQueries(startDate: string, endDate: string): Promise<QueryRow[]> {
  const auth = getSeoAuth();
  const searchconsole = google.searchconsole({ version: "v1", auth });
  const siteUrl = requireEnv("GSC_SITE_URL");

  const res = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["query"],
      rowLimit: 50,
      type: "web",
    },
  });

  return (res.data.rows as QueryRow[]) || [];
}

export async function getTopImageQueries(startDate: string, endDate: string): Promise<QueryRow[]> {
  const auth = getSeoAuth();
  const searchconsole = google.searchconsole({ version: "v1", auth });
  const siteUrl = requireEnv("GSC_SITE_URL");

  try {
    const res = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["query"],
        rowLimit: 50,
        type: "IMAGE",
      },
    });

    return (res.data.rows as QueryRow[]) || [];
  } catch (error: any) {
    console.error("Error fetching image queries:", error.message);
    return [];
  }
}

export async function getStrikingDistanceQueries(startDate: string, endDate: string): Promise<QueryRow[]> {
  const auth = getSeoAuth();
  const searchconsole = google.searchconsole({ version: "v1", auth });
  const siteUrl = requireEnv("GSC_SITE_URL");

  const res = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["query"],
      rowLimit: 200, // Fetch more to filter down
      type: "web",
    },
  });

  const rows = (res.data.rows as QueryRow[]) || [];
  
  // Filter for striking distance (position between 10.1 and 20.0)
  return rows.filter((row) => row.position > 10.0 && row.position <= 20.0).slice(0, 50);
}

export async function requestUrlIndexing(url: string) {
  const auth = getSeoAuth();
  const indexing = google.indexing({ version: "v3", auth });

  try {
    const res = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: "URL_UPDATED",
      },
    });
    return res.data;
  } catch (error: any) {
    if (error.code === 429 || error.status === 429) {
      throw new Error("Daily quota of 200 URLs exceeded.");
    }
    throw new Error(`Indexing request failed: ${error.message || "Unknown error"}`);
  }
}

export async function getSitemapHealth() {
  const auth = getSeoAuth();
  const searchconsole = google.searchconsole({ version: "v1", auth });
  const siteUrl = requireEnv("GSC_SITE_URL");

  try {
    const res = await searchconsole.sitemaps.list({ siteUrl });
    return res.data.sitemap || [];
  } catch (error: any) {
    console.error("Error fetching sitemap health:", error.message);
    return [];
  }
}

export async function inspectUrl(url: string) {
  const auth = getSeoAuth();
  const searchconsole = google.searchconsole({ version: "v1", auth });
  const siteUrl = requireEnv("GSC_SITE_URL");

  try {
    const res = await searchconsole.urlInspection.index.inspect({
      requestBody: {
        inspectionUrl: url,
        siteUrl,
        languageCode: "en-US",
      },
    });
    return res.data.inspectionResult;
  } catch (error: any) {
    console.error("Error inspecting URL:", error.message);
    throw new Error(error.message || "Failed to inspect URL.");
  }
}
