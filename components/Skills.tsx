"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { portfolioData, type SkillCategory } from "@/data/portfolioData";
import { gsap, Flip, registerGSAP } from "@/lib/gsap-register";
import { Code2, Server, Wrench, Container, Cloud } from "lucide-react";

interface CategoryMeta {
  key: string;
  category: SkillCategory;
  isPrimary: boolean;
  filterTag: string;
  icon: React.ReactNode;
}

const FILTERS = ["All", "Frontend", "Backend", "Tools", "DevOps", "Cloud"] as const;
type FilterType = (typeof FILTERS)[number];

export default function Skills() {
  const { skills } = portfolioData;

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [, startTransition] = useTransition();

  const categories: CategoryMeta[] = [
    {
      key: "frontend",
      category: skills.frontend,
      isPrimary: true,
      filterTag: "Frontend",
      icon: <Code2 className="w-5 h-5 text-[var(--accent-color)]" />,
    },
    {
      key: "backend",
      category: skills.backend,
      isPrimary: true,
      filterTag: "Backend",
      icon: <Server className="w-5 h-5 text-[var(--accent-color)]" />,
    },
    {
      key: "cloud",
      category: skills.cloud,
      isPrimary: false,
      filterTag: "Cloud",
      icon: <Cloud className="w-4 h-4 text-[var(--text-muted)]" />,
    },
    {
      key: "devops",
      category: skills.devops,
      isPrimary: false,
      filterTag: "DevOps",
      icon: <Container className="w-4 h-4 text-[var(--text-muted)]" />,
    },
    {
      key: "tools",
      category: skills.tools,
      isPrimary: false,
      filterTag: "Tools",
      icon: <Wrench className="w-4 h-4 text-[var(--text-muted)]" />,
    }
  ];

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
          if (introRef.current) gsap.set(introRef.current, { opacity: 1, y: 0 });
          if (filtersRef.current) gsap.set(filtersRef.current, { opacity: 1, y: 0 });
          const skillCards = gridRef.current?.querySelectorAll<HTMLElement>(".skill-card");
          if (skillCards && skillCards.length > 0) gsap.set(skillCards, { opacity: 1, y: 0 });
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

        if (introRef.current) {
          gsap.fromTo(
            introRef.current,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: {
                trigger: introRef.current,
                start: "top 88%",
              },
            }
          );
        }

        if (filtersRef.current) {
          gsap.fromTo(
            filtersRef.current,
            { opacity: 0, y: 15 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: filtersRef.current,
                start: "top 88%",
              },
            }
          );
        }

        // Cards rise in with a stagger (y 40 to 0)
        if (gridRef.current) {
          const cards = gridRef.current.querySelectorAll<HTMLElement>(".skill-card");
          if (cards.length > 0) {
            gsap.fromTo(
              cards,
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: gridRef.current,
                  start: "top 85%",
                },
              }
            );
          }
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // Filter click with GSAP Flip transition
  const handleFilterClick = (filter: FilterType) => {
    if (filter === activeFilter) return;

    const cards = gridRef.current?.querySelectorAll<HTMLElement>(".skill-card");
    if (!cards || cards.length === 0) {
      setActiveFilter(filter);
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setActiveFilter(filter);
      return;
    }

    // Capture layout state prior to state mutation
    const state = Flip.getState(cards);

    startTransition(() => {
      setActiveFilter(filter);
    });

    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.45,
        ease: "power3.inOut",
        scale: true,
        absolute: false,
      });
    });
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-24 page-x w-full"
    >
      <div className="mb-10 sm:mb-12">
        <p
          ref={eyebrowRef}
          className="font-mono text-xs sm:text-sm text-[var(--accent-color)] tracking-widest uppercase mb-2"
        >
          Areas of Expertise
        </p>
        <div className="overflow-hidden">
          <h2
            ref={headingRef}
            className="font-heading font-extrabold text-fluid-h2 text-[var(--text-main)] will-change-transform"
          >
            Technical Skills.
          </h2>
        </div>
        <p
          ref={introRef}
          className="mt-3 text-sm sm:text-base text-[var(--text-muted)] max-w-[70ch]"
        >
          Core development toolset across client-side frameworks, server runtimes, databases, and containerized deployment workflows.
        </p>

        {/* Filter Buttons */}
        <div
          ref={filtersRef}
          className="flex flex-wrap gap-2 pt-6"
          role="tablist"
          aria-label="Filter skill categories"
        >
          {FILTERS.map((f) => {
            const isSelected = activeFilter === f;
            return (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleFilterClick(f)}
                className={`interactive-btn font-mono text-xs px-4 py-2 rounded-xl border transition-all duration-200 cursor-pointer select-none ${isSelected
                  ? "bg-[var(--accent-color)] border-[var(--accent-color)] text-white font-semibold shadow-md"
                  : "border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--text-main)]"
                  }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 w-full"
      >
        {categories.map(({ key, category, isPrimary, filterTag, icon }) => {
          const isAdditional =
            key === "devops" || key === "cloud" || category.note === "Additional Exposure";
          const matchesFilter = activeFilter === "All" || activeFilter === filterTag;

          return (
            <div
              key={key}
              data-flip-id={`skill-${key}`}
              className={`skill-card rounded-2xl border transition-all duration-300 flex flex-col justify-between ${isPrimary ? "lg:col-span-3 p-7 sm:p-8" : "lg:col-span-2 p-6"
                } ${matchesFilter
                  ? "border-[var(--border-color)] bg-[var(--card-bg)] shadow-[var(--card-shadow)] opacity-100 scale-100 hover:border-[var(--border-hover)]"
                  : "border-[var(--border-color)] bg-[var(--card-bg)]/40 opacity-25 scale-[0.98] pointer-events-none"
                }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[var(--bg-color)] border border-[var(--border-color)]">
                      {icon}
                    </div>
                    <h3
                      className={`font-heading font-bold text-[var(--text-main)] ${isPrimary ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
                        }`}
                    >
                      {category.label}
                    </h3>
                  </div>

                  {/* Primary or quiet additional exposure badge */}
                  {isPrimary && category.note && (
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded-full border border-[var(--accent-color)] bg-[var(--accent-soft)] text-[var(--accent-color)] font-medium">
                      {category.note}
                    </span>
                  )}
                  {isAdditional && (
                    <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-muted)] font-normal">
                      Additional exposure
                    </span>
                  )}
                </div>

                {/* Chips with pop on hover and :active */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="skill-chip font-mono text-xs px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-main)] transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] active:scale-95 active:translate-y-0 cursor-default select-none shadow-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
