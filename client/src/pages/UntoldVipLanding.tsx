import { Link } from "wouter";
import SEO from "@/components/SEO";
import ResponsiveImage from "@/components/ResponsiveImage";

const UNTOLD_URL = "https://untold.vip";
const MONOLITH_URL = "https://monolithproject.com";

const PREVIOUS_SHOWS = [
  {
    chapter: "I",
    title: "Lazare Sabry",
    date: "December 12, 2025",
    schemaDate: "2025-12-12",
    venue: "Carbon Nightclub",
    location: "Chicago, IL",
    image: "/images/lazare-recap.webp",
    href: "/untold-story/season-ii",
    ctaLabel: "View Gallery",
    note: "The first public signal: intimate room, late-night pressure, and a crowd locked into the idea.",
  },
  {
    chapter: "II",
    title: "Juany & Deron",
    date: "March 6, 2026",
    schemaDate: "2026-03-06",
    venue: "Chicago",
    location: "Chicago, IL",
    image: "/images/juany.jpeg",
    href: "/untold-story/season-iii",
    ctaLabel: "View Gallery",
    note: "Juany and Deron went back-to-back in a percussion-led set. The tightest dancefloor of the season.",
  },
  {
    chapter: "III",
    title: "Autograf",
    date: "March 21, 2026",
    schemaDate: "2026-03-21",
    venue: "Alhambra Palace",
    location: "Chicago, IL",
    image: "/images/autograf-recap.jpg",
    href: "/artists/autograf",
    ctaLabel: "View Artist",
    note: "Live instrumentation and immersive room design pushed the series into a larger cinematic lane.",
  },
  {
    chapter: "IV",
    title: "Eran Hersh",
    date: "May 16, 2026",
    schemaDate: "2026-05-16",
    venue: "Hideaway Chicago",
    location: "Chicago, IL",
    image: "/images/eran-hersh-untold-story-iv.jpg",
    href: "/events/eran-hersh-untold-story-iv",
    ctaLabel: "View Event",
    note: "Afro and melodic house pressure carried the room from peak-hour movement into the late finish.",
  },
] as const;

const RELATED_LINKS = [
  {
    label: "Sun(Sets)",
    href: "https://sunsets.vip",
    detail: "Open-air lakefront house music.",
  },
  {
    label: "Monolith Project",
    href: MONOLITH_URL,
    detail: "The full Chicago music ecosystem.",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/untoldstory.music",
    detail: "Follow chapter drops and room records.",
  },
] as const;

const schemaData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Untold Story",
    url: UNTOLD_URL,
    publisher: {
      "@type": "Organization",
      name: "The Monolith Project",
      url: MONOLITH_URL,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Untold Story previous shows",
    url: UNTOLD_URL,
    itemListElement: PREVIOUS_SHOWS.map((show, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "MusicEvent",
        name: `Untold Story ${show.chapter}: ${show.title}`,
        startDate: show.schemaDate,
        eventStatus: "https://schema.org/EventCompleted",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        image: `${UNTOLD_URL}${show.image}`,
        location: {
          "@type": "Place",
          name: show.venue,
          address: show.location,
        },
        organizer: {
          "@type": "Organization",
          name: "The Monolith Project",
          url: MONOLITH_URL,
        },
      },
    })),
  },
];

function externalRel(href: string) {
  return /^https?:\/\//i.test(href) ? "noopener noreferrer" : undefined;
}

function externalTarget(href: string) {
  return /^https?:\/\//i.test(href) ? "_blank" : undefined;
}

