"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AdvantageImage() {
  return (
    <div className="relative h-full min-h-[600px] hidden lg:flex items-center justify-center">
      {/* Ultra-Bold Background Glow Effect */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-amber-500/35 blur-[130px] rounded-full z-0"
      />

      <div className="relative h-full w-full rounded-sm overflow-hidden shadow-[0_0_100px_rgba(251,191,36,0.3)] z-10 group/img-desktop overflow-hidden transition-all duration-700 hover:shadow-[0_0_120px_rgba(251,191,36,0.5)]">
        <Image
          src="https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775749408/Goals_Floors_Fluted_Panel.jpg"
          alt="Professional interior wood flooring and wall paneling installation in Gurugram and Delhi NCR - Goals Floors Architectural Excellence"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-1000 group-hover/img-desktop:scale-110"
        />
      </div>
    </div>
  );
}