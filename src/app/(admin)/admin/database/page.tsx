import { Toaster } from "react-hot-toast";
import DatabaseExplorerClient from "@/components/admin/DatabaseExplorerClient";

export const metadata = {
  title: "Database Explorer | Goals Floors Admin",
  description: "Explore and inspect Supabase database tables.",
};

export default function DatabasePage() {
  return (
    <div className="w-full">
      <Toaster position="top-right" />
      <DatabaseExplorerClient />
    </div>
  );
}
