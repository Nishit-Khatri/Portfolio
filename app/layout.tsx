import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Preloader from "@/components/Preloader";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF8" },
    { media: "(prefers-color-scheme: dark)", color: "#0C0C0E" },
  ],
};

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim();

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: "Nishit Khatri | Full Stack Web Developer",
  description:
    "I'm Nishit Khatri, a Full Stack Web Developer and B.Tech graduate in Electronics and Computer Science from Shah & Anchor Kutchhi Engineering College. I enjoy building modern, responsive web applications that combine intuitive user interfaces with reliable backend functionality.",
  openGraph: {
    title: "Nishit Khatri | Full Stack Web Developer",
    description:
      "I'm Nishit Khatri, a Full Stack Web Developer and B.Tech graduate in Electronics and Computer Science from Shah & Anchor Kutchhi Engineering College. I enjoy building modern, responsive web applications that combine intuitive user interfaces with reliable backend functionality.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Flash-prevention inline theme script & low-power detection */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = stored || (prefersDark ? 'dark' : 'light');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                  }

                  // Hardware concurrency & reduced data detection for blur/grain reduction
                  var isLowPower = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
                    window.matchMedia('(prefers-reduced-data: reduce)').matches;
                  if (isLowPower) {
                    document.documentElement.classList.add('low-power');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />

        {/* noscript fallback styling so hidden content is immediately visible without JS */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: `
                [data-preloader] {
                  display: none !important;
                }
                [style*="opacity: 0"],
                [style*="opacity:0"],
                .opacity-0,
                .mobile-work-card,
                .about-word,
                .journey-card,
                .journey-card-desktop,
                .journey-card-mobile,
                .skill-card,
                .cert-card,
                .hero-headline-line,
                [data-card-index] {
                  opacity: 1 !important;
                  transform: none !important;
                  clip-path: none !important;
                }
                #work > div {
                  display: flex !important;
                }
              `,
            }}
          />
        </noscript>
      </head>
      <body
        className={`${plusJakartaSans.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Preloader />
        <div className="overflow-x-clip-wrapper">{children}</div>
      </body>
    </html>
  );
}
