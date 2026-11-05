"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, registerGSAP } from "@/lib/gsap-register";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    registerGSAP();

    // Only enable on desktop with fine pointer & hover support
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFinePointer) return;

    requestAnimationFrame(() => setEnabled(true));

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // QuickTo setters for ultra-smooth 60fps tracking
    const setDotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const setDotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
    const setRingX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const setRingY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    let isVisible = false;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      if (!isVisible) {
        isVisible = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.25 });
      }

      setDotX(x);
      setDotY(y);
      setRingX(x);
      setRingY(y);

      // Check interactive elements under cursor
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = target.closest(
        "a, button, input, textarea, select, [role='button'], [tabindex='0']"
      );

      if (isInteractive) {
        // Shrink ring on links and buttons
        gsap.to(ring, {
          width: 26,
          height: 26,
          backgroundColor: "transparent",
          borderColor: "var(--accent-color)",
          duration: 0.25,
          ease: "power2.out",
        });
        gsap.to(dot, { opacity: 0.5, scale: 0.6, duration: 0.2 });
      } else {
        // Default state
        gsap.to(ring, {
          width: 36,
          height: 36,
          backgroundColor: "transparent",
          borderColor: "var(--text-muted)",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(dot, { opacity: 1, scale: 1, duration: 0.2 });
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
    >
      {/* Trailing Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--text-muted)] flex items-center justify-center opacity-0 pointer-events-none transition-colors duration-200"
        style={{ width: 36, height: 36 }}
      />

      {/* Center Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--accent-color)] opacity-0 pointer-events-none shadow-[0_0_8px_var(--accent-color)]"
      />
    </div>
  );
}
