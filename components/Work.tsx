"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { gsap, ScrollTrigger, registerGSAP } from "@/lib/gsap-register";
import { portfolioData, type Project } from "@/data/portfolioData";

function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ─── Project Action Icons (Bottom-Right) ──────────────────────────
function ProjectActionLinks({ project }: { project: Project }) {
  const { hideEmptyProjectLinks } = portfolioData;

  const hasGithub = Boolean(project.github && project.github.trim() !== "");
  const hasDemo = Boolean(project.demo && project.demo.trim() !== "");

  if (hideEmptyProjectLinks && !hasGithub && !hasDemo) {
    return null;
  }

  return (
    <div className="flex items-center gap-2.5 shrink-0 ml-auto">
      {/* GitHub Icon Link */}
      {hasGithub ? (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${project.title} on GitHub`}
          className="interactive-btn group/icon w-11 h-11 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-main)] hover:bg-[var(--accent-color)] hover:border-[var(--accent-color)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] focus-visible:ring-offset-2 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm"
        >
          <GithubIcon className="w-5 h-5 transition-transform duration-200 group-hover/icon:-translate-y-0.5 group-hover/icon:translate-x-0.5" />
        </a>
      ) : (
        !hideEmptyProjectLinks && (
          <span
            aria-disabled="true"
            title="Add link in data/portfolioData.ts"
            className="w-11 h-11 rounded-full border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-muted)] opacity-40 cursor-not-allowed flex items-center justify-center select-none"
          >
            <GithubIcon className="w-5 h-5" />
          </span>
        )
      )}

      {/* Live Demo Icon Link */}
      {hasDemo ? (
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.title} live demo`}
          className="interactive-btn group/icon w-11 h-11 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-main)] hover:bg-[var(--accent-color)] hover:border-[var(--accent-color)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] focus-visible:ring-offset-2 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm"
        >
          <ExternalLink className="w-5 h-5 transition-transform duration-200 group-hover/icon:-translate-y-0.5 group-hover/icon:translate-x-0.5" />
        </a>
      ) : (
        !hideEmptyProjectLinks && (
          <span
            aria-disabled="true"
            title="Add link in data/portfolioData.ts"
            className="w-11 h-11 rounded-full border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-muted)] opacity-40 cursor-not-allowed flex items-center justify-center select-none"
          >
            <ExternalLink className="w-5 h-5" />
          </span>
        )
      )}
    </div>
  );
}

// ─── Project Visual Area (Image or Gradient Fallback) ─────────────
function ProjectVisual({
  project,
  onImageLoad,
}: {
  project: Project;
  onImageLoad?: () => void;
}) {
  const [imageError, setImageError] = useState(false);
  const hasValidImage = Boolean(project.image && project.image.trim() !== "" && !imageError);

  if (hasValidImage) {
    return (
      <div className="relative w-full h-full min-h-full">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onLoad={onImageLoad}
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Gradient placeholder fallback: never blank!
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--card-bg) 0%, var(--accent-soft) 50%, var(--card-bg) 100%)",
      }}
    >
      {/* Background project ID watermark */}
      <span
        aria-hidden="true"
        className="font-mono text-6xl sm:text-7xl font-black text-[var(--accent-color)] opacity-20 tracking-tighter"
      >
        {project.id}
      </span>

      {/* Foreground label complying with sample data rules */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <span className="font-heading font-bold text-sm sm:text-base text-[var(--text-main)] mb-1">
          {project.title}
        </span>
        <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-[var(--text-muted)] tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)]/80 shadow-sm backdrop-blur-sm">
          Sample data preview
        </span>
      </div>
    </div>
  );
}

// ─── Desktop Card ─────────────────────────────────────────────────
interface CardProps {
  project: Project;
  index: number;
  total: number;
  onImageLoad?: () => void;
}

