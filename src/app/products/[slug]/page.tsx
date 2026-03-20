"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, CheckCircle2, Star } from "lucide-react";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  
  // Format slug for display (e.g., 'wall-panels' -> 'Wall Panels')
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <main className="min-h-screen pt-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-gray-500 mb-8 uppercase tracking-widest font-medium">
          <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Product Image */}
          <div className="relative h-[400px] md:h-[600px] bg-gray-100 rounded-sm overflow-hidden shadow-2xl">
             <Image 
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000" 
              alt={title} fill className="object-cover" 
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Product Details */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              <Star className="w-3 h-3 fill-current" /> Premium Collection
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">{title}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="text-2xl font-bold text-amber-600">Premium Quality</div>
              <div className="w-px h-6 bg-gray-200"></div>
              <div className="text-sm text-gray-500 font-medium italic">Available for Immediate Delivery</div>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              Our {title} are designed for those who seek perfection. Crafted using state-of-the-art technology, they offer unparalleled durability and aesthetic appeal for modern interiors.
            </p>

            {/* Feature List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Termite Proof</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Water Resistant</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">10 Year Warranty</span>
              </div>
              <div className="flex items-center gap-3">
                <ArrowRight className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Fire Retardant</span>
              </div>
            </div>

            {/* CTA */}
            <Link 
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-gray-950 text-white px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-amber-700 transition-all shadow-xl hover:shadow-amber-600/30 w-full sm:w-auto"
            >
              Get Free Consultation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