export default function UntoldVipLanding() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#03040A] text-white selection:bg-[#22D3EE]/30 selection:text-white">
      <SEO
        title="Untold Story | Previous Shows"
        description="Previous Untold Story chapters from The Monolith Project: Lazare Sabry, Deron x Juany, Autograf, and Eran Hersh."
        absoluteTitle
        canonicalUrl={`${UNTOLD_URL}/`}
        image="/images/untold-story-moody.webp"
        schemaData={schemaData}
      />

      <main className="relative isolate min-h-screen px-4 pb-8 pt-5 sm:px-6 sm:pb-12 lg:px-8">
        <div
          className="pointer-events-none absolute left-1/2 top-[-8rem] -z-10 h-[34rem] w-[34rem] max-w-[125vw] -translate-x-1/2 rounded-full bg-[#22D3EE]/14 blur-[120px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-[-8rem] top-[22rem] -z-10 h-[30rem] w-[30rem] rounded-full bg-[#8B5CF6]/14 blur-[120px]"
          aria-hidden="true"
        />

        <section className="mx-auto grid min-h-[calc(100svh-3.25rem)] w-full max-w-6xl items-center gap-8 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.78fr)] lg:gap-12 lg:py-10">
          <header className="max-w-2xl text-center lg:text-left">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.34em] text-[#22D3EE]/82">
              The Monolith Project Presents
            </p>
            <h1 className="mt-5 font-display text-[clamp(3.55rem,15.5vw,8rem)] uppercase leading-[0.76] tracking-tight text-white drop-shadow-[0_24px_72px_rgba(0,0,0,0.82)]">
              <span className="block whitespace-nowrap">Untold</span>
              <span className="block whitespace-nowrap text-[#22D3EE]">
                Story
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-[37rem] text-balance text-base font-medium leading-relaxed text-white/72 sm:text-lg lg:mx-0">
              After-dark records from Chicago rooms built for deeper house
              music, tighter energy, and a crowd that came for the same reason.
            </p>

            <div className="mx-auto mt-7 grid max-w-xl grid-cols-3 border border-white/10 bg-white/[0.035] backdrop-blur lg:mx-0">
              {[
                ["4", "Chapters"],
                ["CHI", "Rooms"],
                ["Music", "First"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="border-r border-white/10 px-3 py-4 text-center last:border-r-0"
                >
                  <p className="font-display text-[clamp(1.4rem,6vw,2.1rem)] uppercase leading-none text-white">
                    {value}
                  </p>
                  <p className="mt-2 font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/45">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 min-[440px]:flex-row min-[440px]:justify-center lg:justify-start">
              <a
                href="#chapters"
                className="inline-flex min-h-12 items-center justify-center border border-[#22D3EE]/55 bg-[#22D3EE] px-5 text-[11px] font-black uppercase tracking-[0.16em] text-[#03040A] transition hover:bg-white active:scale-[0.98] motion-reduce:transition-none"
              >
                Previous Chapters
              </a>
              <a
                href="https://sunsets.vip"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center border border-white/14 bg-white/[0.035] px-5 text-[11px] font-black uppercase tracking-[0.16em] text-white/72 transition hover:border-[#22D3EE]/45 hover:text-[#22D3EE] active:scale-[0.98] motion-reduce:transition-none"
              >
                Visit Sun(Sets)
              </a>
            </div>
            <div className="mt-3 flex justify-center lg:justify-start">
              <a
                href="https://laylo.com/monolithproject"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 px-5 text-[11px] font-black uppercase tracking-[0.16em] text-[#8B5CF6] transition hover:border-[#8B5CF6]/70 hover:bg-[#8B5CF6]/20 active:scale-[0.98] motion-reduce:transition-none"
              >
                Join the Night List — Untold Drops
              </a>
            </div>
          </header>

          <aside className="relative mx-auto w-full max-w-[28rem] lg:mx-0 lg:justify-self-end">
            <div className="relative overflow-hidden border border-white/12 bg-white/[0.04] p-2 shadow-[0_36px_100px_rgba(0,0,0,0.46)] backdrop-blur">
              <div className="relative aspect-[4/5] overflow-hidden bg-black">
                <ResponsiveImage
                  src="/images/untold-story-moody.webp"
                  alt="Untold Story visual poster"
                  sizes="(min-width: 1024px) 420px, 92vw"
                  priority
                  className="h-full w-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,4,10,0.08),rgba(3,4,10,0.82))]" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-[#22D3EE]">
                    Untold.vip
                  </p>
                  <p className="mt-3 text-balance font-display text-[clamp(1.9rem,8vw,3.15rem)] uppercase leading-[0.86] text-white">
                    Previous Shows
                  </p>
                </div>
              </div>
            </div>
            <div
              className="absolute -bottom-4 -right-4 -z-10 h-28 w-28 border border-[#22D3EE]/28 bg-[#22D3EE]/8"
              aria-hidden="true"
            />
          </aside>
        </section>

        <section
          id="chapters"
          aria-label="Previous Untold Story shows"
          className="mx-auto w-full max-w-6xl scroll-mt-8 py-8 lg:py-12"
        >
          <div className="mb-6 flex flex-col gap-3 border-t border-white/10 pt-7 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-[#22D3EE]/80">
                The record so far
              </p>
              <h2 className="mt-3 font-display text-[clamp(2rem,7vw,4.75rem)] uppercase leading-[0.85] tracking-tight text-white">
                Chapters I-IV
              </h2>
            </div>
            <p className="max-w-md text-sm font-medium leading-relaxed text-white/58 md:text-right">
              Four rooms, four different pressures, one throughline: music first
              and no wasted energy.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {PREVIOUS_SHOWS.map((show, index) => (
              <Link
                key={show.chapter}
                href={show.href}
                className="group flex min-h-full flex-col overflow-hidden border border-white/10 bg-white/[0.035] shadow-[0_20px_70px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-1 hover:border-[#22D3EE]/42 hover:bg-white/[0.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]/70 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <div className="relative aspect-[5/4] overflow-hidden bg-black/50">
                  <ResponsiveImage
                    src={show.image}
                    alt={`${show.title} Untold Story chapter ${show.chapter}`}
                    sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    className="h-full w-full object-cover opacity-[0.84] transition duration-700 group-hover:scale-105 group-hover:opacity-100 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#03040A]/86 via-transparent to-transparent" />
                  <div className="absolute left-3 top-3 border border-white/16 bg-black/55 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#22D3EE] backdrop-blur">
                    Chapter {show.chapter}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/44">
                    {show.date}
                  </p>
                  <h3 className="mt-3 font-display text-[clamp(1.8rem,7vw,2.45rem)] uppercase leading-[0.84] tracking-tight text-white">
                    {show.title}
                  </h3>
                  <p className="mt-3 text-sm font-semibold text-[#22D3EE]/78">
                    {show.venue}
                  </p>
                  <p className="mt-4 text-sm font-medium leading-relaxed text-white/60">
                    {show.note}
                  </p>
                  <span className="mt-6 inline-flex min-h-10 items-center justify-center border border-[#22D3EE]/35 px-4 text-center text-[10px] font-black uppercase tracking-[0.16em] text-[#22D3EE] transition group-hover:bg-[#22D3EE] group-hover:text-[#03040A] motion-reduce:transition-none">
                    {show.ctaLabel}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mx-auto mt-4 w-full max-w-6xl border-t border-white/10 py-8">
          <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr] md:items-start">
            <div>
              <p className="font-serif text-sm italic leading-relaxed text-white/56">
                Music first. Good crowd. Late finish.
              </p>
              <p className="mt-3 font-mono text-[9px] font-black uppercase tracking-[0.28em] text-white/32">
                The Monolith Project
              </p>
            </div>
            <nav
              aria-label="Related sites"
              className="grid gap-3 sm:grid-cols-3"
            >
              {RELATED_LINKS.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  target={externalTarget(link.href)}
                  rel={externalRel(link.href)}
                  className="group border border-white/10 bg-white/[0.025] p-4 transition hover:border-[#22D3EE]/38 hover:bg-[#22D3EE]/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]/70 motion-reduce:transition-none"
                >
                  <span className="block font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/74 transition group-hover:text-[#22D3EE]">
                    {link.label}
                  </span>
                  <span className="mt-2 block text-xs font-medium leading-relaxed text-white/45">
                    {link.detail}
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </footer>
      </main>
    </div>
  );
}
