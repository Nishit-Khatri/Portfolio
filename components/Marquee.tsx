"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, registerGSAP } from "@/lib/gsap-register";
import { globalLenis } from "./LenisProvider";

const TECH_ITEMS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Socket.io",
  "Tailwind CSS",
  "Docker",
  "GitHub Actions",
  "Google Cloud Platform",
  "CI/CD",
  "REST APIs",
  "Postman",
];

export default function Marquee() {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const motionRef = useRef({
    timeScale: 1,
    isPointerDown: false,
    isHovered: false,
  });
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    registerGSAP();

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReducedMotion(true);
      return;
    }

    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    let x = 0;
    // Base speed: 25-30px/second at 60fps = ~0.46px per frame
    const baseSpeed = 0.46;
    let currentSpeed = baseSpeed;
    let isIntersecting = true;
    let isTabVisible = true;
    let scrollTriggerVelocity = 0;

    let halfWidth = track.scrollWidth / 2;

    const updateHalfWidth = () => {
      if (track) {
        halfWidth = track.scrollWidth / 2;
      }
    };

    // Track scroll velocity via ScrollTrigger instance
    const st = ScrollTrigger.create({
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        scrollTriggerVelocity = Math.abs(self.getVelocity());
      },
    });

    // IntersectionObserver to pause when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;
        });
      },
      { threshold: 0 }
    );
    observer.observe(container);

    // Page Visibility API to pause when tab is hidden
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Recalculate halfWidth on resize
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateHalfWidth, 150);
    };
    window.addEventListener("resize", handleResize);

    // GSAP Ticker animation loop
    const tick = () => {
      if (!isIntersecting || !isTabVisible) return;

      const lenisVel = globalLenis?.velocity ? Math.abs(globalLenis.velocity) : 0;
      const velocity = Math.max(lenisVel, scrollTriggerVelocity);

      // Clamp velocity boost so speed never exceeds 2x base speed
      const boost = Math.min(velocity * 0.0015, baseSpeed);
      const targetSpeed = (baseSpeed + boost) * motionRef.current.timeScale;

      // Smooth easing toward target speed
      currentSpeed += (targetSpeed - currentSpeed) * 0.08;

      x -= currentSpeed;

      // Seamless loop reset without any jump
      if (halfWidth > 0 && Math.abs(x) >= halfWidth) {
        x += halfWidth;
      }

      track.style.transform = `translate3d(${x}px, 0, 0)`;
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      st.kill();
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  // Hover and focus-within handlers: ease to stop over 0.4s, resume over 0.6s
  const handleMouseEnter = () => {
    motionRef.current.isHovered = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    gsap.to(motionRef.current, { timeScale: 0, duration: 0.4, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    motionRef.current.isHovered = false;
    if (!motionRef.current.isPointerDown) {
      gsap.to(motionRef.current, { timeScale: 1, duration: 0.6, ease: "power2.out" });
    }
  };

  // Touch handlers: press and hold pauses; resumes ~1s after release
  const handlePointerDown = () => {
    motionRef.current.isPointerDown = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    gsap.to(motionRef.current, { timeScale: 0, duration: 0.2, ease: "power2.out" });
  };

  const handlePointerUp = () => {
    motionRef.current.isPointerDown = false;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);

    resumeTimeoutRef.current = setTimeout(() => {
      if (!motionRef.current.isHovered && !motionRef.current.isPointerDown) {
        gsap.to(motionRef.current, { timeScale: 1, duration: 0.6, ease: "power2.out" });
      }
    }, 1000);
  };

  // 4x duplication guarantees ample buffer on wide screens
  const items = [...TECH_ITEMS, ...TECH_ITEMS, ...TECH_ITEMS, ...TECH_ITEMS];

  if (reducedMotion) {
    return (
      <section
        aria-label="Technologies"
        className="py-4 border-y border-[var(--border-color)] bg-[var(--card-bg)]/60 overflow-x-auto select-none"
      >
        <div className="flex gap-2.5 px-4 min-w-max">
          {TECH_ITEMS.map((item, idx) => (
            <span
              key={`${item}-${idx}`}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-main)] font-mono text-xs sm:text-sm font-medium shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]" />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      aria-label="Technologies"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="py-4 border-y border-[var(--border-color)] bg-[var(--card-bg)]/60 overflow-hidden relative select-none cursor-default"
    >
      <div
        ref={trackRef}
        className="flex whitespace-nowrap will-change-transform"
        style={{ width: "max-content" }}
      >
        {items.map((item, idx) => (
          <span
            key={`${item}-${idx}`}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 mx-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-main)] font-mono text-xs sm:text-sm font-medium tracking-wide shadow-sm hover:border-[var(--border-hover)] transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]" />
            <span>{item}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
