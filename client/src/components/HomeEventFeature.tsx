import SunsetsCampaignArtwork from "./SunsetsCampaignArtwork";
import HomeTicketLink from "./HomeTicketLink";
import { ArrowUpRight } from "lucide-react";
import {
  currentSunsets as event,
  sunsetsDateLabel,
  sunsetsTimeLabel,
  sunsetsUpdatedLabel,
  sunsetsStatusLabel,
  sunsetsShowVisible,
  sunsetsNeedsUpdate,
  sunsetsTicketsEnabled,
} from "@shared/events/sunsets-current";

export default function HomeEventFeature() {
  if (!sunsetsShowVisible()) return null;
  return (
    <section
      id="current-event"
      className="home-event-feature"
      data-event-status={event.status}
      aria-labelledby="current-event-title"
    >
      <div className="container layout-wide home-event-grid">
        <a
          href="/sunsets#event-update"
          className="home-event-art home-event-art-wide"
          aria-label="Open the Chasing Sun(Sets) event guide"
        >
          {sunsetsNeedsUpdate && (
            <span className="home-postponed-art-label">
              POSTPONED · ORIGINAL SEPTEMBER 19 ARTWORK
            </span>
          )}
          <SunsetsCampaignArtwork variant="wide" />
          <span className="home-artwork-action">
            Read the current event update{" "}
            <ArrowUpRight size={18} aria-hidden="true" />
          </span>
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
              <dt>
                {sunsetsNeedsUpdate ? "Original date · postponed" : "When"}
              </dt>
              <dd>
                {sunsetsDateLabel}
                <br />
                <span>
                  {sunsetsNeedsUpdate
                    ? "New date to be announced"
                    : sunsetsTimeLabel}
                </span>
              </dd>
            </div>
            <div>
              <dt>{sunsetsNeedsUpdate ? "Original venue" : "Where"}</dt>
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
              Check the event guide for confirmed updates and ticket-holder
              instructions.
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
