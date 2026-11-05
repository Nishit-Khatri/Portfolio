"use client";

import { useRef, useSyncExternalStore } from "react";
import { ScrollTrigger } from "@/lib/gsap-register";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  const observer = new MutationObserver(() => callback());
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "data-theme"],
  });

  return () => {
    window.removeEventListener("storage", callback);
    observer.disconnect();
  };
}

function getSnapshot(): boolean {
  return (
    document.documentElement.classList.contains("dark") ||
    document.documentElement.getAttribute("data-theme") === "dark"
  );
}

function getServerSnapshot(): boolean {
  return false;
}

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isTransitioningRef = useRef(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const applyTheme = (dark: boolean) => {
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}

    if (dark) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }

    // Temporary theme-settle class for 400ms
    document.documentElement.classList.add("theme-settle");
    setTimeout(() => {
      document.documentElement.classList.remove("theme-settle");
    }, 400);

    ScrollTrigger.refresh();
  };

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isTransitioningRef.current) return;

    const nextDark = !isDark;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reduced motion fallback: instant swap with 150ms fade
    if (prefersReducedMotion) {
      document.body.style.transition = "opacity 0.15s ease";
      document.body.style.opacity = "0.7";
      setTimeout(() => {
        applyTheme(nextDark);
        document.body.style.opacity = "1";
        setTimeout(() => {
          document.body.style.transition = "";
          document.body.style.opacity = "";
        }, 150);
      }, 75);
      return;
    }

    // Determine coordinates (click position or button center for keyboard triggers)
    let x = e.clientX;
    let y = e.clientY;
    if ((x === 0 && y === 0) || !e.clientX) {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (rect) {
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      } else {
        x = window.innerWidth - 40;
        y = 32;
      }
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    isTransitioningRef.current = true;

    // Trigger thin 2px expanding accent ring
    if (ringRef.current) {
      const ring = ringRef.current;
      ring.style.left = `${x}px`;
      ring.style.top = `${y}px`;
      ring.style.width = "0px";
      ring.style.height = "0px";
      ring.style.opacity = "0.9";
      ring.style.display = "block";

      ring.animate(
        [
          { width: "0px", height: "0px", opacity: 0.9 },
          {
            width: `${endRadius * 2}px`,
            height: `${endRadius * 2}px`,
            opacity: 0,
          },
        ],
        {
          duration: 900,
          easing: "cubic-bezier(0.65, 0, 0.35, 1)",
          fill: "forwards",
        }
      );

      setTimeout(() => {
        ring.style.display = "none";
      }, 950);
    }

    // Check if document.startViewTransition is supported
    const doc = document as unknown as {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };

    if (typeof doc.startViewTransition === "function") {
      const transition = doc.startViewTransition(() => {
        applyTheme(nextDark);
      });

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 900,
              easing: "cubic-bezier(0.65, 0, 0.35, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        })
        .catch(() => {
          applyTheme(nextDark);
        })
        .finally(() => {
          setTimeout(() => {
            isTransitioningRef.current = false;
          }, 950);
        });
    } else {
      // Fallback for browsers without View Transitions
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.inset = "0";
      overlay.style.zIndex = "9998";
      overlay.style.pointerEvents = "none";
      overlay.style.backgroundColor = nextDark ? "#0C0C0E" : "#FAFAF8";
      overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`;
      document.body.appendChild(overlay);

      const anim = overlay.animate(
        [
          { clipPath: `circle(0px at ${x}px ${y}px)` },
          { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` },
        ],
        {
          duration: 800,
          easing: "cubic-bezier(0.65, 0, 0.35, 1)",
          fill: "forwards",
        }
      );

      setTimeout(() => {
        applyTheme(nextDark);
      }, 400);

      anim.onfinish = () => {
        overlay.remove();
        isTransitioningRef.current = false;
      };
    }
  };

  return (
    <>
      {/* Expanding Accent Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--accent-color)] pointer-events-none z-[9999] hidden will-change-transform"
      />

      {/* Theme Toggle Button with Combined Sun/Moon SVG */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        type="button"
        aria-pressed={isDark}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        className="interactive-btn inline-flex items-center justify-center w-11 h-11 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-main)] hover:border-[var(--border-hover)] hover:text-[var(--accent-color)] active:scale-[0.92] transition-[transform,colors] duration-150 cursor-pointer select-none"
      >
        <svg
          className="w-5 h-5 overflow-visible"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <mask id="theme-toggle-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <circle
              cx={isDark ? "19" : "28"}
              cy={isDark ? "5" : "-4"}
              r="7"
              fill="black"
              className="transition-[cx,cy] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
            />
          </mask>

          {/* Central Celestial Body */}
          <circle
            cx="12"
            cy="12"
            r={isDark ? "7" : "4.5"}
            fill="currentColor"
            mask="url(#theme-toggle-mask)"
            className="transition-[r] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
          />

          {/* Sun Rays (rotate and scale out in dark mode) */}
          <g
            stroke="currentColor"
            className={`origin-center transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
              isDark
                ? "opacity-0 scale-0 -rotate-90"
                : "opacity-100 scale-100 rotate-0"
            }`}
          >
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </g>
        </svg>
      </button>
    </>
  );
}
