'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { completeOnboarding } from '@/app/actions/onboarding';
import { createDealerProfile, checkSlugAvailability } from '@/app/actions/dealer';
import { Loader2, Phone, User, Briefcase, Share2, CheckCircle2, XCircle } from 'lucide-react';

export default function OnboardingModal() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPendingDealer, setIsPendingDealer] = useState(false);
  const [slugPreview, setSlugPreview] = useState('');
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [slugFormatError, setSlugFormatError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    role: '',
    referral_source: '',
  });

  useEffect(() => {
    const pending = localStorage.getItem('pending_dealer_application');
    if (pending) {
      try {
        const data = JSON.parse(pending);
        setFormData(prev => ({
          ...prev,
          full_name: data.owner_name || prev.full_name,
          phone_number: data.phone || prev.phone_number,
          role: 'dealer'
        }));
        setIsPendingDealer(true);
      } catch (e) {
        console.error('Error parsing pending dealer application', e);
      }
    }
  }, []);

  // Format slug as user types
  useEffect(() => {
    if (formData.role === 'dealer' || isPendingDealer) {
      const hasInvalidChars = /[^a-zA-Z0-9\s\-_]/.test(formData.full_name);
      if (hasInvalidChars) {
        setSlugFormatError('Only letters, numbers, hyphens (-), and underscores (_) are allowed.');
      } else {
        setSlugFormatError(null);
      }

      let slug = formData.full_name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Only alphanumeric, space, hyphens
        .trim()
        .replace(/\s+/g, '-'); // Convert spaces to hyphens
        
      setSlugPreview(slug);
      setSlugAvailable(null);
    }
  }, [formData.full_name, formData.role, isPendingDealer]);

  // Debounced API call to check slug availability
  useEffect(() => {
    if (!slugPreview || (formData.role !== 'dealer' && !isPendingDealer)) {
      setSlugAvailable(null);
      return;
    }

    setCheckingSlug(true);
    const timeoutId = setTimeout(async () => {
      const res = await checkSlugAvailability(slugPreview);
      if (res.available !== undefined) {
        setSlugAvailable(res.available);
      } else {
        setSlugAvailable(null);
      }
      setCheckingSlug(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [slugPreview, formData.role, isPendingDealer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.role || !formData.referral_source) {
      setError('Please select your role and referral source');
      setLoading(false);
      return;
    }

    // Phone number validation (exactly 10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone_number)) {
      setError('Phone number must be exactly 10 digits');
      setLoading(false);
      return;
    }

    if ((formData.role === 'dealer' || isPendingDealer) && slugAvailable === false) {
      setError('This URL is already taken by another dealer. Please choose a different name.');
      setLoading(false);
      return;
    }

    try {
      const result = await completeOnboarding(formData);
      if (result.success) {
        if (formData.role === 'dealer') {
          try {
            const pending = localStorage.getItem('pending_dealer_application');
            const pendingData = pending ? JSON.parse(pending) : null;
            
            const businessName = pendingData?.business_name || formData.full_name;
            const finalSlug = slugPreview;
            
            await createDealerProfile({
              slug: finalSlug,
              business_name: businessName,
              phone: formData.phone_number,
              whatsapp_number: pendingData?.whatsapp || null,
              city: pendingData?.city || null,
              area: pendingData?.area || null,
              pincode: pendingData?.pincode || null,
              is_approved: false,
              profile_complete: false,
            });
            
            localStorage.removeItem('pending_dealer_application');
          } catch (err) {
            console.error('Error creating dealer profile during onboarding:', err);
          }
        }
        if (user) {
          localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
        }
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
      <div className="w-full max-w-sm bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-gray-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="p-6 md:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-3">
               <User className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Almost There!</h2>
            <p className="text-[13px] text-slate-600 dark:text-slate-400">Complete your profile to unlock premium features.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  required
                  type="text"
                  placeholder="e.g. John Doe"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm font-medium"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
              
              {/* Slug Preview UI */}
              {(formData.role === 'dealer' || isPendingDealer) && formData.full_name.trim().length > 0 && (
                <div className="mt-2 text-[11px] font-medium p-2 rounded-lg bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Your URL: <span className="text-slate-900 dark:text-white font-bold">/dealers/{slugPreview}</span></span>
                    {checkingSlug && <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />}
                    {!checkingSlug && slugAvailable === true && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {!checkingSlug && slugAvailable === false && <XCircle className="w-4 h-4 text-red-500" />}
                  </div>
                  {!checkingSlug && slugAvailable === false && (
                    <p className="text-red-500 mt-1.5 font-semibold">This URL is already taken by another dealer. Please choose a different name.</p>
                  )}
                  {slugFormatError && (
                    <p className="text-amber-500 mt-1.5 font-semibold">{slugFormatError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  required
                  type="tel"
                  maxLength={10}
                  placeholder="10 digit number"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm font-medium"
                  value={formData.phone_number}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, ''); // Only numbers
                    if (val.length <= 10) setFormData({ ...formData, phone_number: val });
                  }}
                />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1 flex items-center gap-2">
                <Briefcase className="w-3 h-3" /> Select Your Role
              </label>
              
              {isPendingDealer ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    disabled
                    className="w-full py-2 text-[10px] font-bold uppercase tracking-tight rounded-lg border bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-600/30 opacity-100 cursor-not-allowed"
                  >
                    Dealer
                  </button>
                  <p className="text-[10px] text-amber-600 dark:text-amber-500 font-semibold text-center mt-1">
                    Your dealer application has been loaded. You have been registered as a dealer.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {['Client', 'Dealer', 'Contractor'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: role.toLowerCase() })}
                      className={`py-2 text-[10px] font-bold uppercase tracking-tight rounded-lg border transition-all ${
                        formData.role === role.toLowerCase()
                          ? 'bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-600/30'
                          : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-amber-500/50'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Referral Source - Updated to Button Grid */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1 flex items-center gap-2">
                <Share2 className="w-3 h-3" /> How did you hear about us?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Google', 'AI Search', 'Social Media', 'Blog', 'Friend', 'Other'].map((source) => (
                  <button
                    key={source}
                    type="button"
                    onClick={() => setFormData({ ...formData, referral_source: source })}
                    className={`py-2 text-[10px] font-bold uppercase tracking-tight rounded-lg border transition-all ${
                      formData.referral_source === source
                        ? 'bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-600/30'
                        : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-amber-500/50'
                    }`}
                  >
                    {source}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl">
                <p className="text-red-600 dark:text-red-400 text-xs font-semibold text-center">{error}</p>
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="group relative w-full py-3.5 bg-slate-900 dark:bg-amber-600 text-white font-black uppercase tracking-[0.15em] text-[10px] rounded-xl shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
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
