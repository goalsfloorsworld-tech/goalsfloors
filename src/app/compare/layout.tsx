import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Flooring, Wall Panels & Interior Products | Goals Floors",
  description: "Compare flooring, wall panels, louvers, decking, and interior materials side by side. Explore features, applications, pros & cons, and choose the right product for your project.",
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
