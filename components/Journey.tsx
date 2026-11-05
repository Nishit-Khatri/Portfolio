"use client";

import { useEffect, useRef } from "react";
import { portfolioData } from "@/data/portfolioData";
import { GraduationCap, Briefcase } from "lucide-react";
import { gsap, ScrollTrigger, registerGSAP } from "@/lib/gsap-register";

interface JourneyItem {
  id: string;
  category: "education" | "internship";
  badge: string;
  status?: string;
  title: string;
  subtitle: string;
  highlight?: string;
  icon: React.ReactNode;
}

export default function Journey() {
  const { education, internships } = portfolioData;

  const sectionRef   = useRef<HTMLElement>(null);
  const headingRef   = useRef<HTMLHeadingElement>(null);
  const eyebrowRef   = useRef<HTMLParagraphElement>(null);
  const introRef     = useRef<HTMLParagraphElement>(null);

  // Single timeline container — used as the ScrollTrigger target
  const timelineRef  = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);
  const fillRef      = useRef<HTMLDivElement>(null);

  // Dot refs: one per item for desktop and mobile layouts
  const desktopDotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileDotRefs  = useRef<(HTMLDivElement | null)[]>([]);
  // Card refs: desktop cards for x-slide; mobile cards for is-active fade-up
  const desktopCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileCardRefs  = useRef<(HTMLDivElement | null)[]>([]);

  // Chronological order: internships first, culminating with B.Tech degree (education)
  const items: JourneyItem[] = [
    ...internships.map((internship, idx) => ({
      id: `intern-${idx}`,
      category: "internship" as const,
      badge: `Virtual Internship · ${internship.period}`,
      title: internship.title,
      subtitle: internship.company,
      highlight: internship.focus,
      icon: <Briefcase className="w-4 h-4" />,
    })),
    {
      id: "edu",
      category: "education",
      badge: `Education · ${education.year}`,
      status: `Status: ${education.status}`,
      title: education.degree,
      subtitle: education.institution,
      icon: <GraduationCap className="w-4 h-4" />,
    },
  ];

  useEffect(() => {
    registerGSAP();

    const section  = sectionRef.current;
    const timeline = timelineRef.current;
    const track    = trackRef.current;
    const fill     = fillRef.current;
    if (!section || !timeline || !track || !fill) return;

    const ctx = gsap.context(() => {
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // ── Reduced motion: everything fully visible, no animation ──
      if (prefersReducedMotion) {
        if (headingRef.current) gsap.set(headingRef.current, { y: 0, opacity: 1 });
        if (eyebrowRef.current) gsap.set(eyebrowRef.current, { opacity: 1 });
        if (introRef.current)   gsap.set(introRef.current,   { opacity: 1, y: 0 });
        // Fill line fully drawn
        gsap.set(fill, { scaleY: 1, transformOrigin: "top center" });
        // All dots active
        [...desktopDotRefs.current, ...mobileDotRefs.current].forEach((dot) =>
          dot?.classList.add("is-active")
        );
        // All cards visible
        [...desktopCardRefs.current, ...mobileCardRefs.current].forEach((card) => {
          if (!card) return;
          card.classList.remove("is-entering");
          card.classList.add("is-active");
          gsap.set(card, { opacity: 1, x: 0, y: 0 });
        });
        return;
      }

      // ── Section heading animations (fire once on scroll-into-view) ──
      if (eyebrowRef.current) {
        gsap.fromTo(eyebrowRef.current, { opacity: 0, y: -10 }, {
          opacity: 1, y: 0, duration: 0.5, ease: "power2.out",
          scrollTrigger: { trigger: eyebrowRef.current, start: "top 90%" },
        });
      }
      if (headingRef.current) {
        gsap.fromTo(headingRef.current, { y: "115%", opacity: 0 }, {
          y: "0%", opacity: 1, duration: 0.8, ease: "power4.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 88%" },
        });
      }
      if (introRef.current) {
        gsap.fromTo(introRef.current, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: introRef.current, start: "top 88%" },
        });
      }

      // Mark mobile cards as entering so CSS transition fires when is-active is added
      mobileCardRefs.current.forEach((card) => card?.classList.add("is-entering"));

      // 6s fallback timer so mobile cards are guaranteed visible even if scroll trigger never fires
      const fallbackTimer = setTimeout(() => {
        mobileDotRefs.current.forEach((dot) => dot?.classList.add("is-active"));
        mobileCardRefs.current.forEach((card) => {
          if (!card) return;
          card.classList.remove("is-entering");
          card.classList.add("is-active");
        });
      }, 6000);

      // ── measure(): compute each dot's center Y relative to timeline top using getBoundingClientRect ──
      let dotCenters: number[] = [];
      let lineHeight = 0;
      let y1 = 0;

      const measureDots = (dots: (HTMLDivElement | null)[]) => {
        if (!timeline) return;
        const timelineRect = timeline.getBoundingClientRect();

        dotCenters = dots.map((dot) => {
          if (!dot) return 0;
          const dotRect = dot.getBoundingClientRect();
          // Precise center Y in timeline coordinate space (scroll-independent)
          return dotRect.top + dotRect.height / 2 - timelineRect.top;
        });

        if (dotCenters.length < 2) return;
        y1 = dotCenters[0];
        const y2 = dotCenters[dotCenters.length - 1];
        lineHeight = Math.max(0, y2 - y1);

        track.style.top    = `${y1}px`;
        track.style.height = `${lineHeight}px`;
        fill.style.top     = `${y1}px`;
        fill.style.height  = `${lineHeight}px`;
      };

      // Debounced combined measure + refresh
      let refreshTimer: ReturnType<typeof setTimeout>;
      const debouncedRefresh = (dots: (HTMLDivElement | null)[]) => () => {
        clearTimeout(refreshTimer);
        refreshTimer = setTimeout(() => {
          measureDots(dots);
          ScrollTrigger.refresh();
        }, 200);
      };

      // ── gsap.matchMedia: BOTH branches register the unified line fill logic ──
      const mm = gsap.matchMedia();

      // ─ Desktop (≥768px) ─
      mm.add("(min-width: 768px)", () => {
        const dots = desktopDotRefs.current;
        const cards = desktopCardRefs.current;
        measureDots(dots);

        // Unified ScrollTrigger: scrubs fill + lights dots
        const st = ScrollTrigger.create({
          trigger: timeline,
          start: "top 60%",
          end: "bottom 70%",
          scrub: 0.3,
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set(fill, { scaleY: progress, transformOrigin: "top center" });

            // Vertical tip of the fill line in timeline coordinate space
            const currentFillTipY = y1 + progress * lineHeight;
            const lastIndex = dots.length - 1;

            dots.forEach((dot, i) => {
              if (!dot) return;
              const dotCenter = dotCenters[i] ?? 0;

              // Activate when fill tip reaches dotCenter with a 2px tolerance
              let reached = progress > 0.005 && currentFillTipY >= dotCenter - 2;

              // Force the last dot active when progress >= 0.98, and deactivate when below
              if (i === lastIndex) {
                if (progress >= 0.98) {
                  reached = true;
                } else if (progress < 0.98 && currentFillTipY < dotCenter - 2) {
                  reached = false;
                }
              }

              if (reached) {
                dot.classList.add("is-active");
              } else {
                dot.classList.remove("is-active");
              }
            });
          },
          onRefresh: () => measureDots(dots),
        });

        // Desktop cards: x-slide entrance (re-measures dots on complete to account for height changes)
        cards.forEach((card, i) => {
          if (!card) return;
          const fromLeft = i % 2 === 0;
          gsap.fromTo(card,
            { x: fromLeft ? -50 : 50, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 85%" },
              onComplete: () => {
                measureDots(dots);
                ScrollTrigger.refresh();
              },
            }
          );
        });

        const refresh = debouncedRefresh(dots);
        window.addEventListener("resize", refresh);
        window.addEventListener("orientationchange", refresh);
        ScrollTrigger.addEventListener("refreshInit", () => measureDots(dots));
        if (document.fonts?.ready) {
          document.fonts.ready.then(refresh);
        }

        return () => {
          window.removeEventListener("resize", refresh);
          window.removeEventListener("orientationchange", refresh);
          ScrollTrigger.removeEventListener("refreshInit", () => measureDots(dots));
          clearTimeout(refreshTimer);
          st.kill();
        };
      });

      // ─ Mobile (<768px) ─
      mm.add("(max-width: 767px)", () => {
        const dots = mobileDotRefs.current;
        const cards = mobileCardRefs.current;
        measureDots(dots);

        const st = ScrollTrigger.create({
          trigger: timeline,
          start: "top 60%",
          end: "bottom 70%",
          scrub: 0.3,
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set(fill, { scaleY: progress, transformOrigin: "top center" });

            // Vertical tip of the fill line in timeline coordinate space
            const currentFillTipY = y1 + progress * lineHeight;
            const lastIndex = dots.length - 1;

            dots.forEach((dot, i) => {
              if (!dot) return;
              const card = cards[i];
              const dotCenter = dotCenters[i] ?? 0;

              // Activate when fill tip reaches dotCenter with a 2px tolerance
              let reached = progress > 0.005 && currentFillTipY >= dotCenter - 2;

              // Force the last dot active when progress >= 0.98, and deactivate when below
              if (i === lastIndex) {
                if (progress >= 0.98) {
                  reached = true;
                } else if (progress < 0.98 && currentFillTipY < dotCenter - 2) {
                  reached = false;
                }
              }

              if (reached) {
                dot.classList.add("is-active");
                if (card) {
                  card.classList.remove("is-entering");
                  card.classList.add("is-active");
                }
              } else {
                dot.classList.remove("is-active");
                if (card) {
                  card.classList.add("is-entering");
                  card.classList.remove("is-active");
                }
              }
            });
          },
          onRefresh: () => measureDots(dots),
        });

        const refresh = debouncedRefresh(dots);
        window.addEventListener("resize", refresh);
        window.addEventListener("orientationchange", refresh);
        ScrollTrigger.addEventListener("refreshInit", () => measureDots(dots));
        if (document.fonts?.ready) {
          document.fonts.ready.then(refresh);
        }

        return () => {
          window.removeEventListener("resize", refresh);
          window.removeEventListener("orientationchange", refresh);
          ScrollTrigger.removeEventListener("refreshInit", () => measureDots(dots));
          clearTimeout(refreshTimer);
          clearTimeout(fallbackTimer);
          st.kill();
        };
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="py-24 page-x w-full"
    >
      {/* Section header */}
      <div className="mb-12 sm:mb-16">
        <p
          ref={eyebrowRef}
          className="font-mono text-xs sm:text-sm text-[var(--accent-color)] tracking-widest uppercase mb-2"
        >
          Milestones
        </p>
        <div className="overflow-hidden">
          <h2
            ref={headingRef}
            className="font-heading font-extrabold text-fluid-h2 text-[var(--text-main)] will-change-transform"
          >
            Education &amp; Experience.
          </h2>
        </div>
        <p
          ref={introRef}
          className="mt-3 text-sm sm:text-base text-[var(--text-muted)] max-w-[70ch]"
        >
          Academic foundation in engineering and industry-aligned virtual internships.
        </p>
      </div>

      {/*
        ── Timeline container ──
        position: relative — required for absolute track/fill lines.
        pb-20 (80px padding bottom) ensures the last dot has enough runway to complete the trigger.
        NO overflow-hidden on this div or any parent so the glow is never clipped.
      */}
      <div ref={timelineRef} className="timeline relative w-full pt-6 pb-20">

        {/*
          Track line: muted 2px, visible on all screen sizes.
          Left offset matches the dot center:
            Mobile  → left: 16px (left-4), dot is 32px wide, center = 16px ✓
            Desktop → left: 50%, center of page ✓
          Both use -translate-x-1/2 so the 2px line is centered on those points.
          Top and height are set by JS measureDots().
        */}
        <div
          ref={trackRef}
          aria-hidden="true"
          style={{ pointerEvents: "none" }}
          className="absolute w-0.5 bg-[var(--border-color)]
            left-4 -translate-x-1/2
            md:left-1/2 md:-translate-x-1/2"
        />

        {/*
          Fill line: accent, glow, scaleY 0→1 driven by single ScrollTrigger onUpdate.
          transformOrigin: top center — set inline to guarantee correctness.
        */}
        <div
          ref={fillRef}
          aria-hidden="true"
          style={{
            pointerEvents: "none",
            transformOrigin: "top center",
            transform: "scaleY(0)",
          }}
          className="timeline-fill absolute w-0.5 bg-[var(--accent-color)] will-change-transform
            left-4 -translate-x-1/2
            md:left-1/2 md:-translate-x-1/2"
        />

        {/* ── Desktop layout (≥768px): centered line, alternating cards ── */}
        <div className="hidden md:block">
          <div className="space-y-16">
            {items.map((item, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div key={item.id} className="relative flex items-center justify-between">
                  {/* Left slot */}
                  <div className={`w-[calc(50%-2.5rem)] ${isLeft ? "pr-6 flex justify-end" : "invisible pointer-events-none"}`}>
                    {isLeft && (
                      <div
                        ref={(el) => { desktopCardRefs.current[index] = el; }}
                        className="journey-card w-full rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 space-y-2 shadow-[var(--card-shadow)] hover:border-[var(--border-hover)] transition-colors"
                      >
                        <CardContent item={item} />
                      </div>
                    )}
                  </div>

                  {/*
                    Dot: position relative, flex-shrink-0 — sits in the flex row at center.
                    JS measures its center Y via getBoundingClientRect.
                  */}
                  <div
                    ref={(el) => { desktopDotRefs.current[index] = el; }}
                    className="journey-dot relative z-10 flex-shrink-0 w-10 h-10 rounded-full border-2 border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-muted)] flex items-center justify-center opacity-100"
                  >
                    {item.icon}
                  </div>

                  {/* Right slot */}
                  <div className={`w-[calc(50%-2.5rem)] ${!isLeft ? "pl-6" : "invisible pointer-events-none"}`}>
                    {!isLeft && (
                      <div
                        ref={(el) => { desktopCardRefs.current[index] = el; }}
                        className="journey-card w-full rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 space-y-2 shadow-[var(--card-shadow)] hover:border-[var(--border-hover)] transition-colors"
                      >
                        <CardContent item={item} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Mobile layout (<768px): left line, cards offset right, in standard flow ── */}
        <div className="block md:hidden">
          <div className="space-y-8">
            {items.map((item, index) => (
              <div key={item.id} className="relative pl-12">
                {/*
                  Dot: left-4 -translate-x-1/2 (center = 16px),
                  aligned exactly on the line at left: 16px.
                */}
                <div
                  ref={(el) => { mobileDotRefs.current[index] = el; }}
                  className="journey-dot absolute left-4 -translate-x-1/2 top-3 z-10 w-8 h-8 rounded-full border-2 border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-muted)] flex items-center justify-center opacity-100"
                >
                  {item.icon}
                </div>

                {/* Card: in document flow, never absolute, wraps cleanly at 360px */}
                <div
                  ref={(el) => { mobileCardRefs.current[index] = el; }}
                  className="journey-card rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 space-y-2 shadow-[var(--card-shadow)] break-words max-w-full"
                >
                  <CardContent item={item} mobile />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

// ── Card content — shared between mobile and desktop ──
function CardContent({ item, mobile = false }: { item: JourneyItem; mobile?: boolean }) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`font-mono font-semibold px-2.5 py-0.5 rounded-full border border-[var(--border-color)] bg-[var(--accent-soft)] text-[var(--accent-color)] ${
            mobile ? "text-[11px]" : "text-xs"
          }`}
        >
          {item.badge}
        </span>
        {item.status && (
          <span className={`font-mono text-[var(--text-muted)] ${mobile ? "text-[11px]" : "text-xs"}`}>
            {item.status}
          </span>
        )}
        {item.highlight && (
          <span className={`font-mono text-[var(--accent-color)] ${mobile ? "text-[11px]" : "text-xs"}`}>
            {item.highlight}
          </span>
        )}
      </div>
      <h3
        className={`font-heading font-bold text-[var(--text-main)] pt-1 leading-snug ${
          mobile ? "text-base" : "text-lg sm:text-xl"
        }`}
      >
        {item.title}
      </h3>
      <p
        className={`text-[var(--text-muted)] leading-relaxed ${
          mobile ? "text-xs sm:text-sm" : "text-sm sm:text-base"
        }`}
      >
        {item.subtitle}
      </p>
    </>
  );
}
