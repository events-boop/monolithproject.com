import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";
import { ROUTES } from "@shared/routes";
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
const OG_IMAGE = "/sunsets_poster.jpg";
// Recap video — same ID the /go/media/sunsets-recap redirect resolves to.
const RECAP_YOUTUBE_ID = "9R6XH7JZlJI";
const RECAP_THUMB = `https://i.ytimg.com/vi/${RECAP_YOUTUBE_ID}/hqdefault.jpg`;
// Benchek featured-set drop — Laylo signup via the /go redirect layer.
const BENCHEK_DROP_HREF = "/go/waitlist/benchek";
const BENCHEK_DROP_IMAGE = "/images/benchek-featured-set-drop.webp";
const SEASON_PASS_HREF = "https://laylo.com/monolithproject/IQ5HaR/details";
const SEASON_III_PROOF_IMAGE = "/images/sunsets-season-iii-joezi-proof.png";
const LAKE_LIST_HREF = "/go/lakelist";
const SOMMERS_UK_HREF =
  "https://soundcloud.com/chasing-sun-sets/sommers-uk-ep0011-chapter-1-chasing-sunsets";
const SOMMERS_UK_IMAGE = "/images/sommers-uk-cover.jpg";

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
      postalCode: "60611",
      addressCountry: "US",
    },
  },
};