function DesktopCard({ project, index, total, onImageLoad }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const isTouch = useRef(false);

  useEffect(() => {
    isTouch.current = window.matchMedia("(hover: none)").matches;
  }, []);

  function handleMouseEnter() {
    if (isTouch.current) return;
    gsap.to(visualRef.current, { scale: 1.04, duration: 0.4, ease: "power2.out" });
  }

  function handleMouseLeave() {
    if (isTouch.current) return;
    gsap.to(visualRef.current, { scale: 1, duration: 0.4, ease: "power2.out" });
  }

  const topOffset = 80 + index * 16;

  return (
    <div
      className="work-card-wrapper sticky w-full"
      style={{ top: topOffset, zIndex: 10 + index }}
    >
      <div
        ref={cardRef}
        data-card-index={index}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative group rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-[var(--card-shadow)] overflow-hidden w-full"
      >
        <div className="flex flex-col lg:flex-row lg:items-stretch min-h-[260px] w-full">
          {/* Visual area: 16/10 aspect on smaller views, responsive column on desktop */}
          <div
            ref={visualRef}
            className="w-full lg:w-96 shrink-0 overflow-hidden bg-[var(--bg-color)] border-b lg:border-b-0 lg:border-r border-[var(--border-color)] relative aspect-[16/10] lg:aspect-auto min-h-[220px]"
          >
            <ProjectVisual project={project} onImageLoad={onImageLoad} />
          </div>

          {/* Info area */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-[var(--text-main)] leading-tight">
                {project.title}
              </h3>

              <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed max-w-[70ch]">
                {project.description}
              </p>
            </div>

            {/* Bottom row: Tech stack chips + Two Icon Links on bottom-right */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border-color)]">
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-xs px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-muted)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <ProjectActionLinks project={project} />
            </div>
          </div>
        </div>

        {/* Index badge */}
        <div className="absolute top-4 left-4 font-mono text-[10px] px-2 py-0.5 rounded border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--accent-color)] shadow-sm">
          {index + 1}/{total}
        </div>
      </div>
    </div>
  );
}

// ─── Mobile/Tablet Card ───────────────────────────────────────────
function MobileCard({
  project,
  onImageLoad,
}: {
  project: Project;
  onImageLoad?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      className="mobile-work-card rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-[var(--card-shadow)] p-5 sm:p-6 relative overflow-hidden w-full flex flex-col gap-5"
    >
      {/* Visual ABOVE text, full width of the card, aspect 16/10, rounded 20px, no hidden classes */}
      <div className="mobile-card-visual relative w-full aspect-[16/10] rounded-[20px] overflow-hidden border border-[var(--border-color)] bg-[var(--bg-color)] shrink-0">
        <ProjectVisual project={project} onImageLoad={onImageLoad} />
      </div>

      {/* Info area */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs text-[var(--accent-color)] font-semibold">
            {project.id}
          </span>
        </div>
        <h3 className="font-heading font-bold text-lg sm:text-xl text-[var(--text-main)] leading-snug">
          {project.title}
        </h3>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-[70ch]">
          {project.description}
        </p>
      </div>

      {/* Bottom row: Stack chips + Two Icon Links on bottom-right */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border-color)] mt-auto">
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="font-mono text-xs px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-muted)]"
            >
              {tech}
            </span>
          ))}
        </div>

        <ProjectActionLinks project={project} />
      </div>
    </div>
  );
}

