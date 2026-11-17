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
      <div className="min-h-screen bg-background text-foreground lg-dusk-atmosphere">
        <SEO
          title="Sun(Sets) III postponed — ticket-holder update"
          description={currentSunsets.statusMessage}
        />
        {featuredEventSchema && <JsonLd data={featuredEventSchema} />}
        <Navigation />
        <main
          id="main-content"
          tabIndex={-1}
          className="pb-32"
        >
          <section className="lg-cinematic-masthead px-6 mb-14 md:mb-20">
            <div className="container layout-wide">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-[#ffd8a6]">
                  POSTPONED — NEW DATE TO BE CONFIRMED
                </p>
                <span className="rounded-full border border-[#f3a659]/45 bg-[#f3a659]/12 px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#ffd8a6]">
                  JOEZI × MASSUMA
                </span>
              </div>
              <h1 className="section-display-title text-[#fbf6ee] max-w-4xl mb-6">
                Postponed due to weather.
              </h1>
              <p className="max-w-2xl text-base md:text-xl leading-relaxed text-white/78">
                {currentSunsets.statusMessage}
              </p>
            </div>
          </section>

          <div className="container layout-default px-6 space-y-10">
            <section className="max-w-4xl lg-glass-card rounded-2xl p-8 md:p-12">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#f3b572] mb-4">
                Official Ticket-Holder Options & Refund Window
              </p>
              <p className="text-base md:text-lg leading-relaxed text-white/85 mb-5">
                {currentSunsets.ticketHolderMessage}
              </p>
              <p className="text-base leading-relaxed text-white/75 mb-8">
                {TICKET_POLICY.sunsetsRefund}
              </p>
              <div className="flex flex-wrap gap-3.5 mb-6">
                <a
                  href="/sunsets#event-update"
                  className="lg-pill-amber"
                >
                  <span>TICKET-HOLDER UPDATE</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href={SUNSETS_REFUND_REQUEST_URL}
                  className="lg-pill-glass"
                >
                  <span>Request a refund</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
                <Link
                  href="/events/css-sep19"
                  className="lg-pill-glass"
                >
                  <span>Event status page</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
              <p className="text-xs leading-relaxed text-white/65 border-t border-white/10 pt-5">
                Refund requests open a draft in your email app. Send it with your
                booking details for team review. {TICKET_POLICY.refundProcessing}
              </p>
            </section>

            <section
              aria-label="Between shows — archive, radio and first access"
              className="max-w-4xl lg-glass-card rounded-2xl p-8 md:p-12"
            >
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#f3b572] mb-3">
              Between Shows · No Tickets Currently On Sale
            </p>
            <h2 className="font-display text-2xl md:text-3xl uppercase text-[#fbf6ee] mb-4">
              While the next date is finalized.
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-white/75 mb-6">
              Zero events are currently on sale. Revisit our July 4 lakefront
              chapter at Castaways (10-hour gathering · 2,800 attendees), tune
              into Chasing Sunsets Radio, or register for First Access.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/newsletter" data-first-access="true" className="lg-pill-amber">
                <span>Get First Access</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/chasing-sunsets/sunsets-i-2026"
                className="lg-pill-glass"
              >
                <span>July 4 recap proof</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              <Link href="/radio" className="lg-pill-glass">
                <span>Radio archive</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </section>
          </div>
        </main>
      </div>
    );
  }

  // Fallback view for drops whose checkout isn't live yet (e.g. Season
  // Pass). The current chapters sell direct via the Aug 22 rail.
  if (comingSoonKey) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col lg-dusk-atmosphere">
        <SEO
          title="SUN(SETS) Tickets | Chasing Sun(Sets)"
          description="Find current event availability and official ticket destinations."
        />
        <Navigation />
        <div className="flex flex-1 items-center justify-center px-6 py-24">
          <div className="lg-glass-card mx-auto w-full max-w-lg space-y-6 rounded-3xl px-8 py-10 text-center md:px-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#f3b572]">
              SUN(SETS) 2026 — CASTAWAYS
            </p>
            <h1 className="font-display text-3xl uppercase leading-[0.95] tracking-[-0.03em] text-[#fbf6ee] md:text-4xl">
              Check event availability
            </h1>
            <p className="text-sm leading-relaxed text-white/70 md:text-base">
              This ticket release is not available yet. Explore the current
              schedule for confirmed shows and available tickets.
            </p>
            <a href="/schedule" className="lg-pill-amber w-full">
              <Ticket className="size-4" aria-hidden="true" />
              <span>View current events</span>
            </a>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/48">
              Availability is listed for each event.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden lg-dusk-atmosphere">
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
        <section className="lg-cinematic-masthead px-6 mb-14 relative">
          <div className="container layout-default">
            <motion.div
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="section-kicker mb-5 block text-[#f3b572]">
                {featuredEyebrow}
              </span>
              <h1 className="section-display-title max-w-[10ch] text-[#fbf6ee] mb-6">
                {accessHeading}
              </h1>
              <p className="mb-4 max-w-xl text-base leading-relaxed text-[#f4e9d8]/78 md:text-xl">
                {accessCopy}
              </p>
              <div className="flex items-center gap-3">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#f3a659]" />
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#f3b572]">
                  {accessStatus}
                </span>
              </div>
              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
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
                    className={`lg-pill-amber min-w-[220px] ${ctaToneClass}`}
                  >
                    <span>{cta.label}</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </MagneticButton>
                <MagneticButton strength={0.22}>
                  <Link href="/schedule" className="lg-pill-glass">
                    <span>View All Season Dates</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
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
                <div className="group relative overflow-hidden rounded-3xl border border-[rgba(255,228,194,0.16)] bg-[#0d0c0b] shadow-[0_28px_64px_rgba(0,0,0,0.45)]">
                  <SmartImage
                    src={featuredPoster}
                    alt={featuredHeadline}
                    priority
                    className="aspect-[4/5] h-auto w-full object-cover object-top origin-top transition-transform duration-1000 group-hover:scale-105"
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
                  <h2 className="font-display text-5xl md:text-6xl lg:text-7xl uppercase leading-[0.95] text-[#fbf6ee] tracking-wide block mb-8">
                    {featuredHeadline}
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
                        {item.value}
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
                      className={`lg-pill-amber min-w-[280px] !min-h-[56px] !px-10 ${ctaToneClass}`}
                    >
                      <span>
                        {cta.label === CTA_LABELS.tickets
                          ? "TICKETS"
                          : cta.label}
                      </span>
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
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
