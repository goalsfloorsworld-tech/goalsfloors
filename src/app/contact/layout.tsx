import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Goals Floors | Premium Architectural Surfaces in Delhi NCR",
  description: "Get a quote from Goals Floors. We supply and install premium WPC louvers, luxury laminate flooring, and baffle ceilings for commercial and residential projects in Gurugram, Delhi, and Noida.",
  keywords: [
    "Goals Floors contact", 
    "WPC louvers supplier Gurugram", 
    "Premium laminate flooring Delhi", 
    "Architectural surfaces NCR", 
    "Baffle ceilings contractor",
    "Buy wooden flooring Gurgaon"
  ],
  alternates: {
    canonical: "https://www.goalsfloors.com/contact",
  },
  openGraph: {
    title: "Contact Goals Floors | Request a Quote",
    description: "Schedule a consultation or visit our corporate showroom in Gurugram for premium interior surface solutions.",
    url: "https://www.goalsfloors.com/contact",
    siteName: "Goals Floors",
    locale: "en_IN",
    type: "website",
    // Agar WhatsApp/LinkedIn par link share karoge toh ye image dikhegi
    images: [
      {
        url: "/images/goals-floors-og.jpg", // Future me ek achi banner image yahan daal dena
        width: 1200,
        height: 630,
        alt: "Goals Floors Experience Center",
      },
    ],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
