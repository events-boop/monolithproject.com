import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";
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
  SUNSETS_SEASON_PASS_PATH,
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
// OWNER ASSET: placeholder crop from the Kiko campaign photo — swap with the
// approved 1200×630 campaign-poster crop before the paid push.
const OG_IMAGE = "/images/css-2026-og.png";
// Recap video — same ID the /go/media/sunsets-recap redirect resolves to.
const RECAP_YOUTUBE_ID = "9R6XH7JZlJI";
const RECAP_THUMB = `https://i.ytimg.com/vi/${RECAP_YOUTUBE_ID}/hqdefault.jpg`;

// Forwarded to Laylo by the /go/ redirect layer.
const LAKELIST_UTM_QUERY =
  "utm_source=sunsets-vip&utm_medium=landing&utm_campaign=css-2026-launch";

const SHARED_EVENT_SCHEMA = {
  "@context": "https://schema.org" as const,
  "@type": "MusicEvent" as const,
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  image: `https://monolithproject.com${OG_IMAGE}`,
  organizer: {
    "@type": "Organization" as const,
    name: "The Monolith Project",
    url: "https://monolithproject.com",
  },
  location: {
    "@type": "Place" as const,
    name: "Castaways Beach Club",
    address: {
      "@type": "PostalAddress" as const,
      streetAddress: "1603 N Lake Shore Dr",
      addressLocality: "Chicago",
      addressRegion: "IL",
      postalCode: "60614",
      addressCountry: "US",
    },
  },
};

const SEASON_EVENTS_SCHEMA = [
  {
    ...SHARED_EVENT_SCHEMA,
    name: "SUN(SETS) I — Chasing Sun(Sets) 2026",
    startDate: "2026-07-04T13:00:00-05:00",
    endDate: "2026-07-04T22:00:00-05:00",
    performer: [
      "Kiko Franco",
      "Amari",
      "Gianni Blu",
      "Erik The DJ",
    ].map(name => ({ "@type": "MusicGroup" as const, name })),
    offers: {
      "@type": "Offer" as const,
      url: "https://sunsets.vip",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      price: "20",
    },
  },
  {
    ...SHARED_EVENT_SCHEMA,
    name: "SUN(SETS) II — Chasing Sun(Sets) 2026",
    startDate: "2026-08-22T13:00:00-05:00",
    endDate: "2026-08-22T22:00:00-05:00",
    offers: {
      "@type": "Offer" as const,
      url: "https://sunsets.vip",
      availability: "https://schema.org/PreOrder",
      priceCurrency: "USD",
    },
  },
  {
    ...SHARED_EVENT_SCHEMA,
    name: "SUN(SETS) III — Chasing Sun(Sets) 2026",
    startDate: "2026-09-19T13:00:00-05:00",
    endDate: "2026-09-19T22:00:00-05:00",
    offers: {
      "@type": "Offer" as const,
      url: "https://sunsets.vip",
      availability: "https://schema.org/PreOrder",
      priceCurrency: "USD",
    },
  },
];

