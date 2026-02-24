import { motion } from "framer-motion";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { radioEpisodes } from "@/data/radioEpisodes";
import EntityBoostStrip from "@/components/EntityBoostStrip";
import BrandMotifDivider from "@/components/BrandMotifDivider";
import FloatingFactsChip from "@/components/FloatingFactsChip";

const sectionTransition = { duration: 0.62, ease: [0.22, 1, 0.36, 1] as const };
const sectionReveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-90px" },
  transition: sectionTransition,
};

export default function Radio() {
  const latestEpisode = radioEpisodes[0];
  const totalTracks = radioEpisodes.reduce((count, episode) => count + episode.tracklist.length, 0);
  const totalMinutes = radioEpisodes.reduce((minutes, episode) => {
    const [mm = "0", ss = "0"] = episode.duration.split(":");
    const parsedMinutes = Number.parseInt(mm, 10) || 0;
    const parsedSeconds = Number.parseInt(ss, 10) || 0;
    return minutes + parsedMinutes + (parsedSeconds >= 30 ? 1 : 0);
  }, 0);
  const totalHours = Math.max(1, Math.round((totalMinutes / 60) * 10) / 10);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Chasing Sun(Sets) Radio Show | Episodes, Tracklists, Guest Mixes"
        description="Official Chasing Sun(Sets) Radio Show archive from Chicago with guest mixes, episode pages, tracklists, and links to tickets and facts."
        absoluteTitle
        canonicalPath="/radio"
      />
      <Navigation />

      <main id="main-content" tabIndex={-1} className="pt-44 pb-24 px-6">
        <EntityBoostStrip
          tone="dark"
          className="mb-10"
          contextLabel="Radio + Entity Defense"
          intent="listen-episode"
          episodeHref={`/radio/${radioEpisodes[0]?.slug ?? ""}`}
        />
        <motion.section className="container max-w-6xl mx-auto" {...sectionReveal}>
          <div className="luxe-surface-dark px-6 py-6 md:px-8 md:py-8">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-primary mb-5">
              Official Audio Archive
            </p>
            <h1 className="font-display text-[clamp(3.2rem,9vw,7rem)] leading-[0.88] uppercase mb-6">
              Chasing Sun(Sets) Radio Show
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-4xl">
              Chasing Sun(Sets) Radio Show is the audio branch of the Chasing Sun(Sets) universe - guest mixes,
              sunset-ready selections, and Chicago-rooted global house storytelling.
            </p>
            <p className="text-sm md:text-base text-muted-foreground mt-4 max-w-4xl">
              This is the official music brand archive, not a fragrance listing. See{" "}
              <Link href="/chasing-sunsets-facts" className="text-primary underline underline-offset-4">
                Chasing Sun(Sets) Facts
              </Link>{" "}
              for identity details.
            </p>
          </div>
        </motion.section>

        <motion.section className="container max-w-6xl mx-auto mt-7" {...sectionReveal}>
          <div className="grid sm:grid-cols-3 gap-3">
            <article className="luxe-surface-dark rounded-xl px-4 py-4 border border-white/10">
              <p className="ui-chip text-white/55 mb-2">Published Episodes</p>
              <p className="font-display text-3xl text-white leading-none">{radioEpisodes.length}</p>
            </article>
            <article className="luxe-surface-dark rounded-xl px-4 py-4 border border-white/10">
              <p className="ui-chip text-white/55 mb-2">Latest Drop</p>
              <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/88">
                {latestEpisode ? `${latestEpisode.shortCode} · ${latestEpisode.displayDate}` : "Archive Updating"}
              </p>
            </article>
            <article className="luxe-surface-dark rounded-xl px-4 py-4 border border-white/10">
              <p className="ui-chip text-white/55 mb-2">Archive Runtime</p>
              <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/88">
                {totalHours} Hours · {totalTracks} Tracks
              </p>
            </article>
          </div>
        </motion.section>

        <BrandMotifDivider tone="nocturne" className="my-10" />

        <motion.section className="container max-w-6xl mx-auto mt-14" {...sectionReveal}>
          <h2 className="font-display text-4xl uppercase mb-7">Episodes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {radioEpisodes.map((episode, index) => (
              <motion.article
                key={episode.slug}
                className="border border-border/70 rounded-2xl p-6 bg-card/40 flex flex-col lift-hover"
                style={{
                  background:
                    "linear-gradient(165deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)), linear-gradient(210deg, rgba(10,10,16,0.88), rgba(10,10,16,0.6))",
                }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ ...sectionTransition, delay: Math.min(index * 0.06, 0.24) }}
              >
                <p className="font-mono text-xs tracking-[0.24em] uppercase text-primary mb-3">
                  {episode.shortCode} · {episode.displayDate}
                </p>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center rounded-full border border-white/16 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] uppercase text-white/82">
                    {episode.duration}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/16 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] uppercase text-white/82">
                    {episode.tracklist.length} Tracks
                  </span>
                </div>
                <h3 className="font-display text-3xl leading-tight mb-2 uppercase">
                  {episode.title}
                </h3>
                <p className="text-sm text-white/84 mb-4">Guest: {episode.guest}</p>
                <p className="text-muted-foreground mb-5 flex-1">{episode.summary}</p>
                <div className="cta-stack">
                  <Link href={`/radio/${episode.slug}`} className="btn-pill-coral w-full sm:w-auto">
                    Listen Episode
                  </Link>
                  <a
                    href={episode.audioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill-dark w-full sm:w-auto"
                  >
                    Listen on SoundCloud
                  </a>
                </div>
                <Link
                  href={`/radio/${episode.slug}#tracklist`}
                  className="mt-3 inline-flex items-center text-[11px] font-mono tracking-[0.14em] uppercase text-primary hover:text-white transition-colors"
                >
                  Tracklist + Story
                </Link>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <BrandMotifDivider tone="nocturne" className="my-10" />

        <motion.section className="container max-w-6xl mx-auto mt-16" {...sectionReveal}>
          <p className="text-sm text-muted-foreground">
            Looking for tickets or event chapters? Visit{" "}
            <Link href="/tickets" className="text-primary underline underline-offset-4">
              tickets
            </Link>{" "}
            and{" "}
            <Link href="/schedule" className="text-primary underline underline-offset-4">
              schedule
            </Link>
            , and{" "}
            <Link href="/chasing-sunsets#chasing-july-2025-recap" className="text-primary underline underline-offset-4">
              July 2025 recap video
            </Link>
            .
          </p>
        </motion.section>
      </main>

      <FloatingFactsChip tone="nocturne" storageKey="floating-facts-chip-radio" />
      <Footer />
    </div>
  );
}
