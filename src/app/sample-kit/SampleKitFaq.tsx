"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "What is the official GOALS Catalog?",
    answer:
      "The GOALS Catalog is the flagship architectural specifier folder produced by Goals Floors. It contains authentic production swatches of interior fluted louvers, acoustic wooden wall panels, UV marble panels, installation accessories (clips and L-profiles), and technical certificates.",
  },
  {
    question: "Is GOALS the same brand as Goals Floors?",
    answer:
      "Yes! GOALS is the registered brand mark under which Goals Floors India manufactures and distributes its premium wall panel and flooring lines. While the company is Goals Floors, our physical folders and panels carry the iconic 'GOALS' marque.",
  },
  {
    question: "What products are available under the GOALS brand?",
    answer:
      "The complete portfolio includes GOALS Panels (WPC & Charcoal Louvers), GOALS Flooring (SPC, Engineered Wood, Herringbone), GOALS PU Stone 3D claddings, GOALS Tokyo Moldings, and GOALS Artificial Grass.",
  },
  {
    question: "How does the 100% Credit Guarantee work?",
    answer:
      "When you pay ₹499 for the physical GOALS folder, the entire ₹499 is automatically deducted from your invoice as soon as you order material for your project. This guarantees the sample kit is effectively 100% FREE for all customers.",
  },
  {
    question: "How fast is delivery in Gurgaon & Delhi NCR?",
    answer:
      "Orders placed before 2:00 PM are dispatched via same-day express courier across Gurgaon, South Delhi, West Delhi, Noida, and Faridabad. Pan-India shipping is completed within 2–4 business days.",
  },
  {
    question: "Can architects request custom finish selections?",
    answer:
      "Yes! In addition to our pre-curated 10-piece standard catalog, architects and project specifiers can request custom swatch selections directly from our warehouse inventory for just ₹100 extra.",
  },
];

export default function SampleKitFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-3">
      {FAQS.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
              isOpen
                ? "bg-slate-900/95 border-amber-500/40 shadow-lg shadow-amber-500/5"
                : "bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90"
            }`}
          >
            <button
              type="button"
              onClick={() => toggleFaq(index)}
              className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
              aria-expanded={isOpen}
            >
              <span className="text-sm sm:text-base font-bold text-white flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs flex items-center justify-center font-bold shrink-0">
                  {index + 1}
                </span>
                {item.question}
              </span>
              <div
                className={`p-1.5 rounded-lg bg-slate-800 text-slate-400 transition-transform duration-300 shrink-0 ${
                  isOpen ? "rotate-180 bg-amber-500/20 text-amber-400" : ""
                }`}
              >
                <ChevronDown size={16} />
              </div>
            </button>

            {isOpen && (
              <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 animate-in fade-in duration-200">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
