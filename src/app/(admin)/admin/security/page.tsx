import { auth } from "@clerk/nextjs/server";
import { ShieldAlert } from "lucide-react";
import SecurityClient from "@/components/admin/SecurityClient";
import { getCurrentUserProfile } from "@/actions/admin-core";

export const metadata = {
  title: "Security & Access | Admin Panel",
};

export default async function AdminSecurityPage() {
  const authState = await auth();
  const claims = authState.sessionClaims as any;
  const clerkRole = claims?.publicMetadata?.role || claims?.metadata?.role || claims?.role;

  const res = await getCurrentUserProfile();
  const dbRole = res.success ? res.profile?.role : null;
  const adminEmail = res.success ? res.profile?.email : "unknown@goalsfloors.com";

  const role = clerkRole || dbRole;

  if (role !== "administrator" && role !== "admin" && role !== "superadmin") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-12 h-12 text-rose-500" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Access Denied</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          This is a High Security Area. Only Master Administrators have the clearance to view or modify security credentials.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-20 max-w-2xl mx-auto mt-8">
      <div className="text-center flex flex-col items-center">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
          <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/25">
            <ShieldAlert className="text-white w-6 h-6" />
          </div>
          Security Settings
        </h2>
        <p className="text-slate-500 mt-1 text-sm">Manage Master PINs, keys, and advanced security configurations.</p>
      </div>

      <SecurityClient adminEmail={adminEmail} />
    </div>
  );
}
