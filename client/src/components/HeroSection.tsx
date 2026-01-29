/*
  DESIGN: S-Tier Premium - Cinematic Intro & Human Connection
  - Staggered text reveal for "THE MONOLITH PROJECT"
  - Glitch effect on hover
  - Magnetic interactions
  - Focused on "Togetherness" and human connection
*/

import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import VideoHeroSlider from "./VideoHeroSlider";
import MagneticButton from "./MagneticButton";
import { MonolithSlabWaves } from "./MonolithSlabWaves";
import { useState } from "react";
import Ticker from "./Ticker";

const StaggeredText = ({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) => {
  // Split text into words and then characters to preserve spacing
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i: number = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      style={{ overflow: "hidden", display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      variants={container as any}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {words.map((word: string, index: number) => (
        <span key={index} style={{ display: "inline-block", marginRight: "0.25em", whiteSpace: "nowrap" }}>
          {Array.from(word).map((character: string, charIndex: number) => (
            <motion.span variants={child as any} key={charIndex} style={{ display: "inline-block" }}>
              {character}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  );
};

export default function HeroSection() {
  const [isHovered, setIsHovered] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      <div className="hidden" />

      {/* Video/Image Slider Background - Now with Human Focus */}
      <VideoHeroSlider />

      {/* Hero Background Gradient Contast - Top & Bottom */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-background via-black/60 to-transparent z-10 pointer-events-none" />


      {/* Main Content */}
      <div className="relative z-20 flex-1 flex items-center justify-center pt-32 md:pt-40 pb-24">
        <div className="text-center px-6 max-w-5xl mx-auto">

          {/* Animated Brand Mark - Monolith Slab Waves */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="mb-8 flex flex-col items-center gap-2"
          >
            <MonolithSlabWaves
              slabWidthPx={90}
              slabHeightPx={280}
              borderRadiusPx={10}
              xGap={5}
              yGap={6}
              amplitude={6}
              flowSpeed={0.005}
              pointerRadius={300}
              strokeColor="#D4A574" // Gold
              interactive={true}
              showPointerDot={false}
            />
          </motion.div>

          {/* Main Title - Interactive & Staggered - Tighter Layout */}
          <motion.div
            style={{ y: useTransform(useScroll().scrollY, [0, 500], [0, 150]) }}
            className="relative font-display tracking-tighter text-foreground mb-8 cursor-default"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex flex-col items-center gap-4 md:gap-6">
              <div className="text-6xl md:text-8xl lg:text-9xl leading-[0.85] drop-shadow-2xl">
                <StaggeredText
                  text="THE MONOLITH"
                  className="justify-center"
                  delay={0.2}
                />
              </div>

              {/* Added clearer separation */}

              <motion.div
                className="text-4xl md:text-6xl lg:text-7xl text-primary tracking-[0.2em] font-light text-silver-red-gradient drop-shadow-lg"
                animate={isHovered ? { x: [0, -2, 2, -1, 0], filter: ["blur(0px)", "blur(2px)", "blur(0px)"] } : {}}
                transition={{ duration: 0.2 }}
              >
                <StaggeredText
                  text="PROJECT"
                  className="justify-center"
                  delay={0.6}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Tagline - Human Centric - Defined Platform */}
          <motion.div
            style={{ y: useTransform(useScroll().scrollY, [0, 500], [0, 100]) }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
            className="flex flex-col gap-6 items-center"
          >
            <h2 className="text-xl md:text-3xl text-foreground font-light tracking-wide max-w-3xl bg-gradient-to-r from-transparent via-background/40 to-transparent py-2 px-8 rounded-full border-y border-white/5 backdrop-blur-sm">
              A global ritual of light, sound, and togetherness.
            </h2>

            <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent my-2" />

            <p className="text-xs md:text-sm text-muted-foreground tracking-mega uppercase font-medium opacity-80">
              EST. 2026 • CHICAGO
            </p>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Clean Line */}
      <motion.div
        style={{ opacity: useTransform(useScroll().scrollY, [0, 200], [1, 0]) }}
        className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4"
      >
        <MagneticButton strength={0.3} onClick={() => scrollToSection("movement")}>
          <div className="flex flex-col items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-500 cursor-pointer group">
            <span className="text-[10px] tracking-[0.3em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">Explore the Ritual</span>
            <div className="h-12 w-[1px] bg-gradient-to-b from-primary/20 to-primary/80 group-hover:h-16 transition-all duration-500" />
          </div>
        </MagneticButton>
      </motion.div>

      {/* Ticker at Bottom of Hero */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <Ticker />
      </div>

    </section>
  );
}
