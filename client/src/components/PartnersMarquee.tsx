import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const partners = [
  "REKORDBOX",
  "PIONEER DJ",
  "CHICAGO PARKS",
  "GOOSE ISLAND",
  "TITO'S VODKA",
  "RESIDENT ADVISOR",
  "BOILER ROOM",
  "CERCLE",
];

export default function PartnersMarquee() {
  // Double the array for seamless loop
  const doubled = [...partners, ...partners];

  return (
    <section className="py-16 border-t border-border overflow-hidden">
      <div className="container max-w-6xl mx-auto px-6 mb-8 flex items-end justify-between">
        <div>
          <span className="font-mono text-xs text-primary tracking-widest uppercase block mb-2">
            Our Partners
          </span>
          <p className="text-muted-foreground text-sm">
            The brands and organizations behind the shows.
          </p>
        </div>
        <Link href="/partners">
          <div className="group flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors cursor-pointer">
            <span>Become a Partner</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Marquee */}
      <div className="relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {doubled.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="mx-9 md:mx-14 font-display text-3xl md:text-4xl tracking-[0.04em] text-muted-foreground/35 hover:text-muted-foreground/70 transition-colors duration-300 cursor-default select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
