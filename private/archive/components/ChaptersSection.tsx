import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";
import { AudioLines, ArrowRight, Sun, ArrowUpRight, Camera, Radio } from "lucide-react";
import UntoldButterflyLogo from "./UntoldButterflyLogo";
import EditorialHeader from "./EditorialHeader";
import { signalChirp } from "@/lib/SignalChirpEngine";

const chapters = [
  {
    id: "chasing-sunsets",
    title: "CHASING SUN(SETS)",
    tagline: "The Open-Air Series.",
    description: "Golden hour sets, panoramic views, and the energy of the city at dusk.",
    moment: "Open-Air Day",
    image: "/images/chasing-sunsets-premium.webp",
    icon: Sun,
    href: "/chasing-sunsets",
    color: "#E8B86D",
  },
  {
    id: "untold-story",
    title: "UNTOLD STORY",
    tagline: "The After-Dark Series.",
    description: "Raw spaces, heavy sound systems, and the tension of the late night.",
    moment: "Industrial Night",
    image: "/images/untold-story-moody.webp",
    icon: null,
    href: "/story",
    color: "#22D3EE",
  },
  {
    id: "radio-show",
    title: "RADIO SHOW",
    tagline: "The Sonic Archive.",
    description: "Curated mixes, live recordings, and exclusive guest sets.",
    moment: "Global Broadcast",
    image: "/images/radio-promo-minimal.png", 
    icon: Radio,
    href: "/radio",
    color: "#F43F5E",
  },
  {
    id: "event-archive",
    title: "EVENT ARCHIVE",
    tagline: "The Visual Record.",
    description: "High-resolution galleries from past rooms. Find your memory.",
    moment: "Visual Record",
    image: "/images/autograf-recap.jpg",
    icon: Camera,
    href: "/archive",
    color: "#FFFFFF",
  }
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
      <div className="container layout-default px-6 mb-16 md:mb-20 text-center relative z-10">
        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.35 }}>
          <EditorialHeader
            kicker="The Branches"
            title="Curated Worlds"
            description="Four distinct pillars built on uncompromised sound, architectural curation, and the energy of the room."
          />
        </motion.div>
      </div>

      <div className="container layout-wide px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group relative h-[480px] md:h-[560px] lg:h-[640px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/20"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={chapter.image}
                  className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                  alt={chapter.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>

              {/* Interaction Overlay */}
              <Link href={chapter.href} asChild>
                <a className="absolute inset-0 z-20" onClick={() => signalChirp.click()}>
                  <span className="sr-only">Explore {chapter.title}</span>
                </a>
              </Link>

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                <div className="mb-6 transform transition-transform duration-500 group-hover:-translate-y-2">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md mb-8 group-hover:border-white/30 transition-colors">
                    {chapter.icon ? (
                      <chapter.icon className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                    ) : (
                      <UntoldButterflyLogo className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                    )}
                  </div>

                  <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40 mb-3 block">
                    {chapter.tagline}
                  </p>
                  <h3 className="font-heavy text-3xl uppercase tracking-tighter text-white mb-4">
                    {chapter.title}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed max-w-[240px] group-hover:text-white/90 transition-colors">
                    {chapter.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 border-t border-white/10 pt-6">
                  <div className="h-px w-6 bg-white/20" />
                  {chapter.moment}
                </div>
              </div>

              {/* Bottom Reveal Border */}
              <div 
                className="absolute inset-x-0 bottom-0 h-1 transition-transform duration-700 translate-y-full group-hover:translate-y-0"
                style={{ backgroundColor: chapter.color || 'var(--primary)' }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
