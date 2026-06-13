'use client';

import { ReactLenis } from 'lenis/react';
import React, { useEffect, useState } from 'react';

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Disable smooth scrolling on mobile/tablet to reduce main-thread work and TBT
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted || isMobile) {
    return <>{children}</>;
  }

  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.1, // Smoothness (0 to 1)
        duration: 1.5, // Scroll duration
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
