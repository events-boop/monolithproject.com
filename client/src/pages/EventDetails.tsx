import {
  buildEventSeoTitle,
  buildEventSeoDescription,
} from "@shared/seo/event-copy";
import {
  getScheduleVenue,
  canAddEventToCalendar,
} from "@/lib/schedulePresentation";
import {
  getEventArtists,
  getArtistRecording,
  getArtistAudioTrack,
} from "@/lib/artistEventDiscovery";
import {
  buildGoogleCalendarUrl,
  downloadEventCalendar,
} from "@/lib/calendar";
import { useOptionalGlobalAudio } from "@/contexts/AudioContext";
import { capturePostHogEvent } from "@/lib/posthog";
import { useEffect } from "react";
import { Link, useLocation, useRoute } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { getPublicEvents, usePublicSiteDataVersion } from "@/lib/siteData";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarPlus,
  Camera,
  CheckCircle2,
  Clock,
  Headphones,
  MapPin,
  Play,
  Ticket,
  Star,
} from "lucide-react";
import MagneticButton from "@/components/MagneticButton";
import ConversionCTA from "@/components/ConversionCTA";
import JoinSignalSection from "@/components/JoinSignalSection";
import ResponsiveImage from "@/components/ResponsiveImage";
import {
  getSeriesLabel,
  getSeriesColor,
  getEventStartTimestamp,
} from "@/lib/siteExperience";
import { useCountdown, padCountdown } from "@/hooks/useCountdown";
import { buildBreadcrumbSchema, buildScheduledEventSchema } from "@/lib/schema";
import { trackAccessEvent } from "@/lib/api";
import { ROUTES } from "@shared/routes";
import {
  TICKET_POLICY,
  SUNSETS_REFUND_REQUEST_URL,
} from "@shared/events/ticket-policy";

function getStatusLabel(status: string) {
  if (status === "on-sale") return "ON SALE";
  if (status === "coming-soon") return "DETAILS PENDING";
  if (status === "sold-out") return "SOLD OUT";
  return "PAST";
}

function getTicketPathCopy(
  event: NonNullable<ReturnType<typeof getPublicEvents>[number]>
) {
  if (event.eventStatus === "EventPostponed")
    return "Postponed — read the event update";
  if (event.status === "on-sale")
    return event.inventoryState === "low"
      ? "Final inventory moving"
      : "Tickets available now";
  if (event.status === "coming-soon")
    return event.series === "monolith-project"
      ? "Details release pending"
      : event.recentlyDropped
        ? "Presale list open"
        : "Drop list before public sale";
  if (event.status === "sold-out") return "Sold out";
  return "Archive event";
}

function getArrivalCopy(
  event: NonNullable<ReturnType<typeof getPublicEvents>[number]>
) {
  if (event.confirmationStatus === "pending")
    return "Arrival information to be announced";
  if (event.doors) return `Doors ${event.doors}`;
  if (event.series === "chasing-sunsets") return "Arrive for golden hour";
  if (event.series === "untold-story") return "Arrive before peak room";
  return event.time;
}

function getPriceCopy(
  event: NonNullable<ReturnType<typeof getPublicEvents>[number]>
) {
  const availableTier = event.ticketTiers?.find(tier => tier.available);
  if (availableTier) return `From $${availableTier.price}`;
  if (event.startingPrice) return `From $${event.startingPrice}`;
  if (event.status === "coming-soon")
    return event.series === "monolith-project"
      ? "Entry details pending"
      : "Price release pending";
  return "See event details";
}

function getEventFitCopy(
  event: NonNullable<ReturnType<typeof getPublicEvents>[number]>
) {
  if (event.series === "chasing-sunsets") return "Open-air house music";
  if (event.series === "untold-story") return "After-dark club pressure";
  if (event.id === "hof-kashmir-jul31")
    return "House of Friends give-back pop-up";
  return "Chicago music gathering";
}

