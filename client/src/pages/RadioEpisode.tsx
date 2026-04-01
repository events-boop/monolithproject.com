import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import EntityBoostStrip from "@/components/EntityBoostStrip";
import { getRadioEpisode, radioEpisodes } from "@/data/radioEpisodes";
import { CTA_LABELS } from "@/lib/cta";

function isExternalLink(url: string) {
  return /^https?:\/\//i.test(url);
}

const sectionTransition = { duration: 0.62, ease: [0.22, 1, 0.36, 1] as const };
const sectionReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: sectionTransition,
};

export default function RadioEpisode() {
  const { slug } = useParams<{ slug: string }>();
  const episode = slug ? getRadioEpisode(slug) : undefined;
  const episodeIndex = episode ? radioEpisodes.findIndex((entry) => entry.slug === episode.slug) : -1;
  const previousEpisode = episodeIndex > 0 ? radioEpisodes[episodeIndex - 1] : undefined;
  const nextEpisode =
    episodeIndex >= 0 && episodeIndex < radioEpisodes.length - 1 ? radioEpisodes[episodeIndex + 1] : undefined;
  const episodeJumpLinks = [
    { href: "#listen", label: "Listen" },
    { href: "#tracklist", label: "Tracklist" },
    { href: "#story", label: "Story" },
    { href: "#guest-links", label: "Guest Links" },
  ];

  if (!episode) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SEO
          title="Radio Episode Not Found"
          description="The requested Chasing Sun(Sets) Radio Show episode was not found."
          canonicalPath="/radio"
        />
        <Navigation />
        <main id="main-content" tabIndex={-1} className="page-shell-start pb-24 px-6">
          <section className="container max-w-3xl mx-auto text-center">
            <h1 className="font-display text-[clamp(2.7rem,7vw,5rem)] uppercase mb-5">
              Episode Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              This radio episode URL does not exist. Visit the official radio archive for available episodes.
            </p>
            <Link href="/radio" className="btn-pill-coral">
              {CTA_LABELS.radioHub}
            </Link>
          </section>
        </main>
        <EntityBoostStrip tone="dark" className="pb-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={`Chasing Sun(Sets) Radio Show ${episode.shortCode}: ${episode.title}`}
        description={`${episode.summary} Official Chicago radio episode with guest mix details and tracklist from Chasing Sun(Sets).`}
        absoluteTitle
        canonicalPath={`/radio/${episode.slug}`}
      />
      <Navigation />

      <main id="main-content" tabIndex={-1} className="page-shell-start pb-24 px-6">
        <motion.section className="container max-w-5xl mx-auto" {...sectionReveal}>
          <div className="luxe-surface-dark px-6 py-6 md:px-8 md:py-8">
            <p className="font-mono text-xs tracking-[0.28em] uppercase text-primary mb-4">
              {episode.shortCode} · {episode.displayDate}
            </p>
            <h1 className="font-display text-[clamp(2.4rem,7vw,5.1rem)] leading-[0.9] uppercase mb-4">
              {episode.title}
            </h1>
            <p className="text-lg text-white/85">Guest: {episode.guest}</p>
            <p className="text-sm text-muted-foreground mt-3 max-w-3xl">
              Chasing Sun(Sets) is a Chicago-based sunset house music event series and radio show by The Monolith Project.
              For disambiguation details, review{" "}
              <Link href="/chasing-sunsets-facts" className="inline-flex items-center justify-center rounded-full border border-primary/40 px-3 py-1 text-[10px] font-[800] tracking-widest uppercase transition-all duration-300 hover:scale-[1.03] shadow-sm text-primary bg-primary/5 hover:bg-primary/15 hover:border-primary hover:text-white mx-1 align-middle">
                Official Chasing Sun(Sets) Identity
              </Link>
              .
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center rounded-full border border-white/16 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] uppercase text-white/82">
                Duration · {episode.duration}
              </span>
              <span className="inline-flex items-center rounded-full border border-white/16 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] uppercase text-white/82">
                {episode.tracklist.length} Tracks Listed
              </span>
            </div>
          </div>
        </motion.section>

        <motion.section className="container max-w-5xl mx-auto mt-7" {...sectionReveal}>
          <nav
            className="season-panel-nocturne p-2.5 flex flex-wrap gap-2"
            aria-label="Episode quick navigation"
          >
            {episodeJumpLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="season-anchor-link season-anchor-link-active-nocturne !min-h-[36px] !px-3.5 !py-1.5"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </motion.section>

        <motion.section id="listen" className="container max-w-5xl mx-auto mt-10 scroll-shell-target" {...sectionReveal}>
          <h2 className="font-display text-3xl uppercase mb-4">Listen</h2>
          <div className="border border-border/70 rounded-xl p-4 bg-card/40 luxe-surface-dark">
            <iframe
              title={`${episode.title} embedded player`}
              width="100%"
              height="166"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src={episode.embedUrl}
            />
          </div>
        </motion.section>

        <motion.section id="tracklist" className="container max-w-5xl mx-auto mt-10 scroll-shell-target" {...sectionReveal}>
          <h2 className="font-display text-3xl uppercase mb-4">Tracklist</h2>
          <div className="border border-border/70 rounded-xl bg-card/40 luxe-surface-dark">
            {episode.tracklist.map((track, index) => (
              <div
                key={`${track.timecode}-${track.artist}-${track.title}`}
                className={`px-5 py-4 border-b border-border/40 last:border-b-0 flex flex-col md:flex-row md:items-center md:justify-between gap-2 hover:bg-white/[0.03] transition-colors ${index % 2 === 0 ? "bg-white/[0.015]" : ""
                  }`}
              >
                <div className="flex items-center gap-3">
                  <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/55">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="font-mono text-xs tracking-[0.18em] uppercase text-primary">{track.timecode}</p>
                </div>
                <p className="text-sm text-white/90">
                  <span className="font-semibold">{track.artist}</span> - {track.title}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section id="story" className="container max-w-5xl mx-auto mt-10 scroll-shell-target" {...sectionReveal}>
          <h2 className="font-display text-3xl uppercase mb-4">Episode Story</h2>
          <article className="border border-border/70 rounded-xl p-6 bg-card/40 space-y-4 text-muted-foreground leading-relaxed luxe-surface-dark">
            {episode.narrative.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        </motion.section>

        <motion.section id="guest-links" className="container max-w-5xl mx-auto mt-10 scroll-shell-target" {...sectionReveal}>
          <h2 className="font-display text-3xl uppercase mb-4">Guest Links</h2>
          <div className="flex flex-wrap gap-3">
            {episode.guestLinks.map((link) =>
              isExternalLink(link.url) ? (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-dark"
                >
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} href={link.url} className="btn-pill-dark">
                  {link.label}
                </Link>
              ),
            )}
            <Link href="/tickets" className="btn-pill-coral">
              {CTA_LABELS.tickets}
            </Link>
          </div>
        </motion.section>

        <motion.section className="container max-w-5xl mx-auto mt-12" {...sectionReveal}>
          <h2 className="font-display text-2xl md:text-3xl uppercase mb-5">Continue Listening</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {previousEpisode ? (
              <Link
                href={`/radio/${previousEpisode.slug}`}
                className="luxe-surface-dark rounded-xl p-5 border border-white/10 hover:border-primary/45 transition-colors lift-hover"
              >
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/55 mb-2">Previous Episode</p>
                <p className="font-display text-2xl text-white leading-tight mb-2 uppercase">{previousEpisode.title}</p>
                <p className="text-sm text-white/65 mb-3">{previousEpisode.displayDate}</p>
                <p className="inline-flex items-center gap-2 text-primary text-sm font-semibold">
                  <ArrowLeft className="w-4 h-4" />
                  Open Episode
                </p>
              </Link>
            ) : (
              <div className="luxe-surface-dark rounded-xl p-5 border border-white/10 opacity-65">
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/55 mb-2">Previous Episode</p>
                <p className="text-sm text-white/70">This is the first available episode in the archive.</p>
              </div>
            )}

            {nextEpisode ? (
              <Link
                href={`/radio/${nextEpisode.slug}`}
                className="luxe-surface-dark rounded-xl p-5 border border-white/10 hover:border-primary/45 transition-colors lift-hover"
              >
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/55 mb-2">Next Episode</p>
                <p className="font-display text-2xl text-white leading-tight mb-2 uppercase">{nextEpisode.title}</p>
                <p className="text-sm text-white/65 mb-3">{nextEpisode.displayDate}</p>
                <p className="inline-flex items-center gap-2 text-primary text-sm font-semibold">
                  Open Episode
                  <ArrowRight className="w-4 h-4" />
                </p>
              </Link>
            ) : (
              <div className="luxe-surface-dark rounded-xl p-5 border border-white/10 opacity-65">
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/55 mb-2">Next Episode</p>
                <p className="text-sm text-white/70">You are on the latest published episode.</p>
              </div>
            )}
          </div>
        </motion.section>
      </main>

      <EntityBoostStrip tone="dark" className="pb-8" intent="listen-episode" episodeHref="#listen" />
    </div>
  );
}
