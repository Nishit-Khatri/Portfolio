"use client";

import React, { useEffect, useRef, useState } from "react";
import { portfolioData } from "@/data/portfolioData";
import { RotateCw } from "lucide-react";
import { gsap, registerGSAP } from "@/lib/gsap-register";

export default function FlipCard() {
  const { profile, about } = portfolioData;
  const funFact = typeof about === "object" && about ? about.funFact : "";

  const [isFlipped, setIsFlipped] = useState(false);
  const isFlippedRef = useRef(false);
  const isAnimating = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLButtonElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    registerGSAP();

    const container = containerRef.current;
    const card = cardRef.current;
    const front = frontRef.current;
    const back = backRef.current;
    if (!container || !card || !front || !back) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(card, { transform: "none" });
        gsap.set(front, {
          opacity: isFlippedRef.current ? 0 : 1,
          display: isFlippedRef.current ? "none" : "flex",
          transform: "none",
        });
        gsap.set(back, {
          opacity: isFlippedRef.current ? 1 : 0,
          display: isFlippedRef.current ? "flex" : "none",
          transform: "none",
        });
      }
    }, container);

    ctxRef.current = ctx;

    return () => {
      ctx.revert();
      if (card) {
        gsap.killTweensOf(card);
      }
      if (front) {
        gsap.killTweensOf(front);
      }
      if (back) {
        gsap.killTweensOf(back);
      }
    };
  }, []);

  const handleFlip = () => {
    // Ignore clicks while mid-flip
    if (isAnimating.current) return;
    isAnimating.current = true;

    const nextFlipped = !isFlippedRef.current;
    isFlippedRef.current = nextFlipped;
    setIsFlipped(nextFlipped);

    const card = cardRef.current;
    const front = frontRef.current;
    const back = backRef.current;
    if (!card || !front || !back) {
      isAnimating.current = false;
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // Reduced motion: 150ms cross-fade, no 3D rotation
      if (nextFlipped) {
        gsap.to(front, {
          opacity: 0,
          duration: 0.15,
          onComplete: () => {
            front.style.display = "none";
            back.style.display = "flex";
            gsap.fromTo(
              back,
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.15,
                onComplete: () => {
                  isAnimating.current = false;
                },
              }
            );
          },
        });
      } else {
        gsap.to(back, {
          opacity: 0,
          duration: 0.15,
          onComplete: () => {
            back.style.display = "none";
            front.style.display = "flex";
            gsap.fromTo(
              front,
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.15,
                onComplete: () => {
                  isAnimating.current = false;
                },
              }
            );
          },
        });
      }
      return;
    }

    // 3D rotation: 0.7s power3.inOut
    const targetRotateY = nextFlipped ? 180 : 0;
    gsap.to(card, {
      rotateY: targetRotateY,
      rotateX: 0,
      duration: 0.7,
      ease: "power3.inOut",
      onComplete: () => {
        isAnimating.current = false;
      },
    });
  };

  // Desktop hover 3D tilt (pointer: fine and hover: hover only, when not flipped)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isFlippedRef.current || isAnimating.current) return;
    const isFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFine || !cardRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(cardRef.current, {
      rotateY: x * 12,
      rotateX: -y * 12,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 1000,
    });
  };

  const handleMouseLeave = () => {
    if (isFlippedRef.current || isAnimating.current) return;
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full max-w-[320px] mx-auto relative select-none"
      style={{ perspective: "1000px" }}
    >
      <button
        ref={cardRef}
        type="button"
        onClick={handleFlip}
        aria-pressed={isFlipped}
        aria-label={isFlipped ? "Flip card back to profile" : "Flip card to see a fun fact"}
        className="w-full aspect-[4/5] relative rounded-[24px] cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-color)] shadow-[var(--card-shadow)]"
        style={{
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
        }}
      >
        {/* FRONT FACE */}
        <div
          ref={frontRef}
          aria-hidden={isFlipped}
          className="absolute inset-0 rounded-[24px] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-7 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
          }}
        >
          {/* Top Row: Tag & subtle accent corner mark */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold text-[var(--accent-color)] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--accent-soft)] border border-[var(--border-color)]">
              Developer
            </span>
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-color)]/70 shadow-[0_0_8px_var(--accent-color)]" />
            </div>
          </div>

          {/* Center Monogram & Name */}
          <div className="my-auto flex flex-col items-center text-center space-y-4">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[var(--accent-soft)] border border-[var(--border-color)] flex items-center justify-center shadow-inner"
              aria-hidden="true"
            >
              <span className="font-heading font-extrabold text-3xl sm:text-4xl text-[var(--accent-color)] tracking-tight">
                NK
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-[var(--text-main)] tracking-tight">
                {profile.name}
              </h3>
              <p className="font-mono text-xs sm:text-sm text-[var(--text-muted)]">
                {profile.title}
              </p>
            </div>
          </div>

          {/* Bottom Hint */}
          <div className="flex items-center justify-center gap-1.5 font-mono text-[11px] text-[var(--text-muted)] pt-3 border-t border-[var(--border-color)]">
            <RotateCw className="w-3.5 h-3.5 text-[var(--accent-color)]" aria-hidden="true" />
            <span>Tap to flip</span>
          </div>
        </div>

        {/* BACK FACE */}
        <div
          ref={backRef}
          aria-hidden={!isFlipped}
          className="absolute inset-0 rounded-[24px] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-7 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Top Row: Label */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold text-[var(--accent-color)] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--accent-soft)] border border-[var(--border-color)]">
              Fun fact
            </span>
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-color)]/70 shadow-[0_0_8px_var(--accent-color)]" />
            </div>
          </div>

          {/* Center Fun Fact Content */}
          <div className="my-auto text-center px-2 py-4">
            {funFact ? (
              <p className="text-sm sm:text-base text-[var(--text-main)] leading-relaxed font-normal">
                {funFact}
              </p>
            ) : (
              <p className="font-mono text-xs sm:text-sm text-[var(--text-muted)] italic leading-relaxed">
                Add your fun fact in data/portfolioData.ts
              </p>
            )}
          </div>

          {/* Bottom Hint */}
          <div className="flex items-center justify-center gap-1.5 font-mono text-[11px] text-[var(--text-muted)] pt-3 border-t border-[var(--border-color)]">
            <RotateCw className="w-3.5 h-3.5 text-[var(--accent-color)]" aria-hidden="true" />
            <span>Tap to flip back</span>
          </div>
        </div>
      </button>
    </div>
  );
}

