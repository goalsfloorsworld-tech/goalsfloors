import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import WhatsAppFloat from "@/components/whatsapp-float";

// Using a premium system font stack to avoid build-time fetch issues
const fontStack = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";

export const metadata: Metadata = {
  metadataBase: new URL("https://goalsfloors.com"),
  title: "Goals Floors: India’s Fastest Growing Wall Panels & Flooring Brand",
  description: "Goals Floors: India's Fastest Growing Wall Panels & Flooring Brand. Unmatched Quality in Wall Panels & Flooring | 90% Warranty Backed | 400+ Partners | 2-Hour Express Material Supply in Gurgaon & NCR.",
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
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
      <body style={{ fontFamily: fontStack }} className={`antialiased bg-white dark:bg-slate-950 pt-14`}>
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