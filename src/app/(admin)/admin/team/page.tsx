import { Toaster } from "react-hot-toast";
import TeamManagerClient from "@/components/admin/TeamManagerClient";
import { getCurrentUserProfile } from "@/actions/admin-core";

export const metadata = {
  title: "Team Manager | Goals Floors Admin",
  description: "Manage team member roles and access.",
};

export default async function TeamPage() {
  const profileRes = await getCurrentUserProfile();
  const role = profileRes.success ? (profileRes.profile?.role ?? 'user') : 'user';

  return (
    <div className="w-full">
      <Toaster position="top-right" />
      <TeamManagerClient currentUserRole={role} />
    </div>
  );
}
