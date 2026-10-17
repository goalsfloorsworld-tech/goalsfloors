import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, ShieldCheck, MapPin, Layers, PhoneCall } from "lucide-react";
import { WALL_PANELS_EXPERIENCE } from "@/data/wall-panels-experience";

export const metadata: Metadata = {
  title: "Architectural Wall Panels Gurgaon | Primo, Elite & Aura Collections - Goals Floors",
  description: "Explore India's premier fluted WPC, acoustic charcoal, and Scandinavian white oak wall panels. 100% waterproof, termite-proof, with interactive 3D room simulations. Wholesale rates in Gurgaon & Delhi NCR.",
  alternates: {
    canonical: "https://goalsfloors.com/wall-panels",
  },
};

export default function WallPanelsHubPage() {
  const panels = Object.values(WALL_PANELS_EXPERIENCE);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-amber-400 selection:text-black pt-16 pb-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-amber-600/20 via-orange-950/20 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-amber-300 uppercase mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Product Multiverse</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extralight tracking-tight uppercase text-white mb-6 leading-tight">
            Architectural <br className="hidden sm:inline" />
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
              Wall Panels
            </span>
          </h1>

          <p className="text-neutral-300 text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Step beyond conventional flat walls. Choose your architectural expression below to enter an interactive 3D scrollytelling experience complete with layer deconstruction and lighting simulations.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-neutral-400 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Damp-Proof Seelan Immunity
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-amber-400" />
              Gurgaon Direct Wholesale Warehouse
            </span>
          </div>
        </div>

        {/* 3 Showcase Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {panels.map((panel) => (
            <div
              key={panel.slug}
              className="group relative rounded-3xl bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-white/15 p-6 flex flex-col justify-between shadow-2xl hover:border-amber-400/60 transition-all duration-500 hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]"
            >
              <div>
                {/* Hero Showcase Image */}
                <div className="relative w-full h-80 rounded-2xl overflow-hidden mb-6 border border-white/10 bg-neutral-950">
                  <Image
                    src={panel.heroImage}
                    alt={panel.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-amber-300">
                    {panel.dimensions.thickness}
                  </div>
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
                    {panel.startingPrice}/sq.ft
                  </div>
                </div>

                {/* Subtitle & Title */}
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 block mb-1">
                  {panel.badge}
                </span>
                <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                  {panel.name}
                </h2>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                  {panel.tagline}
                </p>

                {/* Mini Features List */}
                <div className="space-y-2 border-t border-white/5 pt-4 mb-6">
                  {panel.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-neutral-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span className="font-medium text-white">{feat.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/wall-panels/${panel.slug}`}
                className="w-full py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-gradient-to-r hover:from-amber-400 hover:to-amber-500 hover:text-black font-semibold text-xs uppercase tracking-wider transition-all duration-300 border border-white/15 flex items-center justify-center gap-2 shadow-lg group-hover:border-transparent"
              >
                <span>Launch 3D Experience</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Banner with Warehouse Info & Contact */}
        <div className="mt-16 p-8 rounded-3xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              Visit Our Gurgaon Experience Center & Warehouse
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm">
              Touch full-length 9.5ft samples, compare flute profiles under true studio lighting, and get instant wholesale site estimates.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://wa.me/917217644573?text=Hi%20Goals%20Floors,%20I%20want%20to%20visit%20the%20Gurgaon%20warehouse%20to%20see%20wall%20panels."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-full bg-[#25D366] text-black font-semibold text-xs tracking-wider uppercase transition-all shadow-lg hover:scale-105"
            >
              WhatsApp Us
            </a>
            <a
              href="tel:+917217644573"
              className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-xs tracking-wider transition-all border border-white/15 flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Direct</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
