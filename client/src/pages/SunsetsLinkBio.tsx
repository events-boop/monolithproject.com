import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import ResponsiveImage from "@/components/ResponsiveImage";
import LolaPopupFrame from "@/components/LolaPopupFrame";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";
import CommunityContributionSection, {
  COMMUNITY_UPLOAD_URL,
} from "@/components/CommunityContributionSection";
import { ROUTES } from "@shared/routes";
import { trackFunnelPageView } from "@/lib/api";
import {
  trackLakeOutboundTicketClick,
  trackLakeLead,
  trackLakePageView,
} from "@/lib/campaignPixel";
import {
  SUNSETS_AUG22_EVENT_DATE as AUG22_EVENT_DATE,
  SUNSETS_AUG22_EVENT_SLUG as AUG22_EVENT_SLUG,
  SUNSETS_AUG22_TICKET_PATH,
  SUNSETS_JULY4_COMPLETE_LABEL,
  SUNSETS_JULY4_EVENT_DATE as JULY_4_EVENT_DATE,
  SUNSETS_JULY4_EVENT_SLUG as JULY_4_EVENT_SLUG,
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
const MASSUMA_SEP19_ARTWORK =
  "/images/events/sunsets-2026-09-19/massuma-official-artwork.png";
// Season III headliner live sets — same YouTube embeds as the artist profiles.
const SEASON_III_LIVE_SETS = [
  {
    artist: "Joezi",
    label: "Live at SOLLUNA Festival · W2026",
    url: "https://youtu.be/qMWZngFojK0",
  },
  {
    artist: "Massuma (UK)",
    label: "Live @ KOKO London · 2026",
    url: "https://www.youtube.com/watch?v=iErA3nUrdQE",
  },
] as const;
// Live channel row at the bottom of the page. untold.vip serves its own
// cert + host-detected landing (verified live 2026-07-01); the broadcast
// channel is the direct Chasing Sun(Sets) Instagram channel supplied by owner.
const UNTOLD_VIP_HREF = "https://untold.vip";
const HOUSE_OF_FRIENDS_HREF = "https://houseoffriends.vip";
const CHASING_SUNSETS_CHANNEL_HREF =
  "https://www.instagram.com/channel/AbYuqCKYjvqcwcz0/";
const SOMMERS_UK_HREF =
  "https://soundcloud.com/chasing-sun-sets/sommers-uk-ep0011-chapter-1-chasing-sunsets";
const SOMMERS_UK_IMAGE = "/images/sommers-uk-cover.jpg";
// Chapter One archive — gallery + recap land here as they clear the edit.
const SUNSETS_I_ARCHIVE_HREF = "/chasing-sunsets/sunsets-i-2026";
// Follow rails for the Featured Sets block.
const SUNSETS_SOUNDCLOUD_FOLLOW_HREF = "/go/media/sunsets-soundcloud";
const SUNSETS_SPOTIFY_FOLLOW_HREF = "/go/social/spotify";

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
    description:
      "SUN(SETS) I opens the Chasing Sun(Sets) 2026 season on July 4 at Castaways Beach Club — open-air house music on Lake Michigan from noon to 10 PM with Autograf, Kiko Franco, Amari, Eliana, Gianni Blu, Frank Bono, Erik The DJ, Jerome, Colin, and Nomar.",
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
    // No offers block: the event has happened — an InStock offer on a past
    // event is a Search Console structured-data violation.
    subEvent: {
      "@type": "MusicEvent" as const,
      name: "Untold Story — Late Night Continuation (Official Afterparty)",
      description:
        "The official July 4 after-party. When the open-air session ends, Untold Story carries the night into a darker, tighter room — 10:30 PM until late in Chicago.",
      startDate: "2026-07-04T22:30:00-05:00",
      endDate: "2026-07-05T04:00:00-05:00",
      url: "https://monolithproject.com/story",
      image: "https://monolithproject.com/images/untold-story-moody.webp",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      organizer: {
        "@type": "Organization" as const,
        name: "The Monolith Project",
        url: "https://monolithproject.com",
      },
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
    description:
      "SUN(SETS) II — the summer return. Chapter Two of Chasing Sun(Sets) 2026 at Castaways Beach Club, Chicago. Tickets on sale now, powered by Posh.",
    startDate: "2026-08-22T12:00:00-05:00",
    endDate: "2026-08-22T22:00:00-05:00",
    offers: {
      "@type": "Offer" as const,
      url: "https://sunsets.vip",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
    },
  },
  {
    ...SHARED_EVENT_SCHEMA,
    name: "SUN(SETS) III — Chasing Sun(Sets) 2026",
    description:
      "SUN(SETS) III — the season finale of Chasing Sun(Sets) 2026 at Castaways Beach Club with Joezi and Massuma (UK), plus special guests TBA. The closing chapter on the Chicago lakefront.",
    startDate: "2026-09-19T12:00:00-05:00",
    endDate: "2026-09-19T22:00:00-05:00",
    performer: ["Joezi", "Massuma (UK)"].map(name => ({
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
    label: "House of Friends",
    href: HOUSE_OF_FRIENDS_HREF,
    interestType: "house_of_friends_click",
    channel: "House of Friends",
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

  const benchekDropHref = appendEventAttribution(
    BENCHEK_DROP_HREF,
    JULY_4_EVENT_SLUG
  );
  const sommersUkHref = appendEventAttribution(
    SOMMERS_UK_HREF,
    JULY_4_EVENT_SLUG
  );
  const aug22TicketHref = appendEventAttribution(
    SUNSETS_AUG22_TICKET_PATH,
    AUG22_EVENT_SLUG
  );
  const seasonPassHref = appendEventAttribution(
    SEASON_PASS_HREF,
    JULY_4_EVENT_SLUG
  );

  const handleTicketPrimaryClick = () => {
    triggerHaptic(16);
    trackLakeOutboundTicketClick({ cta_placement: "primary" });
    captureSunsetsTicketCtaClick({
      destinationUrl: aug22TicketHref,
      pagePath: PAGE_PATH,
      ctaPosition: "primary",
    });
    trackSunsetsClick({
      buttonName: "BUY TICKETS — AUGUST 22",
      href: aug22TicketHref,
      eventSlug: AUG22_EVENT_SLUG,
      eventDate: AUG22_EVENT_DATE,
      interestType: "ticket_click",
      channel: "Posh",
    });
  };

  const handleArchiveClick = (position: string) => {
    triggerHaptic(12);
    trackSunsetsClick({
      buttonName: `RELIVE CHAPTER ONE — ${position}`,
      href: SUNSETS_I_ARCHIVE_HREF,
      eventSlug: JULY_4_EVENT_SLUG,
      eventDate: JULY_4_EVENT_DATE,
      interestType: "archive_click",
      channel: "Monolith",
    });
  };

  const handleCommunityUploadClick = () => {
    triggerHaptic(12);
    trackLakeLead(newLeadEventId(), {
      content_name: "Community Upload Click",
    });
    trackSunsetsClick({
      buttonName: "UPLOAD SETS PHOTOS VIDEOS",
      href: COMMUNITY_UPLOAD_URL,
      eventSlug: JULY_4_EVENT_SLUG,
      eventDate: JULY_4_EVENT_DATE,
      interestType: "community_upload_click",
      channel: "Dropbox",
    });
  };

  const handleDjSetSubmissionClick = () => {
    triggerHaptic(12);
    trackLakeLead(newLeadEventId(), {
      content_name: "Community DJ Set Submission Click",
    });
    trackSunsetsClick({
      buttonName: "SUBMIT YOUR DJ SET",
      href: "/submit?intent=dj-set&series=chasing-sunsets",
      eventSlug: JULY_4_EVENT_SLUG,
      eventDate: JULY_4_EVENT_DATE,
      interestType: "dj_set_submission_click",
      channel: "Monolith",
    });
  };

  const handleFollowClick = (
    channel: "SoundCloud" | "Spotify",
    href: string
  ) => {
    triggerHaptic(12);
    trackSunsetsClick({
      buttonName: `FOLLOW ON ${channel.toUpperCase()}`,
      href,
      eventSlug: JULY_4_EVENT_SLUG,
      eventDate: JULY_4_EVENT_DATE,
      interestType: "set_drop_follow_click",
      channel,
    });
  };

  const handleSeasonPassClick = () => {
    triggerHaptic(16);
    trackLakeOutboundTicketClick({ cta_placement: "season_pass" });
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
      content_name: "Sommers (UK) SoundCloud Click",
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
        title="SUN(SETS) 2026 | Chasing Sun(Sets) — Castaways Chicago"
        description="SUN(SETS) II returns to Castaways Beach Club August 22 — tickets on sale now, powered by Posh. SUN(SETS) III closes the season September 19 with Joezi x Massuma (UK)."
        image={OG_IMAGE}
        canonicalPath={PAGE_PATH}
        canonicalUrl={CANONICAL_SUNSETS_URL}
        schemaData={SEASON_EVENTS_SCHEMA}
        absoluteTitle
      />
      <main className="sunsets-vip-shell relative mx-auto flex min-h-screen w-full max-w-[460px] flex-col px-5 py-4 sm:py-6">
        {/* Ambient Glow */}
        <div
          className="absolute left-1/2 top-0 -z-10 h-[24rem] w-[24rem] max-w-[120vw] -translate-x-1/2 rounded-full bg-[#E8B86D]/10 opacity-60 blur-[80px]"
          aria-hidden="true"
        />

        {/* 1. Hero — current season */}
        <header className="sunsets-vip-hero relative text-center">
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
          <div className="sunsets-vip-datum" aria-hidden="true">
            <span>41.9117° N</span>
            <span>Chicago Lakefront</span>
            <span>87.6193° W</span>
          </div>
        </header>

        {/* Lola Pop-Up Weekend flyer — directly under the hero */}
        <LolaPopupFrame accent="gold" layout="stacked" className="mt-4" />

        {/* 2. SUN(SETS) II Header */}
        <section
          className="sunsets-vip-frame sunsets-vip-frame-signal relative mt-2 border border-[#E8B86D]/20 bg-[#15110a]/60 p-5 text-center shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-md"
          aria-label="SUN(SETS) II Event Details"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#E8B86D]/5 to-transparent" />
          <div className="sunsets-signal-registry" aria-hidden="true">
            <span>Current Signal</span>
            <span>02 / Active</span>
          </div>
          <p className="mt-4 text-[12px] font-black uppercase tracking-[0.2em] text-[#E8B86D]">
            SUN(SETS) II — AUG 22
          </p>
          <h2 className="mx-1 mt-3 text-[clamp(1.25rem,5.8vw,1.45rem)] font-black uppercase leading-[1.1] tracking-tight text-white drop-shadow-md">
            THE SUMMER RETURN
          </h2>
          <p className="mt-3 text-[13px] font-semibold leading-relaxed text-stone-300">
            Chapter Two at Castaways Beach Club. Tickets are live now.
          </p>
        </section>

        {/* 3. Primary CTA */}
        <section className="mt-4" aria-label="Buy tickets">
          <a
            href={aug22TicketHref}
            onClick={handleTicketPrimaryClick}
            className="group relative flex h-[52px] min-h-[52px] items-center justify-center gap-2 overflow-hidden bg-[#E8B86D] px-4 text-[11px] font-black uppercase tracking-[0.12em] text-black shadow-[0_14px_34px_rgba(232,184,109,0.24)] transition-all duration-300 hover:bg-[#d4a574] hover:shadow-[0_0_20px_rgba(232,184,109,0.5)] active:scale-[0.98] motion-reduce:transition-none min-[380px]:text-[12px]"
          >
            <span className="relative z-10 flex items-center gap-2">
              BUY TICKETS — AUG 22{" "}
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
          <p className="mt-3 text-center text-[10px] font-semibold leading-relaxed tracking-[0.06em] text-stone-400">
            Official tickets powered by Posh — straight to checkout, no
            waitlist. Live updates on{" "}
            <a
              href="https://instagram.com/chasingsunsets.music"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E8B86D]/80 underline underline-offset-2 hover:text-[#E8B86D]"
            >
              @chasingsunsets.music
            </a>
            .
          </p>
        </section>

        {/* 4. Season Pass — future dates and announced artists lead. */}
        <section
          className="sunsets-vip-frame sunsets-vip-frame-major relative mt-6 overflow-hidden border border-[#E8B86D]/30 bg-[#15110a]/60 shadow-[0_18px_48px_rgba(0,0,0,0.4)] backdrop-blur-xl"
          aria-label="2026 Season Pass"
        >
          <div
            className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(232,184,109,0.1),transparent_50%)]"
            aria-hidden="true"
          />
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
                with Massuma (UK)
              </div>
            </div>
            <ResponsiveImage
              src={MASSUMA_SEP19_ARTWORK}
              alt="Official Massuma artwork for SUN(SETS) III on September 19, 2026 at Castaways Beach Club"
              sizes="(max-width: 640px) 100vw, 480px"
              className="h-auto w-full border-t border-[#E8B86D]/20 object-cover"
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
                {
                  label: "SUN(SETS) II · August 22",
                  status: "upcoming",
                },
                {
                  label: "SUN(SETS) III · September 19 · Joezi x Massuma (UK)",
                  status: "upcoming",
                },
                {
                  label: SUNSETS_JULY4_COMPLETE_LABEL,
                  status: "complete",
                },
              ].map((date, index) => (
                <div
                  key={date.label}
                  className={`px-3.5 py-2.5 text-[10px] font-black uppercase tracking-[0.16em] ${
                    index > 0 ? "border-t border-white/10" : ""
                  } ${date.status === "complete" ? "text-stone-500" : "text-stone-200"}`}
                >
                  {date.label}
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

        {/* 4b. Season III headliners — Joezi x Massuma (UK) live sets. */}
        <section className="mt-6" aria-label="Joezi and Massuma (UK) live sets">
          <p className="text-center font-serif text-sm italic text-stone-300">
            September 19 headliners, live.
          </p>
          <div className="mt-3 space-y-5">
            {SEASON_III_LIVE_SETS.map(set => (
              <div key={set.url}>
                <div className="sunsets-vip-frame sunsets-vip-frame-media relative aspect-video w-full overflow-hidden border border-[#E8B86D]/20 bg-[#15110a]/60 shadow-[0_18px_48px_rgba(0,0,0,0.4)] backdrop-blur-xl">
                  <YouTubeEmbed
                    url={set.url}
                    title={`${set.artist} — ${set.label}`}
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
                <p className="mt-2 text-center text-[10px] font-black uppercase tracking-[0.2em] text-[#E8B86D]">
                  {set.artist}{" "}
                  <span className="font-semibold normal-case tracking-normal text-stone-400">
                    · {set.label}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Cabanas and VIP — second conversion path. */}
        <section className="mt-6" aria-label="Cabanas and VIP">
          <div className="sunsets-vip-frame relative overflow-hidden border border-[#E8B86D]/30 bg-[#15110a]/60 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.4)] backdrop-blur-xl">
            <div
              className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(232,184,109,0.1),transparent_50%)]"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <h2 className="text-balance text-[clamp(0.85rem,4vw,1rem)] font-black uppercase tracking-[0.08em] text-white">
                CABANAS &amp; VIP RESERVATIONS
              </h2>
              <p className="mt-2 text-sm font-semibold text-stone-300">
                Lock your section for August 22.
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

        {/* 6. Chapter One archive — clearly historical, below future dates. */}
        <section className="mt-5" aria-label="SUN(SETS) I Chapter One archive">
          <div className="sunsets-vip-frame overflow-hidden border border-[#E8B86D]/25 bg-[#15110a]/60 shadow-[0_18px_48px_rgba(0,0,0,0.4)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 border-b border-[#E8B86D]/20 px-4 py-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E8B86D]">
                  Chapter One / Archive
                </p>
                <p className="mt-1 text-[11px] text-stone-400">
                  July 4 is complete. The record stays open.
                </p>
              </div>
              <span className="shrink-0 border border-white/15 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/58">
                Complete
              </span>
            </div>
            <div className="relative">
              <img
                src="/sunsets_poster.jpg"
                alt="SUN(SETS) I Chapter One archive poster from July 4, 2026"
                className="h-auto w-full object-cover opacity-86"
                loading="lazy"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 to-transparent"
              />
              <a
                href={SUNSETS_I_ARCHIVE_HREF}
                onClick={() => handleArchiveClick("Archive card")}
                className="group absolute inset-x-4 bottom-4 flex h-11 items-center justify-center gap-2 border border-[#E8B86D]/60 bg-black/55 px-3 text-[10px] font-black uppercase tracking-[0.12em] text-[#E8B86D] backdrop-blur-md transition hover:border-[#E8B86D] hover:bg-[#E8B86D] hover:text-black"
              >
                Relive Chapter One <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* 7. Video section */}
        <section className="mt-6" aria-label="Autograf / 2025 recap">
          <p className="text-center font-serif text-sm italic text-stone-300">
            Last chapter: 2,800 on the lakefront.
          </p>
          <div className="sunsets-vip-frame sunsets-vip-frame-media relative mt-3 aspect-video w-full overflow-hidden border border-[#E8B86D]/20 bg-[#15110a]/60 shadow-[0_18px_48px_rgba(0,0,0,0.4)] backdrop-blur-xl">
            <div
              className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(232,184,109,0.1),transparent_50%)]"
              aria-hidden="true"
            />
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

        {/* 8. Chapter One — community contribution channels */}
        <CommunityContributionSection
          tone="sunsets"
          seriesName="Chasing Sun(Sets)"
          archiveLabel="Chapter One"
          compact
          className="mt-4"
          onDjSetClick={handleDjSetSubmissionClick}
          onMediaClick={handleCommunityUploadClick}
        />

        {/* 9. Featured Sets */}
        <div className="mt-10 mb-4 flex items-center justify-center gap-4">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E8B86D]">
            Featured Sets
          </span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        {/* Benchek */}
        <section className="mt-4" aria-label="Benchek featured set drop">
          <div className="group relative overflow-hidden rounded-[8px] bg-[#181818] transition-colors hover:bg-[#282828] duration-300 cursor-pointer">
            <a
              href={benchekDropHref}
              onClick={handleBenchekDropClick}
              className="absolute inset-0 z-20"
              aria-label="Sign up for Benchek set drop"
            />
            {/* Top Image Area */}
            <div className="relative aspect-[4/3] w-full">
              <img
                src={BENCHEK_DROP_IMAGE}
                alt="Benchek exclusive July 4 holiday set"
                loading="lazy"
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/60 to-transparent"></div>

              <span className="absolute left-4 top-4 text-[13px] font-bold text-white drop-shadow-md">
                Featured Set Drop
              </span>
            </div>

            {/* Bottom Content Area */}
            <div className="relative z-10 flex items-end justify-between p-4 -mt-8">
              <div className="flex flex-col pr-4">
                <h2 className="text-[22px] font-bold tracking-tight text-white mb-1">
                  Benchek
                </h2>
                <p className="text-[13px] text-[#b3b3b3] line-clamp-2">
                  Sign up for Set drops — unreleased sets from the lakefront,
                  delivered first.
                </p>
              </div>

              {/* Follow / Signup Button */}
              <button className="relative z-30 shrink-0 rounded-full border border-[#727272] px-4 py-1.5 text-[13px] font-bold text-white transition-all hover:scale-105 hover:border-white">
                Sign Up
              </button>
            </div>

            {/* Follow rails */}
            <div className="relative z-30 grid grid-cols-2 gap-2 px-4 pb-4">
              <a
                href={SUNSETS_SOUNDCLOUD_FOLLOW_HREF}
                onClick={() =>
                  handleFollowClick(
                    "SoundCloud",
                    SUNSETS_SOUNDCLOUD_FOLLOW_HREF
                  )
                }
                className="flex min-h-[38px] items-center justify-center rounded-full border border-[#727272] px-3 text-[12px] font-bold text-white transition-all hover:border-white hover:bg-white/5"
              >
                Follow on SoundCloud
              </a>
              <a
                href={SUNSETS_SPOTIFY_FOLLOW_HREF}
                onClick={() =>
                  handleFollowClick("Spotify", SUNSETS_SPOTIFY_FOLLOW_HREF)
                }
                className="flex min-h-[38px] items-center justify-center rounded-full border border-[#727272] px-3 text-[12px] font-bold text-white transition-all hover:border-white hover:bg-white/5"
              >
                Follow on Spotify
              </a>
            </div>
          </div>
        </section>

        {/* Sommers (UK) */}
        <section className="mt-4" aria-label="Sommers (UK) featured set drop">
          <div className="sunsets-vip-frame group overflow-hidden border border-[#E8B86D]/30 bg-[#15110a]/80 shadow-[0_18px_48px_rgba(0,0,0,0.32)] backdrop-blur-sm">
            <div className="grid grid-cols-1 min-[380px]:grid-cols-[0.82fr_1fr]">
              <div className="overflow-hidden bg-black/30">
                <img
                  src={SOMMERS_UK_IMAGE}
                  alt="Sommers (UK) exclusive sunset set"
                  loading="lazy"
                  className="aspect-[4/3] h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 min-[380px]:aspect-auto min-[380px]:min-h-[178px]"
                />
              </div>
              <div className="flex flex-col justify-between p-4">
                <div>
                  <h2 className="mt-1 text-lg font-black uppercase leading-[1.05] tracking-tight text-white">
                    Sommers (UK)
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

        {/* 9. Live channels */}
        <section className="mb-6" aria-label="Live channels">
          <a
            href={aug22TicketHref}
            onClick={() => {
              triggerHaptic(16);
              trackLakeOutboundTicketClick({ cta_placement: "footer" });
              captureSunsetsTicketCtaClick({
                destinationUrl: aug22TicketHref,
                pagePath: PAGE_PATH,
                ctaPosition: "footer",
              });
              trackSunsetsClick({
                buttonName: "BUY TICKETS — AUGUST 22 — Bottom",
                href: aug22TicketHref,
                eventSlug: AUG22_EVENT_SLUG,
                eventDate: AUG22_EVENT_DATE,
                interestType: "ticket_click",
                channel: "Posh",
              });
            }}
            className="group relative flex h-[52px] min-h-[52px] items-center justify-center gap-2 overflow-hidden bg-[#E8B86D] px-4 text-[11px] font-black uppercase tracking-[0.12em] text-black shadow-[0_14px_34px_rgba(232,184,109,0.24)] transition-all duration-300 hover:bg-[#d4a574] hover:shadow-[0_0_20px_rgba(232,184,109,0.5)] active:scale-[0.98] motion-reduce:transition-none min-[380px]:text-[12px]"
          >
            <span className="relative z-10 flex items-center gap-2">
              BUY TICKETS — AUG 22{" "}
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
            href={UNTOLD_VIP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackSunsetsClick({
                buttonName: "UNTOLD.VIP",
                href: UNTOLD_VIP_HREF,
                eventSlug: JULY_4_EVENT_SLUG,
                eventDate: JULY_4_EVENT_DATE,
                interestType: "untold_story_click",
                channel: "Untold",
              })
            }
            className="group relative mt-2.5 flex h-[52px] min-h-[52px] items-center justify-center gap-2.5 overflow-hidden border border-[#22d3ee]/50 bg-[#22d3ee]/5 px-4 text-[11px] font-black uppercase tracking-[0.12em] text-[#B9F6FF] transition-all hover:bg-[#22d3ee] hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] active:scale-[0.98] motion-reduce:transition-none min-[380px]:text-[12px]"
          >
            <span className="relative z-10 flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-[#22d3ee] shadow-[0_0_8px_rgba(34,211,238,0.9)] animate-pulse motion-reduce:animate-none"
              />
              UNTOLD.VIP — THE AFTERPARTY
            </span>
            <div
              className="absolute inset-0 z-0 -translate-x-[150%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] transition-transform duration-700 ease-in-out group-hover:translate-x-[150%] motion-reduce:hidden"
              aria-hidden="true"
            />
          </a>
          <a
            href={CHASING_SUNSETS_CHANNEL_HREF}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackSunsetsClick({
                buttonName: "Chasing Sun(Sets) Channel",
                href: CHASING_SUNSETS_CHANNEL_HREF,
                eventSlug: JULY_4_EVENT_SLUG,
                eventDate: JULY_4_EVENT_DATE,
                interestType: "instagram_channel_click",
                channel: "Instagram Broadcast",
              })
            }
            className="group relative mt-2.5 flex h-[52px] min-h-[52px] items-center justify-center gap-2.5 overflow-hidden border border-[#E1306C]/50 bg-[#E1306C]/5 px-4 text-[11px] font-black uppercase tracking-[0.12em] text-[#ff8db2] transition-all hover:bg-[#E1306C] hover:text-white hover:shadow-[0_0_20px_rgba(225,48,108,0.35)] active:scale-[0.98] motion-reduce:transition-none min-[380px]:text-[12px]"
          >
            <span className="relative z-10 flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-[#E1306C] shadow-[0_0_8px_rgba(225,48,108,0.9)] animate-pulse motion-reduce:animate-none"
              />
              CHASING SUN(SETS) CHANNEL
            </span>
            <div
              className="absolute inset-0 z-0 -translate-x-[150%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] transition-transform duration-700 ease-in-out group-hover:translate-x-[150%] motion-reduce:hidden"
              aria-hidden="true"
            />
          </a>
          <a
            href={HOUSE_OF_FRIENDS_HREF}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackSunsetsClick({
                buttonName: "HOUSEOFFRIENDS.VIP",
                href: HOUSE_OF_FRIENDS_HREF,
                eventSlug: JULY_4_EVENT_SLUG,
                eventDate: JULY_4_EVENT_DATE,
                interestType: "house_of_friends_click",
                channel: "House of Friends",
              })
            }
            className="group relative mt-2.5 flex h-[52px] min-h-[52px] items-center justify-center gap-2.5 overflow-hidden border border-[#f97316]/50 bg-[#f97316]/5 px-4 text-[11px] font-black uppercase tracking-[0.12em] text-[#fdba74] transition-all hover:bg-[#f97316] hover:text-black hover:shadow-[0_0_20px_rgba(249,115,22,0.35)] active:scale-[0.98] motion-reduce:transition-none min-[380px]:text-[12px]"
          >
            <span className="relative z-10 flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-[#f97316] shadow-[0_0_8px_rgba(249,115,22,0.9)]"
              />
              HOUSEOFFRIENDS.VIP — ENTER THE HOUSE
            </span>
            <div
              className="absolute inset-0 z-0 -translate-x-[150%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] transition-transform duration-700 ease-in-out group-hover:translate-x-[150%] motion-reduce:hidden"
              aria-hidden="true"
            />
          </a>
          <a
            href="https://monolithproject.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackSunsetsClick({
                buttonName: "Monolith Project",
                href: "https://monolithproject.com",
                eventSlug: JULY_4_EVENT_SLUG,
                eventDate: JULY_4_EVENT_DATE,
                interestType: "monolith_site_click",
                channel: "Monolith",
              })
            }
            className="group relative mt-2.5 flex h-[52px] min-h-[52px] items-center justify-center gap-2.5 overflow-hidden border border-white/25 bg-white/[0.03] px-4 text-[11px] font-black uppercase tracking-[0.12em] text-stone-200 transition-all hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] active:scale-[0.98] motion-reduce:transition-none min-[380px]:text-[12px]"
          >
            <span className="relative z-10 flex items-center gap-2.5">
              MONOLITH PROJECT
            </span>
            <div
              className="absolute inset-0 z-0 -translate-x-[150%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] transition-transform duration-700 ease-in-out group-hover:translate-x-[150%] motion-reduce:hidden"
              aria-hidden="true"
            />
          </a>
        </section>

        {/* 10. Footer strip */}
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
