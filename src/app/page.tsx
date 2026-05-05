import Image from "next/image";
import Link from "next/link";
import Counter from "@/components/Counter";
import Testimonials from "@/components/Testimonials";
import BrandMarquee from "@/components/BrandMarquee";
import CategoryFlipCards from "@/components/home/CategoryFlipCards";
import GetAQuoteMonolith from "@/components/home/GetAQuoteMonolith";
import { Truck, Trophy, CheckCircle2, ShieldCheck, Users } from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import AdvantageImage from "@/components/home/AdvantageImage";



export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden max-w-full min-w-0">

      <HeroSection />

      {/* ================= STATS BAR ================= */}
      <div className="bg-white dark:bg-slate-900 py-8 border-b border-gray-100 dark:border-gray-800 relative z-20 -mt-8 sm:-mt-12 lg:-mt-14 mx-4 sm:mx-8 lg:mx-auto max-w-6xl shadow-[0_30px_70px_rgba(0,0,0,0.15)] dark:shadow-none transition-colors duration-300 rounded-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 px-4 md:px-6">
          {[
            { label: "Premium Products", value: "2500+" },
            { label: "Happy Clients", value: "20K+" },
            { label: "Dealers", value: "400+" },
            { label: "Warranty Backed", value: "90%" },
          ].map((stat, i) => (
            <div key={i} className="text-center overflow-hidden px-1">
              <Counter
                value={stat.value}
                className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
              />
              <div className="text-[9px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider md:tracking-widest mt-2 whitespace-nowrap">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= CATEGORIES SECTION ================= */}
      <section id="categories" className="py-10 pt-28 lg:pt-36 bg-gray-50 dark:bg-slate-950 transition-colors duration-300 -mt-24">
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
        </div>
      </section>


      {/* ================= WHY CHOOSE US ================= */}
      <section className="pt-8 pb-14 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch min-w-0 max-w-full">
            <div className="min-w-0">
              <h2 className="text-[28px] sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 tracking-tighter sm:whitespace-nowrap break-words">The Goals Floors Advantage</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-justify">We don&apos;t just supply surfaces; we deliver the speed, scale, and innovation that your luxury projects deserve.</p>

              {/* Mobile Image - Shown only on small screens */}
              <div className="relative h-[400px] w-full mb-10 lg:hidden group/img">
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
