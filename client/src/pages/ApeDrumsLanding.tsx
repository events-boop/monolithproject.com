import { useEffect, type CSSProperties } from "react";
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
import { Link, useLocation } from "wouter";
import SEO from "@/components/SEO";
import { trackFunnelPageView, trackTicketIntent } from "@/lib/api";
import { APE_DRUMS_RELEASE } from "@/lib/apeDrumsRelease";
import { trackMetaPixelInitiateCheckout } from "@/lib/metaPixel";
import { ROUTES } from "@shared/routes";
import "@/styles/themes/ape-drums.css";

const EVENT_ID = "ape-drums-kashmir-july-31-2026";
const heroWave = [2, 4, 6, 8, 11, 14, 17, 13, 19, 13, 17, 14, 11, 8, 6, 4, 2];

const soundSignals = [
  {
    number: "01",
    title: "GQTECH",
    line: "The pressure changed. This is why we kept calling.",
  },
  {
    number: "02",
    title: "222",
    line: "Rhythm first. Space around every hit.",
  },
  {
    number: "03",
    title: "4ME",
    line: "The next chapter is already in motion.",
  },
] as const;

const familyLinks = [
  { label: "Untold Story", href: ROUTES.story },
  { label: "Chasing Sun(Sets)", href: ROUTES.chasingSunsets },
  { label: "House of Friends", href: ROUTES.houseOfFriends },
] as const;

function MonolithMark() {
  return (
    <span className="ape-monolith-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

function TicketCta({
  placement,
  compact = false,
  preview,
}: {
  placement: "header" | "hero" | "details";
  compact?: boolean;
  preview: boolean;
}) {
  const enabled = !preview && APE_DRUMS_RELEASE.publicReady;
  const className = `ape-ticket-cta${compact ? " ape-ticket-cta--compact" : ""}`;

  if (!enabled) {
    return (
      <button
        type="button"
        className={`${className} ape-ticket-cta--locked`}
        disabled
        data-release-gate="closed"
      >
        <LockKeyhole aria-hidden="true" />
        <span>{compact ? "Locked" : "Tickets unlock at release"}</span>
      </button>
    );
  }

  return (
    <a
      href={APE_DRUMS_RELEASE.ticketUrl}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        void trackTicketIntent(
          `ape_drums_${placement}`,
          EVENT_ID,
          APE_DRUMS_RELEASE.ticketUrl
        );
        trackMetaPixelInitiateCheckout({
          content_name: "Ape Drums at Kashmir",
          content_category: "Event Tickets",
          content_ids: [EVENT_ID],
        });
      }}
    >
      <Ticket aria-hidden="true" />
      <span>Tickets</span>
      <ArrowUpRight aria-hidden="true" />
    </a>
  );
}

function SoundSignal({
  signal,
  videoId,
}: {
  signal: (typeof soundSignals)[number];
  videoId?: string;
}) {
  return (
    <article className="ape-sound-card">
      <div className="ape-sound-card__meta">
        <span>Signal / {signal.number}</span>
        <span>{videoId ? "Official transmission" : "Approval pending"}</span>
      </div>

      <div className="ape-sound-card__media">
        {videoId ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
            title={`Ape Drums — ${signal.title}`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <div
            className="ape-sound-placeholder"
            aria-label="Official video pending approval"
          >
            <div className="ape-sound-placeholder__orbit" aria-hidden="true">
              <span />
              <span />
              <Play />
            </div>
            <p>Official video locks here after approval.</p>
          </div>
        )}
      </div>

      <div className="ape-sound-card__copy">
        <h3>{signal.title}</h3>
        <p>{signal.line}</p>
      </div>
    </article>
  );
}

