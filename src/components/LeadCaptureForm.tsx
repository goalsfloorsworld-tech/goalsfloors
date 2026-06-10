"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { supabaseClient } from "@/lib/supabase";
import { User, Phone, Mail, MapPin, ArrowRight, ShieldCheck, CheckCircle2, Lock } from "lucide-react";

interface LeadCaptureFormProps {
  productName: string;
  onClose: () => void;
}

export default function LeadCaptureForm({ productName, onClose }: LeadCaptureFormProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });
  const [isNameReadOnly, setIsNameReadOnly] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);
  const [isExpired, setIsExpired] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [submittedAsExpired, setSubmittedAsExpired] = useState(false);

  useEffect(() => {
    // Generate or retrieve persistent secure fake coupon code
    const storedStateStr = localStorage.getItem("goalsfloors_offer_state");
    let startedAt = Date.now();
    let code = "30%GOALSFLOORS-" + Math.random().toString(36).substring(2, 12).toUpperCase();

    if (storedStateStr) {
      const storedState = JSON.parse(storedStateStr);
      // Check if 24 hours have passed to reset
      if (Date.now() - storedState.startedAt >= 24 * 60 * 60 * 1000) {
        localStorage.removeItem("goalsfloors_offer_state");
        localStorage.setItem("goalsfloors_offer_state", JSON.stringify({ startedAt, code }));
      } else {
        startedAt = storedState.startedAt;
        code = storedState.code;
      }
    } else {
      localStorage.setItem("goalsfloors_offer_state", JSON.stringify({ startedAt, code }));
    }

    setCouponCode(code);

    const checkTime = () => {
      const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = Math.max(0, 180 - elapsedSeconds);
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        setIsExpired(true);
      }
    };

    checkTime(); // Initial check
    setIsInitializing(false);

    const timer = setInterval(() => {
      checkTime();
      if (Math.floor((Date.now() - startedAt) / 1000) >= 180) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setFormData(prev => ({
        ...prev,
        email: user.primaryEmailAddress?.emailAddress || prev.email
      }));

      // Fetch from public.profiles
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabaseClient
            .from("profiles")
            .select("full_name, phone_number")
            .eq("id", user.id)
            .single();

          if (data && !error) {
            setFormData(prev => ({
              ...prev,
              name: data.full_name || prev.name,
              phone: data.phone_number || prev.phone
            }));
            
            if (data.full_name) {
              setIsNameReadOnly(true);
            }
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      };

      fetchProfile();
    }
  }, [isLoaded, isSignedIn, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: cleaned }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (formData.phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      setIsSubmitting(false);
      return;
    }

    setSubmittedAsExpired(isExpired);

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        company: "",
        message: "VIP Consultation Request from AI Chat.",
        interest: productName,
        source: "AI_Chat",
        discountStatus: isExpired ? "Expired - No Discount" : "Valid - 30% Off"
      };

      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitting(false);
        setIsSubmitted(true);
      } else {
        throw new Error(result.error || "Something went wrong.");
      }
    } catch (err) {
      console.error("Submission Error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to send request.";
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  const getInputClass = (value: string, isReadOnly: boolean = false) => {
    const baseClass = "w-full pl-11 pr-4 py-3 border text-sm transition-all rounded-sm outline-none text-white";
    if (isReadOnly) {
      return `${baseClass} bg-gray-800 border-gray-700 cursor-not-allowed opacity-70`;
    }
    if (value && value.trim() !== "") {
      return `${baseClass} bg-slate-800/80 border-amber-500/50 focus:border-amber-500`;
    }
    return `${baseClass} bg-slate-900 border-slate-700 focus:border-amber-500`;
  };

  if (isSubmitted) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-950">
        <div className="mx-auto w-24 h-24 mb-6 relative">
          <div className="absolute inset-0 bg-amber-900/40 rounded-full animate-ping"></div>
          <div className="relative z-10 w-full h-full bg-slate-900 border border-amber-700 rounded-full flex items-center justify-center shadow-xl">
            <CheckCircle2 className="w-12 h-12 text-amber-500" />
          </div>
        </div>
        {submittedAsExpired ? (
          <>
            <h3 className="text-2xl font-black text-white mb-3">Request Received</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Our expert consultant will contact you within 24 hours regarding your project.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-2xl font-black text-white mb-3">VIP Access Granted</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Your 30% discount code is secured. Our expert consultant will call you within 24 hours regarding {productName}.
            </p>
          </>
        )}
        <button
          onClick={onClose}
          className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-md transition-colors"
        >
          Return to Chat
        </button>
      </div>
    );
  }

  return (
    <div 
      className="h-full flex flex-col bg-slate-950 relative overflow-y-auto overflow-x-hidden scrollbar-hide overscroll-contain"
      data-lenis-prevent="true"
    >
      {/* Background elements matching the VisualQuizFunnel */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-amber-600/10 to-transparent pointer-events-none" />
      
      <div className="flex-1 px-5 py-6 z-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-white tracking-tight mb-2">Claim Your Offer</h2>
          <p className="text-slate-400 text-sm">Fill in your details to secure your 30% VIP discount for {productName}.</p>
        </div>

        {/* Fake Secure Coupon Box */}
        <div className="mb-6 space-y-1">
          {isInitializing ? (
            <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg flex justify-center items-center h-[76px] animate-pulse">
              <span className="text-slate-500 text-xs font-mono">Generating secure environment...</span>
            </div>
          ) : (
            <>
              <div className={`select-none pointer-events-none overflow-hidden whitespace-nowrap text-ellipsis bg-slate-900 border p-2.5 rounded-lg flex justify-center items-center gap-2 shadow-inner transition-colors ${isExpired ? 'border-red-500 text-red-400' : 'border-green-500/50 text-green-400'}`}>
                <Lock className="w-4 h-4 shrink-0" />
                <span className="font-mono text-sm tracking-wider font-bold">
                  {couponCode.slice(0, -4)}
                  <span className={isExpired ? "" : "blur-[4px] transition-all"}>{couponCode.slice(-4)}</span>
                </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 text-center">
                {isExpired ? (
                  <p className="text-[10px] text-red-400 flex items-center justify-center gap-1 leading-relaxed">
                    Offer Expired. New code will generate after 24 hours, but you can still fill the form without the 30% VIP discount.
                  </p>
                ) : (
                  <>
                    <p className="text-[10px] text-green-500/70 flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Unique secure code auto-applied to your session.
                    </p>
                    <p className="text-[11px] font-bold text-amber-500 animate-pulse mt-1">
                      Code expires in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </p>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-400 text-xs rounded-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name <span className="text-amber-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-slate-500" />
              </div>
              <input 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                type="text" 
                required 
                readOnly={isNameReadOnly}
                className={getInputClass(formData.name, isNameReadOnly)} 
                placeholder="John Doe" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number <span className="text-amber-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Phone className="h-4 w-4 text-slate-500" />
              </div>
              <input 
                name="phone" 
                value={formData.phone} 
                onChange={handleInputChange} 
                type="tel" 
                required 
                className={getInputClass(formData.phone)} 
                placeholder="10-digit mobile number" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex justify-between">
              <span>Email Address</span>
              <span className="text-slate-600 font-normal normal-case">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-slate-500" />
              </div>
              <input 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                type="email" 
                className={getInputClass(formData.email)} 
                placeholder="john@example.com" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex justify-between">
              <span>Project Address</span>
              <span className="text-slate-600 font-normal normal-case">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-slate-500" />
              </div>
              <input 
                name="address" 
                value={formData.address} 
                onChange={handleInputChange} 
                type="text" 
                className={getInputClass(formData.address)} 
                placeholder="For accurate routing to your nearest expert" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className={`w-full text-white font-bold text-sm uppercase tracking-widest py-3.5 mt-2 rounded-md transition-all flex items-center justify-center gap-2 disabled:bg-slate-700 disabled:text-slate-400 ${isExpired ? 'bg-slate-800 hover:bg-slate-700 border border-slate-600' : 'bg-amber-600 hover:bg-amber-500'}`}
          >
            {isSubmitting ? "Submitting..." : isExpired ? "Submit Details" : "Claim 30% Off"}
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
