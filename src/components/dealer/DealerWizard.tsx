"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Upload, X, CheckCircle2, MessageCircle, RefreshCw } from "lucide-react";

// Architectural Floating Input Component
const FloatingInput = ({ label, name, type = "text", value, onChange, placeholder }: any) => {
  const formattedLabel = typeof label === 'string' && label.endsWith(' *') 
      ? <>{label.slice(0, -2)} <span className="text-amber-500 font-bold">*</span></> 
      : label;

  return (
    <div className="relative z-0 w-full mb-2 group">
      <input 
        type={type} 
        name={name} 
        id={name} 
        className="block py-4 px-0 w-full text-lg md:text-xl text-slate-900 bg-transparent border-0 border-b-2 border-slate-200 appearance-none dark:text-white dark:border-slate-800 dark:focus:border-amber-500 focus:outline-none focus:ring-0 focus:border-amber-500 peer transition-colors font-medium" 
        placeholder=" " 
        value={value} 
        onChange={onChange}
      />
      <label 
        htmlFor={name} 
        className="peer-focus:font-bold absolute text-sm text-slate-400 dark:text-slate-500 duration-300 transform -translate-y-8 scale-75 top-4 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-amber-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 uppercase tracking-widest font-semibold"
      >
        {formattedLabel}
      </label>
    </div>
  );
};

