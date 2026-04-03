import { Metadata } from "next";
import { Suspense } from "react";
import { getAllProducts } from "@/lib/data";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Luxury Flooring & Wall Panel Collection - Goals Floors Gurugram",
  description: "Browse 2500+ premium products including WPC Louvers, Charcoal Panels, and Wooden Flooring. Ready stock for immediate dispatch in NCR.",
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
