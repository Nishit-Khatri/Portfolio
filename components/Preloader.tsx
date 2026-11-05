"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { profile } from "@/data/portfolioData";

export default function Preloader() {
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const html = document.documentElement;
    let finished = false;
    let failsafeTimeout: ReturnType<typeof setTimeout> | undefined;
    let tl: gsap.core.Timeline | null = null;
    let ctx: gsap.Context | null = null;

    const finish = () => {
      if (finished) return;
      finished = true;

      if (failsafeTimeout) {
        clearTimeout(failsafeTimeout);
        failsafeTimeout = undefined;
      }
      if (tl) {
        tl.kill();
        tl = null;
      }

      html.classList.remove("is-loading");

      try {
        sessionStorage.setItem("nk-preloader", "1");
      } catch {
        // ignore storage quota / private browsing errors
      }

      setGone(true);
      window.dispatchEvent(new CustomEvent("preloader:done"));
    };

    // Early exit 1: already seen in this session
    let seen = false;
    try {
      seen = sessionStorage.getItem("nk-preloader") === "1";
    } catch {
      // ignore storage access errors
    }

    if (seen) {
      finish();
      return;
    }

    // Early exit 2: reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.to(root, {
        opacity: 0,
        duration: 0.3,
        onComplete: finish,
      });
      return;
    }

    // Standard sequence
    html.classList.add("is-loading");
    failsafeTimeout = setTimeout(finish, 8000);

    const isMobile = window.innerWidth < 768;
    const d = isMobile ? 1.8 : 2.2;

    ctx = gsap.context(() => {
      const letters = root.querySelectorAll(".pl-letter");
      const sub = root.querySelector(".pl-sub");
      const countEl = root.querySelector(".pl-count");
      const bar = root.querySelector(".pl-bar");
      const content = root.querySelector(".pl-content");
      const panel = root.querySelector(".pl-panel");

      const counterObj = { val: 0 };

      tl = gsap.timeline({
        onComplete: finish,
      });

      if (letters.length > 0) {
        tl.fromTo(
          letters,
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.65 * d,
            stagger: 0.04 * d,
            ease: "power4.out",
          }
        );
      }

      if (sub) {
        tl.fromTo(
          sub,
          { y: 14, opacity: 0 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45 * d,
            ease: "power3.out",
          },
          "-=0.25"
        );
      }

      tl.fromTo(
        counterObj,
        { val: 0 },
        {
          val: 100,
          duration: 1.1 * d,
          ease: "power1.inOut",
          onUpdate: () => {
            if (countEl) {
              countEl.textContent = String(Math.round(counterObj.val));
            }
          },
        },
        "<"
      );

      if (bar) {
        tl.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1 * d,
            ease: "power1.inOut",
          },
          "<"
        );
      }

      if (content) {
        tl.to(content, {
          yPercent: -20,
          opacity: 0,
          duration: 0.35 * d,
          ease: "power2.in",
        });
      }

      if (panel) {
        tl.to(panel, {
          yPercent: -100,
          duration: 0.8 * d,
          ease: "power4.inOut",
        });
      }
    }, root);

    return () => {
      if (failsafeTimeout) {
        clearTimeout(failsafeTimeout);
      }
      if (tl) {
        tl.kill();
      }
      if (ctx) {
        ctx.revert();
      }
      html.classList.remove("is-loading");
    };
  }, []);

  if (gone) return null;

  const name = profile.name || "Nishit Khatri";
  const words = name.split(" ");

  return (
    <div
      ref={rootRef}
      className="preloader"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100dvh",
        zIndex: 9999,
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      <div
        className="pl-panel"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          backgroundColor: "var(--bg-color, #0C0C0E)",
          color: "var(--text-main, #F4F4F2)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          paddingTop: "max(1.5rem, env(safe-area-inset-top, 1.5rem))",
          paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 1.5rem))",
          paddingLeft: "max(1.5rem, env(safe-area-inset-left, 1.5rem))",
          paddingRight: "max(1.5rem, env(safe-area-inset-right, 1.5rem))",
          boxSizing: "border-box",
        }}
      >
        <div
          className="pl-content"
          style={{
            margin: "auto 0",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 0.5rem",
          }}
        >
          <h1
            className="pl-name"
            aria-label={name}
            style={{
              fontFamily: "var(--font-heading, sans-serif)",
              fontWeight: 800,
              fontSize: "clamp(2rem, 9vw, 6rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              columnGap: "0.3em",
              rowGap: "0.1em",
              margin: 0,
              color: "var(--text-main, #F4F4F2)",
            }}
          >
            {words.map((word) => (
              <span
                key={word}
                className="pl-word"
                style={{
                  display: "inline-flex",
                  whiteSpace: "nowrap",
                }}
              >
                {word.split("").map((char, cIdx) => (
                  <span
                    key={`${char}-${cIdx}`}
                    className="pl-mask"
                    style={{
                      display: "inline-block",
                      overflow: "hidden",
                      paddingBottom: "0.12em",
                    }}
                  >
                    <span
                      className="pl-letter"
                      style={{
                        display: "inline-block",
                        lineHeight: 1.1,
                      }}
                    >
                      {char}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p
            className="pl-sub"
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
              color: "var(--accent-color, #6C8BFF)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginTop: "0.75rem",
            }}
          >
            {profile.title}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
            <div
              className="pl-count"
              style={{
                fontFamily: "var(--font-heading, sans-serif)",
                fontWeight: 700,
                fontSize: "clamp(2.5rem, 12vw, 6rem)",
                lineHeight: 1,
                color: "var(--text-main, #F4F4F2)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              0
            </div>
            <span
              style={{
                color: "var(--accent-color, #6C8BFF)",
                fontWeight: 700,
                fontSize: "clamp(1.25rem, 5vw, 2rem)",
              }}
            >
              %
            </span>
          </div>

          <div
            style={{
              width: "100%",
              height: "3px",
              backgroundColor: "var(--border-color, rgba(255, 255, 255, 0.08))",
              borderRadius: "9999px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              className="pl-bar"
              style={{
                position: "absolute",
                inset: 0,
                height: "3px",
                width: "100%",
                backgroundColor: "var(--accent-color, #6C8BFF)",
                transformOrigin: "left center",
                transform: "scaleX(0)",
                willChange: "transform",
                boxShadow: "0 0 12px var(--accent-color, #6C8BFF)",
              }}
            />
          </div>
        </div>

        <svg
          className="pl-curve"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            height: "clamp(3rem, 5vw, 5rem)",
            display: "block",
            fill: "var(--bg-color, #0C0C0E)",
            pointerEvents: "none",
            marginTop: "-1px",
          }}
        >
          <path d="M 0,0 Q 50,100 100,0 Z" />
        </svg>
      </div>
    </div>
  );
}
