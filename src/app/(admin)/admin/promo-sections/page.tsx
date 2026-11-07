import type { Metadata } from "next";
import PromoSectionsManager from "./PromoSectionsManager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Promo Sections Manager | Goals Floors Admin",
  description: "Manage product page promotional strips, specifier kit callouts, and scheduled offers.",
};

export default function AdminPromoSectionsPage() {
  return <PromoSectionsManager />;
}
