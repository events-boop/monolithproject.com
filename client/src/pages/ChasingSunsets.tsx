import { ArrowUpRight, Play } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import ChasingSunsetsLogo from "@/components/ChasingSunsetsLogo";
import ResponsiveImage from "@/components/ResponsiveImage";
import HomeEventFeature from "@/components/HomeEventFeature";
import HomeTicketLink from "@/components/HomeTicketLink";
import { archiveCollectionsBySlug } from "@/data/galleryData";
import {
  currentSunsets as event,
  sunsetsDateLabel,
  sunsetsTimeLabel,
  sunsetsShowVisible,
  sunsetsNeedsUpdate,
} from "@shared/events/sunsets-current";
import "@/styles/home.css";
import "@/styles/chasing-series.css";

const pastShows = [
  {
    slug: "chasing-sunsets-sunsets-ii-2026",
    href: "/chasing-sunsets/sunsets-ii-2026",
    title: "Gene Farris",
    subtitle: "Chapter II / Legend on the Lake",
  },
  {
    slug: "chasing-sunsets-sunsets-i-2026",
    href: "/chasing-sunsets/sunsets-i-2026",
    title: "Autograf × Kiko Franco",
    subtitle: "Chapter I / Back to the lake",
  },
  {
    slug: "chasing-sunsets-season-iii",
    href: "/chasing-sunsets/season-iii",
    title: "The shoreline sessions",
    subtitle: "From the summer archive",
  },
];
const videos = [
  {
    name: "JOEZI",
    image: "joezi",
    url: "https://www.youtube.com/watch?v=qMWZngFojK0",
  },
  {
    name: "MASSUMA",
    image: "massuma",
    url: "https://www.youtube.com/watch?v=Hynx0-uXk5M",
  },
];
const frames = [
  {
    file: "css-s3-1.jpg",
    alt: "The Chasing Sun(Sets) crowd by the water",
    caption: "By the water",
  },
  {
    file: "css-s3-4.jpg",
    alt: "A moment at the Chasing Sun(Sets) DJ booth",
    caption: "Behind the decks",
  },
  {
    file: "css-s3-7.jpg",
    alt: "Guests at a previous Chasing Sun(Sets) show",
    caption: "In good company",
  },
  {
    file: "css-s3-9.jpg",
    alt: "The atmosphere at a previous Chasing Sun(Sets) show",
    caption: "Stay for the sets",
  },
];

