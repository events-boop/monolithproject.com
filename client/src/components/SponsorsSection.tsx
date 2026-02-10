import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import RevealText from "./RevealText";

interface Sponsor {
  name: string;
  tier: "headline" | "partner" | "supporter";
  url?: string;
}

const sponsors: Sponsor[] = [
  // Headline
  { name: "PIONEER DJ", tier: "headline" },
  { name: "GOOSE ISLAND", tier: "headline" },
  // Partners
  { name: "REKORDBOX", tier: "partner" },
  { name: "TITO'S VODKA", tier: "partner" },
  { name: "RESIDENT ADVISOR", tier: "partner" },
  { name: "CHICAGO PARKS", tier: "partner" },
  // Supporters
  { name: "BOILER ROOM", tier: "supporter" },
  { name: "CERCLE", tier: "supporter" },
  { name: "BEATPORT", tier: "supporter" },
  { name: "MIXMAG", tier: "supporter" },
  { name: "DJ MAG", tier: "supporter" },
  { name: "DEFECTED", tier: "supporter" },
];

const headlines = sponsors.filter((s) => s.tier === "headline");
const partners = sponsors.filter((s) => s.tier === "partner");
const supporters = sponsors.filter((s) => s.tier === "supporter");

function SponsorBlock({ sponsor, size }: { sponsor: Sponsor; size: "lg" | "md" | "sm" }) {
  const sizeClasses = {
    lg: "h-28 md:h-36 text-2xl md:text-3xl",
    md: "h-20 md:h-24 text-lg md:text-xl",
    sm: "h-16 md:h-20 text-sm md:text-base",
  };

  return (
    <div
      className={`${sizeClasses[size]} border border-border bg-white/[0.02] flex items-center justify-center px-6 hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-500 group`}
    >
      <span className="font-display tracking-[0.2em] text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors duration-500 text-center">
        {sponsor.name}
      </span>
    </div>
  );
}

export default function SponsorsSection() {
  return (
    <section id="sponsors" className="section-rhythm border-t border-border">
      <div className="container max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="ui-kicker text-primary mb-4 block">
              Supported By
            </span>
            <RevealText
              as="h2"
              className="font-display text-5xl md:text-7xl text-foreground"
            >
              SPONSORS
            </RevealText>
          </div>
          <Link href="/partners">
            <div className="group flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors cursor-pointer md:pb-3">
              <span>Become a Partner</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Headline Sponsors */}
        <div className="mb-3">
          <span className="ui-chip text-muted-foreground/50 block mb-3">
            Headline
          </span>
          <div className="grid grid-cols-2 gap-3">
            {headlines.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <SponsorBlock sponsor={s} size="lg" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Partner Sponsors */}
        <div className="mb-3">
          <span className="ui-chip text-muted-foreground/50 block mb-3">
            Partners
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {partners.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <SponsorBlock sponsor={s} size="md" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Supporters */}
        <div>
          <span className="ui-chip text-muted-foreground/50 block mb-3">
            Supporters
          </span>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {supporters.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
              >
                <SponsorBlock sponsor={s} size="sm" />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
