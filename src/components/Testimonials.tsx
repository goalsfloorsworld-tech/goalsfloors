"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Star, ArrowUpRight } from "lucide-react";

// --- Helper Components ---
const StarRating = () => {
  return (
    <div className="flex items-center gap-1 mb-2">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
      ))}
    </div>
  );
};

const InitialsAvatar = ({ name }: { name: string }) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs border border-amber-100">
      {initials}
    </div>
  );
};

export default function Testimonials() {
  // Realistic Real Customer Testimonials (NCR Based)
  const testimonials = [
    {
      id: 1,
      name: "Manoj Kori",
      role: "Verified Buyer, Gurgaon",
      quote: "I bought flooring, wall panels and charcoal moulding from Goals Floors, Gurgaon, and honestly my experience was really good. The material quality is solid and premium, exactly what I was looking for. The team there was very helpful and guided me with the right choices. Delivery and fitting were also done on time.",
      image: "https://res.cloudinary.com/dcezlxt8r/image/upload/v1774079586/manoj_kori.png"
    },
    {
      id: 2,
      name: "Guddu Salmani",
      role: "Home Renovation Client",
      quote: "I recently purchased laminate flooring and charcoal moulding from Goals Floors, and I must say I'm extremely satisfied. They offered me the best rates compared to others in the market, and the delivery was super fast. The quality of the products is excellent, and the service was smooth and professional.",
      image: "https://res.cloudinary.com/dcezlxt8r/image/upload/v1774079586/Guddu_Salmani.png"
    },
    {
      id: 3,
      name: "Kishan Pandit",
      role: "Verified Customer",
      quote: "Goals Floors is my go-to brand for flooring and paneling solutions. Their products strike the right balance between affordability and premium quality. I am particularly impressed with the wooden flooring collection - stylish, durable, and very easy to maintain. Excellent service and highly trustworthy.",
      image: "https://res.cloudinary.com/dcezlxt8r/image/upload/v1774079586/Kishan_Pandit.png"
    },
    {
      id: 4,
      name: "Shiv Kumar",
      role: "Homeowner, Delhi NCR",
      quote: "I recently got wooden flooring and charcoal moulding done from Goals Floors for my home. The final result looks amazing. The wooden flooring gives a very premium feel and the charcoal moulding adds a modern contrast that completely changes the vibe of the space. The installation team was on time and did a neat job.",
      image: "https://res.cloudinary.com/dcezlxt8r/image/upload/v1774079586/Shiv_Kumar.png"
    },
    {
      id: 5,
      name: "Rohit singh",
      role: "Flooring Specialist",
      quote: "Maine yeha ss wooden flooring aur charcoal moulding kharida tha muje best price mila aur quality bhi bahut premium tha. Product range is vast and the team's knowledge is very helpful in choosing the right material.",
      image: "https://res.cloudinary.com/dcezlxt8r/image/upload/v1774079587/Rohit_Singh.png"
    },
    {
      id: 6,
      name: "satnam sahu",
      role: "Interior Professional",
      quote: "Maine goals floors se Wooden Flooring aur Vinyl Flooring kharida hai Muje best price mila. I am happy with the service and product quality. Definitely the best place for flooring solutions in Gurgaon.",
      image: "https://res.cloudinary.com/dcezlxt8r/image/upload/v1774079587/satnam_sahu.png"
    }
  ];

  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const currentReview = testimonials[currentReviewIndex];

  return (
    <section className="py-15 bg-white relative overflow-hidden">
      {/* Subtle background gradients for premium feel */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-amber-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-amber-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-[0.2em] text-amber-500 uppercase mb-3">Client Stories</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">Trust in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Quality</span></h3>
        </div>

        <div className="relative">
          {/* Premium Card */}
          <div className="relative bg-white rounded-3xl p-5 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 group transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            
            {/* Large Decorative Quote Icon */}
            <div className="absolute top-8 right-8 md:top-12 md:right-12 text-amber-500/10 group-hover:text-amber-500/20 transition-colors duration-500 transform group-hover:scale-110">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>

            <div className="relative z-10">
              {/* Star Rating & Badge (Re-arranged: Badge to Top Left, Stars to Top Right) */}
              <div className="flex flex-row items-center justify-between mb-8 w-full gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  <div className="relative w-3.5 h-3.5 bg-white rounded-full p-0.5 shadow-sm">
                    <Image 
                      src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                      alt="Google" 
                      fill 
                      className="object-contain" 
                    />
                  </div>
                  Verified Google Review
                </div>
                <StarRating />
              </div>

              {/* Text Content */}
              <div key={currentReviewIndex} className="transition-all duration-500" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed italic mb-10 max-w-3xl font-light">
                  &quot;{currentReview.quote}&quot;
                </p>

                {/* Responsive Author & Nav (Mobile Centered) */}
                <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-8 sm:gap-6">
                  {/* Author Info */}
                  <div className="flex items-center gap-4 text-center sm:text-left">
                    {currentReview.image ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                        <Image src={currentReview.image} alt={currentReview.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <InitialsAvatar name={currentReview.name} />
                    )}
                    <div>
                      <h4 className="text-base font-bold text-gray-900">{currentReview.name}</h4>
                      <p className="text-xs text-amber-600 font-semibold tracking-wide uppercase">{currentReview.role}</p>
                    </div>
                  </div>

                  {/* Navigation Arrows (Centered on mobile) */}
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={prevReview}
                      aria-label="Previous Review"
                      className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-[#4285F4] hover:text-white hover:border-[#4285F4] transition-all duration-300 shadow-md text-gray-600 group/btn"
                    >
                      <ArrowLeft className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                    </button>
                    <button 
                      onClick={nextReview}
                      aria-label="Next Review"
                      className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-[#4285F4] hover:text-white hover:border-[#4285F4] transition-all duration-300 shadow-md text-gray-600 group/btn"
                    >
                      <ArrowRight className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Animated Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-50 overflow-hidden rounded-b-3xl">
              <div 
                className="h-full bg-gradient-to-r from-[#4285F4] to-blue-600 transition-all duration-700 ease-out" 
                style={{ width: `${((currentReviewIndex + 1) / testimonials.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Custom Animation Style */}
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>

        {/* CTA Below Card (Refined Blue Button) */}
        <div className="mt-16 text-center flex flex-col items-center justify-center gap-8 bg-gray-50/50 p-10 rounded-[2rem] border border-gray-100 shadow-inner">
           <div className="flex flex-col items-center">
              <div className="flex -space-x-3 mb-4">
                 {[...Array(4)].map((_, i) => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden relative shadow-sm">
                     <Image src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Customer" fill className="object-cover" />
                   </div>
                 ))}
                 <div className="w-10 h-10 rounded-full border-2 border-white bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold z-10 shadow-sm">
                   99+
                 </div>
              </div>
              <p className="text-sm text-gray-500 font-medium italic">Join 500+ professionals who trust Goals Floors</p>
           </div>

           <div className="w-full sm:w-auto">
             <Link 
                href="https://g.page/r/CYSAtoMtUCKLEBE/review" // Replace with actual maps link
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-3 bg-[#4285F4] hover:bg-[#357ae8] text-white px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest transition-all shadow-xl hover:shadow-blue-500/30 overflow-hidden active:scale-95"
             >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative w-6 h-6 bg-white rounded-full p-1 shadow-sm">
                  <Image 
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                    alt="Google Logo" 
                    fill 
                    className="object-contain" 
                  />
                </div>
                Rate Us on Google
                <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
             </Link>
           </div>
        </div>

      </div>
    </section>
  );
}
