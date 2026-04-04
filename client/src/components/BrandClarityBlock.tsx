import { motion } from "framer-motion";
import { ArrowUpRight, CalendarRange, Radio, Users } from "lucide-react";
import { Link } from "wouter";

const clarityCards = [
  {
    label: "Live",
    title: "Series & Chapters",
    description: "Recurring nights, distinct formats, and the next dates that define the live side of the Monolith world.",
    cta: "View Schedule",
    href: "/schedule",
    icon: CalendarRange,
  },
  {
    label: "Signal",
    title: "Radio & Context",
    description: "The Chasing Sun(Sets) Radio Show, archive, and editorial context that make the booking taste easier to hear and trust.",
    cta: "Open Radio",
    href: "/radio",
    icon: Radio,
  },
  {
    label: "People",
    title: "Partners & Crowd",
    description: "Artists, venues, collaborators, and returning guests connected by the same standard and the same room logic.",
    cta: "Meet The Network",
    href: "/partners",
    icon: Users,
  },
  {
    label: "Archive",
    title: "Media & Insight",
    description: "The captured moments and recorded history of every room, preserved as a living record of the project.",
    cta: "Browse Archive",
    href: "/archive",
    icon: ArrowUpRight,
  },
];

export default function BrandClarityBlock() {
  return (
    <section className="relative z-10 px-6 py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left Wing — The Logic */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-4 mb-8">
                 <div className="h-[2px] w-12 bg-primary/40 shadow-[0_0_15px_rgba(224,90,58,0.3)]" />
                 <span className="font-mono text-[11px] md:text-sm uppercase tracking-[0.5em] text-primary/90">Project Clarity</span>
              </div>
              
              <h2 className="font-display text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.85] uppercase text-white drop-shadow-2xl mb-10">
                ONE HOUSE.<br />
                <span className="text-white/20 font-serif italic tracking-wider">FOUR EXPRESSIONS.</span>
              </h2>
              
              <p className="text-lg md:text-xl leading-relaxed text-white/50 max-w-xl font-light">
                Monolith works because the parts are distinct yet connected by a shared standard of curation. From the warmth of the sunset to the depth of the untold night, the logic remains the same: <span className="text-white">rooms worth returning to.</span>
              </p>

              <div className="mt-12 flex flex-col gap-6 border-l border-white/5 pl-8">
                 <p className="text-xs uppercase tracking-[0.3em] text-white/20 font-mono">System Architecture v1.02</p>
                 <div className="flex flex-wrap gap-x-8 gap-y-4">
                    {["Curated Rooms", "Music-First", "Chicago-Rooted", "Global Signal"].map((trait) => (
                      <span key={trait} className="font-mono text-[11px] md:text-xs uppercase tracking-[0.4em] text-white/50">{trait}</span>
                    ))}
                 </div>
              </div>
            </motion.div>
          </div>

          {/* Right Wing — The Expressions */}
          <div className="lg:w-1/2 space-y-4 md:space-y-6">
            {clarityCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, x: 25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={card.href}
                    className="group relative block p-8 md:p-12 transition-all duration-700 overflow-hidden"
                  >
                    {/* Architectural Underlay */}
                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-white/5 via-white/20 to-transparent group-hover:via-primary/40 transition-all duration-700" />
                    <div className="absolute inset-0 bg-white/[0.01] group-hover:bg-white/[0.03] transition-all duration-700 -z-10" />
                    
                    <div className="flex items-start justify-between gap-8 mb-6">
                      <div className="flex flex-col gap-2">
                        <span className="font-mono text-[11px] md:text-xs uppercase tracking-[0.4em] text-white/35 group-hover:text-primary transition-colors">{card.label}</span>
                        <h3 className="font-display text-3xl md:text-4xl lg:text-5xl uppercase text-white group-hover:tracking-wider transition-all duration-700">
                          {card.title}
                        </h3>
                      </div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/5 bg-white/[0.02] text-white/20 group-hover:border-primary/20 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-700 group-hover:scale-110">
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                    
                    <p className="text-sm md:text-base leading-relaxed text-white/40 group-hover:text-white/70 transition-all duration-700 max-w-lg">
                      {card.description}
                    </p>

                    <div className="mt-10 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 group-hover:text-white transition-all duration-700">
                      <div className="h-px w-6 bg-white/10 group-hover:w-12 transition-all duration-700 group-hover:bg-primary" />
                      {card.cta}
                      <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-x-4 group-hover:translate-x-0" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
