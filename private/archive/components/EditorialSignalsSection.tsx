import { motion } from "framer-motion";
import { ArrowUpRight, AudioLines, FileText, LibraryBig, Radar } from "lucide-react";
import { Link } from "wouter";
import { CTA_LABELS } from "@/lib/cta";

const editorialModules = [
  {
    title: "Articles",
    eyebrow: "News & Context",
    description:
      "Short articles, event notes, and project context that explain the taste behind the nights without forcing people to decode the brand.",
    href: "/insights",
    cta: CTA_LABELS.journal,
    icon: FileText,
    featured: true,
  },
  {
    title: "Radio Show",
    eyebrow: "Listen",
    description:
      "The Chasing Sun(Sets) Radio Show extends the series through mixes, guest sessions, and full episode replays.",
    href: "/radio",
    cta: CTA_LABELS.listenNow,
    icon: AudioLines,
  },
  {
    title: "Event Archive",
    eyebrow: "Gallery & Recaps",
    description:
      "Photos, recap assets, and past-night records that show what happened in the room instead of making the brand start over every time.",
    href: "/archive",
    cta: CTA_LABELS.archive,
    icon: LibraryBig,
  },
  {
    title: "Press & Media",
    eyebrow: "Fast Facts",
    description:
      "Quick facts, context, and assets for media, collaborators, and partners who need the clearest version of the project.",
    href: "/press",
    cta: CTA_LABELS.press,
    icon: Radar,
  },
];

export default function EditorialSignalsSection() {
  const [featured, ...modules] = editorialModules;
  const FeaturedIcon = featured.icon;

  return (
    <section className="relative z-10 py-24 md:py-32 bg-[#050505] overflow-hidden">
      {/* Background Archival Texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
         <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
           <path d="M0 20H100M0 40H100M0 60H100M0 80H100M20 0V100M40 0V100M60 0V100M80 0V100" stroke="white" strokeWidth="0.05" fill="none" />
         </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-[10px] md:text-sm tracking-[0.3em] text-white/40 uppercase">
                Systems // 07-09
              </span>
              <div className="h-[1px] w-24 bg-white/10" />
            </div>
            <h2 className="font-heavy text-[clamp(2.5rem,7vw,8rem)] leading-[0.85] tracking-tighter uppercase text-white mb-6">
              <span className="text-white/30 block shrink-0">A project should</span>
              <span className="block shrink-0">be easy to</span>
              <span className="block shrink-0">follow.</span>
            </h2>
            <p className="mt-4 max-w-xl text-lg font-light leading-relaxed text-white/50">
              Articles, radio, and the event archive make it easier to understand who Monolith
              books, what each series sounds like, and what happened after the night ends.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {["TELEMETRY", "ARCHIVE", "SIGNALS", "MEDIA"].map((signal, i, arr) => (
              <span
                key={signal}
                className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/20 text-right flex items-center justify-end gap-3"
              >
                {signal} <span className={`h-1 w-1 rounded-full ${i === 0 ? "bg-primary animate-pulse" : "bg-white/10"}`} />
              </span>
            ))}
          </div>
        </div>

        {/* Brutalist Grid System */}
        <div className="grid lg:grid-cols-[1.3fr_1fr] border border-white/10 bg-[#050505] relative">
          {/* Intersection Points */}
          <div className="absolute top-0 left-[1.3fr] bottom-0 w-[1px] bg-white/5 hidden lg:block" />
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={featured.href}
              className="group relative flex flex-col justify-between h-full border-b lg:border-b-0 lg:border-r border-white/10 bg-[#050505] p-8 md:p-14 lg:p-20 transition-all duration-700 hover:bg-white hover:text-black cursor-pointer overflow-hidden"
            >
              {/* Scanline Effect on Hover */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%]" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4 mb-16">
                  <div className="flex h-16 w-16 items-center justify-center border border-white/10 bg-[#050505] transition-colors group-hover:border-black group-hover:bg-black/5">
                    <FeaturedIcon className="h-6 w-6 text-white/60 group-hover:text-black" />
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-primary transition-colors group-hover:text-black mb-1">
                      Signal // 01
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 transition-colors group-hover:text-black/60">
                      {featured.eyebrow}
                    </p>
                  </div>
                </div>

                <h3 className="max-w-xl font-heavy text-[clamp(3.5rem,5vw,5rem)] uppercase leading-none text-white tracking-tighter mb-8 transition-colors group-hover:text-black">
                  {featured.title}
                </h3>
              </div>

              <div className="relative z-10">
                <p className="max-w-md text-lg font-light leading-relaxed text-white/50 transition-colors group-hover:text-black/70 mb-12">
                  {featured.description}
                </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 pt-8 border-t border-white/10 group-hover:border-black/10 transition-colors">
                  <div className="max-w-xs">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 group-hover:text-black/40 mb-2">Technical Context</p>
                    <p className="text-sm font-light leading-relaxed text-white/60 group-hover:text-black/70">
                      Clear articles, radio episodes, and recap surfaces make the next event feel connected to the last one.
                    </p>
                  </div>
                  <div className="inline-flex items-center justify-center h-14 w-14 border border-white/10 group-hover:border-black group-hover:bg-black transition-colors rounded-none shrink-0">
                    <ArrowUpRight className="h-5 w-5 text-white/50 group-hover:text-white transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          <div className="flex flex-col">
            {modules.map((module, index) => {
              const Icon = module.icon;

              return (
                <motion.div
                  key={module.title}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="h-full"
                >
                  <Link
                    href={module.href}
                    className="group relative flex flex-col justify-between h-full border-b border-white/10 last:border-b-0 bg-[#050505] hover:bg-white/[0.04] transition-all p-8 md:p-12 cursor-pointer overflow-hidden"
                  >
                    {/* Scanline Effect on Hover */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%]" />
                    
                    <div className="relative z-10 flex items-start justify-between gap-4 mb-10">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                           <span className="font-mono text-[9px] text-primary/60 tracking-[0.4em]">SIGNAL // 0{index + 2}</span>
                           <div className="h-[1px] w-8 bg-white/5 group-hover:bg-primary/20 transition-colors" />
                        </div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 group-hover:text-white/60 transition-colors">
                          {module.eyebrow}
                        </p>
                        <h3 className="mt-4 font-heavy text-4xl uppercase text-white tracking-tighter group-hover:text-primary transition-colors">
                          {module.title}
                        </h3>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center border border-white/10 bg-[#050505] transition-colors group-hover:border-white/40 group-hover:bg-white/5">
                        <Icon className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
                      </div>
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                      <p className="text-base font-light leading-relaxed text-white/40 group-hover:text-white/60 transition-colors max-w-sm">
                        {module.description}
                      </p>

                      <div className="inline-flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 transition-all group-hover:text-white whitespace-nowrap">
                        {module.cta}
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
