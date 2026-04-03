import { Metadata } from "next";
import DealerHero from "@/components/dealer/DealerHero";
import DealerWizard from "@/components/dealer/DealerWizard";
import { TrustBar, WhyPartnerGrid, FAQAccordion } from "@/components/dealer/DealerSections";

export const metadata: Metadata = {
  title: "Become a Dealer - Partner with Goals Floors in Delhi NCR",
  description: "Join India's fastest-growing architectural surfaces brand. Exclusive dealership opportunities for premium interior and exterior solutions.",
};

export default function DealerPage() {
  return (
    <main className="bg-white dark:bg-slate-950 transition-colors duration-500 min-h-screen">
      
      {/* 1. B2B Hero Section - VIP Architect Theme (Client Component) */}
      <DealerHero />

      {/* 2. Trust Bar Section (Client Component for animations) */}
      <div className="py-0 md:py-0">
          <TrustBar />
      </div>

      {/* 3. The VIP Form Wizard (Client Component with complex state) */}
      <section id="apply" className="relative border-b border-slate-200 dark:border-white/5 py-0 md:py-0 transition-colors duration-500">
        <DealerWizard />
      </section>

      {/* 4. Why Partner With Us? Section (Client Component for animations) */}
      <div className="py-0">
        <WhyPartnerGrid />
      </div>

      {/* 5. B2B FAQ Section (Client Component for interactive accordion) */}
      <FAQAccordion />

    </main>
  );
}
