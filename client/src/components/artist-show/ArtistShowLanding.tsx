import { useEffect, useState, type CSSProperties } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  LockKeyhole,
  MapPin,
  Play,
  Ticket,
  UsersRound,
} from "lucide-react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import ResponsiveImage from "@/components/ResponsiveImage";
import { trackFunnelPageView, trackTicketIntent } from "@/lib/api";
import type { ArtistShowReleaseConfig } from "@/lib/artistShowRelease";
import { trackMetaPixelOutboundTicketClick } from "@/lib/metaPixel";
import "@/styles/themes/artist-show.css";

type TicketPlacement = "header" | "hero" | "profile" | "sound" | "details";

interface ArtistShowConversionMoment {
  eyebrow: string;
  headline: string;
  note: string;
  ctaLabel: string;
}

interface ArtistProfileFact {
  label: string;
  value: string;
}

interface ArtistProfileMetric {
  value: string;
  label: string;
}

interface ArtistShowLink {
  label: string;
  href: string;
}

interface ArtistShowVideoSlot {
  number: string;
  title: string;
  line: string;
  variant?: "lineage";
}

export interface ArtistShowLandingConfig {
  eventId: string;
  publicPath: string;
  trackingPrefix: string;
  trackingSource: string;
  trackingContentName: string;
  seo: {
    title: string;
    description: string;
  };
  theme: {
    ink: string;
    charcoal: string;
    paper: string;
    accent: string;
    metal: string;
    signal: string;
  };
  brand: {
    presenter: string;
    homePath: string;
    locationLine: string;
  };
  artist: {
    name: string;
    nameLines: string[];
    initials: string;
    heroImageAlt: string;
    profile: {
      kicker: string;
      headline: string;
      bio: string[];
      metrics?: ArtistProfileMetric[];
      facts: ArtistProfileFact[];
      officialLink?: ArtistShowLink;
    };
  };
  hero: {
    eyebrow: string;
    thesis: string[];
    quickFacts: string;
    wave?: number[];
  };
  story: {
    kicker: string;
    headline: string;
    headlineEmphasis: string;
    paragraphs: Array<{ copy: string; emphasis?: boolean }>;
    stampValue: string;
    stampCopy: string;
  };
  sound: {
    kicker: string;
    headline: string;
    description: string;
    featured: {
      label: string;
      title: string;
      description: string;
      linkLabel: string;
    };
    additionalSlots: ArtistShowVideoSlot[];
  };
  conversion: {
    afterProfile?: ArtistShowConversionMoment;
    afterSound?: ArtistShowConversionMoment;
  };
  event: {
    shortDate: string;
    dateParts: [string, string];
    fullDate: string;
    /** ISO 8601 event date (e.g. "2026-07-31"), used for MusicEvent schema. */
    startDate: string;
    venue: string;
    city: string;
    capacity: string;
    age: string;
    timingSuffix: string;
    detailsHeadline: string;
    conversionNote: string;
  };
  footer: {
    frequency: string;
    guide: string;
    familyLabel: string;
    familyLinks: ArtistShowLink[];
    legalLine: string;
  };
}

export interface ArtistShowLandingProps {
  config: ArtistShowLandingConfig;
  release: ArtistShowReleaseConfig;
  preview: boolean;
}

const defaultWave = [
  2, 4, 6, 8, 11, 14, 17, 13, 19, 13, 17, 14, 11, 8, 6, 4, 2,
];

function hexToRgbChannels(hex: string) {
  const normalized = hex.replace("#", "");
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map(character => character.repeat(2))
          .join("")
      : normalized;
  const value = Number.parseInt(expanded, 16);

  if (!Number.isFinite(value) || expanded.length !== 6) return "255, 255, 255";

  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
}

