import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Calendar, Clock, MapPin, Ticket, Users } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SlimSubscribeStrip from "@/components/SlimSubscribeStrip";
import { upcomingEvents, type ScheduledEvent } from "@/data/events";
import { fetchSocialEcho, type SocialEchoEvent, type SocialEchoResponse } from "@/lib/api";

type SeriesFilter = "all" | ScheduledEvent["series"];
type StatusFilter = "all" | ScheduledEvent["status"];

const seriesFilters: Array<{ value: SeriesFilter; label: string; className: string }> = [
  { value: "all", label: "All Series", className: "border-white/30 text-white hover:border-white/60" },
  { value: "chasing-sunsets", label: "Chasing Sun(Sets)", className: "border-clay/70 text-clay hover:border-clay" },
  { value: "untold-story", label: "Untold Story", className: "border-primary/70 text-primary hover:border-primary" },
  { value: "monolith-project", label: "Monolith Project", className: "border-cyan-300/70 text-cyan-300 hover:border-cyan-300" },
];

const statusFilters: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All Statuses" },
  { value: "on-sale", label: "On Sale" },
  { value: "coming-soon", label: "Coming Soon" },
  { value: "sold-out", label: "Sold Out" },
];

const statusConfig: Record<
  ScheduledEvent["status"],
  { label: string; pillClass: string; borderClass: string; ctaLabel: string }
> = {
  "on-sale": {
    label: "On Sale",
    pillClass: "bg-emerald-400/15 text-emerald-200 border-emerald-200/35",
    borderClass: "hover:border-emerald-300/45",
    ctaLabel: "Get Tickets",
  },
  "coming-soon": {
    label: "Coming Soon",
    pillClass: "bg-amber-300/15 text-amber-100 border-amber-100/40",
    borderClass: "hover:border-amber-200/45",
    ctaLabel: "Stay Ready",
  },
  "sold-out": {
    label: "Sold Out",
    pillClass: "bg-rose-400/15 text-rose-200 border-rose-200/35",
    borderClass: "hover:border-rose-300/45",
    ctaLabel: "Join Waitlist",
  },
};

function parseEventDate(dateLabel: string) {
  const parsed = Date.parse(dateLabel);
  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
}

function getSeriesLabel(series: ScheduledEvent["series"]) {
  if (series === "untold-story") return "Untold Story";
  if (series === "chasing-sunsets") return "Chasing Sun(Sets)";
  return "Monolith Project";
}

function getEventDetailsPath(event: ScheduledEvent) {
  if (event.id === "us-s3e2") return "/untold-story-deron-juany-bravo";
  if (event.series === "untold-story") return "/series/untold-story";
  if (event.series === "chasing-sunsets") return "/series/chasing-sunsets";
  return "/series/monolith-project";
}

function getEventCta(event: ScheduledEvent) {
  const ctaLabel = event.ctaLabel || statusConfig[event.status].ctaLabel;
  if (event.status === "on-sale" && event.ticketUrl) {
    return { href: event.ticketUrl, label: ctaLabel, external: true as const };
  }
  return { href: "/tickets", label: ctaLabel, external: false as const };
}

function findEchoForEvent(event: ScheduledEvent, echoEvents: SocialEchoEvent[]) {
  const titleNeedle = event.title.toLowerCase();
  const episodeNeedle = event.episode.toLowerCase();
  return (
    echoEvents.find((echo) => {
      if (echo.eventId && echo.eventId === event.id) return true;
      const echoTitle = (echo.eventTitle || "").toLowerCase();
      if (echoTitle && (echoTitle.includes(titleNeedle) || titleNeedle.includes(echoTitle))) return true;
      return echoTitle.includes(episodeNeedle);
    }) || null
  );
}

function EventAction({
  href,
  label,
  external,
  className,
}: {
  href: string;
  label: string;
  external: boolean;
  className: string;
}) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
        <ArrowUpRight className="w-3.5 h-3.5" />
      </a>
    );
  }

  return (
    <Link href={href}>
      <a className={className}>{label}</a>
    </Link>
  );
}

