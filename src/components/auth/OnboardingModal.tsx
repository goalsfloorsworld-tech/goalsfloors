'use client';

import { useState } from 'react';
import { completeOnboarding } from '@/app/actions/onboarding';
import { Loader2, Phone, User, Briefcase, Share2 } from 'lucide-react';

export default function OnboardingModal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    role: '',
    referral_source: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.role || !formData.referral_source) {
      setError('Please select your role and referral source');
      setLoading(false);
      return;
    }

    try {
      const result = await completeOnboarding(formData);
      if (result.success) {
        // Force reload to update server-side state and clear modal
        window.location.reload();
      } else {
        setError(result.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to save details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xl">
      <div className="w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-gray-200 dark:border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
               <User className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Almost There!</h2>
            <p className="text-slate-600 dark:text-slate-400">Complete your profile to unlock premium features and personalized flooring recommendations.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  required
                  type="text"
                  placeholder="e.g. John Doe"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-medium"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  required
                  type="tel"
                  placeholder="+91 00000 00000"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-medium"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5" /> Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Client', 'Dealer', 'Contractor'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role })}
                    className={`py-2.5 text-[11px] font-bold uppercase tracking-tight rounded-xl border transition-all ${
                      formData.role === role
                        ? 'bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-600/30'
                        : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-amber-500/50'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Referral Source */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1 flex items-center gap-2">
                <Share2 className="w-3.5 h-3.5" /> How did you hear about us?
              </label>
              <select
                required
                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all appearance-none text-slate-700 dark:text-slate-300 font-medium"
                value={formData.referral_source}
                onChange={(e) => setFormData({ ...formData, referral_source: e.target.value })}
              >
                <option value="" disabled>Choose one...</option>
                <option value="Google Search">Google Search</option>
                <option value="AI">AI Search (Gemini/ChatGPT)</option>
                <option value="Social Media">Social Media</option>
                <option value="Blog">Official Blog</option>
                <option value="Friend">Recommended by Friend</option>
                <option value="Relative">Recommended by Relative</option>
                <option value="Other">Other Source</option>
              </select>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl">
                <p className="text-red-600 dark:text-red-400 text-xs font-semibold text-center">{error}</p>
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="group relative w-full py-4 bg-slate-900 dark:bg-amber-600 text-white font-black uppercase tracking-[0.15em] text-xs rounded-2xl shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Finalize Registration'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
