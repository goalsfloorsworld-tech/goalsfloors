"use client";

import Image from "next/image";
import { ShieldCheck, Trophy, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden opacity-40">
           <Image 
            src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070" 
            alt="Goals Floors Office" fill className="object-cover" 
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Our Legacy Since 2005</h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto font-light">
            Goals Floors has been at the forefront of architectural innovation for over 19 years, delivering premium surfaces that redefine luxury and durability.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center p-8 bg-gray-50 border border-gray-100 rounded-sm hover:shadow-xl transition-all">
            <div className="inline-flex w-16 h-16 bg-amber-100 text-amber-600 rounded-full items-center justify-center mb-6">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-4">19+ Years Experience</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Two decades of mastering the art of flooring and paneling for premium Indian homes and commercial spaces.</p>
          </div>
          
          <div className="text-center p-8 bg-gray-50 border border-gray-100 rounded-sm hover:shadow-xl transition-all">
            <div className="inline-flex w-16 h-16 bg-amber-100 text-amber-600 rounded-full items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-4">Certified Quality</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Every product comes with official warranties, being termite-proof, water-resistant, and fire-retardant.</p>
          </div>

          <div className="text-center p-8 bg-gray-50 border border-gray-100 rounded-sm hover:shadow-xl transition-all">
            <div className="inline-flex w-16 h-16 bg-amber-100 text-amber-600 rounded-full items-center justify-center mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-4">Customer First</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Trusted by 10,000+ happy clients and major developers across NCR for our transparent pricing and support.</p>
          </div>
        </div>
      </section>

      {/* Detailed Story */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[500px] rounded-sm overflow-hidden shadow-2xl">
               <Image 
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000" 
                alt="Architecture Team" fill className="object-cover" 
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 tracking-tight">Redefining Architectural Surfaces</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Founded in 2005, Goals Floors started with a simple vision: to bring world-class surface solutions to the Indian market. Today, we are proud to be the leading distributors of premium WPC Louvers, Charcoal Panels, and Baffle Ceilings.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our specialty lies in our 2-hour express delivery model in Gurgaon and NCR, ensuring that your architectural projects never have to wait. We bridge the gap between premium design and rapid execution.
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-3xl font-bold text-amber-600 mb-1">2-Hour</div>
                  <div className="text-xs uppercase tracking-widest text-gray-500">Delivery in NCR</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-600 mb-1">10k+</div>
                  <div className="text-xs uppercase tracking-widest text-gray-500">Happy Clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
