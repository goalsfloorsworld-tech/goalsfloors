import Link from 'next/link';
import Image from 'next/image'
import { Phone, ChevronDown, Menu } from 'lucide-react';

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
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-amber-700 font-medium transition-colors">Home</Link>
            
            {/* Mega Menu Trigger Placeholder */}
            <div className="group relative flex items-center gap-1 text-gray-700 hover:text-amber-700 font-medium cursor-pointer transition-colors">
              Products <ChevronDown className="w-4 h-4" />
              {/* Note: Yahan Mega Menu ka dropdown aayega jo hum baad me design karenge */}
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