import { analyticsdata } from '@googleapis/analyticsdata';
import { GoogleAuth } from 'google-auth-library';

export async function getPageViews(days = 30): Promise<string> {
  try {
    const propertyId = process.env.GA_PROPERTY_ID;
    const clientEmail = process.env.GA_CLIENT_EMAIL;
    // Replace literal '\n' characters in the env var string with actual newlines
    const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!propertyId || !clientEmail || !privateKey) {
      console.error('GA4 Authentication Error: Missing GA_PROPERTY_ID, GA_CLIENT_EMAIL, or GA_PRIVATE_KEY in .env.local');
      return "0";
    }

    const analyticsClient = analyticsdata({
      version: 'v1beta',
      auth: new GoogleAuth({
        credentials: {
          client_email: clientEmail,
          private_key: privateKey,
        },
        scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
      })
    });

    const response = await analyticsClient.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [
          {
            startDate: `${days}daysAgo`,
            endDate: 'today',
          },
        ],
        metrics: [
          {
            name: 'screenPageViews',
          },
        ],
      },
    });

    const rows = response.data.rows;
    if (rows && rows.length > 0 && rows[0].metricValues && rows[0].metricValues.length > 0) {
      const views = rows[0].metricValues[0].value;
      return views || "0";
    }

    return "0";
  } catch (error) {
    console.error('Error fetching GA4 data:', error);
    return "0"; // Graceful fallback
  }
}
