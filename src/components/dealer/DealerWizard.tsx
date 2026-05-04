"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Upload, X, CheckCircle2 } from "lucide-react";

// Architectural Floating Input Component
const FloatingInput = ({ label, name, type = "text", value, onChange, placeholder }: any) => {
  const formattedLabel = typeof label === 'string' && label.endsWith(' *') 
      ? <>{label.slice(0, -2)} <span className="text-red-500">*</span></> 
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
    businessType: "",
    turnover: "",
    message: "",
    businessCardBase64: ""
  });

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
        setError("Document exceeds 5MB limit.");
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
      if (!formData.name || !formData.company || !formData.email || formData.phone.length < 10 || !formData.city || !formData.state) {
        setError("Please fill all required fields to continue.");
        return;
      }
    } else if (step === 2) {
      if (!formData.gstNumber || !formData.businessType || !formData.turnover) {
        setError("Please provide your GST Number, Expertise, and Revenue to continue.");
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
    if (!formData.businessCardBase64) {
        setError("Please upload your Visiting Card to finish.");
        return;
    }
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
            throw new Error(result.error || "Submission failed.");
        }
    } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit application. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-14 px-6 text-center text-slate-900 dark:text-white transition-colors duration-500">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-24 h-24 mb-8">
                <svg className="w-full h-full text-amber-500 drop-shadow-lg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <motion.path 
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: "easeOut" }}
                        d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    />
                </svg>
            </div>
            <h2 className="text-4xl md:text-6xl font-playfair italic mb-6 tracking-tight">Welcome Aboard.</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">
                Your application has been received successfully. A dedicated Goals Floors representative will contact you shortly to discuss the next steps.
            </p>
            <button onClick={() => window.location.href = '/products'} className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-none font-bold uppercase tracking-widest text-xs transition-all hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-white dark:hover:text-white border border-transparent">
                Return to Catalog
            </button>
        </motion.div>
      </div>
    );
  }

  // Big Clicky Architectural Blocks for Selection
  const getBlockClass = (isActive: boolean) => isActive
    ? "relative p-3 md:p-6 text-sm md:text-base text-center md:text-left border-2 border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 transition-all font-bold group overflow-hidden cursor-pointer flex items-center justify-center md:justify-start"
    : "relative p-3 md:p-6 text-sm md:text-base text-center md:text-left border-2 border-slate-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400 transition-all font-bold group overflow-hidden cursor-pointer bg-white dark:bg-[#0a0f18] flex items-center justify-center md:justify-start";

  return (
    <div className="w-full bg-white dark:bg-[#050810] text-slate-900 dark:text-white py-12 md:py-14 px-4 md:px-16 transition-colors duration-500 selection:bg-amber-500 selection:text-white font-sans relative">
      
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left Side: Elegant Branding & Progress */}
        <div className="w-full lg:w-1/3 flex flex-col justify-between">
            <div>
                <span className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-4 block">Dealer Portal</span>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                    Join the <br />
                    <span className="font-playfair italic font-normal text-slate-400">Legacy.</span>
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-12">
                    Partner with Goals Floors to access exclusive margins, priority dispatch, and premium architectural surfaces.
                </p>
            </div>

            {/* Architectural Progress Indicator */}
            <div className="hidden lg:flex flex-col gap-8 relative">
                <div className="absolute left-[3px] top-2 bottom-2 w-[2px] bg-slate-100 dark:bg-slate-800" />
                {[
                    { num: 1, title: "Basic Information", desc: "Your contact details" },
                    { num: 2, title: "Business Profile", desc: "Expertise & revenue" },
                    { num: 3, title: "Verification", desc: "Upload visiting card" }
                ].map((item) => (
                    <div key={item.num} className={`relative pl-8 transition-opacity duration-500 ${step === item.num ? 'opacity-100' : step > item.num ? 'opacity-50' : 'opacity-30'}`}>
                        <div className={`absolute left-0 top-1.5 w-2 h-2 rounded-full transition-all duration-500 ${step >= item.num ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-slate-300 dark:bg-slate-700'}`} />
                        <h4 className={`text-sm font-bold uppercase tracking-widest ${step === item.num ? 'text-amber-500' : 'text-slate-900 dark:text-white'}`}>0{item.num}. {item.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Right Side: The Form */}
        <div className="w-full lg:w-2/3">
            {/* Mobile Progress */}
            <div className="flex lg:hidden items-center justify-between mb-12 text-xs font-bold uppercase tracking-widest">
                <span className={step === 1 ? 'text-amber-500' : 'text-slate-400'}>01. Info</span>
                <div className="flex-1 mx-4 h-[2px] bg-slate-100 dark:bg-slate-800 relative">
                    <div className="absolute top-0 left-0 h-full bg-amber-500 transition-all" style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }} />
                </div>
                <span className={step === 2 ? 'text-amber-500' : 'text-slate-400'}>02. Biz</span>
                <div className="flex-1 mx-4 h-[2px] bg-slate-100 dark:bg-slate-800 relative">
                    <div className="absolute top-0 left-0 h-full bg-amber-500 transition-all" style={{ width: step === 3 ? '100%' : '0%' }} />
                </div>
                <span className={step === 3 ? 'text-amber-500' : 'text-slate-400'}>03. Doc</span>
            </div>

            <div className="bg-slate-50 dark:bg-[#0B101A] p-5 md:p-14 rounded-3xl border border-slate-100 dark:border-slate-800/50 shadow-2xl relative overflow-hidden">
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
                                <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12 pt-4">
                                    <FloatingInput label="Full Name *" name="name" value={formData.name} onChange={handleInputChange} />
                                    <FloatingInput label="Business Name *" name="company" value={formData.company} onChange={handleInputChange} />
                                    <FloatingInput label="Email Address *" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                                    <FloatingInput label="Phone Number *" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
                                    <FloatingInput label="City *" name="city" value={formData.city} onChange={handleInputChange} />
                                    <FloatingInput label="State *" name="state" value={formData.state} onChange={handleInputChange} />
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3 }} className="space-y-12 pt-4">
                                    <FloatingInput label="GST Number *" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} />
                                    
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">Type of Expertise <span className="text-red-500">*</span></label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { label: "Retailer", value: "Retailer" },
                                                { label: "Wholesaler", value: "Wholesaler" },
                                                { label: "Contractor", value: "Contractor" },
                                                { label: "Interior Designer", value: "Designer" }
                                            ].map(opt => (
                                                <div key={opt.value} onClick={() => setFormData(p => ({ ...p, businessType: opt.value }))} className={getBlockClass(formData.businessType === opt.value)}>
                                                    <div className="relative z-10">{opt.label}</div>
                                                    {formData.businessType === opt.value && <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-amber-500 opacity-50" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">Estimated Annual Revenue <span className="text-red-500">*</span></label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { label: "Upto ₹10L", value: "10L" },
                                                { label: "₹10L - ₹50L", value: "50L" },
                                                { label: "₹50L - ₹1Cr", value: "1Cr" },
                                                { label: "Above ₹1Cr", value: ">1Cr" }
                                            ].map(opt => (
                                                <div key={opt.value} onClick={() => setFormData(p => ({ ...p, turnover: opt.value }))} className={getBlockClass(formData.turnover === opt.value)}>
                                                    <div className="relative z-10">{opt.label}</div>
                                                    {formData.turnover === opt.value && <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-amber-500 opacity-50" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3 }} className="space-y-12 pt-4">
                                    <div className="relative z-0 w-full mb-8 group">
                                        <textarea 
                                            name="message" 
                                            id="message" 
                                            className="block py-4 px-0 w-full text-base md:text-lg text-slate-900 bg-transparent border-0 border-b-2 border-slate-200 appearance-none dark:text-white dark:border-slate-800 dark:focus:border-amber-500 focus:outline-none focus:ring-0 focus:border-amber-500 peer transition-colors font-medium resize-none h-32" 
                                            placeholder=" " 
                                            value={formData.message} 
                                            onChange={handleInputChange}
                                        />
                                        <label 
                                            htmlFor="message" 
                                            className="peer-focus:font-bold absolute text-sm text-slate-400 dark:text-slate-500 duration-300 transform -translate-y-8 scale-75 top-4 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-amber-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 uppercase tracking-widest font-semibold"
                                        >
                                            Additional Details (Optional)
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">Visiting Card Upload <span className="text-red-500">*</span></label>
                                        {!formData.businessCardBase64 ? (
                                            <div className="w-full">
                                                <input id="card-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                                <label htmlFor="card-upload" className="block w-full border-2 border-dashed border-slate-300 dark:border-slate-700 p-12 cursor-pointer text-center hover:border-amber-500 dark:hover:border-amber-500 transition-all group bg-white dark:bg-[#080d16]">
                                                    <Upload className="w-8 h-8 text-slate-300 dark:text-slate-600 group-hover:text-amber-500 mx-auto mb-4 transition-colors" />
                                                    <span className="text-base font-bold text-slate-600 dark:text-slate-400 block mb-1 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Click or drag image to upload</span>
                                                    <span className="text-xs text-slate-400">JPG or PNG (Max 5MB)</span>
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="relative w-full aspect-video border-2 border-slate-200 dark:border-slate-800 p-2 bg-white dark:bg-[#080d16]">
                                                <div className="relative w-full h-full overflow-hidden group">
                                                    <Image src={formData.businessCardBase64} alt="Preview" fill unoptimized className="object-contain" />
                                                    <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                                        <button type="button" onClick={() => setFormData(p => ({ ...p, businessCardBase64: "" }))} className="px-6 py-3 bg-red-500 text-white text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 hover:bg-red-600">
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

                        <div className="pt-12 flex items-center gap-4 mt-8 border-t border-slate-200 dark:border-slate-800/50">
                            {step > 1 && (
                                <button type="button" onClick={prevStep} className="p-4 md:py-5 md:px-8 border border-slate-200 dark:border-slate-700 font-bold uppercase tracking-widest text-xs transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-500 flex items-center gap-2 shrink-0">
                                    <ArrowLeft className="w-5 h-5" /> <span className="hidden md:inline">Back</span>
                                </button>
                            )}
                            
                            {step < 3 ? (
                                <button type="button" onClick={nextStep} className="py-4 md:py-5 px-3 sm:px-8 flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-all hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-white flex items-center justify-center gap-2 group">
                                    <span className="hidden sm:inline">Continue to </span>Step 0{step + 1} <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            ) : (
                                <button type="submit" disabled={isSubmitting} className="py-4 md:py-5 px-3 sm:px-8 flex-1 bg-amber-500 text-white font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-all hover:bg-amber-600 flex items-center justify-center gap-2 group disabled:opacity-50">
                                    {isSubmitting ? 'Submitting...' : 'Submit Application'} {!isSubmitting && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />}
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
