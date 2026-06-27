import { Metadata } from "next";
import { Suspense } from "react";
import { getAllProducts } from "@/lib/data";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Browse 2500+ Flooring, Wall Panels & WPC Products | Goals Floors",
  description: "Explore 2500+ flooring, wall panels, decking, ceilings, mouldings, and exterior products for residential and commercial projects. Discover waterproof interior solutions, expert guidance, warranty-backed collections, and fast delivery across Gurgaon & Delhi NCR.",
  alternates: {
    canonical: "/products",
  },
};

export default async function AllProductsPage() {
  const products = getAllProducts();

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fcfaf7] dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ProductsClient products={products} />
    </Suspense>
  );
}
