import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import episodes from "@/data/openNetworkEpisodes.json";

export type NetworkEpisode = (typeof episodes)[number];
export const networkEpisodes = episodes;
export const networkSeries = [
  { id: "chasing", name: "Chasing SUN(SETS)", host: "A Monolith original" },
  { id: "karma-karma", name: "Karma Karma Radio", host: "With Shimza" },
  { id: "drumcode", name: "Drumcode Radio", host: "With Adam Beyer" },
];

export function episodeEmbed(episode: NetworkEpisode) {
  if (episode.provider === "mixcloud") {
    return (
      "https://www.mixcloud.com/widget/iframe/?" +
      new URLSearchParams({
        feed: new URL(episode.source).pathname,
        hide_cover: "1",
        light: "0",
        autoplay: "1",
      })
    );
  }
  return (
    "https://w.soundcloud.com/player/?" +
    new URLSearchParams({
      url: episode.source,
      color: "#d8b77e",
      auto_play: "true",
      visual: "false",
      hide_related: "true",
      show_comments: "false",
      show_user: "true",
      show_reposts: "false",
      show_teaser: "false",
      buying: "false",
      sharing: "false",
      download: "false",
    })
  );
}

interface RadioLibraryProps {
  selectedId: string;
  active: boolean;
  onSelect: (id: string, play?: boolean) => void;
  onStop: () => void;
}