const FOOTER_LINKS = [
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
  const [recapPlaying, setRecapPlaying] = useState(false);

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
      buttonName: "JOIN THE LAKE LIST FOR FIRST ACCESS",
      href: lakeListHref,
      eventSlug: JULY_4_EVENT_SLUG,
      eventDate: JULY_4_EVENT_DATE,
      interestType: "lakelist_click",
      channel: "Laylo",
    });
  };

  const handleRecapPlay = () => {
    triggerHaptic(8);
    setRecapPlaying(true);
    trackSunsetsClick({
      buttonName: "Play 2025 Recap",
      href: `https://youtu.be/${RECAP_YOUTUBE_ID}`,
      eventSlug: JULY_4_EVENT_SLUG,
      eventDate: JULY_4_EVENT_DATE,
      interestType: "recap_embed_play",
      channel: "YouTube",
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-stone-100 selection:bg-[#E8B86D] selection:text-black">
      <SEO
        title="Chasing Sun(Sets) 2026 — Tickets & Lake List | The Monolith Project"
        description="Three dates. One lake. One home. Kiko Franco, Amari, Gianni Blu, Erik The DJ & more. July 4 on sale now at Castaways Beach Club. Join the Lake List for first access to the limited 2026 Season Pass."
        image={OG_IMAGE}
        canonicalUrl={`${CANONICAL_SUNSETS_URL}${PAGE_PATH}`}
        canonicalPath={PAGE_PATH}
        schemaData={SEASON_EVENTS_SCHEMA}
      />

      <main className="relative mx-auto flex min-h-screen w-full max-w-[460px] flex-col px-5 py-7 sm:py-10">
        {/* 1. Hero — brand + lineup */}
        <header className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E8B86D]">
            The Monolith Project Presents
          </p>
          <h1 className="mt-4 font-black leading-[0.9] tracking-normal text-white drop-shadow-[0_8px_26px_rgba(0,0,0,0.72)]">
            <span className="block whitespace-nowrap text-[clamp(2.05rem,10vw,3.45rem)]">
              CHASING SUN<span className="text-[#E8B86D]">(</span>SETS<span className="text-[#E8B86D]">)</span>
            </span>
            <span className="mt-1 block whitespace-nowrap text-[clamp(1.5rem,7vw,2.5rem)] text-[#E8B86D]">
              2026
            </span>
          </h1>
          <p className="mt-3 font-serif text-base italic text-stone-200">
            Three dates. One lake. One home.
          </p>
          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.24em] text-stone-300">
            CASTAWAYS BEACH CLUB
          </p>

          <div className="mt-5 border-y border-white/14 py-4">
            <p className="text-[clamp(1.45rem,7.4vw,2.05rem)] font-black uppercase leading-[0.98] tracking-[0.04em] text-white">
              KIKO FRANCO
            </p>
            <p className="mt-1.5 text-[clamp(1rem,5vw,1.35rem)] font-black uppercase leading-[0.98] tracking-[0.04em] text-stone-200">
              AMARI
            </p>
            <p className="mt-2.5 text-[clamp(0.72rem,3.2vw,0.94rem)] font-black uppercase leading-relaxed tracking-[0.12em] text-stone-300">
              GIANNI BLU · ERIK THE DJ <span className="text-[#E8B86D]">&amp; MORE</span>
            </p>
          </div>
        </header>

        {/* 2. Dates ledger */}
        <section className="mt-5" aria-label="2026 season dates">
          <div className="border border-white/12 bg-white/[0.03]">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#E8B86D]/[0.07] px-3.5 py-3">
              <p className="whitespace-nowrap text-[clamp(0.8rem,3.8vw,0.95rem)] font-black text-white">
                SUN(SETS) I — JUL 4
              </p>
              <span className="shrink-0 whitespace-nowrap bg-[#E8B86D] px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.14em] text-black">
                ON SALE NOW
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3.5 py-3 opacity-55">
              <p className="whitespace-nowrap text-[clamp(0.8rem,3.8vw,0.95rem)] font-black text-white">
                SUN(SETS) II — AUG 22
              </p>
              <span className="shrink-0 whitespace-nowrap font-serif text-xs italic text-stone-400">
                Chapter Two
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 px-3.5 py-3 opacity-55">
              <p className="whitespace-nowrap text-[clamp(0.8rem,3.8vw,0.95rem)] font-black text-white">
                SUN(SETS) III — SEP 19
              </p>
              <span className="shrink-0 whitespace-nowrap font-serif text-xs italic text-stone-400">
                Chapter Three
              </span>
            </div>
          </div>
          <p className="mt-2.5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
            Saturdays · 1PM–10PM · 21+ · Chicago
          </p>
        </section>

        {/* 3. Primary CTA */}
        <section className="mt-5" aria-label="July 4 Tickets">
          <a
            href={ticketHref}
            onClick={handleTicketClick}
            className="flex h-[52px] min-h-[52px] items-center justify-center gap-2 bg-[#E8B86D] px-4 text-[12px] font-black uppercase tracking-[0.12em] text-black shadow-[0_14px_34px_rgba(232,184,109,0.24)] transition hover:bg-[#f4d58d]"
          >
            GET JULY 4 TICKETS <span aria-hidden="true">→</span>
          </a>
        </section>

        {/* 4. Season Pass — vault card */}
        <section
          className="mt-5 border border-[#E8B86D]/40 bg-[#15110a] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.4)]"
          aria-label="2026 Season Pass"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="whitespace-nowrap text-base font-black uppercase tracking-[0.08em] text-white">
              2026 SEASON PASS
            </h2>
            <span className="shrink-0 border border-[#E8B86D]/50 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.18em] text-[#E8B86D]">
              Limited
            </span>
          </div>
          <p className="mt-2 text-sm font-semibold text-stone-300">
            Every date. One pass. All summer on the lake.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="border border-white/12 bg-black/30 px-3 py-3 text-center">
              <p className="text-2xl font-black leading-none text-white">
                $100
              </p>
              <p className="mt-1.5 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.16em] text-stone-400">
                GA · All 3 Dates
              </p>
            </div>
            <div className="border border-[#E8B86D]/55 bg-[#E8B86D]/[0.06] px-3 py-3 text-center">
              <p className="text-2xl font-black leading-none text-[#E8B86D]">
                $150
              </p>
              <p className="mt-1.5 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.16em] text-stone-300">
                VIP · All 3 Dates
              </p>
            </div>
          </div>

          <a
            href={lakeListHref}
            onClick={handleLakeListClick}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 border border-[#E8B86D] text-[11px] font-black uppercase tracking-[0.12em] text-[#E8B86D] transition hover:bg-[#E8B86D]/10 min-[390px]:text-xs"
          >
            JOIN THE LAKE LIST FOR FIRST ACCESS
          </a>
          <p className="mt-2.5 text-center text-[11px] font-semibold leading-relaxed text-stone-400">
            Season Pass releases to the Lake List first. Limited quantity.
          </p>
        </section>

        {/* 5. Social proof — recap facade */}
        <section className="mt-6" aria-label="2025 recap">
          <p className="text-center font-serif text-sm italic text-stone-300">
            Last summer: 2,800 on the lakefront.
          </p>
          <div className="relative mt-3 aspect-video w-full overflow-hidden border border-white/12 bg-black">
            {recapPlaying ? (
              <YouTubeEmbed
                url={`https://youtu.be/${RECAP_YOUTUBE_ID}`}
                title="Chasing Sun(Sets) 2025 recap"
                className="absolute inset-0 h-full w-full"
                loading="eager"
                autoplay
              />
            ) : (
              <button
                type="button"
                onClick={handleRecapPlay}
                aria-label="Play the 2025 recap video"
                className="group absolute inset-0 h-full w-full"
              >
                <img
                  src={RECAP_THUMB}
                  alt="Chasing Sun(Sets) 2025 recap preview"
                  loading="lazy"
                  className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100"
                />
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.1),rgba(10,10,10,0.55))]" />
                <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/55 backdrop-blur transition group-hover:bg-[#E8B86D] group-hover:text-black">
                  {/* Inline play glyph — no icon fonts. */}
                  <svg
                    viewBox="0 0 24 24"
                    className="ml-0.5 h-6 w-6 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M8 5.5v13l11-6.5-11-6.5z" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </section>

        {/* 6. Closing block — cabanas, divider, sign-off */}
        <section className="mt-6" aria-label="Cabanas and sign-off">
          <div className="border border-[#E8B86D]/40 bg-[#15110a] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.4)]">
            <h2 className="whitespace-nowrap text-[clamp(0.85rem,4vw,1rem)] font-black uppercase tracking-[0.08em] text-white">
              CABANAS &amp; VIP RESERVATIONS
            </h2>
            <p className="mt-2 text-sm font-semibold text-stone-300">
              Lock your section for the holiday.
            </p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-stone-400">
              Daybeds · Cabanas · Group tables
            </p>
            <p className="mt-2 text-[11px] font-semibold leading-relaxed text-stone-400">
              $2,000 minimum spend · Admission for up to 15 guests · Limited,
              confirmed manually
            </p>
            <a
              href="/vip"
              onClick={() => {
                triggerHaptic(8);
                trackSunsetsClick({
                  buttonName: "RESERVE A SECTION",
                  href: "/vip",
                  eventSlug: JULY_4_EVENT_SLUG,
                  eventDate: JULY_4_EVENT_DATE,
                  interestType: "vip_click",
                  channel: "Monolith",
                });
              }}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap border border-[#E8B86D] text-xs font-black uppercase tracking-[0.12em] text-[#E8B86D] transition hover:bg-[#E8B86D]/10"
            >
              RESERVE A SECTION <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="mt-8 flex items-center gap-4" aria-hidden="true">
            <span className="h-px flex-1 bg-white/10" />
            {/* Sun glyph — inline SVG, not an icon font. */}
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-[#E8B86D]/70"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
            </svg>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <div className="mt-7 text-center">
            <p className="text-sm font-semibold text-stone-100">
              Three dates. One lake. One home.
            </p>
            <p className="mt-3 font-serif text-sm italic leading-relaxed text-[#E8B86D]/70">
              Togetherness is the frequency.
              <br />
              Music is the guide.
            </p>
            <p className="mt-7 text-[9px] font-black uppercase tracking-[0.34em] text-stone-600">
              The Monolith Project
            </p>
          </div>
        </section>

        {/* 7. Footer strip */}
        <footer className="mt-auto pt-9">
          <nav
            aria-label="More from Sun(Sets)"
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
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
        </footer>
      </main>
    </div>
  );
}
