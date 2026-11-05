"use client";

import { useEffect, useState, useRef } from "react";

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  enabled?: boolean;
}

export function useCountUp({
  start = 0,
  end,
  duration = 1500,
  enabled = true,
}: UseCountUpOptions) {
  const [count, setCount] = useState(start);
  const started = useRef(false);

  useEffect(() => {
    if (!enabled || started.current) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      started.current = true;
      requestAnimationFrame(() => {
        setCount(end);
      });
      return;
    }

    started.current = true;
    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // ease: power2.out (quadratic ease-out)
      const easeProgress = 1 - Math.pow(1 - progress, 2);
      const current = Math.floor(start + (end - start) * easeProgress);
      setCount(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [start, end, duration, enabled]);

  return count;
}
