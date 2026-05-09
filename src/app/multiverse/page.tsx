
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllMultiverseItems } from '@/lib/multiverse';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Goals Multiverse: Premium Interactive Wall Panels & Flooring Collection',
  description: 'Explore the Goals Floors Multiverse. Discover our exclusive range of SPC Flooring, Metallic Fluted Panels, and Primo PVC Wall Panels. Premium architectural products with interactive previews for modern Indian homes.',
  keywords: ['Wall Panels', 'SPC Flooring', 'Metallic Fluted Panels', 'Primo PVC', 'Interior Design India', 'Goals Floors Multiverse'],
  openGraph: {
    title: 'Goals Multiverse | Premium Flooring & Wall Panels',
    description: 'Explore our interactive collection of premium architectural surfaces.',
    images: ['/images/multiverse/hero-bg.png'],
  },
  alternates: {
    canonical: '/multiverse'
  }
};

export default function MultiverseHub() {
  const allItems = getAllMultiverseItems();
  
  // Group by category
  const categoriesMap = allItems.reduce((acc: any, item) => {
    if (!acc[item.categoryName]) {
      acc[item.categoryName] = {
        name: item.categoryName,
        slug: item.categorySlug,
        items: []
      };
    }
    acc[item.categoryName].items.push(item);
    return acc;
  }, {});

  const categories = Object.values(categoriesMap);

  const categoryThumbnails: Record<string, string> = {
    'Flooring': '/images/multiverse/flooring.png',
    'Wall Panels': '/images/multiverse/wall-panels.png'
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900">
      {/* Hero Section - Professional & Clean */}
      <section className="relative h-[60vh] flex items-center bg-slate-900 overflow-hidden">
        <Image 
          src="/images/multiverse/hero-bg.png" 
          alt="Goals Floors Multiverse Hero" 
          fill 
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-4 block">Premium Collection</span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              The Goals <span className="text-amber-500">Multiverse</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
              Discover a new dimension of interior surfaces. From high-end metallic fluted panels to 100% waterproof SPC flooring, explore our premium catalog designed for modern Indian architecture.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#explore" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-4 rounded-lg transition-all shadow-lg shadow-amber-500/20">
                Explore All Products
              </a>
              <Link href="/contact" className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 font-bold px-8 py-4 rounded-lg transition-all">
                Download Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Section: What is Multiverse? */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-slate-900">Why Choose Goals Multiverse?</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Goals Floors Multiverse is a curated digital showroom of our most premium and advanced architectural products. Each product in this collection is selected for its superior quality, innovative design, and durability in Indian climatic conditions.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-amber-500 font-bold text-2xl mb-1">90%</div>
                  <div className="text-slate-500 text-sm">Warranty Backed</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-amber-500 font-bold text-2xl mb-1">400+</div>
                  <div className="text-slate-500 text-sm">Dealer Network</div>
                </div>
              </div>
            </div>
            <div className="bg-slate-100 p-8 rounded-2xl border border-slate-200">
              <h3 className="text-xl font-bold mb-4">Core Benefits</h3>
              <ul className="space-y-3">
                {['100% Waterproof Materials', 'Termite & Borer Resistant', 'Zero Maintenance Surfaces', 'Fast & Dust-Free Installation'].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <span className="w-6 h-6 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="explore" className="py-20">
        <div className="container mx-auto px-6">
          {categories.map((cat: any) => (
            <div key={cat.slug} className="mb-20 last:mb-0">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{cat.name}</h2>
                  <p className="text-slate-500">Premium {cat.name.toLowerCase()} solutions for luxury interiors.</p>
                </div>
                <div className="h-px flex-grow bg-slate-200 hidden md:block mx-8"></div>
                <div className="text-amber-600 font-semibold">{cat.items.length} Products Available</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cat.items.map((item: any) => (
                  <Link 
                    key={item.id} 
                    href={item.url} 
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-amber-500 transition-all hover:shadow-2xl hover:shadow-slate-200 flex flex-col h-full"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image 
                        src={categoryThumbnails[cat.name] || '/images/multiverse/hero-bg.png'} 
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                        {item.priceInfo?.split(':')[1] || item.priceInfo || 'Premium'}
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors uppercase tracking-tight">
                        {item.name}
                      </h3>
                      <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      
                      <div className="mt-auto pt-6 border-t border-slate-100">
                        <div className="flex flex-wrap gap-2 mb-6">
                          {item.features?.slice(0, 2).map((feat: string, i: number) => (
                            <span key={i} className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase tracking-wider">
                              {feat}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-amber-600 font-bold text-sm">View Details</span>
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all">
                            →
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final SEO Footer */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Experience the Quality in Person</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Visit our experience center or connect with one of our 400+ dealers across India to see the texture and feel the quality of our Multiverse collection.
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/dealer" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-3 rounded-lg transition-all">
              Find a Dealer
            </Link>
            <Link href="/contact" className="bg-transparent border border-white/30 hover:bg-white/10 font-bold px-8 py-3 rounded-lg transition-all">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
