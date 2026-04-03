import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Goals Floors - Leading Interior Surface Importers in NCR",
  description: "Established in 2005, Goals Floors is India's premier B2B importer of luxury interior surfaces, serving Gurugram and Delhi NCR for 19+ years.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
