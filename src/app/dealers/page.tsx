import { supabaseClient } from '@/lib/supabase';
import Link from 'next/link';
import { MapPin, Search, X } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find a Flooring Dealer Near You | Goals Floors',
  description: 'Browse verified Goals Floors dealers across Delhi NCR. Find SPC flooring, wall panels, and more with 2-hour delivery.'
};

export const dynamic = 'force-dynamic';

export default async function DealersDirectoryPage({
  searchParams,
}: {
  searchParams: { city?: string; product?: string };
}) {
  const { data: dealers } = await supabaseClient
    .from('dealers')
    .select('id, slug, business_name, tagline, city, area, products, profile_complete')
    .eq('is_approved', true)
    .eq('profile_complete', true)
    .order('created_at', { ascending: false });

  const city = searchParams?.city || '';
  const product = searchParams?.product || '';

  let filtered = dealers || [];

  if (city) {
    filtered = filtered.filter(d => d.city?.toLowerCase().includes(city.toLowerCase()));
  }

  if (product) {
    filtered = filtered.filter(d => 
      d.products?.some((p: string) => p.toLowerCase().includes(product.toLowerCase()))
    );
  }

  const allCities = [...new Set(dealers?.map(d => d.city).filter(Boolean) as string[])].sort();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050810] font-sans pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8 animate-in fade-in duration-700">
        
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase mb-4">
            Find a Goals Floors Dealer Near You
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Verified dealers with 40-50% margins, 2-hour dispatch & 7-year warranty
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2rem] p-6 mb-10 shadow-sm max-w-4xl mx-auto relative z-10">
          <form action="/dealers" method="GET" className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/3">
              <label htmlFor="city" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1 mb-1.5">
                City
              </label>
              <select 
                name="city" 
                id="city"
                defaultValue={city}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm font-medium appearance-none"
              >
                <option value="">All Cities</option>
                {allCities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            
            <div className="w-full md:w-1/3">
              <label htmlFor="product" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1 mb-1.5">
                Product Search
              </label>
              <input 
                type="text" 
                name="product" 
                id="product"
                defaultValue={product}
                placeholder="e.g. SPC Flooring"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm font-medium"
              />
            </div>

            <div className="w-full md:w-auto flex-1 flex gap-3">
              <button 
                type="submit"
                className="flex-1 py-3 px-6 bg-slate-900 dark:bg-amber-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" /> Search
              </button>
              
              {(city || product) && (
                <Link 
                  href="/dealers"
                  className="py-3 px-4 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center"
                  title="Clear Filters"
                >
                  <X className="w-4 h-4" />
                </Link>
              )}
            </div>
          </form>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Showing {filtered.length} dealer{filtered.length !== 1 ? 's' : ''}
            {(city || product) && ' matching your search'}
          </p>
        </div>

        {/* Dealer Cards Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(dealer => (
              <div key={dealer.id} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm flex flex-col hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-colors group">
                <div className="flex-1 mb-6">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {dealer.business_name}
                  </h3>
                  
                  {dealer.tagline && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic mb-4 line-clamp-2">
                      &quot;{dealer.tagline}&quot;
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium mb-4 bg-gray-50 dark:bg-slate-950 p-2.5 rounded-lg border border-gray-100 dark:border-slate-800/50">
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="truncate">{[dealer.area, dealer.city].filter(Boolean).join(', ')}</span>
                  </div>

                  {dealer.products && dealer.products.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {dealer.products.slice(0, 3).map((p: string) => (
                        <span key={p} className="px-2 py-1 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 text-amber-700 dark:text-amber-500 text-[10px] font-bold uppercase tracking-wider rounded-md">
                          {p}
                        </span>
                      ))}
                      {dealer.products.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded-md">
                          +{dealer.products.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <Link 
                  href={`/dealers/${dealer.slug}`}
                  className="w-full py-3.5 bg-slate-900 dark:bg-amber-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-md hover:shadow-lg transition-all text-center block group-hover:bg-amber-500 dark:group-hover:bg-amber-500"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2rem] p-16 text-center shadow-sm max-w-2xl mx-auto">
            <Search className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No dealers found</h2>
            <p className="text-slate-500 mb-6">Try a different city or product search to find what you're looking for.</p>
            {(city || product) && (
              <Link 
                href="/dealers"
                className="inline-flex py-3 px-8 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-500 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-amber-200 dark:hover:bg-amber-900/40 transition-colors"
              >
                Clear Filters
              </Link>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
