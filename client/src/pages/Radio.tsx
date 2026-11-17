import WorldEtching from "@/components/WorldEtching";
import { lazy, Suspense, useMemo, useState } from "react";
import { ArrowRight, Play, Search } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import ResponsiveImage from "@/components/ResponsiveImage";
import RadioDeckPlayer from "@/components/RadioDeckPlayer";
import { useOptionalGlobalAudio } from "@/contexts/AudioContext";
import { radioEpisodes } from "@/data/radioEpisodes";
import { ROUTES } from "@shared/routes";
import "./radio-editorial.css";

const GlobalListenerMap = lazy(() => import("@/components/GlobalListenerMap"));
type Filter = "all" | "sunsets" | "crossovers";
const crossoverSlugs = new Set(["ch-02-radian-no-sleep", "ep-04-radian"]);

export default function Radio() {
  const audio = useOptionalGlobalAudio();
  const [selected, setSelected] = useState(
    () =>
      radioEpisodes.find(episode => episode.slug === audio?.activeTrack?.slug)
        ?.slug ?? radioEpisodes[0]?.slug
  );
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [showMap, setShowMap] = useState(false);
  const episode =
    radioEpisodes.find(entry => entry.slug === selected) ?? radioEpisodes[0];
  const filtered = useMemo(
    () =>
      radioEpisodes.filter(entry => {
        const lane = crossoverSlugs.has(entry.slug) ? "crossovers" : "sunsets";
        return (
          (filter === "all" || lane === filter) &&
          `${entry.guest} ${entry.title} ${entry.shortCode}`
            .toLocaleLowerCase()
            .includes(query.trim().toLocaleLowerCase())
        );
      }),
    [filter, query]
  );
  if (!episode) return null;

  const choose = (slug: string) => {
    setSelected(slug);
    document.getElementById("radio-featured")?.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    // Selecting a record does not interrupt the current recording. The deck's
    // play control makes the explicit, user-initiated playback handoff.
    window.requestAnimationFrame(() =>
      document
        .querySelector<HTMLButtonElement>(".radio-editorial .radio-deck-play")
        ?.focus({ preventScroll: true })
    );
  };

  return (
    <div className="radio-editorial min-h-screen">
      <SEO
        title="Chasing Sunsets Radio — powered by sunsets.fm | Monolith"
        absoluteTitle
        description="Guest mixes, late-night sessions, and the sound between shows. Listen to Chasing Sunsets Radio from The Monolith Project."
        canonicalPath="/radio"
      />
      <Navigation brand="monolith" />
      <main id="main-content" tabIndex={-1}>
        <header className="radio-editorial-heading radio-width">
          <WorldEtching />
          <div className="radio-topline">
            <span>A Monolith original</span>
            <Link href={ROUTES.sunsetsFM}>
              Powered by sunsets.fm <ArrowRight size={14} />
            </Link>
          </div>
          <h1>
            <span className="radio-title-brand">Chasing Sunsets</span>
            <span>Radio.</span>
          </h1>
          <p>The sound between shows. Find a session. Stay a while.</p>
        </header>
        <section
          id="radio-featured"
          className="radio-feature radio-width scroll-shell-target"
          aria-label="Featured recording"
        >
          <Link
            href={`/radio/${episode.slug}`}
            className="radio-feature-cover"
            aria-label={`Read about ${episode.guest}: ${episode.title}`}
          >
            <ResponsiveImage
              src={episode.coverImage || episode.image}
              alt={`${episode.guest} — ${episode.title} cover`}
              priority
              sizes="(min-width: 800px) 360px, 128px"
              className="w-full h-full object-cover"
            />
          </Link>
          <div className="radio-feature-copy">
            <p className="radio-kicker">
              Selected session / {episode.shortCode}
            </p>
            <h2>{episode.guest}</h2>
            <p className="radio-feature-title">{episode.title}</p>
            <p className="radio-feature-summary">{episode.summary}</p>
            <Link className="radio-text-link" href={`/radio/${episode.slug}`}>
              Story &amp; guest links <ArrowRight size={16} />
            </Link>
          </div>
          <div className="radio-feature-deck">
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
        </section>
        <section
          id="radio-archive"
          className="radio-library radio-width scroll-shell-target"
          aria-labelledby="radio-library-title"
        >
          <div className="radio-library-heading">
            <div>
              <p className="radio-kicker">The collection</p>
              <h2 id="radio-library-title">Find your frequency.</h2>
            </div>
            <span>{radioEpisodes.length} sessions</span>
          </div>
          <div className="radio-library-tools">
            <div className="radio-filters" aria-label="Filter episodes">
              {(
                [
                  { value: "all", label: "All sessions" },
                  { value: "sunsets", label: "Sunset cuts" },
                  { value: "crossovers", label: "Late-night bridges" },
                ] as const
              ).map(option => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={filter === option.value}
                  onClick={() => setFilter(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <label className="radio-search">
              <Search size={17} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Artist or episode"
                aria-label="Search radio episodes"
              />
            </label>
          </div>
          <p className="sr-only" role="status">
            {filtered.length} sessions found
          </p>
          <div className="radio-records">
            {filtered.map((entry, index) => (
              <article
                key={entry.slug}
                className={`radio-record${entry.slug === selected ? " is-selected" : ""}`}
              >
                <span className="radio-record-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Link
                  href={`/radio/${entry.slug}`}
                  className="radio-record-art"
                  aria-label={`${entry.guest}: ${entry.title}`}
                >
                  <ResponsiveImage
                    src={entry.coverImage || entry.image}
                    alt=""
                    loading="lazy"
                    sizes="80px"
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="radio-record-info">
                  <p className="radio-record-code">{entry.shortCode}</p>
                  <h3>
                    <Link href={`/radio/${entry.slug}`}>{entry.guest}</Link>
                  </h3>
                  <p>{entry.title}</p>
                </div>
                <span className="radio-record-duration">{entry.duration}</span>
                <button
                  type="button"
                  onClick={() => choose(entry.slug)}
                  className="radio-record-select"
                  aria-label={`Select ${entry.guest}: ${entry.title} in the player`}
                >
                  <Play size={18} aria-hidden="true" />
                  <span>Listen</span>
                </button>
              </article>
            ))}
            {filtered.length === 0 && (
              <div className="radio-empty">
                <p>No sessions match that search.</p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setFilter("all");
                  }}
                >
                  Show all sessions
                </button>
              </div>
            )}
          </div>
        </section>
        <section id="radio-map" className="radio-network radio-width">
          <div>
            <p className="radio-kicker">Chicago, and beyond</p>
            <h2>Keep the connection.</h2>
            <p>
              Chasing Sunsets Radio is where the listening starts. Explore the
              artists, places, and ideas behind the wider SUNSETS.FM network.
            </p>
            <Link href={ROUTES.openNetwork} className="radio-text-link">
              Explore the Open Network <ArrowRight size={18} />
            </Link>
          </div>
          <div className="radio-network-actions">
            <Link href="/newsletter#radio-updates">
              New sessions in your inbox <ArrowRight size={18} />
            </Link>
            <Link href="/submit">
              Share a mix with us <ArrowRight size={18} />
            </Link>
            <button
              type="button"
              aria-expanded={showMap}
              aria-controls="radio-city-map"
              onClick={() => setShowMap(value => !value)}
            >
              {showMap ? "Close city map" : "Explore the city map"}{" "}
              <span aria-hidden="true">{showMap ? "−" : "+"}</span>
            </button>
          </div>
          {showMap && (
            <div id="radio-city-map" className="radio-city-map">
              <p>
                Places in our listening world. This is an editorial map, not a
                live listener count.
              </p>
              <Suspense fallback={<p>Loading map…</p>}>
                <GlobalListenerMap />
              </Suspense>
            </div>
          )}
        </section>
        <section
          id="radio-faq"
          className="radio-faq radio-width"
          aria-labelledby="radio-faq-title"
        >
          <h2 id="radio-faq-title">A few listening notes.</h2>
          <details>
            <summary>When do new sessions arrive?</summary>
            <p>
              New recordings join the archive as they are ready. Join the radio
              list for release updates.
            </p>
          </details>
          <details>
            <summary>Can I submit a mix?</summary>
            <p>
              Yes. <Link href="/submit">Send a private listening link</Link> and
              a little context about your sound.
            </p>
          </details>
          <details>
            <summary>Can I keep listening as I explore?</summary>
            <p>
              Playback follows you between Monolith pages. SoundCloud provides
              the audio; an external link is always available in the player.
            </p>
          </details>
        </section>
      </main>
    </div>
  );
}
