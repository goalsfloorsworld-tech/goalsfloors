import { notFound } from 'next/navigation';
import { getMultiverseData } from '@/lib/multiverse';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

// 1. Generate Dynamic SEO Meta Tags
export async function generateMetadata({ params }: { params: Promise<{ category: string, variant: string }> }): Promise<Metadata> {
  const { category, variant } = await params;
  const data = getMultiverseData(category, variant);
  
  if (!data) return { title: 'Product Not Found' };
  
  return {
    title: data.seo.title,
    description: data.seo.description,
  };
}

// 2. The Single Dynamic UI Template
export default async function MultiverseVariantPage({ params }: { params: Promise<{ category: string, variant: string }> }) {
  const { category, variant } = await params;
  const data = getMultiverseData(category, variant);
  
  // If JSON file doesn't exist, Next.js shows 404
  if (!data) {
    notFound(); 
  }

  // Generate SEO Schemas dynamically
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": data.seo?.title || data.name,
    "description": data.seo?.description || data.description,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": "499",
      "offerCount": data.collections?.length || 1
    }
  };

  const faqSchema = data.faqs ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faqs.map((faq: any) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <>
      {/* 🔮 Background SEO Schema Injections */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-10 pb-16 transition-colors duration-300">
        
        {/* ✨ HERO SECTION - Modern & Engaging */}
        <section className="container mx-auto px-4 mb-16">
          <div className="bg-gradient-to-br from-slate-900 to-black text-white rounded-[2.5rem] p-6 md:p-14 lg:p-20 shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[45vh]">
            
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 max-w-4xl">
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-emerald-300 mb-6">
                {category.replace("-", " ")} &bull; {variant.replace("-", " ")}
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
                {data.name}
              </h1>
              <p className="text-lg md:text-2xl text-slate-300 font-light mb-10 max-w-3xl leading-relaxed">
                {data.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex flex-col bg-white/10 backdrop-blur-md border border-white/10 px-3 py-3 rounded-2xl">
                  <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1">Pricing Detail</span>
                  <span className="text-xl font-extrabold text-white">{data.priceInfo}</span>
                </div>
                <Link 
                  href={`/contact?interest=${category.replace("-", "_")}&message=${encodeURIComponent(`Hi, I'm interested in ${data.name}. Please provide a free estimate.`)}`}
                  className="bg-emerald-500 align-middle hover:bg-emerald-400 text-black px-8 py-4 rounded-2xl font-bold text-lg transition-colors duration-300"
                >
                  Get Free Estimate
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col gap-12">
            
            {/* 📝 MAIN COLUMN (Main Content, Variants, FAQs) */}
            <div className="flex flex-col gap-12">
              
              {/* 📖 Deep SEO Editorial Content Block */}
              {data.longDescription && (
                <article className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-200 dark:border-zinc-800 transition-colors duration-300">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-4">Overview of {data.name}</h2>
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed text-justify">
                    {data.longDescription}
                  </p>
                </article>
              )}

              {/* ✨ Quick Features & Tech Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-zinc-800 transition-colors duration-300">
                  <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Why choose {data.name}?</h3>
                  <ul className="space-y-4">
                    {data.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start text-gray-700 dark:text-gray-300">
                        <span className="text-emerald-500 mr-3 mt-1 text-lg">✦</span>
                        <span className="font-medium text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {data.applications && (
                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-zinc-800">
                      <p className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Best For</p>
                      <div className="flex flex-wrap gap-2">
                        {data.applications.map((app: string, idx: number) => (
                          <span key={idx} className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/50 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {data.benefits && (
                  <div className="bg-slate-900 dark:bg-zinc-950 p-8 rounded-3xl shadow-sm border border-slate-800 dark:border-zinc-800 text-white transition-colors duration-300">
                    <h3 className="text-xl font-bold mb-6 text-emerald-400">Technical Specifications of {data.name}</h3>
                    <div className="space-y-6">
                      {data.benefits.map((bene: any, idx: number) => (
                        <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                          <h4 className="font-bold text-white mb-2">{bene.title}</h4>
                          <p className="text-sm text-slate-400 leading-relaxed">{bene.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 📊 Pricing, Comparison & Installation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {data.priceDetails && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-3xl border border-emerald-100 dark:border-emerald-800/30 transition-colors duration-300">
                    <h3 className="text-xl font-bold mb-4 text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                      <span className="text-2xl">💰</span> Pricing
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {data.priceDetails}
                    </p>
                  </div>
                )}
                {data.comparison && (
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-8 rounded-3xl border border-blue-100 dark:border-blue-800/30 transition-colors duration-300">
                    <h3 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100 flex items-center gap-2">
                      <span className="text-2xl">⚖️</span> Comparison
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {data.comparison}
                    </p>
                  </div>
                )}
                {data.installation && (
                  <div className="bg-amber-50 dark:bg-amber-900/10 p-8 rounded-3xl border border-amber-100 dark:border-amber-800/30 transition-colors duration-300">
                    <h3 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100 flex items-center gap-2">
                      <span className="text-2xl">🛠️</span> Installation
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {data.installation}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-200 dark:border-zinc-800 transition-colors duration-300">
                <h2 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-4">{data.name} Series & Variants</h2>
                
                {data.collections ? (
                  data.collections.map((collection: any, colIdx: number) => (
                    <div key={colIdx} className="mb-16 last:mb-0">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 bg-slate-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-slate-200 dark:border-zinc-700/50 shadow-sm transition-colors duration-300">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-800 dark:text-gray-100 mb-3">{collection.name}</h3>
                          <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
                            {collection.details && Object.entries(collection.details).slice(0, 4).map(([key, val]) => (
                              <span key={key} className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 px-3 py-1 rounded-full shadow-sm">
                                <span className="font-semibold text-gray-800 dark:text-gray-200">{key}:</span> {val as string}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 md:text-right shrink-0">
                          <span className="text-gray-500 dark:text-gray-400 line-through text-sm mr-2">{collection.mrp}</span>
                          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{collection.price}</span>
                          <span className="text-gray-600 dark:text-gray-400 font-medium ml-1 block text-sm">{collection.unit}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {collection.images && collection.images.map((img: any, idx: number) => (
                          <div key={idx} className="group flex flex-col bg-white dark:bg-zinc-800/80 rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-700 shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100 dark:bg-zinc-900">
                              <Image 
                                src={img.url}
                                alt={img.alt || img.name || `${collection.name} Variant ${idx + 1}`}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                              />
                            </div>
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-gray-100 dark:border-zinc-700/50 flex-grow flex flex-col justify-between">
                              <div>
                                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">{img.name || `Variant ${idx + 1}`}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{img.alt}</p>
                              </div>
                              <div className="flex flex-col gap-2 mt-auto">
                                <Link 
                                  href={`/contact?interest=${category.replace("-", "_")}&message=${encodeURIComponent(`Hi, I'm interested in ${collection.name} - ${img.name || 'Variant'}. Please share a quote.`)}`}
                                  className="w-full py-2 bg-black dark:bg-zinc-700 hover:bg-gray-800 dark:hover:bg-zinc-600 text-white text-center text-sm font-semibold rounded-xl transition-colors duration-300"
                                >
                                  Get Quote
                                </Link>
                                <a 
                                  href={`https://wa.me/917217644573?text=Hi,%20I'm%20interested%20in%20your%20${encodeURIComponent(collection.name)}%20(${encodeURIComponent(img.name || 'Variant')}).%20Please%20share%20details.`}
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="flex items-center justify-center gap-2 w-full py-2 bg-[#25D366] hover:bg-[#20b858] text-white text-sm font-semibold rounded-xl transition-colors duration-300"
                                >
                                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.883-.653-1.48-1.459-1.653-1.756-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.37-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                  </svg>
                                  WhatsApp
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="dark:text-gray-400">No variants found.</p>
                )}
              </div>

              {/* 💬 Frequently Asked Questions (SEO Goldmine) */}
              {data.faqs && (
                <div className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-200 dark:border-zinc-800 transition-colors duration-300">
                  <h2 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-white border-b border-gray-200 dark:border-zinc-800 pb-4">FAQs about {data.name}</h2>
                  <div className="space-y-4">
                    {data.faqs.map((faq: any, idx: number) => (
                      <details key={idx} className="group border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl [&_summary::-webkit-details-marker]:hidden transition-colors duration-300">
                        <summary className="flex cursor-pointer items-center justify-between p-6 text-gray-900 dark:text-gray-100 font-semibold md:text-lg">
                          {faq.question}
                          <span className="relative ml-4 shrink-0 transition duration-300 group-open:-rotate-180">
                            <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </span>
                        </summary>
                        <div className="px-6 pb-6 text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {data.relatedLinks && data.relatedLinks.length > 0 && (
                <div className="mt-16">
                  <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100 flex items-center gap-3">
                    <span className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">🔗</span>
                    Related Dimensional Products
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.relatedLinks.map((link: any, idx: number) => (
                      <Link
                        key={idx}
                        href={link.url}
                        className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 hover:border-emerald-500 transition-all shadow-sm hover:shadow-xl"
                      >
                        {link.image && (
                          <div className="relative aspect-video w-full overflow-hidden">
                            <Image 
                              src={link.image} 
                              alt={link.title} 
                              fill 
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-emerald-500 transition-colors text-sm">
                            {link.title}
                          </h4>
                          <span className="text-emerald-500 text-xs font-semibold mt-2 inline-block">Explore Dimension &rarr;</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>



      </div>
    </>
  );
}
