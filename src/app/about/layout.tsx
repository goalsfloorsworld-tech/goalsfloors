import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Goals Floors - Leading Interior Surface Importers in NCR",
  description: "Established in 2021 by Shakti FTN, Goals Floors is India's premier B2B importer of luxury interior surfaces. Our expert team brings 19+ years of experience to Gurugram and Delhi NCR.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
