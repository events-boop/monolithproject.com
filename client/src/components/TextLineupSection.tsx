import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { signalChirp } from "@/lib/SignalChirpEngine";

const lineupData = [
  { name: "ADRIATIQUE", series: "untold", id: "adriatique" }, { name: "BEN BÖHMER [LIVE]", series: "sunsets", id: "ben-bohmer" }, { name: "KEINEMUSIK", series: "sunsets", id: "keinemusik" }, { name: "MONOLINK [LIVE]", series: "sunsets", id: "monolink" },
  { name: "Aaron Hibell", id: "aaron-hibell" }, { name: "Acid Pauli", id: "acid-pauli" }, { name: "Anfisa Letyago", id: "anfisa-letyago" },
  { name: "ANNA", id: "anna" }, { name: "Arodes", id: "arodes" }, { name: "ARTBAT", id: "artbat" }, { name: "Autograf", id: "autograf" },
  { name: "Benchek", series: "radio", id: "benchek" }, { name: "berlioz", id: "berlioz" }, { name: "Carlita", id: "carlita" }, { name: "Chris IDH", series: "radio", id: "chris-idh" },
  { name: "Deer Jade", id: "deer-jade" }, { name: "Deron B2B Juany Bravo", series: "untold", id: "deron-juany-bravo" }, { name: "Enfant Sauvage", id: "enfant-sauvage" }, { name: "Eran Hersh", id: "eran-hersh" },
  { name: "Eric Prydz", id: "eric-prydz" }, { name: "Ewerseen", series: "radio", id: "ewerseen" }, { name: "Étienne de Crécy", id: "etienne-de-crecy" }, { name: "Funk Tribu", id: "funk-tribu" },
  { name: "Ginton", id: "ginton" }, { name: "Jimi Jules", id: "jimi-jules" }, { name: "Kasablanca", id: "kasablanca" }, { name: "Kenya Grace", id: "kenya-grace" },
  { name: "Kerri Chandler", id: "kerri-chandler" }, { name: "KILIMANJARO", id: "kilimanjaro" }, { name: "Kölsch", id: "koelsch" }, { name: "Lane 8", id: "lane-8" }, { name: "Lazare Sabry", series: "untold", id: "lazare-sabry" },
  { name: "LP Giobbi", id: "lp-giobbi" }, { name: "Mahmut Orhan", id: "mahmut-orhan" }, { name: "Marten Lou", id: "marten-lou" },
  { name: "meera", id: "meera" }, { name: "Michael Bibi", id: "michael-bibi" }, { name: "Mind Against", id: "mind-against" }, { name: "Miss Monique", id: "miss-monique" },
  { name: "nimino", id: "nimino" }, { name: "Parra for Cuva", id: "parra-for-cuva" }, { name: "Radian OFC", series: "radio", id: "radian-ofc" },
  { name: "Rodrigo Gallardo", id: "rodrigo-gallardo" }, { name: "Röyksopp", id: "royksopp" }, { name: "Sammy Virji", id: "sammy-virji" },
  { name: "Summers (UK)", series: "radio", id: "summers-uk" }, { name: "Terranova", series: "radio", id: "terranova" }, { name: "Thylacine", id: "thylacine" },
  { name: "Vintage Culture", id: "vintage-culture" }, { name: "Weval", id: "weval" }, { name: "YOTTO", id: "yotto" }
];

// Map artists to specific ghost images where we have them
const artistImageMap: Record<string, string> = {
  "Autograf": "/images/artist-autograf.webp",
  "Benchek": "/images/artist-benchek.jpg",
  "Deron B2B Juany Bravo": "/images/artist-deron-untold.webp",
  "Lazare Sabry": "/images/artist-lazare.webp",
};

const hoverImages = [
  "/images/artist-autograf.webp",
  "/images/artist-avo-untold.webp",
  "/images/artist-benchek.jpg",
  "/images/artist-chus.webp",
  "/images/artist-deron-untold.webp",
  "/images/artist-haai.webp",
  "/images/artist-joezi.webp",
  "/images/artists-collective.jpg",
  "/images/artist-lazare.webp"
];

