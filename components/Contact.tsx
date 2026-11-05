"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { portfolioData } from "@/data/portfolioData";
import { Mail, Copy, Check, Clock, AlertCircle, Loader2, MapPin, Phone } from "lucide-react";
import { gsap, ScrollTrigger, registerGSAP } from "@/lib/gsap-register";
import Magnetic from "./Magnetic";
import { useLenis } from "./LenisProvider";
import { formatPhoneDisplay, phoneHref } from "@/lib/contactFormat";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.99 0 1.8-.81 1.8-1.8 0-.99-.81-1.8-1.8-1.8-.99 0-1.8.81-1.8 1.8 0 .99.81 1.8 1.8 1.8m1.4 9.74v-8.37H5.06v8.37h2.8z" />
    </svg>
  );
}

function ISTClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      try {
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        setTime(formatter.format(new Date()));
      } catch {
        setTime("");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] text-xs font-mono text-[var(--text-muted)] shadow-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <Clock className="w-3.5 h-3.5 text-[var(--accent-color)]" />
      <span>{time} IST (India)</span>
    </div>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SuccessModalProps {
  firstName: string;
  email: string;
  ackSent: boolean;
  onClose: () => void;
}

function SuccessModal({ firstName, email, ackSent, onClose }: SuccessModalProps) {
  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const modalCardRef = useRef<HTMLDivElement>(null);
  const checkSvgRef = useRef<SVGSVGElement>(null);
  const checkPathRef = useRef<SVGPathElement>(null);
  const pulseRingRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const doneBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus Done button on open
    doneBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Tab") {
        // Simple trap to the done button as sole focusable element
        e.preventDefault();
        doneBtnRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Entrance Animation
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.to(modalOverlayRef.current, { opacity: 1, duration: 0.15 });
        gsap.to(modalCardRef.current, { opacity: 1, scale: 1, duration: 0.15 });
        if (checkPathRef.current) {
          gsap.set(checkPathRef.current, { strokeDashoffset: 0 });
        }
        return;
      }

      // Backdrop fade
      gsap.fromTo(modalOverlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });

      // Spring popup scale
      gsap.fromTo(
        modalCardRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: isMobile ? 0.4 : 0.5,
          ease: "back.out(1.7)",
        }
      );

      // Pulse ring expand
      if (pulseRingRef.current) {
        gsap.fromTo(
          pulseRingRef.current,
          { scale: 0.8, opacity: 0.8 },
          { scale: 1.8, opacity: 0, duration: 0.7, ease: "power2.out" }
        );
      }

      // Checkmark draw
      if (checkPathRef.current) {
        gsap.fromTo(
          checkPathRef.current,
          { strokeDashoffset: 32 },
          { strokeDashoffset: 0, duration: 0.45, ease: "power2.out", delay: 0.15 }
        );
      }

      // Confetti particles burst
      const container = particlesRef.current;
      if (container) {
        const particleCount = isMobile ? 8 : 16;
        container.innerHTML = "";
        const particles: HTMLSpanElement[] = [];

        for (let i = 0; i < particleCount; i++) {
          const p = document.createElement("span");
          p.style.position = "absolute";
          p.style.width = i % 2 === 0 ? "6px" : "8px";
          p.style.height = i % 2 === 0 ? "6px" : "8px";
          p.style.borderRadius = i % 3 === 0 ? "2px" : "50%";
          p.style.backgroundColor =
            i % 2 === 0
              ? "var(--accent-color, #6C8BFF)"
              : "var(--text-main, #F4F4F2)";
          p.style.left = "50%";
          p.style.top = "50%";
          p.style.transform = "translate(-50%, -50%)";
          container.appendChild(p);
          particles.push(p);

          const angle = (i / particleCount) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
          const distance = 45 + Math.random() * (isMobile ? 35 : 55);
          const targetX = Math.cos(angle) * distance;
          const targetY = Math.sin(angle) * distance;

          gsap.fromTo(
            p,
            { x: 0, y: 0, opacity: 1, scale: 1 },
            {
              x: targetX,
              y: targetY,
              opacity: 0,
              scale: 0.3,
              duration: 0.65 + Math.random() * 0.25,
              ease: "power2.out",
              onComplete: () => {
                p.remove();
              },
            }
          );
        }
      }
    }, modalCardRef);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      ctx.revert();
    };
  }, [onClose]);

  const handleClose = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      onClose();
      return;
    }

    gsap.to(modalCardRef.current, {
      scale: 0.9,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
    });
    gsap.to(modalOverlayRef.current, {
      opacity: 0,
      duration: 0.2,
      onComplete: onClose,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-heading"
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        ref={modalOverlayRef}
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        style={{ WebkitBackdropFilter: "blur(12px)" }}
      />

      {/* Modal Card */}
      <div
        ref={modalCardRef}
        className="relative z-10 w-full max-w-[420px] rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 text-center shadow-2xl"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
          paddingTop: "max(1.5rem, env(safe-area-inset-top, 1.5rem))",
          paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 1.5rem))",
        }}
      >
        {/* Checkmark icon with pulse & confetti container */}
        <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center">
          <div
            ref={pulseRingRef}
            className="absolute inset-0 rounded-full bg-[var(--accent-color)] opacity-30"
          />
          <div
            ref={particlesRef}
            className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible"
            aria-hidden="true"
          />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-color)] text-white shadow-lg">
            <svg
              ref={checkSvgRef}
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path
                ref={checkPathRef}
                d="M5 13l4 4L19 7"
                strokeDasharray="32"
                strokeDashoffset="0"
              />
            </svg>
          </div>
        </div>

        <h3
          id="success-modal-heading"
          className="font-heading text-xl font-bold text-[var(--text-main)] sm:text-2xl"
        >
          Message sent
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
          {ackSent ? (
            <>
              Thanks, {firstName}. A confirmation email is on its way to{" "}
              <span className="font-mono text-xs text-[var(--text-main)]">{email}</span>. I&apos;ll
              get back to you soon.
            </>
          ) : (
            <>Thanks, {firstName}. Your message was delivered. I&apos;ll get back to you soon.</>
          )}
        </p>

        <div className="mt-6">
          <button
            ref={doneBtnRef}
            type="button"
            onClick={handleClose}
            className="interactive-btn w-full rounded-xl bg-[var(--accent-color)] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-offset-2 focus:ring-offset-[var(--card-bg)]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  const { contact, profile } = portfolioData;
  const lenis = useLenis();

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const infoColRef = useRef<HTMLDivElement>(null);
  const formColRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const copyBtnRef = useRef<HTMLButtonElement>(null);
  const copyPhoneBtnRef = useRef<HTMLButtonElement>(null);
  const errorBannerRef = useRef<HTMLDivElement>(null);

  // Field refs for targeting focus on validation errors
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const [copied, setCopied] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const formattedPhone = formatPhoneDisplay(contact.phone);
  const telHref = phoneHref(contact.phone);

  const handleCopyPhone = async () => {
    if (!contact.phone) return;
    try {
      const plainNumber = contact.phone.replace(/[^\d+]/g, "").trim() || contact.phone.trim();
      await navigator.clipboard.writeText(plainNumber);
      setCopiedPhone(true);

      if (copyPhoneBtnRef.current) {
        gsap.fromTo(
          copyPhoneBtnRef.current,
          { scale: 0.88 },
          { scale: 1, duration: 0.4, ease: "back.out(2)" }
        );
      }

      setTimeout(() => setCopiedPhone(false), 1500);
    } catch {}
  };

  // Form input state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot

  // Validation & Submit status
  const [touched, setTouched] = useState<{ [K in "name" | "email" | "message"]?: boolean }>({});
  const [errors, setErrors] = useState<{ [K in "name" | "email" | "message"]?: string }>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
  const [is429, setIs429] = useState(false);

  // Success dialog state
  const [successData, setSuccessData] = useState<{
    firstName: string;
    email: string;
    ackSent: boolean;
  } | null>(null);

  const validateField = (field: "name" | "email" | "message", val: string): string => {
    const trimmed = val.trim();
    if (field === "name") {
      if (!trimmed) return "Name is required.";
      if (trimmed.length < 2 || trimmed.length > 80) return "Name must be between 2 and 80 characters.";
      if (/[\r\n]/.test(trimmed)) return "Name cannot contain line breaks.";
    }
    if (field === "email") {
      if (!trimmed) return "Email is required.";
      if (trimmed.length > 254 || !EMAIL_RE.test(trimmed)) return "Please enter a valid email address.";
      if (/[\r\n]/.test(trimmed)) return "Email cannot contain line breaks.";
    }
    if (field === "message") {
      if (!trimmed) return "Message is required.";
      if (trimmed.length < 10 || trimmed.length > 2000) return "Message must be between 10 and 2000 characters.";
    }
    return "";
  };

  const handleBlur = (field: "name" | "email" | "message") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const val = field === "name" ? name : field === "email" ? email : message;
    const err = validateField(field, val);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleCopyEmail = async () => {
    if (!contact.email) return;
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);

      if (copyBtnRef.current) {
        gsap.fromTo(
          copyBtnRef.current,
          { scale: 0.88 },
          { scale: 1, duration: 0.4, ease: "back.out(2)" }
        );
      }

      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const triggerFormShake = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (formRef.current && !prefersReducedMotion) {
      gsap.fromTo(
        formRef.current,
        { x: -8 },
        {
          x: 8,
          duration: 0.08,
          repeat: 4,
          yoyo: true,
          ease: "power1.inOut",
          onComplete: () => {
            if (formRef.current) gsap.set(formRef.current, { x: 0 });
          },
        }
      );
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    // Validate all fields
    const nameErr = validateField("name", name);
    const emailErr = validateField("email", email);
    const messageErr = validateField("message", message);

    setTouched({ name: true, email: true, message: true });
    setErrors({ name: nameErr, email: emailErr, message: messageErr });

    if (nameErr || emailErr || messageErr) {
      triggerFormShake();
      if (nameErr) nameInputRef.current?.focus();
      else if (emailErr) emailInputRef.current?.focus();
      else if (messageErr) messageInputRef.current?.focus();
      return;
    }

    setStatus("sending");
    setApiErrorMessage(null);
    setIs429(false);

    // 15s timeout with AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          website: website.trim(),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data: { ok?: boolean; error?: string; ackSent?: boolean } | null = null;
      try {
        data = await res.json();
      } catch {
        // non-JSON response
      }

      if (res.ok && data?.ok) {
        setStatus("success");
        setApiErrorMessage(null);

        // Lock scroll & show modal
        lenis?.stopScroll();
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";

        const firstName = name.trim().split(" ")[0] || "there";
        setSuccessData({
          firstName,
          email: email.trim(),
          ackSent: data.ackSent ?? true,
        });

        ScrollTrigger.refresh();
      } else {
        setStatus("error");
        triggerFormShake();

        if (res.status === 429) {
          setIs429(true);
          setApiErrorMessage("Too many messages. Please try again in a few minutes.");
        } else {
          setApiErrorMessage(
            data?.error ||
              "Something went wrong and your message was not sent. Please try again."
          );
        }
      }
    } catch {
      clearTimeout(timeoutId);
      setStatus("error");
      triggerFormShake();
      setApiErrorMessage(
        "Something went wrong and your message was not sent. Please try again."
      );
    }
  };

  const handleCloseModal = useCallback(() => {
    setSuccessData(null);
    setStatus("idle");

    // Reset inputs & errors
    setName("");
    setEmail("");
    setMessage("");
    setWebsite("");
    setTouched({});
    setErrors({});
    setApiErrorMessage(null);

    // Restore scroll
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    lenis?.startScroll();

    ScrollTrigger.refresh();

    // Return focus to first input
    nameInputRef.current?.focus();
  }, [lenis]);

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
          if (infoColRef.current) gsap.set(infoColRef.current, { opacity: 1, y: 0 });
          if (formColRef.current) gsap.set(formColRef.current, { opacity: 1, y: 0 });
          return;
        }

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

        const cols = [infoColRef.current, formColRef.current].filter(Boolean);
        gsap.fromTo(
          cols,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: infoColRef.current,
              start: "top 85%",
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="py-24 page-x w-full">
      <div className="mb-12 sm:mb-16">
        <p
          ref={eyebrowRef}
          className="font-mono text-xs sm:text-sm text-[var(--accent-color)] tracking-widest uppercase mb-2"
        >
          Connect
        </p>
        <div className="overflow-hidden">
          <h2
            ref={headingRef}
            className="font-heading font-extrabold text-fluid-h2 text-[var(--text-main)] will-change-transform"
          >
            Get In Touch.
          </h2>
        </div>
        <p
          ref={introRef}
          className="mt-3 text-sm sm:text-base text-[var(--text-muted)] max-w-[70ch]"
        >
          Interested in collaborating or discussing opportunities? Feel free to reach out.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full">
        {/* Contact Info Column */}
        <div ref={infoColRef} className="lg:col-span-5 space-y-6">
          <ISTClock />

          {/* Location & Phone Info Row (if available) */}
          {(Boolean(profile.location) || Boolean(formattedPhone && telHref)) && (
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              {Boolean(profile.location) && (
                <div className="flex-1 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 shadow-[var(--card-shadow)] flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent-color)] shrink-0">
                    <MapPin className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                      Location
                    </span>
                    <span className="block font-medium text-sm text-[var(--text-main)] break-words leading-snug">
                      {profile.location}
                    </span>
                  </div>
                </div>
              )}

              {Boolean(formattedPhone && telHref) && (
                <div className="flex-1 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 shadow-[var(--card-shadow)] flex items-center justify-between gap-2.5 min-w-0">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent-color)] shrink-0">
                      <Phone className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                        Phone
                      </span>
                      <a
                        href={telHref}
                        className="group relative inline-flex items-center text-sm font-mono font-medium text-[var(--text-main)] hover:text-[var(--accent-color)] active:opacity-80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card-bg)] rounded truncate max-w-full min-h-[44px]"
                      >
                        <span className="truncate">{formattedPhone}</span>
                        <span className="absolute left-0 bottom-1 w-0 h-0.5 bg-[var(--accent-color)] transition-all duration-300 group-hover:w-full" />
                      </a>
                    </div>
                  </div>

                  <Magnetic strength={0.4}>
                    <button
                      ref={copyPhoneBtnRef}
                      type="button"
                      onClick={handleCopyPhone}
                      aria-label="Copy phone number"
                      className="interactive-btn inline-flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-main)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] active:scale-95 transition-all relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] shrink-0"
                    >
                      {copiedPhone ? (
                        <Check className="w-4 h-4 text-emerald-500 animate-in zoom-in-50 duration-200" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </Magnetic>
                </div>
              )}
            </div>
          )}

          {/* Email Card (if available) */}
          {Boolean(contact.email) ? (
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 space-y-4 shadow-[var(--card-shadow)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent-color)]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-sm text-[var(--text-main)]">
                      Email Address
                    </div>
                    <a
                      href={`mailto:${contact.email}`}
                      className="group relative inline-block text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors truncate max-w-[200px] sm:max-w-none pb-0.5"
                    >
                      <span>{contact.email}</span>
                      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[var(--accent-color)] transition-all duration-300 group-hover:w-full" />
                    </a>
                  </div>
                </div>

                <Magnetic strength={0.4}>
                  <button
                    ref={copyBtnRef}
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label="Copy email address"
                    className="interactive-btn inline-flex items-center justify-center w-11 h-11 rounded-xl border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-main)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors relative cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-500 animate-in zoom-in-50 duration-200" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </Magnetic>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--card-bg)]/40 p-6 space-y-3 shadow-sm">
              <div className="flex items-center gap-2.5 text-[var(--accent-color)]">
                <Mail className="w-5 h-5" />
                <span className="font-heading font-bold text-sm">Direct Contact</span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                Email address is available upon request. Feel free to use the inquiry form below or connect via professional networks.
              </p>
            </div>
          )}

          {/* Social Links */}
          {(Boolean(contact.github) || Boolean(contact.linkedin)) && (
            <div className="flex flex-wrap gap-3">
              {Boolean(contact.github) && (
                <Magnetic strength={0.3}>
                  <a
                    href={contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactive-btn inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-main)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors text-sm font-medium shadow-[var(--card-shadow)] cursor-pointer"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                </Magnetic>
              )}
              {Boolean(contact.linkedin) && (
                <Magnetic strength={0.3}>
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactive-btn inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-main)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors text-sm font-medium shadow-[var(--card-shadow)] cursor-pointer"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                </Magnetic>
              )}
            </div>
          )}
        </div>

        {/* Contact Form Column */}
        <div
          ref={formColRef}
          className="lg:col-span-7 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 shadow-[var(--card-shadow)]"
        >
          {/* Error Banner */}
          {status === "error" && apiErrorMessage && (
            <div
              ref={errorBannerRef}
              role="alert"
              className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-[var(--text-main)] animate-in fade-in slide-in-from-top-2 duration-300"
              style={{ borderLeftColor: "#E5484D", borderLeftWidth: "4px" }}
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-[#E5484D]" />
                <div className="flex-1 space-y-2">
                  <p className="font-medium text-[var(--text-main)] leading-relaxed">
                    {apiErrorMessage}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleFormSubmit}
                      className="font-semibold text-[#E5484D] underline hover:opacity-80 transition-opacity cursor-pointer text-xs"
                    >
                      Try again
                    </button>
                    {!is429 && Boolean(contact.email) && (
                      <>
                        <span className="text-[var(--text-muted)] text-xs">·</span>
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-[var(--accent-color)] underline hover:opacity-80 transition-opacity text-xs"
                        >
                          Email me directly
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <form ref={formRef} onSubmit={handleFormSubmit} noValidate className="space-y-5">
            {/* Visually hidden honeypot field - off-screen, NOT display:none */}
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              aria-hidden="true"
              autoComplete="off"
              className="absolute -left-[9999px] top-0 opacity-0 pointer-events-none w-1 h-1"
            />

            {/* Name Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]"
                >
                  Name <span className="text-[#E5484D]">*</span>
                </label>
                {touched.name && errors.name && (
                  <span
                    id="name-error"
                    role="alert"
                    className="text-xs text-[#E5484D] font-mono animate-in fade-in"
                  >
                    {errors.name}
                  </span>
                )}
              </div>
              <input
                ref={nameInputRef}
                id="contact-name"
                name="name"
                type="text"
                required
                disabled={status === "sending"}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (touched.name) {
                    setErrors((prev) => ({ ...prev, name: validateField("name", e.target.value) }));
                  }
                }}
                onBlur={() => handleBlur("name")}
                aria-invalid={Boolean(touched.name && errors.name)}
                aria-describedby={touched.name && errors.name ? "name-error" : undefined}
                placeholder="Your name"
                className={`w-full min-h-[44px] px-4 py-3 text-base rounded-xl border bg-[var(--bg-color)] text-[var(--text-main)] placeholder:text-[var(--text-muted)]/60 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] ${
                  touched.name && errors.name
                    ? "border-[#E5484D] focus:border-[#E5484D]"
                    : "border-[var(--border-color)] focus:border-[var(--accent-color)]"
                } ${status === "sending" ? "opacity-60 cursor-not-allowed" : ""}`}
              />
            </div>

            {/* Email Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]"
                >
                  Email <span className="text-[#E5484D]">*</span>
                </label>
                {touched.email && errors.email && (
                  <span
                    id="email-error"
                    role="alert"
                    className="text-xs text-[#E5484D] font-mono animate-in fade-in"
                  >
                    {errors.email}
                  </span>
                )}
              </div>
              <input
                ref={emailInputRef}
                id="contact-email"
                name="email"
                type="email"
                required
                disabled={status === "sending"}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (touched.email) {
                    setErrors((prev) => ({ ...prev, email: validateField("email", e.target.value) }));
                  }
                }}
                onBlur={() => handleBlur("email")}
                aria-invalid={Boolean(touched.email && errors.email)}
                aria-describedby={touched.email && errors.email ? "email-error" : undefined}
                placeholder="your.email@example.com"
                className={`w-full min-h-[44px] px-4 py-3 text-base rounded-xl border bg-[var(--bg-color)] text-[var(--text-main)] placeholder:text-[var(--text-muted)]/60 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] ${
                  touched.email && errors.email
                    ? "border-[#E5484D] focus:border-[#E5484D]"
                    : "border-[var(--border-color)] focus:border-[var(--accent-color)]"
                } ${status === "sending" ? "opacity-60 cursor-not-allowed" : ""}`}
              />
            </div>

            {/* Message Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]"
                >
                  Message <span className="text-[#E5484D]">*</span>
                </label>
                <div className="flex items-center gap-3">
                  {touched.message && errors.message && (
                    <span
                      id="message-error"
                      role="alert"
                      className="text-xs text-[#E5484D] font-mono animate-in fade-in"
                    >
                      {errors.message}
                    </span>
                  )}
                  <span
                    className={`text-xs font-mono ${
                      message.length > 2000
                        ? "text-[#E5484D]"
                        : message.length >= 1900
                        ? "text-amber-500"
                        : "text-[var(--text-muted)]"
                    }`}
                  >
                    {message.length}/2000
                  </span>
                </div>
              </div>
              <textarea
                ref={messageInputRef}
                id="contact-message"
                name="message"
                required
                rows={5}
                disabled={status === "sending"}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (touched.message) {
                    setErrors((prev) => ({ ...prev, message: validateField("message", e.target.value) }));
                  }
                }}
                onBlur={() => handleBlur("message")}
                aria-invalid={Boolean(touched.message && errors.message)}
                aria-describedby={touched.message && errors.message ? "message-error" : undefined}
                placeholder="Share your message or project inquiry..."
                className={`w-full px-4 py-3 text-base rounded-xl border bg-[var(--bg-color)] text-[var(--text-main)] placeholder:text-[var(--text-muted)]/60 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] resize-none ${
                  touched.message && errors.message
                    ? "border-[#E5484D] focus:border-[#E5484D]"
                    : "border-[var(--border-color)] focus:border-[var(--accent-color)]"
                } ${status === "sending" ? "opacity-60 cursor-not-allowed" : ""}`}
              />
            </div>

            {/* Privacy note */}
            <p className="text-xs text-[var(--text-muted)]">
              Your email is only used to reply to you.
            </p>

            {/* Live region for accessibility */}
            <div aria-live="polite" className="sr-only">
              {status === "sending" && "Sending your message..."}
              {status === "error" && (apiErrorMessage || "Failed to send message.")}
              {status === "success" && "Message sent successfully."}
              {copiedPhone && "Phone number copied to clipboard."}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "sending"}
              className={`interactive-btn w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--accent-color)] text-white font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-offset-2 focus:ring-offset-[var(--card-bg)] ${
                status === "sending"
                  ? "opacity-75 cursor-not-allowed"
                  : "hover:opacity-90 cursor-pointer shadow-md"
              }`}
            >
              {status === "sending" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Message</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Success Popup Dialog */}
      {successData && (
        <SuccessModal
          firstName={successData.firstName}
          email={successData.email}
          ackSent={successData.ackSent}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}
