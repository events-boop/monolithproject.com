import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";
import { AudioLines, ArrowRight, Sun, ArrowUpRight } from "lucide-react";
import UntoldButterflyLogo from "./UntoldButterflyLogo";
import EditorialHeader from "./EditorialHeader";

const chapters = [
  {
    id: "chasing-sunsets",
    number: "01",
    title: "CHASING SUN(SETS)",
    tagline: "Golden hour. Open air. A room that breathes.",
    description:
      "A warmer Monolith expression built for rooftops, open-air settings, and the slow shift from daylight into dusk. The music stays rhythmic, the room stays social, and the atmosphere opens up before the night fully lands.",
    moment: "Afro House · Organic House · Global Rhythm",
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
    tagline: "When the light drops, the room changes shape.",
    description:
      "The more intimate Monolith expression. A closer room, deeper pacing, and a tighter connection between artist and crowd. Less spectacle, more tension, more focus, and a stronger sense of where the night is going.",
    moment: "Deeper House · Tension · Late-Night Energy",
    image: "/images/untold-story.jpg",
    icon: null,
    accent: "from-primary/20 to-primary/5",
    titleColor: "accent-story",
    taglineColor: "accent-story",
    borderColor: "group-hover:border-primary/40",
    glowColor: "group-hover:shadow-[0_0_30px_rgba(224,90,58,0.12)]",
  },
];

const radioSignal = {
  description: "The radio show extends Chasing Sun(Sets) between events with mixes, guest sessions, and replayable episodes.",
  href: "/radio",
  label: "03",
  title: "CHASING SUN(SETS) RADIO SHOW",
};

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
      <div className="container layout-default px-6 mb-12 md:mb-14">
        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.35 }}>
          <EditorialHeader
            kicker="Program"
            title="The Series"
            description="Two live series, one shared standard. Distinct emotional temperatures, the same commitment to curation, atmosphere, and a room worth returning to."
          />
        </motion.div>
      </div>

      <div className="container layout-wide px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.65, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="group relative"
            >
              <Link
                href={chapter.id === "chasing-sunsets" ? "/chasing-sunsets" : "/story"}
                className={`relative block min-h-[420px] overflow-hidden rounded-[2.15rem] border border-white/15 bg-black/18 shadow-[0_24px_56px_rgba(0,0,0,0.28)] transition-all duration-500 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 md:min-h-[480px] ${chapter.borderColor} ${chapter.glowColor}`}
                data-cursor-text="EXPLORE"
              >
                <div className="absolute inset-0 z-0">
                  <img
                    src={chapter.image}
                    alt={chapter.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[1400ms] will-change-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${chapter.accent} to-transparent opacity-45 transition-opacity duration-500 group-hover:opacity-65`} />
                  <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_42%)] pointer-events-none" />
                  <div className="absolute inset-0 opacity-[0.06] bg-noise mix-blend-overlay" />
                </div>

                <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-8">
                  <div className="flex items-start justify-between gap-5">
                    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/20 px-4 py-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/38">
                        Series
                      </span>
                      <span className="font-serif text-2xl italic text-white/72">
                        {chapter.number}
                      </span>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/20 backdrop-blur-sm">
                      {chapter.icon ? (
                        <chapter.icon className={`h-6 w-6 ${chapter.titleColor} opacity-90`} />
                      ) : (
                        <UntoldButterflyLogo className={`h-8 w-8 ${chapter.titleColor} opacity-90`} />
                      )}
                    </div>
                  </div>

                  <div className="max-w-xl">
                    <p className={`mb-3 text-[10px] font-mono uppercase tracking-[0.24em] ${chapter.id === "untold-story" ? "text-story" : "text-clay"}`}>
                      {chapter.moment}
                    </p>
                    <h3
                      className={`text-balance break-words text-white ${
                        chapter.id === "untold-story"
                          ? "font-untold text-[clamp(2.2rem,4.6vw,4.4rem)] italic tracking-tight"
                          : "font-sunsets text-[clamp(2rem,4vw,4rem)] tracking-[0.08em]"
                      }`}
                    >
                      {chapter.title}
                    </h3>
                    <p className={`mt-4 font-serif font-light italic text-xl md:text-2xl leading-relaxed ${chapter.taglineColor}`}>
                      {chapter.tagline}
                    </p>
                    <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/72 md:text-base">
                      {chapter.description}
                    </p>

                    <div className={`mt-8 inline-flex items-center gap-3 text-sm transition-colors duration-300 ${chapter.id === "untold-story" ? "group-hover:text-story" : "group-hover:text-clay"}`}>
                      <div className={`h-px bg-white/40 transition-all duration-500 ${chapter.id === "untold-story" ? "w-10 group-hover:w-16 group-hover:bg-story" : "w-10 group-hover:w-20 group-hover:bg-clay"}`} />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                        {chapter.id === "chasing-sunsets" ? "Explore Chasing Sun(Sets)" : "Explore Untold Story"}
                      </span>
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6"
        >
          <Link
            href={radioSignal.href}
            className="group shell-frame block overflow-hidden rounded-[2rem] px-5 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45 md:px-6"
          >
            <div className="grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-white/80">
                  <AudioLines className="h-5 w-5" />
                </div>
                <div>
                  <p className="ui-chip text-white/38">Radio</p>
                  <span className="mt-1 block text-sm font-bold uppercase tracking-[0.18em] text-white/58">
                    {radioSignal.label}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-radio text-[clamp(1.2rem,1.8vw,1.6rem)] uppercase leading-[1.1] text-white">
                  {radioSignal.title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
                  {radioSignal.description}
                </p>
              </div>

              <div className="inline-flex items-center gap-3 text-white/74 transition-colors group-hover:text-white">
                <div className="h-px w-12 bg-gradient-to-r from-white/55 to-transparent" />
                <span className="ui-chip">Open Radio Show</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
