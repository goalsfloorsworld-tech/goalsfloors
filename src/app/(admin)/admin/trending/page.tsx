import type { Metadata } from "next";
import TrendingSectionsManager from "./TrendingSectionsManager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trending Section Manager | Goals Floors Admin",
  description: "Manage homepage Trending Now collections, 4-card architectural mosaic, imagery, and product links.",
};

export default function AdminTrendingPage() {
  return <TrendingSectionsManager />;
}