function MonolithMark() {
  return (
    <span className="show-monolith-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

function VideoPlaceholder({ featured = false }: { featured?: boolean }) {
  return (
    <div
      className={`show-sound-placeholder${
        featured ? " show-sound-placeholder--featured" : ""
      }`}
      aria-label="Official video pending approval"
    >
      <div className="show-sound-placeholder__orbit" aria-hidden="true">
        <span />
        <span />
        <Play />
      </div>
      <p>Official video locks here after approval.</p>
    </div>
  );
}

function YouTubeFrame({
  videoId,
  title,
  featured = false,
}: {
  videoId?: string;
  title: string;
  featured?: boolean;
}) {
  const [activated, setActivated] = useState(false);

  if (!videoId) return <VideoPlaceholder featured={featured} />;

  // Facade: render only the thumbnail until the visitor presses play, so the
  // page never pulls YouTube's player JS for unwatched embeds.
  if (!activated) {
    return (
      <button
        type="button"
        className="show-video-facade"
        onClick={() => setActivated(true)}
        aria-label={`Play ${title}`}
      >
        <img
          src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <span className="show-video-facade__play" aria-hidden="true">
          <Play />
        </span>
      </button>
    );
  }

  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`}
      title={title}
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  );
}

function buildTicketUrl(url: string, placement: string, campaign: string) {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("utm_source", "monolith_site");
    parsed.searchParams.set("utm_medium", "landing_cta");
    parsed.searchParams.set("utm_campaign", campaign);
    parsed.searchParams.set("utm_content", placement);
    return parsed.toString();
  } catch {
    return url;
  }
}

function TicketCta({
  placement,
  compact = false,
  label = "Tickets",
  preview,
  config,
  release,
}: {
  placement: TicketPlacement;
  compact?: boolean;
  label?: string;
  preview: boolean;
  config: ArtistShowLandingConfig;
  release: ArtistShowReleaseConfig;
}) {
  const enabled = !preview && release.publicReady;
  const className = `show-ticket-cta${
    compact ? " show-ticket-cta--compact" : ""
  }`;

  if (!enabled) {
    return (
      <button
        type="button"
        className={`${className} show-ticket-cta--locked`}
        disabled
        data-release-gate="closed"
        aria-label={`${label} — available when ticketing opens`}
      >
        <LockKeyhole aria-hidden="true" />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <a
      href={buildTicketUrl(release.ticketUrl, placement, config.trackingPrefix)}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        void trackTicketIntent(
          `${config.trackingPrefix}_${placement}`,
          config.eventId,
          release.ticketUrl
        );
        trackMetaPixelOutboundTicketClick({
          content_name: config.trackingContentName,
          content_category: "Event Tickets",
          content_ids: [config.eventId],
          cta_placement: placement,
        });
      }}
    >
      <Ticket aria-hidden="true" />
      <span>{label}</span>
      <ArrowUpRight aria-hidden="true" />
    </a>
  );
}

function ConversionBand({
  moment,
  placement,
  preview,
  config,
  release,
}: {
  moment: ArtistShowConversionMoment;
  placement: "profile" | "sound";
  preview: boolean;
  config: ArtistShowLandingConfig;
  release: ArtistShowReleaseConfig;
}) {
  return (
    <section
      className={`show-conversion-band show-conversion-band--${placement}`}
      aria-label={`${moment.ctaLabel} conversion`}
    >
      <p className="show-conversion-band__eyebrow">{moment.eyebrow}</p>
      <h2>{moment.headline}</h2>
      <div className="show-conversion-band__action">
        <TicketCta
          placement={placement}
          label={moment.ctaLabel}
          preview={preview}
          config={config}
          release={release}
        />
        <p>{moment.note}</p>
      </div>
    </section>
  );
}

function AdditionalVideo({
  artistName,
  slot,
  videoId,
}: {
  artistName: string;
  slot: ArtistShowVideoSlot;
  videoId?: string;
}) {
  const isLineage = slot.variant === "lineage";

  return (
    <article
      className={`show-sound-card${
        isLineage ? " show-sound-card--lineage" : ""
      }`}
      data-video-variant={slot.variant || "standard"}
    >
      <div className="show-sound-card__meta">
        <span>
          {isLineage ? "Group lineage" : "Transmission"} / {slot.number}
        </span>
        <span>{videoId ? "Approved" : "Approval pending"}</span>
      </div>

      <div className="show-sound-card__media">
        <YouTubeFrame
          videoId={videoId}
          title={`${artistName} — ${slot.title}`}
        />
      </div>

      <div className="show-sound-card__copy">
        <h3>{slot.title}</h3>
        <p>{slot.line}</p>
      </div>
    </article>
  );
}

export function buildArtistShowEventSchema(
  config: ArtistShowLandingConfig,
  release: ArtistShowReleaseConfig
) {
  if (!release.publicReady) return undefined;

  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: config.trackingContentName,
    startDate: config.event.startDate,
    eventStatus: "https://schema.org/EventScheduled",
    performer: {
      "@type": "MusicGroup",
      name: config.artist.name,
    },
    location: {
      "@type": "Place",
      name: config.event.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: config.event.city,
      },
    },
    organizer: {
      "@type": "Organization",
      name: config.brand.presenter,
    },
    ...(release.heroImage ? { image: [release.heroImage] } : {}),
    offers: {
      "@type": "Offer",
      url: release.ticketUrl,
      availability: "https://schema.org/InStock",
    },
  };
}

export default function ArtistShowLanding({
  config,
  release,
  preview,
}: ArtistShowLandingProps) {
  const titleId = `${config.eventId}-title`;
  const profileTitleId = `${config.eventId}-profile-title`;
  const storyTitleId = `${config.eventId}-story-title`;
  const soundTitleId = `${config.eventId}-sound-title`;
  const detailsTitleId = `${config.eventId}-details-title`;
  const doors = release.doors || "Doors time held for release";
  const wave = config.hero.wave || defaultWave;
  const featuredVideoId = release.videoIds[0];
  const additionalVideos = config.sound.additionalSlots
    .map((slot, index) => ({ slot, videoId: release.videoIds[index + 1] }))
    .filter(item => preview || Boolean(item.videoId));
  const pageStyle = {
    "--show-ink": config.theme.ink,
    "--show-charcoal": config.theme.charcoal,
    "--show-paper": config.theme.paper,
    "--show-accent": config.theme.accent,
    "--show-metal": config.theme.metal,
    "--show-signal": config.theme.signal,
    "--show-paper-rgb": hexToRgbChannels(config.theme.paper),
    "--show-accent-rgb": hexToRgbChannels(config.theme.accent),
    "--show-metal-rgb": hexToRgbChannels(config.theme.metal),
    "--show-signal-rgb": hexToRgbChannels(config.theme.signal),
  } as CSSProperties;

  const eventSchema = buildArtistShowEventSchema(config, release);

  useEffect(() => {
    if (preview || !release.publicReady) return;

    trackFunnelPageView({
      pagePath: config.publicPath,
      eventSlug: config.eventId,
      source: config.trackingSource,
    });
  }, [
    config.eventId,
    config.publicPath,
    config.trackingSource,
    preview,
    release.publicReady,
  ]);

  return (
    <div className="show-page" style={pageStyle}>
      <SEO
        title={config.seo.title}
        description={config.seo.description}
        canonicalPath={config.publicPath}
        absoluteTitle
        image={release.heroImage || undefined}
        schemaData={eventSchema}
        noIndex={preview || !release.publicReady}
      />

      <header className="show-site-bar">
        <Link
          href={config.brand.homePath}
          className="show-brand-lockup"
          aria-label={`${config.brand.presenter} home`}
        >
          <MonolithMark />
          <span>
            {config.brand.presenter}
            <small>{config.brand.locationLine}</small>
          </span>
        </Link>

        {preview ? (
          <div className="show-preview-status" role="status">
            <span /> Private draft / gate closed
          </div>
        ) : null}

        <TicketCta
          placement="header"
          compact
          preview={preview}
          config={config}
          release={release}
        />
      </header>

      <main id="main-content" tabIndex={-1}>
        <section
          className={`show-hero${release.heroImage ? " show-hero--poster" : ""}`}
          aria-labelledby={titleId}
        >
          <div className="show-hero__grid" aria-hidden="true" />
          <div className="show-hero__flare" aria-hidden="true" />
          <div className="show-hero__rings" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="show-hero__wave" aria-hidden="true">
            {wave.map((height, index) => (
              <span
                key={index}
                style={{ "--show-bar": height } as CSSProperties}
              />
            ))}
          </div>

          <div
            className={`show-hero__portrait${
              release.heroImage ? " show-hero__portrait--loaded" : ""
            }`}
          >
            <span className="show-hero__portrait-corner show-hero__portrait-corner--tl" />
            <span className="show-hero__portrait-corner show-hero__portrait-corner--br" />
            {release.heroImage ? (
              <ResponsiveImage
                src={release.heroImage}
                alt={config.artist.heroImageAlt}
                priority
                sizes="(max-width: 767px) 86vw, 24vw"
              />
            ) : (
              <div
                className="show-hero__portrait-placeholder"
                aria-label="Approved artist hero image pending"
              >
                <span>Hero image / reserved</span>
                <strong>{config.artist.initials}</strong>
                <small>Approved press image locks here</small>
              </div>
            )}
          </div>

          <div className="show-hero__content">
            <p className="show-eyebrow">{config.hero.eyebrow}</p>
            <h1
              id={titleId}
              className="show-title"
              aria-label={config.artist.name}
            >
              {config.artist.nameLines.map(line => (
                <span key={line}>{line}</span>
              ))}
            </h1>

            <div className="show-hero__coordinates">
              <span>{config.event.shortDate}</span>
              <i />
              <span>{config.event.venue}</span>
              <i />
              <span>{config.event.city}</span>
            </div>

            <p className="show-hero__thesis">
              {config.hero.thesis.map((line, index) => (
                <span key={line}>
                  {line}
                  {index < config.hero.thesis.length - 1 ? <br /> : null}
                </span>
              ))}
            </p>

            <div className="show-hero__actions">
              <TicketCta
                placement="hero"
                preview={preview}
                config={config}
                release={release}
              />
              <span>{config.hero.quickFacts}</span>
            </div>
          </div>

          <a href="#artist-profile" className="show-scroll-cue">
            <span>Meet the artist</span>
            <ArrowDown aria-hidden="true" />
          </a>
        </section>

        <section
          id="artist-profile"
          className="show-profile"
          aria-labelledby={profileTitleId}
        >
          <div className="show-section-index" aria-hidden="true">
            01 / Artist
          </div>

          <aside className="show-profile__identity" aria-hidden="true">
            <span>Artist profile</span>
            <strong>{config.artist.initials}</strong>
            <i />
            <small>{config.artist.name}</small>
          </aside>

          <div className="show-profile__copy">
            <p className="show-kicker">{config.artist.profile.kicker}</p>
            <h2 id={profileTitleId}>{config.artist.profile.headline}</h2>
            <div className="show-profile__bio">
              {config.artist.profile.bio.map(paragraph => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {config.artist.profile.officialLink ? (
              <a
                href={config.artist.profile.officialLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="show-profile__link"
              >
                {config.artist.profile.officialLink.label}
                <ArrowUpRight aria-hidden="true" />
              </a>
            ) : null}
          </div>

          {config.artist.profile.metrics?.length ? (
            <div className="show-profile__metrics" aria-label="Artist reach">
              {config.artist.profile.metrics.map(metric => (
                <div key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
              <small>Audience snapshot / verify at release</small>
            </div>
          ) : null}

          <dl className="show-profile__facts">
            {config.artist.profile.facts.map(fact => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {config.conversion.afterProfile ? (
          <ConversionBand
            moment={config.conversion.afterProfile}
            placement="profile"
            preview={preview}
            config={config}
            release={release}
          />
        ) : null}

        <section
          id="story"
          className="show-story"
          aria-labelledby={storyTitleId}
        >
          <div className="show-section-index" aria-hidden="true">
            02 / Story
          </div>

          <div className="show-story__lead">
            <p className="show-kicker">{config.story.kicker}</p>
            <h2 id={storyTitleId}>
              {config.story.headline}
              <strong>{config.story.headlineEmphasis}</strong>
            </h2>
          </div>

          <div className="show-story__body">
            {config.story.paragraphs.map(paragraph => (
              <p
                key={paragraph.copy}
                className={paragraph.emphasis ? "show-story__pivot" : undefined}
              >
                {paragraph.copy}
              </p>
            ))}
          </div>

          <aside className="show-story__stamp" aria-label="Event promise">
            <span>{config.story.stampValue}</span>
            <p>{config.story.stampCopy}</p>
          </aside>
        </section>

        <section className="show-sound" aria-labelledby={soundTitleId}>
          <div className="show-section-index" aria-hidden="true">
            03 / Watch
          </div>
          <div className="show-sound__header">
            <div>
              <p className="show-kicker">{config.sound.kicker}</p>
              <h2 id={soundTitleId}>{config.sound.headline}</h2>
            </div>
            <p>{config.sound.description}</p>
          </div>

          <article className="show-featured-set">
            <div className="show-featured-set__media">
              <YouTubeFrame
                videoId={featuredVideoId}
                title={`${config.artist.name} — ${config.sound.featured.title}`}
                featured
              />
            </div>
            <div className="show-featured-set__copy">
              <div className="show-featured-set__meta">
                <span>{config.sound.featured.label}</span>
                <span>{featuredVideoId ? "Owner approved" : "Pending"}</span>
              </div>
              <h3>{config.sound.featured.title}</h3>
              <p>{config.sound.featured.description}</p>
              {featuredVideoId ? (
                <a
                  href={`https://www.youtube.com/watch?v=${featuredVideoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {config.sound.featured.linkLabel}
                  <ArrowUpRight aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </article>

          {additionalVideos.length ? (
            <div className="show-sound__grid">
              {additionalVideos.map(({ slot, videoId }) => (
                <AdditionalVideo
                  key={slot.number}
                  artistName={config.artist.name}
                  slot={slot}
                  videoId={videoId}
                />
              ))}
            </div>
          ) : null}
        </section>

        {config.conversion.afterSound ? (
          <ConversionBand
            moment={config.conversion.afterSound}
            placement="sound"
            preview={preview}
            config={config}
            release={release}
          />
        ) : null}

        <section className="show-details" aria-labelledby={detailsTitleId}>
          <div className="show-details__date" aria-hidden="true">
            <span>{config.event.dateParts[0]}</span>
            <i />
            <span>{config.event.dateParts[1]}</span>
          </div>

          <div className="show-details__content">
            <div className="show-section-index" aria-hidden="true">
              04 / Coordinates
            </div>
            <p className="show-kicker">The details</p>
            <h2 id={detailsTitleId}>{config.event.detailsHeadline}</h2>

            <dl className="show-details__grid">
              <div>
                <CalendarDays aria-hidden="true" />
                <dt>Date</dt>
                <dd>{config.event.fullDate}</dd>
              </div>
              <div>
                <MapPin aria-hidden="true" />
                <dt>Room</dt>
                <dd>
                  {config.event.venue} / {config.event.city}
                </dd>
              </div>
              <div>
                <UsersRound aria-hidden="true" />
                <dt>Capacity</dt>
                <dd>
                  {config.event.capacity} / {config.event.age}
                </dd>
              </div>
              <div>
                <Play aria-hidden="true" />
                <dt>Timing</dt>
                <dd>
                  {doors} / {config.event.timingSuffix}
                </dd>
              </div>
            </dl>

            <div className="show-details__conversion">
              <TicketCta
                placement="details"
                preview={preview}
                config={config}
                release={release}
              />
              <p>{config.event.conversionNote}</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="show-footer">
        <div className="show-footer__frequency">
          <p>{config.footer.frequency}</p>
          <p>{config.footer.guide}</p>
        </div>
        <div className="show-footer__family">
          <span>{config.footer.familyLabel}</span>
          <nav aria-label="Monolith family">
            {config.footer.familyLinks.map(link => (
              <Link key={link.href} href={link.href}>
                {link.label}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </div>
        <div className="show-footer__legal">
          <MonolithMark />
          <span>{config.footer.legalLine}</span>
        </div>
      </footer>
    </div>
  );
}
