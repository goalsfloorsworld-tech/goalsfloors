"use client";

import React, { useState, useEffect } from "react";

export default function PrivacyClient() {
  const [activeSection, setActiveSection] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const privacySections = [
    {
      id: "collection",
      title: "Information We Collect",
      intro: "When you apply to become an authorized dealer or submit an architectural project inquiry, we collect essential commercial details required to process your account:",
      points: [
        {
          title: "Contact Details",
          desc: "Full Name, Business Email Address, Phone Number, and WhatsApp contact."
        },
        {
          title: "Business Location",
          desc: "Physical showroom, retail outlet, or warehouse address (City, State, and Pincode)."
        },
        {
          title: "Verification Documents",
          desc: "Visiting card photograph, business registration, or GST identification certificate."
        },
        {
          title: "Commercial Profile",
          desc: "Estimated annual material turnover, project specialization, and brief business overview."
        }
      ]
    },
    {
      id: "sharing",
      title: "Data Sharing & Third Parties",
      intro: "Goals Floors operates under a strict 'No-Sale' privacy pledge. We never sell, rent, or trade your personal or business records to third-party marketing companies. Data is shared strictly to fulfill operational and delivery requirements:",
      points: [
        {
          title: "Logistics & Transport Agencies",
          desc: "Delivery drivers, dispatch teams, and courier partners receive your address and contact number for 2-hour dispatch and on-site material delivery."
        },
        {
          title: "Payment Gateways",
          desc: "PCI-DSS compliant payment processing platforms handle secure digital payments and tax invoices."
        },
        {
          title: "Statutory & Legal Compliance",
          desc: "Information may be disclosed to government authorities or courts strictly when mandated under Indian tax or commercial law."
        }
      ]
    },
    {
      id: "marketing",
      title: "Promotional Marketing & Communications",
      content: "Currently, Goals Floors does not send unsolicited promotional messages. In the future, we may send you important trade updates, new catalog launches, or special offers via WhatsApp, SMS, or Email. When this service starts, an easy 'Unsubscribe' or opt-out option will always be provided."
    },
    {
      id: "tracking",
      title: "Website Tracking, Analytics & Cookies",
      content: "To improve our website performance and understand dealer needs, we use Google Analytics and Meta Pixel to track website activity. Currently, we do not use login cookies, but we will introduce cookies in the near future to keep you logged in and make your portal experience faster and smoother."
    },
    {
      id: "retention",
      title: "Data Retention & Account Deletion",
      content: "Currently, there is no 'Delete Account' button on the website. If you wish to close your dealership account, please call our support team. Please note: Even if your account is deleted, the Indian Government's tax laws require us to keep your billing, invoice, and GST records securely stored in our system for a few years for audit purposes."
    },
    {
      id: "security",
      title: "Data Security",
      content: "We store your information on highly secure databases and servers. While we take the best possible security measures to protect your data, no system on the internet is 100% safe. By using our services, you accept this standard level of digital risk."
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const centerY = window.innerHeight / 2;
      let closestId = privacySections[0]?.id || "";
      let closestDistance = Number.POSITIVE_INFINITY;

      privacySections.forEach((s) => {
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
              {privacySections.map((s) => (
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
                  ? privacySections.find((s) => s.id === activeSection)?.title
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
                    {privacySections.map((s) => (
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
              Privacy Policy
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-zinc-300 font-normal leading-relaxed max-w-3xl">
              We build beautiful physical spaces, not intrusive digital ones. Your privacy is paramount.
            </p>
          </header>

          <div className="space-y-12">
            {privacySections.map((s) => (
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
