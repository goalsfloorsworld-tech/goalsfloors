import { Toaster } from "react-hot-toast";
import GmcDashboardClient from "@/components/admin/gmc/GmcDashboardClient";

export const metadata = {
  title: "Merchant Center | Goals Floors Admin",
  description: "Manage Google Shopping product listings directly.",
};

export default async function GmcPage() {
  // Data is fetched client-side inside GmcDashboardClient using server actions
  return (
    <div className="w-full">
      <Toaster position="top-right" />
      <GmcDashboardClient />
    </div>
  );
}
