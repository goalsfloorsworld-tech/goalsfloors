import Link from 'next/link';
import { Search, ArrowRight, MessageCircle } from 'lucide-react';

export default function NotFound() {
  const popularProducts = [
    {
      title: 'Wall Panels',
      href: '/products/wall-panels',
      description: 'Premium decorative wall solutions',
    },
    {
      title: 'WPC Baffle Ceiling',
      href: '/products/wpc-baffle-ceiling',
      description: 'Modern linear ceiling panels',
    },
    {
      title: 'Tokyo Charcoal Moulding',
      href: '/products/tokyo-charcoal-moulding',
      description: 'Charcoal finish wall moulding',
    },
    {
      title: 'WPC Timber Tubes',
      href: '/products/wpc-timber-tubes',
      description: 'Outdoor timber tube cladding',
    },
    {
      title: 'WPC Exterior Louvers',
      href: '/products/wpc-exterior-louvers',
      description: 'Weather-resistant exterior louvers',
    },
  ];

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#050810] text-gray-900 dark:text-gray-100 flex flex-col items-center pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* 1. HERO */}
      <div className="w-full max-w-2xl text-center space-y-6">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium border border-red-200 dark:border-red-500/20">
          404 — Page Not Found
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-gray-900 dark:text-white">
          You hit a dead end.
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          The page you're looking for has moved or no longer exists.
        </p>

        <form action="/products" method="GET" className="mt-8 max-w-md mx-auto relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            name="search" 
            placeholder="Search products..." 
            className="w-full pl-12 pr-24 py-4 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d46b28] focus:border-transparent transition-shadow"
            required
          />
          <button 
            type="submit" 
            className="absolute right-2 top-2 bottom-2 px-6 bg-[#d46b28] hover:bg-[#b85a1f] text-white rounded-full font-medium transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* 2. QUICK LINKS */}
      <div className="w-full max-w-3xl mt-16 flex flex-wrap justify-center gap-3">
        {quickLinks.map((link) => (
          <Link 
            key={link.href}
            href={link.href}
            className="px-6 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 font-medium transition-colors"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* 3. POPULAR PRODUCTS STRIP */}
      <div className="w-full max-w-6xl mt-24">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          You might be looking for
        </h2>
        
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4 sm:pb-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {popularProducts.map((product) => (
            <Link 
              key={product.href}
              href={product.href}
              className="group flex-shrink-0 w-[280px] sm:w-auto snap-center bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:border-[#d46b28] dark:hover:border-[#d46b28]/50 transition-all hover:shadow-lg hover:-translate-y-1 relative"
            >
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#d46b28] transition-colors pr-6">
                {product.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {product.description}
              </p>
              <ArrowRight className="absolute top-5 right-5 w-5 h-5 text-gray-400 group-hover:text-[#d46b28] transition-colors group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </div>

      {/* 4. BOTTOM CTA */}
      <div className="w-full max-w-2xl mt-24 text-center pb-8 border-t border-gray-200 dark:border-gray-800 pt-12">
        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
          Still can't find what you need?
        </h3>
        <a 
          href="https://wa.me/917217644573"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold transition-all hover:scale-105 shadow-lg shadow-[#25D366]/20"
        >
          <MessageCircle className="w-5 h-5" />
          Chat on WhatsApp
        </a>
      </div>
    </main>
  );
}
