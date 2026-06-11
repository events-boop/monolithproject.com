import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, LockKeyhole, Play, Ticket } from "lucide-react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { trackFunnelPageView } from "@/lib/api";
import {
  trackLakeInitiateCheckout,
  trackLakeLead,
  trackLakePageView,
} from "@/lib/campaignPixel";
import {
  SUNSETS_JULY4_EVENT_DATE as JULY_4_EVENT_DATE,
  SUNSETS_JULY4_EVENT_SLUG as JULY_4_EVENT_SLUG,
  SUNSETS_JULY4_VANITY_TICKET_PATH,
  SUNSETS_LAKELIST_PATH,
  SUNSETS_PRELAUNCH_LOCKED,
  captureSunsetsTicketCtaClick,
} from "@/lib/sunsetsTicketing";
import {
  appendEventAttribution,
  trackSunsetsClick,
  triggerHaptic,
} from "@/components/SunsetsLinkBioComponents";

const PAGE_PATH = "/sunsets";
const PAGE_SOURCE = "sunsets_wrapper";
const CANONICAL_SUNSETS_URL = "https://sunsets.vip";
const HERO_IMAGE = "/images/chasing-sunsets-premium.webp";
const OG_IMAGE = "/images/chasing-sunsets-july4-first-access.png";

const AUTOGRAF_YOUTUBE_EMBED =
  "https://www.youtube.com/embed/9R6XH7JZlJI?start=5506&rel=0&modestbranding=1";
const SOMMERS_SOUNDCLOUD_URL =
  "https://soundcloud.com/chasing-sun-sets/sommers-uk-ep0011-chapter-1-chasing-sunsets";
const SOMMERS_SOUNDCLOUD_EMBED = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
  SOMMERS_SOUNDCLOUD_URL
)}&color=%2361e8ff&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=true`;

// Forwarded to Laylo by the /go/ redirect layer.
const LAKELIST_UTM_QUERY =
  "utm_source=sunsets-vip&utm_medium=landing&utm_campaign=css-2026-launch";

const SEASON_DATES = [
  {
    title: "SUN(SETS) I",
    date: "July 4",
    badge: SUNSETS_PRELAUNCH_LOCKED ? "FIRST ACCESS" : "ON SALE NOW",
    eventSlug: JULY_4_EVENT_SLUG,
  },
  { title: "SUN(SETS) II", date: "August 22" },
  { title: "SUN(SETS) III", date: "September 19" },
] as const;

const FOOTER_LINKS = [
  {
    label: "Watch the recap",
    href: "/go/media/sunsets-recap",
    interestType: "recap_click",
    channel: "YouTube",
  },
  {
    label: "Sun(Sets) Radio",
    href: "/go/media/sunsets-soundcloud",
    interestType: "soundcloud_click",
    channel: "SoundCloud",
  },
  {
    label: "Instagram",
    href: "/go/social/instagram-sunsets",
    interestType: "instagram_click",
    channel: "Instagram",
  },
  {
    label: "Partner inquiries",
    href: "/partners",
    interestType: "partner_inquiry_click",
    channel: "Monolith",
  },
] as const;

// crypto.randomUUID is unavailable in non-secure contexts (plain-http previews).
function newLeadEventId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `lead_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

