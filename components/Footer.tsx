import { portfolioData } from "@/data/portfolioData";
import { MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { profile } = portfolioData;

  return (
    <footer
      className="border-t border-[var(--border-color)] bg-[var(--bg-color)] py-8 page-x w-full"
      style={{
        paddingBottom: "max(2rem, env(safe-area-inset-bottom, 2rem))",
      }}
    >
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-muted)]">
        <div>
          © {currentYear} {profile.name}. All rights reserved.
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {Boolean(profile.location) && (
            <span className="inline-flex items-center gap-1.5 text-[var(--text-muted)]">
              <MapPin className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" aria-hidden="true" />
              <span>{profile.location}</span>
            </span>
          )}
          {Boolean(profile.location) && <span>·</span>}
          <span>{profile.title}</span>
        </div>
      </div>
    </footer>
  );
}
