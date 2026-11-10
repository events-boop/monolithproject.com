import {
  SUNSETS_CANONICALS_LIVE,
  SUNSETS_EPISODE_URLS,
} from "@shared/seo/sunsets-radio";
import RadioDeckPlayer from "@/components/RadioDeckPlayer";
import "./radio-episode.css";
import { useEffect } from "react";
import { Link, useLocation, useParams } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import EntityBoostStrip from "@/components/EntityBoostStrip";
import {
  getLegacyRadioRedirect,
  getRadioEpisode,
  radioEpisodes,
} from "@/data/radioEpisodes";
import { CTA_LABELS } from "@/lib/cta";

function isExternalLink(url: string) {
  return /^https?:\/\//i.test(url) || url.startsWith("/go/");
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
  const [, setLocation] = useLocation();
  const episode = slug ? getRadioEpisode(slug) : undefined;
  const legacyRedirect = slug ? getLegacyRadioRedirect(slug) : undefined;
  const episodeIndex = episode
    ? radioEpisodes.findIndex(entry => entry.slug === episode.slug)
    : -1;
  const previousEpisode =
    episodeIndex > 0 ? radioEpisodes[episodeIndex - 1] : undefined;
  const nextEpisode =
    episodeIndex >= 0 && episodeIndex < radioEpisodes.length - 1
      ? radioEpisodes[episodeIndex + 1]
      : undefined;
  const sunsetsUrl = episode
    ? (SUNSETS_EPISODE_URLS[episode.slug] ?? episode.sunsetsUrl)
    : undefined;
  const cover = episode ? episode.coverImage || episode.image : "";
  const episodeJumpLinks = [
    { href: "#listen", label: "Listen" },
    { href: "#tracklist", label: "Tracklist" },
    { href: "#story", label: "Story" },
    { href: "#guest-links", label: "Guest Links" },
  ];

  useEffect(() => {
    if (!slug || episode || !legacyRedirect) return;
    setLocation(legacyRedirect, { replace: true });
  }, [episode, legacyRedirect, setLocation, slug]);

  if (!episode && legacyRedirect) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SEO
          title="Redirecting To The Current Monolith Page"
          description="This legacy radio URL has moved to a current Monolith page."
          canonicalPath={legacyRedirect}
        />
        <Navigation />
        <main
          id="main-content"
          tabIndex={-1}
          className="page-shell-start pb-24 px-6"
        >
          <section className="container layout-narrow text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-4">
              Legacy Link Redirect
            </p>
            <h1 className="font-display text-[clamp(2.5rem,7vw,4.8rem)] uppercase mb-5">
              Redirecting
            </h1>
            <p className="text-muted-foreground mb-8">
              This older radio URL now points to the current Monolith page for
              that artist or series.
            </p>
            <Link href={legacyRedirect} className="btn-pill-radio">
              Continue
            </Link>
          </section>
        </main>
        <EntityBoostStrip tone="dark" className="pb-8" />
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SEO
          title="Radio Episode Not Found"
          description="The requested Chasing Sun(Sets) Radio Show episode was not found."
          canonicalPath="/radio"
        />
        <Navigation />
        <main
          id="main-content"
          tabIndex={-1}
          className="page-shell-start pb-24 px-6"
        >
          <section className="container layout-narrow text-center">
            <h1 className="font-display text-[clamp(2.7rem,7vw,5rem)] uppercase mb-5">
              Episode Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              This radio episode URL does not exist. Visit the official radio
              archive for available episodes.
            </p>
            <Link href="/radio" className="btn-pill-radio">
              {CTA_LABELS.radioHub}
            </Link>
          </section>
        </main>
        <EntityBoostStrip tone="dark" className="pb-8" />
      </div>
    );
  }

  return (
    <div className="radio-episode-page min-h-screen bg-background text-foreground">
      <SEO
        title={`Chasing Sunsets Radio | ${episode.shortCode} ${episode.guest}`}
        description={`Listen to ${episode.guest}'s Chasing Sunsets Radio mix from The Monolith Project, powered by sunsets.fm. Tracklist, story, and direct listening links.`}
        absoluteTitle
        canonicalPath={`/radio/${episode.slug}`}
        canonicalUrl={
          SUNSETS_CANONICALS_LIVE
            ? SUNSETS_EPISODE_URLS[episode.slug]
            : undefined
        }
        image={cover}
      />
      <Navigation />

      <main
        id="main-content"
        tabIndex={-1}
        className="page-shell-start pb-24 px-6"
      >
        <motion.section className="container layout-default" {...sectionReveal}>
          <Link href="/radio" className="episode-back">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Chasing Sunsets Radio
          </Link>
          <div className="episode-hero">
            <figure className="episode-cover">
              <img
                src={cover}
                alt={`${episode.guest} — ${episode.title} cover art`}
                width={1000}
                height={1000}
              />
            </figure>
            <div className="episode-hero-copy">
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-primary">
                {episode.shortCode} · {episode.displayDate}
              </p>
              <h1 className="episode-title font-display uppercase">
                {episode.title}
              </h1>
              <p className="episode-guest">Guest: {episode.guest}</p>
              <p className="mt-2 text-sm text-[#E8B86D]">
                Chasing Sunsets Radio · powered by{" "}
                <Link
                  href="/sunsets-fm"
                  className="underline underline-offset-4"
                >
                  sunsets.fm
                </Link>
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <span className="episode-chip">
                  Duration · {episode.duration}
                </span>
                <span className="episode-chip">
                  {episode.tracklist.length > 0
                    ? `${episode.tracklist.length} Tracks Listed`
                    : "Tracklist to come"}
                </span>
              </div>

              <div id="listen" className="episode-deck scroll-shell-target">
                <h2 className="sr-only">Listen</h2>
                <RadioDeckPlayer
                  key={episode.slug}
                  slug={episode.slug}
                  title={episode.title}
                  artist={episode.guest}
                  src={episode.embedUrl}
                  sourceUrl={episode.audioUrl}
                  duration={episode.duration}
                />
              </div>

              {sunsetsUrl && (
                <a
                  href={sunsetsUrl}
                  className="btn-pill-sunsets mt-5 inline-flex max-w-full items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  Listen on SUNSETS.FM →
                </a>
              )}
            </div>
          </div>
        </motion.section>

        <motion.section
          className="container layout-default mt-7"
          {...sectionReveal}
        >
          <nav
            className="season-panel-nocturne p-2.5 flex flex-wrap gap-2"
            aria-label="Episode quick navigation"
          >
            {episodeJumpLinks.map(item => (
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

        <div className="container layout-default episode-columns">
          <motion.section
            id="tracklist"
            className="scroll-shell-target"
            {...sectionReveal}
          >
            <h2 className="font-display text-3xl uppercase mb-4">Tracklist</h2>
            <div className="border border-border/70 rounded-xl bg-card/40 luxe-surface-dark">
              {episode.tracklist.length === 0 && (
                <p className="px-5 py-5 text-sm text-white/70">
                  The tracklist for this episode has not been published yet.
                </p>
              )}
              {episode.tracklist.map((track, index) => (
                <div
                  key={`${track.timecode}-${track.artist}-${track.title}`}
                  className={`episode-track ${index % 2 === 0 ? "bg-white/[0.015]" : ""}`}
                >
                  <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/60">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="font-mono text-xs tracking-[0.2em] uppercase text-primary">
                    {track.timecode}
                  </p>
                  <p className="text-sm text-white/90">
                    <span className="font-semibold">{track.artist}</span> -{" "}
                    {track.title}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          <div>
            <motion.section
              id="story"
              className="scroll-shell-target"
              {...sectionReveal}
            >
              <h2 className="font-display text-3xl uppercase mb-4">
                Episode Story
              </h2>
              <article className="border border-border/70 rounded-xl p-6 bg-card/40 space-y-4 text-muted-foreground leading-relaxed luxe-surface-dark">
                {episode.narrative.split("\n\n").map(paragraph => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </article>
            </motion.section>

            <motion.section
              id="guest-links"
              className="mt-10 scroll-shell-target"
              {...sectionReveal}
            >
              <h2 className="font-display text-3xl uppercase mb-4">
                Guest Links
              </h2>
              <div className="flex flex-wrap gap-3">
                {episode.guestLinks.map(link =>
                  isExternalLink(link.url) ? (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pill-monolith"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.url}
                      className="btn-pill-monolith"
                    >
                      {link.label}
                    </Link>
                  )
                )}
                <Link href="/tickets" className="btn-pill-radio">
                  {CTA_LABELS.tickets}
                </Link>
              </div>
              <p className="text-sm text-muted-foreground mt-6 max-w-3xl">
                Chasing Sun(Sets) is a Chicago-based sunset house music event
                series and radio show by The Monolith Project. For
                disambiguation details, review{" "}
                <Link
                  href="/chasing-sunsets-facts"
                  className="btn-inline-pill btn-inline-pill-radio"
                >
                  Official Chasing Sun(Sets) Identity
                </Link>
                .
              </p>
            </motion.section>
          </div>
        </div>

        <motion.section
          className="container layout-default mt-12"
          {...sectionReveal}
        >
          <h2 className="font-display text-2xl md:text-3xl uppercase mb-5">
            Continue Listening
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                entry: previousEpisode,
                label: "Previous Episode",
                empty: "This is the first available episode in the archive.",
                back: true,
              },
              {
                entry: nextEpisode,
                label: "Next Episode",
                empty: "You are on the latest published episode.",
                back: false,
              },
            ].map(({ entry, label, empty, back }) =>
              entry ? (
                <Link
                  key={label}
                  href={`/radio/${entry.slug}`}
                  className="episode-next luxe-surface-dark lift-hover"
                >
                  <img
                    src={entry.coverImage || entry.image}
                    alt=""
                    width={160}
                    height={160}
                    loading="lazy"
                  />
                  <span>
                    <span className="block font-mono text-[11px] tracking-[0.2em] uppercase text-white/70 mb-2">
                      {label}
                    </span>
                    <span className="block font-display text-xl text-white leading-tight mb-1 uppercase">
                      {entry.title}
                    </span>
                    <span className="block text-sm text-white/60 mb-3">
                      {entry.guest} · {entry.displayDate}
                    </span>
                    <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold">
                      {back && <ArrowLeft className="w-4 h-4" />}
                      Open Episode
                      {!back && <ArrowRight className="w-4 h-4" />}
                    </span>
                  </span>
                </Link>
              ) : (
                <div
                  key={label}
                  className="episode-next luxe-surface-dark opacity-65"
                >
                  <span>
                    <span className="block font-mono text-[11px] tracking-[0.2em] uppercase text-white/70 mb-2">
                      {label}
                    </span>
                    <span className="block text-sm text-white/70">{empty}</span>
                  </span>
                </div>
              )
            )}
          </div>
        </motion.section>
      </main>

      <EntityBoostStrip
        tone="dark"
        className="pb-8"
        intent="listen-episode"
        episodeHref="#listen"
      />
    </div>
  );
}
