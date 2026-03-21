"use client";

import Link from 'next/link';
import Image from 'next/image'
import { Phone, ChevronDown, Menu, ArrowRight } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* 1. Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              aria-label="Goals Floors Home"
              className="flex items-center gap-2 select-none"
            >
              {/* Next.js Optimized Image Component 👇 */}
              <Image
                src="/images/goals floors logo.svg" // Starts from 'public' folder directly
                alt="Goals Floors Logo" // Important for SEO and Accessibility
                width={180} // Set an estimated width (integer)
                height={48}  // Set an estimated height (integer)
                priority    // Pre-loads the image as it is "Above the Fold"
                className="h-12 w-auto object-contain" // Final styling with Tailwind
              />
            </Link>
          </div>

          {/* 2. Desktop Menu (Center) */}
          <nav className="hidden md:flex space-x-8 items-center h-full">
            <Link href="/" className="text-gray-700 hover:text-amber-700 font-medium transition-colors">Home</Link>

            {/* Mega Menu Trigger */}
            <div className="group h-full flex items-center">
              <Link
                href="/products"
                className="flex items-center gap-1 text-gray-700 group-hover:text-amber-700 font-medium cursor-pointer transition-colors"
              >
                Products <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </Link>

              {/* The Dropdown Panel */}
              <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[600px] bg-white shadow-2xl border-t-2 border-amber-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-50 rounded-b-sm">

                <div className="p-8 grid grid-cols-2 gap-8 relative">
                  {/* Subtle Background Logo */}
                  <div className="absolute -bottom-10 -right-10 text-9xl font-black text-gray-50 opacity-50 select-none pointer-events-none">G</div>

                  {/* Column 1: Wall Panels */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Wall Panels</h3>
                    <ul className="space-y-3">
                      <li>
                        <Link href="/products/tokyo-charcoal-moulding" className="group/item text-gray-500 hover:text-amber-600 text-sm transition-colors flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                          Charcoal Moulding
                        </Link>
                      </li>
                      <li>
                        {/* Note: Update href when you add 'exterior-louvers' to products.json */}
                        <Link href="/products/exterior-louvers" className="group/item text-gray-500 hover:text-amber-600 text-sm transition-colors flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                          Exterior Louvers
                        </Link>
                      </li>
                      <li>
                        {/* Note: Update href when you add 'fluted-panels' to products.json */}
                        <Link href="/products/fluted-panels" className="group/item text-gray-500 hover:text-amber-600 text-sm transition-colors flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                          Fluted Panels
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Column 2: Flooring & Ceilings */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Flooring & Ceilings</h3>
                    <ul className="space-y-3">
                      <li>
                        <Link href="/products/premium-oak-laminate" className="group/item text-gray-500 hover:text-amber-600 text-sm transition-colors flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                          Premium Laminate
                        </Link>
                      </li>
                      <li>
                        {/* Note: Update href when you add 'artificial-grass' to products.json */}
                        <Link href="/products/artificial-grass" className="group/item text-gray-500 hover:text-amber-600 text-sm transition-colors flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                          Artificial Grass
                        </Link>
                      </li>
                      <li>
                        {/* Note: Update href when you add 'baffle-ceilings' to products.json */}
                        <Link href="/products/baffle-ceilings" className="group/item text-gray-500 hover:text-amber-600 text-sm transition-colors flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                          Baffle Ceilings
                        </Link>
                      </li>
                    </ul>
                  </div>

                </div>

                {/* Mega Menu Footer CTA */}
                <div className="bg-gray-50 p-4 border-t border-gray-100 text-center">
                  <Link href="/products" className="text-sm font-bold text-amber-600 hover:text-amber-700 uppercase tracking-widest inline-flex items-center gap-2 group/btn">
                    Explore Full Catalog <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/projects" className="text-gray-700 hover:text-amber-700 font-medium transition-colors">Our Projects</Link>
            <Link href="/about" className="text-gray-700 hover:text-amber-700 font-medium transition-colors">About Us</Link>
          </nav>

          {/* 3. CTA & Mobile Toggle (Right) */}
          <div className="flex items-center gap-4">
            <a href="tel:+91XXXXXXXXXX" className="hidden lg:flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-amber-700 transition-colors">
              <Phone className="w-4 h-4" />
              <span>Get a Quote</span>
            </a>

            <Link href="/contact" className="hidden md:flex bg-gray-900 text-white px-5 py-2.5 rounded-none hover:bg-amber-700 transition-colors text-sm font-medium tracking-wide">
              Contact Us
            </Link>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-gray-900">
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}