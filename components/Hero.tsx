"use client";

import React, { useEffect, useRef } from "react";
import { portfolioData } from "@/data/portfolioData";
import { ArrowDown, GraduationCap } from "lucide-react";
import { gsap, registerGSAP } from "@/lib/gsap-register";
import { useNavCurtain } from "./NavCurtain";
import Magnetic from "./Magnetic";
import { useCountUp } from "@/hooks/useCountUp";
import ProfilePhoto from "./ProfilePhoto";

export default function Hero() {
  const { profile, stats, education } = portfolioData;
  const { navigateTo } = useNavCurtain();

  const hasStarted = useRef(false);
  const ctxRef = useRef<ReturnType<typeof gsap.context> | null>(null);
  const [countEnabled, setCountEnabled] = React.useState(false);

  const targetYear = parseInt(education.year, 10) || 2026;
  const yearCount = useCountUp({
    start: 2000,
    end: targetYear,
    duration: 1600,
    enabled: countEnabled,
  });

  const containerRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startEntrance = () => {
      if (hasStarted.current) return;
      hasStarted.current = true;
      setCountEnabled(true);
      registerGSAP();

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const ctx = gsap.context(() => {
        if (prefersReducedMotion) {
          gsap.to(containerRef.current, { opacity: 1, duration: 0.3 });
          return;
        }

        // Entrance animation
        const tl = gsap.timeline({
          defaults: { ease: "power4.out" },
          onComplete: () => {
            containerRef.current?.querySelectorAll(".will-change-transform").forEach((el) => {
              el.classList.remove("will-change-transform");
            });
          },
        });

        tl.fromTo(
          badgeRef.current,
          { opacity: 0, y: -16 },
          { opacity: 1, y: 0, duration: 0.6 }
        );

        const headlineLines = containerRef.current?.querySelectorAll<HTMLElement>(".hero-headline-line");
        if (headlineLines && headlineLines.length > 0) {
          tl.fromTo(
            headlineLines,
            { y: "115%", opacity: 0 },
            {
              y: "0%",
              opacity: 1,
              duration: 0.8,
              stagger: 0.12,
              ease: "power4.out",
            },
            "-=0.3"
          );
        }

        tl.fromTo(
          introRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.4"
        )
          .fromTo(
            buttonsRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
            "-=0.4"
          )
          .fromTo(
            portraitRef.current,
            { opacity: 0, scale: 0.9, y: 30 },
            { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.5"
          )
          .fromTo(
            statsRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
            "-=0.4"
          )
          .fromTo(
            scrollIndicatorRef.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5 },
            "-=0.3"
          );

        // Scroll-scrubbed parallax (desktop & tablet only, height > 600px)
        const mm = gsap.matchMedia();
        mm.add("(min-width: 768px) and (min-height: 601px)", () => {
          gsap.to(headlineRef.current, {
            scale: 1.05,
            opacity: 0.2,
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
          gsap.to(statsRef.current, {
            y: -65,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        });
      }, containerRef);

      ctxRef.current = ctx;
    };

    window.addEventListener("preloader:done", startEntrance, { once: true });

    // 6 s fallback — ensures hero is visible even if preloader:done never fires
    const fallback = setTimeout(startEntrance, 5000);

    return () => {
      window.removeEventListener("preloader:done", startEntrance);
      document.removeEventListener("preloader:done", startEntrance);
      clearTimeout(fallback);
      ctxRef.current?.revert();
    };
  }, []);

  // Hero portrait mouse parallax (desktop only)
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const isFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFine || !portraitRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(portraitRef.current, {
      rotateY: x * 16,
      rotateX: -y * 16,
      x: x * 22,
      y: y * 22,
      duration: 0.6,
      ease: "power2.out",
      transformPerspective: 1000,
    });
  };

  const handleMouseLeave = () => {
    if (!portraitRef.current) return;
    gsap.to(portraitRef.current, {
      rotateY: 0,
      rotateX: 0,
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="h-auto min-h-screen min-h-[100svh] min-h-[100dvh] flex flex-col justify-center pt-28 pb-16 page-x relative w-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center w-full">
        {/* Left column: Text content */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          {/* Eyebrow badge */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] text-xs font-mono text-[var(--text-muted)] w-fit shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {profile.location} · {profile.title}
            </span>
          </div>

          {/* Main headline with line-mask overflow containers */}
          <h1
            ref={headlineRef}
            className="font-heading font-extrabold text-fluid-hero text-[var(--text-main)] tracking-tight origin-left will-change-transform"
          >
            <span className="block overflow-hidden py-1">
              <span className="hero-headline-line block">
                Hi, I&apos;m{" "}
                <span className="text-[var(--accent-color)]">{profile.name}</span>
              </span>
            </span>
            <span className="block overflow-hidden py-1">
              <span className="hero-headline-line block text-[var(--text-muted)] font-normal text-[0.8em]">
                {profile.tagline}
              </span>
            </span>
          </h1>

          {/* Intro text & Education pill */}
          <div ref={introRef} className="space-y-3 max-w-[70ch]">
            <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
              {profile.location
                ? `B.Tech graduate in Electronics and Computer Science, based in ${profile.location}.`
                : profile.intro}
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] text-xs font-mono text-[var(--text-muted)] w-fit shadow-sm">
              <GraduationCap className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" />
              <span>
                B.Tech ·{" "}
                <span className="font-mono tabular-nums font-semibold text-[var(--text-main)]">
                  {yearCount}
                </span>
              </span>
            </div>
          </div>

          {/* Action CTAs with Magnetic Effect */}
          <div
            ref={buttonsRef}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <Magnetic strength={0.3}>
              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo("#work", "01 / Work");
                }}
                className="interactive-btn inline-flex items-center justify-center px-6 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-main)] font-medium text-sm hover:border-[var(--border-hover)] hover:bg-[var(--accent-soft)] transition-colors cursor-pointer"
              >
                Explore Projects
              </a>
            </Magnetic>
            <Magnetic strength={0.3}>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo("#contact", "06 / Contact");
                }}
                className="interactive-btn inline-flex items-center justify-center px-6 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-main)] font-medium text-sm hover:border-[var(--border-hover)] hover:bg-[var(--accent-soft)] transition-colors cursor-pointer"
              >
                Get in Touch
              </a>
            </Magnetic>
            <Magnetic strength={0.3}>
              <a
                href="./media/Nishit-Khatri-Resume.pdf"
                download="Nishit-Khatri-Resume.pdf"
                onClick={() => {
                  window.open(profile.resumeLink, "_blank")
                }}
                className="interactive-btn inline-flex items-center justify-center px-6 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-main)] font-medium text-sm hover:border-[var(--border-hover)] hover:bg-[var(--accent-soft)] transition-colors cursor-pointer"
              >
                <ArrowDown className="w-5 h-5 mr-2 justify-between" />
                Resume
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Right column: Hero portrait with mouse parallax (desktop) */}
        <div className="flex lg:col-span-4 justify-center lg:justify-end">
          <div
            ref={portraitRef}
            className="relative w-48 sm:w-56 lg:w-72 xl:w-80 select-none"
            style={{
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            <ProfilePhoto priority />
          </div>
        </div>
      </div>

      {/* Highlight Stats (Parallax layer) */}
      <div
        ref={statsRef}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 mt-8 border-t border-[var(--border-color)] will-change-transform w-full"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-4 sm:p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-[var(--card-shadow)]"
          >
            <div className="font-heading font-bold text-2xl sm:text-3xl text-[var(--text-main)]">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 font-mono">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="mt-10 sm:mt-12 flex justify-center"
      >
        <Magnetic strength={0.4}>
          <a
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              navigateTo("#work", "01 / Work");
            }}
            aria-label="Scroll to projects section"
            className="interactive-btn inline-flex items-center justify-center w-11 h-11 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:border-[var(--border-hover)] transition-colors animate-bounce cursor-pointer shadow-sm"
          >
            <ArrowDown className="w-5 h-5" />
          </a>
        </Magnetic>
      </div>
    </section>
  );
}
