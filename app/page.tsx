"use client";

import LenisProvider from "@/components/LenisProvider";
import NavCurtainProvider from "@/components/NavCurtain";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Work from "@/components/Work";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Journey from "@/components/Journey";
import Certificates from "@/components/Certificates";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <LenisProvider>
      <NavCurtainProvider>
        <CustomCursor />
        <ScrollProgressBar />
        <Navbar />
        <main>
          <Hero />
          <Marquee />
          <Work />
          <About />
          <Skills />
          <Journey />
          <Certificates />
          <Contact />
        </main>
        <Footer />
      </NavCurtainProvider>
    </LenisProvider>
  );
}
