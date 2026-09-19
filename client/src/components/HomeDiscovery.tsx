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
import ChasingSunsetsLogo from "./ChasingSunsetsLogo";

function SectionHeading({
  number,
  label,
  title,
  href,
  action,
}: {
  number: string;
  label: string;
  title: string;
  href?: string;
  action?: string;
}) {
  return (
    <header className="home-section-heading">
      <div>
        <p className="home-eyebrow">
          {number} / {label}
        </p>
        <h2>{title}</h2>
      </div>
      {href && (
        <Link className="home-text-link" href={href}>
          {action}
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      )}
    </header>
  );
}

export function HomeSeries() {
  return (
    <section
      id="platform"
      className="home-editorial-section"
      aria-labelledby="home-series-title"
    >
      <div className="container layout-wide home-section-container">
        <header className="home-section-heading">
          <div>
            <p className="home-eyebrow">02 / Our series</p>
            <h2 id="home-series-title">From daylight to after dark.</h2>
          </div>
          <Link className="home-text-link" href="/monolith">
            About Monolith <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </header>
        <div className="home-series-grid">
          <Link
            href="/chasing-sunsets"
            className="home-series-card home-series-day"
            aria-label="Explore Chasing Sun(Sets)"
          >
            <ResponsiveImage
              src="/images/chasing-sunsets-castaways-hero.png"
              alt="Castaways on Chicago’s lakefront at sunset"
              width={1600}
              height={874}
              sizes="(min-width: 768px) 50vw, 100vw"
            />
            <div className="home-series-caption">
              <p className="home-eyebrow">Open air / By the lake</p>
              <ChasingSunsetsLogo className="home-series-logo" />
              <p>House music. Lake Michigan. Golden hour.</p>
              <span className="home-series-action">
                Explore Sun(Sets) <ArrowUpRight size={20} aria-hidden="true" />
              </span>
            </div>
          </Link>
          <Link
            href="/story"
            className="home-series-card home-series-night"
            aria-label="Explore Untold Story"
          >
            <ResponsiveImage
              src="/images/untold-story/header-jpq-9379.jpg"
              alt="The crowd gathered around the DJ booth at an Untold Story night"
              width={1920}
              height={1280}
              sizes="(min-width: 768px) 50vw, 100vw"
            />
            <div className="home-series-caption">
              <p className="home-eyebrow">After dark / In the room</p>
              <h3>
                UNTOLD
                <br />
                STORY
              </h3>
              <p>Deeper sound. A closer dance floor.</p>
              <span className="home-series-action">
                Explore Untold Story{" "}
                <ArrowUpRight size={20} aria-hidden="true" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomeRecap() {
  return (
    <section
      id="featured"
      className="home-editorial-section home-recap-section"
      aria-label="From the archive"
    >
      <div className="container layout-wide home-section-container">
        <SectionHeading
          number="03"
          label="From the archive"
          title="You had to be there."
          href="/archive"
          action="Explore the archive"
        />
        <div className="home-recap-grid">
          <a
            href="https://www.youtube.com/watch?v=9R6XH7JZlJI"
            target="_blank"
            rel="noopener noreferrer"
            className="home-recap-film"
            aria-label="Watch Autograf live at Castaways on YouTube, opens in a new tab"
          >
            <img
              src="/sunsets/assets/youtube-recap.jpg"
              alt="Autograf live at Castaways"
              width={1280}
              height={720}
              loading="lazy"
              decoding="async"
            />
            <span className="home-recap-play">
              <Play size={28} fill="currentColor" aria-hidden="true" />
            </span>
            <span className="home-recap-watch">
              Watch the full set <ArrowUpRight size={18} aria-hidden="true" />
            </span>
          </a>
          <div className="home-recap-copy">
            <p className="home-eyebrow">Chasing Sun(Sets) / Live recording</p>
            <h3>
              Autograf.
              <br />
              On the lake.
            </h3>
            <p>
              A Chicago summer afternoon, captured from the dance floor. Revisit
              the full set at Castaways.
            </p>
            <dl>
              <div>
                <dt>Location</dt>
                <dd>Castaways · Chicago</dd>
              </div>
              <div>
                <dt>Format</dt>
                <dd>Full DJ set</dd>
              </div>
            </dl>
            <Link
              href="/chasing-sunsets/sunsets-i-2026"
              className="home-text-link"
            >
              Relive Chapter One <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeArtists() {
  return (
    <section
      id="showcase"
      className="home-editorial-section home-artist-discovery"
      aria-labelledby="home-artists-title"
    >
      <div className="container layout-wide home-section-container">
        <header className="home-section-heading">
          <div>
            <p className="home-eyebrow">04 / Behind the sound</p>
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

export function HomeCommunity() {
  return (
    <section
      id="community"
      className="home-editorial-section home-community-section"
    >
      <div className="container layout-wide home-section-container">
        <div className="home-community-grid">
          <div>
            <p className="home-eyebrow">05 / Make something happen</p>
            <h2>
              Bring your people.
              <br />
              We’ll build the moment.
            </h2>
          </div>
          <div>
            <p>
              Venues, brands, artists and collaborators—let’s create the next
              Monolith experience together.
            </p>
            <div className="home-actions">
              <Link href="/partners" className="home-primary">
                Partner with us <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/contact" className="home-secondary">
                Get in touch <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
        <div className="home-venue-credits">
          <p className="home-eyebrow">The places we come together</p>
          <ul aria-label="Venue partners">
            {[
              "Castaways",
              "Kashmir Chicago",
              "La Sonesta",
              "Hideaway Chicago",
              "Bassment Chicago",
              "Mosaic Chicago",
              "J. Parker",
            ].map(name => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
