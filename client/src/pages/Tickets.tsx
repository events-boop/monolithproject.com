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
  const cta = getEventCta(featuredEvent);
  const ctaToneClass = getEventCtaToneClass(featuredEvent);

  const featuredEventSchema =
    featuredEvent && getEventWindowStatus(featuredEvent) !== "past"
      ? buildScheduledEventSchema(featuredEvent, "/tickets")
      : null;
  const featuredHeadline =
    featuredEvent?.headline || featuredEvent?.title || "Featured Event";
  const featuredEyebrow =
    featuredEvent?.subtitle || getEventEyebrow(featuredEvent);
  const featuredVenue = getEventVenueLabel(featuredEvent);
  const featuredPoster =
    featuredEvent?.image || "/images/chasing-sunsets-july4-first-access.png";
  const showTicketFunnel = Boolean(
    featuredEvent?.activeFunnels?.length && cta.tool !== "posh"
  );

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

  // "Tickets coming soon" fallback — shown when OUTBOUND_TICKETS_CSS_JUL04_URL
  // (or NEXT_PUBLIC_POSH_SUNSETS_JULY4_URL) is not yet set in the environment.
  if (comingSoonKey) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <SEO
          title="SUN(SETS) I — July 4 Tickets | Sunsets.vip"
          description="Official tickets for SUN(SETS) July 4 at Castaways Beach Club. Autograf, Kiko Franco, Amari, Jewels (Le Yora), and more. Tickets on sale now via Posh."
        />
        <Navigation />
        <div className="flex flex-col items-center justify-center flex-1 px-6 py-24 text-center space-y-6 max-w-md mx-auto">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#dfc27a]">
            SUN(SETS) — JULY 4, 2026
          </p>
          <h1 className="text-3xl font-black tracking-tight text-white">
            SUN(SETS) I — JULY 4 TICKETS
          </h1>
          <p className="text-sm leading-relaxed text-stone-400">
            Tickets are on sale now via Posh. Join the Lake List for first
            access to SUN(SETS) II + III and the limited 2026 Season Pass.
          </p>
          <Link
            href="/go/waitlist/chasing-sunsets"
            className="inline-flex items-center justify-center gap-2 h-12 w-full bg-[#dfc27a] text-xs font-black uppercase tracking-[0.12em] text-black hover:bg-[#efd48d] transition-colors"
          >
            <Ticket className="size-4" />
            Join the Lake List — First Access
          </Link>
          <p className="text-[11px] text-stone-500 uppercase tracking-[0.14em]">
            Official ticket source powered by Posh.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <SEO
          title="SUN(SETS) I — Tickets | Chasing Sun(Sets) July 4"
          description="Official Posh tickets for SUN(SETS) July 4 at Castaways Beach Club, Chicago. Autograf, Kiko Franco, Amari, and more. Open-air house on the lakefront."
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="font-serif italic text-lg text-primary block mb-6">
                {featuredEyebrow}
              </span>
              <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-[0.9] uppercase mb-6 bg-clip-text text-transparent bg-[linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0.7)_50%,rgba(255,255,255,0.3)_100%)] drop-shadow-sm">
                FIRST ACCESS
              </h1>
              <p className="text-white/80 text-lg max-w-lg mb-4">
                July 4 is moving through first access before the public ticket
                drop. Join the list to get the earliest release signal.
              </p>
              <div className="flex items-center gap-3">
                <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="font-mono text-xs text-primary tracking-widest uppercase">
                  First access open — Release timing follows
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
                    <a className="cta-ghost">{CTA_LABELS.schedule}</a>
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
                      label: "Start Time",
                      value: featuredEvent?.time || "TBA",
                    },
                    {
                      icon: <MapPin className="w-4 h-4" />,
                      label: "Venue",
                      value: featuredVenue,
                    },
                    {
                      icon: <Users className="w-4 h-4" />,
                      label: "Entry",
                      value: "21+ · ID required",
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
                  className={`bg-[#050505] p-12 lg:p-16 flex flex-col h-full transition-all duration-700 hover:bg-white/[0.01] group`}
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
                        Coming Soon
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
          </div>
        </section>
      </main>
    </div>
  );
}
