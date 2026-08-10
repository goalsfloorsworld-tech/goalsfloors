'use client';

import { useState, useEffect, useTransition } from 'react';
import { ShieldAlert, Plus, Trash2, UserCog, Mail, KeyRound, Loader2, AlertCircle, CheckCircle2, KeySquare, Users, X, Check } from 'lucide-react';
import { createErpUser, listErpUsers, deleteErpUser, forceResetErpUserPassword, verifyMainSiteEmail } from '../../actions/erp-auth';

interface ErpUser {
  id: string;
  email: string;
  role: string;
  last_sign_in_at?: string;
  created_at: string;
}

export default function ERPUserProvisioning() {
  const [users, setUsers] = useState<ErpUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'ACCOUNTANT'
  });

  const [resetState, setResetState] = useState<{ userId: string; newPassword: string } | null>(null);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');

  // Live email validation
  useEffect(() => {
    const email = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || !emailRegex.test(email)) {
      setEmailStatus('idle');
      return;
    }

    setEmailStatus('loading');
    const timer = setTimeout(async () => {
      const res = await verifyMainSiteEmail(email);
      if (res.success && res.exists) {
        setEmailStatus('valid');
      } else {
        setEmailStatus('invalid');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.email]);

  const fetchUsers = async () => {
    setIsLoading(true);
    const res = await listErpUsers();
    if (res.success && res.users) {
      setUsers(res.users as ErpUser[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = (e: any) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    
    setMessage(null);

    startTransition(async () => {
      const data = new FormData();
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('role', formData.role);

      const res = await createErpUser(data);
      if (res.success) {
        setMessage({ type: 'success', text: res.message || 'User created.' });
        setFormData({ email: '', password: '', role: 'ACCOUNTANT' });
        fetchUsers();
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to create user.' });
      }
    });
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to permanently delete this ERP user?')) return;
    
    setMessage(null);
    startTransition(async () => {
      const res = await deleteErpUser(userId);
      if (res.success) {
        setMessage({ type: 'success', text: 'User deleted.' });
        fetchUsers();
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to delete user.' });
      }
    });
  };

  const handleResetPassword = async (userId: string, newPassword: string) => {
    if (!newPassword || newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    
    setMessage(null);
    startTransition(async () => {
      const res = await forceResetErpUserPassword(userId, newPassword);
      if (res.success) {
        setMessage({ type: 'success', text: 'Password reset successfully.' });
        setResetState(null);
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to reset password.' });
      }
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm mt-8">
      <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
            <UserCog className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">ERP Subdomain Access Provisioning</h3>
            <p className="text-sm text-slate-500 mt-1">
              Create and manage centralized native Auth accounts for <span className="font-mono text-xs font-bold px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">acc.goalsfloors.com</span>.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Create User Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-50 dark:bg-slate-950/30 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" />
              Provision New User
            </h4>
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${emailStatus === 'valid' ? 'text-emerald-500' : emailStatus === 'invalid' ? 'text-rose-500' : 'text-slate-400'}`} />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="accountant@goalsfloors.com" 
                    className={`w-full pl-9 pr-10 py-2.5 bg-white dark:bg-slate-900 border rounded-xl text-sm focus:outline-none transition-all dark:text-white ${
                      emailStatus === 'valid' ? 'border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20' : 
                      emailStatus === 'invalid' ? 'border-rose-500/50 focus:ring-2 focus:ring-rose-500/20' : 
                      'border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                    required
                  />
                  {emailStatus === 'loading' && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />}
                  {emailStatus === 'valid' && <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />}
                  {emailStatus === 'invalid' && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />}
                </div>
                {emailStatus === 'invalid' && (
                  <p className="mt-1.5 text-xs text-rose-500 font-medium">User must login to goalsfloors.com first.</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    placeholder="Super secure password" 
                    className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Assigned Role</label>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white font-bold"
                >
                  <option value="ACCOUNTANT">ACCOUNTANT (Inventory Staff)</option>
                  <option value="ADMIN">ADMIN (Full ERP Access)</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={isPending || emailStatus === 'invalid' || emailStatus === 'loading'}
                className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Provision ERP Account
              </button>
            </form>

            {message && (
              <div className={`mt-4 p-3 rounded-lg text-sm flex items-start gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-900/50' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50'}`}>
                {message.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />}
                {message.text}
              </div>
            )}

            {/* Mobile View Active Accounts Button */}
            <div className="mt-6 lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileListOpen(true)}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                View Active ERP Accounts ({users.length})
              </button>
            </div>
          </div>
        </div>

        {/* Users List (Desktop Inline, Mobile Modal) */}
        <div className={`lg:col-span-3 ${isMobileListOpen ? 'fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200' : 'hidden lg:block'}`}>
          <div className={`${isMobileListOpen ? 'bg-white dark:bg-slate-950 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] scale-in' : 'h-full flex flex-col'}`}>
            
            {/* Header for both views */}
            <div className={`flex items-center justify-between mb-4 ${isMobileListOpen ? 'p-6 pb-2 border-b border-slate-100 dark:border-slate-800' : ''}`}>
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" /> Active ERP Accounts
              </h4>
              {isMobileListOpen && (
                <button onClick={() => setIsMobileListOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full transition-colors">
                  <X size={18} />
                </button>
              )}
            </div>
            
            <div className={`border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 flex-1 ${isMobileListOpen ? 'overflow-y-auto m-6 mt-0' : ''}`}>
            {isLoading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No native auth accounts provisioned yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map(user => (
                  <div key={user.id} className="p-4 border-b border-slate-100 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{user.email}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full ${user.role === 'ADMIN' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'}`}>
                            {user.role}
                          </span>
                          <span className="text-xs text-slate-400">
                            {user.last_sign_in_at ? 'Active' : 'Never logged in'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => setResetState(resetState?.userId === user.id ? null : { userId: user.id, newPassword: '' })}
                          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Force Reset Password"
                        >
                          <KeySquare className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={isPending}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {resetState?.userId === user.id && (
                      <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-2">
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Force New Password</label>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            value={resetState.newPassword}
                            onChange={(e) => setResetState({ ...resetState, newPassword: e.target.value })}
                            placeholder="Enter new password"
                            className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white font-mono"
                          />
                          <button
                            onClick={() => handleResetPassword(user.id, resetState.newPassword)}
                            disabled={isPending || resetState.newPassword.length < 6}
                            className="px-4 py-2 bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white text-sm font-bold rounded-lg transition-all disabled:opacity-50"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