export default function RadioLibrary({
  selectedId,
  active,
  onSelect,
  onStop,
}: RadioLibraryProps) {
  const episode = episodes.find(item => item.id === selectedId) ?? episodes[0];
  const [collection, setCollection] = useState(episode.collection);
  const [query, setQuery] = useState("");
  const [panel, setPanel] = useState<"episode" | "artist">("episode");
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState("Press play. Stay a while.");
  const shelf = useRef<HTMLDivElement>(null);
  const playButton = useRef<HTMLButtonElement>(null);
  const loadTimer = useRef<number | undefined>(undefined);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const items = episodes.filter(
    item =>
      item.collection === collection &&
      `${item.artist} ${item.title} ${item.profile.sound}`
        .toLowerCase()
        .includes(query.trim().toLowerCase())
  );
  const series = networkSeries.find(item => item.id === collection)!;

  useEffect(() => {
    setCollection(episode.collection);
    setPanel("episode");
  }, [episode.id, episode.collection]);
  useEffect(() => {
    if (!active) {
      setStatus("Press play. Stay a while.");
      return;
    }
    setStatus("Opening the episode…");
    loadTimer.current = window.setTimeout(
      () =>
        setStatus(
          "If the episode has not loaded, stop and retry, or open the original recording."
        ),
      16000
    );
    return () => window.clearTimeout(loadTimer.current);
  }, [active, episode.id]);

  function updateShelf() {
    const el = shelf.current;
    if (el) {
      setAtStart(el.scrollLeft <= 1);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
    }
  }
  useEffect(() => {
    shelf.current?.scrollTo({ left: 0, behavior: "instant" });
    updateShelf();
    const observer = new ResizeObserver(updateShelf);
    if (shelf.current) observer.observe(shelf.current);
    return () => observer.disconnect();
  }, [query, collection, expanded]);

  function switchSeries(id: string) {
    setCollection(id);
    setQuery("");
    setExpanded(false);
    onSelect(episodes.find(item => item.collection === id)!.id);
  }
  function tabKey(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? "episode"
        : event.key === "End"
          ? "artist"
          : panel === "episode"
            ? "artist"
            : "episode";
    setPanel(next);
    event.currentTarget
      .querySelector<HTMLButtonElement>(`#${next}-tab`)
      ?.focus();
  }
  function moveShelf(direction: number) {
    const el = shelf.current;
    el?.scrollBy({
      left: direction * el.clientWidth * 0.8,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  return (
    <section
      className="radio section-pad radio-refresh"
      id="radio"
      aria-labelledby="radio-title"
    >
      <div className="section-kicker">
        <span className="eyebrow">
          <span className="status-dot" />
          CHASING SUNSETS RADIO
        </span>
        <span>02 / 05</span>
      </div>
      <div className="radio-heading">
        <div>
          <h2 className="section-title" id="radio-title">
            Stay on the <em>frequency.</em>
          </h2>
          <p>
            A Monolith original, powered by sunsets.fm. Our collection and a
            wider world of independent voices.
          </p>
        </div>
        <div className="station-horizon">
          <span className="station-hours">24/7</span>
          <span>
            THE SUNSETS STATION<strong>Coming soon</strong>
          </span>
        </div>
      </div>
      <article
        className="radio-feature"
        id="listening-room"
        tabIndex={-1}
        aria-label="Selected radio episode"
      >
        <div className="feature-sleeve">
          <img
            src={episode.image}
            alt={`${episode.artist} — ${episode.title} cover`}
            width={1000}
            height={1000}
            loading="lazy"
          />
        </div>
        <div className="radio-profile">
          <div className="profile-topline">
            <span className="eyebrow">{episode.series}</span>
            <span className="edition-stamp">
              {episode.stamp ||
                (episode.episode
                  ? `EP. ${episode.episode.padStart(3, "0")}`
                  : "SPECIAL SESSION")}
            </span>
          </div>
          <h3>{episode.artist}</h3>
          <p className="profile-location">
            {episode.locationLabel ||
              `${episode.profile.location} · ${episode.profile.sound}`}
          </p>
          <div
            className="profile-tabs"
            role="tablist"
            aria-label="Episode information"
            onKeyDown={tabKey}
          >
            {(["episode", "artist"] as const).map(key => (
              <button
                key={key}
                type="button"
                id={`${key}-tab`}
                role="tab"
                aria-selected={panel === key}
                aria-controls={`${key}-panel`}
                tabIndex={panel === key ? 0 : -1}
                onClick={() => setPanel(key)}
              >
                The {key}
                {key === "artist" && <span aria-hidden="true">↗</span>}
              </button>
            ))}
          </div>
          <div
            className="profile-panel"
            id="episode-panel"
            role="tabpanel"
            aria-labelledby="episode-tab"
            hidden={panel !== "episode"}
            tabIndex={0}
          >
            <p>{episode.description}</p>
            <div className="episode-facts">
              <span>{episode.duration} / FULL MIX</span>
              <span>
                {new Intl.DateTimeFormat("en", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "UTC",
                }).format(new Date(episode.publishedAt + "T12:00:00Z"))}
              </span>
            </div>
          </div>
          <div
            className="profile-panel"
            id="artist-panel"
            role="tabpanel"
            aria-labelledby="artist-tab"
            hidden={panel !== "artist"}
            tabIndex={0}
          >
            <p>{episode.profile.bio}</p>
            <div className="artist-connections">
              {episode.profile.url && (
                <a
                  href={episode.profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {episode.profile.linkLabel} ↗
                </a>
              )}
              <a
                href={episode.profile.bioSource}
                target="_blank"
                rel="noopener noreferrer"
                title={episode.profile.bioCredit}
              >
                Bio source ↗
              </a>
            </div>
          </div>
          <div className="profile-credit">
            <span>CURATED BY {episode.publisher}</span>
            <a href={episode.source} target="_blank" rel="noopener noreferrer">
              Original recording ↗
            </a>
          </div>
        </div>
        <div className="player-deck">
          <div className="deck-label">
            <span>
              {active
                ? `${episode.provider} / EPISODE PLAYER`
                : "ON DEMAND / FULL EPISODE"}
            </span>
            <div className="frequency-band" aria-hidden="true">
              {Array.from({ length: 31 }, (_, i) => (
                <i
                  key={i}
                  style={{
                    height: `${3 + Math.abs(Math.sin(i * 1.21) * Math.cos(i * 0.47)) * 17}px`,
                  }}
                />
              ))}
            </div>
            {active && (
              <button
                id="stop-player"
                aria-label="Stop radio playback"
                onClick={() => {
                  onStop();
                  requestAnimationFrame(() => playButton.current?.focus());
                }}
              >
                Stop ■
              </button>
            )}
          </div>
          <div className="embed-slot">
            {active ? (
              <iframe
                key={episode.id}
                title={`${episode.artist} — ${episode.title} audio player`}
                src={episodeEmbed(episode)}
                allow="autoplay; encrypted-media"
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={() => {
                  window.clearTimeout(loadTimer.current);
                  setStatus(
                    "Player opened. Press play inside the player if needed."
                  );
                }}
              />
            ) : (
              <button
                ref={playButton}
                className="episode-play"
                aria-label={`Play ${episode.artist}, ${episode.title}`}
                onClick={() => onSelect(episode.id, true)}
              >
                <span className="episode-play-icon" aria-hidden="true">
                  ▶
                </span>
                <span>
                  Listen to the episode
                  <small>{episode.duration} · Plays here</small>
                </span>
              </button>
            )}
          </div>
          <p id="player-status" role="status">
            {status}
          </p>
        </div>
      </article>
      <div className="network-collections" aria-label="Radio collections">
        {networkSeries.map(item => (
          <button
            key={item.id}
            type="button"
            aria-pressed={collection === item.id}
            onClick={() => switchSeries(item.id)}
          >
            {item.name}
            <span>
              {episodes.filter(e => e.collection === item.id).length} mixes
            </span>
          </button>
        ))}
      </div>
      <div className="collection-bar">
        <div className="collection-title">
          <h3>{series.name}</h3>
          <span>{series.host}</span>
        </div>
        <div className="collection-tools">
          <label className="radio-search">
            <span className="visually-hidden">Search radio episodes</span>
            <input
              type="search"
              placeholder="Find an artist or episode"
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
          </label>
          <button
            className="archive-toggle"
            aria-pressed={expanded}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Compact view" : "Show all"}
          </button>
          {!expanded && (
            <div className="shelf-controls">
              <button
                aria-label="Previous episodes"
                disabled={atStart}
                onClick={() => moveShelf(-1)}
              >
                ←
              </button>
              <button
                aria-label="More episodes"
                disabled={atEnd}
                onClick={() => moveShelf(1)}
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        className={`radio-shelf${expanded ? " archive-expanded" : ""}`}
        ref={shelf}
        onScroll={updateShelf}
        aria-label="Choose a radio episode"
      >
        {items.map(item => (
          <button
            key={item.id}
            className="radio-sleeve"
            aria-label={`Explore ${item.artist}, ${item.title}`}
            aria-pressed={item.id === selectedId}
            onClick={() => {
              onSelect(item.id);
              const room = document.getElementById("listening-room");
              room?.scrollIntoView({ behavior: "instant", block: "start" });
              room?.focus({ preventScroll: true });
            }}
          >
            <span className="sleeve-image">
              <img
                src={item.imageSmall || item.image}
                alt={`${item.artist} — ${item.title} cover`}
                loading="lazy"
                width={640}
                height={640}
              />
              <span className="sleeve-arrow" aria-hidden="true">
                ↗
              </span>
            </span>
            <span className="sleeve-meta">
              <strong>{item.artist}</strong>
              <small>{item.title.replace("Chasing Sunsets · ", "")}</small>
            </span>
          </button>
        ))}
      </div>
      {items.length === 0 && (
        <p className="library-empty">
          No episodes found.{" "}
          <button onClick={() => setQuery("")}>Clear your search</button>
        </p>
      )}
      <div className="library-foot">
        <span role="status">
          {items.length} {items.length === 1 ? "episode" : "episodes"} in{" "}
          {series.name}
        </span>
        <p>Choose a sleeve. Meet the artist. Find your next frequency.</p>
      </div>
      <p className="credits">
        Chasing SUN(SETS) artwork by Monolith. Recordings and guest-series
        artwork remain credited to their artists and publishers. Curated from
        the SUNSETS.FM catalogue.
      </p>
    </section>
  );
}
