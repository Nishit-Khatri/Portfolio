"use client";

import { useState } from "react";
import Image from "next/image";
import { portfolioData } from "@/data/portfolioData";

interface ProfilePhotoProps {
  priority?: boolean;
  className?: string;
  sizes?: string;
  alt?: string;
  src?: string;
}

export default function ProfilePhoto({
  priority = false,
  className = "",
  sizes = "(max-width: 768px) 320px, (max-width: 1024px) 380px, 420px",
  alt = portfolioData.profile.photoAlt || "Portrait of Nishit Khatri",
  src = portfolioData.profile.photo || "/images/profile.jpg",
}: ProfilePhotoProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`group relative aspect-[4/5] w-full overflow-hidden rounded-[24px] border border-[var(--border-color)] bg-[var(--card-bg)] shadow-[var(--card-shadow)] ${className}`}
    >
      {/* Subtle corner accent */}
      <div
        aria-hidden="true"
        className="absolute top-3.5 right-3.5 z-20 flex items-center justify-center w-6 h-6 rounded-full bg-[var(--bg-color)]/85 backdrop-blur-sm border border-[var(--border-color)] pointer-events-none shadow-sm"
      >
        <span className="w-2 h-2 rounded-full bg-[var(--accent-color)]" />
      </div>

      {!hasError && src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={() => setHasError(true)}
        />
      ) : (
        /* Graceful fallback: clean "NK" monogram placeholder */
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[var(--card-bg)] via-[var(--card-bg)] to-[var(--accent-soft)] select-none">
          <div className="w-20 h-20 rounded-2xl bg-[var(--bg-color)] border border-[var(--border-color)] flex items-center justify-center text-[var(--accent-color)] font-heading font-extrabold text-2xl tracking-wider shadow-inner group-hover:scale-105 transition-transform duration-300">
            NK
          </div>
        </div>
      )}
    </div>
  );
}

