"use client";

import { useState, useEffect } from "react";
import { 
  MapPin, Phone, Mail, Clock, ArrowRight, User, 
  Building2, MessageSquare, ShieldCheck, Star, ArrowLeft, CheckCircle2,
  ChevronDown, Plus, Minus, Instagram, MessageCircle
} from "lucide-react";

// Infinite Confetti Component
const ConfettiBurst = () => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const pieces = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5, // More variance for better flow
      size: Math.random() * 8 + 4,
      color: ['#f59e0b', '#fbbf24', '#d97706', '#fef3c7'][Math.floor(Math.random() * 50)],
      duration: Math.random() * 3 + 4 // Slower for premium feel
    }));
    setParticles(pieces);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti-piece {
          position: absolute;
          top: -20px;
          animation: confetti-fall linear infinite;
        }
      `}</style>
      {particles.map(p => (
        <div 
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px'
          }}
        />
      ))}
    </div>
  );
};

// Smooth FAQ Item Component
const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-sm bg-gray-50 overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex cursor-pointer items-center justify-between gap-4 p-6 text-gray-900 font-bold hover:bg-amber-50 transition-colors text-left outline-none"
      >
        <span className="text-base md:text-lg">{question}</span>
        <div className="relative w-5 h-5 flex-shrink-0">
          <Plus className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} />
          <Minus className={`absolute inset-0 w-5 h-5 transition-all duration-300 text-amber-600 ${isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} />
        </div>
      </button>
      <div 
        className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="bg-white px-6 pb-6 pt-2 border-t border-gray-100">
            <p className="text-gray-500 leading-relaxed text-sm md:text-base">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    interest: "",
    message: ""
  });

  const faqs = [
    {
      q: "What is the delivery timeline for commercial projects in Delhi NCR?",
      a: "For standard inventory like WPC Louvers and AC4 Laminates, we offer a signature 2-hour express delivery within Gurugram and Delhi. Custom orders or massive commercial scales may require 3-5 business days."
    },
    {
      q: "Do you provide installation services or only material supply?",
      a: "We provide end-to-end solutions. While architects can choose pure material supply, we highly recommend our in-house certified installation team for a flawless, warranty-backed finish."
    },
    {
      q: "Is there a minimum order quantity (MOQ) for B2B pricing?",
      a: "Yes, B2B tiered pricing and dedicated account management begin at orders exceeding 1,000 sq ft. However, retail customers and homeowners can purchase smaller quantities at our standard premium rates."
    },
    {
      q: "Do you offer official warranties on your flooring and panels?",
      a: "Absolutely. Our premium laminate flooring comes with a 10 to 15-year warranty against fading, staining, and wear (depending on the AC grade). WPC Louvers have a lifetime warranty against termites and borers."
    },
    {
      q: "Can I request a physical sample kit for my architecture firm?",
      a: "Yes! We provide comprehensive physical catalogs and material swatch kits to registered interior designers and architects. Just fill out the form above with your company details."
    },
    {
      q: "Are your WPC Louvers suitable for exterior applications?",
      a: "We have specific product lines designed for exterior cladding that are UV-resistant, waterproof, and built to withstand harsh weather conditions. Please specify 'Exterior' in your consultation request."
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const getInputClass = (value: string) => {
    const baseClass = "w-full pl-11 pr-4 py-3 border text-sm transition-all rounded-sm outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500";
    if (value && value.trim() !== "") {
      return `${baseClass} bg-amber-50/70 border-amber-200`;
    }
    return `${baseClass} bg-gray-50 border-gray-200`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-14">
      
      {/* Premium Minimal Header */}
      <div className="bg-white border-b border-gray-100 py-8 md:py-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-50 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 px-4">
          <h1 className="text-sm font-black text-amber-600 uppercase tracking-[0.3em] mb-4">
            Consultation & Support
          </h1>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight max-w-2xl mx-auto">
            Let's Build Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">Extraordinary.</span>
          </h2>
          <p className="mt-6 text-gray-500 text-lg max-w-xl mx-auto leading-relaxed font-normal">
            From premium WPC louvers to luxury laminate flooring, our architectural experts are ready to elevate your next project.
          </p>
        </div>
      </div>

      {/* The Split Screen Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row shadow-2xl rounded-sm overflow-hidden border border-gray-100 bg-white relative">
          
          {isSubmitted && <ConfettiBurst />}

          {/* ================= LEFT COLUMN: INFO & MAP ================= */}
          <div className="w-full lg:w-[45%] bg-gray-950 text-white relative flex flex-col">
            
            <div className="p-10 md:p-8 relative z-10 flex-1">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight">Experience Goals Floors</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-gray-900 border border-gray-800 rounded-sm flex items-center justify-center flex-shrink-0 group-hover:border-amber-500 transition-colors">
                    <MapPin className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-1">Corporate Showroom</h4>
                    <p className="text-gray-400 text-sm leading-relaxed font-normal">
                      H-36/27A, H-Block, Sikanderpur, DLF Phase-1,<br />
                      Near Mittal Timber, Gurugram, Haryana – 122002
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-gray-900 border border-gray-800 rounded-sm flex items-center justify-center flex-shrink-0 group-hover:border-amber-500 transition-colors">
                    <Phone className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-1">Direct Line</h4>
                    <p className="text-gray-400 text-sm leading-relaxed font-normal">
                      Sales: +91 72176 44573
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-gray-900 border border-gray-800 rounded-sm flex items-center justify-center flex-shrink-0 group-hover:border-amber-500 transition-colors">
                    <Mail className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-1">Email Us</h4>
                    <p className="text-gray-400 text-sm leading-relaxed font-normal">
                      goalsfloors@gmail.com
                    </p>
                  </div>
                </div>

                {/* ================= NAYA CODE: SOCIAL & DIRECT CHAT ================= */}
                <div className="pt-8 mt-8 border-t border-gray-800">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Connect With Us</h4>
                  <div className="flex items-center gap-4">
                    
                    {/* WhatsApp Button */}
                    <a 
                      href="https://wa.me/917217644573" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 px-4 py-2.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-sm hover:bg-green-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                    
                    {/* Instagram Button */}
                    <a 
                      href="https://www.instagram.com/goalsfloors" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-gray-400 border border-gray-800 rounded-sm hover:text-pink-500 hover:border-pink-500/50 transition-all text-xs font-bold uppercase tracking-widest"
                    >
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </a>
                    
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-800">
                  <div className="flex items-center gap-2 text-amber-500 mb-4">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Business Hours</span>
                  </div>
                  <div className="text-gray-400 text-sm font-normal space-y-2">
                    <div className="flex justify-between">
                      <span>Mon - Fri:</span>
                      <span className="text-white font-medium">9:00 AM - 9:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sat - Sun:</span>
                      <span className="text-white font-medium">10:00 AM - 8:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Replacement - FULL COLOR */}
            <div className="w-full h-72 border-t border-gray-800">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.223326176543!2d77.09584351500486!3d28.479814282478546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d190e2e81d48b%3A0x8b22502d83b68084!2sGoals%20Floors!5e0!3m2!1sen!2sin!4v1711100000000!5m2!1sen!2sin" 
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: FORM / SUCCESS STATE ================= */}
          <div className="w-full lg:w-[55%] bg-white p-6 md:p-10 flex flex-col justify-center min-h-[650px] relative z-10">
            {!isSubmitted ? (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Request a Quote</h3>
                  <p className="text-gray-500 text-sm font-normal">Fill out the details below and our project manager will contact you within 2 business hours.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-900 uppercase tracking-widest">Full Name <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <input name="name" value={formData.name} onChange={handleInputChange} type="text" required className={getInputClass(formData.name)} placeholder="John Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-900 uppercase tracking-widest">Phone Number <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" required className={getInputClass(formData.phone)} placeholder="+91 XXXXX XXXXX" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-900 uppercase tracking-widest">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <input name="email" value={formData.email} onChange={handleInputChange} type="email" className={getInputClass(formData.email)} placeholder="john@example.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-900 uppercase tracking-widest">Company / Firm</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Building2 className="h-4 w-4 text-gray-400" />
                        </div>
                        <input name="company" value={formData.company} onChange={handleInputChange} type="text" className={getInputClass(formData.company)} placeholder="Architecture Studio" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-widest">Primary Interest <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select name="interest" value={formData.interest} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all rounded-sm appearance-none outline-none">
                        <option value="" disabled>Select Product Category</option>
                        <option value="wall_panels">Wall Panels & Louvers</option>
                        <option value="flooring">Premium Flooring</option>
                        <option value="ceilings">Baffle Ceilings</option>
                        <option value="multiple">Multiple Products / Complete Project</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-widest">Project Details</label>
                    <div className="relative">
                      <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
                        <MessageSquare className="h-4 w-4 text-gray-400" />
                      </div>
                      <textarea name="message" value={formData.message} onChange={handleInputChange} rows={4} className={getInputClass(formData.message)} placeholder="Tell us about your project requirements..."></textarea>
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full bg-gray-900 text-white font-bold text-sm uppercase tracking-[0.2em] py-4 rounded-sm hover:bg-amber-600 transition-all flex items-center justify-center gap-3 disabled:bg-gray-400 group">
                    {isSubmitting ? "Processing..." : "Submit Enquiry"}
                    {!isSubmitting && <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />}
                  </button>
                  
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-4 font-normal">
                    <ShieldCheck className="w-4 h-4 text-amber-500" /> Your information is strictly confidential. We do not spam.
                  </div>
                </form>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center animate-in fade-in zoom-in duration-700">
                {/* Premium Light Mode VIP Card */}
                <div className="relative w-full max-w-md bg-white rounded-sm p-1 shadow-2xl overflow-hidden border border-gray-100">
                  {/* Glowing Top Border */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200"></div>

                  <div className="p-8 md:p-12 text-center relative z-10 bg-white">
                    {/* Animated Pulsing Icon */}
                    <div className="mx-auto w-24 h-24 mb-8 relative">
                      <div className="absolute inset-0 bg-amber-100 rounded-full animate-ping"></div>
                      <div className="relative z-10 w-full h-full bg-white border border-amber-200 rounded-full flex items-center justify-center shadow-xl">
                        <CheckCircle2 className="w-12 h-12 text-amber-500" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
                      Request Secured, <span className="text-amber-600">{formData.name}</span>.
                    </h3>
                    
                    <div className="w-16 h-[2px] bg-gray-100 mx-auto my-6"></div>

                    <p className="text-gray-500 text-sm mb-8 leading-relaxed font-normal">
                      You are in our priority queue. Our project manager will review your requirements and contact you shortly.
                    </p>

                    {/* ETA Box */}
                    <div className="bg-gray-50 border border-gray-100 p-5 rounded-sm text-left mb-8 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">Estimated Contact Time</p>
                        <p className="text-gray-900 font-bold text-sm">Within 2 Business Hours</p>
                      </div>
                      <Clock className="w-6 h-6 text-amber-500 opacity-50" />
                    </div>

                    <button 
                      onClick={() => { setIsSubmitted(false); setFormData({ name: "", phone: "", email: "", company: "", interest: "", message: "" }); }}
                      className="w-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 font-bold text-[10px] uppercase tracking-[0.2em] py-4 transition-all"
                    >
                      ← Return to Form
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ================= EXTENSION 1: THE CONSULTATION PROCESS (Light Theme) ================= */}
      <div className="bg-gray-50 pt-16 pb-8 border-t border-gray-200 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-amber-100/50 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">Our Signature Approach</h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-gray-200 via-amber-300 to-gray-200"></div>

            {[
              { step: "01", title: "Discovery Call", desc: "Our specialists understand your project scope and architectural vision." },
              { step: "02", title: "Site Inspection", desc: "Technical team visits your NCR location for precise measurements." },
              { step: "03", title: "Material Selection", desc: "Curated sampling of premium WPC, laminates, and louvers at our studio." },
              { step: "04", title: "Flawless Execution", desc: "Express delivery and professional installation with quality checks." }
            ].map((item, i) => (
              <div key={i} className="relative flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center mb-6 group-hover:border-amber-500 transition-all duration-500 shadow-sm relative z-10">
                  <span className="text-2xl font-black text-amber-500">{item.step}</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed px-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= EXTENSION 2: INTERACTIVE FAQs ================= */}
      <div className="bg-white pt-8 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-500">Everything you need to know about partnering with Goals Floors.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