function getSeriesHref(
  series: NonNullable<ReturnType<typeof getPublicEvents>[number]>["series"]
) {
  if (series === "chasing-sunsets") return ROUTES.chasingSunsets;
  if (series === "untold-story") return ROUTES.untoldStory;
  return "/about";
}

function getSeriesContextCopy(
  series: NonNullable<ReturnType<typeof getPublicEvents>[number]>["series"]
) {
  if (series === "chasing-sunsets") return "Open-air season context";
  if (series === "untold-story") return "After-dark chapter context";
  return "Monolith world context";
}

export default function EventDetails() {
  usePublicSiteDataVersion();
  const [, params] = useRoute("/events/:slug");
  const [, setLocation] = useLocation();
  const slug = params?.slug;

  const event = getPublicEvents().find(e => e.slug === slug || e.id === slug);

  // Countdown renders only against a published, future event window — never a TBD
  // date. getEventStartTimestamp returns null while the window is unpublished, so
  // the honest standby copy (getArrivalCopy) stays in place until then.
  const doorsTarget = event ? getEventStartTimestamp(event) : null;
  const doorsCountdown = useCountdown(doorsTarget);
  const showDoorsCountdown = Boolean(
    event &&
    doorsTarget &&
    !doorsCountdown.isExpired &&
    doorsTarget > Date.now()
  );
  const canonicalEventSlug = event?.slug || event?.id;
  const canonicalEventPath = canonicalEventSlug
    ? `/events/${canonicalEventSlug}`
    : `/events/${slug}`;
  const navigationBrand =
    event?.series === "chasing-sunsets"
      ? "chasing-sunsets"
      : event?.series === "untold-story"
        ? "untold-story"
        : "monolith";

  useEffect(() => {
    if (event?.id)
      capturePostHogEvent("event_view", {
        event_id: event.id,
        source: "event_details",
      });
  }, [event?.id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!event || !slug || !canonicalEventSlug || slug === canonicalEventSlug)
      return;
    setLocation(canonicalEventPath, { replace: true });
  }, [canonicalEventPath, canonicalEventSlug, event, setLocation, slug]);

  if (!event) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="font-display text-4xl mb-4">Event not found</h1>
        <p className="font-mono text-white/70 mb-8">
          The requested event data could not be located.
        </p>
        <MagneticButton>
          <button
            onClick={() => setLocation("/schedule")}
            className="btn-pill-outline"
          >
            Return to Schedule
          </button>
        </MagneticButton>
      </div>
    );
  }

  const bgImage = event.image || "/images/hero-monolith.webp";
  const eventArtists = getEventArtists(event);
  const postponed = event.eventStatus === "EventPostponed";
  const pageTitle = postponed
    ? `${event.headline || event.title} — Postponed`
    : buildEventSeoTitle(event);
  const pageDescription = postponed
    ? event.eventNotice || "Postponed. A new date is not yet confirmed."
    : buildEventSeoDescription(event);
  const schemaData = [
    buildScheduledEventSchema(event, canonicalEventPath),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Schedule", path: "/schedule" },
      { name: event.headline || event.title, path: canonicalEventPath },
    ]),
  ];
  const isHouseOfFriendsPopup = event.id === "hof-kashmir-jul31";
  const usesEntryLanguage =
    event.series === "monolith-project" && !event.ticketUrl;
  const isPastEvent = event.status === "past";
  const isDisrupted = postponed || event.eventStatus === "EventCancelled";
  const archiveHref =
    event.recapUrl ||
    (event.archiveSlug ? `/archive/${event.archiveSlug}` : "/archive");
  const venueLabel = getScheduleVenue(event);
  const hasConfirmedVenue = !/^(?:venue to be announced|tba|tbd)$/i.test(
    venueLabel
  );
  const mapsSearchUrl = hasConfirmedVenue
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        [venueLabel, event.venueAddress?.streetAddress, event.location]
          .filter(Boolean)
          .join(", ")
      )}`
    : null;
  const calendarReady = canAddEventToCalendar(event);
  const googleCalendarUrl = calendarReady
    ? buildGoogleCalendarUrl(event)
    : null;
  const audio = useOptionalGlobalAudio();

  const decisionCards = isPastEvent
    ? [
        {
          label: "Chapter Status",
          value: "Completed Night",
          icon: <CheckCircle2 className="h-4 w-4" />,
        },
        {
          label: "Date",
          value: event.date,
          icon: <Clock className="h-4 w-4" />,
        },
        {
          label: "Venue",
          value: venueLabel,
          icon: <MapPin className="h-4 w-4" />,
        },
        {
          label: event.capacity ? "Scale" : "Archive Record",
          value: event.capacity || "Recap & gallery indexed",
          icon: <Camera className="h-4 w-4" />,
        },
      ]
    : [
        {
          label: usesEntryLanguage ? "Entry Path" : "Ticket Path",
          value: getTicketPathCopy(event),
          icon: <Ticket className="h-4 w-4" />,
        },
        {
          label: "Arrival",
          value: getArrivalCopy(event),
          icon: <Clock className="h-4 w-4" />,
        },
        {
          label: "Entry",
          value: event.age || "21+ / ID required",
          icon: <Star className="h-4 w-4" />,
        },
        {
          label: "Price",
          value: getPriceCopy(event),
          icon: <Ticket className="h-4 w-4" />,
        },
      ];
  const eventFit = getEventFitCopy(event);
  const contextPaths = [
    {
      href: isHouseOfFriendsPopup
        ? "/house-of-friends"
        : getSeriesHref(event.series),
      label: isHouseOfFriendsPopup
        ? "House of Friends"
        : getSeriesLabel(event.series),
      note: isHouseOfFriendsPopup
        ? "Artist development and community context"
        : getSeriesContextCopy(event.series),
      icon: <Star className="h-4 w-4" />,
    },
    {
      href: "/radio",
      label: "Radio",
      note: "Hear the taste behind the room",
      icon: <Headphones className="h-4 w-4" />,
      onClick: () =>
        trackAccessEvent("radio_click", {
          buttonName: "Event Detail Radio",
          destinationUrl: "/radio",
          eventSlug: event.slug || event.id,
          eventDate: event.date,
          channel: "site",
          source: "event_details_context",
        }),
    },
    {
      href: "/archive",
      label: "Archive",
      note: "See the proof before the next move",
      icon: <Camera className="h-4 w-4" />,
      onClick: () =>
        trackAccessEvent("archive_click", {
          buttonName: "Event Detail Archive",
          destinationUrl: "/archive",
          eventSlug: event.slug || event.id,
          eventDate: event.date,
          channel: "site",
          source: "event_details_context",
        }),
    },
  ];

  return (
    <div className="event-guide-page min-h-screen bg-black text-white relative overflow-hidden font-sans">
      <SEO
        title={pageTitle}
        description={pageDescription}
        absoluteTitle
        canonicalPath={canonicalEventPath}
        schemaData={schemaData}
      />

      <Navigation brand={navigationBrand} />

      <main id="main-content" tabIndex={-1}>
        <div className="event-guide-hero relative flex flex-col justify-end px-6 xl:px-12 border-b border-white/10">
          <ResponsiveImage
            src={bgImage}
            alt={event.title}
            priority
            sizes="100vw"
            className="event-guide-photo absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-1000"
          />
          <div className="event-guide-shade absolute inset-0 z-0" />

          <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-start">
            <button
              onClick={() => setLocation("/schedule")}
              className="btn-text-action mb-12"
            >
              <ArrowLeft className="w-4 h-4" /> Schedule
            </button>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span
                className="font-mono text-xs uppercase tracking-[0.4em]"
                style={{ color: getSeriesColor(event.series) }}
              >
                {getSeriesLabel(event.series)}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] px-3 py-1 border border-white/20 text-white/75">
                {postponed
                  ? "POSTPONED — NEW DATE TO BE CONFIRMED"
                  : event.eventStatus === "EventCancelled"
                    ? "CANCELLED — OFFICIAL UPDATE"
                    : event.confirmationStatus === "pending"
                      ? "DETAILS PENDING"
                      : getStatusLabel(event.status)}
              </span>
            </div>

            <h1 className="font-display text-[clamp(3rem,8vw,8rem)] leading-[0.85] tracking-tighter uppercase mb-6 drop-shadow-2xl max-w-5xl">
              {event.headline || event.title}
            </h1>

            <div className="flex flex-wrap gap-x-8 gap-y-4 font-mono text-white/70 text-xs md:text-sm tracking-[0.2em] uppercase mb-12">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white/70" />{" "}
                {event.eventStatus === "EventPostponed"
                  ? "Original venue: "
                  : ""}
                {getScheduleVenue(event)}, {event.location}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/70" />{" "}
                {postponed ? "Original booking: " : ""}
                {event.eventStatus === "EventPostponed"
                  ? "Original date: "
                  : ""}
                {event.confirmationStatus === "pending"
                  ? "Date to be announced"
                  : event.date}{" "}
                //{" "}
                {event.confirmationStatus === "pending"
                  ? "Time to be announced"
                  : event.time}
              </div>
              {event.lineup && (
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-white/70" /> {event.lineup}
                </div>
              )}
              {!isPastEvent &&
                !isDisrupted &&
                event.ticketTiers &&
                event.ticketTiers.length > 0 && (
                  <div className="flex items-center gap-2 text-white">
                    <Ticket className="w-4 h-4" /> From $
                    {event.ticketTiers[0].price}
                  </div>
                )}
            </div>

            <div className="w-full sm:w-auto">
              <ConversionCTA
                event={event}
                size="lg"
                className="w-full sm:w-auto px-12 py-5 text-[15px]"
                showUrgency={true}
              />
            </div>
          </div>
        </div>

        <section className="relative z-10 border-b border-white/10 bg-black px-6 py-8 xl:px-12">
          <div className="mx-auto grid w-full max-w-7xl gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-4">
            {decisionCards.map(card => (
              <div key={card.label} className="bg-[#050505] p-5 md:p-6">
                <div className="mb-4 flex items-center gap-3 text-white/70">
                  {card.icon}
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em]">
                    {card.label}
                  </span>
                </div>
                <p className="font-display text-xl uppercase leading-[0.95] tracking-wide text-white md:text-2xl">
                  {card.value}
                </p>
              </div>
            ))}
          </div>
          {(postponed || event.eventStatus === "EventCancelled") && (
            <div
              id="ticket-holder-support"
              className="mx-auto mt-6 w-full max-w-7xl border border-amber-300/50 bg-[#1d1f18] p-6 md:p-8"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-amber-200 mb-3">
                {postponed
                  ? "POSTPONED — NEW DATE TO BE CONFIRMED"
                  : "EVENT CANCELLED — TICKET-HOLDER UPDATE"}
              </p>
              <p className="text-base leading-relaxed text-white/90 mb-3">
                {event.eventNotice ||
                  "Official update published for ticket holders."}
              </p>
              {event.ticketHolderNotice && (
                <p className="text-sm leading-relaxed text-amber-100/90 mb-3">
                  {event.ticketHolderNotice}
                </p>
              )}
              {event.id === "css-sep19" && (
                <p className="text-sm leading-relaxed text-white/75 mb-5">
                  {TICKET_POLICY.sunsetsRefund}
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/tickets"
                  className="inline-flex min-h-11 items-center rounded bg-amber-200 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-black"
                >
                  TICKET-HOLDER UPDATE
                </Link>
                {event.id === "css-sep19" && (
                  <a
                    href={SUNSETS_REFUND_REQUEST_URL}
                    className="inline-flex min-h-11 items-center rounded border border-white/25 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-white/90 hover:border-white/50"
                  >
                    Request a refund ↗
                  </a>
                )}
              </div>
            </div>
          )}
              {isPastEvent && (
                <div className="mx-auto mt-6 flex w-full max-w-7xl flex-col justify-between gap-6 border border-[#E8B86D]/35 bg-[#11100e] p-6 md:flex-row md:items-center md:p-8">
                  <div className="max-w-2xl">
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[#E8B86D]">
                      Verified Chapter Receipt
                    </p>
                    <p className="font-display text-2xl uppercase tracking-tight text-white">
                      {event.date} · {venueLabel}
                      {event.capacity ? ` · ${event.capacity}` : ""}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">
                      This chapter is part of the permanent Monolith Project
                      archive. Explore the room gallery, lineup dossier, or join
                      the signal for upcoming dates.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={archiveHref}
                      className="inline-flex min-h-11 items-center gap-2 rounded bg-[#E8B86D] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-black transition hover:bg-[#f0c784]"
                    >
                      View Chapter Recap <ArrowUpRight size={15} aria-hidden="true" />
                    </Link>
                    <Link
                      href="/newsletter"
                      className="inline-flex min-h-11 items-center rounded border border-white/25 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-white/90 hover:border-white/50"
                    >
                      Notify Me Next Date
                    </Link>
                  </div>
                </div>
              )}
        </section>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 xl:px-12 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 flex flex-col gap-16">
            {eventArtists.length > 0 && (
              <section
                className="event-artist-discovery"
                aria-labelledby="event-artists-title"
              >
                <p className="section-kicker">Behind the sound</p>
                <h2 id="event-artists-title">
                  {postponed
                    ? "The original lineup."
                    : event.status === "past"
                      ? "Artists from this chapter."
                      : "Meet the artists."}
                </h2>
                {postponed && (
                  <p className="event-artist-context">
                    Recorded sets and artist profiles from the original booking.
                    Participation in the replacement show awaits confirmation.
                  </p>
                )}
                <div className="event-artist-grid">
                  {eventArtists.map(artist => {
                    const recording = getArtistRecording(artist);
                    const audioTrack = getArtistAudioTrack(artist);
                    const isPlayingTrack = Boolean(
                      audioTrack &&
                        audio?.activeTrack?.src === audioTrack.src &&
                        audio.isPlaying
                    );
                    return (
                      <article className="event-artist-card" key={artist.id}>
                        <Link
                          href={`/artists/${artist.id}`}
                          aria-label={`Explore ${artist.name}’s artist profile`}
                          className="event-artist-portrait"
                        >
                          <ResponsiveImage
                            src={artist.image}
                            alt={`${artist.name} portrait`}
                            width={600}
                            height={750}
                            sizes="(min-width: 1024px) 220px, (min-width: 640px) 40vw, 80vw"
                            style={{
                              objectPosition:
                                artist.imagePosition || "center 25%",
                            }}
                          />
                        </Link>
                        <p>{artist.genre}</p>
                        <h3>
                          <Link href={`/artists/${artist.id}`}>
                            {artist.name}
                          </Link>
                        </h3>
                        <Link
                          className="event-artist-link"
                          href={`/artists/${artist.id}`}
                        >
                          Artist profile{" "}
                          <ArrowUpRight size={16} aria-hidden="true" />
                        </Link>
                        {audioTrack && audio ? (
                          <button
                            type="button"
                            className="event-artist-link w-full text-left"
                            onClick={() => audio.loadTrack(audioTrack)}
                          >
                            {isPlayingTrack
                              ? "Playing in Radio Deck"
                              : "Play set in Radio Deck"}
                            <Headphones size={16} aria-hidden="true" />
                          </button>
                        ) : (
                          recording && (
                            <a
                              className="event-artist-link"
                              href={recording.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {recording.label}
                              <Play size={16} aria-hidden="true" />
                            </a>
                          )
                        )}
                      </article>
                    );
                  })}
                </div>
              </section>
            )}
            <section>
              <h3 className="font-mono text-[10px] tracking-[0.4em] text-white/70 uppercase mb-8 border-b border-white/10 pb-4">
                Why This Event
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ["Room", event.format || eventFit],
                  [
                    "Sound",
                    event.sound || "House music / event-led programming",
                  ],
                  ["Best Move", getTicketPathCopy(event)],
                ].map(([label, value]) => (
                  <article
                    key={label}
                    className="border border-white/8 bg-white/[0.025] p-5"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/70">
                      {label}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/76">
                      {value}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {event.description && (
              <section>
                <h3 className="font-mono text-[10px] tracking-[0.4em] text-white/70 uppercase mb-8 border-b border-white/10 pb-4">
                  Event details
                </h3>
                <div className="prose prose-invert prose-p:text-white/70 prose-p:leading-relaxed prose-p:font-light text-lg">
                  <p>{event.description}</p>
                </div>
              </section>
            )}

            {((event.setTimes && event.setTimes.length > 0) ||
              event.doors ||
              event.mainExperience) && (
              <section aria-labelledby="event-run-of-show">
                <h3
                  id="event-run-of-show"
                  className="font-mono text-[10px] tracking-[0.4em] text-white/70 uppercase mb-8 border-b border-white/10 pb-4"
                >
                  Run Of Show & Set Times
                </h3>
                {event.setTimes && event.setTimes.length > 0 ? (
                  <ol className="flex flex-col border border-white/10 bg-white/[0.02]">
                    {event.setTimes.map((slot, idx) => (
                      <li
                        key={`${slot.time}-${idx}`}
                        className="flex flex-col justify-between gap-2 border-b border-white/10 px-5 py-4 last:border-b-0 sm:flex-row sm:items-center"
                      >
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#E8B86D]">
                          {slot.time}
                        </span>
                        <span className="font-display text-base uppercase tracking-wide text-white">
                          {slot.label}
                        </span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {event.doors && (
                      <div className="border border-white/10 bg-white/[0.02] p-5">
                        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/60">
                          Doors
                        </p>
                        <p className="mt-2 font-display text-xl uppercase text-white">
                          {event.doors}
                        </p>
                      </div>
                    )}
                    {event.mainExperience && (
                      <div className="border border-white/10 bg-white/[0.02] p-5">
                        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/60">
                          Main Program
                        </p>
                        <p className="mt-2 font-display text-xl uppercase text-white">
                          {event.mainExperience}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

            {event.ticketTiers &&
              event.ticketTiers.length > 0 &&
              !isDisrupted && (
                <section aria-labelledby="event-ticket-releases">
                  <h3
                    id="event-ticket-releases"
                    className="font-mono text-[10px] tracking-[0.4em] text-white/70 uppercase mb-8 border-b border-white/10 pb-4"
                  >
                    {isPastEvent ? "Historical Ticket Tiers" : "Ticket Releases"}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {event.ticketTiers.map(tier => (
                      <div
                        key={tier.id}
                        className={`flex flex-col justify-between gap-4 border p-5 ${
                          tier.highlight && tier.available
                            ? "border-[#E8B86D]/60 bg-[#15120d]"
                            : "border-white/10 bg-white/[0.02]"
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-4">
                            <h4 className="font-display text-lg uppercase tracking-wide text-white">
                              {tier.name}
                            </h4>
                            <span className="font-mono text-sm font-semibold text-[#E8B86D]">
                              {tier.originalPrice && (
                                <s className="mr-2 text-xs text-white/45">
                                  ${tier.originalPrice}
                                </s>
                              )}
                              ${tier.price}
                            </span>
                          </div>
                          <p className="mt-2 text-xs leading-relaxed text-white/70">
                            {tier.description}
                          </p>
                          {tier.features.length > 0 && (
                            <ul className="mt-3 flex flex-wrap gap-2">
                              {tier.features.map(feature => (
                                <li
                                  key={feature}
                                  className="border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/70"
                                >
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
                          {isPastEvent
                            ? "Past Release"
                            : tier.available
                              ? "Available Release"
                              : "Sold Out"}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            {event.whatToExpect && event.whatToExpect.length > 0 && (
              <section>
                <h3 className="font-mono text-[10px] tracking-[0.4em] text-white/70 uppercase mb-8 border-b border-white/10 pb-4">
                  Atmosphere
                </h3>
                <ul className="flex flex-col gap-4">
                  {event.whatToExpect.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-4 text-white/80"
                    >
                      <Star className="w-5 h-5 text-primary shrink-0 mt-0.5" />{" "}
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {event.faqs && event.faqs.length > 0 && (
              <section>
                <h3 className="font-mono text-[10px] tracking-[0.4em] text-white/70 uppercase mb-8 border-b border-white/10 pb-4">
                  Logistics
                </h3>
                <div className="flex flex-col gap-6">
                  {event.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="bg-white/[0.02] border border-white/5 p-6 rounded-sm"
                    >
                      <h4 className="font-bold text-white mb-2 font-mono tracking-wide text-sm">
                        {faq.q}
                      </h4>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-white/[0.03] border border-white/10 p-8 flex flex-col gap-6 sticky top-32">
              <h3 className="font-mono text-[10px] tracking-[0.4em] text-white/70 uppercase border-b border-white/10 pb-4">
                Dossier
              </h3>

              <div className="flex flex-col gap-4 text-sm font-mono tracking-wide text-white/80">
                {event.format && (
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/70">Format</span>
                    <span>{event.format}</span>
                  </div>
                )}
                {event.sound && (
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/70">Sound</span>
                    <span>{event.sound}</span>
                  </div>
                )}
                {event.dress && (
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/70">Dress</span>
                    <span>{event.dress}</span>
                  </div>
                )}
                {event.age && (
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/70">Age</span>
                    <span>{event.age}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/70">Arrival</span>
                  {showDoorsCountdown ? (
                    <span
                      className="font-mono tabular-nums text-primary"
                      aria-label={`Doors in ${doorsCountdown.days} days ${doorsCountdown.hours} hours`}
                    >
                      {doorsCountdown.days > 0
                        ? `${doorsCountdown.days}d ${padCountdown(doorsCountdown.hours)}:${padCountdown(doorsCountdown.minutes)}:${padCountdown(doorsCountdown.seconds)}`
                        : `${padCountdown(doorsCountdown.hours)}:${padCountdown(doorsCountdown.minutes)}:${padCountdown(doorsCountdown.seconds)}`}
                    </span>
                  ) : (
                    <span>{getArrivalCopy(event)}</span>
                  )}
                </div>
                {event.capacity && (
                  <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
                    <span className="text-white/70">Capacity</span>
                    <span className="text-right">{event.capacity}</span>
                  </div>
                )}
                <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
                  <span className="text-white/70">
                    {usesEntryLanguage ? "Entry" : "Tickets"}
                  </span>
                  <span className="text-right">{getTicketPathCopy(event)}</span>
                </div>
                <div className="flex justify-between gap-4 pb-2">
                  <span className="text-white/70">Location</span>
                  <span className="text-right">
                    {event.venueAddress?.streetAddress
                      ? `${venueLabel} · ${event.venueAddress.streetAddress}`
                      : `${venueLabel} · ${event.location}`}
                    {event.venueAddress?.neighborhood
                      ? ` (${event.venueAddress.neighborhood})`
                      : ""}
                  </span>
                </div>
              </div>

              {(mapsSearchUrl ||
                calendarReady ||
                (event.venueMap && !isPastEvent)) && (
                <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
                  {mapsSearchUrl && (
                    <a
                      href={mapsSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-10 items-center gap-1.5 border border-white/15 bg-white/[0.03] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/85 transition hover:border-white/35"
                    >
                      <MapPin size={13} aria-hidden="true" /> Maps{" "}
                      <ArrowUpRight size={12} aria-hidden="true" />
                    </a>
                  )}
                  {event.venueMap && !isPastEvent && (
                    <Link
                      href="/vip"
                      className="inline-flex min-h-10 items-center gap-1.5 border border-white/15 bg-white/[0.03] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/85 transition hover:border-white/35"
                    >
                      3D Room & VIP Map{" "}
                      <ArrowUpRight size={12} aria-hidden="true" />
                    </Link>
                  )}
                  {calendarReady && (
                    <button
                      type="button"
                      onClick={() => downloadEventCalendar(event)}
                      className="inline-flex min-h-10 items-center gap-1.5 border border-white/15 bg-white/[0.03] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/85 transition hover:border-white/35"
                    >
                      <CalendarPlus size={13} aria-hidden="true" /> .ics
                    </button>
                  )}
                  {googleCalendarUrl && (
                    <a
                      href={googleCalendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-10 items-center gap-1.5 border border-white/15 bg-white/[0.03] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/85 transition hover:border-white/35"
                    >
                      Google Calendar{" "}
                      <ArrowUpRight size={12} aria-hidden="true" />
                    </a>
                  )}
                </div>
              )}

              {event.eventNotice && (
                <div className="mt-4 p-4 bg-primary/10 border border-primary/20 text-primary text-xs leading-relaxed font-mono">
                  {event.eventNotice}
                </div>
              )}

              <div className="border-t border-white/10 pt-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-white/70">
                    Read The Room
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/65">
                    Context
                  </span>
                </div>
                <div className="grid gap-3">
                  {contextPaths.map(path => (
                    <Link
                      key={path.label}
                      href={path.href}
                      onClick={path.onClick}
                      className="group flex items-center justify-between gap-4 border border-white/8 bg-white/[0.025] px-4 py-3 transition-colors hover:border-white/18 hover:bg-white/[0.055]"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 text-white/55 transition-colors group-hover:border-primary/35 group-hover:text-primary">
                          {path.icon}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-display text-base uppercase tracking-wide text-white">
                            {path.label}
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-white/70">
                            {path.note}
                          </span>
                        </span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-white/28 transition-colors group-hover:text-white/75" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="relative z-10 border-y border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.055),rgba(255,255,255,0.015))] px-6 py-14 xl:px-12">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-white/70">
                {isPastEvent
                  ? "Archive Chapter"
                  : isDisrupted
                    ? "Status Update"
                    : "Next Step"}
              </p>
              <h2 className="mt-4 max-w-[11ch] font-monolith text-[clamp(2.5rem,6vw,5.5rem)] font-normal uppercase leading-[0.86] tracking-[0.01em] text-white">
                {isPastEvent
                  ? "Relive The Room"
                  : isDisrupted
                    ? "Stay On The Signal"
                    : "Make The Move"}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/62 md:text-base">
                {isPastEvent
                  ? "Step back inside the room through the official chapter archive, explore artist profiles, or register for first access on future dates."
                  : isDisrupted
                    ? "Ticket-holders receive priority options for refunds, transfers, and confirmed makeup dates directly from the official notice page."
                    : "If the date, room, and sound fit, do not route back through the site. Use the primary event path and keep the confirmation handy."}
              </p>
            </div>
            <div className="flex w-full flex-col items-start gap-5 md:w-auto md:items-end">
              <ConversionCTA
                event={event}
                size="lg"
                className="w-full md:w-auto"
                showUrgency={true}
              />
              {event.tableReservationEmail ? (
                <a
                  href={`mailto:${event.tableReservationEmail}`}
                  onClick={() =>
                    trackAccessEvent("vip_inquiry_click", {
                      buttonName: "VIP / Table Enquiry",
                      destinationUrl: `mailto:${event.tableReservationEmail}`,
                      eventSlug: event.slug || event.id,
                      eventDate: event.date,
                      channel: "email",
                      source: "event_details_next_step",
                    })
                  }
                  className="btn-text-action"
                >
                  VIP / Table Enquiry
                </a>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <JoinSignalSection />
    </div>
  );
}
