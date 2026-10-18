import { Link } from "wouter";
import { ArrowUpRight, Play } from "lucide-react";
import { HOME_ARTIST_DISCOVERY } from "@/data/homeArtistDiscovery";
import {
  sunsetsNeedsUpdate,
  sunsetsStatusLabel,
  sunsetsShowVisible,
  sunsetsDateLabel,
} from "@shared/events/sunsets-current";
import ResponsiveImage from "./ResponsiveImage";

export default function HomeArtists() {
  return (
    <section
      className="home-editorial-section home-artist-discovery"
      aria-labelledby="home-artists-title"
    >
      <div className="container layout-wide home-section-container">
        <header className="home-section-heading">
          <div>
            <p className="home-eyebrow">03 / Behind the sound</p>
            <h2 id="home-artists-title">Meet the artists.</h2>
            <p className="home-discovery-intro">
              A few names from our world. Find your next favorite set.
            </p>
          </div>
          <Link className="home-text-link" href="/artists">
            All artists
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </header>
        <div className="home-discovery-grid">
          {HOME_ARTIST_DISCOVERY.map(
            ({ artist, name, sound, introduction, listen, eventId }, index) => {
              const finale = eventId === "css-sep19";
              const appearanceLabel = finale
                ? `Sun(Sets) III · ${sunsetsDateLabel}`
                : "Sun(Sets) II · August 22, 2026";
              const appearanceStatus = finale
                ? sunsetsNeedsUpdate
                  ? sunsetsStatusLabel()
                  : sunsetsShowVisible()
                    ? "Event guide"
                    : "Past event"
                : "Past appearance";
              const appearanceHref = finale
                ? "/sunsets#event-update"
                : "/chasing-sunsets/sunsets-ii-2026";
              return (
                <article
                  className="home-discovery-card"
                  key={artist.id}
                  aria-labelledby={`discover-${artist.id}`}
                >
                  <Link
                    href={`/artists/${artist.id}`}
                    className="home-discovery-portrait"
                    aria-label={`Explore ${name}’s artist profile`}
                  >
                    <ResponsiveImage
                      src={artist.image}
                      alt={`${name} portrait`}
                      width={600}
                      height={750}
                      sizes="(min-width: 900px) 33vw, (min-width: 640px) 40vw, 100vw"
                      style={{
                        objectPosition: artist.imagePosition || "center 25%",
                      }}
                    />
                    <span className="home-discovery-index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="home-discovery-profile">
                      Artist profile
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </span>
                  </Link>
                  <div className="home-discovery-body">
                    <p className="home-discovery-sound">{sound}</p>
                    <h3 id={`discover-${artist.id}`}>
                      <Link href={`/artists/${artist.id}`}>{name}</Link>
                    </h3>
                    <p className="home-discovery-copy">{introduction}</p>
                    <a
                      className="home-discovery-listen"
                      href={listen.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${listen.action}: ${name}, ${listen.title} on ${listen.platform} (opens in a new tab)`}
                    >
                      <span className="home-discovery-play">
                        <Play
                          size={16}
                          fill="currentColor"
                          aria-hidden="true"
                        />
                      </span>
                      <span>
                        <strong>{listen.action}</strong>
                        <span>
                          {listen.title} · {listen.platform}
                        </span>
                      </span>
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </a>
                    <Link
                      className="home-discovery-appearance"
                      href={appearanceHref}
                    >
                      <span>
                        <span
                          className="home-discovery-status"
                          data-update={finale && sunsetsNeedsUpdate}
                        >
                          {appearanceStatus}
                        </span>
                        <strong>{appearanceLabel}</strong>
                      </span>
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}
