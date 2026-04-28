import { motion } from "framer-motion";
import { Calendar, Music, TrendingUp, Users } from "lucide-react";
import RevealText from "./RevealText";
import ResponsiveImage from "./ResponsiveImage";

const metrics = [
  {
    label: "Best Arrival",
    value: "Golden Hour",
    note: "Be in the room before the skyline flips.",
    icon: Calendar,
  },
  {
    label: "The Sound",
    value: "Melodic + Afro",
    note: "Warm percussion, patient builds, proper movement.",
    icon: Music,
  },
  {
    label: "The Room",
    value: "Open-Air",
    note: "Roof, shoreline, and summer spaces with air.",
    icon: TrendingUp,
  },
  {
    label: "The Crowd",
    value: "Music-First",
    note: "People who stay for the set, not the photo.",
    icon: Users,
  },
];

const seasonNotes = [
  {
    title: "What It Is",
    description: "A summer chapter system built around daylight, transition, and the final push into night.",
  },
  {
    title: "Why It Works",
    description: "The room starts with horizon and atmosphere instead of peak-hour pressure too early.",
  },
  {
    title: "How Tickets Move",
    description: "Drop list first, public push second. Capacity stays controlled on purpose.",
  },
  {
    title: "Who It Protects",
    description: "The people there for melodic, organic, afro, and properly paced house music.",
  },
];

export default function ChasingSunsetsDetails() {
  return (
    <section className="relative overflow-hidden border-t border-[#C2703E]/14 bg-[linear-gradient(180deg,rgba(251,245,237,1),rgba(244,233,214,0.92))] px-6 py-24 text-charcoal md:py-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(251,245,237,0.92),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(232,184,109,0.14),transparent_30%),radial-gradient(circle_at_82%_78%,rgba(194,112,62,0.12),transparent_32%)]" />
      </div>

      <div className="container layout-wide relative z-10">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] xl:items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="mb-5 block font-mono text-[11px] uppercase tracking-[0.32em] text-clay">
              The Series
            </span>
            <div className="font-display text-[clamp(3rem,6vw,5.8rem)] uppercase leading-[0.86] tracking-tight text-charcoal">
              <RevealText as="div">OPEN AIR</RevealText>
              <RevealText as="div" delay={0.16}>
                WITH DISCIPLINE
              </RevealText>
            </div>
            <p className="mt-6 text-lg leading-relaxed text-charcoal/82">
              Chasing Sun(Sets) is not a beach-theme shortcut. It is a paced summer room that starts in the light,
              lets the skyline change around the crowd, and earns its way into the night.
            </p>
            <p className="mt-5 text-base leading-relaxed text-charcoal/68 md:text-lg">
              Rooftops, shoreline spaces, and open-air Chicago rooms programmed for melodic, organic, and afro house
              without losing structural strength.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="sunset-panel-editorial p-4 md:p-5"
          >
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.78fr)]">
              <div className="sunset-media-frame relative aspect-[4/5]">
                <ResponsiveImage
                  src="/images/chasing-sunsets-premium.webp"
                  alt="Golden hour open-air crowd at Chasing Sun(Sets)"
                  loading="lazy"
                  decoding="async"
                  sizes="(min-width: 1024px) 34vw, 100vw"
                  className="absolute inset-0 h-full w-full object-cover object-[52%_35%]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(18,13,9,0.24)_58%,rgba(18,13,9,0.64))]" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-[#E8B86D]">
                    Chapter Proof
                  </span>
                  <p className="mt-2 max-w-xs font-display text-2xl uppercase leading-[0.9]">
                    The room starts in the sky, not in the dark.
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-4">
                <div className="sunset-panel-editorial-soft p-5 md:p-6">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-[#A4592C]">
                    What To Expect
                  </span>
                  <p className="mt-4 text-sm leading-relaxed text-charcoal/72 md:text-base">
                    A run of summer dates built around atmosphere, strong bookings, and a room that stays grounded in
                    house music credibility.
                  </p>
                </div>

                <div className="grid gap-3">
                  {seasonNotes.map((note) => (
                    <article key={note.title} className="sunset-panel-editorial-soft p-5">
                      <h3 className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#A4592C]">
                        {note.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-charcoal/68">{note.description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric, index) => (
            <motion.article
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="sunset-panel-editorial-soft p-6"
            >
              <metric.icon className="h-5 w-5 text-[#A4592C]" />
              <div className="mt-6 font-display text-[clamp(2rem,3vw,2.8rem)] uppercase leading-[0.92] text-charcoal">
                {metric.value}
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-charcoal/56">
                {metric.label}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-charcoal/62">{metric.note}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
