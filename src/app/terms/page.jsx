import TermsClient from "./TermsClient";

const title = "Terms & Conditions | Goals Floors";
const description = "Read the terms for dealer appointments, pricing, shipping, warranty, liability, and governing law for Goals Floors.";

export const metadata = {
  title,
  description,
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    url: "https://goalsfloors.com/terms",
    title,
    description,
  },
};

export default function TermsPage() {
  return <TermsClient />;
}