export default function Events() {
  const [seriesFilter, setSeriesFilter] = useState<SeriesFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [socialEcho, setSocialEcho] = useState<SocialEchoResponse | null>(null);
  const [socialEchoError, setSocialEchoError] = useState<string | null>(null);

  const orderedEvents = useMemo(() => {
    return [...upcomingEvents].sort((a, b) => parseEventDate(a.date) - parseEventDate(b.date));
  }, []);

  const activeEvents = useMemo(() => {
    return orderedEvents.filter((event) => event.status === "on-sale");
  }, [orderedEvents]);

  const featuredEvent = useMemo(() => {
    return activeEvents[0] || orderedEvents[0];
  }, [activeEvents, orderedEvents]);

  const secondaryFeaturedEvent = useMemo(() => {
    return activeEvents[1];
  }, [activeEvents]);

  const filteredEvents = useMemo(() => {
    return orderedEvents.filter((event) => {
      const seriesMatch = seriesFilter === "all" || event.series === seriesFilter;
      const statusMatch = statusFilter === "all" || event.status === statusFilter;
      return seriesMatch && statusMatch;
    });
  }, [orderedEvents, seriesFilter, statusFilter]);

  const featuredCta = getEventCta(featuredEvent);
  const secondaryCta = secondaryFeaturedEvent ? getEventCta(secondaryFeaturedEvent) : null;
  const featuredEcho = socialEcho ? findEchoForEvent(featuredEvent, socialEcho.events) : null;
  const secondaryEcho =
    socialEcho && secondaryFeaturedEvent ? findEchoForEvent(secondaryFeaturedEvent, socialEcho.events) : null;

  useEffect(() => {
    let isMounted = true;

    const loadSocialEcho = async () => {
      try {
        const payload = await fetchSocialEcho();
        if (!isMounted) return;
        setSocialEcho(payload);
        setSocialEchoError(null);
      } catch (error) {
        if (!isMounted) return;
        setSocialEchoError(error instanceof Error ? error.message : "Unable to load live attendance.");
      }
    };

    void loadSocialEcho();
    const intervalId = window.setInterval(() => {
      void loadSocialEcho();
    }, 20000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden"
      style={{ background: "linear-gradient(180deg,#89939c 0%,#5c697e 12%,#273856 42%,#10192f 70%,#0b1327 100%)" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(255,255,255,0.2),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(34,211,238,0.2),transparent_34%),radial-gradient(circle_at_65%_86%,rgba(139,92,246,0.2),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(9,12,24,0)_0%,rgba(9,12,24,0.35)_34%,rgba(5,9,20,0.72)_72%,rgba(5,9,20,0.9)_100%)]" />

      <Navigation />

      <section className="relative pt-44 pb-16 px-6">
        <div className="container max-w-6xl mx-auto relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="font-mono text-xs tracking-[0.24em] uppercase text-white/65 mb-6"
          >
            2026 Event Calendar
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="font-display text-[clamp(3.2rem,12vw,8.2rem)] leading-[0.86] tracking-tight-display mb-6"
          >
            EVENTS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="max-w-2xl text-white/80 text-base md:text-lg"
          >
            Active drops, RSVP windows, and all upcoming chapters in one place. Use filters to dial in by series or status.
          </motion.p>
        </div>
      </section>

      <section className="px-6 pb-10">
        <div className="container max-w-6xl mx-auto">
          <div className="border border-white/20 bg-white/10 backdrop-blur-xl p-5 md:p-6 rounded-2xl">
            <div className="flex flex-wrap gap-2 mb-4">
              {seriesFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setSeriesFilter(filter.value)}
                  className={`px-4 py-2 text-[11px] font-bold tracking-[0.16em] uppercase border rounded-full transition-colors ${
                    seriesFilter === filter.value ? filter.className : "border-white/20 text-white/80 hover:text-white"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setStatusFilter(filter.value)}
                  className={`px-4 py-2 text-[11px] font-bold tracking-[0.16em] uppercase border rounded-full transition-colors ${
                    statusFilter === filter.value
                      ? "border-cyan-300/70 text-cyan-100 bg-cyan-300/10"
                      : "border-white/20 text-white/80 hover:text-white"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="container max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-5 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className={`border rounded-2xl p-6 md:p-7 backdrop-blur-lg ${statusConfig[featuredEvent.status].borderClass}`}
              style={{
                background:
                  "linear-gradient(145deg,rgba(168,182,197,0.28) 0%,rgba(48,65,98,0.45) 42%,rgba(10,18,38,0.78) 100%)",
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <span className="font-mono text-xs tracking-[0.22em] uppercase text-white/70">Feature One</span>
                <span
                  className={`px-3 py-1 text-[11px] font-bold tracking-[0.16em] uppercase border rounded-full ${
                    statusConfig[featuredEvent.status].pillClass
                  }`}
                >
                  {statusConfig[featuredEvent.status].label}
                </span>
              </div>

              <div className="overflow-hidden rounded-xl border border-white/20 mb-5">
                <img
                  src={featuredEvent.image || "/images/untold-story.jpg"}
                  alt={`${featuredEvent.title} event visual`}
                  className="w-full h-[240px] object-cover"
                />
              </div>

              <h2 className="font-display text-3xl md:text-5xl leading-[0.9] mb-3">{featuredEvent.title}</h2>
              <p className="text-white/75 mb-6">
                {featuredEvent.eventNotice || featuredEvent.description || "Fresh chapter. Limited room. Move early."}
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm mb-6">
                <p className="flex items-center gap-2 text-white/85">
                  <Calendar className="w-4 h-4 text-white/55" />
                  <span>{featuredEvent.date}</span>
                </p>
                <p className="flex items-center gap-2 text-white/85">
                  <Clock className="w-4 h-4 text-white/55" />
                  <span>{featuredEvent.time}</span>
                </p>
                <p className="flex items-center gap-2 text-white/85 col-span-2">
                  <MapPin className="w-4 h-4 text-white/55" />
                  <span>
                    {featuredEvent.venue} · {featuredEvent.location}
                  </span>
                </p>
              </div>

              {featuredEcho && (
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 text-[10px] font-bold tracking-[0.14em] uppercase border border-cyan-200/45 text-cyan-100 rounded-full inline-flex items-center gap-1.5">
                    <Users className="w-3 h-3" />
                    {featuredEcho.goingCount} Going
                  </span>
                  {featuredEcho.pendingCount > 0 && (
                    <span className="px-3 py-1 text-[10px] font-bold tracking-[0.14em] uppercase border border-amber-200/45 text-amber-100 rounded-full">
                      {featuredEcho.pendingCount} Pending
                    </span>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <EventAction
                  href={featuredCta.href}
                  label={featuredCta.label}
                  external={featuredCta.external}
                  className="px-4 py-2 border border-clay/70 text-clay rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-clay/10 transition-colors inline-flex items-center gap-2"
                />
                <Link href={getEventDetailsPath(featuredEvent)}>
                  <a className="px-4 py-2 border border-white/25 rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:border-white/55 transition-colors">
                    View Details
                  </a>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="border border-white/20 rounded-2xl p-6 md:p-7 backdrop-blur-lg"
              style={{
                background:
                  "linear-gradient(155deg,rgba(34,211,238,0.18) 0%,rgba(139,92,246,0.2) 38%,rgba(18,27,52,0.76) 100%)",
              }}
            >
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-cyan-100/90 block mb-4">
                Feature Two
              </span>

              {secondaryFeaturedEvent ? (
                <>
                  <div className="overflow-hidden rounded-xl border border-white/20 mb-5">
                    <img
                      src={secondaryFeaturedEvent.image || "/images/autograf-recap.jpg"}
                      alt={`${secondaryFeaturedEvent.title} event visual`}
                      className="w-full h-[240px] object-cover"
                    />
                  </div>
                  <h3 className="font-display text-3xl md:text-4xl leading-[0.92] mb-3">{secondaryFeaturedEvent.title}</h3>
                  <p className="text-white/75 mb-6">
                    {secondaryFeaturedEvent.eventNotice || secondaryFeaturedEvent.description || "Early window is live right now."}
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm mb-6">
                    <p className="flex items-center gap-2 text-white/85">
                      <Calendar className="w-4 h-4 text-white/55" />
                      <span>{secondaryFeaturedEvent.date}</span>
                    </p>
                    <p className="flex items-center gap-2 text-white/85">
                      <Clock className="w-4 h-4 text-white/55" />
                      <span>{secondaryFeaturedEvent.time}</span>
                    </p>
                    <p className="flex items-center gap-2 text-white/85 col-span-2">
                      <MapPin className="w-4 h-4 text-white/55" />
                      <span>
                        {secondaryFeaturedEvent.venue} · {secondaryFeaturedEvent.location}
                      </span>
                    </p>
                  </div>
                  {secondaryEcho && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 text-[10px] font-bold tracking-[0.14em] uppercase border border-cyan-200/45 text-cyan-100 rounded-full inline-flex items-center gap-1.5">
                        <Users className="w-3 h-3" />
                        {secondaryEcho.goingCount} Going
                      </span>
                      {secondaryEcho.pendingCount > 0 && (
                        <span className="px-3 py-1 text-[10px] font-bold tracking-[0.14em] uppercase border border-amber-200/45 text-amber-100 rounded-full">
                          {secondaryEcho.pendingCount} Pending
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3">
                    {secondaryCta && (
                      <EventAction
                        href={secondaryCta.href}
                        label={secondaryCta.label}
                        external={secondaryCta.external}
                        className="px-4 py-2 border border-cyan-300/70 text-cyan-100 rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-cyan-300/10 transition-colors inline-flex items-center gap-2"
                      />
                    )}
                    {secondaryFeaturedEvent.ticketUrl && (
                      <a
                        href={secondaryFeaturedEvent.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border border-white/25 rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:border-white/55 transition-colors inline-flex items-center gap-2"
                      >
                        Open Posh Flyer
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-display text-3xl md:text-4xl leading-[0.92] mb-3">Early Mover Highlight</h3>
                  <p className="text-white/75 mb-6">
                    This slot automatically promotes the next active chapter as soon as a status flips to On Sale.
                  </p>
                  <Link href="/tickets">
                    <a className="px-4 py-2 border border-cyan-300/70 text-cyan-100 rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-cyan-300/10 transition-colors inline-flex items-center gap-2">
                      Track On Tickets
                    </a>
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          <div className="border border-white/20 rounded-2xl p-5 md:p-6 backdrop-blur-lg mb-8 bg-[linear-gradient(145deg,rgba(255,255,255,0.16),rgba(11,18,36,0.65))]">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/60 mb-2">Social Echo</p>
                <h3 className="font-display text-2xl md:text-3xl">Live Attendance Momentum</h3>
              </div>
              <span className="px-3 py-1 text-[10px] font-bold tracking-[0.15em] uppercase border border-white/30 rounded-full text-white/75">
                Refreshes every 20s
              </span>
            </div>

            {socialEcho ? (
              <>
                <div className="grid sm:grid-cols-3 gap-3 mb-5">
                  <div className="border border-white/20 rounded-xl p-3 bg-black/20">
                    <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/55 mb-1">Total Going</p>
                    <p className="font-display text-3xl">{socialEcho.summary.totalGoing}</p>
                  </div>
                  <div className="border border-white/20 rounded-xl p-3 bg-black/20">
                    <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/55 mb-1">Pending Approval</p>
                    <p className="font-display text-3xl">{socialEcho.summary.totalPending}</p>
                  </div>
                  <div className="border border-white/20 rounded-xl p-3 bg-black/20">
                    <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/55 mb-1">Live Events</p>
                    <p className="font-display text-3xl">{socialEcho.summary.liveEvents}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-white/20 rounded-xl p-4 bg-black/20">
                    <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/55 mb-3">Top Events</p>
                    <div className="space-y-2">
                      {socialEcho.events.slice(0, 4).map((event) => (
                        <div key={event.eventKey} className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-sm text-white/85 truncate pr-3">{event.eventTitle || event.eventKey}</span>
                          <span className="font-mono text-xs text-white/60">{event.goingCount} going</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border border-white/20 rounded-xl p-4 bg-black/20">
                    <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/55 mb-3">Recent Activity</p>
                    <div className="space-y-2">
                      {socialEcho.activity.slice(0, 5).map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between border-b border-white/10 pb-2">
                          <p className="text-sm text-white/82 truncate pr-3">
                            {activity.attendeeAlias} joined {activity.eventTitle || "an event"}
                          </p>
                          <span className="font-mono text-xs text-white/55">+{activity.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="border border-white/20 rounded-xl p-4 bg-black/20">
                <p className="text-white/75 text-sm">
                  {socialEchoError || "Waiting for live attendance signals from webhook events."}
                </p>
              </div>
            )}
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div layout className="grid md:grid-cols-2 gap-4 md:gap-5">
              {filteredEvents.map((event) => {
                const detailsHref = getEventDetailsPath(event);
                const cta = getEventCta(event);
                return (
                  <motion.article
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 14 }}
                    transition={{ duration: 0.3 }}
                    className={`border rounded-2xl p-5 md:p-6 transition-colors backdrop-blur-md ${statusConfig[event.status].borderClass}`}
                    style={{
                      background:
                        "linear-gradient(155deg,rgba(255,255,255,0.16) 0%,rgba(23,33,60,0.52) 46%,rgba(11,18,36,0.7) 100%)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-white/60 mb-2">{event.episode}</p>
                        <h3 className="font-display text-2xl md:text-3xl leading-[0.92]">{event.title}</h3>
                      </div>
                      <span
                        className={`px-3 py-1 text-[10px] font-bold tracking-[0.15em] uppercase border rounded-full ${
                          statusConfig[event.status].pillClass
                        }`}
                      >
                        {statusConfig[event.status].label}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 text-sm mb-5">
                      <p className="flex items-center gap-2 text-white/85">
                        <Calendar className="w-4 h-4 text-white/50" />
                        <span>{event.date}</span>
                      </p>
                      <p className="flex items-center gap-2 text-white/85">
                        <Clock className="w-4 h-4 text-white/50" />
                        <span>{event.time}</span>
                      </p>
                      <p className="flex items-center gap-2 text-white/85 sm:col-span-2">
                        <MapPin className="w-4 h-4 text-white/50" />
                        <span>
                          {event.venue} · {event.location}
                        </span>
                      </p>
                    </div>

                    <p className="text-white/70 text-sm mb-6">
                      {event.eventNotice || event.lineup || event.sound || event.format || "Lineup and format details are dropping soon."}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <Link href={detailsHref}>
                        <a className="px-4 py-2 border border-white/25 rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:border-white/55 transition-colors">
                          View Details
                        </a>
                      </Link>
                      <EventAction
                        href={cta.href}
                        label={cta.label}
                        external={cta.external}
                        className="px-4 py-2 border border-clay/65 text-clay rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-clay/10 transition-colors inline-flex items-center gap-2"
                      />
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {filteredEvents.length === 0 && (
            <div className="text-center border border-white/15 bg-white/10 backdrop-blur-xl rounded-2xl py-14 px-6 mt-4">
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-white/65 mb-3">No Matching Events</p>
              <p className="text-white/80 mb-6">Try another filter or check back after the next announcement drop.</p>
              <Link href="/tickets">
                <a className="btn-pill-coral inline-flex">Go To Tickets</a>
              </Link>
            </div>
          )}
        </div>
      </section>

      <SlimSubscribeStrip title="GET EVENT DROPS FIRST" source="events_page_strip" />
      <Footer />
    </div>
  );
}
