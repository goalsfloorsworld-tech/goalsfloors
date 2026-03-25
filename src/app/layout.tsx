import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";

// Using a premium system font stack to avoid build-time fetch issues
const fontStack = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";

export const metadata: Metadata = {
  title: "Goals Floors | Premium Flooring & Wall Panels",
  description: "Luxury interior solutions delivered in 2 hours across Delhi NCR.",
};

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
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}