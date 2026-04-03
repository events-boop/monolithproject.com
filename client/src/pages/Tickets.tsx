import { motion } from "framer-motion";
import type { SyntheticEvent } from "react";
import { Calendar, MapPin, Clock, Users, Ticket, Star, Crown, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import UntoldButterflyLogo from "@/components/UntoldButterflyLogo";
import { trackTicketIntent } from "@/lib/api";
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
  getPrimaryTicketUrl,
} from "@/lib/siteExperience";
import { getResponsiveImage } from "@/lib/responsiveImages";
import { CTA_LABELS } from "@/lib/cta";

import { TicketTier } from "@/data/events";

// Icon mapping helper
const getTierIcon = (iconName: string) => {
  switch (iconName) {
    case "star": return <Star className="w-6 h-6" />;
    case "crown": return <Crown className="w-6 h-6" />;
    case "ticket": 
    default:
      return <Ticket className="w-6 h-6" />;
  }
};

const eventVisuals = {
  poster: "/images/untold-story.jpg",
  eran: "/images/artist-lazare.webp", // Replace when real art is available
};

const lineupVisuals = [
  { name: "Eran Hersh", role: "Chicago debut / Headliner", image: "/images/artist-lazare.webp" },
  { name: "Hashtom", role: "Support", image: "/images/untold-story-hero-post1.webp" },
  { name: "Local Support TBA", role: "Support", image: "/images/untold-story.jpg" },
];

const untoldTicketPoster = getResponsiveImage("untoldStoryPoster");

