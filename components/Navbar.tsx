"use client";

import { useEffect, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import { ScrollTrigger, registerGSAP, gsap } from "@/lib/gsap-register";
import { useLenis } from "./LenisProvider";
import { useNavCurtain } from "./NavCurtain";

interface NavItem {
  label: string;
  href: string;
  id: string;
  displayNum: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Work", href: "#work", id: "work", displayNum: "01" },
  { label: "About", href: "#about", id: "about", displayNum: "02" },
  { label: "Skills", href: "#skills", id: "skills", displayNum: "03" },
  { label: "Journey", href: "#journey", id: "journey", displayNum: "04" },
  { label: "Certificates", href: "#certificates", id: "certificates", displayNum: "05" },
  { label: "Contact", href: "#contact", id: "contact", displayNum: "06" },
];

export default function Navbar() {
  const { stopScroll, startScroll } = useLenis();
  const { navigateTo, isNavigating } = useNavCurtain();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const navRef = useRef<HTMLElement>(null);
  const linksContainerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const indicatorRef = useRef<HTMLDivElement>(null);
  const savedScrollY = useRef(0);
  const mobileMenuOpenRef = useRef(false);

  // Scoped ref for mobile menu container and its GSAP context/timeline
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuCtxRef = useRef<gsap.Context | null>(null);
  const menuTlRef = useRef<gsap.core.Timeline | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    mobileMenuOpenRef.current = mobileMenuOpen;
  }, [mobileMenuOpen]);

  // ScrollTrigger active section tracking and floating navbar hide/show
  useEffect(() => {
    registerGSAP();

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lastScroll = 0;
    const nav = navRef.current;

    // Floating hide on scroll down / show on scroll up (disabled when mobile menu is open)
    const navST = ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        if (!nav) return;
        if (mobileMenuOpenRef.current) {
          nav.style.transform = "translateY(0%)";
          return;
        }
        if (prefersReducedMotion) return;
        const current = self.scroll();
        if (current < 60) {
          nav.style.transform = "translateY(0%)";
        } else if (current > lastScroll && current > 120) {
          nav.style.transform = "translateY(-120%)";
        } else if (current < lastScroll) {
          nav.style.transform = "translateY(0%)";
        }
        lastScroll = current;
      },
    });

    // Track active section for sliding indicator
    const triggers: ScrollTrigger[] = [];

    NAV_ITEMS.forEach((item) => {
      const section = document.querySelector(item.href);
      if (section) {
        const st = ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveSection(item.id);
            }
          },
        });
        triggers.push(st);
      }
    });

    return () => {
      navST.kill();
      triggers.forEach((st) => st.kill());
    };
  }, []);

  // Update sliding indicator position
  useEffect(() => {
    const indicator = indicatorRef.current;
    const activeLink = activeSection ? linkRefs.current[activeSection] : null;

    if (indicator && activeLink) {
      indicator.style.opacity = "1";
      indicator.style.width = `${activeLink.offsetWidth}px`;
      indicator.style.transform = `translateX(${activeLink.offsetLeft}px)`;
    } else if (indicator) {
      indicator.style.opacity = "0";
    }
  }, [activeSection]);

  // Clean up body scroll lock on unmount
  useEffect(() => {
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  // Mobile menu scroll lock and scoped GSAP open/close animations
  useEffect(() => {
    registerGSAP();

    // Kill any existing timeline and revert context
    if (menuTlRef.current) {
      menuTlRef.current.kill();
      menuTlRef.current = null;
    }
    if (menuCtxRef.current) {
      menuCtxRef.current.revert();
      menuCtxRef.current = null;
    }

    const menuEl = mobileMenuRef.current;
    if (!menuEl) return;

    // Scope item query to menu container only (never use global selector)
    const items = gsap.utils.toArray<HTMLElement>(".mobile-menu-item", menuEl);

    if (mobileMenuOpen) {
      isFirstRender.current = false;

      // Lock scroll with exact position preservation
      savedScrollY.current = window.scrollY;
      stopScroll();
      document.body.style.position = "fixed";
      document.body.style.top = `-${savedScrollY.current}px`;
      document.body.style.width = "100%";
      document.body.classList.add("overflow-hidden");

      // Animate menu open within scoped gsap.context
      const ctx = gsap.context(() => {
        menuEl.style.visibility = "visible";
        menuEl.style.pointerEvents = "auto";

        const tl = gsap.timeline();
        menuTlRef.current = tl;

        tl.fromTo(
          menuEl,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: "power2.out" }
        );

        if (items.length > 0) {
          tl.fromTo(
            items,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" },
            "-=0.15"
          );
        }
      }, menuEl);

      menuCtxRef.current = ctx;
    } else {
      // Skip close animation on initial mount
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }

      // Unlock scroll and restore scroll position
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.classList.remove("overflow-hidden");
      if (savedScrollY.current) {
        window.scrollTo(0, savedScrollY.current);
      }
      startScroll();

      // Animate menu close within scoped gsap.context
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            menuEl.style.visibility = "hidden";
            menuEl.style.pointerEvents = "none";
            menuEl.style.opacity = "0";
            if (items.length > 0) {
              gsap.set(items, { clearProps: "all" });
            }
          },
        });
        menuTlRef.current = tl;

        if (items.length > 0) {
          tl.to(items, { opacity: 0, y: 12, duration: 0.15, ease: "power2.in" });
        }
        tl.to(
          menuEl,
          { opacity: 0, duration: 0.15, ease: "power2.in" },
          items.length > 0 ? "-=0.08" : 0
        );
      }, menuEl);

      menuCtxRef.current = ctx;
    }

    return () => {
      if (menuTlRef.current) {
        menuTlRef.current.kill();
        menuTlRef.current = null;
      }
      if (menuCtxRef.current) {
        menuCtxRef.current.revert();
        menuCtxRef.current = null;
      }
      if (menuEl) {
        const currentItems = gsap.utils.toArray<HTMLElement>(".mobile-menu-item", menuEl);
        if (currentItems.length > 0) {
          gsap.set(currentItems, { clearProps: "all" });
        }
      }
    };
  }, [mobileMenuOpen, startScroll, stopScroll]);

  // Handle Esc key and route changes to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("hashchange", handleRouteChange);
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("hashchange", handleRouteChange);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label?: string
  ) => {
    e.preventDefault();
    if (isNavigating) return;

    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }

    navigateTo(href, label);
  };

  return (
    <>
      <header
        ref={navRef}
        className="fixed z-50 transition-transform duration-300 ease-out will-change-transform rounded-2xl border border-[var(--border-color)] shadow-[var(--card-shadow)]"
        style={{
          top: "max(12px, env(safe-area-inset-top, 12px))",
          left: "max(clamp(12px, 2vw, 32px), env(safe-area-inset-left, 12px))",
          right: "max(clamp(12px, 2vw, 32px), env(safe-area-inset-right, 12px))",
          width: "calc(100% - clamp(24px, 4vw, 64px))",
          marginLeft: "auto",
          marginRight: "auto",
          backgroundColor: "var(--card-bg)",
          WebkitBackdropFilter: "blur(16px)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="w-full px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#"
            onClick={(e) => handleNavClick(e, "#", "00 / Home")}
            aria-label="Home"
            className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] rounded-xl"
          >
            <Logo size={36} aria-hidden="true" />
          </a>

          {/* Desktop Navigation with Sliding Indicator & Text-Roll */}
          <nav
            ref={linksContainerRef}
            aria-label="Main Navigation"
            className="hidden md:flex items-center space-x-1 lg:space-x-2 relative p-1"
          >
            {/* Sliding Active Pill Indicator */}
            <div
              ref={indicatorRef}
              aria-hidden="true"
              className="absolute top-1 bottom-1 rounded-lg bg-[var(--accent-soft)] border border-[var(--border-color)] pointer-events-none transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 -z-0"
            />

            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.href}
                  ref={(el) => {
                    linkRefs.current[item.id] = el;
                  }}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(e) =>
                    handleNavClick(e, item.href, `${item.displayNum} / ${item.label}`)
                  }
                  className={`group relative z-10 px-3 py-2 text-sm font-medium rounded-lg transition-colors min-h-0 min-w-0 ${isActive
                    ? "text-[var(--accent-color)] font-semibold"
                    : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    }`}
                >
                  {/* Text roll container */}
                  <span className="relative inline-block overflow-hidden h-5 leading-5 align-top">
                    <span className="flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1/2">
                      <span className="block h-5 leading-5">{item.label}</span>
                      <span className="block h-5 leading-5 text-[var(--accent-color)] font-semibold">
                        {item.label}
                      </span>
                    </span>
                  </span>
                </a>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />

            {/* Mobile animated hamburger / close morph */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-menu"
              className="md:hidden interactive-btn relative w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-main)] hover:border-[var(--border-hover)] transition-colors cursor-pointer"
            >
              <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
              <div className="w-5 h-4 relative flex flex-col justify-between pointer-events-none">
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-transform duration-300 ease-out origin-center ${mobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
                    }`}
                />
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-opacity duration-200 ease-out ${mobileMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                />
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-transform duration-300 ease-out origin-center ${mobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                    }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Menu Overlay: Always in DOM, hidden with CSS, animated with GSAP */}
      <div
        ref={mobileMenuRef}
        id="mobile-navigation-menu"
        aria-hidden={!mobileMenuOpen}
        inert={!mobileMenuOpen}
        className="md:hidden fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto h-screen h-[100dvh]"
        style={{
          backgroundColor: "var(--bg-color)",
          WebkitBackdropFilter: "blur(24px)",
          backdropFilter: "blur(24px)",
          paddingTop: "calc(5.25rem + env(safe-area-inset-top, 0px))",
          paddingBottom: "max(1.25rem, env(safe-area-inset-bottom, 1.25rem))",
          paddingLeft: "max(1.5rem, env(safe-area-inset-left, 1.5rem))",
          paddingRight: "max(1.5rem, env(safe-area-inset-right, 1.5rem))",
          visibility: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <nav className="flex flex-col space-y-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={activeSection === item.id ? "page" : undefined}
              onClick={(e) =>
                handleNavClick(e, item.href, `${item.displayNum} / ${item.label}`)
              }
              className="mobile-menu-item font-heading text-xl sm:text-2xl font-semibold text-[var(--text-main)] hover:text-[var(--accent-color)] min-h-[44px] py-2.5 border-b border-[var(--border-color)] transition-colors flex items-center justify-between"
            >
              <span>{item.label}</span>
              <span className="font-mono text-xs text-[var(--accent-color)]">
                {item.displayNum}
              </span>
            </a>
          ))}
        </nav>

        {/* Bottom controls: Theme toggle + "Let's talk" CTA button */}
        <div className="mobile-menu-item pt-4 border-t border-[var(--border-color)] flex items-center justify-between gap-4">
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact", "06 / Contact")}
            className="interactive-btn px-4 py-2 rounded-xl bg-[var(--accent-color)] text-white text-xs sm:text-sm font-medium flex items-center justify-center min-h-[44px]"
          >
            Let&apos;s talk
          </a>
        </div>
      </div>
    </>
  );
}
