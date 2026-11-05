"use client";

import { useEffect, useRef, useState } from "react";
import { portfolioData } from "@/data/portfolioData";
import { User, MapPin, GraduationCap } from "lucide-react";
import { gsap, ScrollTrigger, registerGSAP } from "@/lib/gsap-register";
import { useCountUp } from "@/hooks/useCountUp";
import FlipCard from "./FlipCard";

function StatCounterItem({
  value,
  label,
  active,
}: {
  value: string;
  label: string;
  active: boolean;
}) {
  const numericVal = parseInt(value.replace(/\D/g, ""), 10) || 0;
  const count = useCountUp({ end: numericVal, duration: 1600, enabled: active });

  return (
    <div className="about-content rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 text-center shadow-[var(--card-shadow)]">
      <div className="font-heading font-bold text-xl sm:text-2xl text-[var(--text-main)]">
        {active ? count : 0}
      </div>
      <div className="text-[11px] font-mono text-[var(--text-muted)] mt-1">
        {label}
      </div>
    </div>
  );
}

export default function About() {
  const { about, profile, stats, education } = portfolioData;

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const metaCardRef = useRef<HTMLDivElement>(null);
  const bioCardRef = useRef<HTMLDivElement>(null);
  const bioTextRef = useRef<HTMLParagraphElement>(null);
  const statsContainerRef = useRef<HTMLDivElement>(null);

  const [statsTriggered, setStatsTriggered] = useState(false);

  useEffect(() => {
    registerGSAP();

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 0px)", () => {
        if (prefersReducedMotion) {
          if (headingRef.current) gsap.set(headingRef.current, { y: 0, opacity: 1 });
          if (eyebrowRef.current) gsap.set(eyebrowRef.current, { opacity: 1 });
          if (portraitRef.current) gsap.set(portraitRef.current, { opacity: 1, y: 0 });
          if (metaCardRef.current) gsap.set(metaCardRef.current, { opacity: 1, y: 0 });
          if (bioCardRef.current) gsap.set(bioCardRef.current, { opacity: 1, y: 0 });
          const words = section.querySelectorAll<HTMLElement>(".about-word");
          if (words.length > 0) gsap.set(words, { opacity: 1 });
          setStatsTriggered(true);
          return;
        }

        // Section heading line-mask reveal (0.8s, power4.out)
        if (headingRef.current) {
          gsap.fromTo(
            headingRef.current,
            { y: "115%", opacity: 0 },
            {
              y: "0%",
              opacity: 1,
              duration: 0.8,
              ease: "power4.out",
              scrollTrigger: {
                trigger: headingRef.current,
                start: "top 88%",
              },
            }
          );
        }

        if (eyebrowRef.current) {
          gsap.fromTo(
            eyebrowRef.current,
            { opacity: 0, y: -10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: eyebrowRef.current,
                start: "top 90%",
              },
            }
          );
        }

        // Portrait entrance
        if (portraitRef.current) {
          gsap.fromTo(
            portraitRef.current,
            { y: 35, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: portraitRef.current,
                start: "top 85%",
              },
            }
          );
        }

        // Left metadata card fade up (y: 40 to 0)
        if (metaCardRef.current) {
          gsap.fromTo(
            metaCardRef.current,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: metaCardRef.current,
                start: "top 85%",
              },
            }
          );
        }

        // Stats container fade up & count-up trigger
        if (statsContainerRef.current) {
          gsap.fromTo(
            statsContainerRef.current.querySelectorAll(".about-content"),
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: statsContainerRef.current,
                start: "top 85%",
                onEnter: () => setStatsTriggered(true),
              },
            }
          );
        }

        // Right Bio card fade up (y: 40 to 0)
        if (bioCardRef.current) {
          gsap.fromTo(
            bioCardRef.current,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: bioCardRef.current,
                start: "top 85%",
              },
            }
          );
        }

        // Scroll-scrubbed word reveal (each word 20% to 100% opacity)
        const words = section.querySelectorAll<HTMLElement>("span.about-word");
        if (words.length > 0 && bioTextRef.current) {
          gsap.fromTo(
            words,
            { opacity: 0.2 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.05,
              scrollTrigger: {
                trigger: bioTextRef.current,
                start: "top 80%",
                end: "bottom 55%",
                scrub: 0.8,
              },
            }
          );
        }
      });
    }, section);

    // Refresh ScrollTrigger once after layout setup
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  const bioText = typeof about === "string" ? about : about.text;
  const words = bioText.split(/\s+/);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 page-x w-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start w-full">
        {/* Left Column: Heading, 3D flip portrait, metadata and stats */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <p
              ref={eyebrowRef}
              className="font-mono text-xs sm:text-sm text-[var(--accent-color)] tracking-widest uppercase mb-2"
            >
              Background
            </p>
            <div className="overflow-hidden">
              <h2
                ref={headingRef}
                className="font-heading font-extrabold text-fluid-h2 text-[var(--text-main)] will-change-transform"
              >
                Who I am.
              </h2>
            </div>
          </div>

          {/* 3D Flip Card */}
          <div ref={portraitRef} className="w-full">
            <FlipCard />
          </div>

          {/* Metadata Card */}
          <div
            ref={metaCardRef}
            className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 space-y-4 shadow-[var(--card-shadow)]"
          >
            <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
              <User className="w-4 h-4 text-[var(--accent-color)] shrink-0" />
              <span>
                {profile.name} · {profile.title}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
              <MapPin className="w-4 h-4 text-[var(--accent-color)] shrink-0" />
              <span>Based in {profile.location}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
              <GraduationCap className="w-4 h-4 text-[var(--accent-color)] shrink-0" />
              <span>Class of {education.year} Graduate</span>
            </div>
          </div>

          {/* Key metrics grid with useCountUp */}
          <div
            ref={statsContainerRef}
            className="grid grid-cols-3 gap-3"
          >
            {stats.map((stat) => (
              <StatCounterItem
                key={stat.label}
                value={stat.value}
                label={stat.label}
                active={statsTriggered}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Bio paragraph with scroll-scrubbed word reveal */}
        <div
          ref={bioCardRef}
          className="lg:col-span-7 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-10 shadow-[var(--card-shadow)]"
        >
          <p
            ref={bioTextRef}
            className="text-base sm:text-lg text-[var(--text-main)] leading-relaxed font-normal max-w-[70ch]"
          >
            {words.map((word, i) => (
              <span
                key={i}
                className="about-word inline-block mr-1.5 transition-opacity duration-150"
              >
                {word}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
