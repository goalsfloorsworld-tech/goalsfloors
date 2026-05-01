"use client";

import React, { useState, useEffect } from "react";

export default function TermsClient() {
  const [activeSection, setActiveSection] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const termsSections = [
    {
      id: "dealership",
      title: "Dealership Appointment & Exclusivity",
      content: "Goals Floors does not give strict area exclusivity to just one dealer in a location. Instead, we share retail leads based on our 'Trust Score' system. Your Trust Score depends on three things: 1) How long you have been our dealer, 2) How much material you have bought from us, and 3) How close you are to the customer's location. If your score is good, we will forward local retail leads to you with zero commission. The only condition is that you must use Goals Floors materials for these projects. Also, please note that physical sample catalogs are not free. Each catalog folder costs exactly ₹1,500."
    },
    {
      id: "pricing",
      title: "Pricing, Margins & Payments",
      content: "Dealers get a clear margin of 40% to 50% off the website Retail Price (MRP). Please remember that GST is NOT included in this discount; GST will be added extra on your final bill. Normally, we strictly require a 100% advance payment before we send any material. However, if you have been a loyal dealer with us for a few years and buy in good quantities, we can offer you a 'Credit Facility' based on your business history. Market prices can change, but if you have made the full payment for an order, we will give you the material at the old booked rate, even if the market price increases before delivery."
    },
    {
      id: "shipping",
      title: "Logistics, Shipping & Restocking",
      content: "There is no Minimum Order Quantity (MOQ) for dealers in Gurugram and Delhi NCR. Outstation dealers must order a minimum quantity. For Gurugram/NCR, we try to deliver within 2 hours. But please note: we cannot guarantee this 2-hour time because of heavy traffic, road accidents, or driver emergencies. If a product is out of stock, it can take up to 120 hours to restock. Because of these reasons, we strongly advise you to place your orders at least 1 week (7 days) in advance. Dealers pay the delivery (freight) charges, but Goals Floors will cover the cost if the material breaks on the way."
    },
    {
      id: "liability",
      title: "Limitation of Liability (Late Deliveries)",
      content: "Goals Floors is not legally or financially responsible for any penalties, fines, or losses charged by your clients (customers/builders) due to delivery delays. It is the dealer's responsibility to manage their client's timeline and order materials 7 days in advance to avoid any project delays."
    },
    {
      id: "account-security",
      title: "Account Security & Responsibility",
      content: "As a dealer, you are completely responsible for keeping your portal password and OTPs safe. If any unauthorized person places an order using your account, you will be held 100% financially responsible for that payment."
    },
    {
      id: "termination",
      title: "Account Termination & Blocking",
      content: "Goals Floors reserves the right to immediately block or delete a dealer's account without prior warning if they are found doing any of the following: 1) Selling cheap counterfeit products using the Goals Floors brand name, 2) Doing payment fraud or bouncing cheques, 3) Misbehaving with company staff, or 4) Damaging the brand's reputation in the market."
    },
    {
      id: "force-majeure",
      title: "Unforeseen Events (Force Majeure)",
      content: "Goals Floors will not be held responsible for any delays in delivery or service caused by events outside our control. This includes natural disasters, heavy floods, government curfews, strikes, riots, or global pandemics."
    },
    {
      id: "warranty",
      title: "Warranty & Returns",
      content: "We give a 7-year warranty on our SPC flooring and Wall Panels. However, we have a strict NO RETURN policy. We will only accept a return within 3 days of delivery if the box is 100% sealed and packed. If you open a box and use even one single piece, we will not take the rest of the box back."
    },
    {
      id: "jurisdiction",
      title: "Governing Law",
      content: "These rules follow the laws of India. If there is ever any legal problem, it will only be solved in the courts of Gurugram, Haryana. All website content belongs to Goals Floors, and copying our images will result in strict legal action."
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const centerY = window.innerHeight / 2;
      let closestId = termsSections[0]?.id || "";
      let closestDistance = Number.POSITIVE_INFINITY;

      termsSections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - centerY);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = s.id;
        }
      });

      if (closestId) setActiveSection(closestId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-amber-100 dark:selection:bg-amber-900/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 md:pt-10 pb-8 md:pb-10 flex flex-col md:flex-row gap-8 md:gap-24">
        {/* Sticky Sidebar Navigation */}
        <aside className="md:w-1/4 hidden md:block">
          <div className="sticky top-32">
            <p className="text-xs font-semibold tracking-widest text-slate-400 dark:text-zinc-600 uppercase mb-8">
              Contents
            </p>
            <ul className="space-y-6 text-sm">
              {termsSections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection(s.id);
                      const el = document.getElementById(s.id);
                      if (el) {
                        const y = el.getBoundingClientRect().top + window.scrollY - 140;
                        window.scrollTo({ top: y, behavior: "smooth" });
                      }
                    }}
                    className={`transition-all duration-500 block ${
                      activeSection === s.id
                        ? "text-amber-600 dark:text-amber-500 font-semibold translate-x-2"
                        : "text-slate-500 dark:text-zinc-400 font-medium hover:text-slate-800 dark:hover:text-zinc-200"
                    }`}
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Floating Mobile Nav Pill */}
        <div className="md:hidden sticky top-20 z-40 flex justify-center mb-2 pointer-events-none">
          <div className="pointer-events-auto relative w-full max-w-[280px]">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full bg-gradient-to-b from-white to-slate-50 dark:from-zinc-800 dark:to-zinc-900 backdrop-blur-xl border border-slate-200 dark:border-zinc-700 rounded-full shadow-[0_4px_0_0_#cbd5e1,0_8px_20px_0_rgba(0,0,0,0.12)] dark:shadow-[0_4px_0_0_#09090b,0_8px_20px_0_rgba(0,0,0,0.4)] active:shadow-[0_0px_0_0_#cbd5e1,0_8px_20px_0_rgba(0,0,0,0.12)] dark:active:shadow-[0_0px_0_0_#09090b,0_8px_20px_0_rgba(0,0,0,0.4)] active:translate-y-[4px] flex items-center justify-between transition-all duration-200 px-6 py-3"
            >
              <span className="text-[15px] font-medium text-slate-800 dark:text-zinc-100 truncate">
                {activeSection
                  ? termsSections.find((s) => s.id === activeSection)?.title
                  : "Jump to section..."}
              </span>
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
                className={`text-slate-500 dark:text-zinc-400 transition-transform duration-300 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Custom Dropdown Menu */}
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setDropdownOpen(false)}></div>
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-zinc-900 backdrop-blur-3xl border border-slate-100 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 origin-top">
                  <ul className="max-h-[60vh] overflow-y-auto py-2">
                    {termsSections.map((s) => (
                      <li key={s.id}>
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            const el = document.getElementById(s.id);
                            if (el) {
                              const y = el.getBoundingClientRect().top + window.scrollY - 140;
                              window.scrollTo({ top: y, behavior: "smooth" });
                            }
                          }}
                          className={`w-full text-left px-5 py-3 text-[15px] transition-colors ${
                            activeSection === s.id
                              ? "text-amber-600 bg-amber-50/50 dark:text-amber-500 dark:bg-amber-500/10 font-medium"
                              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                          }`}
                        >
                          {s.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <main className="md:w-3/4">
          <header className="mb-12 md:mb-20 text-center md:text-left pt-0">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-slate-900 dark:text-white mb-4 md:mb-8">
              Terms & Conditions
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-zinc-300 font-normal leading-relaxed max-w-2xl mx-auto md:mx-0">
              The foundation of our partnership. Clear, undeniable terms designed to set mutual expectations.
            </p>
          </header>

          <div className="space-y-12">
            {termsSections.map((s) => (
              <section id={s.id} key={s.id} className="scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mb-4">
                  {s.title}
                </h2>
                <div className="text-lg md:text-[21px] text-slate-800 dark:text-zinc-200 font-normal leading-relaxed space-y-6 text-justify">
                  <p>{s.content}</p>
                </div>
              </section>
            ))}
          </div>

          <footer className="mt-16 md:mt-32 pt-8 md:pt-10 flex flex-row items-center justify-between border-t border-slate-300 dark:border-white/10">
            <p className="text-slate-400 dark:text-zinc-500 text-xs md:text-sm">Last updated: May 2026</p>
            <a
              href="mailto:support@goalsfloors.com"
              className="text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-500 transition-colors text-xs md:text-sm font-medium"
            >
              support@goalsfloors.com
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}