const SEASON_EVENTS_SCHEMA = [
  {
    ...SHARED_EVENT_SCHEMA,
    name: "SUN(SETS) I — Chasing Sun(Sets) 2026",
    startDate: "2026-07-04T12:00:00-05:00",
    endDate: "2026-07-04T22:00:00-05:00",
    performer: [
      "Autograf",
      "Kiko Franco",
      "Amari",
      "Eliana",
      "Gianni Blu",
      "Frank Bono",
      "Erik The DJ",
      "Jerome",
      "Colin",
      "Nomar",
    ].map(name => ({ "@type": "MusicGroup" as const, name })),
    offers: {
      "@type": "Offer" as const,
      url: "https://sunsets.vip",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      price: "20",
    },
    subEvent: {
      "@type": "MusicEvent" as const,
      name: "Untold Story — Late Night Continuation (Official Afterparty)",
      startDate: "2026-07-04T22:30:00-05:00",
      endDate: "2026-07-05T04:00:00-05:00",
      url: "https://monolithproject.com/story",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place" as const,
        name: "Venue Reveal Soon",
        address: {
          "@type": "PostalAddress" as const,
          addressLocality: "Chicago",
          addressRegion: "IL",
          addressCountry: "US",
        },
      },
    },
  },
  {
    ...SHARED_EVENT_SCHEMA,
    name: "SUN(SETS) II — Chasing Sun(Sets) 2026",
    startDate: "2026-08-22T12:00:00-05:00",
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
    startDate: "2026-09-19T12:00:00-05:00",
    endDate: "2026-09-19T22:00:00-05:00",
    performer: ["Joezi", "Massuma"].map(name => ({
      "@type": "MusicGroup" as const,
      name,
    })),
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
    label: "Untold Story",
    href: "https://untold.vip",
    interestType: "untold_story_click",
    channel: "Untold",
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
  const benchekDropHref = appendEventAttribution(
    BENCHEK_DROP_HREF,
    JULY_4_EVENT_SLUG
  );
  const sommersUkHref = appendEventAttribution(
    SOMMERS_UK_HREF,
    JULY_4_EVENT_SLUG
  );
  const lakeListHref = appendEventAttribution(
    LAKE_LIST_HREF,
    JULY_4_EVENT_SLUG
  );
  const seasonPassHref = appendEventAttribution(
    SEASON_PASS_HREF,
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
    trackSunsetsClick({
      buttonName: "SUN(SETS) II + III — GET ALERTS",
      href: lakeListHref,
      eventSlug: JULY_4_EVENT_SLUG,
      eventDate: JULY_4_EVENT_DATE,
      interestType: "first_access_click",
      channel: "Laylo",
    });
  };

  const handleSeasonPassClick = () => {
    triggerHaptic(16);
    trackLakeInitiateCheckout();
    captureSunsetsTicketCtaClick({
      destinationUrl: seasonPassHref,
      pagePath: PAGE_PATH,
      ctaPosition: "season_pass",
    });
    trackSunsetsClick({
      buttonName: "GET SEASON PASS",
      href: seasonPassHref,
      eventSlug: JULY_4_EVENT_SLUG,
      eventDate: JULY_4_EVENT_DATE,
      interestType: "season_pass_click",
      channel: "Laylo",
    });
  };

  const handleBenchekDropClick = () => {
    triggerHaptic(12);
    trackLakeLead(newLeadEventId(), {
      content_name: "Benchek Featured Set Drop Click",
    });
    trackSunsetsClick({
      buttonName: "GET THE SET DROP",
      href: benchekDropHref,
      eventSlug: JULY_4_EVENT_SLUG,
      eventDate: JULY_4_EVENT_DATE,
      interestType: "benchek_set_drop",
      channel: "Laylo",
    });
  };

  const handleSommersUkClick = () => {
    triggerHaptic(12);
    trackLakeLead(newLeadEventId(), {
      content_name: "Sommers UK SoundCloud Click",
    });
    trackSunsetsClick({
      buttonName: "LISTEN ON SOUNDCLOUD",
      href: sommersUkHref,
      eventSlug: JULY_4_EVENT_SLUG,
      eventDate: JULY_4_EVENT_DATE,
      interestType: "sommers_uk_set",
      channel: "SoundCloud",
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
    <div className="min-h-screen overflow-x-hidden bg-[#0a0a0a] text-stone-100 selection:bg-[#E8B86D] selection:text-black">
      <SEO
        title="SUN(SETS) I | July 4 Tickets — Castaways Chicago"
        description="SUN(SETS) I brings Autograf, Kiko Franco, Amari, Eliana, Gianni Blu, Frank Bono, Erik The DJ, Jerome, Colin, and Nomar to Castaways Beach Club on July 4."
        image={OG_IMAGE}
        canonicalPath={PAGE_PATH}
        canonicalUrl={CANONICAL_SUNSETS_URL}
        schemaData={SEASON_EVENTS_SCHEMA}
        absoluteTitle
      />
      <main className="relative mx-auto flex min-h-screen w-full max-w-[460px] flex-col px-5 py-4 sm:py-6">
        {/* Ambient Glow */}
        <div
          className="absolute left-1/2 top-0 -z-10 h-[24rem] w-[24rem] max-w-[120vw] -translate-x-1/2 rounded-full bg-[#E8B86D]/10 opacity-60 blur-[80px]"
          aria-hidden="true"
        />

        {/* 1. Hero — brand + lineup */}
        <header className="relative text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E8B86D]">
            The Monolith Project Presents
          </p>
          <h1
            className="mt-2 bg-gradient-to-br from-white via-[#FFF8EB] to-[#E8B86D] bg-clip-text font-black leading-[0.82] tracking-tight text-transparent drop-shadow-[0_8px_26px_rgba(0,0,0,0.72)]"
            aria-label="Chasing Sun(Sets) 2026"
          >
            <span className="block text-[clamp(2.6rem,15vw,4.15rem)]">
              CHASING
            </span>
            <span className="mt-0.5 block text-[clamp(2.35rem,13vw,3.75rem)]">
              SUN<span className="text-[#E8B86D]">(</span>SETS
              <span className="text-[#E8B86D]">)</span>
            </span>
            <span className="mt-2 block whitespace-nowrap text-[clamp(1.35rem,6.5vw,2.15rem)] text-[#E8B86D]">
              2026
            </span>
          </h1>
          <p className="mt-2 font-serif text-base italic text-stone-200">
            Three dates. One lake. One home.
          </p>
          <p className="mt-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-stone-300">
            CASTAWAYS BEACH CLUB
          </p>

          <div className="relative -mx-5 mb-5 mt-5 overflow-hidden border-y border-[#E8B86D]/40 shadow-[0_0_30px_rgba(232,184,109,0.15)] sm:mx-0 sm:rounded-xl sm:border sm:border-[#E8B86D]/30">
            <div className="pointer-events-none absolute inset-0 z-10 shadow-[inset_0_0_20px_rgba(232,184,109,0.1)] sm:rounded-xl" aria-hidden="true" />
            <img
              src="/sunsets_poster.jpg"
              alt="Chasing Sunsets 2026 Poster"
              className="h-auto w-full object-cover"
              fetchPriority="high"
            />
          </div>
        </header>

        {/* 2. July 4th Header */}
        <section
          className="relative mt-2 border border-[#E8B86D]/20 bg-[#15110a]/60 p-5 text-center shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-md"
          aria-label="July 4th Event Details"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#E8B86D]/5 to-transparent" />
          <p className="text-[12px] font-black uppercase tracking-[0.2em] text-[#E8B86D]">
            SUN(SETS) I — JUL 4
          </p>
          <h2 className="mx-1 mt-3 text-[clamp(1.25rem,5.8vw,1.45rem)] font-black uppercase leading-[1.1] tracking-tight text-white drop-shadow-md">
            AUTOGRAF <span className="mx-1 text-[#E8B86D]">x</span> KIKO FRANCO
          </h2>
          <p className="mt-3 text-[13px] font-semibold leading-relaxed text-stone-300">
            The opening chapter. Open-air house music and golden-hour sets on
            the Chicago lakefront.
          </p>
        </section>

        {/* 3. Primary CTA */}
        <section className="mt-4" aria-label="July 4 Tickets">
          <a
            href={ticketHref}
            onClick={handleTicketClick}
            className="group relative flex h-[52px] min-h-[52px] items-center justify-center gap-2 overflow-hidden bg-[#E8B86D] px-4 text-[11px] font-black uppercase tracking-[0.12em] text-black shadow-[0_14px_34px_rgba(232,184,109,0.24)] transition-all duration-300 hover:bg-[#d4a574] hover:shadow-[0_0_20px_rgba(232,184,109,0.5)] active:scale-[0.98] motion-reduce:transition-none min-[380px]:text-[12px]"
          >
            <span className="relative z-10 flex items-center gap-2">
              GET JULY 4 TICKETS{" "}
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
              >
                →
              </span>
            </span>
            <div
              className="absolute inset-0 z-0 -translate-x-[150%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] transition-transform duration-700 ease-in-out group-hover:translate-x-[150%] motion-reduce:hidden"
              aria-hidden="true"
            />
          </a>
          <a
            href={lakeListHref}
            onClick={handleLakeListClick}
            className="group relative mt-2.5 flex h-11 min-h-11 overflow-hidden items-center justify-center gap-2 border border-[#E8B86D]/50 bg-[#E8B86D]/5 px-3 text-[10px] font-black uppercase tracking-[0.1em] text-[#E8B86D] transition-all hover:bg-[#E8B86D] hover:text-black hover:shadow-[0_0_20px_rgba(232,184,109,0.3)] active:scale-[0.98] motion-reduce:transition-none min-[380px]:px-4 min-[380px]:text-[11px] min-[380px]:tracking-[0.12em]"
          >
            <span className="relative z-10 flex items-center gap-2">
              SUN(SETS) II + III — GET ALERTS{" "}
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
              >
                →
              </span>
            </span>
            <div
              className="absolute inset-0 z-0 -translate-x-[150%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] transition-transform duration-700 ease-in-out group-hover:translate-x-[150%] motion-reduce:hidden"
              aria-hidden="true"
            />
          </a>
        </section>

        {/* 4. Video section */}
        <section className="mt-6" aria-label="Autograf / 2025 recap">
          <p className="text-center font-serif text-sm italic text-stone-300">
            Last summer: 2,800 on the lakefront.
          </p>
          <div className="relative mt-3 aspect-video w-full overflow-hidden border border-[#E8B86D]/20 bg-[#15110a]/60 shadow-[0_18px_48px_rgba(0,0,0,0.4)] backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(232,184,109,0.1),transparent_50%)]" aria-hidden="true" />
            <div className="relative z-10 h-full w-full">
            {recapPlaying ? (
              <YouTubeEmbed
                url={`https://youtu.be/${RECAP_YOUTUBE_ID}`}
                title="Chasing Sun(Sets) recap"
                className="absolute inset-0 h-full w-full"
                loading="eager"
                autoplay
              />
            ) : (
              <button
                type="button"
                onClick={handleRecapPlay}
                aria-label="Play the recap video"
                className="group absolute inset-0 h-full w-full transition-transform active:scale-[0.99] motion-reduce:transition-none"
              >
                <img
                  src={RECAP_THUMB}
                  alt="Chasing Sun(Sets) recap preview"
                  loading="lazy"
                  className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100"
                />
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.1),rgba(10,10,10,0.55))]" />
                <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/55 backdrop-blur transition group-hover:bg-[#E8B86D] group-hover:text-black">
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
          </div>
        </section>

        {/* 5. Season Pass */}
        <section
          className="relative mt-6 overflow-hidden border border-[#E8B86D]/30 bg-[#15110a]/60 shadow-[0_18px_48px_rgba(0,0,0,0.4)] backdrop-blur-xl"
          aria-label="2026 Season Pass"
        >
          <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(232,184,109,0.1),transparent_50%)]" aria-hidden="true" />
          <div className="relative z-10 border-b border-[#E8B86D]/20 bg-black">
            <div className="relative">
              <img
                src={SEASON_III_PROOF_IMAGE}
                alt="Joezi artist proof card for SUN(SETS) III on September 19, 2026 at Castaways Beach Club, Chicago Lakefront"
                loading="lazy"
                className="aspect-[696/877] h-auto w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute bottom-[17.4%] left-[24%] right-[24%] flex min-h-[3.7%] items-center justify-center rounded-full border border-[#7a5f37]/20 bg-[#b99a6c]/95 px-2 text-center text-[clamp(0.38rem,2vw,0.58rem)] font-black uppercase tracking-[0.3em] text-[#1a1208] shadow-[0_8px_18px_rgba(77,52,24,0.24)] backdrop-blur-[2px]"
              >
                with Massuma
              </div>
            </div>
            <img
              src="/images/MASSUMA.png"
              alt="Massuma artist card for SUN(SETS) III on September 19, 2026"
              loading="lazy"
              className="h-auto w-full object-cover border-t border-[#E8B86D]/20"
            />
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#E8B86D]">
                Season Pass
              </p>
              <span className="shrink-0 border border-[#E8B86D]/50 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.18em] text-[#E8B86D]">
                Limited
              </span>
            </div>

            <h2 className="mt-3 text-2xl font-black uppercase leading-[0.92] tracking-[0.01em] text-white">
              Three dates. One lake. One home.
            </h2>
            <p className="mt-3 text-[13px] font-semibold leading-relaxed text-stone-300">
              Season Pass holders get access to every 2026 Chasing Sun(Sets)
              date at Castaways, plus first notice on special guests, DJ
              appearances, and artist announcements before the public.
            </p>

            <div className="mt-4 border border-white/12 bg-black/30">
              {[
                "SUN(SETS) I · July 4",
                "SUN(SETS) II · August 22",
                "SUN(SETS) III · September 19 · Joezi x Massuma",
              ].map((label, index) => (
                <div
                  key={label}
                  className={`px-3.5 py-2.5 text-[10px] font-black uppercase tracking-[0.16em] text-stone-200 ${
                    index > 0 ? "border-t border-white/10" : ""
                  }`}
                >
                  {label}
                </div>
              ))}
            </div>

            <a
              href={seasonPassHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleSeasonPassClick}
              className="group relative mt-4 flex h-12 w-full overflow-hidden items-center justify-center gap-2 border border-[#E8B86D]/50 bg-[#E8B86D]/5 text-[11px] font-black uppercase tracking-[0.12em] text-[#E8B86D] transition-all hover:bg-[#E8B86D] hover:text-black hover:shadow-[0_0_20px_rgba(232,184,109,0.3)] active:scale-[0.98] motion-reduce:transition-none min-[390px]:text-xs"
            >
              <span className="relative z-10 flex items-center gap-2">
                GET SEASON PASS{" "}
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                >
                  →
                </span>
              </span>
              <div
                className="absolute inset-0 z-0 -translate-x-[150%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] transition-transform duration-700 ease-in-out group-hover:translate-x-[150%] motion-reduce:hidden"
                aria-hidden="true"
              />
            </a>
          </div>
        </section>

        {/* 6. Cabanas */}
        <section className="mt-6" aria-label="Cabanas and VIP">
          <div className="relative overflow-hidden border border-[#E8B86D]/30 bg-[#15110a]/60 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.4)] backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(232,184,109,0.1),transparent_50%)]" aria-hidden="true" />
            <div className="relative z-10">
            <h2 className="text-balance text-[clamp(0.85rem,4vw,1rem)] font-black uppercase tracking-[0.08em] text-white">
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
                href={ROUTES.vip}
                onClick={() => {
                  triggerHaptic(8);
                  trackSunsetsClick({
                    buttonName: "RESERVE BOTTLE SERVICE",
                    href: "/vip",
                    eventSlug: JULY_4_EVENT_SLUG,
                    eventDate: JULY_4_EVENT_DATE,
                    interestType: "vip_click",
                    channel: "Monolith",
                  });
                }}
                className="group relative mt-4 flex h-12 w-full overflow-hidden items-center justify-center gap-2 whitespace-nowrap border border-[#E8B86D]/50 bg-[#E8B86D]/5 text-[11px] font-black uppercase tracking-[0.1em] text-[#E8B86D] transition-all hover:bg-[#E8B86D] hover:text-black hover:shadow-[0_0_20px_rgba(232,184,109,0.3)] active:scale-[0.98] motion-reduce:transition-none min-[380px]:text-xs min-[380px]:tracking-[0.12em]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  RESERVE BOTTLE SERVICE{" "}
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  >
                    →
                  </span>
                </span>
                <div
                  className="absolute inset-0 z-0 -translate-x-[150%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] transition-transform duration-700 ease-in-out group-hover:translate-x-[150%] motion-reduce:hidden"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </section>

        {/* 7. Featured Sets */}
        <div className="mt-10 mb-4 flex items-center justify-center gap-4">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E8B86D]">
            Featured Sets
          </span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        {/* Benchek */}
        <section className="mt-4" aria-label="Benchek featured set drop">
          <div className="group overflow-hidden border border-[#E8B86D]/30 bg-[#15110a]/80 shadow-[0_18px_48px_rgba(0,0,0,0.32)] backdrop-blur-sm">
            <div className="grid grid-cols-1 min-[380px]:grid-cols-[0.82fr_1fr]">
              <div className="overflow-hidden bg-black/30">
                <img
                  src={BENCHEK_DROP_IMAGE}
                  alt="Benchek exclusive July 4 holiday set"
                  loading="lazy"
                  className="aspect-[4/3] h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 min-[380px]:aspect-auto min-[380px]:min-h-[178px]"
                />
              </div>
              <div className="flex flex-col justify-between p-4">
                <div>
                  <h2 className="mt-1 text-lg font-black uppercase leading-[1.05] tracking-tight text-white">
                    Benchek
                  </h2>
                  <p className="mt-2 text-[11px] font-semibold leading-relaxed text-stone-300">
                    An exclusive July 4 holiday set — Marbella to the Chicago
                    lakefront. Sign up for the unreleased drop.
                  </p>
                </div>
                <a
                  href={benchekDropHref}
                  onClick={handleBenchekDropClick}
                  className="group relative mt-4 flex min-h-[46px] overflow-hidden items-center justify-center border border-[#E8B86D]/50 bg-[#E8B86D]/5 px-3 text-center text-[11px] font-black uppercase tracking-[0.1em] text-[#E8B86D] transition-all hover:bg-[#E8B86D] hover:text-black hover:shadow-[0_0_20px_rgba(232,184,109,0.3)] active:scale-[0.97] motion-reduce:transition-none"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get the Set Drop
                  </span>
                  <div
                    className="absolute inset-0 z-0 -translate-x-[150%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] transition-transform duration-700 ease-in-out group-hover:translate-x-[150%] motion-reduce:hidden"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Sommers UK */}
        <section className="mt-4" aria-label="Sommers UK featured set drop">
          <div className="group overflow-hidden border border-[#E8B86D]/30 bg-[#15110a]/80 shadow-[0_18px_48px_rgba(0,0,0,0.32)] backdrop-blur-sm">
            <div className="grid grid-cols-1 min-[380px]:grid-cols-[0.82fr_1fr]">
              <div className="overflow-hidden bg-black/30">
                <img
                  src={SOMMERS_UK_IMAGE}
                  alt="Sommers UK exclusive sunset set"
                  loading="lazy"
                  className="aspect-[4/3] h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 min-[380px]:aspect-auto min-[380px]:min-h-[178px]"
                />
              </div>
              <div className="flex flex-col justify-between p-4">
                <div>
                  <h2 className="mt-1 text-lg font-black uppercase leading-[1.05] tracking-tight text-white">
                    Sommers UK
                  </h2>
                  <p className="mt-2 text-[11px] font-semibold leading-relaxed text-stone-300">
                    A London-based duo making waves with their distinctive
                    fusion of Afro-Tech and melodic house.
                  </p>
                </div>
                <a
                  href={sommersUkHref}
                  onClick={handleSommersUkClick}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative mt-4 flex min-h-[46px] overflow-hidden items-center justify-center border border-[#E8B86D]/50 bg-[#E8B86D]/5 px-3 text-center text-[11px] font-black uppercase tracking-[0.1em] text-[#E8B86D] transition-all hover:bg-[#E8B86D] hover:text-black hover:shadow-[0_0_20px_rgba(232,184,109,0.3)] active:scale-[0.97] motion-reduce:transition-none"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Listen on SoundCloud
                  </span>
                  <div
                    className="absolute inset-0 z-0 -translate-x-[150%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] transition-transform duration-700 ease-in-out group-hover:translate-x-[150%] motion-reduce:hidden"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Closing Sign-off */}
        <section className="mt-10 mb-6 text-center" aria-label="Sign-off">
          <div className="flex items-center gap-4" aria-hidden="true">
            <span className="h-px flex-1 bg-white/10" />
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
          <p className="mt-7 text-sm font-semibold text-stone-100">
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
        </section>

        {/* 9. Footer strip */}
        <footer className="mt-auto pt-4">
          <nav
            aria-label="More from Sun(Sets)"
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
          >
            {FOOTER_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                target={/^https?:\/\//i.test(link.href) ? "_blank" : undefined}
                rel={
                  /^https?:\/\//i.test(link.href)
                    ? "noopener noreferrer"
                    : undefined
                }
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
