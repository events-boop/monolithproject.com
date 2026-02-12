import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Calendar, Clock, MapPin } from "lucide-react";
import { Link, useRoute } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SlimSubscribeStrip from "@/components/SlimSubscribeStrip";
import { getSeriesEvents, getSeriesProfile, type SeriesSlug } from "@/data/narrative";

const statusPill: Record<
  "on-sale" | "coming-soon" | "sold-out",
  { label: string; className: string; ctaLabel: string }
> = {
  "on-sale": {
    label: "On Sale",
    className: "border-emerald-200/40 text-emerald-200 bg-emerald-400/10",
    ctaLabel: "Get Tickets",
  },
  "coming-soon": {
    label: "Coming Soon",
    className: "border-amber-100/40 text-amber-100 bg-amber-300/10",
    ctaLabel: "Stay Ready",
  },
  "sold-out": {
    label: "Sold Out",
    className: "border-rose-200/40 text-rose-200 bg-rose-400/10",
    ctaLabel: "Join Waitlist",
  },
};

function buildArtistJourney(seriesSlug: SeriesSlug) {
  const profile = getSeriesProfile(seriesSlug);
  if (!profile) return [];
  const chapterEvents = getSeriesEvents(seriesSlug);
  return profile.keyArtists.map((name) => {
    const needle = name.toLowerCase();
    const appearances = chapterEvents.filter((event) =>
      `${event.title} ${event.headline || ""} ${event.lineup || ""}`.toLowerCase().includes(needle)
    ).length;
    return { name, appearances };
  });
}

function getEventCta(event: { status: "on-sale" | "coming-soon" | "sold-out"; ticketUrl?: string }) {
  if (event.status === "on-sale" && event.ticketUrl) {
    return { href: event.ticketUrl, label: statusPill[event.status].ctaLabel, external: true as const };
  }
  return { href: "/tickets", label: statusPill[event.status].ctaLabel, external: false as const };
}

export default function Series() {
  const [, params] = useRoute<{ slug: string }>("/series/:slug");
  const profile = getSeriesProfile(params?.slug || "");

  if (!profile) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <section className="pt-44 pb-24 px-6">
          <div className="container max-w-4xl mx-auto text-center">
            <p className="font-mono text-xs tracking-[0.22em] uppercase text-primary mb-4">Series Not Found</p>
            <h1 className="font-display text-5xl md:text-7xl mb-6">Narrative Missing</h1>
            <p className="text-muted-foreground mb-8">
              This story path does not exist yet. Explore the live chapters from the main Events page.
            </p>
            <Link href="/events">
              <a className="btn-pill-coral inline-flex">Open Events</a>
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const chapters = getSeriesEvents(profile.slug);
  const artistJourney = buildArtistJourney(profile.slug);

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: `radial-gradient(circle at 14% 16%, ${profile.colors.glow}40, transparent 36%),
          radial-gradient(circle at 84% 14%, ${profile.colors.accent}35, transparent 34%),
          linear-gradient(180deg, ${profile.colors.base} 0%, #090b18 100%)`,
      }}
    >
      <Navigation />

      <section className="pt-44 pb-14 px-6">
        <div className="container max-w-6xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="font-mono text-xs tracking-[0.24em] uppercase text-white/60 mb-5"
          >
            {profile.seasonLabel}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.04 }}
            className="font-display text-[clamp(3rem,11vw,7.6rem)] leading-[0.86] mb-5"
          >
            {profile.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="text-lg text-white/80 max-w-3xl mb-8"
          >
            {profile.tagline} {profile.description}
          </motion.p>

          <div className="flex flex-wrap gap-2">
            {profile.storyPillars.map((pillar) => (
              <span
                key={pillar}
                className="px-4 py-2 text-[10px] font-bold tracking-[0.18em] uppercase border border-white/25 rounded-full text-white/85"
              >
                {pillar}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-14">
        <div className="container max-w-6xl mx-auto grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 border border-white/20 rounded-2xl p-6 md:p-7 bg-white/5 backdrop-blur-md">
            <div className="flex items-end justify-between mb-6 pb-4 border-b border-white/15">
              <h2 className="font-display text-3xl md:text-4xl">Chapter Timeline</h2>
              <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/55">
                {chapters.length} Chapters
              </span>
            </div>

            <div className="space-y-4">
              {chapters.map((event, index) => {
                const cta = getEventCta(event);
                return (
                  <article key={event.id} className="border border-white/20 rounded-xl p-4 md:p-5 bg-black/20">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div>
                        <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/55 mb-2">
                          Chapter {String(index + 1).padStart(2, "0")}
                        </p>
                        <h3 className="font-display text-2xl md:text-3xl">{event.title}</h3>
                      </div>
                      <span
                        className={`px-3 py-1 text-[10px] font-bold tracking-[0.16em] uppercase border rounded-full ${
                          statusPill[event.status].className
                        }`}
                      >
                        {statusPill[event.status].label}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 text-sm mb-5">
                      <p className="flex items-center gap-2 text-white/80">
                        <Calendar className="w-4 h-4 text-white/45" />
                        <span>{event.date}</span>
                      </p>
                      <p className="flex items-center gap-2 text-white/80">
                        <Clock className="w-4 h-4 text-white/45" />
                        <span>{event.time}</span>
                      </p>
                      <p className="flex items-center gap-2 text-white/80 sm:col-span-2">
                        <MapPin className="w-4 h-4 text-white/45" />
                        <span>
                          {event.venue} · {event.location}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {cta.external ? (
                        <a
                          href={cta.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 border border-primary/65 text-primary rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-primary/10 transition-colors inline-flex items-center gap-2"
                        >
                          {cta.label}
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <Link href={cta.href}>
                          <a className="px-4 py-2 border border-primary/65 text-primary rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-primary/10 transition-colors inline-flex items-center gap-2">
                            {cta.label}
                          </a>
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-5">
            <div className="border border-white/20 rounded-2xl p-5 bg-white/5 backdrop-blur-md">
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/60 mb-3">Artist Journey</p>
              <div className="space-y-2">
                {artistJourney.map((artist) => (
                  <div key={artist.name} className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-white/85">{artist.name}</span>
                    <span className="font-mono text-xs text-white/55">{artist.appearances} chapters</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-white/20 rounded-2xl p-5 bg-white/5 backdrop-blur-md">
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/60 mb-3">Narrative Bridge</p>
              <p className="text-white/75 text-sm mb-5">
                Legacy format pages are still live while this story-driven model expands across all chapters.
              </p>
              <div className="flex flex-col gap-3">
                <Link href={profile.legacyPath}>
                  <a className="px-4 py-2 border border-white/25 rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:border-white/50 transition-colors inline-flex items-center justify-center gap-2">
                    Open Legacy Page
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </Link>
                <Link href="/events">
                  <a className="px-4 py-2 border border-clay/70 text-clay rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-clay/10 transition-colors inline-flex items-center justify-center gap-2">
                    All Events
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SlimSubscribeStrip title={`JOIN ${profile.shortTitle.toUpperCase()} DROPS`} source={`series_${profile.slug}_strip`} />
      <Footer />
    </div>
  );
}

