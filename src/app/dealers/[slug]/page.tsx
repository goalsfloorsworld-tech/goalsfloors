import { supabaseAdmin } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import DealerLeadForm from '@/components/dealers/DealerLeadForm';
import { MapPin, Phone, MessageCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: dealer } = await supabaseAdmin
    .from('dealers')
    .select('business_name, tagline, area, city, phone, products, slug')
    .eq('slug', slug)
    .eq('is_approved', true)
    .single();

  if (!dealer) return { title: 'Dealer Not Found' };

  const productList = dealer.products?.slice(0, 2).join(' & ') || 'Flooring';
  const location = [dealer.area, dealer.city].filter(Boolean).join(', ');

  return {
    title: `${dealer.business_name} — ${productList} Dealer in ${location} | Goals Floors`,
    description: `${dealer.business_name} is a verified Goals Floors dealer in ${location}. Get ${productList} with 2-hour delivery and 7-year warranty. Call ${dealer.phone} for a free quote.`,
    openGraph: {
      title: `${dealer.business_name} | Goals Floors Verified Dealer`,
      description: `Get ${productList} from ${dealer.business_name} in ${location}.`,
    }
  };
}

export default async function DealerPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: dealer } = await supabaseAdmin
    .from('dealers')
    .select('*')
    .eq('slug', slug)
    .eq('is_approved', true)
    .eq('profile_complete', true)
    .single();

  if (!dealer) {
    notFound();
  }

  const { data: images } = await supabaseAdmin
    .from('project_images')
    .select('*')
    .eq('dealer_id', dealer.id)
    .order('created_at', { ascending: true });

  const whatsappNumber = dealer.whatsapp_number || dealer.phone;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050810] flex flex-col font-sans">
      {/* Top Strip */}
      <div className="bg-slate-900 text-white py-2 px-4 text-center text-xs font-medium tracking-wide">
        Verified dealer of Goals Floors |{' '}
        <Link href="https://goalsfloors.com" target="_blank" className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 transition-colors">
          goalsfloors.com <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12 md:py-20 animate-in fade-in duration-700">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-amber-200 dark:border-amber-900/50">
            <CheckCircle2 className="w-4 h-4" /> Verified Goals Floors Dealer
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight uppercase mb-4">
            {dealer.business_name}
          </h1>
          
          {dealer.tagline && (
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 italic mb-6">
              &quot;{dealer.tagline}&quot;
            </p>
          )}

          <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 font-medium mb-8">
            <MapPin className="w-5 h-5 text-amber-500" />
            {[dealer.area, dealer.city].filter(Boolean).join(', ')}
          </div>

          {dealer.products && dealer.products.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-2xl mx-auto">
              {dealer.products.map((product: string) => (
                <span key={product} className="px-3 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm">
                  {product}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={`tel:+91${dealer.phone}`}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold uppercase tracking-widest text-sm rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" /> Call Now
            </a>
            <a 
              href={`https://wa.me/91${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-[#25D366] text-white font-bold uppercase tracking-widest text-sm rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>

        {/* About Section */}
        {dealer.description && (
          <div className="mb-16 md:mb-24">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6 text-center border-b border-gray-200 dark:border-slate-800 pb-4">
              About {dealer.business_name}
            </h2>
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2rem] p-8 md:p-12 shadow-sm text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
              {dealer.description.split('\n').map((paragraph: string, i: number) => (
                <p key={i} className={i !== 0 ? 'mt-4' : ''}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Section */}
        {images && images.length > 0 && (
          <div className="mb-16 md:mb-24">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6 text-center border-b border-gray-200 dark:border-slate-800 pb-4">
              Our Work
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {images.map((img) => (
                <div key={img.id} className="group relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
                  <div className="relative aspect-square">
                    <Image 
                      src={img.image_url} 
                      alt={img.caption || `Installation by ${dealer.business_name}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white text-xs font-medium line-clamp-2">{img.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lead Form Section */}
        <div>
          <DealerLeadForm 
            dealerId={dealer.id}
            dealerSlug={dealer.slug}
            businessName={dealer.business_name}
          />
        </div>
      </main>

      {/* JSON-LD Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: dealer.business_name,
            image: images && images.length > 0 ? images[0].image_url : undefined,
            telephone: `+91${dealer.phone}`,
            url: `https://goalsfloors.com/dealers/${dealer.slug}`,
            address: {
              '@type': 'PostalAddress',
              streetAddress: dealer.area || undefined,
              addressLocality: dealer.city || undefined,
              postalCode: dealer.pincode || undefined,
              addressCountry: 'IN'
            },
            description: dealer.description || dealer.tagline || `Verified dealer of Goals Floors in ${dealer.city}`
          })
        }}
      />

      {/* Footer Strip */}
      <footer className="bg-slate-900 py-12 text-center border-t border-slate-800 mt-auto">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">
            Powered by
          </p>
          <Link href="https://goalsfloors.com" target="_blank" className="inline-block group">
            <div className="text-2xl font-black text-white tracking-tight group-hover:text-amber-500 transition-colors mb-2">
              GOALS FLOORS
            </div>
            <p className="text-slate-500 text-sm">Premium Wall Panels & Flooring in Delhi NCR</p>
          </Link>
        </div>
      </footer>
    </div>
  );
}
