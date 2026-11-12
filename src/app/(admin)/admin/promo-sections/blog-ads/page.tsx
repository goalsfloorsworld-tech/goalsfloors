import type { Metadata } from "next";
import BlogAdsManager from "./BlogAdsManager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog Desktop Side Ads | Goals Floors Admin",
  description: "Configure sticky left & right skyscraper ads for all /blogs/[slug] pages on desktop.",
};

export default function AdminBlogAdsPage() {
  return <BlogAdsManager />;
}
