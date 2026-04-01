import { motion } from "framer-motion";
import { ArrowUpRight, AudioLines, FileText, LibraryBig, Radar } from "lucide-react";
import { Link } from "wouter";
import { CTA_LABELS } from "@/lib/cta";

const editorialModules = [
  {
    title: "Inside Monolith",
    eyebrow: "Notes",
    description:
      "Short notes, references, and project context that explain the taste behind the nights and the world that holds them together.",
    href: "/insights",
    cta: CTA_LABELS.journal,
    icon: FileText,
    featured: true,
  },
  {
    title: "Radio Show",
    eyebrow: "Listen Back",
    description:
      "The Chasing Sun(Sets) Radio Show extends the series through mixes, artist sessions, and a clearer sense of the project’s pace.",
    href: "/radio",
    cta: CTA_LABELS.listenNow,
    icon: AudioLines,
  },
  {
    title: "Archive",
    eyebrow: "Past Nights",
    description:
      "Season-by-season photos and recaps that make the record visible instead of forcing the brand to start over every time.",
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
    <section className="relative z-10 py-24 md:py-32 bg-[#050505]">
      {/* Background Archival Texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
          <div className="max-w-4xl">
            <span className="font-mono text-[10px] md:text-sm tracking-[0.3em] text-white/40 mb-6 block uppercase border-b border-white/10 pb-4 inline-block">
              Beyond The Night
            </span>
            <h2 className="font-heavy text-[clamp(4rem,7vw,8rem)] leading-[0.85] tracking-tighter uppercase text-white mb-6">
              <span className="text-white/30 block">THE LONGEST</span>
              <span className="block">RECORD.</span>
            </h2>
            <p className="mt-4 max-w-xl text-lg font-light leading-relaxed text-white/50">
              Radio, archive, and journal surfaces make it easier to understand who we book, what
              kind of room we build, and why people return. The night matters more when the signal
              around it stays coherent.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {["Identity", "Radio", "Archive", "Press"].map((signal, i, arr) => (
              <span
                key={signal}
                className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 text-right"
              >
                // {signal}{i === arr.length - 1 ? <span className="animate-pulse">█</span> : ""}
              </span>
            ))}
          </div>
        </div>

        {/* Brutalist Grid System */}
        <div className="grid lg:grid-cols-[1.3fr_1fr] border border-white/10 bg-[#050505]">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={featured.href}
              className="group flex flex-col justify-between h-full border-b lg:border-b-0 lg:border-r border-white/10 bg-[#050505] p-8 md:p-14 lg:p-20 transition-all duration-700 hover:bg-white hover:text-black cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-16">
                  <div className="flex h-16 w-16 items-center justify-center border border-white/10 bg-[#050505] transition-colors group-hover:border-black/10 group-hover:bg-black/5">
                    <FeaturedIcon className="h-6 w-6 text-white/60 group-hover:text-black" />
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary transition-colors group-hover:text-black mt-2">
                    {featured.eyebrow}
                  </p>
                </div>

                <h3 className="max-w-xl font-heavy text-[clamp(3.5rem,5vw,5rem)] uppercase leading-none text-white tracking-tighter mb-8 transition-colors group-hover:text-black">
                  {featured.title}
                </h3>
              </div>

              <div>
                <p className="max-w-md text-lg font-light leading-relaxed text-white/50 transition-colors group-hover:text-black/70 mb-12">
                  {featured.description}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 pt-8 border-t border-white/10 group-hover:border-black/10 transition-colors">
                  <div className="max-w-xs">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30 group-hover:text-black/40 mb-2">Why it matters</p>
                    <p className="text-sm font-light leading-relaxed text-white/60 group-hover:text-black/70">
                      When the music, the archive, and the internal context point in the same
                      direction, the next chapter connects.
                    </p>
                  </div>
                  <div className="inline-flex items-center justify-center h-12 w-12 border border-white/10 group-hover:border-black group-hover:bg-black transition-colors rounded-none shrink-0">
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
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="h-full"
                >
                  <Link
                    href={module.href}
                    className="group flex flex-col justify-between h-full border-b border-white/10 last:border-b-0 bg-[#050505] hover:bg-white/[0.03] transition-colors p-8 md:p-12 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4 mb-10">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary/70 group-hover:text-primary transition-colors">
                          {module.eyebrow}
                        </p>
                        <h3 className="mt-4 font-heavy text-4xl uppercase text-white tracking-tighter">
                          {module.title}
                        </h3>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center border border-white/10 bg-[#050505] transition-colors group-hover:border-white group-hover:bg-white">
                        <Icon className="h-4 w-4 text-white/50 group-hover:text-black transition-colors" />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                      <p className="text-base font-light leading-relaxed text-white/50 group-hover:text-white/70 transition-colors max-w-sm">
                        {module.description}
                      </p>

                      <div className="inline-flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 transition-colors group-hover:text-white whitespace-nowrap">
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
