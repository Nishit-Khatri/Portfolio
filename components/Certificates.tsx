"use client";

import { useEffect, useRef } from "react";
import { portfolioData, type Certificate } from "@/data/portfolioData";
import { Award, ExternalLink } from "lucide-react";
import { gsap, registerGSAP } from "@/lib/gsap-register";

function DemoCertificateCard({ cert }: { cert: Certificate }) {
  return (
    <div className="cert-card rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--card-bg)]/40 p-6 space-y-3 relative opacity-80 hover:opacity-100 transition-all duration-300 hover:-translate-y-1.5 active:translate-y-0 shadow-sm cursor-default">
      <div className="flex items-center justify-between">
        <Award className="w-5 h-5 text-[var(--text-muted)]" />
        <span className="font-mono text-xs px-2.5 py-0.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--accent-color)] font-medium">
          Demo
        </span>
      </div>

      <div>
        <h3 className="font-heading font-bold text-base text-[var(--text-muted)]">
          {cert.title}
        </h3>
        <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
          {cert.issuer}
        </p>
      </div>

      <div className="text-[11px] font-mono text-[var(--text-muted)]/70 pt-2 border-t border-[var(--border-color)]">
        Placeholder entry
      </div>
    </div>
  );
}

function RealCertificateCard({ cert }: { cert: Certificate }) {
  // Only display fields that are non-empty and not dummy placeholders
  const hasDate = Boolean(cert.date && !cert.date.toLowerCase().includes("add date"));
  const hasIssuer = Boolean(cert.issuer && !cert.issuer.toLowerCase().includes("issuer name"));
  const hasId = Boolean(
    cert.credentialId && !cert.credentialId.toLowerCase().includes("add credential")
  );
  const hasVerify = Boolean(cert.verifyUrl && cert.verifyUrl.trim() !== "");

  return (
    <div className="cert-card rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 space-y-3 shadow-[var(--card-shadow)] hover:border-[var(--border-hover)] transition-all duration-300 hover:-translate-y-1.5 active:translate-y-0 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <Award className="w-5 h-5 text-[var(--accent-color)]" />
        {hasDate && (
          <span className="font-mono text-xs text-[var(--text-muted)]">
            {cert.date}
          </span>
        )}
      </div>

      <div>
        <h3 className="font-heading font-bold text-lg text-[var(--text-main)]">
          {cert.title}
        </h3>
        {hasIssuer && (
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {cert.issuer}
          </p>
        )}
      </div>

      {hasId && (
        <p className="font-mono text-xs text-[var(--text-muted)] pt-1">
          ID: {cert.credentialId}
        </p>
      )}

      {hasVerify && (
        <div className="pt-3 border-t border-[var(--border-color)]">
          <a
            href={cert.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="interactive-btn inline-flex items-center gap-1.5 font-mono text-xs text-[var(--accent-color)] hover:underline"
          >
            <span>Verify Credential</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}

export default function Certificates() {
  const { certifications, showDemoCertificates } = portfolioData;

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const realCerts = certifications.filter((c) => !c.isDemo);
  const demoCerts = certifications.filter((c) => c.isDemo);

  const hasReal = realCerts.length > 0;
  const showDemo = !hasReal && showDemoCertificates && demoCerts.length > 0;
  const showEmpty = !hasReal && !showDemo;

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
          if (captionRef.current) gsap.set(captionRef.current, { opacity: 1 });
          const certCards = gridRef.current?.querySelectorAll<HTMLElement>(".cert-card");
          if (certCards && certCards.length > 0) gsap.set(certCards, { opacity: 1, y: 0 });
          return;
        }

        // Heading line-mask reveal
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

        if (captionRef.current) {
          gsap.fromTo(
            captionRef.current,
            { opacity: 0, y: 15 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: {
                trigger: captionRef.current,
                start: "top 88%",
              },
            }
          );
        }

        // Cards rise in with a stagger (y 40 to 0)
        if (gridRef.current) {
          const cards = gridRef.current.querySelectorAll<HTMLElement>(".cert-card");
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

  return (
    <section
      id="certificates"
      ref={sectionRef}
      className="py-24 page-x w-full"
    >
      <div className="mb-12 sm:mb-16">
        <p
          ref={eyebrowRef}
          className="font-mono text-xs sm:text-sm text-[var(--accent-color)] tracking-widest uppercase mb-2"
        >
          Credentials
        </p>
        <div className="overflow-hidden">
          <h2
            ref={headingRef}
            className="font-heading font-extrabold text-fluid-h2 text-[var(--text-main)] will-change-transform"
          >
            Certifications.
          </h2>
        </div>

        {showDemo && (
          <p
            ref={captionRef}
            className="mt-3 text-xs sm:text-sm text-[var(--text-muted)] font-mono"
          >
            Placeholder certificates. Replace them in data/portfolioData.ts.
          </p>
        )}
      </div>

      {showEmpty && (
        <div className="cert-card rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--card-bg)]/20 p-12 text-center text-[var(--text-muted)] animate-[breathing_4s_ease-in-out_infinite]">
          <Award className="w-8 h-8 mx-auto mb-3 opacity-40 text-[var(--text-muted)]" />
          <p className="font-mono text-sm">Certificates will appear here.</p>
        </div>
      )}

      {(hasReal || showDemo) && (
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
        >
          {hasReal
            ? realCerts.map((cert) => (
                <RealCertificateCard key={cert.id} cert={cert} />
              ))
            : demoCerts.map((cert) => (
                <DemoCertificateCard key={cert.id} cert={cert} />
              ))}
        </div>
      )}
    </section>
  );
}
