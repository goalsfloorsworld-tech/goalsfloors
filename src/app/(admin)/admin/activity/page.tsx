import ActivityLoggerClient from "@/components/admin/ActivityLoggerClient";
import { getCurrentUserProfile } from "@/actions/admin-core";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Team Activity & Logs | Goals Floors Admin",
  description: "Track all team member actions and online status.",
};

export default async function ActivityPage() {
  const userRes = await getCurrentUserProfile();
  
  if (!userRes.success || userRes.profile?.role !== "administrator") {
    // Only super admins can see this
    redirect("/admin");
  }

  return (
    <div className="w-full">
      <ActivityLoggerClient />
    </div>
  );
}
