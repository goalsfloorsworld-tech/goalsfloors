"use client";

import React, { useState, useTransition } from "react";
import { 
  Search, Loader2, UserPlus, UserCheck, Shield, Users, 
  AlertCircle, UserMinus, X, Info, Calendar 
} from "lucide-react";
import { 
  searchUserByEmail, 
  updateRoleToTeam, 
  demoteToUser, 
  getAllTeamMembers, 
  updateRoleToAdmin 
} from "@/actions/admin-core";
import toast from "react-hot-toast";
import RoleBadge from "@/components/shared/RoleBadge";

type FoundUser = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  image_url?: string;
  created_at: string;
};

interface Props {
  currentUserRole: string;
}

export default function TeamManagerClient({ currentUserRole }: Props) {
  const [email, setEmail] = useState("");
  const [results, setResults] = useState<FoundUser[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, startSearch] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Modals state
  const [selectedUser, setSelectedUser] = useState<FoundUser | null>(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<FoundUser[]>([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);

  const handleSearch = () => {
    if (!email.trim()) { toast.error("Enter an email to search"); return; }
    startSearch(async () => {
      const res = await searchUserByEmail(email.trim());
      if (res.success) {
        setResults(res.users as FoundUser[]);
        setHasSearched(true);
      } else {
        toast.error(res.error || "Search failed");
      }
    });
  };

  const handleOpenTeamModal = async () => {
    const isAllowed = ["admin", "administrator"].includes(currentUserRole);
    if (!isAllowed) {
      toast.error("You are not an admin. Access denied. 🚫");
      return;
    }
    setIsTeamModalOpen(true);
    setIsLoadingTeam(true);
    try {
      const res = await getAllTeamMembers();
      if (res.success) setTeamMembers(res.users as FoundUser[]);
      else toast.error(res.error || "Failed to load team");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsLoadingTeam(false);
    }
  };

  const handleRoleUpdate = async (userId: string, action: "team" | "admin" | "user") => {
    setUpdatingId(userId);
    try {
      let res;
      if (action === "team") res = await updateRoleToTeam(userId);
      else if (action === "admin") res = await updateRoleToAdmin(userId);
      else res = await demoteToUser(userId);

      if (res.success) {
        toast.success(`Role updated successfully! 🚀`);
        if (isTeamModalOpen) {
          const tRes = await getAllTeamMembers();
          if (tRes.success) setTeamMembers(tRes.users as FoundUser[]);
        }
        if (hasSearched) {
          const sRes = await searchUserByEmail(email.trim());
          if (sRes.success) setResults(sRes.users as FoundUser[]);
        }
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser({ ...selectedUser, role: action });
        }
      } else {
        toast.error(res.error || "Update failed");
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const UserAvatar = ({ user, size = "w-10 h-10" }: { user: FoundUser, size?: string }) => (
    <div className={`relative flex-shrink-0 ${size}`}>
      {user.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.image_url} alt="" className={`${size} rounded-full object-cover border border-slate-200 dark:border-slate-800 shadow-sm`} />
      ) : (
        <div className={`${size} rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-black ${size.includes('10') ? 'text-sm' : 'text-xl'}`}>
          {(user.full_name || user.email)?.[0]?.toUpperCase() || "?"}
        </div>
      )}
      {/* Role Badge Overlay */}
      <div className="absolute bottom-[-15px] right-[-10px]">
        <RoleBadge role={user.role} size="lg" showText={false} className="border-2 border-white dark:border-slate-900 rounded-full" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/25">
              <UserPlus className="text-white w-6 h-6" />
            </div>
            Team Manager
          </h2>
          <p className="text-slate-500 mt-1 text-sm">Search for users and manage their access roles.</p>
        </div>
        <button
          onClick={handleOpenTeamModal}
          className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-sm transition-all shadow-sm"
        >
          <Users size={18} className="text-emerald-500" />
          View Current Team & Admins
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Search by Email</label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="user@example.com"
              className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black rounded-2xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/25"
          >
            {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Search
          </button>
        </div>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {results.length === 0 ? "No users found" : `${results.length} user(s) found`}
            </p>
          </div>
          {results.length === 0 ? (
            <div className="flex flex-col items-center py-16">
              <AlertCircle size={40} className="text-slate-300 mb-3" />
              <p className="text-slate-500">No users match that email.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {results.map((user) => (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center gap-4">
                    <UserAvatar user={user} />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{user.full_name || "—"}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                      <div className="mt-1">
                        <RoleBadge role={user.role} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                      View Profile
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── User Details Modal ─── */}
      {selectedUser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-950 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden scale-in duration-300">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <UserAvatar user={selectedUser} size="w-16 h-16" />
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{selectedUser.full_name || "Guest User"}</h3>
                    <p className="text-sm text-slate-500">{selectedUser.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                      <Shield size={10} /> Account Role
                    </p>
                    <div className="mt-1">
                      <RoleBadge role={selectedUser.role} />
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                      <Calendar size={10} /> Joined On
                    </p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {new Date(selectedUser.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <Info size={10} /> User ID
                  </p>
                  <code className="text-[10px] text-slate-500 font-mono break-all">{selectedUser.id}</code>
                </div>
              </div>

              {/* Modal Actions - Only for Admin */}
              {["admin", "administrator"].includes(currentUserRole) && selectedUser.role !== "administrator" && (
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                  {selectedUser.role !== "admin" && (
                    <button
                      onClick={() => handleRoleUpdate(selectedUser.id, "admin")}
                      disabled={updatingId === selectedUser.id}
                      className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
                    >
                      {updatingId === selectedUser.id ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
                      Make Admin
                    </button>
                  )}
                  {selectedUser.role !== "team" && (
                    <button
                      onClick={() => handleRoleUpdate(selectedUser.id, "team")}
                      disabled={updatingId === selectedUser.id}
                      className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2"
                    >
                      {updatingId === selectedUser.id ? <Loader2 size={14} className="animate-spin" /> : <UserCheck size={14} />}
                      Add to Team
                    </button>
                  )}
                  {selectedUser.role !== "user" && (
                    <button
                      onClick={() => handleRoleUpdate(selectedUser.id, "user")}
                      disabled={updatingId === selectedUser.id}
                      className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                      {updatingId === selectedUser.id ? <Loader2 size={14} className="animate-spin" /> : <UserMinus size={14} />}
                      Demote to User
                    </button>
                  )}
                </div>
              )}
              
              {selectedUser.role === "administrator" && (
                <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl">
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-2">
                    <Shield size={14} /> This user is an Administrator and cannot be modified.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Current Team Modal ─── */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-950 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] scale-in duration-300">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Users className="text-emerald-500" /> Current Team & Admins
              </h3>
              <button onClick={() => setIsTeamModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {isLoadingTeam ? (
                <div className="flex flex-col items-center py-20 gap-3">
                  <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                  <p className="text-sm text-slate-500">Loading team members...</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                  {teamMembers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between gap-4 p-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 rounded-2xl transition-colors">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={user} />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">{user.full_name || "—"}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                          <div className="mt-1">
                            <RoleBadge role={user.role} />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.role !== "administrator" && (
                          <>
                            {user.role === "team" ? (
                              <button
                                onClick={() => handleRoleUpdate(user.id, "admin")}
                                disabled={updatingId === user.id}
                                className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors"
                                title="Promote to Admin"
                              >
                                {updatingId === user.id ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRoleUpdate(user.id, "team")}
                                disabled={updatingId === user.id}
                                className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-colors"
                                title="Demote to Team"
                              >
                                {updatingId === user.id ? <Loader2 size={16} className="animate-spin" /> : <Users size={16} />}
                              </button>
                            )}
                            <button
                              onClick={() => handleRoleUpdate(user.id, "user")}
                              disabled={updatingId === user.id}
                              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors"
                              title="Remove access completely"
                            >
                              <UserMinus size={16} />
                            </button>
                          </>
                        )}
                        {user.role === "administrator" && <Shield size={16} className="text-indigo-400 mr-2" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 uppercase font-black tracking-widest text-center">
              Only Admins can view and manage this list
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
