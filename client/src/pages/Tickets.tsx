import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users, Ticket, Star, Crown, ArrowUpRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import UntoldButterflyLogo from "@/components/UntoldButterflyLogo";
import { POSH_TICKET_URL } from "@/data/events";
import { trackTicketIntent } from "@/lib/api";
import SEO from "@/components/SEO";

interface TicketTier {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  icon: React.ReactNode;
  available: boolean;
  highlight?: boolean;
}

const ticketTiers: TicketTier[] = [
  {
    id: "early-bird",
    name: "Early Bird",
    price: 45,
    originalPrice: 65,
    description: "Limited availability for early supporters",
    features: [
      "General admission",
      "Access to all rooms",
      "Welcome drink",
    ],
    icon: <Ticket className="w-6 h-6" />,
    available: true,
  },
  {
    id: "general",
    name: "General Admission",
    price: 65,
    description: "Standard entry",
    features: [
      "General admission",
      "Access to all rooms",
      "Welcome drink",
      "Event wristband",
    ],
    icon: <Star className="w-6 h-6" />,
    available: true,
    highlight: true,
  },
  {
    id: "vip",
    name: "VIP Experience",
    price: 120,
    description: "Elevated access",
    features: [
      "Priority entry",
      "Access to all rooms",
      "VIP lounge access",
      "Complimentary drinks",
      "Exclusive merch",
      "Meet & greet opportunity",
    ],
    icon: <Crown className="w-6 h-6" />,
    available: true,
  },
];

const eventVisuals = {
  poster: "/images/untold-story.jpg",
  deron: "/images/artist-deron-untold.webp",
  juany: "/images/artist-juany-bravo-untold.webp",
};

const lineupVisuals = [
  { name: "Juany Bravo", role: "B2B set with Deron", image: "/images/artist-juany-bravo-untold.webp" },
  { name: "Deron", role: "Chicago debut", image: "/images/artist-deron-untold.webp" },
  { name: "Hashtom", role: "Support", image: "/images/untold-story-hero-post1.webp" },
  { name: "Rose", role: "Support", image: "/images/untold-story.jpg" },
  { name: "Avo", role: "Support", image: "/images/artist-avo-untold.webp" },
  { name: "Jerome b2b Kenbo", role: "Support", image: "/images/artist-kenbo-untold.webp" },
];

