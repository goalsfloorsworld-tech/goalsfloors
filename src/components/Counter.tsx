"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface CounterProps {
  value: string;
  className?: string;
}

export default function Counter({ value, className }: CounterProps) {
  const [displayValue, setDisplayValue] = useState("0");
  const countRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  // Extract numeric part and suffix
  const numericMatch = value.match(/(\d+)/);
  const target = numericMatch ? parseInt(numericMatch[0]) : 0;
  const suffix = value.replace(numericMatch ? numericMatch[0] : "", "");

  const startAnimation = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 2000;
    const startTime = performance.now();

    const easeOutExpo = (t: number) => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const currentCount = Math.round(target * easedProgress);

      setDisplayValue(`${currentCount}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [target, suffix]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Immediate Visibility Check
    const checkVisibility = () => {
      if (hasAnimated.current || !countRef.current) return;
      const rect = countRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        startAnimation();
        return true;
      }
      return false;
    };

    // 2. Intersection Observer for standard scroll
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) observer.observe(countRef.current);

    // 3. Fallback: Check every 500ms (Max 5 times)
    let checks = 0;
    const interval = setInterval(() => {
      checks++;
      if (checkVisibility() || checks > 10) {
        clearInterval(interval);
      }
    }, 500);

    // Initial check
    checkVisibility();

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [startAnimation]);

  return (
    <div ref={countRef} className={className}>
      {displayValue}
    </div>
  );
}