export default function TextLineupSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ghostImage, setGhostImage] = useState<string | null>(null);
  const [hoveredArtist, setHoveredArtist] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section ref={containerRef} className="relative py-24 md:py-32 bg-[#050505] text-white overflow-hidden">
      {/* Ghost artist image — full section bleed, triggered on name hover */}
      <AnimatePresence>
        {ghostImage && (
          <motion.div
            key={ghostImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <img
              src={ghostImage}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-center"
            />
            {/* Double overlay: uniform dark base + hard vignette */}
            <div className="absolute inset-0 bg-[#050505]/85" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] opacity-70" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Archival Texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none z-[1]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-[1]" />

      {/* Active artist name — large ghost label in the corner */}
      <AnimatePresence>
        {hoveredArtist && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-12 right-6 md:right-12 z-[2] pointer-events-none text-right"
          >
            <span className="font-heavy text-4xl md:text-6xl uppercase tracking-tighter text-white/10 leading-none select-none">
              {hoveredArtist}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start md:items-end mb-24 gap-12 lg:gap-24">
          <div className="max-w-2xl">
            <span className="ui-kicker block text-white/45 mb-6 font-mono tracking-[0.3em] uppercase">Artist Roster</span>
            <h2 className="font-heavy text-[clamp(4rem,8vw,10rem)] leading-[0.82] tracking-tighter uppercase mb-10">
              THE ARTISTS.
            </h2>
            <p className="font-mono text-[11px] md:text-sm tracking-[0.14em] uppercase text-white/60 leading-relaxed max-w-xl">
              Artists selected for the room, the series, and the pace of the night. A lineup should tell you what kind of atmosphere you are stepping into, not just who made the poster.
            </p>
          </div>

          <div className="flex flex-col items-end gap-6 w-full lg:w-auto">
             <div className="hidden lg:block w-px h-32 bg-gradient-to-b from-white/20 to-transparent mr-24" />
             <a
              href="/lineup"
              className="group flex items-center justify-between gap-12 w-full lg:w-auto px-10 py-5 rounded-none border border-white/10 bg-white/[0.02] hover:bg-white hover:text-black transition-all duration-700 ease-out"
            >
              <span className="font-mono font-bold tracking-[0.25em] text-xs uppercase">Full Historical Lineup</span>
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        <motion.div style={{ y }} className="relative">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 md:gap-x-12 md:gap-y-8 text-center">
            {lineupData.map((artist, i) => {
              const isRadio = artist.series === "radio";
              const isUntold = artist.series === "untold";
              const isSunsets = artist.series === "sunsets";

              let restingColor = "text-white/30";
              let hoverColor = "group-hover:text-white group-hover:drop-shadow-[0_0_15px_rgba(224,90,58,0.5)]";
              let indicatorColor = "bg-primary";

              if (isRadio) {
                restingColor = "text-white/70";
                hoverColor = "group-hover:text-white group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]";
                indicatorColor = "bg-white";
              } else if (isUntold) {
                restingColor = "text-[#22D3EE]/80";
                hoverColor = "group-hover:text-[#22D3EE] group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.7)]";
                indicatorColor = "bg-[#22D3EE]";
              } else if (isSunsets) {
                restingColor = "text-[#E8B86D]/80";
                hoverColor = "group-hover:text-[#E8B86D] group-hover:drop-shadow-[0_0_15px_rgba(232,184,109,0.7)]";
                indicatorColor = "bg-[#E8B86D]";
              }

              const img = artistImageMap[artist.name] || hoverImages[(i * 3) % hoverImages.length];

              return (
                <div
                  key={artist.name}
                  className="group relative inline-block cursor-default"
                  onMouseEnter={() => {
                    setGhostImage(img);
                    setHoveredArtist(artist.name);
                  }}
                  onMouseLeave={() => {
                    setGhostImage(null);
                    setHoveredArtist(null);
                  }}
                >
                  <Link
                    href={`/artists/${artist.id}`}
                    onClick={() => signalChirp.click()}
                    className={`font-heavy text-[clamp(1.5rem,4vw,6rem)] uppercase tracking-tight leading-none transition-all duration-500 group-hover:tracking-normal group-hover:opacity-100 ${restingColor} ${hoverColor}`}
                  >
                    {artist.name}
                  </Link>

                  {/* Micro-hover indicator */}
                  <div className={`absolute -bottom-2 md:-bottom-4 left-0 w-0 h-[2px] ${indicatorColor} transition-all duration-500 ease-out group-hover:w-full`} />

                  {/* Vertical Separator for certain items to break visual rhythm */}
                  {i % 4 === 3 && (
                    <span className="hidden md:inline-block mx-8 h-[2vh] w-px bg-white/24 align-middle" />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom Context Panel */}
        <div className="mt-32 pt-12 border-t border-white/5 grid md:grid-cols-3 gap-12 opacity-40">
           {[
             { label: "Status", val: "Archival" },
             { label: "Standard", val: "Music-First" },
             { label: "Updated", val: "Season 01" }
           ].map(stat => (
             <div key={stat.label} className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest">{stat.label}</span>
                <span className="font-display font-bold text-sm uppercase">{stat.val}</span>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}
