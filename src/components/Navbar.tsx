"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) setIsProductsOpen(false);
  };

  const toggleProducts = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsProductsOpen(!isProductsOpen);
  };

  return (
    <>
      <header className="fixed w-full top-0 z-50 bg-white border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">

            {/* 1. Logo Section */}
            <div className="flex-shrink-0">
              <Link href="/" aria-label="Goals Floors Home" className="flex items-center">
                <Image
                  src="/images/goals floors logo.svg"
                  alt="Goals Floors Logo"
                  width={140}
                  height={35}
                  priority
                  className="h-7 w-auto object-contain"
                />
              </Link>
            </div>

            {/* 2. Desktop Menu */}
            <nav className="hidden md:flex space-x-6 items-center h-full">
              <Link href="/" className="text-gray-600 hover:text-amber-600 font-normal text-sm transition-colors h-full flex items-center border-b-2 border-transparent hover:border-amber-600 px-1">Home</Link>
              <div className="group relative h-full flex items-center">
                <Link href="/products" className="flex items-center gap-1 text-gray-600 group-hover:text-amber-600 font-normal text-sm transition-colors h-full px-1 border-b-2 border-transparent group-hover:border-amber-600">
                  Products <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </Link>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white shadow-2xl border-t border-amber-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-50 rounded-b-sm">
                  <div className="p-8 grid grid-cols-2 gap-8 relative overflow-hidden">
                    <div className="absolute -bottom-10 -right-10 text-9xl font-normal text-gray-100/50 select-none pointer-events-none">G</div>
                    <div>
                      <h3 className="text-xs font-normal text-amber-600 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Wall Panels</h3>
                      <ul className="space-y-3">
                        <li><Link href="/products/tokyo-charcoal-moulding" className="group/item text-gray-600 hover:text-amber-700 text-sm transition-colors flex items-center gap-2 font-normal"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>Charcoal Moulding</Link></li>
                        <li><Link href="/products/exterior-louvers" className="group/item text-gray-600 hover:text-amber-700 text-sm transition-colors flex items-center gap-2 font-normal"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>Exterior Louvers</Link></li>
                        <li><Link href="/products/fluted-panels" className="group/item text-gray-600 hover:text-amber-700 text-sm transition-colors flex items-center gap-2 font-normal"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>Fluted Panels</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xs font-normal text-amber-600 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Flooring & Ceilings</h3>
                      <ul className="space-y-3">
                        <li><Link href="/products/premium-oak-laminate" className="group/item text-gray-600 hover:text-amber-700 text-sm transition-colors flex items-center gap-2 font-normal"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>Premium Laminate</Link></li>
                        <li><Link href="/products/artificial-grass" className="group/item text-gray-500 hover:text-amber-700 text-sm transition-colors flex items-center gap-2 font-normal"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>Artificial Grass</Link></li>
                        <li><Link href="/products/baffle-ceilings" className="group/item text-gray-500 hover:text-amber-700 text-sm transition-colors flex items-center gap-2 font-normal"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>Baffle Ceilings</Link></li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 border-t border-gray-100 text-center">
                    <Link href="/products" className="text-sm font-normal text-amber-600 hover:text-amber-700 uppercase tracking-widest inline-flex items-center gap-2 group/btn">
                      Explore Full Catalog <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
              <Link href="/projects" className="text-gray-700 hover:text-amber-700 font-normal text-sm transition-colors h-full flex items-center border-b-2 border-transparent hover:border-amber-600 px-1">Projects</Link>
              <Link href="/about" className="text-gray-700 hover:text-amber-700 font-normal text-sm transition-colors h-full flex items-center border-b-2 border-transparent hover:border-amber-600 px-1">About</Link>
            </nav>

            {/* 3. Right Section */}
            <div className="flex items-center gap-4">
              <Link href="/contact" className="hidden md:block bg-gray-900 text-white px-5 py-2 text-sm font-normal hover:bg-amber-600 transition-all active:scale-95 rounded-sm">
                Contact
              </Link>
              <button onClick={toggleMenu} className="md:hidden p-2 text-gray-900 hover:bg-gray-50 rounded-full transition-colors">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ================= NORMAL MOBILE MENU PANEL ================= */}
      <div 
        className={`md:hidden fixed inset-0 top-[56px] bg-white z-[100] transition-all duration-300 transform ${
          isMenuOpen 
            ? 'translate-x-0 opacity-100 flex' 
            : 'translate-x-full opacity-0 pointer-events-none hidden'
        }`}
      >
        <nav className="flex flex-col p-6 pb-24 gap-4 min-h-screen overflow-y-auto bg-white flex-1">
          <Link href="/" onClick={toggleMenu} className="text-lg font-normal text-gray-900 border-b border-gray-100 pb-3">
            Home
          </Link>
          
          {/* Products Accordion Section */}
          <div className="border-b border-gray-100 pb-3">
            <button 
              onClick={toggleProducts}
              className="flex items-center justify-between w-full text-lg font-normal text-gray-900 py-1"
            >
              Products
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isProductsOpen ? 'rotate-180 text-amber-600' : ''}`} />
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ${isProductsOpen ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="flex flex-col gap-6 pl-4 border-l border-amber-100">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-normal text-amber-600 uppercase tracking-widest">Wall Panels</h4>
                  <div className="flex flex-col gap-2">
                    <Link href="/products/tokyo-charcoal-moulding" onClick={toggleMenu} className="text-sm font-normal text-gray-500 hover:text-gray-900">Charcoal Moulding</Link>
                    <Link href="/products/exterior-louvers" onClick={toggleMenu} className="text-sm font-normal text-gray-500 hover:text-gray-900">Exterior Louvers</Link>
                    <Link href="/products/fluted-panels" onClick={toggleMenu} className="text-sm font-normal text-gray-500 hover:text-gray-900">Fluted Panels</Link>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[10px] font-normal text-amber-600 uppercase tracking-widest">Flooring & Ceilings</h4>
                  <div className="flex flex-col gap-2">
                    <Link href="/products/premium-oak-laminate" onClick={toggleMenu} className="text-sm font-normal text-gray-500 hover:text-gray-900">Premium Laminate</Link>
                    <Link href="/products/artificial-grass" onClick={toggleMenu} className="text-sm font-normal text-gray-500 hover:text-gray-900">Artificial Grass</Link>
                    <Link href="/products/baffle-ceilings" onClick={toggleMenu} className="text-sm font-normal text-gray-500 hover:text-gray-900">Baffle Ceilings</Link>
                  </div>
                </div>
                <Link href="/products" onClick={toggleMenu} className="text-sm font-normal text-amber-600 flex items-center gap-2 py-2">
                  View All Products <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          <Link href="/projects" onClick={toggleMenu} className="text-lg font-normal text-gray-900 border-b border-gray-100 pb-3">Projects</Link>
          <Link href="/about" onClick={toggleMenu} className="text-lg font-normal text-gray-900 border-b border-gray-100 pb-3">About Us</Link>
          <Link href="/contact" onClick={toggleMenu} className="text-lg font-normal text-amber-600 border-b border-gray-100 pb-3">Contact Us</Link>
        </nav>
      </div>
    </>
  );
}