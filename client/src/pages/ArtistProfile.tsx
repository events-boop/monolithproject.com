import { useEffect } from "react";
import { Link, useLocation, useParams } from "wouter";
import { motion } from "framer-motion";
import { Instagram, Globe, MapPin, Music } from "lucide-react";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import EntityBoostStrip from "@/components/EntityBoostStrip";
import { ARTISTS } from "@/data/artists";

const LEGACY_ID_MAP: Record<string, string> = {
  "1": "haai",
  "3": "lazare",
  "4": "chus",
  "5": "autograf",
  // Backward compatible artist slug
  "joezi": "chus",
};

function resolveArtistId(id: string | undefined) {
  if (!id) return undefined;
  if (ARTISTS[id]) return id;
  const legacy = LEGACY_ID_MAP[id];
  if (legacy && ARTISTS[legacy]) return legacy;
  return undefined;
}

export default function ArtistProfile() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const resolvedId = resolveArtistId(id);
  const artist = resolvedId ? ARTISTS[resolvedId] : undefined;
  const canonicalArtistPath = resolvedId ? `/artists/${resolvedId}` : id ? `/artists/${id}` : "/lineup";

  // If someone hits a legacy slug like `/artists/joezi`, rewrite to canonical.
  useEffect(() => {
    if (!id || !resolvedId) return;
    if (id === resolvedId) return;
    setLocation(`/artists/${resolvedId}`, { replace: true });
  }, [id, resolvedId, setLocation]);

  if (!artist) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SEO
          title="Artist Not Found"
          description="We couldn't find that artist profile. View the full lineup to continue exploring The Monolith Project."
          canonicalPath={canonicalArtistPath}
        />
        <Navigation />
        <section className="pt-48 pb-24 px-6">
          <div className="container max-w-3xl mx-auto text-center">
            <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-4">Artist</p>
            <h1 className="font-display text-[clamp(3rem,9vw,6rem)] leading-[0.9] uppercase mb-6">Profile Not Found</h1>
            <p className="text-muted-foreground mb-8">We couldn't find that artist profile. View the full lineup to continue.</p>
            <Link href="/lineup" asChild>
              <a className="btn-pill-coral inline-flex">View Lineup</a>
            </Link>
          </div>
        </section>
        <EntityBoostStrip tone="dark" className="pb-8" />
      </div>
    );
  }

  const primarySeries = artist.series[0];
  const isWarmSeries = primarySeries !== "untold-story";
  const accentClass = isWarmSeries ? "text-clay" : "text-primary";
  const borderAccent = isWarmSeries ? "border-clay" : "border-primary";
  const bgAccent = isWarmSeries ? "bg-clay/5" : "bg-primary/5";

  const heroBlurb = (() => {
    const match = artist.bio.match(/^(.+?[.!?])\s/);
    return match ? match[1] : artist.bio;
  })();

  const eventDetails = isWarmSeries
    ? { date: "August 22, 2026", venue: "TBA", location: "Chicago, IL" }
    : { date: "March 6, 2026", venue: "Alhambra Palace", location: "Chicago, IL" };

  const primaryAction =
    primarySeries === "untold-story"
      ? { href: "/tickets", label: "View Event Tickets" }
      : primarySeries === "chasing-sunsets"
        ? { href: "/chasing-sunsets", label: "Explore Sun(Sets)" }
        : { href: "/radio", label: "Listen on Radio" };

  const sidebarAction =
    primarySeries === "untold-story"
      ? { href: "/tickets", label: "Get Tickets" }
      : primarySeries === "chasing-sunsets"
        ? { href: "/schedule", label: "View Schedule" }
        : { href: "/radio", label: "Listen" };

  const socials = [
    { key: "instagram", href: artist.socials.instagram, label: "Instagram", Icon: Instagram },
    { key: "website", href: artist.socials.website, label: "Website", Icon: Globe },
  ].filter((s) => typeof s.href === "string" && s.href.length > 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title={artist.name} description={artist.bio} canonicalPath={canonicalArtistPath} />
      <Navigation />

      <section className="relative min-h-[75vh] flex flex-col justify-end pb-20 px-6 overflow-hidden pt-44">
        {/* Full Bleed Profile Image */}
        <div className="absolute inset-0 z-0 bg-black/50">
          <img
            src={artist.image}
            alt={artist.name}
            className="w-full h-full object-cover object-top opacity-60"
          />
          {/* Gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          {/* Top gradient for navbar */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />
        </div>

        <div className="container max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-5">
              <span className="px-3 py-1 border border-white/20 text-white text-[10px] font-mono tracking-[0.2em] uppercase backdrop-blur-md bg-black/30 rounded-full">
                {artist.role}
              </span>
              <span className={`text-[10px] font-mono tracking-[0.2em] uppercase ${accentClass}`}>
                {primarySeries === "chasing-sunsets" ? "Sun(Sets)" : primarySeries === "sunsets-radio" ? "Sun(Sets) Radio" : "Untold Story"}
              </span>
            </div>

            <h1 className="font-display text-[clamp(4rem,11vw,9.5rem)] leading-[0.85] uppercase text-white mb-6 drop-shadow-2xl">
              {artist.name}
            </h1>

            <div className="flex flex-wrap gap-6 text-[10px] font-mono text-white/80 uppercase tracking-[0.2em] mb-8">
              <span className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/5">
                <MapPin className="w-3 h-3 text-white/50" /> {artist.origin}
              </span>
              <span className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/5">
                <Music className="w-3 h-3 text-white/50" /> {artist.genre}
              </span>
            </div>

            <p className="text-white/90 max-w-2xl text-lg md:text-xl leading-relaxed mb-10 drop-shadow-lg font-light">
              {heroBlurb}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href={primaryAction.href} asChild>
                <a className={`px-10 py-4 font-bold tracking-widest text-xs uppercase transition-all rounded-full flex items-center gap-2 ${isWarmSeries
                    ? "bg-clay text-[#1A0E08] hover:bg-white"
                    : "bg-primary text-primary-foreground hover:bg-white hover:text-black"
                  }`}>
                  {primaryAction.label}
                </a>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-12">
          <section>
            <h3 className="font-display text-2xl text-foreground mb-4 uppercase">About</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {artist.bio}
            </p>

            <div className="flex gap-3 mt-6 flex-wrap">
              {artist.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 border border-border text-xs font-mono tracking-widest uppercase text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            {socials.length > 0 && (
              <div className="flex gap-3 mt-6">
                {socials.map(({ key, href, label, Icon }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                    aria-label={`${artist.name} ${label}`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </section>

          <section>
            <h3 className="font-display text-2xl text-foreground mb-6 uppercase">Selected Tracks</h3>
            <div className="border-t border-border">
              {artist.tracks.map((track, i) => (
                <div
                  key={`${artist.name}-${track.title}`}
                  className="group flex items-center justify-between py-4 border-b border-border hover:text-primary transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground font-mono text-sm w-6">
                      {(i + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="text-foreground group-hover:text-primary transition-colors">
                      {track.title}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">
                    {track.duration}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className={`p-8 border ${borderAccent} ${bgAccent}`}>
            <p className="ui-kicker text-muted-foreground mb-2">Next Ritual</p>
            <h4 className={`font-display text-xl ${accentClass} mb-6 uppercase`}>
              {primarySeries === "chasing-sunsets" ? "Chasing Sun(Sets)" : primarySeries === "sunsets-radio" ? "Sun(Sets) Radio" : "Untold Story"}
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-4">
                <span className="text-muted-foreground uppercase tracking-widest text-xs font-mono">Date</span>
                <span className="text-foreground">{eventDetails.date}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-4">
                <span className="text-muted-foreground uppercase tracking-widest text-xs font-mono">Location</span>
                <span className="text-foreground">{eventDetails.location}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-4">
                <span className="text-muted-foreground uppercase tracking-widest text-xs font-mono">Venue</span>
                <span className="text-foreground">{eventDetails.venue}</span>
              </div>

              <Link href={sidebarAction.href} asChild>
                <a
                  className={`block w-full text-center py-4 mt-4 font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer ${isWarmSeries
                      ? "bg-clay text-background hover:bg-foreground"
                      : "bg-primary text-primary-foreground hover:bg-foreground"
                    }`}
                >
                  {sidebarAction.label}
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <EntityBoostStrip tone="dark" className="pb-8" />
    </div>
  );
}
