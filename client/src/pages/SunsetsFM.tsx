import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { radioEpisodes } from "@/data/radioEpisodes";
import { ROUTES } from "@shared/routes";
import {
  SUNSETS_EPISODE_URLS,
  SUNSETS_SHOW_URL,
} from "@shared/seo/sunsets-radio";

const exploreLinks = [
  { label: "Radio", href: "https://sunsets.fm/radio" },
  { label: "Chasing Sun(Sets) Radio", href: SUNSETS_SHOW_URL },
  { label: "DJ sets", href: "https://sunsets.fm/sets" },
  { label: "Festivals", href: "https://sunsets.fm/festivals" },
];
const linkFocus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8B86D]";

export default function SunsetsFM() {
  return (
    <div className="min-h-screen bg-[#080807] text-[#F7F2EA]">
      <SEO
        title="SUNSETS.FM | The Monolith Project"
        absoluteTitle
        canonicalPath={ROUTES.sunsetsFM}
        description="SUNSETS.FM is a DJ-set discovery platform and the home of Chasing Sun(Sets) Radio. Part of The Monolith Project family."
      />
      <Navigation brand="monolith" />
      <main
        id="main-content"
        tabIndex={-1}
        className="page-shell-start px-5 pb-20 sm:px-8"
      >
        <div className="container layout-wide">
          <section
            aria-labelledby="sunsets-fm-title"
            className="relative isolate overflow-hidden border-b border-white/15 pb-14 pt-10 md:pb-20 md:pt-20"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 top-0 -z-10 h-72 w-72 rounded-full bg-[#C2703E]/15 blur-3xl"
            />
            <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-[#E8B86D]">
              The Monolith Project / Music
            </p>
            <h1
              id="sunsets-fm-title"
              className="font-display whitespace-nowrap text-[clamp(1.9rem,9.2vw,8rem)] leading-none tracking-[-0.04em]"
            >
              SUNSETS.FM
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl">
              A DJ-set discovery platform and the home of Chasing Sun(Sets)
              Radio.
            </p>
            <a
              href="https://sunsets.fm"
              className={`btn-pill-sunsets mt-8 inline-flex max-w-full items-center justify-center gap-3 !px-5 !text-xs !tracking-[0.06em] ${linkFocus}`}
            >
              Listen on SUNSETS.FM{" "}
              <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </a>
          </section>
          <section aria-labelledby="episodes-title" className="py-12 md:py-16">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#E8B86D]">
              Selected transmissions
            </p>
            <h2
              id="episodes-title"
              className="text-2xl font-medium md:text-3xl"
            >
              From Chasing Sun(Sets) Radio
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-9 min-[380px]:grid-cols-2 lg:grid-cols-3">
              {radioEpisodes
                .filter(episode => SUNSETS_EPISODE_URLS[episode.slug])
                .slice(0, 6)
                .map(episode => (
                  <a
                    key={episode.slug}
                    href={SUNSETS_EPISODE_URLS[episode.slug]}
                    className={`group block min-w-0 ${linkFocus}`}
                  >
                    <div className="aspect-square overflow-hidden border border-white/10 bg-white/5">
                      <img
                        src={episode.coverImage || episode.image}
                        alt=""
                        width={500}
                        height={500}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-mono text-xs tracking-[0.12em] text-[#E8B86D]">
                          {episode.guest}
                        </p>
                        <h3 className="mt-2 text-base leading-snug text-white/90">
                          {episode.title}
                        </h3>
                      </div>
                      <ArrowUpRight
                        className="h-4 w-4 shrink-0 text-white/50"
                        aria-hidden="true"
                      />
                    </div>
                  </a>
                ))}
            </div>
          </section>
          <section
            aria-labelledby="explore-title"
            className="border-y border-white/15 py-8"
          >
            <h2
              id="explore-title"
              className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-white/50"
            >
              Explore
            </h2>
            <nav
              aria-label="Explore SUNSETS.FM"
              className="flex flex-wrap gap-x-8 gap-y-3"
            >
              {exploreLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`inline-flex min-h-11 items-center gap-2 text-base hover:text-[#E8B86D] ${linkFocus}`}
                >
                  {link.label}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </nav>
          </section>
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-white/60">
            SUNSETS.FM is part of{" "}
            <Link
              href={ROUTES.home}
              className={`text-white underline underline-offset-4 ${linkFocus}`}
            >
              The Monolith Project
            </Link>{" "}
            family. Discover{" "}
            <Link
              href={ROUTES.chasingSunsets}
              className={`text-white underline underline-offset-4 ${linkFocus}`}
            >
              Chasing Sun(Sets) events
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
