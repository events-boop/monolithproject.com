import {
  TICKET_POLICY,
  SUNSETS_REFUND_REQUEST_URL,
} from "@shared/events/ticket-policy";
import { getPublishedEventState } from "@shared/events/publishedState";
import {
  currentSunsets,
  sunsetsNeedsUpdate,
} from "@shared/events/sunsets-current";
import { motion } from "framer-motion";
import type { SyntheticEvent } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Ticket,
  Star,
  Crown,
  ArrowUpRight,
} from "lucide-react";
import { Link, useSearch } from "wouter";
import "@/styles/themes/tickets.css";
import Navigation from "@/components/Navigation";
import UntoldButterflyLogo from "@/components/UntoldButterflyLogo";
import { trackTicketIntent } from "@/lib/api";
import { appendAttributionQueryParams } from "@/lib/attribution";
import { signalChirp } from "@/lib/SignalChirpEngine";
import KineticDecryption from "@/components/KineticDecryption";
import SEO from "@/components/SEO";
import JsonLd from "@/components/JsonLd";
import { buildScheduledEventSchema } from "@/lib/schema";
import SmartImage from "@/components/SmartImage";
import MagneticButton from "@/components/MagneticButton";
import EventFunnelStack from "@/components/EventFunnelStack";
import {
  getEventEyebrow,
  getEventVenueLabel,
  getEventWindowStatus,
  getExperienceEvent,
} from "@/lib/siteExperience";
import { CTA_LABELS, getEventCta } from "@/lib/cta";
import { getEventCtaToneClass } from "@/lib/ctaTone";
import { SUNSETS_AUG22_TICKET_PATH } from "@/lib/sunsetsTicketing";
import { usePublicSiteDataVersion } from "@/lib/siteData";
import type { TicketTier } from "@/data/events";

// Icon mapping helper
const getTierIcon = (iconName: string) => {
  switch (iconName) {
    case "star":
      return <Star className="w-6 h-6" />;
    case "crown":
      return <Crown className="w-6 h-6" />;
    case "ticket":
    default:
      return <Ticket className="w-6 h-6" />;
  }
};

