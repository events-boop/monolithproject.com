import { useEffect } from "react";
import { Link, useLocation, useParams } from "wouter";
import { motion } from "framer-motion";
import { Instagram, Globe, MapPin, Music } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
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
        <Footer />
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
      <SEO title={artist.name} description={artist.bio} />
      <Navigation />

      <section className="relative pt-44 md:pt-48 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-card to-background" />
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_12%_18%,rgba(224,90,58,0.18),transparent_34%),radial-gradient(circle_at_88%_20%,rgba(255,255,255,0.08),transparent_36%)]" />

        <div className="container max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-[360px_1fr] gap-10 items-end"
          >
            <div className="bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
              <div className="bg-zinc-100 p-3">
                <img
                  src={artist.image}
                  alt={artist.name}
                  loading="eager"
                  decoding="async"
                  className="w-full aspect-[3/4] object-cover"
                />
                <div className="flex items-center justify-between mt-3 text-[11px] font-mono tracking-wide text-zinc-600 uppercase">
                  <span>{artist.name}</span>
                  <span>{artist.role}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-3 py-1 border ${borderAccent} ${accentClass} text-xs font-mono tracking-widest uppercase`}>
                  {artist.role}
                </span>
                <span className={`text-xs font-mono tracking-widest uppercase ${accentClass}`}>
                  {primarySeries === "chasing-sunsets" ? "Sun(Sets)" : primarySeries === "sunsets-radio" ? "Sun(Sets) Radio" : "Untold Story"}
                </span>
              </div>

              <h1 className="font-display text-[clamp(3.2rem,9vw,8.5rem)] leading-[0.9] uppercase text-foreground mb-6">
                {artist.name}
              </h1>

              <div className="flex flex-wrap gap-6 text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6">
                <span className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> {artist.origin}
                </span>
                <span className="flex items-center gap-2">
                  <Music className="w-3 h-3" /> {artist.genre}
                </span>
              </div>

              <p className="text-muted-foreground max-w-2xl leading-relaxed mb-8">
                {heroBlurb}
              </p>

              <Link href={primaryAction.href} asChild>
                <a className="btn-pill-coral inline-flex">
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
                  className={`block w-full text-center py-4 mt-4 font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer ${
                    isWarmSeries
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

      <Footer />
    </div>
  );
}
