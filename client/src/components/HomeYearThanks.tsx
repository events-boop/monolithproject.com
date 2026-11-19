import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { ARTIST_ENTRIES } from "@/data/artists";
import GlyphRule, { Glyph } from "@/components/GlyphRule";

const postponedArtists = new Set(["joezi", "massuma"]);
const artists = [...ARTIST_ENTRIES].sort((a, b) =>
  a.name.localeCompare(b.name)
);
const venues = [
  "Castaways",
  "Kashmir Chicago",
  "Alhambra Palace",
  "La Sonesta",
  "Hideaway Chicago",
  "Bassment Chicago",
  "Mosaic Chicago",
  "J. Parker",
];

export default function HomeYearThanks() {
  return (
    <section
      id="thank-you-2026"
      className="home-year-thanks"
      aria-labelledby="year-thanks-title"
    >
      <div className="container layout-wide home-section-container">
        <div className="year-thanks-topline">
          <p className="home-eyebrow">Chicago / With love</p>
          <span className="home-eyebrow">The Monolith family</span>
        </div>
        <header className="year-thanks-heading">
          <h2 id="year-thanks-title">
            Thank you for
            <br />
            an amazing{" "}
            <span className="year-thanks-year">
              2026<span aria-hidden="true">.</span>
            </span>
          </h2>
          <p>
            To the artists. The rooms. The people who made them come alive.
            <br />
            You made this year ours.
          </p>
        </header>
        <div className="year-thanks-credits">
          <div className="year-thanks-label">
            <h3>
              <Glyph name="human" /> The artists
            </h3>
            <p>
              On the dance floor.
              <br />
              Across the airwaves.
            </p>
          </div>
          <div>
            <ul
              className="year-thanks-artists"
              aria-label="Monolith artist community"
            >
              {artists
                .filter(artist => !postponedArtists.has(artist.id))
                .map(artist => (
                  <li key={artist.id}>
                    <Link href={`/artists/${artist.id}`}>{artist.name}</Link>
                  </li>
                ))}
            </ul>
            <div className="year-thanks-still-to-come">
              <p>Our next dance is still ahead</p>
              <div>
                {artists
                  .filter(artist => postponedArtists.has(artist.id))
                  .map(artist => (
                    <Link key={artist.id} href={`/artists/${artist.id}`}>
                      {artist.name}
                    </Link>
                  ))}
              </div>
              <Link href="/tickets" className="year-thanks-postponed">
                Postponed show · Ticket-holder updates{" "}
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
        <div className="year-thanks-credits year-thanks-rooms">
          <div className="year-thanks-label">
            <h3>
              <Glyph name="place" /> The rooms
            </h3>
            <p>Our Chicago community.</p>
          </div>
          <ul aria-label="Venue community">
            {venues.map(venue => (
              <li key={venue}>{venue}</li>
            ))}
          </ul>
        </div>
        <GlyphRule />
        <footer className="year-thanks-footer">
          <p>
            And you.<span>Every dance floor starts with the people on it.</span>
          </p>
          <Link href="/archive" className="home-text-link">
            Relive the moments <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </footer>
      </div>
    </section>
  );
}
