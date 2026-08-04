import { google } from 'googleapis';
import type { OAuth2Client } from 'google-auth-library';

export type CoreMetrics = {
  totalUsers: number;
  sessions: number;
  pageviews: number;
};

export type TrafficSourceRow = {
  source: string;
  totalUsers: number;
  sessions: number;
  pageviews: number;
};

export type TopPageRow = {
  pagePath: string;
  pageviews: number;
  totalUsers: number;
};

export type DailyGraphRow = {
  date: string; // YYYYMMDD from GA4
  pageviews: number;
  totalUsers: number;
  avgTime: number; // seconds
};

export type SearchConsoleMetrics = {
  clicks: number;
  impressions: number;
  ctr: number;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name} in environment`);
  }
  return value;
}

function toNumber(value: string | number | null | undefined): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') return Number(value);
  return 0;
}

export function getGoogleAuth() {
  const clientEmail = requireEnv("GOOGLE_CLIENT_EMAIL");
  let rawKey = requireEnv("GOOGLE_PRIVATE_KEY").trim();

  // Strip wrapping quotes if present
  if ((rawKey.startsWith('"') && rawKey.endsWith('"')) || (rawKey.startsWith("'") && rawKey.endsWith("'"))) {
    rawKey = rawKey.slice(1, -1).trim();
  }

  // Convert literal \n or \\n strings into real newlines
  let privateKey = rawKey.replace(/\\n/g, '\n');

  // Check PEM header/footer
  const hasBegin = privateKey.includes('-----BEGIN PRIVATE KEY-----');
  const hasEnd = privateKey.includes('-----END PRIVATE KEY-----');

  if (!hasBegin || !hasEnd) {
    throw new Error(
      'GOOGLE_PRIVATE_KEY format is invalid in .env.local. Make sure it includes "-----BEGIN PRIVATE KEY-----" and "-----END PRIVATE KEY-----", and is wrapped in double quotes in .env.local.'
    );
  }

  const body = privateKey
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .trim();

  if (!body) {
    throw new Error(
      'GOOGLE_PRIVATE_KEY is missing the private key payload between BEGIN and END markers. Please check .env.local.'
    );
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: [
        "https://www.googleapis.com/auth/analytics.readonly",
        "https://www.googleapis.com/auth/webmasters.readonly"
      ],
    });

    return auth;
  } catch (err: any) {
    if (err.message && err.message.includes('DECODER routines')) {
      throw new Error(
        'Invalid GOOGLE_PRIVATE_KEY in .env.local. OpenSSL could not decode the private key string. Please verify you copied the exact private_key from your Google Service Account JSON file.'
      );
    }
    throw err;
  }
}

export async function getCoreMetrics(startDate: string, endDate: string): Promise<CoreMetrics> {
  const propertyId = requireEnv('GA_PROPERTY_ID');
  const auth = getGoogleAuth();
  const analytics = google.analyticsdata('v1beta');

  const response = await analytics.properties.runReport({
    auth,
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
      ],
    },
  });

  const row = response.data.rows?.[0];
  const metrics = row?.metricValues ?? [];

  return {
    totalUsers: toNumber(metrics[0]?.value),
    sessions: toNumber(metrics[1]?.value),
    pageviews: toNumber(metrics[2]?.value),
  };
}

export async function getTrafficSources(startDate: string, endDate: string): Promise<TrafficSourceRow[]> {
  const propertyId = requireEnv('GA_PROPERTY_ID');
  const auth = getGoogleAuth();
  const analytics = google.analyticsdata('v1beta');

  const response = await analytics.properties.runReport({
    auth,
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'sessionSource' }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
      ],
      orderBys: [
        { metric: { metricName: 'sessions' }, desc: true },
      ],
    },
  });

  return (response.data.rows ?? []).map((row) => ({
    source: row.dimensionValues?.[0]?.value || 'unknown',
    totalUsers: toNumber(row.metricValues?.[0]?.value),
    sessions: toNumber(row.metricValues?.[1]?.value),
    pageviews: toNumber(row.metricValues?.[2]?.value),
  }));
}

export async function getDailyGraphData(startDate: string, endDate: string): Promise<DailyGraphRow[]> {
  const propertyId = requireEnv('GA_PROPERTY_ID');
  const auth = getGoogleAuth();
  const analytics = google.analyticsdata('v1beta');

  const response = await analytics.properties.runReport({
    auth,
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
        { name: 'averageSessionDuration' },
      ],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    },
  });

  return (response.data.rows ?? []).map((row) => {
    const rawDate = row.dimensionValues?.[0]?.value || '';
    const date = rawDate.length === 8
      ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`
      : rawDate;

    return {
      date,
      pageviews: toNumber(row.metricValues?.[0]?.value),
      totalUsers: toNumber(row.metricValues?.[1]?.value),
      avgTime: toNumber(row.metricValues?.[2]?.value),
    };
  });
}

export async function getTopPages(startDate: string, endDate: string): Promise<TopPageRow[]> {
  const propertyId = requireEnv('GA_PROPERTY_ID');
  const auth = getGoogleAuth();
  const analytics = google.analyticsdata('v1beta');

  const response = await analytics.properties.runReport({
    auth,
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
      ],
      orderBys: [
        { metric: { metricName: 'screenPageViews' }, desc: true },
      ],
    },
  });

  return (response.data.rows ?? []).map((row) => ({
    pagePath: row.dimensionValues?.[0]?.value || '/',
    pageviews: toNumber(row.metricValues?.[0]?.value),
    totalUsers: toNumber(row.metricValues?.[1]?.value),
  }));
}

export async function getSearchConsoleData(startDate: string, endDate: string): Promise<SearchConsoleMetrics> {
  const siteUrl = requireEnv('GSC_SITE_URL');
  const auth = getGoogleAuth();
  const searchConsole = google.searchconsole('v1');

  const response = await searchConsole.searchanalytics.query({
    auth,
    siteUrl,
    requestBody: {
      startDate,
      endDate,
    },
  });

  const clicks = toNumber(response.data.rows?.reduce((sum, row) => sum + toNumber(row.clicks), 0));
  const impressions = toNumber(response.data.rows?.reduce((sum, row) => sum + toNumber(row.impressions), 0));
  const ctr = impressions > 0 ? clicks / impressions : 0;

  return { clicks, impressions, ctr };
}