export default function SunsetsLinkBio() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
    trackFunnelPageView({
      pagePath: PAGE_PATH,
      eventSlug: JULY_4_EVENT_SLUG,
      source: PAGE_SOURCE,
    });
    trackLakePageView();
  }, []);

  const ticketHref = appendEventAttribution(
    SUNSETS_JULY4_VANITY_TICKET_PATH,
    JULY_4_EVENT_SLUG
  );
  const lakeListHref = appendEventAttribution(
    `${SUNSETS_LAKELIST_PATH}?${LAKELIST_UTM_QUERY}`,
    JULY_4_EVENT_SLUG
  );
  const benchekReleaseHref = appendEventAttribution(
    `${SUNSETS_LAKELIST_PATH}?${LAKELIST_UTM_QUERY}&utm_content=benchek-july4-release`,
    JULY_4_EVENT_SLUG
  );

  const handleTicketClick = () => {
    triggerHaptic(16);
    trackLakeInitiateCheckout();
    captureSunsetsTicketCtaClick({
      destinationUrl: ticketHref,
      pagePath: PAGE_PATH,
      ctaPosition: "primary",
    });
    trackSunsetsClick({
      buttonName: "GET JULY 4 TICKETS",
      href: ticketHref,
      eventSlug: JULY_4_EVENT_SLUG,
      eventDate: JULY_4_EVENT_DATE,
      interestType: "ticket_click",
      channel: "Posh",
    });
  };

  const handleLakeListClick = () => {
    triggerHaptic(12);
    trackLakeLead(newLeadEventId(), {
      content_name: "Lake List Signup Click - Chasing Sun(Sets)",
    });
    trackSunsetsClick({
      buttonName: "JOIN THE LAKE LIST",
      href: lakeListHref,
      eventSlug: JULY_4_EVENT_SLUG,
      eventDate: JULY_4_EVENT_DATE,
      interestType: "lakelist_click",
      channel: "Laylo",
    });
  };

  const handleBenchekReleaseClick = () => {
    triggerHaptic(12);
    trackLakeLead(newLeadEventId(), {
      content_name: "Benchek July 4 Release Signup Click",
    });
    trackSunsetsClick({
      buttonName: "Benchek July 4 Release — Sign Up",
      href: benchekReleaseHref,
      eventSlug: JULY_4_EVENT_SLUG,
      eventDate: JULY_4_EVENT_DATE,
      interestType: "benchek_release_signup",
      channel: "Laylo",
    });
  };

  return (
    <div className="min-h-screen bg-[#050814] text-stone-100 selection:bg-[#61e8ff] selection:text-black">
      <SEO
        title="Chasing Sun(Sets) 2026 — Tickets & Lake List"
        description="Three dates. One lake. One home. July 4 tickets on sale now. Join the Lake List for first access to SUN(SETS) II + III and the limited 2026 Season Pass."
        image={OG_IMAGE}
        canonicalUrl={`${CANONICAL_SUNSETS_URL}${PAGE_PATH}`}
        canonicalPath={PAGE_PATH}
      />

      <div className="fixed inset-0 pointer-events-none">
        <img
          src={HERO_IMAGE}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,20,0.72)_0%,rgba(5,8,20,0.93)_48%,#050814_100%)]" />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-[460px] flex-col px-4 py-6 sm:py-10">
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="flex flex-1 flex-col gap-5"
        >
          {/* 1. Hero */}
          <header>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#61e8ff]">
              The Monolith Project Presents
            </p>
            <h1 className="mt-3 text-[clamp(2.5rem,11.5vw,3.4rem)] font-black leading-[0.92] tracking-normal text-white">
              CHASING
              <br />
              SUN<span className="text-[#61e8ff]">(</span>SETS
              <span className="text-[#61e8ff]">)</span> 2026
            </h1>
            <p className="mt-3 text-sm font-semibold text-stone-200">
              Three dates. One lake. One home.
            </p>

            <div className="mt-4 border border-white/12 bg-black/34 backdrop-blur">
              {SEASON_DATES.map(chapter => (
                <div
                  key={chapter.title}
                  className={`flex items-center justify-between gap-3 border-b border-white/10 px-3.5 py-2.5 last:border-b-0 ${
                    "badge" in chapter ? "bg-[#61e8ff]/[.06]" : ""
                  }`}
                >
                  <p className="text-sm font-black text-white">
                    {chapter.title}{" "}
                    <span className="font-semibold text-stone-300">
                      — {chapter.date}
                    </span>
                  </p>
                  {"badge" in chapter ? (
                    <span className="shrink-0 border border-[#61e8ff]/45 bg-[#61e8ff]/12 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.16em] text-[#61e8ff]">
                      {chapter.badge}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>

            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
              Castaways Beach Club · Chicago · 12PM–10PM · 21+
            </p>
          </header>

          {/* 2. Primary CTAs */}
          <section className="space-y-3" aria-label="Tickets and Lake List">
            {!SUNSETS_PRELAUNCH_LOCKED ? (
              <Button
                asChild
                className="h-14 w-full bg-[#61e8ff] text-sm font-black uppercase tracking-[0.12em] text-black shadow-[0_14px_36px_rgba(97,232,255,0.22)] hover:bg-[#a7f4ff]"
              >
                <a href={ticketHref} onClick={handleTicketClick}>
                  <Ticket className="size-4" />
                  GET JULY 4 TICKETS
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
            ) : null}
            <Button
              asChild
              className={`h-14 w-full border border-[#ff6b8a]/60 bg-[#ff6b8a]/14 text-sm font-black uppercase tracking-[0.12em] text-[#ffd0dc] shadow-[0_10px_32px_rgba(255,107,138,0.16)] hover:bg-[#ff6b8a]/24 ${SUNSETS_PRELAUNCH_LOCKED ? "mt-0" : ""}`}
            >
              <a href={lakeListHref} onClick={handleLakeListClick}>
                <LockKeyhole className="size-4" />
                JOIN THE LAKE LIST
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
            <p className="text-center text-[11px] font-semibold leading-relaxed text-stone-400">
              {SUNSETS_PRELAUNCH_LOCKED
                ? "First access to SUN(SETS) I–III tickets, the limited 2026 Season Pass, artist announcements, and guest-list opportunities before the public."
                : "First access to SUN(SETS) II + III, the limited 2026 Season Pass release, artist announcements + guest-list opportunities."}
            </p>
          </section>

          {/* 3. Proof strip */}
          <section className="border-y border-white/10 py-3 text-center">
            {SUNSETS_PRELAUNCH_LOCKED ? (
              <>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#61e8ff]">
                  Full Lineup Announced Soon
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                  Lake List members get the first signal.
                </p>
              </>
            ) : (
              <>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#61e8ff]">
                  Kiko Franco · Lakefront Debut · July 4
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                  Full lineup revealed in chapters.
                </p>
              </>
            )}
          </section>

          {/* Benchek release teaser */}
          {!SUNSETS_PRELAUNCH_LOCKED ? (
            <a
              href={benchekReleaseHref}
              onClick={handleBenchekReleaseClick}
              className="block border border-[#ff6b8a]/30 bg-[#ff6b8a]/[.07] px-4 py-3.5 text-center transition hover:border-[#ff6b8a]/55 hover:bg-[#ff6b8a]/[.14]"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#ffd0dc]">
                Stay tuned
              </p>
              <p className="mt-1 text-sm font-black uppercase tracking-[0.06em] text-white">
                BENCHEK — 4th of July Release 2026
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-300">
                From Marbella, Spain · Exclusive live set
              </p>
              <p className="mt-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-[#ff6b8a]">
                Sign up here <ArrowUpRight className="inline size-3.5 align-[-2px]" />
              </p>
            </a>
          ) : null}

          {/* 4. Set Times */}
          <section className="space-y-2 border border-white/10 bg-black/20 px-4 py-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#61e8ff]">
              Set Times
            </p>
            <div className="space-y-2">
              {[
                { time: "12:00 PM", label: SUNSETS_PRELAUNCH_LOCKED ? "Doors Open" : "Doors Open" },
                { time: "2:15 PM", label: SUNSETS_PRELAUNCH_LOCKED ? "Artist TBA" : "Erik The DJ" },
                { time: "3:30 PM", label: SUNSETS_PRELAUNCH_LOCKED ? "Artist TBA" : "Amari" },
                { time: "4:45 PM", label: SUNSETS_PRELAUNCH_LOCKED ? "Artist TBA" : "Kiko Franco" },
                { time: "6:45 PM", label: SUNSETS_PRELAUNCH_LOCKED ? "Artist TBA" : "Autograf" },
                { time: "10:00 PM", label: "Close" },
              ].map(slot => (
                <div
                  key={slot.time}
                  className="flex items-center justify-between border-b border-white/5 pb-2 last:border-b-0 last:pb-0"
                >
                  <span className="text-[11px] font-mono font-semibold tracking-[0.06em] text-stone-400">
                    {slot.time}
                  </span>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-[0.08em] ${
                      SUNSETS_PRELAUNCH_LOCKED && slot.label === "Artist TBA"
                        ? "text-stone-500"
                        : "text-stone-200"
                    }`}
                  >
                    {slot.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 5. What to Expect */}
          <section className="border border-white/10 bg-black/20 px-4 py-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#61e8ff]">
              What to Expect
            </p>
            <p className="mt-3 text-sm leading-relaxed text-stone-300">
              Open-air house music on the Chicago lakefront, built around
              panoramic skyline views and the transition from late afternoon into
              night. Sand between sets. Golden hour into fireworks. One of the
              best views in the city.
            </p>
          </section>

          {/* 6. Venue */}
          <section className="border border-white/10 bg-black/20 px-4 py-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#61e8ff]">
              The Venue
            </p>
            <p className="mt-2 text-sm font-black text-white">
              Castaways Beach Club
            </p>
            <p className="mt-1 text-xs leading-relaxed text-stone-400">
              North Avenue Beach — Chicago's iconic lakefront venue with
              panoramic skyline views. Outdoor bar, beach access, and the best
              sunset sightline in the city. 21+ only.
            </p>
          </section>

          {/* 7. Secondary CTA */}
          <Button
            asChild
            variant="outline"
            className="h-12 w-full border-white/15 bg-white/[.04] text-xs font-black uppercase tracking-[0.14em] text-stone-100 hover:bg-white/[.08]"
          >
            <a
              href="/vip"
              onClick={() => {
                triggerHaptic(8);
                trackSunsetsClick({
                  buttonName: "VIP & CABANAS",
                  href: "/vip",
                  eventSlug: JULY_4_EVENT_SLUG,
                  eventDate: JULY_4_EVENT_DATE,
                  interestType: "vip_click",
                  channel: "Monolith",
                });
              }}
            >
              VIP &amp; CABANAS
              <ArrowUpRight className="size-4" />
            </a>
          </Button>

          {/* 8. YouTube Recap */}
          <section className="space-y-3 border border-white/10 bg-black/20 px-4 py-4">
            <div className="flex items-center gap-2">
              <Play className="size-4 text-[#61e8ff]" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#61e8ff]">
                Watch the Last Chapter
              </p>
            </div>
            <div className="aspect-video overflow-hidden bg-black">
              <iframe
                className="h-full w-full"
                src={AUTOGRAF_YOUTUBE_EMBED}
                title="Autograf Sun(Sets) recap"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </section>

          {/* 9. SoundCloud */}
          <section className="space-y-3 border border-white/10 bg-black/20 px-4 py-4">
            <div className="flex items-center gap-2">
              <Play className="size-4 text-[#61e8ff]" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#61e8ff]">
                SUN(SETS) Radio — Sommers UK
              </p>
            </div>
            <div className="overflow-hidden bg-black">
              <iframe
                title="Sommers UK featured SoundCloud selection"
                className="h-[300px] w-full"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src={SOMMERS_SOUNDCLOUD_EMBED}
              />
            </div>
          </section>

          {/* 10. Footer strip */}
          <footer className="mt-auto pt-4">
            <nav
              aria-label="More from Sun(Sets)"
              className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
            >
              {FOOTER_LINKS.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[11px] font-semibold text-stone-400 underline-offset-4 transition hover:text-stone-200 hover:underline"
                  onClick={() =>
                    trackSunsetsClick({
                      buttonName: link.label,
                      href: link.href,
                      eventSlug: JULY_4_EVENT_SLUG,
                      eventDate: JULY_4_EVENT_DATE,
                      interestType: link.interestType,
                      channel: link.channel,
                    })
                  }
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <p className="mt-5 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
              Togetherness is the frequency. Music is the guide.
            </p>
          </footer>
        </motion.section>
      </main>
    </div>
  );
}
