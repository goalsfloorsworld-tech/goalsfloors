import { google } from 'googleapis';
import type { OAuth2Client } from 'google-auth-library';
import { getGoogleAuth } from './ga';

function toNumber(value: string | number | null | undefined): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') return Number(value);
  return 0;
}

export type DeviceRow = {
  category: string;
  users: number;
};

export type GeoRow = {
  country: string;
  city: string;
  users: number;
};

export type UserTypeRow = {
  type: string;
  users: number;
};

export type EventRow = {
  eventName: string;
  eventCount: number;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name} in environment`);
  }
  return value;
}

export async function getDeviceData(startDate: string, endDate: string): Promise<DeviceRow[]> {
  const propertyId = requireEnv('GA_PROPERTY_ID');
  const auth = getGoogleAuth();
  const analytics = google.analyticsdata('v1beta');

  const response = await analytics.properties.runReport({
    auth,
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'totalUsers' }],
      orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
    },
  });

  return (response.data.rows ?? []).map((row) => ({
    category: row.dimensionValues?.[0]?.value || 'unknown',
    users: toNumber(row.metricValues?.[0]?.value),
  }));
}

export async function getGeoData(startDate: string, endDate: string): Promise<GeoRow[]> {
  const propertyId = requireEnv('GA_PROPERTY_ID');
  const auth = getGoogleAuth();
  const analytics = google.analyticsdata('v1beta');

  const response = await analytics.properties.runReport({
    auth,
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'country' }, { name: 'city' }],
      metrics: [{ name: 'totalUsers' }],
      orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
    },
  });

  return (response.data.rows ?? []).map((row) => ({
    country: row.dimensionValues?.[0]?.value || 'unknown',
    city: row.dimensionValues?.[1]?.value || 'unknown',
    users: toNumber(row.metricValues?.[0]?.value),
  }));
}

export async function getUserTypeData(startDate: string, endDate: string): Promise<UserTypeRow[]> {
  const propertyId = requireEnv('GA_PROPERTY_ID');
  const auth = getGoogleAuth();
  const analytics = google.analyticsdata('v1beta');

  const response = await analytics.properties.runReport({
    auth,
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'newVsReturning' }],
      metrics: [{ name: 'totalUsers' }],
    },
  });

  return (response.data.rows ?? []).map((row) => ({
    type: row.dimensionValues?.[0]?.value || 'unknown',
    users: toNumber(row.metricValues?.[0]?.value),
  }));
}

export async function getEventData(startDate: string, endDate: string): Promise<EventRow[]> {
  const propertyId = requireEnv('GA_PROPERTY_ID');
  const auth = getGoogleAuth();
  const analytics = google.analyticsdata('v1beta');

  const response = await analytics.properties.runReport({
    auth,
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    },
  });

  return (response.data.rows ?? []).map((row) => ({
    eventName: row.dimensionValues?.[0]?.value || 'unknown',
    eventCount: toNumber(row.metricValues?.[0]?.value),
  }));
}
