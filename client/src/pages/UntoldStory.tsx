import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import ResponsiveImage from "@/components/ResponsiveImage";
import UntoldButterflyLogo from "@/components/UntoldButterflyLogo";
import ConversionCTA from "@/components/ConversionCTA";
import { publishedArchiveEntries } from "@/data/archiveEntries";
import { ARTIST_ENTRIES } from "@/data/artists";
import { INSTAGRAM_UNTOLD } from "@/data/events";
import { untoldFaqs } from "@/components/untold-story/constants";
import { getResponsiveImage } from "@/lib/responsiveImages";
import { buildFaqSchema, buildScheduledEventSchema } from "@/lib/schema";
import {
  getSeriesExperienceEvent,
  getEventWindowStatus,
} from "@/lib/siteExperience";
import { usePublicSiteDataVersion } from "@/lib/siteData";
import "@/styles/home.css";
import "@/styles/chasing-series.css";
import "@/styles/untold-series.css";

const hero = getResponsiveImage("untoldStoryHero");
const pastShows = publishedArchiveEntries.filter(entry =>
  entry.slug.startsWith("untold-story-")
);
const artists = ["eran-hersh", "juany-bravo"].flatMap(id => {
  const artist = ARTIST_ENTRIES.find(entry => entry.id === id);
  return artist ? [artist] : [];
});
const frames = pastShows
  .flatMap(entry =>
    entry.media
      .filter(media => media.kind === "image")
      .slice(0, 2)
      .map(media => ({ ...media, href: entry.href }))
  )
  .slice(0, 4);