export default function ApeDrumsLanding() {
  const [location] = useLocation();
  const preview = location === ROUTES.apeDrumsPreview;
  const doors = APE_DRUMS_RELEASE.doors || "Doors time held for release";

  useEffect(() => {
    if (preview || !APE_DRUMS_RELEASE.publicReady) return;

    trackFunnelPageView({
      pagePath: ROUTES.apeDrums,
      eventSlug: EVENT_ID,
      source: "ape_drums_landing",
    });
  }, [preview]);

  return (
    <div className="ape-page">
      <SEO
        title="Ape Drums · July 31 · Kashmir · Chicago"
        description="The Monolith Project presents Ape Drums at Kashmir in Chicago on Friday, July 31, 2026. A 350-capacity room and a late-night set."
        canonicalPath={ROUTES.apeDrums}
        absoluteTitle
        noIndex={preview || !APE_DRUMS_RELEASE.publicReady}
      />

      <header className="ape-site-bar">
        <Link
          href={ROUTES.home}
          className="ape-brand-lockup"
          aria-label="The Monolith Project home"
        >
          <MonolithMark />
          <span>
            The Monolith Project
            <small>Chicago / 2026</small>
          </span>
        </Link>

        {preview ? (
          <div className="ape-preview-status" role="status">
            <span /> Private draft / gate closed
          </div>
        ) : null}

        <TicketCta placement="header" compact preview={preview} />
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className="ape-hero" aria-labelledby="ape-title">
          <div className="ape-hero__grid" aria-hidden="true" />
          <div className="ape-hero__flare" aria-hidden="true" />
          <div className="ape-hero__rings" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="ape-hero__wave" aria-hidden="true">
            {heroWave.map((height, index) => (
              <span
                key={index}
                style={{ "--ape-bar": height } as CSSProperties}
              />
            ))}
          </div>

          <div className="ape-hero__content">
            <p className="ape-eyebrow">The Monolith Project presents</p>
            <h1 id="ape-title" className="ape-title" aria-label="Ape Drums">
              <span>APE</span>
              <span>DRUMS</span>
            </h1>

            <div className="ape-hero__coordinates">
              <span>07.31</span>
              <i />
              <span>Kashmir</span>
              <i />
              <span>Chicago</span>
            </div>

            <p className="ape-hero__thesis">
              One year in the making.
              <br />
              One room for the next sound.
            </p>

            <div className="ape-hero__actions">
              <TicketCta placement="hero" preview={preview} />
              <span>350 people / late night / 21+</span>
            </div>
          </div>

          <a href="#story" className="ape-scroll-cue">
            <span>Enter the story</span>
            <ArrowDown aria-hidden="true" />
          </a>
        </section>

        <section
          id="story"
          className="ape-story"
          aria-labelledby="ape-story-title"
        >
          <div className="ape-section-index" aria-hidden="true">
            01 / Story
          </div>

          <div className="ape-story__lead">
            <p className="ape-kicker">A year in the making</p>
            <h2 id="ape-story-title">
              Some bookings happen in a week.
              <strong>This one took a year.</strong>
            </h2>
          </div>

          <div className="ape-story__body">
            <p>
              We first reached for Ape Drums last summer. Houston-raised. Forged
              in the Major Lazer camp—the co-signs, the world tours, the
              festival main stages. He could have run that lane forever.
            </p>
            <p className="ape-story__pivot">He didn&apos;t. He evolved.</p>
            <p>
              The sound he&apos;s building now is deeper, warmer,
              rhythm-first—the same frequency we&apos;ve been cultivating in
              Chicago from day one. When an artist burns down a winning formula
              to chase something truer, you don&apos;t just book him. You give
              the new chapter a home.
            </p>
            <p>
              July 31. A 350-cap room. Late night. The first Chicago address of
              the next era.
            </p>
          </div>

          <aside className="ape-story__stamp" aria-label="Event promise">
            <span>350</span>
            <p>People. One room. One frequency.</p>
          </aside>
        </section>

        <section className="ape-sound" aria-labelledby="ape-sound-title">
          <div className="ape-section-index" aria-hidden="true">
            02 / Sound
          </div>
          <div className="ape-sound__header">
            <div>
              <p className="ape-kicker">The new frequency</p>
              <h2 id="ape-sound-title">Don&apos;t take our word for it.</h2>
            </div>
            <p>
              Official artist transmissions only. Every signal is approval-gated
              before release.
            </p>
          </div>

          <div className="ape-sound__grid">
            {soundSignals.map((signal, index) => (
              <SoundSignal
                key={signal.number}
                signal={signal}
                videoId={APE_DRUMS_RELEASE.videoIds[index]}
              />
            ))}
          </div>
        </section>

        <section className="ape-details" aria-labelledby="ape-details-title">
          <div className="ape-details__date" aria-hidden="true">
            <span>07</span>
            <i />
            <span>31</span>
          </div>

          <div className="ape-details__content">
            <div className="ape-section-index" aria-hidden="true">
              03 / Coordinates
            </div>
            <p className="ape-kicker">The details</p>
            <h2 id="ape-details-title">Friday night belongs to the room.</h2>

            <dl className="ape-details__grid">
              <div>
                <CalendarDays aria-hidden="true" />
                <dt>Date</dt>
                <dd>Friday, July 31, 2026</dd>
              </div>
              <div>
                <MapPin aria-hidden="true" />
                <dt>Room</dt>
                <dd>Kashmir / Chicago</dd>
              </div>
              <div>
                <UsersRound aria-hidden="true" />
                <dt>Capacity</dt>
                <dd>350 / 21+</dd>
              </div>
              <div>
                <Play aria-hidden="true" />
                <dt>Timing</dt>
                <dd>{doors} / Ape Drums on late</dd>
              </div>
            </dl>

            <div className="ape-details__conversion">
              <TicketCta placement="details" preview={preview} />
              <p>
                Real capacity. Real ticket counts. No manufactured scarcity.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="ape-footer">
        <div className="ape-footer__frequency">
          <p>Togetherness is the frequency.</p>
          <p>Music is the guide.</p>
        </div>
        <div className="ape-footer__family">
          <span>Part of The Monolith Project family</span>
          <nav aria-label="Monolith family">
            {familyLinks.map(link => (
              <Link key={link.href} href={link.href}>
                {link.label}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </div>
        <div className="ape-footer__legal">
          <MonolithMark />
          <span>Chicago / 2026 / Signal 0731</span>
        </div>
      </footer>
    </div>
  );
}
