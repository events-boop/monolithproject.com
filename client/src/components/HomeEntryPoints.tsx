import {
  ArrowUpRight,
  Headphones,
  CalendarDays,
  MoveUpRight,
} from "lucide-react";
import { Link } from "wouter";
import { ROUTES } from "@shared/routes";
import {
  getPublishedCatalogue,
  needsTicketHolderUpdate,
  PUBLISHED_CTA_LABELS,
} from "@shared/events/publishedState";
import { getPublicEvents } from "@/lib/siteData";
import "@/styles/home-entry-points.css";

/** Permanent entrances stay visible whichever hero slide is showing. */
export default function HomeEntryPoints() {
  const catalogue = getPublishedCatalogue(getPublicEvents());
  const notice = catalogue.notices.find(entry =>
    needsTicketHolderUpdate(entry.state)
  );

  return (
    <section className="home-entry-points" aria-label="Explore Monolith">
      <div className="container layout-wide">
        <nav
          className="home-entry-grid"
          aria-label="Shows, radio and first access"
        >
          <Link href={ROUTES.schedule} className="home-entry-link">
            <span className="home-entry-label">
              <CalendarDays size={16} aria-hidden="true" />
              01 / Attend
            </span>
            <span className="home-entry-title">Find your next night.</span>
            <span className="home-entry-description">
              {catalogue.upcoming.length
                ? "Explore the calendar, lineups and event details."
                : "New dates are taking shape. Explore the calendar and updates."}
            </span>
            <span className="home-entry-action">
              Explore the shows <ArrowUpRight size={18} aria-hidden="true" />
            </span>
          </Link>
          <Link href={ROUTES.radio} className="home-entry-link">
            <span className="home-entry-label">
              <Headphones size={16} aria-hidden="true" />
              02 / Listen
            </span>
            <span className="home-entry-title">Stay on the frequency.</span>
            <span className="home-entry-description">
              Artist-led sets from Chasing Sunsets Radio. Keep listening between
              shows.
            </span>
            <span className="home-entry-action">
              Enter the listening room{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </span>
          </Link>
          <Link
            href={ROUTES.newsletter}
            data-first-access="true"
            className="home-entry-link home-entry-access"
          >
            <span className="home-entry-label">
              <MoveUpRight size={16} aria-hidden="true" />
              03 / First access
            </span>
            <span className="home-entry-title">Be here for what’s next.</span>
            <span className="home-entry-description">
              Join the Monolith list for future show announcements and updates.
            </span>
            <span className="home-entry-action">
              {PUBLISHED_CTA_LABELS["get-first-access"]}
              <ArrowUpRight size={18} aria-hidden="true" />
            </span>
          </Link>
        </nav>
        {notice &&
          (notice.state.kind === "postponed" ||
            notice.state.kind === "cancelled") && (
            <aside
              className="home-entry-notice"
              aria-label="Ticket-holder information"
            >
              <div>
                <span className="home-entry-notice-status">
                  {notice.state.kind === "postponed"
                    ? "Postponed"
                    : "Cancelled"}
                </span>
                <p>
                  <strong>{notice.event.headline || notice.event.title}</strong>
                  <span>
                    {notice.state.kind === "postponed"
                      ? "New date to be confirmed. Your ticket-holder update is here."
                      : "Read the latest event and ticket-holder information."}
                  </span>
                </p>
              </div>
              <a href={notice.state.statusUrl}>
                {PUBLISHED_CTA_LABELS["ticket-holder-update"]}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </aside>
          )}
      </div>
    </section>
  );
}
