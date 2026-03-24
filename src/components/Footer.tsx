"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, ArrowUp, ArrowRight } from "lucide-react";

export default function Footer() {
    const scrollToTop = (e?: React.MouseEvent | React.TouchEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Method 1: Modern Smooth Scroll
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Method 2: Immediate Fallback scroll to top
        setTimeout(() => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }, 100);
    };

    return (
        <footer className="bg-gray-950 dark:bg-black pt-20 pb-10 border-t border-gray-900 dark:border-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Main Footer Content */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Column 1: Brand & Social */}
                    <div className="col-span-2 lg:col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
                        {/* Logo / Brand Name */}
                        <div className="flex flex-col select-none uppercase">
                            <span className="text-2xl font-bold text-white tracking-tight">
                                G<span className="text-amber-500">O</span>ALS
                            </span>
                            <span className="text-lg font-medium text-gray-400 -mt-1 tracking-[0.2em]">
                                FlOORS
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed lg:pr-4">
                            Elevating spaces with premium architectural surfaces. Your trusted partner for luxury flooring and panels in Delhi NCR.
                        </p>
                        {/* Social Icons */}
                        <div className="flex justify-center lg:justify-start gap-4 pt-2">
                            <a
                                href="https://www.instagram.com/goalsfloors"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-amber-500 hover:border-amber-500 hover:bg-amber-500/10 transition-all duration-300"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            {/* You can add more socials here later like Facebook/LinkedIn */}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="col-span-1 text-center lg:text-left">
                        <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Quick Links</h3>
                        <ul className="space-y-3">
                            {['Home', 'About Us', 'Services', 'Product Showcase', 'Blog', 'Contact Us'].map((link) => (
                                <li key={link}>
                                    <Link
                                        href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="group flex items-center justify-center lg:justify-start text-gray-400 hover:text-amber-500 transition-colors text-sm"
                                    >
                                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all hidden lg:block" />
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Our Products */}
                    <div className="col-span-1 text-center lg:text-left">
                        <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Our Products</h3>
                        <ul className="space-y-3">
                            {['WPC Wall Panels', 'Exterior Louvers', 'Premium Laminates', 'Baffle Ceilings', 'Artificial Grass'].map((product) => (
                                <li key={product}>
                                    <Link
                                        href="#categories"
                                        className="group flex items-center justify-center lg:justify-start text-gray-400 hover:text-amber-500 transition-colors text-sm"
                                    >
                                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all hidden lg:block" />
                                        {product}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact Info */}
                    <div className="col-span-2 lg:col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <ul className="space-y-4 flex flex-col items-center lg:items-start">
                            <li className="flex items-start justify-center lg:justify-start gap-3">
                                <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-400 text-sm leading-relaxed max-w-[250px] lg:max-w-none">
                                    H-36/27A, H-Block, Sikanderpur, DLF Phase-1, Near Mittal Timber, Gurugram, Haryana – 122002
                                </span>
                            </li>
                            <li className="flex items-center justify-center lg:justify-start gap-3">
                                <Phone className="w-5 h-5 text-amber-500 flex-shrink-0" />
                                <a href="tel:+917217644573" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    +91 72176 44573
                                </a>
                            </li>
                            <li className="flex items-center justify-center lg:justify-start gap-3">
                                <Mail className="w-5 h-5 text-amber-500 flex-shrink-0" />
                                <a href="mailto:goalsfloors@gmail.com" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    goalsfloors@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar: Copyright & Scroll to Top */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm text-center md:text-left">
                        © {new Date().getFullYear()} Goals Floors. All Rights Reserved.
                    </p>

                    <button
                        onClick={scrollToTop}
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            scrollToTop();
                        }}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-amber-500 active:text-amber-500 transition-colors group cursor-pointer"
                    >
                        <span className="uppercase tracking-widest font-semibold pointer-events-none">Back to Top</span>
                        <div className="w-8 h-8 rounded-sm bg-gray-900 dark:bg-gray-950 border border-gray-800 dark:border-gray-900 flex items-center justify-center group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:text-white transition-all pointer-events-none">
                            <ArrowUp className="w-4 h-4 pointer-events-none" />
                        </div>
                    </button>
                </div>

            </div>
        </footer>
    );
}
