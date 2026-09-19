import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import ConversionCTA from "./ConversionCTA";
import {
  getScheduledEvents,
  getSeriesLabel,
  isTicketOnSale,
} from "@/lib/siteExperience";
import { getEventDetailsHref } from "@/lib/cta";
import { currentSunsets } from "@shared/events/sunsets-current";

/** A concise homepage view of the same live catalogue as the full calendar. */
export default function HomeUpcomingShows() {
  const events = getScheduledEvents().slice(0, 4);
  return (
    <section
      id="schedule"
      className="home-editorial-section home-upcoming"
      aria-labelledby="home-upcoming-title"
    >
      <div className="container layout-wide home-section-container">
        <header className="home-section-heading">
          <div>
            <p className="home-eyebrow">01 / The calendar</p>
            <h2 id="home-upcoming-title">Upcoming shows.</h2>
          </div>
          <Link href="/schedule" className="home-text-link">
            View full calendar
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </header>
        {events.length ? (
          <div className="home-show-grid">
            {events.map(event => {
              const onSale = isTicketOnSale(event);
              const finale = event.id === "css-sep19";
              const title = finale
                ? currentSunsets.headliners.join(" × ")
                : event.headline || event.title;
              const details = finale ? "/sunsets" : getEventDetailsHref(event);
              const postponed = event.eventStatus === "EventPostponed";
              const status = postponed
                ? "POSTPONED"
                : onSale
                  ? "Tickets available"
                  : event.status === "sold-out"
                    ? "Sold out"
                    : "Details to be announced";
              return (
                <article
                  className="home-show-card"
                  key={event.id}
                  data-event-id={event.id}
                  data-event-status={event.eventStatus}
                >
                  <div className="home-show-top">
                    <p className="home-eyebrow">
                      {getSeriesLabel(event.series)}
                    </p>
                    <span className="home-show-status" data-on-sale={onSale}>
                      {status}
                    </span>
                  </div>
                  <p className="home-show-date">
                    {postponed ? `Originally ${event.date}` : event.date}
                  </p>
                  <h3>
                    <Link href={details}>{title}</Link>
                  </h3>
                  {finale ? (
                    <p className="home-show-lineup">
                      With {currentSunsets.support.join(" · ")}
                    </p>
                  ) : event.lineup &&
                    !/^(tba|to be announced)$/i.test(event.lineup) ? (
                    <p className="home-show-lineup">{event.lineup}</p>
                  ) : (
                    <p className="home-show-lineup">Lineup to be announced.</p>
                  )}
                  <dl className="home-show-details">
                    <div>
                      <dt>{postponed ? "Original venue" : "Venue"}</dt>
                      <dd>
                        {event.venue}
                        <span>{event.location}</span>
                      </dd>
                    </div>
                    <div>
                      <dt>Time</dt>
                      <dd>
                        {postponed
                          ? "New date to be announced"
                          : /^(tba|reveal soon)$/i.test(event.time)
                            ? "To be announced"
                            : event.time}
                      </dd>
                    </div>
                  </dl>
                  <div className="home-show-action">
                    {onSale ? (
                      <ConversionCTA
                        event={event}
                        size="md"
                        showUrgency={false}
                        className="home-show-purchase"
                      />
                    ) : (
                      <Link className="home-secondary" href={details}>
                        {postponed
                          ? "Read postponement update"
                          : "View event details"}
                        <ArrowUpRight size={18} aria-hidden="true" />
                      </Link>
                    )}
                    {onSale && (
                      <span>
                        {finale
                          ? "Official checkout · AllEvents"
                          : "Official ticket checkout"}
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="home-show-empty">
            <h3>More nights ahead.</h3>
            <p>New dates will appear here when announced.</p>
            <Link className="home-secondary" href="/archive">
              Explore previous shows
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
