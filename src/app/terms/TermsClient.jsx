"use client";

import React, { useState, useEffect } from "react";

export default function TermsClient() {
  const [activeSection, setActiveSection] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const termsSections = [
    {
      id: "dealership",
      title: "Dealership Appointment & Exclusivity",
      intro: "Goals Floors does not grant strict territorial exclusivity to any single dealer in a given market. Instead, qualified retail inquiries are routed based on our transparent 'Trust Score' framework, evaluated against three core benchmarks:",
      points: [
        {
          title: "Dealer Tenure",
          desc: "The longevity and track record of your relationship as an authorized Goals Floors partner."
        },
        {
          title: "Purchase Volume & Consistency",
          desc: "Your historical order volumes, active showroom stock levels, and prompt payment compliance."
        },
        {
          title: "Geographical Proximity",
          desc: "Physical distance between your showroom/warehouse and the customer's project site in Delhi NCR."
        }
      ],
      outro: "Dealers with top-tier Trust Scores receive local retail leads with zero commission. The mandatory condition is that Goals Floors materials must be specified and installed for these projects. Physical sample catalogs are provided at ₹1,500 per binder."
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
      intro: "Goals Floors reserves the right to immediately suspend, block, or permanently terminate a dealer's account without prior notice if they engage in any of the following violations:",
      points: [
        {
          title: "Counterfeit Products",
          desc: "Selling cheap non-genuine or substitute products using the Goals Floors brand name."
        },
        {
          title: "Financial Irregularities",
          desc: "Committing payment fraud, issuing dishonored/bouncing cheques, or defaulting on commercial dues."
        },
        {
          title: "Staff Misconduct",
          desc: "Abusive or unprofessional behavior toward company personnel, logistical drivers, or support staff."
        },
        {
          title: "Reputational Damage",
          desc: "Engaging in misleading trade practices that damage the reputation or market goodwill of Goals Floors."
        }
      ]
    },
    {
      id: "force-majeure",
      title: "Unforeseen Events (Force Majeure)",
      content: "Goals Floors will not be held responsible for any delays in delivery or service caused by events outside our control. This includes natural disasters, heavy floods, government curfews, strikes, riots, or global pandemics."
    },
    {
      id: "sample-kit-policy",
      title: "Sample Kit & Catalog 100% Refund Policy",
      intro: "Physical sample kits and architectural catalogs (such as the GOALS™ Specifier Kit) require an upfront commitment fee (₹499 for specifier kits or ₹1,500 for dealership catalogs). This fee is 100% refundable as an invoice credit against commercial material orders under the following transparent conditions:",
      points: [
        {
          title: "Minimum Qualifying Order",
          desc: "To claim a 100% refund on 1 (one) sample kit or catalog, you must place an order for a minimum of 100 panels (equivalent to 10 standard boxes) within 30 calendar days from the date of purchasing the kit."
        },
        {
          title: "Pro-Rata Credit for Multiple Catalogs",
          desc: "If you purchase more than one catalog or sample kit, the refund operates on a strict 1:1 qualifying ratio. Each individual catalog refund requires a corresponding minimum order of 100 panels (10 boxes). For example, a refund for 2 catalogs requires a minimum order of 200 panels (20 boxes); 3 catalogs require at least 300 panels (30 boxes), and so on."
        },
        {
          title: "Bill Adjustment",
          desc: "Upon confirming your qualifying order within the 30-day window, the eligible catalog fee will be credited and deducted directly from your final commercial material invoice."
        },
        {
          title: "Non-Refundable Scope",
          desc: "Orders placed after the 30-day period has expired, or orders below the 100-panel threshold, do not qualify for a sample kit refund, and sample kit fees are otherwise strictly non-refundable."
        }
      ]
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

    if (typeof window !== "undefined" && window.location.hash) {
      const targetId = window.location.hash.replace("#", "");
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        setTimeout(() => {
          const y = targetEl.getBoundingClientRect().top + window.scrollY - 140;
          window.scrollTo({ top: y, behavior: "smooth" });
          setActiveSection(targetId);
        }, 150);
      }
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-amber-100 dark:selection:bg-amber-900/30">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-14 xl:px-16 2xl:px-20 mx-auto pt-8 md:pt-10 pb-8 md:pb-10 flex flex-col md:flex-row gap-8 md:gap-14 lg:gap-16">
        {/* Sticky Sidebar Navigation */}
        <aside className="md:w-1/4 lg:w-[22%] shrink-0 hidden md:block relative">
          <div className="sticky top-[50vh] -translate-y-1/2">
            <p className="text-xs font-semibold tracking-widest text-slate-400 dark:text-zinc-600 uppercase mb-8">
              Contents
            </p>
            <ul className="space-y-5 text-base">
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
                    className={`transition-all duration-300 block ${
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
        <main className="md:w-3/4 lg:w-[78%] flex-1">
          <header className="mb-12 md:mb-16 text-center md:text-left pt-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-slate-900 dark:text-white mb-4 md:mb-6">
              Terms &amp; Conditions
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-zinc-300 font-normal leading-relaxed max-w-3xl">
              The foundation of our partnership. Clear, undeniable terms designed to set mutual expectations.
            </p>
          </header>

          <div className="space-y-12">
            {termsSections.map((s) => (
              <section id={s.id} key={s.id} className="scroll-mt-24 border-b border-slate-100 dark:border-zinc-900 pb-10 last:border-b-0">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mb-4">
                  {s.title}
                </h2>
                <div className="text-base md:text-lg text-slate-800 dark:text-zinc-300 font-normal leading-relaxed space-y-4 text-left">
                  {s.intro && <p className="leading-relaxed">{s.intro}</p>}
                  {s.content && <p className="leading-relaxed">{s.content}</p>}
                  {s.points && (
                    <ul className="space-y-3.5 my-4 pl-1 sm:pl-2">
                      {s.points.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs shrink-0 mt-0.5 border border-amber-500/20">
                            {idx + 1}
                          </span>
                          <div className="leading-relaxed">
                            {typeof pt === "string" ? (
                              <span>{pt}</span>
                            ) : (
                              <>
                                <strong className="text-slate-900 dark:text-white font-semibold">{pt.title}: </strong>
                                <span className="text-slate-700 dark:text-zinc-300">{pt.desc}</span>
                              </>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.outro && <p className="leading-relaxed mt-3">{s.outro}</p>}
                </div>
              </section>
            ))}
          </div>

          <footer className="mt-16 md:mt-24 pt-8 md:pt-10 flex flex-row items-center justify-between border-t border-slate-300 dark:border-white/10">
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
