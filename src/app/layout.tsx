import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import WhatsAppFloat from "@/components/whatsapp-float";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://goalsfloors.com"),
  title: "Goals Floors: India’s Fastest Growing Wall Panels & Flooring Brand",
  description: "Goals Floors: India's Fastest Growing Wall Panels & Flooring Brand. Unmatched Quality in Wall Panels & Flooring | 90% Warranty Backed | 400+ Partners | 2-Hour Express Material Supply in Gurgaon & NCR.",
  keywords: ["Wall Panels", "Flooring", "WPC Louvers", "SPC Flooring", "Charcoal Moulding", "Delhi NCR", "Gurugram", "PU Stone"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://goalsfloors.com",
    title: "Goals Floors: Premium Wall Panels & Flooring in Delhi NCR",
    description: "Unmatched Quality in Wall Panels & Flooring | 90% Warranty Backed | 400+ Partners | 2-Hour Express Material Supply in Gurgaon & NCR.",
    siteName: "Goals Floors",
    images: [
      {
        url: "https://res.cloudinary.com/dcezlxt8r/image/upload/v1775448942/goals-floors-og.jpg",
        width: 1200,
        height: 630,
        alt: "Goals Floors Premium Panels",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Goals Floors: Premium Architectural Products",
    description: "India's fastest growing brand for Wall Panels, WPC, and Flooring in Delhi NCR.",
    images: ["https://res.cloudinary.com/dcezlxt8r/image/upload/v1775573402/Goals_Floors_Premium_Wall_Panel.png"],
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

import SmoothScrolling from "@/components/SmoothScrolling";
import GoalsAIWidget from "@/components/GoalsAIWidget";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* suppressHydrationWarning is essential for dark mode hydration */}
      <body className={`${inter.className} antialiased bg-white dark:bg-slate-950 pt-14`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <SmoothScrolling>
            <div className="relative overflow-clip">
              <Navbar />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
              <WhatsAppFloat />
              <GoalsAIWidget />
            </div>
          </SmoothScrolling>
        </ThemeProvider>
      </body>
    </html>
  );
}