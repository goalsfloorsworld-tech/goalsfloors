"use client";

import React, { useState, useEffect } from "react";

export default function PrivacyClient() {
  const [activeSection, setActiveSection] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const privacySections = [
    {
      id: "collection",
      title: "Information We Collect",
      content: "When you apply to become a dealer, we collect necessary business information. This includes your Name, Email Address, Phone Number, Business Address (City/State), an image of your Visiting Card, your estimated annual business revenue, and a short business description that you provide."
    },
    {
      id: "sharing",
      title: "Data Sharing & Third Parties",
      content: "Goals Floors has a strict 'No Sell' policy. We do NOT sell your personal or business data to any third-party marketing companies. However, to fulfill your orders, we must share essential details (like your phone number and delivery address) with our delivery drivers, transport partners, and secure payment gateways."
    },
    {
      id: "marketing",
      title: "Promotional Marketing & Communications",
      content: "Currently, Goals Floors does not send promotional messages. In the future, we may send you important business updates, new catalog launches, or special offers via WhatsApp, SMS, or Email. When this service starts, we will always provide a clear and easy 'Unsubscribe' option if you do not wish to receive them."
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

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-amber-100 dark:selection:bg-amber-900/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 md:pt-10 pb-8 md:pb-10 flex flex-col md:flex-row gap-8 md:gap-24">
        {/* Sticky Sidebar Navigation */}
        <aside className="md:w-1/4 hidden md:block relative">
          <div className="sticky top-[50vh] -translate-y-1/2">
            <p className="text-xs font-semibold tracking-widest text-slate-400 dark:text-zinc-600 uppercase mb-8">
              Contents
            </p>
            <ul className="space-y-6 text-base">
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
        <main className="md:w-3/4">
          <header className="mb-12 md:mb-20 text-center md:text-left pt-0">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-slate-900 dark:text-white mb-4 md:mb-8">
              Privacy Policy
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-zinc-300 font-normal leading-relaxed max-w-2xl mx-auto md:mx-0">
              We build beautiful physical spaces, not intrusive digital ones. Your privacy is paramount.
            </p>
          </header>

          <div className="space-y-12">
            {privacySections.map((s) => (
              <section id={s.id} key={s.id} className="scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mb-4">
                  {s.title}
                </h2>
                <div className="text-base md:text-lg text-slate-800 dark:text-zinc-500 font-normal leading-relaxed space-y-6 text-justify">
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