export default function ChasingSunsets() {
  const eventActive = sunsetsShowVisible();
  return (
    <div className="monolith-home chasing-series-page">
      <SEO
        absoluteTitle
        title="Chasing Sun(Sets) — Chicago lakefront house music"
        description="House music, Lake Michigan and golden hour. Explore Chasing Sun(Sets): current event information, artist sets, previous shows and the summer photo archive."
        canonicalPath="/chasing-sunsets"
        image="/images/chasing-sunsets-castaways-hero.png"
      />
      <Navigation variant="dark" brand="chasing-sunsets" />
      <main id="main-content" tabIndex={-1}>
        <section
          id="chasing-hero"
          className="chasing-series-hero"
          aria-labelledby="chasing-hero-title"
        >
          <ResponsiveImage
            src="/images/chasing-sunsets-castaways-hero.png"
            alt="Castaways Beach Club beside Lake Michigan at sunset"
            width={1697}
            height={927}
            sizes="(max-width: 639px) 150svh, 100vw"
            priority
            className="chasing-series-backdrop"
          />
          <div className="container layout-wide chasing-hero-copy">
            <p className="home-eyebrow">The Monolith Project presents</p>
            <h1 id="chasing-hero-title">
              <span className="sr-only">Chasing Sun(Sets)</span>
              <ChasingSunsetsLogo decorative priority />
            </h1>
            <p className="chasing-hero-tagline">
              House music. Lake Michigan.
              <br />
              One more sunset.
            </p>
            <div className="home-actions">
              <a
                className="home-primary"
                href={eventActive ? "#current-event" : "#chasing-records"}
              >
                {eventActive ? "Explore the finale" : "Explore past shows"}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <a className="home-secondary" href="#chasing-gallery">
                The moments
              </a>
            </div>
          </div>
        </section>
        <nav
          className="chasing-section-nav"
          aria-label="Chasing Sunsets sections"
        >
          {eventActive && <a href="#current-event">Event guide</a>}
          <a href="#chasing-venue">Castaways</a>
          <a href="#chasing-sound">The music</a>
          <a href="#chasing-records">Previous shows</a>
          <a href="#chasing-gallery">Gallery</a>
          <a href="#chasing-faq">FAQs</a>
        </nav>
        <HomeEventFeature />
        <section
          id="chasing-venue"
          className="home-editorial-section chasing-venue-section"
          aria-labelledby="chasing-venue-title"
        >
          <div className="container layout-wide home-section-container chasing-venue-grid">
            <div>
              <p className="home-eyebrow">01 / Our home on the lake</p>
              <h2 id="chasing-venue-title">
                Castaways.
                <br />
                Chicago.
                <br />
                <em>Of course.</em>
              </h2>
              <p>
                North Avenue Beach. Lake Michigan out front. The skyline behind
                you. Open-air house music from afternoon into golden hour.
              </p>
              <a
                className="home-text-link"
                href={event.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Directions to Castaways
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
            <div className="chasing-venue-media">
              <ResponsiveImage
                src="/images/chasing-sunsets-castaways-hero.png"
                alt="The rooftop and lakefront setting at Castaways Beach Club in Chicago"
                width={1697}
                height={927}
                sizes="(min-width: 900px) 60vw, 100vw"
                className="chasing-venue-photo"
              />
            </div>
          </div>
        </section>
        <section
          id="chasing-sound"
          className="home-editorial-section"
          aria-labelledby="chasing-sound-title"
        >
          <div className="container layout-wide home-section-container">
            <header className="home-section-heading">
              <div>
                <p className="home-eyebrow">02 / The soundtrack</p>
                <h2 id="chasing-sound-title">A taste of the sound.</h2>
              </div>
              <a className="home-text-link" href="/sunsets#set-times">
                Lineup &amp; set times
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </header>
            <div className="chasing-video-grid">
              {videos.map(video => (
                <a
                  className="chasing-video-card"
                  key={video.name}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="chasing-video-image">
                    <img
                      src={`/sunsets/assets/youtube-${video.image}.jpg`}
                      alt={`${video.name} DJ set on YouTube`}
                      width={1280}
                      height={720}
                      loading="lazy"
                    />
                    <span className="home-recap-play">
                      <Play size={22} fill="currentColor" aria-hidden="true" />
                    </span>
                  </div>
                  <div>
                    <h3>{video.name}</h3>
                    <span>
                      Watch the set{" "}
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
        <section
          id="chasing-records"
          className="home-editorial-section chasing-archive-section"
          aria-labelledby="chasing-records-title"
        >
          <div className="container layout-wide home-section-container">
            <header className="home-section-heading">
              <div>
                <p className="home-eyebrow">03 / Previous shows</p>
                <h2 id="chasing-records-title">The sunsets before this one.</h2>
              </div>
              <Link className="home-text-link" href="/archive">
                Full archive
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </header>
            <div className="chasing-archive-grid">
              {pastShows.map(show => {
                const entry = archiveCollectionsBySlug[show.slug];
                return (
                  <Link
                    key={show.slug}
                    href={show.href}
                    className="chasing-archive-card"
                  >
                    <ResponsiveImage
                      src={entry.coverImage}
                      alt={show.title}
                      width={900}
                      height={675}
                      sizes="(min-width: 900px) 33vw, 100vw"
                    />
                    <div>
                      <p className="home-eyebrow">{entry.date}</p>
                      <h3>{show.title}</h3>
                      <p>{show.subtitle}</p>
                      <span>
                        {entry.comingSoon
                          ? "Explore the chapter"
                          : "View gallery"}
                        <ArrowUpRight size={18} aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="chasing-recap-row">
              <a
                className="home-recap-film"
                href="https://www.youtube.com/watch?v=9R6XH7JZlJI"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Watch Autograf at Chasing Sunsets on YouTube"
              >
                <img
                  src="/sunsets/assets/youtube-recap.jpg"
                  alt="Autograf performing at Chasing Sunsets in Chicago"
                  width={1280}
                  height={720}
                  loading="lazy"
                />
                <span className="home-recap-play">
                  <Play size={24} fill="currentColor" aria-hidden="true" />
                </span>
                <span className="home-recap-watch">
                  Watch the full set
                  <ArrowUpRight size={18} aria-hidden="true" />
                </span>
              </a>
              <div>
                <p className="home-eyebrow">From the archive / Autograf</p>
                <h3>
                  By the water.
                  <br />
                  In the moment.
                </h3>
                <p>
                  Revisit a Chasing Sun(Sets) set from the Chicago lakefront.
                  Press play and stay a while.
                </p>
                <a
                  className="home-text-link"
                  href="https://www.youtube.com/watch?v=9R6XH7JZlJI"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch on YouTube
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>
        <section
          id="chasing-gallery"
          className="home-editorial-section"
          aria-labelledby="chasing-gallery-title"
        >
          <div className="container layout-wide home-section-container">
            <header className="home-section-heading">
              <div>
                <p className="home-eyebrow">04 / Through the lens</p>
                <h2 id="chasing-gallery-title">This is the feeling.</h2>
              </div>
              <Link
                className="home-text-link"
                href="/chasing-sunsets/season-iii"
              >
                Open the photo gallery
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </header>
            <div className="chasing-photo-grid">
              {frames.map(frame => (
                <Link
                  key={frame.file}
                  href="/chasing-sunsets/season-iii"
                  className="chasing-photo"
                >
                  <ResponsiveImage
                    src={`/images/archive/chasing-sunsets/${frame.file}`}
                    alt={frame.alt}
                    width={600}
                    height={750}
                    sizes="(min-width: 900px) 25vw, 50vw"
                  />
                  <span>
                    {frame.caption}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
            <div className="chasing-older-seasons">
              <span>Keep exploring</span>
              <Link href="/chasing-sunsets/season-ii">Season II gallery ↗</Link>
              <Link href="/chasing-sunsets/season-i">Season I gallery ↗</Link>
            </div>
          </div>
        </section>
        <section
          id="chasing-faq"
          className="home-editorial-section chasing-faq-section"
          aria-labelledby="chasing-faq-title"
        >
          <div className="container layout-wide home-section-container chasing-faq-grid">
            <div>
              <p className="home-eyebrow">05 / Before you arrive</p>
              <h2 id="chasing-faq-title">Good to know.</h2>
              <p>
                Event information, weather updates and a direct line to our
                team.
              </p>
              <a className="home-text-link" href="/sunsets#faq">
                The complete event guide
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
            <div className="chasing-faq-list">
              <details>
                <summary>When and where is the finale?</summary>
                <p>
                  {sunsetsNeedsUpdate
                    ? "The September 19 show is postponed. New details will be announced. Original booking: "
                    : ""}
                  {sunsetsDateLabel}, {sunsetsTimeLabel}. {event.venueName},{" "}
                  {event.address}. Check the{" "}
                  <a href="/sunsets#event-status">latest event status</a> before
                  travelling.
                </p>
              </details>
              <details>
                <summary>What is the age requirement?</summary>
                <p>
                  All guests must be 21 or older and bring valid
                  government-issued photo ID. Admission is subject to venue
                  entry policies.
                </p>
              </details>
              <details>
                <summary>Where do I find tickets and set times?</summary>
                <p>
                  Use the official AllEvents listing linked in the event guide.
                  Select your ticket option at checkout.{" "}
                  {event.scheduleMessage.replace("Artists below", "Artists")}
                </p>
                <a href="/sunsets#set-times">
                  View the lineup and running order ↗
                </a>
              </details>
              <details>
                <summary>What happens if it rains or plans change?</summary>
                <p>
                  The event is rain or shine. Safety conditions may require
                  changes. A postponement, venue change and full cancellation
                  are different; check the official notice for your
                  ticket-holder instructions.
                </p>
                <a href="/sunsets#weather">
                  Weather updates &amp; ticket policy ↗
                </a>
              </details>
              <details>
                <summary>
                  Who can help with tables, groups or accessibility?
                </summary>
                <p>
                  Email{" "}
                  <a href="mailto:events@monolithproject.com">
                    events@monolithproject.com
                  </a>
                  . For tables or groups, include your party size and preferred
                  option. Confirm availability and inclusions with the team
                  before booking.
                </p>
              </details>
            </div>
          </div>
        </section>
        <section
          id="chasing-updates"
          className="home-editorial-section chasing-closing"
          aria-labelledby="chasing-closing-title"
        >
          <div className="container layout-wide home-section-container">
            <ChasingSunsetsLogo className="chasing-closing-logo" />
            <h2 id="chasing-closing-title">See you by the lake.</h2>
            <p>Check the event guide for the latest published information.</p>
            <div className="home-actions">
              <HomeTicketLink placement="chasing_series_close" />
              <a className="home-secondary" href="/sunsets#updates">
                Show updates
              </a>
            </div>
            <div className="chasing-contact-links">
              <a href="mailto:events@monolithproject.com">Event questions ↗</a>
              <a href="mailto:music@monolithproject.com?subject=Chasing%20Sunsets%20Submission">
                Submit a mix ↗
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
