import { motion } from "framer-motion";
import type { SyntheticEvent } from "react";
import { Calendar, MapPin, Clock, Users, Ticket, Star, Crown, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import "@/styles/themes/tickets.css";
import Navigation from "@/components/Navigation";
import UntoldButterflyLogo from "@/components/UntoldButterflyLogo";
import { trackTicketIntent } from "@/lib/api";
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
import { getResponsiveImage } from "@/lib/responsiveImages";
import { CTA_LABELS, getEventCta } from "@/lib/cta";
import { usePublicSiteDataVersion } from "@/lib/siteData";
import type { TicketTier } from "@/data/events";

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
  poster: "/images/untold-story-moody.webp",
};

const lineupVisuals = [
  { name: "Eran Hersh", role: "Chicago debut / Headliner", image: "/images/artist-lazare.webp" },
  { name: "Hashtom", role: "Support", image: "/images/untold-story-hero-post1.webp" },
  { name: "Local Support TBA", role: "Support", image: "/images/untold-story-moody.webp" },
];

const untoldTicketPoster = getResponsiveImage("untoldStoryPoster");

export default function Tickets() {
  usePublicSiteDataVersion();
  const featuredEvent = getExperienceEvent("ticket");
  const cta = getEventCta(featuredEvent);
  
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

  const handlePurchase = (source: string, destinationUrl?: string) => {
    if (!destinationUrl) return;
    signalChirp.boot();
    void trackTicketIntent(source, featuredEvent?.id, destinationUrl);
    
    // Immediate execution for zero-friction conversion
    window.open(destinationUrl, "_blank", "noopener,noreferrer");
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
        <div className="container layout-default">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-serif italic text-lg text-primary/80 block mb-6">
              {featuredEyebrow}
            </span>
            <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-[0.9] uppercase mb-6 bg-clip-text text-transparent bg-[linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0.7)_50%,rgba(255,255,255,0.3)_100%)] drop-shadow-sm">
              SECURE ACCESS
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
            <div className="mt-8 flex flex-col gap-6 sm:flex-row items-center">
              <MagneticButton strength={0.3}>
                  <a
                    href={cta.href}
                    target={cta.isExternal ? "_blank" : undefined}
                    rel={cta.isExternal ? "noopener noreferrer" : undefined}
                    onClick={() => void trackTicketIntent("tickets_page_header", featuredEvent?.id, cta.href)}
                    className={`
                      px-12 py-5 text-[12px] font-black uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center min-w-[220px] rounded-none
                      ${cta.tool === 'posh' ? 'cta-posh' : 'cta-laylo'}
                    `}
                  >
                    {cta.label}
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </a>
              </MagneticButton>
              <MagneticButton strength={0.22}>
                <Link href="/schedule" asChild>
                  <a className="cta-ghost flex items-center justify-center px-10 py-5">
                    {CTA_LABELS.schedule}
                  </a>
                </Link>
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Giveaway / Viral Loop Funnel */}
      {featuredEvent?.activeFunnels?.length ? (
        <section id="tickets-funnel">
          <EventFunnelStack eventId={featuredEvent.id} />
        </section>
      ) : null}

      {/* Featured Event Section */}
      <section className="pb-32 px-6 relative">
        <div className="container layout-wide">
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
                              <span className="font-mono text-[10px] uppercase tracking-widest text-white/80">{artist.name}</span>
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
                      <span className="font-mono text-[10px] uppercase tracking-[0.5em]">{featuredEyebrow}</span>
                   </div>
                   <h2 className="font-display text-5xl md:text-6xl lg:text-7xl uppercase leading-[0.95] text-white tracking-widest block mb-8">
                     <KineticDecryption text={featuredHeadline} />
                   </h2>
                   <div className="h-px w-20 bg-primary/40 mb-8" />
                   <p className="text-lg md:text-xl leading-relaxed text-white/50 max-w-lg font-light">
                      {featuredEvent?.description || "Music-first nights with limited capacity, strong curation, and a room worth arriving for."}
                   </p>
                </div>

                <div className="grid grid-cols-2 gap-y-12 gap-x-8 border-y border-white/5 py-12">
                   {[
                      { icon: <Calendar className="w-4 h-4" />, label: "Date", value: featuredEvent?.date || "TBA" },
                      { icon: <Clock className="w-4 h-4" />, label: "Start Time", value: featuredEvent?.time || "TBA" },
                      { icon: <MapPin className="w-4 h-4" />, label: "Venue", value: featuredVenue },
                      { icon: <Users className="w-4 h-4" />, label: "Entry", value: "21+ · ID required" }
                   ].map((item) => (
                      <div key={item.label} className="flex flex-col gap-3">
                         <div className="flex items-center gap-2 text-white/20">
                            {item.icon}
                            <span className="font-mono text-[10px] uppercase tracking-[0.3em]">{item.label}</span>
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
                           onClick={() => void trackTicketIntent("tickets_page_featured", featuredEvent?.id, cta.href)}
                           className={`
                             px-12 py-6 text-xs font-black tracking-[0.4em] transition-all duration-500 min-w-[280px] flex items-center justify-center rounded-none
                             ${cta.tool === 'posh' ? 'cta-posh' : 'cta-laylo'}
                           `}
                         >
                            {cta.label === CTA_LABELS.tickets ? "TICKETS" : cta.label}
                            <ArrowUpRight className="w-4 h-4 ml-3" />
                         </a>
                    </MagneticButton>
                 </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Ticket Tiers — Integrated Grid */}
      <section className="pb-32 px-6 border-t border-white/5 pt-32 relative">
        <div className="container layout-wide">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
             <div className="max-w-xl">
                <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-white/20 mb-4 block">Ticket Tiers</span>
                <h2 className="font-display text-5xl uppercase text-white tracking-widest">Choose Your Ticket</h2>
                <p className="mt-6 text-lg text-white/40 font-light">Choose the option that fits your night. All purchases are handled through Posh.</p>
             </div>
             <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/20 italic">Updated for {new Date().getFullYear()}</p>
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
                   {tier.highlight && <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/80 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">High Demand</span>}
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
                  onClick={() => handlePurchase(`tickets_page_${tier.id}`, cta.href)}
                  disabled={!tier.available}
                  className={`w-full h-16 flex items-center justify-center gap-3 transition-all duration-700 rounded-none ${
                    tier.available
                      ? tier.highlight 
                        ? "cta-posh" 
                        : "cta-laylo !bg-white/5 border-white/10 hover:border-primary/40"
                      : "bg-white/5 border border-white/5 text-white/20 cursor-not-allowed"
                  }`}
                >
                  {tier.available ? (
                    <>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                        {cta.label === CTA_LABELS.tickets ? tier.name : cta.label}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sold Out</span>
                  )}
                </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-8">
             <p className="text-white/20 text-[10px] font-mono tracking-widest uppercase italic border-l border-white/5 pl-6">
                All ticket sales are final unless the event is canceled or rescheduled.
             </p>
             <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-primary/20" />
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/20">Secure checkout via Posh</span>
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
