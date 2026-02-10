
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";
import { Sun, ArrowRight, ArrowUpRight } from "lucide-react";
import UntoldButterflyLogo from "./UntoldButterflyLogo";
import EditorialHeader from "./EditorialHeader";

const chapters = [
  {
    id: "chasing-sunsets",
    number: "01",
    title: "CHASING SUN(SETS)",
    tagline: "Golden hour. Good people. Great music.",
    description:
      "Rooftop and outdoor shows timed to sunset. Think golden hour on a Chicago rooftop with afro house, organic beats, and the kind of crowd that actually dances. Every set starts in daylight and ends under the stars.",
    sound: "Afro House · Organic House · Global Rhythms",
    moment: "Sunset to starlight",
    image: "/images/chasing-sunsets.jpg",
    icon: Sun,
    accent: "from-clay/20 to-clay/5",
    titleColor: "text-clay",
    taglineColor: "text-clay",
    borderColor: "group-hover:border-clay/40",
    glowColor: "group-hover:shadow-[0_0_30px_rgba(194,112,62,0.15)]",
  },
  {
    id: "untold-story",
    number: "02",
    title: "UNTOLD STORY",
    tagline: "The story is told through sound.",
    description:
      "Late-night, intimate, 360-degree sound. The DJ is the narrator, the crowd is the story. No phones in your face, no VIP rope — just a room full of people who came for the music and each other.",
    sound: "Deep · Immersive · Intimate",
    moment: "Late night, 360 sound",
    image: "/images/untold-story.jpg",
    icon: null,
    accent: "from-primary/20 to-primary/5",
    titleColor: "accent-story",
    taglineColor: "accent-story",
    borderColor: "group-hover:border-primary/40",
    glowColor: "group-hover:shadow-[0_0_30px_rgba(224,90,58,0.12)]",
  },
];

export default function ChaptersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="chapters"
      ref={ref}
      className="relative section-padding bg-card overflow-hidden"
    >
      <div className="absolute inset-0 atmo-surface opacity-70 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(34,211,238,0.1),transparent_34%),radial-gradient(circle_at_84%_76%,rgba(224,90,58,0.1),transparent_36%)] pointer-events-none" />
      <div className="container max-w-6xl mx-auto mb-14">
        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.35 }}>
          <EditorialHeader
            kicker="Program"
            title="The Events"
            description="Two series, one collective. Distinct formats, shared standards."
          />
        </motion.div>
      </div>

      {/* Editorial program cards */}
      <div className="container max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-6">
          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.65, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative ${index === 0 ? "md:col-span-7" : "md:col-span-5"}`}
            >
              <Link href={chapter.id === "chasing-sunsets" ? "/chasing-sunsets" : "/story"}>
                <a className={`ui-card relative block h-[520px] md:h-[620px] cursor-pointer overflow-hidden border border-white/20 ${chapter.borderColor} ${chapter.glowColor} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70`}>
                  {/* Cinematic Hover Shine */}
                  <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 w-[200%] -translate-x-[50%] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg]" />

                  {/* Full background image */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={chapter.image}
                      alt={chapter.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 will-change-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${chapter.accent} to-transparent opacity-45 transition-opacity duration-500 group-hover:opacity-65`} />
                    <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_42%)] pointer-events-none" />

                    {/* Film grain overlay specific to card */}
                    <div className="absolute inset-0 opacity-[0.07] bg-noise mix-blend-overlay" />
                  </div>

                  {/* Icon — top right */}
                  <div className="absolute top-8 right-8 z-30 transform group-hover:-rotate-12 transition-transform duration-500">
                    {chapter.icon ? (
                      <chapter.icon className={`w-8 h-8 ${chapter.titleColor} opacity-80`} />
                    ) : (
                      <UntoldButterflyLogo className={`w-10 h-10 ${chapter.titleColor} opacity-80`} />
                    )}
                    {/* Glow behind icon */}
                    <div className={`absolute inset-0 blur-xl ${chapter.taglineColor} opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
                  </div>

                  {/* Number Watermark */}
                  <div className="absolute top-8 left-8 z-30 overflow-hidden">
                    <span className="font-display text-7xl text-white/10 group-hover:text-white/20 transition-colors duration-500 block">
                      {chapter.number}
                    </span>
                  </div>

                  {/* Content — bottom aligned */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-30">
                    <p className={`${chapter.taglineColor} text-[11px] font-mono tracking-[0.26em] uppercase mb-4`}>
                      {chapter.moment}
                    </p>

                    <h3 className="ui-heading font-display text-4xl md:text-6xl tracking-[0.01em] text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/80 transition-all duration-300">
                      {chapter.title}
                    </h3>

                    <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-40">
                      <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-lg">
                        {chapter.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-white group-hover:text-primary transition-colors">
                      <div className="w-10 h-[1px] bg-white/40 group-hover:w-16 group-hover:bg-primary transition-all duration-300" />
                      <span className="tracking-widest uppercase font-bold text-xs">
                        {chapter.id === "chasing-sunsets" ? "Explore Sun(Sets)" : "Enter Untold Story"}
                      </span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-100" />
                    </div>
                  </div>
                </a>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
