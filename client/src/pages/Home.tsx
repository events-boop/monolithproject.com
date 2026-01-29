/*
  DESIGN: Cosmic Mysticism - Neo-Mystical Minimalism meets Cosmic Futurism
  - Dark obsidian backgrounds with golden amber accents
  - Sacred geometry and animated elements
  - Keynote-inspired navigation with fixed CTA
  - Bebas Neue headlines, Inter body text
  - Persistent audio player
  - Sticky CTA button
  - Textured noise background (AD Night inspired)
  - SoundCloud grid for mixes
  - Past Events gallery section
  - Season 2026 schedule
  - Social media section
*/

import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import RitualDashboard from "@/components/RitualDashboard"; // New S-Tier Component
import DefinitionSection from "@/components/DefinitionSection";
import MovementSection from "@/components/MovementSection";
import RitualGrid from "@/components/RitualGrid";
import ChaptersSection from "@/components/ChaptersSection";
import RadioSection from "@/components/RadioSection";
import ArtistsSection from "@/components/ArtistsSection";
import PartnershipsSection from "@/components/PartnershipsSection";
import ConnectSection from "@/components/ConnectSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import ParticleField from "@/components/ParticleField";

import StickyCTA from "@/components/StickyCTA";
import SoundCloudSection from "@/components/SoundCloudSection";
import PastEventsSection from "@/components/PastEventsSection";
import ScheduleSection from "@/components/ScheduleSection"; // Keeping as full list for later
import SocialSection from "@/components/SocialSection";

import CustomCursor from "@/components/CustomCursor";

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const { scrollYProgress } = useScroll();

  // Track active section based on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Added 'dashboard' to tracked sections
      const sections = ["hero", "dashboard", "movement", "chapters", "schedule", "recaps", "listen", "radio", "artists", "partnerships", "connect"];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden bg-noise selection:bg-primary/30">
      <CustomCursor />
      {/* Particle background */}
      <ParticleField />

      {/* Navigation */}
      <Navigation activeSection={activeSection} />

      {/* Progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Main content */}
      <main className="pb-20">
        <HeroSection />

        {/* S-TIER FIRST SCROLL EXPERIENCE */}
        <RitualDashboard />

        {/* THE MISSION */}
        <DefinitionSection />

        {/* THE MOVEMENT */}
        <MovementSection />

        {/* THE ROSTER */}
        <ArtistsSection />

        {/* UPCOMING RITUALS */}
        <ScheduleSection />

        {/* ARCHIVES & RADIO */}
        <RadioSection />
        <SoundCloudSection />
        <PastEventsSection />

        {/* COMMUNITY & PARTNERS */}
        <PartnershipsSection />
        <SocialSection />
        <ConnectSection />
        <NewsletterSection />
      </main>

      <Footer />

      {/* Sticky CTA Button */}
      <StickyCTA />

      {/* Persistent Audio Player */}

    </div >
  );
}
