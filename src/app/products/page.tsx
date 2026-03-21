"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Filter } from "lucide-react";

// 1. Master database import karo
import productsData from "@/data/products.json";

export default function AllProductsPage() {
  // 2. Filter ke liye state setup (Default 'All' rahega)
  const [activeCategory, setActiveCategory] = useState("All");

  // 3. Categories ki list dynamically nikalo JSON se
  const categories = ["All", ...Array.from(new Set(productsData.map(p => p.category)))];

  // 4. Products ko filter karne ka logic
  const filteredProducts = activeCategory === "All" 
    ? productsData 
    : productsData.filter(p => p.category === activeCategory);

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      
      {/* Page Header (Premium Dark Style) */}
      <div className="bg-gray-950 py-16 md:py-24 border-b border-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Our Premium Collection
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore our extensive range of world-class interior and exterior architectural surfaces.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        {/* Category Filter Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center gap-2 text-gray-500 font-semibold uppercase tracking-widest text-sm">
            <Filter className="w-5 h-5 text-amber-500" /> Filter By:
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 text-sm font-semibold uppercase tracking-widest transition-all rounded-none border ${
                  activeCategory === category
                    ? "bg-amber-600 border-amber-600 text-white shadow-lg"
                    : "bg-white border-gray-200 text-gray-600 hover:border-amber-500 hover:text-amber-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Link 
              href={`/products/${product.slug}`} 
              key={product.slug}
              className="group bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:border-amber-200 transition-all duration-500 flex flex-col h-full"
            >
              {/* Product Image */}
              <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Category Badge over image */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-700">
                  {product.category}
                </div>
              </div>

              {/* Product Details */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                  {product.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-grow">
                  {product.description}
                </p>
                
                {/* View Details Button */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Explore
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors text-gray-400">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State (If no products found for a category) */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 font-medium">No products found in this category.</p>
          </div>
        )}

      </div>
    </div>
  );
}