export default function UntoldStory() {
  usePublicSiteDataVersion();
  const candidate = getSeriesExperienceEvent("untold-story", "funnel");
  const event =
    candidate &&
    !["draft", "hidden", "past"].includes(candidate.status) &&
    getEventWindowStatus(candidate) !== "past"
      ? candidate
      : null;
  const needsUpdate =
    event?.eventStatus === "EventPostponed" ||
    event?.eventStatus === "EventCancelled";
  const dateConfirmed =
    !!event?.startsAt && Number.isFinite(Date.parse(event.startsAt));
  const schemaData = [
    buildFaqSchema(untoldFaqs),
    ...(event && dateConfirmed
      ? [buildScheduledEventSchema(event, "/story")]
      : []),
  ];

  return (
    <div className="monolith-home chasing-series-page untold-series-page">
      <SEO
        absoluteTitle
        title="Untold Story — Chicago after-dark house music"
        description="Explore Untold Story: Monolith's after-dark house music series. Event information, artists, previous chapters and the photo archive."
        canonicalPath="/story"
        image={hero.src}
        schemaData={schemaData}
      />
      <Navigation variant="dark" brand="untold-story" />
      <main id="main-content" tabIndex={-1}>
        <section
          id="untold-hero"
          className="chasing-series-hero"
          aria-labelledby="untold-hero-title"
        >
          <ResponsiveImage
            {...hero}
            alt="The chandelier and dancefloor at a previous Untold Story night"
            priority
            className="chasing-series-backdrop"
          />
          <div className="container layout-wide chasing-hero-copy">
            <p className="home-eyebrow">The Monolith Project presents</p>
            <div className="untold-wordmark">
              <span aria-hidden="true">
                <UntoldButterflyLogo />
              </span>
              <h1 id="untold-hero-title">
                Untold
                <br />
                Story.
              </h1>
            </div>
            <p className="chasing-hero-tagline">
              Deeper house. Closer rooms.
              <br />
              Chicago after dark.
            </p>
            <div className="home-actions">
              <a className="home-primary" href="#untold-event">
                {event ? "Explore the next chapter" : "What’s next"}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <a className="home-secondary" href="#untold-gallery">
                The moments
              </a>
            </div>
          </div>
        </section>
        <nav className="chasing-section-nav" aria-label="Untold Story sections">
          <a href="#untold-event">{event ? "Event guide" : "Next chapter"}</a>
          <a href="#untold-room">The room</a>
          <a href="#untold-sound">The music</a>
          <a href="#untold-records">Previous shows</a>
          <a href="#untold-gallery">Gallery</a>
          <a href="#untold-faq">FAQs</a>
        </nav>
        <section
          id="untold-event"
          className="home-event-feature home-etched-band"
          data-home-etch-tone="untold"
          aria-labelledby="untold-event-title"
        >
          <div className="container layout-wide home-event-grid">
            <div className="untold-event-media">
              <ResponsiveImage
                src={event?.image || "/images/untold-story-moody.webp"}
                alt={
                  event?.image
                    ? `${event.headline || event.title} artwork`
                    : "The atmosphere of Untold Story"
                }
                width={1200}
                height={900}
                sizes="(min-width: 900px) 50vw, 100vw"
              />
              {!event && <span>From the Untold Story archive</span>}
            </div>
            <div className="home-event-copy">
              <p className="home-eyebrow">
                Untold Story / {event ? "Next chapter" : "Stay in the loop"}
              </p>
              <h2 id="untold-event-title">
                {event?.headline ||
                  event?.title ||
                  "The next night starts here."}
              </h2>
              <p className="untold-event-intro">
                {event?.description ||
                  "Explore the nights that brought us here. New dates, guests and venue details will appear here when they’re announced."}
              </p>
              {event ? (
                <>
                  <p className="untold-event-status">
                    {event.eventStatus === "EventPostponed"
                      ? "Postponed · new date to be announced"
                      : event.eventStatus === "EventCancelled"
                        ? "Cancelled · read the event update"
                        : event.status === "on-sale"
                          ? "Tickets on sale"
                          : event.status === "sold-out"
                            ? "Sold out"
                            : "Announcement pending"}
                  </p>
                  <dl className="home-event-essentials">
                    <div>
                      <dt>{needsUpdate ? "Original date" : "When"}</dt>
                      <dd>
                        {event.date || "Date to be announced"}
                        {dateConfirmed && !needsUpdate && event.time && (
                          <>
                            <br />
                            <span>{event.time}</span>
                          </>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt>{needsUpdate ? "Original venue" : "Where"}</dt>
                      <dd>
                        {event.venue &&
                        !/^(tba|tbd|venue reveal soon)$/i.test(event.venue)
                          ? event.venue
                          : "Venue to be announced"}
                        <br />
                        <span>{event.location || "Chicago"}</span>
                      </dd>
                    </div>
                    <div>
                      <dt>Lineup</dt>
                      <dd>{event.lineup || "To be announced"}</dd>
                    </div>
                    <div>
                      <dt>Admission</dt>
                      <dd>{event.age || "See the event announcement"}</dd>
                    </div>
                  </dl>
                  <div className="home-actions">
                    <ConversionCTA
                      event={event}
                      showUrgency={false}
                      className="untold-event-cta"
                    />
                    <Link className="home-secondary" href="/schedule">
                      View calendar
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </Link>
                  </div>
                </>
              ) : (
                <div className="home-actions">
                  <Link className="home-primary" href="/newsletter">
                    Get Untold updates
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                  <a className="home-secondary" href="#untold-records">
                    Explore past shows
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
        <section
          id="untold-room"
          className="home-editorial-section"
          aria-labelledby="untold-room-title"
        >
          <span
            id="untold-contrast"
            className="untold-anchor-alias"
            aria-hidden="true"
          />
          <div className="container layout-wide home-section-container chasing-venue-grid">
            <div>
              <p className="home-eyebrow">01 / Our side of the night</p>
              <h2 id="untold-room-title">
                Lights low.
                <br />
                Music close.
                <br />
                <em>Stay a little longer.</em>
              </h2>
              <p>
                Untold Story is Monolith’s after-dark house music series.
                Intimate rooms, a focused dancefloor and music that builds
                through the night.
              </p>
              <p>
                Where Sun(Sets) meets the lake, Untold brings everyone closer to
                the booth. A different setting, the same Chicago community.
              </p>
              <Link className="home-text-link" href="/chasing-sunsets">
                Meet our daytime series
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <ResponsiveImage
              {...hero}
              alt="Inside an Untold Story room beneath the chandelier"
              className="chasing-venue-photo"
            />
          </div>
        </section>
        <section
          id="untold-sound"
          className="home-editorial-section"
          aria-labelledby="untold-sound-title"
        >
          <div className="container layout-wide home-section-container">
            <header className="home-section-heading">
              <div>
                <p className="home-eyebrow">02 / The soundtrack</p>
                <h2 id="untold-sound-title">The people behind the nights.</h2>
              </div>
              <Link className="home-text-link" href="/radio">
                Explore Monolith Radio
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </header>
            <p className="untold-section-intro">
              Afro house, melodic selections and deeper grooves. Meet artists
              from previous Untold Story chapters.
            </p>
            <div className="chasing-video-grid">
              {artists.map(artist => (
                <Link
                  className="chasing-video-card"
                  key={artist.id}
                  href={`/artists/${artist.id}`}
                >
                  <div className="chasing-video-image">
                    <ResponsiveImage
                      src={artist.image}
                      alt={artist.name}
                      width={1000}
                      height={700}
                      sizes="(min-width: 640px) 50vw, 100vw"
                      style={{
                        objectPosition: artist.imagePosition || "50% 30%",
                      }}
                    />
                  </div>
                  <div>
                    <h3>{artist.name}</h3>
                    <span>
                      Meet the artist
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section
          id="untold-records"
          className="home-editorial-section chasing-archive-section home-etched-band"
          data-home-etch-tone="untold"
          aria-labelledby="untold-records-title"
        >
          <span
            id="archive"
            className="untold-anchor-alias"
            aria-hidden="true"
          />
          <div className="container layout-wide home-section-container">
            <header className="home-section-heading">
              <div>
                <p className="home-eyebrow">03 / Previous shows</p>
                <h2 id="untold-records-title">Every room has a story.</h2>
              </div>
              <Link className="home-text-link" href="/archive">
                Full Monolith archive
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </header>
            <div className="chasing-archive-grid">
              {pastShows.map(show => (
                <Link
                  key={show.slug}
                  href={show.href}
                  className="chasing-archive-card"
                >
                  <ResponsiveImage
                    src={show.coverImage}
                    alt={show.subtitle}
                    width={900}
                    height={675}
                    sizes="(min-width: 900px) 33vw, 100vw"
                  />
                  <div>
                    <p className="home-eyebrow">{show.date}</p>
                    <h3>{show.subtitle}</h3>
                    <p>{show.description}</p>
                    <span>
                      View gallery
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section
          id="untold-gallery"
          className="home-editorial-section"
          aria-labelledby="untold-gallery-title"
        >
          <div className="container layout-wide home-section-container">
            <header className="home-section-heading">
              <div>
                <p className="home-eyebrow">04 / Through the lens</p>
                <h2 id="untold-gallery-title">You had to be there.</h2>
              </div>
              <Link className="home-text-link" href="/untold-story/season-iii">
                Open the photo gallery
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </header>
            <div className="chasing-photo-grid">
              {frames.map(frame => (
                <Link
                  key={frame.id}
                  href={frame.href}
                  className="chasing-photo"
                >
                  <ResponsiveImage
                    src={frame.src}
                    alt={frame.alt}
                    width={frame.width}
                    height={frame.height}
                    sizes="(min-width: 900px) 25vw, 50vw"
                  />
                  <span>
                    {frame.caption}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section
          id="untold-faq"
          className="home-editorial-section chasing-faq-section"
          aria-labelledby="untold-faq-title"
        >
          <div className="container layout-wide home-section-container chasing-faq-grid">
            <div>
              <p className="home-eyebrow">05 / Before you arrive</p>
              <h2 id="untold-faq-title">Good to know.</h2>
              <p>
                Dates, entry details and a direct line to the team. Check the
                current announcement before making plans.
              </p>
              <a
                className="home-text-link"
                href="mailto:events@monolithproject.com"
              >
                Ask us a question
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
            <div className="chasing-faq-list">
              {untoldFaqs.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section
          id="untold-updates"
          className="home-editorial-section chasing-closing"
          aria-labelledby="untold-closing-title"
        >
          <div className="container layout-wide home-section-container chasing-closing-grid">
            <Link
              href="/untold-story/season-iii"
              className="chasing-social-art untold-closing-art"
              aria-label="Explore the Untold Story photo archive"
            >
              <ResponsiveImage
                src="/images/untold-story-juany-deron-v2.webp"
                alt="Untold Story archive artwork"
                width={2399}
                height={3600}
                sizes="(min-width: 768px) 380px, 90vw"
              />
            </Link>
            <div>
              <span className="untold-closing-mark" aria-hidden="true">
                <UntoldButterflyLogo />
              </span>
              <h2 id="untold-closing-title">Stay close to Untold.</h2>
              <p>
                New nights, guest announcements and moments from the room.
                Follow along for the next chapter.
              </p>
              <div className="home-actions">
                <Link className="home-primary" href="/newsletter">
                  Get Untold updates
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
                <a
                  className="home-secondary"
                  href={INSTAGRAM_UNTOLD}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Follow on Instagram ↗
                </a>
              </div>
              <div className="chasing-contact-links">
                <a href="mailto:events@monolithproject.com">
                  Event questions ↗
                </a>
                <a href="mailto:music@monolithproject.com?subject=Untold%20Story%20Submission">
                  Submit a mix ↗
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
