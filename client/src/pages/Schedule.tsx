import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Bookmark,
  Check,
  CalendarPlus,
  Plus,
} from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import ConversionCTA from "@/components/ConversionCTA";
import JoinSignalSection from "@/components/JoinSignalSection";
import ScheduleSeriesKey from "@/components/ScheduleSeriesKey";
import { getScheduledEvents, getSeriesLabel } from "@/lib/siteExperience";
import { usePublicSiteDataVersion } from "@/lib/siteData";
import {
  getScheduleDate,
  getScheduleVenue,
  compareScheduleEvents,
  canAddEventToCalendar,
} from "@/lib/schedulePresentation";
import { downloadEventCalendar } from "@/lib/calendar";
import { getEventDetailsHref } from "@/lib/cta";
import { buildScheduleSchema } from "@/lib/schema";
import { TICKET_POLICY } from "@shared/events/ticket-policy";
import type { ScheduledEvent } from "@shared/events/types";
import "@/styles/schedule.css";

function statusLabel(event: ScheduledEvent) {
  if (event.eventStatus === "EventPostponed") return "Postponed";
  if (event.eventStatus === "EventCancelled") return "Cancelled";
  if (event.confirmationStatus === "pending") return "Details pending";
  return event.status === "on-sale"
    ? "Tickets available"
    : event.status === "sold-out"
      ? "Sold out"
      : "Announcement to follow";
}
function eventTime(event: ScheduledEvent) {
  if (event.eventStatus === "EventPostponed") return "New date to be announced";
  if (event.confirmationStatus === "pending" || !getScheduleDate(event).hasDay)
    return "Date / time to be confirmed";
  return event.time;
}
export default function Schedule() {
  usePublicSiteDataVersion();
  const events = [...getScheduledEvents()].sort(compareScheduleEvents);
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [series, setSeries] = useState("all");
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      const values = JSON.parse(
        localStorage.getItem("monolith-starred-rites") || "[]"
      );
      return Array.isArray(values)
        ? values.filter((id): id is string => typeof id === "string")
        : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("monolith-starred-rites", JSON.stringify(saved));
    } catch {
      /* Browsing remains available without device storage. */
    }
  }, [saved]);
  const months = [
    "ALL",
    ...Array.from(new Set(events.map(event => getScheduleDate(event).month))),
  ];
  const visible = events.filter(event => {
    const matchesDate =
      filter === "ALL" ||
      (filter === "MY_LINEUP"
        ? saved.includes(event.id)
        : getScheduleDate(event).month === filter);
    const searchable = [
      event.title,
      event.headline,
      event.lineup,
      getScheduleVenue(event),
      event.location,
      getSeriesLabel(event.series),
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase();
    return (
      matchesDate &&
      (series === "all" || event.series === series) &&
      searchable.includes(query.trim().toLocaleLowerCase())
    );
  });
  const groups = Array.from(
    new Set(visible.map(event => getScheduleDate(event).key))
  );
  const toggleSaved = (id: string) =>
    setSaved(items =>
      items.includes(id) ? items.filter(value => value !== id) : [...items, id]
    );
  return (
    <div className="monolith-schedule min-h-screen bg-background text-foreground">
      <SEO
        title="Upcoming Shows | The Monolith Project"
        absoluteTitle
        description="Confirmed dates, forthcoming chapters and ticket-holder updates from The Monolith Project."
        canonicalPath="/schedule"
        schemaData={buildScheduleSchema(events)}
      />
      <Navigation />
      <main
        id="main-content"
        tabIndex={-1}
        className="page-shell-start schedule-editorial-main"
      >
        <div className="container layout-wide">
          <header className="schedule-editorial-header">
            <div>
              <p className="section-kicker">The Monolith Project / Calendar</p>
              <h1 className="schedule-page-title">
                Find your
                <br />
                next night.
              </h1>
              <p className="schedule-page-intro">
                Confirmed dates, forthcoming chapters and the latest
                ticket-holder updates. All times are Chicago time.
              </p>
            </div>
            <Link href="/newsletter" className="home-text-link">
              Get show announcements{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </header>
          <div className="schedule-discovery-search">
            <label className="schedule-search-field">
              <span>Find a show</span>
              <input
                type="search"
                aria-label="Search shows"
                placeholder="Artist, show or venue"
                value={query}
                onChange={event => setQuery(event.target.value)}
              />
            </label>
            <label className="schedule-series-field">
              <span>Series</span>
              <select
                aria-label="Filter shows by series"
                value={series}
                onChange={event => setSeries(event.target.value)}
              >
                <option value="all">All series</option>
                <option value="chasing-sunsets">Chasing Sun(Sets)</option>
                <option value="untold-story">Untold Story</option>
                <option value="monolith-project">Monolith Project</option>
              </select>
            </label>
          </div>
          <div className="schedule-editorial-toolbar">
            <div
              className="schedule-filters"
              role="group"
              aria-label="Filter events"
            >
              {[...months, "MY_LINEUP"].map(month => (
                <button
                  type="button"
                  key={month}
                  data-schedule-filter={month}
                  aria-pressed={filter === month}
                  onClick={() => setFilter(month)}
                >
                  {month === "MY_LINEUP"
                    ? "Saved"
                    : month === "TO BE ANNOUNCED"
                      ? "Dates pending"
                      : month === "ALL"
                        ? "All shows"
                        : month}
                </button>
              ))}
            </div>
            <ScheduleSeriesKey />
          </div>
          <div className="schedule-result-summary" role="status">
            <p>
              {visible.length} {visible.length === 1 ? "show" : "shows"}
              {query.trim() ? ` matching “${query.trim()}”` : " in view"}
            </p>
            {(query || series !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSeries("all");
                  setFilter("ALL");
                }}
              >
                Clear filters
              </button>
            )}
          </div>
          <div className="schedule-editorial-groups" aria-live="polite">
            {!visible.length && (
              <div className="schedule-editorial-empty">
                <h2>
                  {query.trim() || series !== "all"
                    ? "No shows match this search."
                    : filter === "MY_LINEUP"
                      ? "Your next nights, saved."
                      : "More nights ahead."}
                </h2>
                <p>
                  {query.trim() || series !== "all"
                    ? "Try another artist, show or venue, or clear the filters."
                    : filter === "MY_LINEUP"
                      ? "Use the bookmark on a show to keep it here on this device."
                      : "New dates will appear here once confirmed."}
                </p>
                <Link className="home-text-link" href="/archive">
                  Explore previous shows{" "}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              </div>
            )}
            {groups.map(key => {
              const groupEvents = visible.filter(
                event => getScheduleDate(event).key === key
              );
              return (
                <section
                  key={key}
                  className="schedule-editorial-group"
                  aria-label={getScheduleDate(groupEvents[0]).heading}
                >
                  <h2 data-calendar-month>
                    {getScheduleDate(groupEvents[0]).heading}
                  </h2>
                  {groupEvents.map(event => {
                    const postponed = event.eventStatus === "EventPostponed";
                    const date = getScheduleDate(event);
                    const detailsHref =
                      event.id === "css-sep19"
                        ? "/sunsets#event-update"
                        : getEventDetailsHref(event);
                    return (
                      <article
                        key={event.id}
                        data-event-id={event.id}
                        data-event-status={event.eventStatus}
                        className="schedule-editorial-card signal-etched-frame"
                        data-signal-tone={event.series}
                      >
                        <div className="schedule-editorial-date">
                          <span>
                            {postponed
                              ? "Original date"
                              : date.hasDay
                                ? "Confirmed date"
                                : "Date pending"}
                          </span>
                          <strong>{date.label}</strong>
                          <span>{eventTime(event)}</span>
                        </div>
                        <div className="schedule-editorial-copy">
                          <div className="schedule-editorial-tags">
                            <span>{getSeriesLabel(event.series)}</span>
                            <span data-event-state={event.eventStatus}>
                              {statusLabel(event)}
                            </span>
                          </div>
                          <h3>
                            <Link href={detailsHref}>
                              {event.headline || event.title}
                            </Link>
                          </h3>
                          <p>
                            {postponed
                              ? event.eventNotice
                              : event.description ||
                                event.experienceIntro ||
                                "The next announcement will include the confirmed details."}
                          </p>
                          <p className="schedule-editorial-venue">
                            {postponed ? "Original venue: " : ""}
                            {getScheduleVenue(event)} · {event.location}
                          </p>
                        </div>
                        <div className="schedule-editorial-actions">
                          <ConversionCTA
                            event={event}
                            size="sm"
                            showUrgency={false}
                          />
                          <div className="schedule-editorial-tools">
                            <button
                              type="button"
                              aria-pressed={saved.includes(event.id)}
                              aria-label={`${saved.includes(event.id) ? "Remove" : "Save"} ${event.title}`}
                              onClick={() => toggleSaved(event.id)}
                            >
                              {saved.includes(event.id) ? (
                                <Check size={18} aria-hidden="true" />
                              ) : (
                                <Bookmark size={18} aria-hidden="true" />
                              )}
                            </button>
                            <button
                              type="button"
                              disabled={!canAddEventToCalendar(event)}
                              aria-label={
                                canAddEventToCalendar(event)
                                  ? `Add ${event.title} to calendar`
                                  : "Calendar unavailable"
                              }
                              title={
                                canAddEventToCalendar(event)
                                  ? "Add to calendar"
                                  : "Calendar available once the date is confirmed"
                              }
                              onClick={() =>
                                canAddEventToCalendar(event) &&
                                downloadEventCalendar(event)
                              }
                            >
                              <CalendarPlus size={18} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <details className="schedule-editorial-details">
                          <summary>
                            More information{" "}
                            <Plus size={16} aria-hidden="true" />
                          </summary>
                          <div>
                            <dl>
                              <div>
                                <dt>
                                  {postponed ? "Original lineup" : "Lineup"}
                                </dt>
                                <dd>{event.lineup || "To be announced"}</dd>
                              </div>
                              <div>
                                <dt>Admission</dt>
                                <dd>
                                  {event.age ||
                                    "Entry information to be announced"}
                                </dd>
                              </div>
                            </dl>
                            {postponed && <p>{TICKET_POLICY.sunsetsRefund}</p>}
                            <Link className="home-text-link" href={detailsHref}>
                              {postponed
                                ? "Ticket-holder information"
                                : "Full event details"}{" "}
                              <ArrowUpRight size={16} aria-hidden="true" />
                            </Link>
                          </div>
                        </details>
                      </article>
                    );
                  })}
                </section>
              );
            })}
          </div>
        </div>
      </main>
      <JoinSignalSection />
    </div>
  );
}
