import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Calendar, MapPin, Play, Waves } from "lucide-react";
import SEO from "@/components/SEO";
import LayloDropEmbed from "@/components/LayloDropEmbed";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@shared/routes";

const PAGE_PATH = ROUTES.sunsets;
const CANONICAL_SUNSETS_URL = "https://sunsets.vip";
const OG_IMAGE = "/images/chasing-sunsets-july4-first-access.png";
const SUNSETS_LAYLO_DROP_ID = "IQ5HaR";

const AUTOGRAF_YOUTUBE_EMBED =
  "https://www.youtube.com/embed/9R6XH7JZlJI?start=5506&list=RD9R6XH7JZlJI&rel=0&modestbranding=1";
const SOMMERS_SOUNDCLOUD_URL =
  "https://soundcloud.com/chasing-sun-sets/sommers-uk-ep0011-chapter-1-chasing-sunsets";
const SOMMERS_SOUNDCLOUD_EMBED = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
  SOMMERS_SOUNDCLOUD_URL
)}&color=%2361e8ff&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=true`;

const SEASON_DATES = [
  { label: "SUN(SETS) I", date: "July 4" },
  { label: "SUN(SETS) II", date: "August 22" },
  { label: "SUN(SETS) III", date: "September 19" },
] as const;

export default function SunsetsLinkBio() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-[#050814] text-stone-100 selection:bg-[#61e8ff] selection:text-black">
      <SEO
        title="SUN(SETS) 2026 — Lake List & First Access"
        description="SUN(SETS) returns to Castaways Beach Club for summer 2026. Three dates, one lake, one home. Join the Lake List for first access to tickets and Season Passes."
        image={OG_IMAGE}
        canonicalPath={PAGE_PATH}
      />

      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(97,232,255,0.08),transparent_55%)]" />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-[460px] flex-col px-4 py-8 sm:py-12">
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-[#61e8ff]">
            The Monolith Project
          </p>
          <h1 className="mt-4 text-[clamp(2.2rem,9vw,3.2rem)] font-black leading-[0.94] tracking-tight text-white">
            SUN(SETS) 2026
          </h1>
          <p className="mt-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#61e8ff]/80">
            Lake List + Season Pass First Access
          </p>

          <p className="mx-auto mt-6 max-w-[380px] text-sm leading-relaxed text-stone-300">
            Chasing Sun(Sets) returns to Castaways Beach Club for the 2026
            season.
          </p>

          <p className="mt-3 text-lg font-black uppercase tracking-[0.06em] text-white">
            Three dates. One lake. One home.
          </p>

          {/* Date cards */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {SEASON_DATES.map(d => (
              <div
                key={d.label}
                className="border border-[#61e8ff]/20 bg-[#0a1024]/80 px-3 py-4 text-center"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#61e8ff]">
                  {d.label}
                </p>
                <p className="mt-2 text-lg font-black leading-none text-white">
                  {d.date}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-400">
            <MapPin className="size-3" />
            <span>Castaways Beach Club — North Avenue Beach, Chicago</span>
          </div>
        </motion.header>

        {/* Laylo embed — the ONE conversion point */}
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-8"
        >
          <LayloDropEmbed
            dropId={SUNSETS_LAYLO_DROP_ID}
            accentColor="61e8ff"
            profileLabel="Follow CHASING SUN(SETS)"
          />
        </motion.section>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4 text-center text-xs leading-relaxed text-stone-400"
        >
          Join the Lake List for first access to tickets, limited Season
          Passes, artist announcements, guest-list opportunities, and private
          updates before the public release.
        </motion.p>

        {/* Partner link */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-10 text-center"
        >
          <Button
            asChild
            variant="outline"
            className="h-10 border-[#61e8ff]/20 bg-white/[.04] px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-stone-300 hover:border-[#61e8ff]/40 hover:bg-white/[.08]"
          >
            <a href={ROUTES.partners}>
              Partner With Us
              <ArrowUpRight className="ml-1 size-3.5" />
            </a>
          </Button>
        </motion.div>

        {/* YouTube recap */}
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 space-y-3 border border-[#61e8ff]/10 bg-[#0a1024]/60 p-4"
        >
          <div className="flex items-center gap-2">
            <Play className="size-4 text-[#61e8ff]" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#61e8ff]">
              Watch the Last Chapter
            </p>
          </div>
          <div className="aspect-video overflow-hidden bg-black">
            <iframe
              className="h-full w-full"
              src={AUTOGRAF_YOUTUBE_EMBED}
              title="Autograf Sun(Sets) July 4 recap"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </motion.section>

        {/* SoundCloud */}
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-4 space-y-3 border border-[#61e8ff]/10 bg-[#0a1024]/60 p-4"
        >
          <div className="flex items-center gap-2">
            <Waves className="size-4 text-[#61e8ff]" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#61e8ff]">
              SUN(SETS) Radio — Sommers UK
            </p>
          </div>
          <div className="overflow-hidden bg-black">
            <iframe
              title="Sommers UK featured SoundCloud selection"
              className="h-[300px] w-full"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src={SOMMERS_SOUNDCLOUD_EMBED}
            />
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="mt-16 mb-8 flex items-center justify-center gap-4 text-[10px] font-semibold text-stone-500">
          <a
            href={ROUTES.terms}
            className="underline decoration-dotted underline-offset-4 transition hover:text-stone-300"
          >
            Terms
          </a>
          <a
            href={ROUTES.privacy}
            className="underline decoration-dotted underline-offset-4 transition hover:text-stone-300"
          >
            Privacy
          </a>
          <a
            href={`${CANONICAL_SUNSETS_URL}/sunsets`}
            className="underline decoration-dotted underline-offset-4 transition hover:text-stone-300"
          >
            sunsets.vip
          </a>
        </footer>
      </main>
    </div>
  );
}
