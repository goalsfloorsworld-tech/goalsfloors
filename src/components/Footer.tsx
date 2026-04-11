"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Instagram, ArrowUp } from "lucide-react";

// Premium WhatsApp Branded SVG
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const productCategories = [
  { name: "Wall Panels", href: "/products?category=wall-panels" },
  { name: "Exterior & Outdoor", href: "/products?category=outdoors" },
  { name: "Premium Flooring", href: "/products?category=premium-flooring" },
  { name: "Architectural Ceilings", href: "/products?category=ceilings" },
];

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Become a Dealer", href: "/dealer" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-black text-white">

      {/* ─── Top Gradient Bar ─── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-60" />

      {/* ─── Main Body ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-4 gap-y-12 lg:gap-8 items-start">

          {/* ── Col 2 – Contact (swapped with Products + Links area) ── */}
          <div className="col-span-2 lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-2">
            <ul className="space-y-4 lg:space-y-4 text-[13px] w-full max-w-xs mx-auto lg:mx-0">
              <li className="flex items-center justify-center lg:justify-start lg:items-start gap-4 text-gray-400 text-left">
                <span className="leading-tight text-center lg:text-left">
                  H-36/27A, H-Block, Sikanderpur, DLF Phase-1, Gurugram – 122002
                </span>
              </li>
              <li className="flex items-center justify-center lg:justify-start gap-4 text-left">
                <div className="bg-white/5 p-2 rounded-lg shrink-0">
                  <Phone className="w-4 h-4 text-amber-500" />
                </div>
                <a href="tel:+917217644573" className="text-gray-300 hover:text-amber-400 transition-colors font-medium">
                  +91 72176 44573
                </a>
              </li>
              <li className="flex items-center justify-center lg:justify-start gap-4 text-left">
                <div className="bg-white/5 p-2 rounded-lg shrink-0">
                  <Mail className="w-4 h-4 text-amber-500 text-left" />
                </div>
                <a href="mailto:goalsfloors@gmail.com" className="text-gray-300 hover:text-amber-400 transition-colors font-medium">
                  goalsfloors@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* ── Col 1 – Brand (order-1 on mobile = TOP, order-1 on desktop) ── */}
          <div className="col-span-2 lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 order-1 lg:order-1">
            {/* Logo – always white version on black bg */}
            <Link href="/" aria-label="Goals Floors Home">
              <Image
                src="/images/goals-floors-logo-white.svg"
                alt="Goals Floors Logo"
                width={160}
                height={40}
                className="h-9 w-auto object-contain mx-auto lg:mx-0"
              />
            </Link>

            <p className="text-gray-400 text-[13px] leading-relaxed max-w-xs mx-auto lg:mx-0">
              Elevating spaces with premium architectural surfaces — your trusted partner for luxury flooring &amp; panels in Delhi NCR.
            </p>

            {/* Products + Links Block */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 w-full max-w-xs mx-auto lg:mx-0 lg:max-w-sm">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500 mb-6">
                  Products
                </h3>
                <ul className="flex flex-col items-center lg:items-start gap-3">
                  {productCategories.map((p) => (
                    <li key={p.href}>
                      <Link
                        href={p.href}
                        className="text-gray-400 hover:text-white text-[13px] transition-colors duration-200 group flex items-center gap-1.5"
                      >
                        <span className="w-1 h-1 rounded-full bg-amber-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500 mb-6">
                  Links
                </h3>
                <ul className="flex flex-col items-center lg:items-start gap-3">
                  {navLinks.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-gray-400 hover:text-white text-[13px] transition-colors duration-200 group flex items-center gap-1.5"
                      >
                        <span className="w-1 h-1 rounded-full bg-amber-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        {l.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Social Icons - Below contact info */}
            <div className="flex items-center justify-center lg:justify-start gap-3 pt-2">
              <a
                href="https://www.instagram.com/goalsfloors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-pink-500 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.google.com/maps/dir//Goals+Floors,+H-36%2F27A,+H-Block,+Sikanderpur,+DLF+Phase-1,+Gurugram,+Haryana+122002"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google Maps Showroom Location"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300"
              >
                <MapPin className="w-4 h-4" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="WhatsApp Contact"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-green-500 hover:border-green-500/50 hover:bg-green-500/10 transition-all duration-300"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* ── Col 4 – CTA Card (Full width on mobile) ── */}
          <div className="col-span-2 lg:col-span-4 flex flex-col items-center lg:items-end mt-4 lg:mt-0 order-4">
            <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.03] backdrop-blur-sm w-full lg:max-w-none text-center lg:text-left relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-600/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-amber-600/10 transition-colors" />
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">Free Estimate</p>
              <p className="text-white font-bold text-lg mb-6 leading-tight">
                Get expert advice for your space.
              </p>
              <Link
                href="/contact"
                className="inline-flex w-full lg:w-auto shine-btn justify-center items-center gap-2 bg-amber-600 hover:bg-amber-500 text-black text-xs font-bold px-6 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-600/20 active:scale-95 uppercase tracking-widest"
              >
                Get a Quote
                <ArrowUp className="w-3.5 h-3.5 rotate-45" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ─── Bottom Bar ─── */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Goals Floors. All rights reserved. &nbsp;·&nbsp; Gurugram, Haryana, India
          </p>

          <button
            onClick={scrollToTop}
            className="group shine-btn flex items-center gap-2 text-xs text-gray-600 hover:text-amber-400 transition-colors font-medium uppercase tracking-wider"
          >
            Back to Top
            <div className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center group-hover:border-amber-500/50 group-hover:bg-amber-500/10 transition-all">
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
