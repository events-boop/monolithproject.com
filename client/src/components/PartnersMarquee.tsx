import { Building2, ArrowRight, RadioTower, Wrench } from "lucide-react";
import { Link } from "wouter";

const credibilityLanes = [
  {
    eyebrow: "Venue Context",
    title: "Rooms people remember",
    description:
      "Rooftops, parks, and venues that already carry something before the first track lands.",
    icon: Building2,
  },
  {
    eyebrow: "Production Stack",
    title: "Gear that holds up live",
    description:
      "Reliable DJ and audio setups built for long sets, clean handoffs, and nights that keep moving.",
    icon: Wrench,
  },
  {
    eyebrow: "Cultural Reach",
    title: "Outlets people know",
    description:
      "Media and discovery channels that help new guests place the project quickly.",
    icon: RadioTower,
  },
];

const affiliations = [
  { name: "Pioneer DJ", type: "Tool" },
  { name: "Rekordbox", type: "Tool" },
  { name: "Chicago Parks", type: "Venue" },
  { name: "Goose Island", type: "Brand" },
  { name: "Tito's Vodka", type: "Brand" },
  { name: "Resident Advisor", type: "Platform" },
  { name: "Boiler Room", type: "Media" },
  { name: "Cercle", type: "Media" },
  { name: "Beatport", type: "Platform" },
  { name: "Mixmag", type: "Media" },
];

export default function PartnersMarquee() {
  const marqueeItems = [...affiliations, ...affiliations];

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-background py-14 md:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(224,90,58,0.12),transparent_34%),radial-gradient(circle_at_82%_78%,rgba(34,211,238,0.08),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.015),transparent)]" />

      <div className="container relative z-10 mx-auto mb-8 max-w-6xl px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="ui-kicker scene-kicker mb-4 block">Who We Work With</span>
            <h2 className="font-display text-[clamp(2rem,4.8vw,4.25rem)] leading-[0.92] text-white">
              The rooms, tools, and outlets around the project matter.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/66 md:text-base">
              These names help people understand the scale of the room without taking over the
              story.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/partners"
              className="group inline-flex items-center gap-2 rounded-full border border-primary/28 bg-primary/10 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/15"
            >
              Partner With Monolith
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/press"
              className="group inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/78 transition-colors hover:border-white/20 hover:text-white"
            >
              View Press Context
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      <div className="container relative z-10 mx-auto mb-8 max-w-6xl px-6">
        <div className="grid gap-4 lg:grid-cols-3">
          {credibilityLanes.map((lane) => {
            const Icon = lane.icon;

            return (
              <div
                key={lane.title}
                className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-5 transition-colors hover:border-white/14 hover:bg-white/[0.045]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="ui-chip text-white/42">{lane.eyebrow}</p>
                    <h3 className="mt-3 font-display text-2xl uppercase text-white">{lane.title}</h3>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/22 bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-white/62">{lane.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto mb-4 flex max-w-6xl items-center justify-between gap-4 px-6">
          <span className="ui-chip text-white/42">Hover to pause</span>
          <span className="ui-chip text-white/34">Venue hosts · production gear · cultural outlets</span>
        </div>

        <div className="group relative overflow-hidden" aria-label="Partner and affiliation carousel">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

          <div className="flex w-max min-w-full shrink-0 animate-marquee items-center gap-4 whitespace-nowrap py-3 group-hover:[animation-play-state:paused]">
            {marqueeItems.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="inline-flex min-w-[15rem] items-center gap-4 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 transition-all duration-300 hover:border-white/18 hover:bg-white/[0.065]"
              >
                <span className="rounded-full border border-white/12 bg-black/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/48">
                  {item.type}
                </span>
                <span className="font-display text-xl uppercase tracking-[0.08em] text-white/82">
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          <div
            className="flex w-max min-w-full shrink-0 animate-marquee items-center gap-4 whitespace-nowrap py-3 group-hover:[animation-play-state:paused]"
            aria-hidden="true"
          >
            {marqueeItems.map((item, index) => (
              <div
                key={`dup-${item.name}-${index}`}
                className="inline-flex min-w-[15rem] items-center gap-4 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 transition-all duration-300 hover:border-white/18 hover:bg-white/[0.065]"
              >
                <span className="rounded-full border border-white/12 bg-black/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/48">
                  {item.type}
                </span>
                <span className="font-display text-xl uppercase tracking-[0.08em] text-white/82">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
