'use client';

import { ReactLenis } from 'lenis/react';
import React, { useEffect, useState } from 'react';

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Disable smooth scrolling on mobile to reduce main-thread work and TBT
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.1, // Smoothness (0 to 1)
        duration: 1.5, // Scroll duration
        smoothWheel: !isMobile,
        wheelMultiplier: isMobile ? 1 : 1.1,
        touchMultiplier: isMobile ? 1 : 2,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
