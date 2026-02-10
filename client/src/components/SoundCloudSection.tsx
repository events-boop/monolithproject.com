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
    <section id="listen" className="relative section-rhythm">
      <div className="container max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          <EditorialHeader
            kicker="Mixes"
            title="Listen"
            description="CHASING SUN(SETS) RADIO SHOW. Every set in one place, curated as episodes."
          />
        </motion.div>

        <div className="mb-6">
          <span className="ui-kicker text-clay block mb-2">
            Podcasts
          </span>
          <h3 className="font-display text-4xl md:text-5xl leading-[0.9] uppercase text-foreground">
            CHASING SUN(SETS) RADIO SHOW
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tracks.map((podcast, index) => (
            <motion.a
              key={podcast.soundcloudUrl}
              href={podcast.soundcloudUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="ui-card group border border-border/70 bg-card/40 p-5 hover:border-clay/50 hover:bg-card/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/60"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-14 h-14 shrink-0 border border-clay/40 bg-gradient-to-br from-clay/25 to-primary/20 flex items-center justify-center text-clay group-hover:scale-105 transition-transform">
                    <Disc3 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="ui-chip text-clay mb-2">
                      Episode {String(index + 1).padStart(2, "0")}
                    </p>
                    <h4 className="ui-heading font-display text-2xl text-foreground uppercase mb-2 group-hover:text-clay transition-colors">
                      {podcast.title}
                    </h4>
                    <p className="text-sm font-semibold tracking-wide text-primary">
                      {podcast.artist}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {podcast.duration}
                </span>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 ui-meta text-muted-foreground group-hover:text-clay transition-colors">
                Listen Now
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </div>
              <div className="mt-3 h-px bg-gradient-to-r from-clay/50 to-transparent" />
            </motion.a>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <a
            href="https://soundcloud.com/chasing-sun-sets"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <span className="font-mono tracking-wide uppercase text-xs">All mixes on SoundCloud</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href={POSH_TICKET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill-coral"
          >
            <Ticket className="w-3.5 h-3.5" />
            Hear Them Live
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