// ─── Main Work Section ────────────────────────────────────────────
export default function Work() {
  const { projects } = portfolioData;
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  // Debounced ScrollTrigger refresh after images finish loading
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleImageLoad = () => {
    if (refreshTimer.current) {
      clearTimeout(refreshTimer.current);
    }
    refreshTimer.current = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  };

  useEffect(() => {
    registerGSAP();

    const section = sectionRef.current;
    const header = headerRef.current;
    const desktop = desktopRef.current;
    const mobile = mobileRef.current;
    if (!section) return;

    ctxRef.current = gsap.context(() => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mm = gsap.matchMedia();

      // ── Desktop stacking cards (≥1024px, height ≥ 600px, hover: hover) ──
      mm.add("(min-width: 1024px) and (min-height: 600px) and (hover: hover)", () => {
        if (!desktop) return;

        desktop.style.display = "flex";
        if (mobile) mobile.style.display = "none";

        const cards = desktop.querySelectorAll<HTMLElement>(".work-card-wrapper");

        // Header reveal
        if (header && !prefersReduced) {
          gsap.fromTo(
            header,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: header,
                start: "top 85%",
              },
            }
          );
        }

        // Each card: clip-path reveal + dim/scale the previous when next one overlaps
        cards.forEach((wrapper, i) => {
          const inner = wrapper.querySelector<HTMLElement>("[data-card-index]");
          if (!inner) return;

          if (!prefersReduced) {
            // Entrance: clip-path + scale reveal (starts only inside GSAP)
            gsap.fromTo(
              inner,
              { clipPath: "inset(0 0 100% 0)", scale: 1.08 },
              {
                clipPath: "inset(0 0 0% 0)",
                scale: 1,
                duration: 0.9,
                ease: "power4.out",
                scrollTrigger: {
                  trigger: wrapper,
                  start: "top 88%",
                },
                onComplete: () => {
                  inner.style.willChange = "auto";
                  inner.style.clipPath = "none";
                },
              }
            );

            // Scale + dim previous cards as next scrolls over them
            if (i < cards.length - 1) {
              const nextWrapper = cards[i + 1];
              ScrollTrigger.create({
                trigger: nextWrapper,
                start: "top 80%",
                end: "top 40%",
                scrub: 0.8,
                onUpdate: (self) => {
                  const progress = self.progress;
                  gsap.set(inner, {
                    scale: 1 - 0.08 * progress,
                    opacity: 1 - 0.4 * progress,
                  });
                },
              });
            }
          }
        });
      });

      // ── Mobile / tablet / short screens vertical list ──
      mm.add("(max-width: 1023px), (max-height: 599px), (hover: none)", () => {
        if (desktop) desktop.style.display = "none";
        if (mobile) mobile.style.display = "flex";

        if (header && !prefersReduced) {
          gsap.fromTo(
            header,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: { trigger: header, start: "top 85%" },
            }
          );
        }

        if (!prefersReduced && mobile) {
          const mobileCards = mobile.querySelectorAll<HTMLElement>(".mobile-work-card");
          mobileCards.forEach((card) => {
            // Mobile version: simple fade-up animation (no clip-path)
            gsap.fromTo(
              card,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 88%",
                },
              }
            );
          });
        }
      });

      // Fallback: if the trigger has not fired after 4s, clear inline styles so cards are visible
      const fallbackTimer = setTimeout(() => {
        if (mobile) {
          const mobileCards = mobile.querySelectorAll<HTMLElement>(".mobile-work-card");
          mobileCards.forEach((card) => {
            card.style.opacity = "1";
            card.style.transform = "none";
          });
        }
        if (desktop) {
          const inners = desktop.querySelectorAll<HTMLElement>("[data-card-index]");
          inners.forEach((inner) => {
            inner.style.opacity = "1";
            inner.style.transform = "none";
            inner.style.clipPath = "none";
          });
        }
      }, 4000);

      // Refresh ScrollTrigger once fonts are fully loaded
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => {
          ScrollTrigger.refresh();
        });
      }

      return () => {
        clearTimeout(fallbackTimer);
      };
    }, section);

    return () => {
      ctxRef.current?.revert();
      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
      }
    };
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="py-24 page-x w-full"
    >
      {/* Section Header */}
      <div ref={headerRef} className="mb-12 sm:mb-16">
        <p className="font-mono text-xs sm:text-sm text-[var(--accent-color)] tracking-widest uppercase mb-2">
          Projects
        </p>
        <h2 className="font-heading font-extrabold text-fluid-h2 text-[var(--text-main)]">
          Selected Projects.
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)] max-w-[70ch]">
          Full stack applications built with modern frameworks, real-time messaging, and API integrations.
        </p>
      </div>

      {/* ── Desktop stacking layout ── */}
      <div
        ref={desktopRef}
        className="flex-col gap-0 relative w-full"
        style={{ display: "none" }}
      >
        {/* Spacer so the last card can un-pin */}
        <div style={{ paddingBottom: `${projects.length * 100}px` }}>
          {projects.map((project, i) => (
            <DesktopCard
              key={project.id}
              project={project}
              index={i}
              total={projects.length}
              onImageLoad={handleImageLoad}
            />
          ))}
        </div>
      </div>

      {/* ── Mobile/tablet vertical list ── */}
      <div
        ref={mobileRef}
        className="flex-col gap-6 sm:gap-8 w-full"
        style={{ display: "none" }}
      >
        {projects.map((project) => (
          <MobileCard
            key={project.id}
            project={project}
            onImageLoad={handleImageLoad}
          />
        ))}
      </div>
    </section>
  );
}