export default function DealerWizard() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    gstNumber: "",
    businessType: "Retailer",
    turnover: "10L",
    message: "",
    businessCardBase64: ""
  });

  useEffect(() => {
    if (formData.name || formData.company || formData.phone) {
      try {
        localStorage.setItem('pending_dealer_application', JSON.stringify({
          owner_name: formData.name,
          business_name: formData.company,
          phone: formData.phone,
          whatsapp: formData.phone,
          city: formData.city,
          area: formData.state,
          pincode: '',
          email: formData.email,
          source: 'dealer_form'
        }));
      } catch (err) {
        console.warn("Could not save to localStorage", err);
      }
    }
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: cleaned }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Document exceeds 5MB limit. Please upload a smaller image.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, businessCardBase64: reader.result as string }));
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name.trim() || !formData.company.trim() || !formData.email.trim() || formData.phone.length < 10 || !formData.city.trim() || !formData.state.trim()) {
        setError("Please fill all required fields marked with * to continue.");
        return;
      }
    } else if (step === 2) {
      if (!formData.businessType || !formData.turnover) {
        setError("Please choose your Type of Expertise and Estimated Revenue.");
        return;
      }
    }
    setError(null);
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch("/api/dealer-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          interest: "Dealer Application",
          zip: "000000",
          dob: "N/A"
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIsSubmitted(true);
      } else {
        throw new Error(result.error || "Submission failed. Please check your details and try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      gstNumber: "",
      businessType: "Retailer",
      turnover: "10L",
      message: "",
      businessCardBase64: ""
    });
    setStep(1);
    setIsSubmitted(false);
    setError(null);
  };

  // Big Clicky Architectural Blocks for Selection
  const getBlockClass = (isActive: boolean) => isActive
    ? "relative p-3 md:p-6 text-sm md:text-base text-center md:text-left border-2 border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 transition-all font-bold group overflow-hidden cursor-pointer flex items-center justify-center md:justify-start rounded-xl"
    : "relative p-3 md:p-6 text-sm md:text-base text-center md:text-left border-2 border-slate-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400 transition-all font-bold group overflow-hidden cursor-pointer bg-white dark:bg-[#0a0f18] flex items-center justify-center md:justify-start rounded-xl";

  const whatsappMessage = encodeURIComponent(
    `Hello Goals Floors! I have submitted a dealership application for "${formData.company || 'our firm'}" (${formData.name || 'Partner'}, ${formData.city || 'NCR'}). Please share wholesale catalog and distributor onboarding details.`
  );
  const whatsappUrl = `https://wa.me/917217644573?text=${whatsappMessage}`;

  if (isSubmitted) {
    return (
      <div className="py-16 md:py-24 px-4 md:px-12 text-center text-slate-900 dark:text-white transition-colors duration-500">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="max-w-2xl mx-auto flex flex-col items-center bg-slate-50 dark:bg-[#0B101A] p-8 md:p-14 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl"
        >
          <div className="w-20 h-20 mb-6 bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-2">
            Application Received • Verification Underway
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">
            Welcome to the Network.
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
            Thank you, <strong className="text-slate-900 dark:text-white">{formData.name}</strong>! Your dealership application for <strong className="text-slate-900 dark:text-white">{formData.company}</strong> ({formData.city}) has been recorded into our system.
          </p>

          <div className="w-full bg-white dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8 text-left text-xs md:text-sm space-y-2 text-slate-600 dark:text-slate-400">
            <p className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              Details sent to our partner dispatch &amp; onboarding team.
            </p>
            <p className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
              A dedicated representative will contact you on <strong className="text-amber-600 dark:text-amber-400">{formData.phone}</strong> within 24 hours.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Us Directly
            </a>
            <Link 
              href="/products"
              className="flex-1 py-4 px-6 bg-slate-900 dark:bg-amber-500 hover:bg-amber-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              Explore Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button 
            type="button"
            onClick={resetForm}
            className="mt-6 text-xs text-slate-500 dark:text-slate-400 hover:text-amber-500 inline-flex items-center gap-1.5 transition-colors font-medium"
          >
            <RefreshCw className="w-3 h-3" /> Submit another inquiry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-[#050810] text-slate-900 dark:text-white py-12 md:py-20 px-4 sm:px-8 md:px-12 lg:px-14 xl:px-16 2xl:px-20 transition-colors duration-500 selection:bg-amber-500 selection:text-white font-sans relative">
      
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
        
        {/* Left Side: Elegant Branding & Progress */}
        <div className="w-full lg:w-1/3 flex flex-col justify-start">
          <div className="lg:sticky lg:top-24">
            <span className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-3 block">Dealer Partnership Form</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Join the <br />
              <span className="font-playfair italic font-normal text-amber-500 dark:text-amber-400">Goals Floors</span> Network.
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed mb-8">
              Partner with NCR’s fastest-growing luxury architectural brand. Fill the form below without any login requirement—our team will review and connect with you directly.
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10 hidden lg:block">
              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                <span className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">✓</span>
                <span>40% to 50% Clear Dealer Margins</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                <span className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">✓</span>
                <span>2-Hour Express Dispatch in Delhi NCR</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                <span className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">✓</span>
                <span>Zero Commission Local Retail Leads</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: The Form */}
        <div className="w-full lg:w-2/3">
          {/* Unified Horizontal Progress */}
          <div className="flex items-center justify-between mb-8 md:mb-12 relative z-10 w-full max-w-md mx-auto">
            {[
              { num: 1, title: "Basic Info" },
              { num: 2, title: "Business" },
              { num: 3, title: "Verification" }
            ].map((item) => (
              <div key={item.num} className="flex flex-col items-center relative z-10 w-1/3">
                <div 
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm mb-3 transition-all duration-500 shadow-md ${
                    step >= item.num 
                      ? 'bg-amber-500 text-white shadow-amber-500/40 border-2 border-amber-500' 
                      : 'bg-white dark:bg-slate-900 text-slate-400 border-2 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {step > item.num ? <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> : `0${item.num}`}
                </div>
                <span className={`text-[9px] md:text-[11px] font-bold uppercase tracking-widest transition-colors duration-500 text-center ${
                  step >= item.num ? 'text-amber-500 font-bold' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {item.title}
                </span>
              </div>
            ))}
            
            {/* Connecting Lines */}
            <div className="absolute top-4 md:top-5 left-[16.66%] right-[16.66%] h-[2px] bg-slate-200 dark:bg-slate-800 -z-10">
              <div 
                className="absolute top-0 left-0 h-full bg-amber-500 transition-all duration-500" 
                style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }} 
              />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#0B101A] p-6 md:p-12 lg:p-14 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-2xl relative overflow-hidden">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

            <div className="relative z-10">
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 bg-red-500/10 text-red-500 p-4 rounded-xl text-sm font-bold flex items-center gap-3 border border-red-500/20">
                  <X className="w-5 h-5 shrink-0" />
                  {error}
                </motion.div>
              )}

              <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 pt-2">
                      <FloatingInput label="Full Name *" name="name" value={formData.name} onChange={handleInputChange} />
                      <FloatingInput label="Business / Shop Name *" name="company" value={formData.company} onChange={handleInputChange} />
                      <FloatingInput label="Email Address *" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                      <FloatingInput label="Phone Number *" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
                      <FloatingInput label="City *" name="city" value={formData.city} onChange={handleInputChange} />
                      <FloatingInput label="State *" name="state" value={formData.state} onChange={handleInputChange} />
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3 }} className="space-y-10 pt-2">
                      <FloatingInput label="GST Number (Optional / If Available)" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} />
                      
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">Type of Expertise <span className="text-amber-500">*</span></label>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { label: "Retailer", value: "Retailer" },
                            { label: "Wholesaler", value: "Wholesaler" },
                            { label: "Contractor", value: "Contractor" },
                            { label: "Interior Designer", value: "Designer" }
                          ].map(opt => (
                            <div key={opt.value} onClick={() => setFormData(p => ({ ...p, businessType: opt.value }))} className={getBlockClass(formData.businessType === opt.value)}>
                              <div className="relative z-10">{opt.label}</div>
                              {formData.businessType === opt.value && <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-amber-500" />}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">Estimated Annual Revenue <span className="text-amber-500">*</span></label>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { label: "Upto ₹10L", value: "10L" },
                            { label: "₹10L - ₹50L", value: "50L" },
                            { label: "₹50L - ₹1Cr", value: "1Cr" },
                            { label: "Above ₹1Cr", value: ">1Cr" }
                          ].map(opt => (
                            <div key={opt.value} onClick={() => setFormData(p => ({ ...p, turnover: opt.value }))} className={getBlockClass(formData.turnover === opt.value)}>
                              <div className="relative z-10">{opt.label}</div>
                              {formData.turnover === opt.value && <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-amber-500" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3 }} className="space-y-8 pt-2">
                      <div className="relative z-0 w-full mb-6 group">
                        <textarea 
                          name="message" 
                          id="message" 
                          className="block py-4 px-0 w-full text-base md:text-lg text-slate-900 bg-transparent border-0 border-b-2 border-slate-200 appearance-none dark:text-white dark:border-slate-800 dark:focus:border-amber-500 focus:outline-none focus:ring-0 focus:border-amber-500 peer transition-colors font-medium resize-none h-28" 
                          placeholder=" " 
                          value={formData.message} 
                          onChange={handleInputChange}
                        />
                        <label 
                          htmlFor="message" 
                          className="peer-focus:font-bold absolute text-sm text-slate-400 dark:text-slate-500 duration-300 transform -translate-y-8 scale-75 top-4 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-amber-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 uppercase tracking-widest font-semibold"
                        >
                          Additional Project / Showroom Details (Optional)
                        </label>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
                          Visiting Card / Business Photo (Optional)
                        </label>
                        {!formData.businessCardBase64 ? (
                          <div className="w-full">
                            <input id="card-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            <label htmlFor="card-upload" className="block w-full border-2 border-dashed border-slate-300 dark:border-slate-700 p-8 md:p-10 cursor-pointer text-center hover:border-amber-500 dark:hover:border-amber-500 transition-all group bg-white dark:bg-[#080d16] rounded-2xl">
                              <Upload className="w-7 h-7 text-slate-300 dark:text-slate-600 group-hover:text-amber-500 mx-auto mb-3 transition-colors" />
                              <span className="text-sm md:text-base font-bold text-slate-600 dark:text-slate-300 block mb-1 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Click or drag image to upload visiting card</span>
                              <span className="text-xs text-slate-400">JPG or PNG (Max 5MB)</span>
                            </label>
                          </div>
                        ) : (
                          <div className="relative w-full aspect-video border-2 border-slate-200 dark:border-slate-800 p-2 bg-white dark:bg-[#080d16] rounded-2xl">
                            <div className="relative w-full h-full overflow-hidden rounded-xl group">
                              <Image src={formData.businessCardBase64} alt="Preview" fill unoptimized className="object-contain" />
                              <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                <button type="button" onClick={() => setFormData(p => ({ ...p, businessCardBase64: "" }))} className="px-5 py-2.5 bg-red-500 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all flex items-center gap-2 hover:bg-red-600">
                                  <X className="w-4 h-4" /> Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className={`pt-8 flex items-center gap-4 mt-8 ${step === 1 ? "" : "border-t border-slate-200 dark:border-slate-800/50"}`}>
                  {step > 1 && (
                    <button type="button" onClick={prevStep} className="py-4 px-6 md:px-8 border border-slate-200 dark:border-slate-700 font-bold uppercase tracking-widest text-xs transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-500 flex items-center gap-2 shrink-0 rounded-xl">
                      <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back</span>
                    </button>
                  )}
                  
                  {step < 3 ? (
                    <button type="button" onClick={nextStep} className="py-4 px-6 flex-1 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-900 font-bold uppercase tracking-widest text-xs transition-all hover:bg-amber-500 dark:hover:bg-amber-400 hover:text-white dark:hover:text-black flex items-center justify-center gap-2 group rounded-xl shadow-md">
                      <span>Continue to Step 0{step + 1}</span> <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <button type="submit" disabled={isSubmitting} className="py-4 px-6 flex-1 bg-amber-500 text-white font-bold uppercase tracking-widest text-xs transition-all hover:bg-amber-600 flex items-center justify-center gap-2 group disabled:opacity-50 rounded-xl shadow-lg shadow-amber-500/25 cursor-pointer">
                      {isSubmitting ? 'Submitting Application...' : 'Submit Dealer Application'} {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
