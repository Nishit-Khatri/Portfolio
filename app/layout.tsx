import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nishit Khatri - Full Stack Developer",
  description:
    "Portfolio of Nishit Khatri, a passionate Full Stack Developer specializing in modern web technologies and creating exceptional digital experiences.",
  keywords: "Full Stack Developer, React, Next.js, Node.js, TypeScript, Web Development, Portfolio",
  authors: [{ name: "Nishit Khatri" }],
  creator: "Nishit Khatri",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nishitkhatri.dev",
    title: "Nishit Khatri - Full Stack Developer",
    description:
      "Portfolio of Nishit Khatri, a passionate Full Stack Developer specializing in modern web technologies.",
    siteName: "Nishit Khatri Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nishit Khatri - Full Stack Developer",
    description:
      "Portfolio of Nishit Khatri, a passionate Full Stack Developer specializing in modern web technologies.",
    creator: "@nishitkhatri",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
