import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"
import { ThemeProvider } from "@/components/theme-provider";

// Clean, professional font as requested
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"]
});

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
      {/* suppressHydrationWarning Next.js aur Dark mode ke liye zaroori hai */}
      <body className={`${openSans.className} antialiased bg-white dark:bg-slate-950 pt-14 transition-colors duration-300`}>
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