export default function Tickets() {
  usePublicSiteDataVersion();
  const featuredEvent = getExperienceEvent("ticket");
  const cta = featuredEvent
    ? getEventCta(featuredEvent)
    : {
        label: "View events",
        href: "/schedule",
        tool: "posh" as const,
        isExternal: false,
      };
  const ctaToneClass = getEventCtaToneClass(featuredEvent);

  const featuredEventSchema =
    featuredEvent && getEventWindowStatus(featuredEvent) !== "past"
      ? buildScheduledEventSchema(featuredEvent, "/tickets")
      : null;
  const featuredHeadline =
    featuredEvent?.headline || featuredEvent?.title || "Monolith events";
  const featuredEyebrow =
    featuredEvent?.subtitle ||
    (featuredEvent
      ? getEventEyebrow(featuredEvent)
      : "Chasing Sun(Sets) / First Access");
  const featuredVenue = featuredEvent
    ? getEventVenueLabel(featuredEvent)
    : "Castaways, Chicago";
  const featuredPoster =
    featuredEvent?.image || "/images/chasing-sunsets-premium.webp";
  const showTicketFunnel = Boolean(
    featuredEvent?.activeFunnels?.length &&
    !["posh", "allevents"].includes(cta.tool)
  );
  const publishedState = featuredEvent
    ? getPublishedEventState(featuredEvent)
    : null;
  const isOnSale = publishedState?.kind === "on-sale";
  const isPostponed = publishedState?.kind === "postponed";
  const isFirstAccess = !isOnSale;
  const accessHeading = isPostponed
    ? "EVENT UPDATE"
    : !featuredEvent
      ? "BETWEEN SHOWS"
      : isOnSale
        ? "TICKETS LIVE"
        : "FIRST ACCESS";
  const accessStatus = isPostponed
    ? "POSTPONED — NEW DATE TO BE CONFIRMED"
    : !featuredEvent
      ? "BETWEEN SHOWS — NO TICKETS CURRENTLY ON SALE"
      : isOnSale
        ? `${featuredEvent.episode || "CURRENT RELEASE"} / TICKETS LIVE`
        : `${featuredEvent.episode || "DETAILS PENDING"} / FIRST ACCESS OPEN`;
  const accessCopy = isPostponed
    ? `${featuredHeadline} is postponed. Read the official ticket-holder instructions below.`
    : featuredEvent
      ? isFirstAccess
        ? `${featuredHeadline} is between release windows. Join First Access for the artist reveal, initial ticket window, and updates before public sale — or revisit our July 4 Castaways recap and radio archive.`
        : `${featuredHeadline} — tickets are available through ${cta.tool === "allevents" ? "AllEvents" : "the event checkout"}.`
      : "No shows are currently on sale between seasons. Explore the July 4 Castaways recap proof, listen to Chasing Sunsets Radio, or join First Access for upcoming dates.";

  const handlePurchase = (source: string, destinationUrl?: string) => {
    if (!destinationUrl) return;
    const attributedUrl = appendAttributionQueryParams(destinationUrl);
    signalChirp.boot();
    void trackTicketIntent(source, featuredEvent?.id, attributedUrl);

    // Immediate execution for zero-friction conversion
    if (/^https?:\/\//i.test(attributedUrl)) {
      window.open(attributedUrl, "_blank", "noopener,noreferrer");
    } else {
      window.location.assign(attributedUrl);
    }
  };

  const search = useSearch();
  const comingSoonKey = new URLSearchParams(search).get("coming-soon");

  const handleTicketLinkClick = (
    event: SyntheticEvent<HTMLAnchorElement>,
    source: string,
    destinationUrl?: string
  ) => {
    if (!destinationUrl) return;
    const attributedUrl = appendAttributionQueryParams(destinationUrl);
    void trackTicketIntent(source, featuredEvent?.id, attributedUrl);

    if (attributedUrl !== destinationUrl) {
      event.preventDefault();
      if (event.currentTarget.target === "_blank") {
        window.open(attributedUrl, "_blank", "noopener,noreferrer");
      } else {
        window.location.assign(attributedUrl);
      }
    }
  };

  if (
    featuredEvent?.id === "css-sep19" &&
    sunsetsNeedsUpdate &&
    !comingSoonKey
  ) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SEO
          title="Sun(Sets) III postponed — ticket-holder update"
          description={currentSunsets.statusMessage}
        />
        {featuredEventSchema && <JsonLd data={featuredEventSchema} />}
        <Navigation />
        <main
          id="main-content"
          tabIndex={-1}
          className="page-shell-start-loose px-6 pb-24"
        >
          <section className="mx-auto max-w-2xl rounded-xl border border-amber-300/60 bg-[#1d1f18] p-7 md:p-12">
            <p className="text-sm font-mono uppercase tracking-[0.18em] text-amber-200 mb-3">
              POSTPONED — NEW DATE TO BE CONFIRMED
            </p>
            <p className="text-sm text-amber-200 mb-5">
              OFFICIAL EVENT UPDATE · JOEZI × MASSUMA
            </p>
            <h1 className="text-4xl md:text-5xl leading-tight mb-6">
              Postponed due to weather.
            </h1>
            <p className="text-base leading-relaxed mb-5">
              {currentSunsets.statusMessage}
            </p>
            <p className="text-base leading-relaxed mb-5">
              {currentSunsets.ticketHolderMessage}
            </p>
            <p className="text-base leading-relaxed mb-8">
              {TICKET_POLICY.sunsetsRefund}
            </p>
            <a
              href={SUNSETS_REFUND_REQUEST_URL}
              className="btn-pill-monolith mb-5"
            >
              Request a refund ↗
            </a>
            <p className="text-sm leading-relaxed mb-6">
              This opens a draft in your email app. Send it with your booking
              details for team review. {TICKET_POLICY.refundProcessing}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                className="inline-flex min-h-12 items-center rounded bg-amber-200 px-6 py-3 font-semibold text-black"
                href="/sunsets#event-update"
              >
                TICKET-HOLDER UPDATE ↗
              </a>
              <Link
                href="/events/css-sep19"
                className="inline-flex min-h-12 items-center rounded border border-white/25 px-6 py-3 font-semibold text-white/90 hover:border-white/50"
              >
                Event status page ↗
              </Link>
            </div>
          </section>

          <section
            aria-label="Between shows — archive, radio and first access"
            className="mx-auto mt-10 max-w-2xl rounded-xl border border-white/10 bg-white/[0.025] p-7 md:p-10"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-primary mb-3">
              Between Shows · No Tickets Currently On Sale
            </p>
            <h2 className="font-display text-2xl md:text-3xl uppercase text-white mb-4">
              While the next date is finalized.
            </h2>
            <p className="text-sm leading-relaxed text-white/75 mb-6">
              Zero events are currently on sale. Revisit our July 4 lakefront
              chapter at Castaways (10-hour gathering · 2,800 attendees), tune
              into Chasing Sunsets Radio, or register for First Access.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/newsletter" className="btn-pill-monolith btn-pill-compact">
                Get First Access
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/chasing-sunsets/sunsets-i-2026"
                className="btn-pill-outline btn-pill-compact"
              >
                July 4 recap proof
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/radio" className="btn-pill-outline btn-pill-compact">
                Radio archive
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Fallback view for drops whose checkout isn't live yet (e.g. Season
  // Pass). The current chapters sell direct via the Aug 22 rail.
  if (comingSoonKey) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <SEO
          title="SUN(SETS) Tickets | Chasing Sun(Sets)"
          description="Find current event availability and official ticket destinations."
        />
        <Navigation />
        <div className="flex flex-col items-center justify-center flex-1 px-6 py-24 text-center space-y-6 max-w-md mx-auto">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#dfc27a]">
            SUN(SETS) 2026 — CASTAWAYS
          </p>
          <h1 className="text-3xl font-black tracking-tight text-white">
            CHECK EVENT AVAILABILITY
          </h1>
          <p className="text-sm leading-relaxed text-stone-400">
            This ticket release is not available yet. Explore the current
            schedule for confirmed shows and available tickets.
          </p>
          <a
            href="/schedule"
            className="inline-flex items-center justify-center gap-2 h-12 w-full bg-[#dfc27a] text-xs font-black uppercase tracking-[0.12em] text-black hover:bg-[#efd48d] transition-colors"
          >
            <Ticket className="size-4" />
            View current events
          </a>
          <p className="text-[11px] text-stone-500 uppercase tracking-[0.14em]">
            Availability is listed for each event.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <SEO
        title={`${featuredHeadline} | ${isFirstAccess ? "First Access" : "Tickets"} — Chasing Sun(Sets)`}
        description={accessCopy}
        image={featuredPoster}
        absoluteTitle
      />
      {featuredEventSchema ? <JsonLd data={featuredEventSchema} /> : null}
      <div className="pointer-events-none absolute inset-0 bg-tickets-top-glow" />
      <div className="pointer-events-none absolute inset-0 bg-tickets-bottom-glow" />
      <Navigation />

      <main id="main-content" tabIndex={-1}>
        {/* Header */}
        <section className="page-shell-start-loose pb-16 px-6 relative">
          <div className="container layout-default">
            <motion.div
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="font-serif italic text-lg text-primary block mb-6">
                {featuredEyebrow}
              </span>
              <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-[0.9] uppercase mb-6 bg-clip-text text-transparent bg-[linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0.7)_50%,rgba(255,255,255,0.3)_100%)] drop-shadow-sm">
                {accessHeading}
              </h1>
              <p className="text-white/80 text-lg max-w-lg mb-4">
                {accessCopy}
              </p>
              <div className="flex items-center gap-3">
                <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="font-mono text-xs text-primary tracking-widest uppercase">
                  {accessStatus}
                </span>
              </div>
              <div className="mt-8 flex flex-col gap-6 sm:flex-row items-center">
                <MagneticButton strength={0.3}>
                  <a
                    href={cta.href}
                    target={cta.isExternal ? "_blank" : undefined}
                    rel={cta.isExternal ? "noopener noreferrer" : undefined}
                    onClick={event =>
                      handleTicketLinkClick(
                        event,
                        "tickets_page_header",
                        cta.href
                      )
                    }
                    className={`
                      px-12 py-5 text-[12px] font-black uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center min-w-[220px] rounded-none
                      ${cta.tool === "posh" ? "cta-posh" : "cta-laylo"}
                      ${ctaToneClass}
                    `}
                  >
                    {cta.label}
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </a>
                </MagneticButton>
                <MagneticButton strength={0.22}>
                  <Link href="/schedule" asChild>
                    <a className="cta-ghost">View All Season Dates</a>
                  </Link>
                </MagneticButton>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Giveaway / Viral Loop Funnel */}
        {showTicketFunnel ? (
          <section id="tickets-funnel">
            <EventFunnelStack eventId={featuredEvent.id} />
          </section>
        ) : null}

        {/* Featured Event Section */}
        <section className="pb-32 px-6 relative">
          <div className="container layout-wide">
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
              {/* Left — Visual Focus */}
              <div className="lg:col-span-7 w-full">
                <div className="relative group overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02]">
                  <SmartImage
                    src={featuredPoster}
                    alt={featuredHeadline}
                    priority
                    className="w-full h-auto aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>
              </div>

              {/* Right — Technicals & Action */}
              <div className="lg:col-span-5 flex flex-col gap-10">
                <div>
                  <div className="flex items-center gap-4 mb-6 text-primary">
                    {featuredEvent?.series === "untold-story" ? (
                      <UntoldButterflyLogo className="w-5 h-5" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                    <span className="font-mono text-[10px] uppercase tracking-[0.5em]">
                      {featuredEyebrow}
                    </span>
                  </div>
                  <h2 className="font-display text-5xl md:text-6xl lg:text-7xl uppercase leading-[0.95] text-white tracking-widest block mb-8">
                    <KineticDecryption text={featuredHeadline} />
                  </h2>
                  <div className="h-px w-20 bg-primary/40 mb-8" />
                  <p className="text-lg md:text-xl leading-relaxed text-white/70 max-w-lg font-light">
                    {featuredEvent?.description ||
                      "Music-first nights with limited capacity, strong curation, and a room worth arriving for."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-y-12 gap-x-8 border-y border-white/5 py-12">
                  {[
                    {
                      icon: <Calendar className="w-4 h-4" />,
                      label: "Date",
                      value: featuredEvent?.date || "TBA",
                    },
                    {
                      icon: <Clock className="w-4 h-4" />,
                      label: "Format",
                      value: "Open Air · Golden Hour",
                    },
                    {
                      icon: <MapPin className="w-4 h-4" />,
                      label: "Venue",
                      value: featuredVenue,
                    },
                    {
                      icon: <Users className="w-4 h-4" />,
                      label: "Headliner",
                      value: featuredEvent?.lineup || "Artists to be confirmed",
                    },
                  ].map(item => (
                    <div key={item.label} className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-white/70">
                        {item.icon}
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
                          {item.label}
                        </span>
                      </div>
                      <span className="font-display text-lg uppercase tracking-wider text-white/90">
                        <KineticDecryption text={item.value} />
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <MagneticButton strength={0.4}>
                    <a
                      href={cta.href}
                      target={cta.isExternal ? "_blank" : undefined}
                      rel={cta.isExternal ? "noopener noreferrer" : undefined}
                      onClick={event =>
                        handleTicketLinkClick(
                          event,
                          "tickets_page_featured",
                          cta.href
                        )
                      }
                      className={`
                             px-12 py-6 text-xs font-black tracking-[0.4em] transition-all duration-500 min-w-[280px] flex items-center justify-center rounded-none
                             ${cta.tool === "posh" ? "cta-posh" : "cta-laylo"}
                             ${ctaToneClass}
                           `}
                    >
                      {cta.label === CTA_LABELS.tickets ? "TICKETS" : cta.label}
                      <ArrowUpRight className="w-4 h-4 ml-3" />
                    </a>
                  </MagneticButton>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Release Tiers — Integrated Grid */}
        <section className="pb-32 px-6 border-t border-white/5 pt-32 relative">
          <div className="container layout-wide">
            <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
              <div className="max-w-xl">
                <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-white/70 mb-4 block">
                  Release Preview
                </span>
                <h2 className="font-monolith text-5xl font-normal uppercase tracking-[0.04em] text-white">
                  First Access Releases
                </h2>
                <p className="mt-6 text-lg text-white/58 font-light">
                  Public checkout opens by release. First Access gets the signal
                  before each wave goes wide.
                </p>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/70 italic">
                Updated for {new Date().getFullYear()}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden">
              {(featuredEvent?.ticketTiers || []).map((tier: TicketTier) => (
                <article
                  key={tier.id}
                  className={`bg-black/60 backdrop-blur-3xl p-12 lg:p-16 flex flex-col h-full transition-all duration-700 hover:bg-white/[0.05] hover:shadow-[0_0_60px_rgba(255,255,255,0.05)] group`}
                >
                  <div className="flex items-center justify-between mb-12">
                    <div
                      className={`w-14 h-14 rounded-full border border-white/5 flex items-center justify-center transition-all duration-700 group-hover:border-primary/30 group-hover:bg-primary/5 ${tier.highlight ? "text-primary border-primary/20 bg-primary/10" : "text-white/70 group-hover:text-primary"}`}
                    >
                      {getTierIcon(tier.icon)}
                    </div>
                    {tier.highlight && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                        High Demand
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-display text-3xl uppercase tracking-widest text-white mb-6">
                      {tier.name}
                    </h3>
                    <div className="flex items-baseline gap-3 mb-8">
                      <span className="font-display text-5xl text-white">
                        ${tier.price}
                      </span>
                      {tier.originalPrice && (
                        <span className="text-white/70 line-through text-lg">
                          ${tier.originalPrice}
                        </span>
                      )}
                    </div>

                    <p className="text-white/58 text-base font-light mb-10 leading-relaxed max-w-sm">
                      {tier.description}
                    </p>

                    <ul className="space-y-4 mb-16">
                      {tier.features.map((feature: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-center gap-4 text-[11px] font-mono uppercase tracking-[0.2em] text-white/46 group-hover:text-white/60 transition-colors"
                        >
                          <div className="h-px w-3 bg-white/10 group-hover:bg-primary transition-colors" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() =>
                      handlePurchase(`tickets_page_${tier.id}`, cta.href)
                    }
                    disabled={!tier.available}
                    className={`w-full h-16 flex items-center justify-center gap-3 transition-all duration-700 rounded-none ${
                      tier.available
                        ? tier.highlight
                          ? `cta-posh ${ctaToneClass}`
                          : `cta-laylo ${ctaToneClass} !bg-white/5 border-white/10 hover:border-primary/40`
                        : "bg-white/5 border border-white/5 text-white/70 cursor-not-allowed"
                    }`}
                  >
                    {tier.available ? (
                      <>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                          {cta.label === CTA_LABELS.tickets
                            ? tier.name
                            : cta.label}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                        First Access Open
                      </span>
                    )}
                  </button>
                </article>
              ))}
            </div>

            <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-8">
              <p className="text-white/70 text-[10px] font-mono tracking-widest uppercase italic border-l border-white/5 pl-6">
                Release details can change before public checkout opens.
              </p>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-primary/20" />
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/70">
                  {cta.tool === "posh"
                    ? "Secure checkout via Posh"
                    : "First access before public release"}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 px-6 py-20">
          <div className="container layout-wide">
            <div className="grid gap-10 rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 md:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.72fr)] lg:items-end">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.45em] text-primary">
                  Before Checkout
                </span>
                <h2 className="mt-5 max-w-[10ch] font-monolith text-[clamp(2.6rem,6vw,5.75rem)] font-normal uppercase leading-[0.86] tracking-[0.01em] text-white">
                  Know Your Night
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/58 md:text-lg">
                  First Access should answer the practical questions before
                  someone leaves the site. Date, venue, entry, and the drop path
                  stay visible all the way through the page.
                </p>
                <div className="mt-8 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-3">
                  {[
                    ["Entry", featuredEvent?.age || "21+ / ID required"],
                    ["Venue", featuredVenue],
                    [
                      "Checkout",
                      cta.tool === "posh"
                        ? "Secure via Posh"
                        : "First Access / updates",
                    ],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-black/70 p-5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/46">
                        {label}
                      </p>
                      <p className="mt-3 font-display text-xl uppercase leading-none text-white/88">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/50 p-5 md:p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/70">
                  Primary Action
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/58">
                  If this is the right event, join First Access now. If not,
                  return to schedule and choose by date.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href={cta.href}
                    target={cta.isExternal ? "_blank" : undefined}
                    rel={cta.isExternal ? "noopener noreferrer" : undefined}
                    onClick={event =>
                      handleTicketLinkClick(
                        event,
                        "tickets_page_final",
                        cta.href
                      )
                    }
                    className={`${cta.tool === "posh" ? "cta-posh" : "cta-laylo"} ${ctaToneClass} flex min-h-[var(--tap-target-min)] w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-[11px] font-black uppercase tracking-[0.3em]`}
                  >
                    {cta.label}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                  <Link
                    href="/schedule"
                    className="cta-ghost w-full justify-center"
                  >
                    Compare Dates
                  </Link>
                </div>
              </div>
            </div>
            {!isOnSale && (
              <div className="mt-8 grid gap-4 rounded-[1.5rem] border border-white/10 bg-black/40 p-6 md:grid-cols-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
                    July 4 Recap Proof
                  </p>
                  <p className="mt-2 text-sm text-white/75">
                    Castaways Beach Club · 10-hour gathering · 2,800 attendees.
                  </p>
                  <Link
                    href="/chasing-sunsets/sunsets-i-2026"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-white/90 hover:text-primary"
                  >
                    Relive Chapter One
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
                    Chasing Sunsets Radio
                  </p>
                  <p className="mt-2 text-sm text-white/75">
                    Between-shows mixes and resident episodes powered by sunsets.fm.
                  </p>
                  <Link
                    href="/radio"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-white/90 hover:text-primary"
                  >
                    Open Radio Archive
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
                    First Access Signup
                  </p>
                  <p className="mt-2 text-sm text-white/75">
                    Get the first release window when the next date is confirmed.
                  </p>
                  <Link
                    href="/newsletter"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-white/90 hover:text-primary"
                  >
                    Get First Access
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
