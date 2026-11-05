"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGSAP } from "@/lib/gsap-register";

interface LenisContextValue {
  lenis: Lenis | null;
  stopScroll: () => void;
  startScroll: () => void;
  scrollTo: (target: number | string | HTMLElement, options?: Record<string, unknown>) => void;
}

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  stopScroll: () => {},
  startScroll: () => {},
  scrollTo: () => {},
});

export function useLenis() {
  return useContext(LenisContext);
}

// Global accessor for non-component calls
export let globalLenis: Lenis | null = null;

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    registerGSAP();

    // Respect user's reduced motion preferences
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Initialize Lenis with lerp 0.08 and syncTouch false (native touch scrolling)
    const lenis = new Lenis({
      lerp: prefersReducedMotion ? 1 : 0.08,
      syncTouch: false,
    });

    lenisRef.current = lenis;
    globalLenis = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Pause Lenis while preloader is active (html has is-loading class)
    if (typeof document !== "undefined" && document.documentElement.classList.contains("is-loading")) {
      lenis.stop();
    }

    const onPreloaderDone = () => {
      lenis.start();
    };

    window.addEventListener("preloader:done", onPreloaderDone);
    document.addEventListener("preloader:done", onPreloaderDone);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Debounced ScrollTrigger.refresh() on resize, orientationchange, and font load (200ms)
    let refreshTimer: ReturnType<typeof setTimeout> | null = null;
    const debouncedRefresh = () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    };

    window.addEventListener("resize", debouncedRefresh);
    window.addEventListener("orientationchange", debouncedRefresh);

    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        debouncedRefresh();
      });
    }

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      window.removeEventListener("preloader:done", onPreloaderDone);
      document.removeEventListener("preloader:done", onPreloaderDone);
      window.removeEventListener("resize", debouncedRefresh);
      window.removeEventListener("orientationchange", debouncedRefresh);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
      globalLenis = null;
    };
  }, []);

  const stopScroll = () => {
    lenisRef.current?.stop();
  };

  const startScroll = () => {
    lenisRef.current?.start();
  };

  const scrollTo = (target: number | string | HTMLElement, options?: Record<string, unknown>) => {
    lenisRef.current?.scrollTo(target, options);
  };

  return (
    <LenisContext.Provider
      value={{
        get lenis() {
          return lenisRef.current;
        },
        stopScroll,
        startScroll,
        scrollTo,
      }}
    >
      {children}
    </LenisContext.Provider>
  );
}
