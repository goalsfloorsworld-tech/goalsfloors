import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Goals Floors - Visit Our Corporate Studio in Gurugram",
  description: "Get a free expert consultation for your flooring and wall paneling needs. Visit us in Sikanderpur, Gurugram or call +91 72176 44573.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