export default function Tickets() {
  const handlePurchase = () => {
    void trackTicketIntent("tickets_page");
    window.open(POSH_TICKET_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <SEO
        title="Tickets"
        description="Secure your spot for the next Monolith Project event. Limited capacity available."
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_86%_20%,rgba(224,90,58,0.14),transparent_32%),radial-gradient(circle_at_50%_78%,rgba(139,92,246,0.14),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,15,0.45)_0%,rgba(6,6,15,0)_30%,rgba(6,6,15,0.55)_100%)]" />
      <Navigation />

      {/* Header */}
      <section className="pt-48 pb-16 px-6 relative">
        <div className="container max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-serif italic text-lg text-primary/80 block mb-6">
              On sale now
            </span>
            <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-[0.9] uppercase text-foreground mb-6">
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
          </motion.div>
        </div>
      </section>

      {/* Featured Event — S3E2 */}
      <section className="pb-16 px-6 relative">
        <div className="container max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="border border-white/20 p-8 md:p-10 relative overflow-hidden rounded-2xl bg-[linear-gradient(140deg,rgba(139,92,246,0.24),rgba(34,211,238,0.16)_38%,rgba(224,90,58,0.2)_100%)] backdrop-blur-sm shadow-[0_12px_40px_rgba(0,0,0,0.28)]">
              {/* Glow */}
              <div className="absolute -top-12 -right-12 w-[260px] h-[260px] opacity-40 blur-[90px] pointer-events-none bg-cyan-300/35" />
              <div className="absolute -bottom-16 -left-12 w-[260px] h-[260px] opacity-35 blur-[100px] pointer-events-none bg-orange-300/35" />
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_45%)] pointer-events-none" />

              <div className="relative">
                <div className="mb-8 overflow-hidden rounded-xl border border-white/25">
                  <img
                    src={eventVisuals.poster}
                    alt="Juany Bravo b2b Deron featured poster"
                    loading="eager"
                    decoding="async"
                    className="w-full h-auto object-cover"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <UntoldButterflyLogo className="w-5 h-5 text-primary" />
                    <span className="ui-chip text-primary">
                      Untold Story — Season III · Episode II
                    </span>
                  </div>
                  <a
                    href={POSH_TICKET_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill-coral sm:ml-auto w-fit"
                  >
                    BUY TICKETS <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

                <h2 className="font-display text-3xl md:text-4xl tracking-wide text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.28)] mb-8">
                  DERON B2B JUANY BRAVO
                </h2>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <div className="overflow-hidden rounded-xl border border-white/25">
                    <img
                      src={eventVisuals.deron}
                      alt="Deron portrait artwork"
                      loading="eager"
                      decoding="async"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="overflow-hidden rounded-xl border border-white/25">
                    <img
                      src={eventVisuals.juany}
                      alt="Juany Bravo portrait artwork"
                      loading="eager"
                      decoding="async"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-white/25 bg-white/10 flex items-center justify-center rounded-lg">
                      <Calendar className="w-4 h-4 text-cyan-200" />
                    </div>
                    <div>
                      <p className="ui-chip text-white/75">Date</p>
                      <p className="text-white">Friday, March 6, 2026</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-white/25 bg-white/10 flex items-center justify-center rounded-lg">
                      <Clock className="w-4 h-4 text-cyan-200" />
                    </div>
                    <div>
                      <p className="ui-chip text-white/75">Doors</p>
                      <p className="text-white">7:00 PM — 2:00 AM</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-white/25 bg-white/10 flex items-center justify-center rounded-lg">
                      <MapPin className="w-4 h-4 text-orange-200" />
                    </div>
                    <div>
                      <p className="ui-chip text-white/75">Venue</p>
                      <p className="text-white">Alhambra Palace · West Loop, Chicago</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-white/25 bg-white/10 flex items-center justify-center rounded-lg">
                      <Users className="w-4 h-4 text-violet-200" />
                    </div>
                    <div>
                      <p className="ui-chip text-white/75">Age</p>
                      <p className="text-white">21+ · Valid ID Required</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="ui-kicker text-white/75 mb-3">Lineup Visuals</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {lineupVisuals.map((artist) => (
                      <div key={artist.name} className="overflow-hidden rounded-xl border border-white/25 bg-black/20">
                        <img
                          src={artist.image}
                          alt={`${artist.name} lineup image`}
                          loading="lazy"
                          decoding="async"
                          className="w-full aspect-[4/5] object-cover"
                        />
                        <div className="px-3 py-2">
                          <p className="text-white text-sm font-semibold">{artist.name}</p>
                          <p className="text-white/65 text-xs">{artist.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ticket Tiers */}
      <section className="pb-24 px-6 relative">
        <div className="container max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="font-display text-3xl tracking-wide text-foreground">Choose Your Access</h2>
            <p className="text-white/75 text-sm mt-2">Pick a tier and complete purchase on Posh.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ticketTiers.map((tier) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className={`relative border p-8 flex flex-col rounded-2xl backdrop-blur-sm ${tier.highlight
                    ? "border-primary bg-[linear-gradient(145deg,rgba(224,90,58,0.2),rgba(139,92,246,0.16))] shadow-[0_10px_30px_rgba(224,90,58,0.25)]"
                    : "border-white/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]"
                  }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-6 px-4 py-1 bg-primary text-white text-[10px] font-mono tracking-widest uppercase rounded-full">
                    Popular
                  </div>
                )}

                <div className={`w-10 h-10 flex items-center justify-center mb-6 ${tier.highlight ? "text-primary" : "text-muted-foreground"
                  }`}>
                  {tier.icon}
                </div>

                <h3 className="font-display text-xl tracking-wide text-white mb-1 uppercase">
                  {tier.name}
                </h3>

                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-display text-4xl text-white">${tier.price}</span>
                  {tier.originalPrice && (
                    <span className="text-muted-foreground line-through text-sm">
                      ${tier.originalPrice}
                    </span>
                  )}
                </div>

                <p className="text-white/70 text-sm mb-4">{tier.description}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white/85">
                      <div className="w-1 h-1 bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handlePurchase}
                  disabled={!tier.available}
                  className={`w-full py-4 font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 rounded-full ${tier.highlight
                      ? "border border-primary text-primary hover:bg-primary hover:text-white"
                      : "border border-white/30 text-white hover:border-white/60 hover:bg-white/5"
                    } ${!tier.available && "opacity-50 cursor-not-allowed"}`}
                >
                  {tier.available ? (
                    <>
                      Get {tier.name}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </>
                  ) : "Sold Out"}
                </button>
              </motion.div>
            ))}
          </div>

          <p className="text-white/55 text-xs font-mono tracking-wide mt-8">
            All tickets are non-refundable. By purchasing, you agree to our terms and conditions. Elevated nightlife attire required.
          </p>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center border-t border-border pt-12"
          >
            <p className="text-white/70 text-sm mb-6 font-mono tracking-wide">
              Ready? All ticket tiers are available on Posh.
            </p>
            <a
              href={POSH_TICKET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill group text-base"
            >
              BUY TICKETS NOW
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
