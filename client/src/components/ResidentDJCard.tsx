import { motion } from "framer-motion";
import { ArrowUpRight, Disc3, Instagram, MapPin, Music, Radio } from "lucide-react";
import ResponsiveImage from "./ResponsiveImage";

export interface ResidentDJ {
  name: string;
  handle?: string;
  city: string;
  genre: string[];
  bio: string;
  image?: string;
  instagramUrl?: string;
  soundcloudUrl?: string;
  bookingEmail?: string;
  stats?: { label: string; value: string }[];
  accentColor?: string;
}

const DEFAULT_DJS: ResidentDJ[] = [
  {
    name: "JUANY BRAVO",
    handle: "@juanybravo",
    city: "Chicago, IL",
    genre: ["Afro House", "Melodic House", "Organic"],
    bio: "A cornerstone of the Chasing Sun(Sets) series since Season I. Juany brings a warm, sunrise energy to every set, weaving African rhythm with melodic house and organic textures that feel like golden hour itself.",
    image: "/images/untold-story-juany-deron-v2.webp",
    instagramUrl: "https://instagram.com/juanybravo",
    soundcloudUrl: "https://soundcloud.com/juanybravo",
    bookingEmail: "music@monolithproject.com",
    stats: [
      { value: "4+", label: "Seasons" },
      { value: "12+", label: "Shows" },
      { value: "B2B", label: "Closers" },
    ],
  },
  {
    name: "DERON",
    handle: "@deron",
    city: "Chicago, IL",
    genre: ["Progressive House", "Latin House", "Melodic"],
    bio: "Deron is part of the Monolith foundation: deep progressive groove, Latin rhythm, and a long-form set instinct that suits the full sunset-to-night arc.",
    image: "/images/deron-press.jpg",
    instagramUrl: "https://instagram.com/deron",
    soundcloudUrl: "https://soundcloud.com/deron",
    bookingEmail: "music@monolithproject.com",
    stats: [
      { value: "3+", label: "Seasons" },
      { value: "10+", label: "Shows" },
      { value: "Late", label: "Builder" },
    ],
  },
];

interface ResidentDJCardProps {
  djs?: ResidentDJ[];
}

export default function ResidentDJCard({ djs = DEFAULT_DJS }: ResidentDJCardProps) {
  return (
    <div className="space-y-6">
      {djs.map((dj, index) => (
        <motion.article
          key={dj.name}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="sunset-panel-editorial group grid gap-6 p-5 md:p-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:items-stretch"
          data-cursor-text="LISTEN"
        >
          <div className="flex flex-col justify-between gap-6">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C2703E]/18 bg-white/72 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#A4592C]">
                  <Disc3 size={10} />
                  Resident DJ
                </span>
                {dj.handle ? (
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#2C1810]/56">{dj.handle}</span>
                ) : null}
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#2C1810]/54">
                  <MapPin size={10} />
                  {dj.city}
                </span>
              </div>

              <h3 className="font-display text-[clamp(2.6rem,5vw,4.8rem)] uppercase leading-[0.88] tracking-tight text-[#2C1810]">
                {dj.name.split(" ").map((word, wordIndex) => (
                  <span key={`${dj.name}-${word}`} className="block">
                    {wordIndex === 0 ? (
                      <span className="bg-clip-text text-transparent sunset-gradient-btn [-webkit-background-clip:text]">
                        {word}
                      </span>
                    ) : (
                      word
                    )}
                  </span>
                ))}
              </h3>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#2C1810]/72 md:text-lg">{dj.bio}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
              <div className="sunset-panel-editorial-soft p-5">
                <span className="block font-mono text-[10px] uppercase tracking-[0.26em] text-[#A4592C]">Sound Profile</span>
                <div className="mt-4 flex flex-wrap gap-2">
                  {dj.genre.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full border border-[#E8B86D]/26 bg-[#E8B86D]/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#2C1810]/76"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {dj.stats ? (
                <div className="sunset-panel-editorial-soft grid grid-cols-3 gap-3 p-5">
                  {dj.stats.map((stat) => (
                    <div key={stat.label}>
                      <div className="font-display text-2xl uppercase leading-none text-[#A4592C] md:text-3xl">
                        {stat.value}
                      </div>
                      <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#2C1810]/52">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
              {dj.soundcloudUrl ? (
                <a
                  href={dj.soundcloudUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-sunsets btn-pill-compact"
                >
                  <Radio size={13} />
                  Listen
                </a>
              ) : null}
              {dj.bookingEmail ? (
                <a
                  href={`mailto:${dj.bookingEmail}?subject=Booking Inquiry - ${dj.name}`}
                  className="btn-pill-outline btn-pill-outline-sunsets-light btn-pill-compact"
                >
                  Book
                  <ArrowUpRight size={13} />
                </a>
              ) : null}
              {dj.instagramUrl ? (
                <a
                  href={dj.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#C2703E]/16 bg-white/72 text-[#2C1810]/62 transition-colors hover:text-[#A4592C]"
                  aria-label={`${dj.name} Instagram`}
                >
                  <Instagram size={15} />
                </a>
              ) : null}
            </div>
          </div>

          <div className="sunset-media-frame relative aspect-[4/5] min-h-[20rem]">
            {dj.image ? (
              <ResponsiveImage
                src={dj.image}
                alt={dj.name}
                sizes="(min-width: 1024px) 34vw, 100vw"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ filter: "saturate(0.92) contrast(1.04)" }}
                onError={(event) => {
                  (event.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : null}

            {!dj.image ? (
              <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(180deg,rgba(255,255,255,0.85),rgba(246,234,215,0.78))]">
                <Music size={64} className="text-[#C2703E] opacity-40" />
              </div>
            ) : null}

            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(18,13,9,0.16)_46%,rgba(18,13,9,0.72))]" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="rounded-2xl border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(246,234,215,0.8))] px-4 py-3 shadow-[0_18px_34px_rgba(18,13,9,0.16)]">
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#A4592C]">Resident / Chasing Sun(Sets)</div>
                <div className="mt-2 font-display text-xl uppercase leading-[0.92] text-[#2C1810]">{dj.name}</div>
              </div>
            </div>
          </div>
        </motion.article>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.16 }}
        className="sunset-panel-editorial-soft p-8 text-center"
      >
        <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.25em] text-[#A4592C]">
          Want To Join The Roster?
        </span>
        <p className="mx-auto mb-5 max-w-sm text-sm leading-relaxed text-[#2C1810]/64">
          Afro, organic, Latin, Brazilian, and melodic house with real sunset pacing. If the mix fits the room, send
          it.
        </p>
        <a
          href="mailto:music@monolithproject.com?subject=Chasing Sun(Sets) Resident DJ Submission"
          className="btn-pill-outline btn-pill-outline-sunsets-light btn-pill-compact"
        >
          Submit Your Mix
          <ArrowUpRight size={13} />
        </a>
      </motion.div>
    </div>
  );
}
