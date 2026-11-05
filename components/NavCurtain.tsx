"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, registerGSAP } from "@/lib/gsap-register";
import { useLenis } from "./LenisProvider";

interface NavCurtainContextType {
  navigateTo: (href: string, customLabel?: string) => void;
  isNavigating: boolean;
}

const NavCurtainContext = createContext<NavCurtainContextType>({
  navigateTo: () => {},
  isNavigating: false,
});

export function useNavCurtain() {
  return useContext(NavCurtainContext);
}

const SECTION_MAP: Record<string, string> = {
  "#": "00 / Home",
  "#hero": "00 / Home",
  "#work": "01 / Work",
  "#about": "02 / About",
  "#skills": "03 / Skills",
  "#journey": "04 / Journey",
  "#certificates": "05 / Certificates",
  "#contact": "06 / Contact",
};

export default function NavCurtainProvider({ children }: { children: React.ReactNode }) {
  const { lenis, stopScroll, startScroll } = useLenis();
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentLabel, setCurrentLabel] = useState("");
  const [announcement, setAnnouncement] = useState("");

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement[]>([]);
  const labelWrapperRef = useRef<HTMLDivElement>(null);
  const labelTextRef = useRef<HTMLSpanElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);
  const isLockedRef = useRef(false);

  useEffect(() => {
    registerGSAP();

    // Handle browser back/forward buttons
    const handlePopState = () => {
      const hash = window.location.hash;
      if (hash) {
        const target = document.querySelector(hash);
        if (target && lenis) {
          lenis.scrollTo(target as HTMLElement, { offset: -70 });
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [lenis]);

  const navigateTo = (href: string, customLabel?: string) => {
    if (isLockedRef.current) return;

    const targetSelector = href === "#" ? "#hero" : href;
    const targetEl = document.querySelector(targetSelector) as HTMLElement | null;

    if (!targetEl) {
      if (href === "#" || href === "#hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    // Check if target is already in view (within viewport with navbar offset)
    const rect = targetEl.getBoundingClientRect();
    const isCurrentlyInView = rect.top <= 140 && rect.bottom >= 140;

    if (isCurrentlyInView) {
      // Just smooth-scroll gently with no curtain
      if (lenis) {
        lenis.scrollTo(targetEl, { offset: -70, duration: 0.8 });
      } else {
        const top = targetEl.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: "smooth" });
      }
      history.replaceState(null, "", href);
      return;
    }

    const label =
      customLabel ||
      SECTION_MAP[href] ||
      `00 / ${href.replace("#", "").toUpperCase() || "HOME"}`;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reduced motion fallback: instant jump with 150ms fade
    if (prefersReducedMotion) {
      isLockedRef.current = true;
      document.body.style.transition = "opacity 0.15s ease";
      document.body.style.opacity = "0.7";

      setTimeout(() => {
        if (lenis) {
          lenis.scrollTo(targetEl, { immediate: true, force: true, offset: -70 });
        } else {
          targetEl.scrollIntoView();
        }
        history.replaceState(null, "", href);
        document.body.style.opacity = "1";

        const heading = targetEl.querySelector("h1, h2") as HTMLElement | null;
        if (heading) {
          heading.setAttribute("tabindex", "-1");
          heading.focus({ preventScroll: true });
        }
        setAnnouncement(`Navigated to ${label.replace(/^[0-9]+\s*\/\s*/, "")}`);

        setTimeout(() => {
          document.body.style.transition = "";
          document.body.style.opacity = "";
          isLockedRef.current = false;
        }, 150);
      }, 75);
      return;
    }

    // Begin Nav Curtain Transition (about 1.1s desktop, 0.9s mobile)
    isLockedRef.current = true;
    setIsNavigating(true);
    setCurrentLabel(label);
    stopScroll();

    // 3s safety failsafe timeout to prevent any stuck state
    const failsafe = setTimeout(() => {
      if (isLockedRef.current) {
        if (overlayRef.current) {
          overlayRef.current.style.display = "none";
        }
        startScroll();
        isLockedRef.current = false;
        setIsNavigating(false);
      }
    }, 3000);

    const isMobile = window.innerWidth < 768;
    const panelDuration = isMobile ? 0.38 : 0.45;
    const exitDuration = isMobile ? 0.42 : 0.5;

    const overlay = overlayRef.current;
    if (!overlay) return;

    overlay.style.display = "flex";

    const panels = panelsRef.current.filter(Boolean);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          clearTimeout(failsafe);
          overlay.style.display = "none";
          startScroll();
          isLockedRef.current = false;
          setIsNavigating(false);
        },
      });

      // Reset panel and label states
      gsap.set(panels, { yPercent: 100 });
      gsap.set(labelTextRef.current, { yPercent: 100, opacity: 0 });
      gsap.set(accentLineRef.current, { scaleX: 0 });
      gsap.set(labelWrapperRef.current, { opacity: 1 });

      // 1. Panels slide up from bottom staggered left-to-right
      tl.to(panels, {
        yPercent: 0,
        duration: panelDuration,
        stagger: isMobile ? 0.04 : 0.05,
        ease: "power3.inOut",
      })
        // 2. Destination label rises from mask + accent line draws
        .to(
          labelTextRef.current,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.32,
            ease: "power2.out",
          },
          "-=0.1"
        )
        .to(
          accentLineRef.current,
          {
            scaleX: 1,
            duration: 0.28,
            ease: "power2.out",
          },
          "<"
        )
        // 3. While covered: compute position, scroll, refresh
        .add(() => {
          ScrollTrigger.refresh();
          if (lenis) {
            lenis.scrollTo(targetEl, { immediate: true, force: true, offset: -70 });
          } else {
            const top = targetEl.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top, behavior: "instant" });
          }
          ScrollTrigger.update();
          history.replaceState(null, "", href);

          // Accessibility: announce and focus destination heading
          const heading = targetEl.querySelector("h1, h2") as HTMLElement | null;
          if (heading) {
            heading.setAttribute("tabindex", "-1");
            heading.focus({ preventScroll: true });
            // Heading reveal animation
            gsap.fromTo(
              heading,
              { y: 15, opacity: 0.4 },
              { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
            );
          }
          setAnnouncement(`Navigated to ${label.replace(/^[0-9]+\s*\/\s*/, "")}`);
        })
        // Small pause while reading destination
        .to({}, { duration: 0.12 })
        // 4. Fade label slightly
        .to(labelWrapperRef.current, {
          opacity: 0,
          y: -15,
          duration: 0.2,
          ease: "power2.in",
        })
        // 5. Panels slide away upward
        .to(
          panels,
          {
            yPercent: -100,
            duration: exitDuration,
            stagger: isMobile ? 0.03 : 0.04,
            ease: "power3.inOut",
          },
          "-=0.1"
        );
    });

    return () => {
      clearTimeout(failsafe);
      ctx.revert();
    };
  };

  return (
    <NavCurtainContext.Provider value={{ navigateTo, isNavigating }}>
      {children}

      {/* Screen Reader Announcement Live Region */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Full-Screen Curtain Overlay */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="fixed inset-0 z-[120] pointer-events-none hidden flex-row overflow-hidden"
      >
        {/* 5 vertical panels on desktop, 3 on mobile */}
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            ref={(el) => {
              if (el) panelsRef.current[idx] = el;
            }}
            className={`h-full bg-[var(--card-bg)] border-r border-[var(--border-color)] relative ${
              idx >= 3 ? "hidden md:block md:w-1/5" : "w-1/3 md:w-1/5"
            }`}
            style={{
              boxShadow: "inset 0 0 40px rgba(0, 0, 0, 0.08)",
            }}
          >
            {/* Subtle 1px accent highlight on the trailing edge */}
            <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-[var(--accent-color)] opacity-20" />
          </div>
        ))}

        {/* Destination Centered Label */}
        <div
          ref={labelWrapperRef}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 p-6 text-center"
        >
          <div className="overflow-hidden py-2 px-4">
            <span
              ref={labelTextRef}
              className="block font-heading font-extrabold text-2xl sm:text-4xl md:text-5xl tracking-tight text-[var(--text-main)]"
            >
              {currentLabel}
            </span>
          </div>

          <div
            ref={accentLineRef}
            className="w-24 sm:w-36 h-[2.5px] bg-[var(--accent-color)] rounded-full mt-2 origin-center"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </NavCurtainContext.Provider>
  );
}

