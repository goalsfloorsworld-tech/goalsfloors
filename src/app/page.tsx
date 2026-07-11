import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import Counter from "@/components/Counter";
import { Truck, Trophy, CheckCircle2, ShieldCheck, Users, Settings, Lock, PenTool, Leaf } from "lucide-react";
import HeroSection from "@/components/home/HeroSection";

const Testimonials = dynamic(() => import("@/components/Testimonials"));
const BrandMarquee = dynamic(() => import("@/components/BrandMarquee"));
const CategoryFlipCards = dynamic(() => import("@/components/home/CategoryFlipCards"));
const GetAQuoteMonolith = dynamic(() => import("@/components/home/GetAQuoteMonolith"));
const AdvantageImage = dynamic(() => import("@/components/home/AdvantageImage"));
const CompareWidget = dynamic(() => import("@/components/CompareWidget"));
const QuickCategoryGrid = dynamic(() => import("@/components/home/QuickCategoryGrid"));
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden max-w-full min-w-0">

      <HeroSection />

      {/* ================= STATS BAR ================= */}
      <div className="w-full bg-[#f6f2ea] dark:bg-[#0F172A] relative z-20 transition-colors duration-300">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#15171e] dark:bg-slate-900 -mt-8 sm:-mt-12 lg:-mt-[116px] w-full lg:max-w-[900px] shadow-2xl transition-colors duration-300 rounded-xl border border-white/5 dark:border-gray-800 p-3 sm:p-6 lg:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4">
          {[
            { label: "PREMIUM PRODUCTS", value: "2500+", icon: Settings },
            { label: "HAPPY CLIENTS", value: "20K+", icon: Lock },
            { label: "DEALERS", value: "400+", icon: PenTool },
            { label: "WARRANTY BACKED", value: "90%", icon: Leaf },
          ].map((stat, i) => (
            <div 
              key={i} 
              className={`flex items-center gap-3 sm:gap-4 overflow-hidden ${
                i === 0 ? 'border-b border-r lg:border-b-0 border-[#2a2d36] pb-4 pr-2 sm:pb-6 sm:pr-3 lg:pb-0 lg:pr-3 xl:pr-6' :
                i === 1 ? 'border-b lg:border-b-0 lg:border-r border-[#2a2d36] pb-4 pl-2 sm:pb-6 sm:pl-4 lg:pb-0 lg:px-3 xl:px-6' :
                i === 2 ? 'border-r border-[#2a2d36] pt-4 pr-2 sm:pt-6 sm:pr-3 lg:pt-0 lg:px-3 xl:px-6' :
                'pt-4 pl-2 sm:pt-6 sm:pl-4 lg:pt-0 lg:pl-3 xl:pl-6'
              }`}
            >
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-600/40 bg-white/5 flex items-center justify-center text-gray-400">
                <stat.icon className="w-5 h-5 sm:w-5 sm:h-5" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col text-left overflow-hidden">
                <Counter
                  value={stat.value}
                  className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight"
                />
                <div className="text-[9px] sm:text-[10px] text-gray-400 font-semibold tracking-[0.1em] mt-0.5 whitespace-nowrap">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
      </div>

      {/* ================= QUICK APP CATEGORIES ================= */}
      <QuickCategoryGrid />

      {/* ================= CATEGORIES SECTION ================= */}
      <section id="categories" className="py-10 pt-33 lg:pt-36 bg-gray-50 dark:bg-slate-950 transition-colors duration-300 -mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 lg:mb-16">
            <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-gray-900 dark:text-white mb-4 tracking-tighter uppercase leading-[0.9]">
              Explore Our <br />
              <span className="text-amber-500 italic">Collections</span>
            </h2>
            <p className="text-gray-500 dark:text-slate-400 max-w-xl mx-auto text-sm font-medium tracking-wide">
              Discover world-class interior and exterior architectural solutions crafted for premium Gurugram homes.
            </p>
          </div>

          <CategoryFlipCards />

          {/* Compare AI Lead Magnet */}
          <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-10 pb-2 sm:pb-10">
            <CompareWidget />
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="pt-2 sm:pt-8 pb-14 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch min-w-0 max-w-full">
            <div className="min-w-0">
              <h2 className="text-[28px] sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 tracking-tighter sm:whitespace-nowrap break-words">The Goals Floors Advantage</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-justify">We don&apos;t just supply surfaces; we deliver the speed, scale, and innovation that your luxury projects deserve.</p>

              {/* Mobile Image - Shown only on small screens */}
              <div className="relative h-[400px] sm:h-[500px] md:h-[650px] w-full mb-10 lg:hidden group/img">
                {/* Intensified Background Glow for Mobile */}
                <div className="absolute -inset-6 bg-amber-500/30 blur-[60px] rounded-full opacity-60 animate-pulse" />

                <div className="relative h-full w-full rounded-sm overflow-hidden shadow-[0_0_50px_rgba(251,191,36,0.3)] z-10 transition-transform duration-500 group-hover/img:scale-[1.02]">
                  <Image
                    src="https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775749408/Goals_Floors_Fluted_Panel.jpg"
                    alt="Professional interior wood flooring and wall paneling installation in Gurugram and Delhi NCR - Goals Floors Architectural Excellence"
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { icon: Truck, title: "2-Hour Express Dispatch", desc: "NCR’s fastest logistics ensure your material reaches the site in Gurgaon & NCR within just 2 hours. We value your time so your project never hits a standstill." },
                  { icon: Trophy, title: "2500+ Designs | 400+ Dealers", desc: "Explore India’s most expansive curated collection. Our massive distributor network ensures project pricing and immediate stock availability for any project size." },
                  { icon: CheckCircle2, title: "Quarterly New Product Launches", desc: "Stay ahead of global trends. We refresh our catalog every 3-4 months, bringing the latest international textures in Wall Panels and Flooring to Gurgaon first." },
                  { icon: ShieldCheck, title: "90% Our Products are Warranty Backed Quality", desc: "Transparency over tall claims. Over 90% of our product range comes with official manufacturer warranties, ensuring long-term performance and total peace of mind." },
                  { icon: Users, title: "Professional Technical Guidance", desc: "Beyond supply, we are your technical partners. Our experts provide precise advice on material suitability, helping you choose the perfect finish for every space." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-700 dark:text-amber-500">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-justify leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <AdvantageImage />
          </div>
        </div>
      </section>
      <BrandMarquee />

      <Testimonials />

      <GetAQuoteMonolith />

    </div>
  );
}
