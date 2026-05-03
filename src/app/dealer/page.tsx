import { Metadata } from "next";
import DealerHero from "@/components/dealer/DealerHero";
import DealerWizard from "@/components/dealer/DealerWizard";
import { TrustBar, WhyPartnerGrid, FAQAccordion } from "@/components/dealer/DealerSections";

export const metadata: Metadata = {
  title: "Become a Dealer - Goals Floors | Premium Wall Panels & Flooring NCR",
  description: "Join India's fastest-growing luxury surface brand. 40%-50% margins, 2-hour dispatch, and free Local SEO articles for top dealers to boost your business reach in Delhi NCR.",
  keywords: ["WPC wall panels dealer", "SPC flooring distributor Delhi", "Local SEO for flooring dealers", "Goals Floors partnership", "luxury surfaces wholesale"],
  alternates: {
    canonical: "/dealer",
  },
};

export default function DealerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Goals Floors Dealer Partnership Program",
    "description": "Exclusive dealership opportunities for premium architectural surfaces with free Local SEO promotion for partners in Delhi NCR.",
    "provider": {
      "@type": "Organization",
      "name": "Goals Floors",
      "url": "https://goalsfloors.com",
      "logo": "https://goalsfloors.com/logo.png",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "New Delhi",
        "addressRegion": "NCR",
        "addressCountry": "IN"
      }
    },
    "areaServed": "Delhi NCR",
    "offers": {
      "@type": "Offer",
      "description": "40% to 50% dealer margins and free SEO-optimized business articles."
    }
  };

  return (
    <main className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen selection:bg-amber-600 selection:text-white transition-colors duration-500">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 1. Hero Section */}
      <DealerHero />

      {/* 2. Trust Bar Section */}
      <TrustBar />

      {/* 3. Why Partner With Us & Rules Section */}
      <WhyPartnerGrid />

      {/* 4. The Form Wizard */}
      <section id="apply" className="relative border-t border-slate-200 dark:border-white/10">
        <DealerWizard />
      </section>

      {/* 5. B2B FAQ Section */}
      <FAQAccordion />

    </main>
  );
}
