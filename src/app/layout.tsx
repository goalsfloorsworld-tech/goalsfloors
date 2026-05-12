import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import RouteChrome from "@/components/RouteChrome";
import OnboardingCheck from "@/components/auth/OnboardingCheck";

import { Inter, Roboto } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const roboto = Roboto({ 
  weight: ["400", "500", "700", "900"], 
  subsets: ["latin"], 
  display: "swap", 
  variable: "--font-roboto" 
});

export const metadata: Metadata = {
  metadataBase: new URL("https://goalsfloors.com"),
  title: "Goals Floors: India’s Fastest Growing Wall Panels & Flooring Brand",
  description: "Goals Floors: India's Fastest Growing Wall Panels & Flooring Brand. Unmatched Quality in Wall Panels & Flooring | 90% Warranty Backed | 400+ Dealers | 2-Hour Express Material Supply in Gurgaon & NCR.",
  alternates: {
    canonical: "/",
  },
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
    images: ["https://res.cloudinary.com/dcezlxt8r/image/upload/v1775448942/goals-floors-og.jpg"],
  },
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' } ,
    ],
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
  },
  verification: {
    google: [
      "oU2AKS2XI0vdkHcoFkx_WswqEvbBFI06kvXb2rfZlpM",
      "rqgEDkWeT5A3SjaDOTOICY2wyEPzmJs6vakiwJj3vYI"
    ],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Goals Floors",
  "url": "https://goalsfloors.com",
  "logo": "https://goalsfloors.com/images/goals%20floors%20logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-7217644573",
    "contactType": "sales",
    "areaServed": "IN",
    "availableLanguage": ["English", "Hindi"]
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className="overflow-x-hidden scrollbar-hide">
        <head>
        <meta name="deployment" content="v2.3-production-fixes-2026-04-26" />
        {/* Deployment: 2026-04-26 | All 6 critical production fixes applied | Build: fixes-v2.1 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      {/* suppressHydrationWarning is essential for dark mode hydration */}
      <body suppressHydrationWarning className={`${inter.className} ${roboto.variable} antialiased bg-white dark:bg-slate-950 overflow-x-hidden scrollbar-hide`}>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '743951148712714');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=743951148712714&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <OnboardingCheck />
          <RouteChrome>{children}</RouteChrome>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-6Z28W9Y8PY" />
      </html>
    </ClerkProvider>
  );
}