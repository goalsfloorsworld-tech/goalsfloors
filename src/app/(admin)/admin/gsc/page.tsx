import { Metadata } from "next";
import { getTopQueries, getStrikingDistanceQueries, getSitemapHealth, getTopImageQueries, type QueryRow } from "@/lib/seo";
import { getSitemapData } from "@/actions/seo";
import GscDashboardClient from "@/components/admin/gsc/GscDashboardClient";

export const metadata: Metadata = {
  title: "SEO Command Center | Admin",
  description: "Google Search Console and Indexing API dashboard.",
};

export default async function GscDashboardPage() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 30); // Last 30 days
  const startDate = start.toISOString().slice(0, 10);
  const endDate = now.toISOString().slice(0, 10);

  let topQueries: QueryRow[] = [];
  let strikingDistanceQueries: QueryRow[] = [];
  let imageQueries: QueryRow[] = [];
  let sitemapData = { 
    newUrls: [] as string[], 
    indexedUrls: [] as { url: string; last_requested_at: string }[], 
    allUrls: [] as string[] 
  };
  let sitemapHealth: any[] = [];

  try {
    const [top, striking, img, sitemap, health] = await Promise.all([
      getTopQueries(startDate, endDate),
      getStrikingDistanceQueries(startDate, endDate),
      getTopImageQueries(startDate, endDate),
      getSitemapData(),
      getSitemapHealth()
    ]);
    topQueries = top;
    strikingDistanceQueries = striking;
    imageQueries = img;
    sitemapData = sitemap;
    sitemapHealth = health;
  } catch (error) {
    console.error("Error fetching GSC data:", error);
    // Silent fail for UI gracefully handled inside client component (empty arrays)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out max-w-7xl mx-auto">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          SEO Command Center
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Monitor your search performance and push URLs directly to Google Index.
        </p>
      </div>

      <GscDashboardClient 
        topQueries={topQueries} 
        strikingDistanceQueries={strikingDistanceQueries} 
        imageQueries={imageQueries}
        initialNewUrls={sitemapData.newUrls}
        initialIndexedUrls={sitemapData.indexedUrls}
        sitemapHealth={sitemapHealth}
      />
    </div>
  );
}
