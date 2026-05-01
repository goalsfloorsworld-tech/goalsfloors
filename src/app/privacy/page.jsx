import PrivacyClient from "./PrivacyClient";

const title = "Privacy Policy | Goals Floors";
const description = "Learn how Goals Floors collects, uses, stores, and protects dealer and business data across our services.";

export const metadata = {
  title,
  description,
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    url: "https://goalsfloors.com/privacy",
    title,
    description,
  },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
