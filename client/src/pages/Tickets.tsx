/*
  DESIGN: Cosmic Mysticism - Tickets Page
  - Event details and date
  - Ticket tier options (Early Bird, General, VIP)
  - Clean, immersive design matching the brand
*/

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Clock, Users, Ticket, Star, Crown } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import ParticleField from "@/components/ParticleField";

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
      "Access to all stages",
      "Welcome drink",
    ],
    icon: <Ticket className="w-6 h-6" />,
    available: true,
  },
  {
    id: "general",
    name: "General Admission",
    price: 65,
    description: "Standard entry to the gathering",
    features: [
      "General admission",
      "Access to all stages",
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
    description: "Elevated access for the true seekers",
    features: [
      "Priority entry",
      "Access to all stages",
      "VIP lounge access",
      "Complimentary drinks",
      "Exclusive merch",
      "Meet & greet opportunity",
    ],
    icon: <Crown className="w-6 h-6" />,
    available: true,
  },
];

export default function Tickets() {
  const handlePurchase = (tier: TicketTier) => {
    toast(`${tier.name} tickets coming soon! Join the newsletter to be notified.`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Particle background */}
      <ParticleField />

      {/* Back Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-6 left-6 z-50"
      >
        <Link href="/">
          <a className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={20} />
            <span className="text-sm tracking-widest uppercase">Back</span>
          </a>
        </Link>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-ultra-wide text-foreground mb-4">
            GET <span className="text-primary">TICKETS</span>
          </h1>
          <p className="text-muted-foreground tracking-widest uppercase text-sm md:text-base">
            Secure your place in the gathering
          </p>
        </motion.div>

        {/* Event Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8">
            <h2 className="font-display text-2xl md:text-3xl tracking-widest text-primary mb-6 text-center">
              CHASING SUN(SETS)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm uppercase tracking-wide">Date</p>
                  <p className="text-foreground font-medium">TBA 2026</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm uppercase tracking-wide">Time</p>
                  <p className="text-foreground font-medium">Golden Hour — Sunset</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm uppercase tracking-wide">Location</p>
                  <p className="text-foreground font-medium">To Be Announced</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm uppercase tracking-wide">Capacity</p>
                  <p className="text-foreground font-medium">Limited — Intimate Gathering</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ticket Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {ticketTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              className={`relative bg-card/50 backdrop-blur-sm border rounded-lg p-6 flex flex-col ${
                tier.highlight
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-border"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs tracking-widest uppercase rounded-full">
                  Popular
                </div>
              )}

              {/* Icon */}
              <div className={`p-3 rounded-lg w-fit mb-4 ${
                tier.highlight ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              }`}>
                {tier.icon}
              </div>

              {/* Tier Name */}
              <h3 className="font-display text-xl tracking-widest text-foreground mb-2">
                {tier.name.toUpperCase()}
              </h3>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display text-3xl text-primary">${tier.price}</span>
                {tier.originalPrice && (
                  <span className="text-muted-foreground line-through text-sm">
                    ${tier.originalPrice}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm mb-6">{tier.description}</p>

              {/* Features */}
              <ul className="space-y-2 mb-8 flex-1">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <motion.button
                onClick={() => handlePurchase(tier)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!tier.available}
                className={`w-full py-3 rounded-lg font-medium text-sm tracking-widest uppercase transition-all ${
                  tier.highlight
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-foreground hover:bg-muted/80"
                } ${!tier.available && "opacity-50 cursor-not-allowed"}`}
              >
                {tier.available ? "Select" : "Sold Out"}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center text-muted-foreground text-sm mt-12"
        >
          All tickets are non-refundable. By purchasing, you agree to our terms and conditions.
        </motion.p>
      </div>
    </div>
  );
}
