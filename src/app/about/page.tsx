import { Metadata } from "next";
import AboutClient from "@/components/AboutClient";

export const metadata: Metadata = {
  title: "About Goals Floors | India's Fastest Growing Wall Panel & Flooring Brand in Delhi NCR",
  description: "Learn about Goals Floors — NCR's fastest-growing luxury surface brand. Premium wall panels & flooring at honest prices. 2-Hour express dispatch from Sikanderpur, Gurugram. Founded by Shakti FTN.",
  keywords: ["Goals Floors About", "Wall Panels Gurugram", "Flooring Delhi NCR", "Luxury Surface Brand India", "Shakti FTN", "Sikanderpur Showroom"],
  openGraph: {
    title: "About Goals Floors | Premium Surfaces, 2-Hour Dispatch, Delhi NCR",
    description: "Discover the story behind India's fastest-growing wall panel and flooring brand. Premium materials, honest prices, and industry-first 2-hour dispatch in Gurugram & Delhi NCR.",
    url: "https://goalsfloors.com/about",
    images: [
      {
        url: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775749425/Goals_Floors_Wpc_Exterior_Louvers.png",
        width: 1200,
        height: 630,
        alt: "Goals Floors Premium Wall Panels and Flooring in Delhi NCR",
      },
    ],
  },
  alternates: {
    canonical: "https://goalsfloors.com/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}