export default function Tickets() {
  const featuredEvent = getExperienceEvent("ticket");
  const ticketUrl = getPrimaryTicketUrl(featuredEvent);
  const hasTicketLink = Boolean(ticketUrl);
  const primaryCtaLabel = hasTicketLink ? CTA_LABELS.tickets : CTA_LABELS.innerCircle;
  const executeCtaLabel = hasTicketLink ? "EXECUTE ACCESS" : CTA_LABELS.innerCircle;
  const featuredEventSchema =
    featuredEvent && getEventWindowStatus(featuredEvent) !== "past"
      ? buildScheduledEventSchema(featuredEvent, "/tickets")
      : null;
  const featuredHeadline = featuredEvent?.headline || featuredEvent?.title || "Featured Event";
  const featuredEyebrow = featuredEvent?.subtitle || getEventEyebrow(featuredEvent);
  const featuredVenue = getEventVenueLabel(featuredEvent);
  const featuredPoster =
    featuredEvent?.id === "us-s3e3"
      ? eventVisuals.poster
      : featuredEvent?.image || "/images/autograf-recap.jpg";
  const showLineupVisuals = featuredEvent?.id === "us-s3e3";

  const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = "/images/hero-monolith.jpg";
  };

  const handlePurchase = () => {
    if (!ticketUrl) return;
    void trackTicketIntent("tickets_page");
    window.open(ticketUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <SEO
        title="Tickets"
        description="Secure your spot for the next Monolith Project event. Limited capacity available."
      />
      {featuredEventSchema ? <JsonLd data={featuredEventSchema} /> : null}
      <div className="pointer-events-none absolute inset-0 bg-tickets-top-glow" />
      <div className="pointer-events-none absolute inset-0 bg-tickets-bottom-glow" />
      <Navigation />

      <main id="main-content" tabIndex={-1}>
      {/* Header */}
      <section className="page-shell-start-loose pb-16 px-6 relative">
        <div className="container max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-serif italic text-lg text-primary/80 block mb-6">
              {featuredEyebrow}
            </span>
            <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-[0.9] uppercase mb-6 bg-clip-text text-transparent bg-[linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0.7)_50%,rgba(255,255,255,0.3)_100%)] drop-shadow-sm">
              GET TICKETS
            </h1>
            <p className="text-white/80 text-lg max-w-lg mb-4">
              Secure your spot. Limited capacity at every show.
            </p>
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="font-mono text-xs text-primary tracking-widest uppercase">
                Tickets selling fast — Limited availability
              </span>
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <MagneticButton strength={0.3}>
                {hasTicketLink ? (
                  <a
                    href={ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill-coral flex items-center justify-center"
                  >
                    {primaryCtaLabel}
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </a>
                ) : (
                  <Link href="/newsletter" asChild>
                    <a className="btn-pill-coral flex items-center justify-center">
                      {primaryCtaLabel}
                      <ArrowUpRight className="w-4 h-4 ml-2" />
                    </a>
                  </Link>
                )}
              </MagneticButton>
              <MagneticButton strength={0.22}>
                <Link href="/schedule" asChild>
                  <a className="btn-pill border-white/20 bg-white/[0.03] text-white/90 hover:text-white hover:border-white/40 flex items-center justify-center">
                    {CTA_LABELS.schedule}
                  </a>
                </Link>
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Giveaway / Viral Loop Funnel */}
      {featuredEvent?.activeFunnels?.length ? <EventFunnelStack eventId={featuredEvent.id} /> : null}      {/* Featured Event Section */}
      <section className="pb-32 px-6 relative">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col lg:grid lg:grid-cols-12 gap-16 lg:gap-24 items-start"
          >
             {/* Left — Visual Focus */}
             <div className="lg:col-span-7 w-full">
                <div className="relative group overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02]">
                   <SmartImage
                     src={featuredEvent?.id === "us-s3e3" ? untoldTicketPoster.src : featuredPoster}
                     alt={featuredHeadline}
                     sources={featuredEvent?.id === "us-s3e3" ? untoldTicketPoster.sources : undefined}
                     sizes={featuredEvent?.id === "us-s3e3" ? untoldTicketPoster.sizes : undefined}
                     priority
                     className="w-full h-auto aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-105"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                   
                   {/* Lineup Overlay (If US S3E2) */}
                   {showLineupVisuals && (
                      <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-wrap gap-3">
                         {lineupVisuals.slice(0, 3).map((artist) => (
                           <div key={artist.name} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
                              <img src={artist.image} className="w-8 h-8 rounded-full object-cover" />
                              <span className="font-mono text-[9px] uppercase tracking-widest text-white/80">{artist.name}</span>
                           </div>
                         ))}
                      </div>
                   )}
                </div>
             </div>

             {/* Right — Technicals & Action */}
             <div className="lg:col-span-5 flex flex-col gap-10">
                <div>
                   <div className="flex items-center gap-4 mb-6 text-primary">
                      {featuredEvent?.series === "untold-story" ? <UntoldButterflyLogo className="w-5 h-5" /> : <div className="h-2 w-2 rounded-full bg-primary" />}
                      <span className="font-mono text-[10px] uppercase tracking-[0.5em]">{featuredEyebrow} / Sequence</span>
                   </div>
                   <h2 className="font-display text-5xl md:text-6xl lg:text-7xl uppercase leading-[0.95] text-white tracking-widest block mb-8">
                     {featuredHeadline}
                   </h2>
                   <div className="h-px w-20 bg-primary/40 mb-8" />
                   <p className="text-lg md:text-xl leading-relaxed text-white/50 max-w-lg font-light">
                      {featuredEvent?.description || "High-end atmosphere meeting deep recurring sound logic."}
                   </p>
                </div>

                <div className="grid grid-cols-2 gap-y-12 gap-x-8 border-y border-white/5 py-12">
                   {[
                      { icon: <Calendar className="w-4 h-4" />, label: "Sequence Date", value: featuredEvent?.date || "TBA" },
                      { icon: <Clock className="w-4 h-4" />, label: "System Start", value: featuredEvent?.time || "TBA" },
                      { icon: <MapPin className="w-4 h-4" />, label: "Coordinate Location", value: featuredVenue },
                      { icon: <Users className="w-4 h-4" />, label: "Access Protocol", value: "21+ · ID Required" }
                   ].map((item) => (
                      <div key={item.label} className="flex flex-col gap-3">
                         <div className="flex items-center gap-2 text-white/20">
                            {item.icon}
                            <span className="font-mono text-[9px] uppercase tracking-[0.3em]">{item.label}</span>
                         </div>
                         <span className="font-display text-lg uppercase tracking-wider text-white/90">{item.value}</span>
                      </div>
                   ))}
                </div>

                <div className="pt-4">
                   <MagneticButton strength={0.4}>
                      {hasTicketLink ? (
                        <a
                          href={ticketUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-pill px-12 py-6 text-xs font-bold tracking-[0.4em] bg-primary text-white border-primary shadow-[0_20px_50px_rgba(224,90,58,0.3)]"
                        >
                           {executeCtaLabel}
                           <ArrowUpRight className="w-4 h-4 ml-3" />
                        </a>
                      ) : (
                        <Link href="/newsletter" asChild>
                          <a className="btn-pill px-12 py-6 text-xs font-bold tracking-[0.4em] bg-primary text-white border-primary shadow-[0_20px_50px_rgba(224,90,58,0.3)]">
                             {executeCtaLabel}
                             <ArrowUpRight className="w-4 h-4 ml-3" />
                          </a>
                        </Link>
                      )}
                   </MagneticButton>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Ticket Tiers — Integrated Grid */}
      <section className="pb-32 px-6 border-t border-white/5 pt-32 relative">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
             <div className="max-w-xl">
                <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-white/20 mb-4 block">Tier Logic</span>
                <h2 className="font-display text-5xl uppercase text-white tracking-widest">Select Access</h2>
                <p className="mt-6 text-lg text-white/40 font-light">Choose your level of engagement for the upcoming chapter. All tiers integrated through Posh.</p>
             </div>
             <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/20 italic">Systems synchronized {new Date().getFullYear()}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5 rounded-[2.5rem] overflow-hidden">
            {(featuredEvent?.ticketTiers || []).map((tier: TicketTier) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8 }}
                className={`bg-[#050505] p-12 lg:p-16 flex flex-col h-full transition-all duration-700 hover:bg-white/[0.01] group`}
              >
                <div className="flex items-center justify-between mb-12">
                   <div className={`w-14 h-14 rounded-full border border-white/5 flex items-center justify-center transition-all duration-700 group-hover:border-primary/30 group-hover:bg-primary/5 ${tier.highlight ? "text-primary border-primary/20 bg-primary/10" : "text-white/20 group-hover:text-primary"}`}>
                      {getTierIcon(tier.icon)}
                   </div>
                   {tier.highlight && <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-primary/80 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">High Demand</span>}
                </div>

                <div className="flex-1">
                   <h3 className="font-display text-3xl uppercase tracking-widest text-white mb-6">
                     {tier.name}
                   </h3>
                   <div className="flex items-baseline gap-3 mb-8">
                     <span className="font-display text-5xl text-white">${tier.price}</span>
                     {tier.originalPrice && <span className="text-white/20 line-through text-lg">${tier.originalPrice}</span>}
                   </div>
                   
                   <p className="text-white/40 text-base font-light mb-10 leading-relaxed max-w-sm">
                      {tier.description}
                   </p>

                   <ul className="space-y-4 mb-16">
                     {tier.features.map((feature: string, i: number) => (
                       <li key={i} className="flex items-center gap-4 text-[11px] font-mono uppercase tracking-[0.2em] text-white/30 group-hover:text-white/60 transition-colors">
                         <div className="h-px w-3 bg-white/10 group-hover:bg-primary transition-colors" />
                         {feature}
                       </li>
                     ))}
                   </ul>
                </div>

                <button
                  onClick={handlePurchase}
                  disabled={!tier.available}
                  className={`w-full h-16 flex items-center justify-center gap-3 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] transition-all duration-700 ${
                    tier.highlight 
                      ? "bg-primary text-white shadow-[0_15px_30px_rgba(224,90,58,0.2)] hover:shadow-[0_20px_40px_rgba(224,90,58,0.3)] hover:-translate-y-1" 
                      : "border border-white/10 text-white/40 hover:text-white hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  {tier.available ? (
                    <>
                      GET {tier.name}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </>
                  ) : "Sold Out"}
                </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-8">
             <p className="text-white/20 text-[9px] font-mono tracking-widest uppercase italic border-l border-white/5 pl-6">
                All transmissions final. Access protocol non-refundable. Wear with intent.
             </p>
             <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-primary/20" />
                <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/20">Secure Signal Posh:2026 // Active</span>
             </div>
          </div>
        </div>
      </section>

      {/* Footer / Funnel Spill */}
      {featuredEvent?.activeFunnels?.length ? <EventFunnelStack eventId={featuredEvent.id} /> : null}
      </main>
    </div>
  );
}
