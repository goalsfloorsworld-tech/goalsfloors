"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Star, ArrowUpRight } from "lucide-react";

// --- Helper Components ---
const StarRating = () => (
  <div className="flex items-center gap-1 mb-2">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
    ))}
  </div>
);


export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Manoj Kori",
      role: "Verified Buyer, Gurgaon",
      quote: "I bought flooring, wall panels and charcoal moulding from Goals Floors, Gurgaon, and honestly my experience was really good. The material quality is solid and premium, exactly what I was looking for. The team there was very helpful and guided me with the right choices. Delivery and fitting were also done on time. Overall, I’m very satisfied with the purchase and would definitely recommend Goals Floors to anyone looking for flooring or wall panels in Gurgaon.",
      image: "https://res.cloudinary.com/dcezlxt8r/image/upload/v1774079586/manoj_kori.png",
      link: "https://share.google/rEFGhtceshAtHqasl"
    },
    {
      id: 2,
      name: "Guddu Salmani",
      role: "Home Renovation Client",
      quote: "I recently purchased laminate flooring and charcoal moulding from Goals Floors, and I must say I'm extremely satisfied. They offered me the best rates compared to others in the market, and the delivery was super fast. The quality of the products is excellent, and the service was smooth and professional. Highly recommended for anyone looking for great flooring solutions at affordable prices!",
      image: "https://res.cloudinary.com/dcezlxt8r/image/upload/v1774079586/Guddu_Salmani.png",
      link: "https://share.google/x8nqtiZnvg8Xtpz5c"
    },
    {
      id: 3,
      name: "Kishan Pandit",
      role: "Verified Customer",
      quote: "Goals Floors is my go-to brand for flooring and paneling solutions. Their products strike the right balance between affordability and premium quality. I am particularly impressed with the wooden flooring collection - stylish, durable, and very easy to maintain. Excellent service and highly trustworthy. stylish, durable, and very easy to maintain. Excellent service and highly trustworthy.",
      image: "https://res.cloudinary.com/dcezlxt8r/image/upload/v1774079586/Kishan_Pandit.png",
      link: "https://share.google/1AE88ppkWA2hhj1LY"
    },
    {
      id: 4,
      name: "Shiv Kumar",
      role: "Homeowner, Delhi NCR",
      quote: "I recently got wooden flooring and charcoal moulding done from Goals Floors for my home. The final result looks amazing. The wooden flooring gives a very premium feel and the charcoal moulding adds a modern contrast that completely changes the vibe of the space. The installation team was on time and did a neat job. Definitely recommend if you want to give your home a classy and long-lasting look.",
      image: "https://res.cloudinary.com/dcezlxt8r/image/upload/v1774079586/Shiv_Kumar.png",
      link: "https://share.google/9aJkSHfiBpt4wPT4o"
    },
    {
      id: 5,
      name: "Rohit singh",
      role: "Flooring Specialist",
      quote: "Maine yeha ss wooden flooring aur charcoal moulding kharida tha muje best price mila aur quality bhi bahut premium tha. Product range is vast and the team's knowledge is very helpful in choosing the right material.",
      image: "https://res.cloudinary.com/dcezlxt8r/image/upload/v1774079587/Rohit_Singh.png",
      link: "https://share.google/pivzuW0EkvhXRDB0b"
    },
    {
      id: 6,
      name: "satnam sahu",
      role: "Interior Professional",
      quote: "Maine goals floors se Wooden Flooring aur Vinyl Flooring kharida hai Muje best price mila. I am happy with the service and product quality. Definitely the best place for flooring solutions in Gurgaon.",
      image: "https://res.cloudinary.com/dcezlxt8r/image/upload/v1774079587/satnam_sahu.png",
      link: "https://share.google/36lF4zs2hBxvPwsIn"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((p) => (p + 1) % testimonials.length);
  const prev = () => setCurrentIndex((p) => (p === 0 ? testimonials.length - 1 : p - 1));

  const current = testimonials[currentIndex];

  return (
    <section className="py-16 bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/30 dark:bg-amber-900/10 blur-3xl opacity-50 rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100/30 dark:bg-amber-900/10 blur-3xl opacity-50 rounded-full" />

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-sm font-bold tracking-[0.2em] text-amber-600 uppercase mb-3">Client Stories</h2>
          <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">Trust in <span className="text-amber-600">Quality</span></h3>
        </div>

        <div className="relative bg-white dark:bg-slate-950 rounded-[2.5rem] p-5 md:p-12 shadow-2xl border border-gray-100 dark:border-gray-800 min-h-[550px] md:min-h-0 md:h-[480px] flex flex-col transition-all duration-300">

          <div className="flex justify-between items-center mb-8 shrink-0">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-100 dark:border-blue-800">
              <div className="relative w-4 h-4 bg-white rounded-full p-0.5 shadow-sm">
                <Image src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="G" fill className="object-contain" />
              </div>
              <span className="text-[10px] font-black uppercase text-blue-700 dark:text-blue-400">Verified Review</span>
            </div>
            <StarRating />
          </div>

          <div className="relative flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = offset.x;
                  if (swipe < -50) next();
                  else if (swipe > 50) prev();
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 flex flex-col cursor-grab active:cursor-grabbing touch-pan-y"
              >
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar mb-6">
                  <p className="text-base md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed italic font-medium">
                    &quot;{current.quote}&quot;
                  </p>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-gray-100 dark:border-gray-800 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-amber-600 ring-4 ring-amber-600/10">
                      <Image src={current.image} alt={current.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white text-lg">{current.name}</h4>
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">{current.role}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={prev} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-amber-600 hover:text-white transition-all shadow-lg active:scale-95">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button onClick={next} className="p-4 rounded-2xl bg-amber-600 text-white shadow-lg shadow-amber-600/20 hover:bg-amber-700 transition-all active:scale-95">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute top-8 right-8 md:top-12 md:right-12 text-slate-200/50 dark:text-white/5 pointer-events-none">
            <svg className="w-16 h-16 md:w-32 md:h-32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-8">
          {/* Trust Indicator: Avatar Group + Text */}
          <div className="flex flex-col items-center gap-5">
            <div className="flex -space-x-3">
              {testimonials.slice(0, 5).map((t, i) => (
                <div key={i} className="relative w-12 h-12 rounded-full border-4 border-white dark:border-slate-950 overflow-hidden shadow-lg transform hover:scale-110 transition-transform duration-300 z-[5]">
                  <Image src={t.image} alt={t.name} fill className="object-cover" />
                </div>
              ))}
              <div className="relative w-12 h-12 rounded-full border-4 border-white dark:border-slate-950 bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shadow-lg z-0">
                <span className="text-[10px] font-black text-orange-600 dark:text-orange-400">99+</span>
              </div>
            </div>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium italic max-w-xs text-center leading-relaxed">
              Real experiences from Delhi NCR&apos;s most premium homes and offices
            </p>
          </div>

          {/* Premium Google Review Button */}
          <Link
            href="https://g.page/r/CYSAtoMtUCKLEBE/review"
            target="_blank"
            className="group relative inline-flex items-center justify-center gap-4 px-10 py-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(37,99,235,0.4)] hover:shadow-[0_25px_60px_-15px_rgba(37,99,235,0.6)] transition-all duration-500 active:scale-95"
          >
            <div className="relative w-8 h-8 bg-white rounded-full p-1.5 shadow-sm group-hover:rotate-[360deg] transition-transform duration-700">
              <Image src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="G" fill className="object-contain" />
            </div>
            <span className="text-[13px] md:text-sm font-black uppercase tracking-[0.15em] whitespace-nowrap">Rate Us On Google</span>
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #fbbf24; border-radius: 10px; }
      `}</style>
    </section>
  );
}
