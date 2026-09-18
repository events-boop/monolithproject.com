import HomeTicketLink from "./HomeTicketLink";
import { ArrowUpRight } from "lucide-react";
import {
  currentSunsets as event,
  sunsetsDateLabel,
  sunsetsTimeLabel,
  sunsetsUpdatedLabel,
  sunsetsStatusLabel,
  sunsetsTicketsEnabled,
} from "@shared/events/sunsets-current";

export default function HomeEventFeature() {
  return (
    <section
      id="current-event"
      className="home-event-feature"
      aria-labelledby="current-event-title"
    >
      <div className="container layout-wide home-event-grid">
        <a
          href="/sunsets"
          className="home-event-art"
          aria-label="Open the Chasing Sun(Sets) event guide"
        >
          <picture>
            <source
              type="image/avif"
              srcSet="/sunsets/assets/hero-480.avif 480w, /sunsets/assets/hero-960.avif 960w"
              sizes="(min-width: 900px) 440px, 90vw"
            />
            <img
              src="/sunsets/assets/hero-960.webp"
              width="1920"
              height="1920"
              alt={`${event.name}. ${sunsetsDateLabel}. ${event.venueName}, Chicago.`}
              loading="lazy"
            />
          </picture>
        </a>
        <div className="home-event-copy">
          <a
            href="/sunsets"
            className="home-sunsets-brand"
            aria-label="Chasing Sun(Sets) event guide"
          >
            <img
              className="home-sunsets-logo"
              src="/sunsets/assets/logo-640.webp"
              width="640"
              height="238"
              alt="Chasing Sun(Sets)"
              loading="lazy"
              decoding="async"
            />
          </a>
          <p className="home-eyebrow">III / 2026 season finale</p>
          <h2 id="current-event-title">
            {event.headliners[0]} <span>×</span>
            <br />
            {event.headliners[1]}
          </h2>
          <dl className="home-event-essentials">
            <div>
              <dt>When</dt>
              <dd>
                {sunsetsDateLabel}
                <br />
                <span>{sunsetsTimeLabel}</span>
              </dd>
            </div>
            <div>
              <dt>Where</dt>
              <dd>
                {event.venueName}
                <br />
                <span>{event.locationShort}</span>
              </dd>
            </div>
            <div>
              <dt>Admission</dt>
              <dd>21+ · Valid photo ID</dd>
            </div>
          </dl>
          <div className="home-event-lineup">
            <h3>With</h3>
            <p>{event.support.join(" · ")}</p>
            <p className="home-muted">
              {event.scheduleMessage.replace("Artists below", "Artists")}
            </p>
          </div>
          <div className="home-actions">
            <HomeTicketLink placement="event_details" />
            <a className="home-secondary" href="/sunsets">
              Full event guide <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
          <p className="home-ticket-note">
            {sunsetsTicketsEnabled()
              ? "Select your ticket option at AllEvents checkout."
              : "See the event guide for current ticket-holder instructions."}
          </p>
        </div>
        <aside
          className="home-event-notice"
          aria-label="Event status and weather information"
        >
          <div>
            <a
              className="home-status"
              data-status={event.status}
              href="/sunsets#event-status"
            >
              <span aria-hidden="true" />
              {sunsetsStatusLabel()}
            </a>
            <p>
              Updated{" "}
              <time dateTime={event.updatedAt}>{sunsetsUpdatedLabel}</time>
            </p>
          </div>
          <div>
            <h3>{event.statusHeading}</h3>
            <p>{event.statusMessage}</p>
            <p>
              Rain or shine. Check the event guide for weather updates and
              ticket-holder instructions.
            </p>
            <a className="home-text-link" href="/sunsets#weather">
              Weather & event information{" "}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
