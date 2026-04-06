import { motion } from "framer-motion";
import { ArrowRight, Ticket, Disc3 } from "lucide-react";
import { POSH_TICKET_URL } from "@/data/events";
import EditorialHeader from "./EditorialHeader";

interface Track {
  title: string;
  artist: string;
  series: "sunsets" | "untold";
  duration: string;
  soundcloudUrl: string;
  embedUrl: string;
}

const tracks: Track[] = [
  {
    title: "Spécial NYE",
    artist: "BENCHEK",
    series: "sunsets",
    duration: "58:23",
    soundcloudUrl: "https://soundcloud.com/chasing-sun-sets/ccsep010-chapter-iii-chasing-sunsets-special-nye-by-benchek",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/ccsep010-chapter-iii-chasing-sunsets-special-nye-by-benchek&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
  },
  {
    title: "TERRANOVA x CHASING SUN(SETS)",
    artist: "TERRANOVA",
    series: "sunsets",
    duration: "62:10",
    soundcloudUrl: "https://soundcloud.com/chasing-sun-sets/terranova",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/terranova&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
  },
  {
    title: "Mix Vol.3",
    artist: "EWERSEEN",
    series: "sunsets",
    duration: "55:48",
    soundcloudUrl: "https://soundcloud.com/chasing-sun-sets/ewerseen-chasing-sunsets-mix-vol3",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/ewerseen-chasing-sunsets-mix-vol3&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
  },
  {
    title: "RADIAN x UNTOLD STORY",
    artist: "RADIAN",
    series: "untold",
    duration: "71:05",
    soundcloudUrl: "https://soundcloud.com/chasing-sun-sets/radianofc-set",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/radianofc-set&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
  },
  {
    title: "Collab Mix Vol.2",
    artist: "EWERSEEN",
    series: "sunsets",
    duration: "48:32",
    soundcloudUrl: "https://soundcloud.com/chasing-sun-sets/ewerseen-x-chasing-sunsets-collab-mix-vol2",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/ewerseen-x-chasing-sunsets-collab-mix-vol2&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
  },
  {
    title: "Live from Marbella EP02",
    artist: "BENCHEK",
    series: "sunsets",
    duration: "64:17",
    soundcloudUrl: "https://soundcloud.com/chasing-sun-sets/benchek-chasing-sunsets-collab-ep02-live-from-marbella",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/benchek-chasing-sunsets-collab-ep02-live-from-marbella&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
  },
];

export default function SoundCloudSection() {
  return (
    <section id="listen" className="relative py-24 md:py-32 bg-[#050505] text-white">
      {/* Background Archival Texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />

      <div className="container layout-default px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-12"
        >
          <div>
            <span className="font-mono text-[10px] md:text-sm tracking-[0.3em] text-white/40 mb-6 block uppercase">
              Signals & Mixes
            </span>
            <h2 className="font-heavy text-[clamp(4rem,8vw,9rem)] leading-[0.85] tracking-tighter uppercase text-white flex flex-col">
              <span className="text-white/30">RADIO</span>
              <span>TRANSMISSION.</span>
            </h2>
          </div>
          <p className="font-sans text-lg text-white/50 leading-relaxed font-light max-w-md pb-4">
            CHASING SUN(SETS) RADIO SHOW. Every recorded set and studio mix compiled into a singular broadcast archive.
          </p>
        </motion.div>

        <div className="flex flex-col border-t border-white/10">
          {tracks.map((podcast, index) => (
            <motion.a
              key={podcast.soundcloudUrl}
              href={podcast.soundcloudUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative block border-b border-white/10 py-8 md:py-10 transition-colors hover:bg-white/[0.02] px-2 md:px-8"
            >
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white scale-y-0 origin-top group-hover:scale-y-100 transition-transform duration-500" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12">
                <div className="flex items-start md:items-center gap-6 md:gap-8 flex-1">
                  <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 border border-white/20 bg-[#050505] flex items-center justify-center text-white/30 group-hover:bg-white group-hover:text-black transition-all duration-500 rounded-none shadow-2xl">
                    <Disc3 className="w-6 h-6 md:w-8 md:h-8 group-hover:animate-[spin_4s_linear_infinite]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40 mb-3 group-hover:text-white/70 transition-colors">
                      EPISODE {String(index + 1).padStart(2, "0")} • {podcast.duration}
                    </span>
                    <h4 className="font-heavy text-3xl md:text-5xl uppercase tracking-tighter text-white group-hover:text-white transition-colors leading-none drop-shadow-md">
                      {podcast.artist}
                    </h4>
                    <p className="font-sans text-sm md:text-lg text-white/50 mt-2 font-light group-hover:text-white/80 transition-colors max-w-xl">
                      {podcast.title}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 mt-4 md:mt-0 md:justify-end self-end md:self-auto">
                  <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/30 group-hover:text-white transition-colors hidden sm:block">
                    Open Episode
                  </span>
                  <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 flex items-center justify-center border border-white/20 rounded-none group-hover:bg-white group-hover:border-white transition-all duration-500">
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white/50 group-hover:text-black group-hover:-rotate-45 transition-all duration-500" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-16 md:mt-24 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <a
            href="https://soundcloud.com/chasing-sun-sets"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 text-white hover:text-white transition-all duration-500 outline-none"
          >
            <span className="font-mono tracking-[0.25em] uppercase text-xs text-white/50 group-hover:text-white transition-colors">
              Open Full Archive
            </span>
            <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-2 transition-transform duration-500" />
          </a>
          
          <a
            href={POSH_TICKET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-8 px-8 py-5 border border-white/20 bg-white/[0.02] hover:bg-white hover:text-black hover:border-white transition-all duration-500"
          >
            <span className="font-mono font-bold tracking-[0.2em] uppercase text-xs">
              Hear Them Live
            </span>
            <Ticket className="w-4 h-4 transition-transform group-hover:-rotate-12" />
          </a>
        </div>
      </div>
    </section>
  );
}
