import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bell,
  Camera,
  Check,
  Copy,
  Headphones,
  Handshake,
  Instagram,
  Play,
  Share2,
  Sparkles,
  Sun,
  Ticket,
  Users,
} from "lucide-react";
import SEO from "@/components/SEO";
import { appendAttributionQueryParams } from "@/lib/attribution";
import { submitNewsletterLead, trackFunnelPageView, trackLinkClick } from "@/lib/api";
import { buildLeadIdempotencyKey } from "@/lib/leadCapture";
type BioLink = {
  type?: "link" | "youtube" | "soundcloud" | "gallery";
  label: string;
  buttonName: string;
  eyebrow: string;
  sub: string;
  href: string;
  eventSlug?: string;
  eventDate?: string;
  interestType: string;
  channel: string;
  icon: typeof Sun;
  image?: string;
  variant?: "primary" | "warm" | "cool";
  external?: boolean;
};

type EventDate = "2026-07-04" | "2026-08-22" | "2026-09-19";

const TICKET_HUB_HREF = "/chasing-sunsets#chasing-tickets";
const RECAP_HREF = "/go/media/sunsets-recap";
const SOUNDCLOUD_HREF = "/go/media/sunsets-soundcloud";
const GALLERY_HREF = "/go/gallery/chasing-sunsets";
const SUNSETS_SOUNDCLOUD_EMBED_HREF = "https://soundcloud.com/chasing-sun-sets";
const JULY_4_FIRST_ACCESS_IMAGE = "/images/chasing-sunsets-july4-first-access.png";
const JULY_4_EVENT_SLUG = "chasing-sunsets-july-4-2026";
const AUGUST_22_EVENT_SLUG = "chasing-sunsets-august-22-2026";
const SEPTEMBER_19_EVENT_SLUG = "chasing-sunsets-september-19-2026";
const INSTAGRAM_SUNSETS_HREF = "/go/social/instagram-sunsets";
const TIKTOK_HREF = "/go/social/tiktok";
const SPOTIFY_HREF = "/go/social/spotify";
const X_HREF = "/go/social/x";

const capturePromises = ["Ticket drops", "Lineup alerts", "VIP access"] as const;
const funnelSteps = [
  "Instagram / QR",
  "First Access",
  "Ticket Drop",
] as const;

function triggerHaptic(pattern: number | number[] = 12) {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  navigator.vibrate(pattern);
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.4 3.5v10.1a4.9 4.9 0 1 1-4.9-4.9c.3 0 .6 0 .9.1v2.8a2.1 2.1 0 1 0 1.2 1.9V3.5h2.8Zm0 0c.5 2.4 1.9 3.8 4.1 4.2v2.8c-1.6-.1-3-.7-4.1-1.7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7.8 10.1c3.1-1 6.1-.7 8.6.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8.6 12.7c2.2-.6 4.6-.4 6.4.7" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
      <path d="M9.2 15.1c1.6-.4 3.2-.2 4.5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5.5 5.5 13 13M18.5 5.5l-13 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const socialLinks = [
  {
    label: "Instagram",
    href: INSTAGRAM_SUNSETS_HREF,
    icon: Instagram,
    channel: "Instagram",
  },
  {
    label: "TikTok",
    href: TIKTOK_HREF,
    icon: TikTokIcon,
    channel: "TikTok",
  },
  {
    label: "Spotify",
    href: SPOTIFY_HREF,
    icon: SpotifyIcon,
    channel: "Spotify",
  },
  {
    label: "X",
    href: X_HREF,
    icon: XIcon,
    channel: "X",
  },
] as const;

const schedule = [
  {
    date: "July 4",
    title: "Independence Day On The Lake",
    venue: "Castaways, Chicago",
    time: "3 PM - 10 PM",
    href: TICKET_HUB_HREF,
    eventSlug: JULY_4_EVENT_SLUG,
    eventDate: "2026-07-04" as EventDate,
    status: "First Access Open",
  },
  {
    date: "Aug 22",
    title: "Summer Chapter",
    venue: "Castaways, Chicago",
    time: "Golden Hour",
    href: TICKET_HUB_HREF,
    eventSlug: AUGUST_22_EVENT_SLUG,
    eventDate: "2026-08-22" as EventDate,
    status: "Watchlist",
  },
  {
    date: "Sept 19",
    title: "Season Finale",
    venue: "Castaways, Chicago",
    time: "Golden Hour",
    href: TICKET_HUB_HREF,
    eventSlug: SEPTEMBER_19_EVENT_SLUG,
    eventDate: "2026-09-19" as EventDate,
    status: "Watchlist",
  },
];

const links: BioLink[] = [
  {
    label: "2026 Schedule / Tickets",
    buttonName: "2026 Schedule / Tickets",
    eyebrow: "Posh",
    sub: "See the season dates and ticket path for each chapter.",
    href: TICKET_HUB_HREF,
    eventSlug: JULY_4_EVENT_SLUG,
    eventDate: "2026-07-04",
    interestType: "ticket_click",
    channel: "Posh",
    icon: Ticket,
    variant: "primary",
  },
  {
    label: "VIP / Tables",
    buttonName: "VIP / Tables",
    eyebrow: "Fillout",
    sub: "Groups, birthdays, tables, and elevated lakefront experiences.",
    href: "/go/forms/sunsets-vip",
    eventSlug: JULY_4_EVENT_SLUG,
    eventDate: "2026-07-04",
    interestType: "vip_click",
    channel: "Fillout",
    icon: Users,
    external: true,
  },
  {
    type: "youtube",
    label: "View Last Year's Event",
    buttonName: "Watch Recap",
    eyebrow: "YouTube",
    sub: "See the energy from last year's Chasing Sun(Sets).",
    href: RECAP_HREF,
    eventSlug: JULY_4_EVENT_SLUG,
    eventDate: "2026-07-04",
    interestType: "recap_click",
    channel: "YouTube",
    icon: Play,
    image: "/images/archive/chasing-sunsets/css-s3-1.jpg",
    external: true,
  },
  {
    type: "soundcloud",
    label: "Featured: Chris IDH",
    buttonName: "Follow the Sound",
    eyebrow: "SoundCloud",
    sub: "Mixes, radio, and artist discovery from the Chasing archive.",
    href: SOUNDCLOUD_HREF,
    eventSlug: JULY_4_EVENT_SLUG,
    eventDate: "2026-07-04",
    interestType: "soundcloud_click",
    channel: "SoundCloud",
    icon: Headphones,
    image: "https://i1.sndcdn.com/artworks-FMot44uoQiVdP1Uj-bYxapA-t500x500.jpg",
    external: true,
    variant: "cool",
  },
  {
    type: "gallery",
    label: "View The Gallery",
    buttonName: "View Gallery",
    eyebrow: "Pic-Time",
    sub: "Photos and lakefront moments from the last chapter.",
    href: GALLERY_HREF,
    eventSlug: JULY_4_EVENT_SLUG,
    eventDate: "2026-07-04",
    interestType: "gallery_click",
    channel: "Pic-Time",
    icon: Camera,
    image: "/images/archive/chasing-sunsets/css-s3-4.jpg",
    external: true,
  },
  {
    label: "Partner Inquiry",
    buttonName: "Partner Inquiry",
    eyebrow: "Fillout",
    sub: "Venues, brands, sponsors, and city collaborations.",
    href: "/partners",
    eventSlug: JULY_4_EVENT_SLUG,
    eventDate: "2026-07-04",
    interestType: "partner_form_submit",
    channel: "Fillout",
    icon: Handshake,
  },
];

function trackSunsetsClick(item: Pick<BioLink, "buttonName" | "href" | "eventSlug" | "eventDate" | "interestType" | "channel">) {
  if (typeof window === "undefined") return;
  const win = window as Window & {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
  };

  win.gtag?.("event", "sunsets_bio_click", {
    link_label: item.buttonName,
    link_url: item.href,
    page_path: "/sunsets",
    event_slug: item.eventSlug,
    interest_type: item.interestType,
  });

  trackLinkClick({
    buttonName: item.buttonName,
    destinationUrl: item.href,
    pagePath: "/sunsets",
    eventSlug: item.eventSlug,
    eventDate: item.eventDate,
    interestType: item.interestType,
    channel: item.channel,
    source: "sunsets_link_bio",
  });
}

function ShareButton() {
  const [shareState, setShareState] = useState<"idle" | "shared" | "copied">("idle");

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    triggerHaptic(10);

    const shareUrl = new URL("/sunsets/", window.location.origin);
    shareUrl.searchParams.set("utm_source", "share");
    shareUrl.searchParams.set("utm_medium", "native");
    shareUrl.searchParams.set("utm_campaign", "chasing-sunsets");

    trackSunsetsClick({
      buttonName: "Share Bio Link",
      href: shareUrl.toString(),
      eventSlug: JULY_4_EVENT_SLUG,
      eventDate: "2026-07-04",
      interestType: "share_click",
      channel: "Native Share",
    });

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Chasing Sun(Sets)",
          text: "Join the Chasing Sun(Sets) circle. Watch the sun. Stay for the (sets).",
          url: shareUrl.toString(),
        });
        setShareState("shared");
      } else {
        await navigator.clipboard?.writeText(shareUrl.toString());
        setShareState("copied");
      }
    } catch {
      setShareState("idle");
      return;
    }

    window.setTimeout(() => setShareState("idle"), 2200);
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share Chasing Sun(Sets)"
      className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[#F4F0EA]/18 bg-[#F4F0EA]/8 text-[#F4F0EA]/70 shadow-[0_12px_36px_rgba(0,0,0,0.5)] backdrop-blur-xl transition hover:border-[#F4F0EA]/60 hover:bg-[#F4F0EA] hover:text-[#111111] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F0EA]/70"
    >
      {shareState === "idle" ? (
        <Share2 className="h-4 w-4" strokeWidth={1.7} />
      ) : shareState === "copied" ? (
        <Copy className="h-4 w-4" strokeWidth={1.7} />
      ) : (
        <Check className="h-4 w-4" strokeWidth={1.9} />
      )}
      {shareState !== "idle" && (
        <span className="absolute right-12 top-1/2 -translate-y-1/2 rounded-full border border-[#F4F0EA]/12 bg-[#111111]/90 px-2 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-[#F4F0EA]">
          {shareState === "copied" ? "Copied" : "Shared"}
        </span>
      )}
    </button>
  );
}

function StickyActionDock() {
  const firstAccessHref = "#first-access";
  const ticketHref = appendAttributionQueryParams(TICKET_HUB_HREF);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, type: "spring", stiffness: 220, damping: 24 }}
      className="sticky bottom-3 z-30 mx-3 mt-8 rounded-full border border-[#F4F0EA]/12 bg-[#090909]/86 p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.65)] backdrop-blur-2xl"
    >
      <div className="grid grid-cols-[1.05fr_.95fr] gap-1.5">
        <a
          href={firstAccessHref}
          onClick={() =>
            {
              triggerHaptic(12);
              trackSunsetsClick({
                buttonName: "Sticky Join First Access",
                href: firstAccessHref,
                eventSlug: JULY_4_EVENT_SLUG,
                eventDate: "2026-07-04",
                interestType: "first_access_click",
                channel: "Sticky CTA",
              });
            }
          }
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#F4F0EA] px-3 text-[10px] font-black uppercase tracking-[0.12em] text-[#111111] transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F0EA]/70"
        >
          <Bell className="h-3.5 w-3.5" strokeWidth={2} />
          First Access
        </a>
        <a
          href={ticketHref}
          onClick={() =>
            {
              triggerHaptic(12);
              trackSunsetsClick({
                buttonName: "Sticky Tickets",
                href: ticketHref,
                eventSlug: JULY_4_EVENT_SLUG,
                eventDate: "2026-07-04",
                interestType: "ticket_click",
                channel: "Sticky CTA",
              });
            }
          }
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#F4F0EA]/16 bg-[#F4F0EA]/[0.04] px-3 text-[10px] font-black uppercase tracking-[0.12em] text-[#F4F0EA]/82 transition hover:border-[#F4F0EA]/42 hover:text-[#F4F0EA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F0EA]/60"
        >
          <Ticket className="h-3.5 w-3.5" strokeWidth={2} />
          Tickets
        </a>
      </div>
    </motion.div>
  );
}

function SocialUtilityRow() {
  return (
    <div className="mb-5 flex items-center justify-center gap-2">
      {socialLinks.map((item) => {
        const Icon = item.icon;
        const href = appendAttributionQueryParams(item.href);
        return (
          <a
            key={item.label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            onClick={() => {
              triggerHaptic(8);
              trackSunsetsClick({
                buttonName: item.label,
                href,
                eventSlug: JULY_4_EVENT_SLUG,
                eventDate: "2026-07-04",
                interestType: `${item.label.toLowerCase()}_click`,
                channel: item.channel,
              });
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F4F0EA]/10 bg-[#F4F0EA]/[0.025] text-[#F4F0EA]/50 transition hover:-translate-y-0.5 hover:border-[#F4F0EA]/40 hover:bg-[#F4F0EA]/8 hover:text-[#F4F0EA] hover:shadow-[0_0_24px_rgba(244,240,234,0.16)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F0EA]/60"
          >
            <Icon className="h-4 w-4" strokeWidth={1.6} />
          </a>
        );
      })}
    </div>
  );
}

function InlineCaptureForm() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedValue = value.trim();
    const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue);
    const looksLikePhone = trimmedValue.replace(/\D/g, "").length >= 10;

    if (!looksLikeEmail && !looksLikePhone) {
      setError("Enter phone or email.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setError("");
    triggerHaptic(12);

    trackSunsetsClick({
      buttonName: "Inline First Access Capture",
      href: "/sunsets#first-access",
      eventSlug: JULY_4_EVENT_SLUG,
      eventDate: "2026-07-04",
      interestType: looksLikePhone ? "inline_sms_capture" : "inline_email_capture",
      channel: "Inline Capture",
    });

    if (looksLikeEmail) {
      try {
        await submitNewsletterLead(
          {
            email: trimmedValue,
            consent: true,
            source: "sunsets_link_bio_inline_capture",
            formType: "first_access_signup",
            funnelId: "chasing-sunsets-link-bio",
            offerId: "first-access",
            eventInterest: JULY_4_EVENT_SLUG,
            eventSeries: "chasing-sunsets",
            eventTitle: "Chasing Sun(Sets) July 4 2026",
            interestTags: [
              "chasing_sunsets",
              "laylo",
              "first_access_signup",
              "july4_interest",
              "sunsets_link_bio",
            ],
          },
          buildLeadIdempotencyKey("sunsets-link-bio", trimmedValue, JULY_4_EVENT_SLUG),
        );
      } catch {
        setError("Could not add you. Try again.");
        setStatus("error");
        triggerHaptic([20, 40, 20]);
        return;
      }
    } else {
      window.localStorage?.setItem(
        "sunsets_phone_capture_pending",
        JSON.stringify({
          phone: trimmedValue,
          eventSlug: JULY_4_EVENT_SLUG,
          capturedAt: new Date().toISOString(),
        }),
      );
    }

    window.setTimeout(() => {
      triggerHaptic(18);
      setStatus("submitted");
    }, 520);
  };

  if (status === "submitted") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="mt-6 rounded-[1.15rem] border border-[#F4F0EA]/18 bg-[#F4F0EA]/6 p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F0EA] text-[#111111]">
            <Check className="h-4 w-4" strokeWidth={2} />
          </span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#F4F0EA]">
              Added to the list
            </p>
            <p className="mt-1 text-sm leading-snug text-white/78">
              Welcome to the Chasing Sun(Sets) circle.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={submit}
      id="first-access"
      className="mt-6 rounded-[1.15rem] border border-[#F4F0EA]/16 bg-[#111111]/78 px-4 py-4 text-left shadow-[0_16px_50px_rgba(0,0,0,0.38)]"
      noValidate
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-[9px] font-black uppercase tracking-[0.24em] text-white/60">First access</p>
        <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-white/80">
          <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.7)]" />
          Waitlist Open
        </span>
      </div>
      <div className="flex items-end gap-3">
        <input
          type="text"
          value={value}
          autoComplete="email tel"
          inputMode="email"
          onChange={(event) => {
            setValue(event.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="phone or email"
          className="h-12 min-w-0 flex-1 rounded-none border-0 border-b border-white/20 bg-transparent px-0 text-base text-white outline-none transition placeholder:text-white/40 focus:border-white/80"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          aria-label="Join First Access"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white text-[#111111] transition hover:scale-105 disabled:cursor-wait disabled:opacity-65"
        >
          {status === "submitting" ? (
            <span className="h-3 w-3 animate-pulse rounded-full bg-[#111111]" />
          ) : (
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
          )}
        </button>
      </div>

      {status === "error" && (
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
          {error}
        </p>
      )}

      <div className="mt-4 grid grid-cols-3 gap-1.5 border-t border-[#F4F0EA]/8 pt-3">
        {capturePromises.map((item) => (
          <span
            key={item}
            className="rounded-full border border-[#F4F0EA]/10 bg-[#F4F0EA]/[0.025] px-2 py-1.5 text-center text-[8px] font-black uppercase tracking-[0.12em] text-[#F4F0EA]/58"
          >
            {item}
          </span>
        ))}
      </div>
    </form>
  );
}

function FunnelCue() {
  return (
    <div className="mt-5 grid grid-cols-3 gap-1.5">
      {funnelSteps.map((step, index) => (
        <div
          key={step}
          className="relative rounded-lg border border-[#F4F0EA]/8 bg-black/18 px-2 py-2 text-center"
        >
          {index > 0 ? <span className="absolute -left-1 top-1/2 h-px w-2 -translate-y-1/2 bg-[#F4F0EA]/18" /> : null}
          <p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#F4F0EA]/48">
            Step {index + 1}
          </p>
          <p className="mt-1 text-[9px] font-semibold uppercase leading-tight tracking-[0.08em] text-[#F4F0EA]/76">
            {step}
          </p>
        </div>
      ))}
    </div>
  );
}

function MediaAccordion({
  item,
  index,
  expanded,
  onToggle,
}: {
  item: BioLink;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const Icon = item.icon;
  const isYouTube = item.type === "youtube";
  const embedSrc = isYouTube
    ? "https://www.youtube-nocookie.com/embed/9R6XH7JZlJI?rel=0&modestbranding=1"
    : `https://w.soundcloud.com/player/?url=${encodeURIComponent(SUNSETS_SOUNDCLOUD_EMBED_HREF)}&color=%23f4f0ea&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=true`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 + index * 0.045, type: "spring", stiffness: 210, damping: 24 }}
      className="group my-3 overflow-hidden rounded-[1.15rem] border border-[#F4F0EA]/12 bg-[#111111]/78 shadow-[0_10px_40px_rgba(0,0,0,0.45)] transition hover:border-[#F4F0EA]/34"
    >
      <button
        type="button"
        onClick={onToggle}
        className="block w-full text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-center justify-between border-b border-[#F4F0EA]/8 bg-[#F4F0EA]/[0.025] px-4 py-3">
          <div className="flex items-center gap-2">
            <Icon className="h-3.5 w-3.5 text-[#F4F0EA]/78" />
            <span className="text-[10px] font-sans font-light uppercase tracking-[0.2em] text-[#F4F0EA]/60">
              {item.eyebrow}
            </span>
          </div>
          <span className="text-[11px] font-display uppercase tracking-[0.05em] text-[#F4F0EA]/50">
            {expanded ? "Close" : item.label}
          </span>
        </div>
        <div className="relative min-h-[132px] overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-62"
              loading="lazy"
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.08)_0%,rgba(17,17,17,0.92)_100%)]" />
          <div className="relative flex min-h-[132px] flex-col justify-end p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F0EA] text-[#111111] shadow-[0_0_22px_rgba(244,240,234,0.22)]">
              <Icon className="h-4 w-4" strokeWidth={1.8} />
            </div>
            <p className="max-w-[16rem] text-sm font-semibold leading-snug text-[#F4F0EA]/86">
              {item.sub}
            </p>
          </div>
        </div>
        <span className="flex items-center justify-between border-t border-[#F4F0EA]/8 px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#F4F0EA]/80 transition group-hover:text-[#F4F0EA]">
          {expanded ? "Now Playing Inline" : isYouTube ? "Watch Recap" : "Play Mix"}
          <ArrowUpRight className={`h-3.5 w-3.5 transition ${expanded ? "rotate-90" : ""}`} />
        </span>
      </button>

      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
        className="overflow-hidden"
      >
        <div className="border-t border-[#F4F0EA]/8 p-3">
          <div className="overflow-hidden rounded-xl border border-[#F4F0EA]/10 bg-black">
            <iframe
              title={isYouTube ? "Chasing Sun(Sets) recap video" : "Chasing Sun(Sets) SoundCloud player"}
              src={embedSrc}
              className={isYouTube ? "aspect-video w-full" : "h-[180px] w-full"}
              allow={isYouTube ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" : "autoplay"}
              allowFullScreen={isYouTube}
              loading="lazy"
            />
          </div>
          {isYouTube ? (
            <a
              href={appendAttributionQueryParams(item.href)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                triggerHaptic(10);
                trackSunsetsClick({ ...item, href: appendAttributionQueryParams(item.href) });
              }}
              className="mt-2 flex items-center justify-between rounded-lg border border-[#F4F0EA]/10 bg-[#F4F0EA]/[0.035] px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#F4F0EA]/72 transition hover:border-[#F4F0EA]/34 hover:text-[#F4F0EA]"
            >
              Open recap on YouTube
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}

function LinkCard({ item, index }: { item: BioLink; index: number }) {
  const Icon = item.icon;
  const href = appendAttributionQueryParams(item.href);
  const isPrimary = item.variant === "primary";
  const cardClass = isPrimary
    ? "border-[#F4F0EA]/70 bg-[#F4F0EA] text-[#050403] shadow-[0_16px_44px_rgba(244,240,234,0.18)] hover:border-white hover:bg-white"
    : "border-[#F4F0EA]/12 bg-[#111111]/72 text-white hover:border-[#F4F0EA]/36 hover:bg-[#F4F0EA]/6";
  const iconClass = isPrimary
    ? "border-[#050403]/12 bg-[#050403] text-[#F4F0EA]"
    : "border-white/10 bg-black/40 text-white/70";
  const eyebrowClass = isPrimary ? "text-[#050403]/60" : "text-white/40";
  const titleClass = isPrimary ? "text-[#050403] font-semibold" : "text-white/90 group-hover:text-white";
  const subClass = isPrimary ? "text-[#050403]/75" : "text-white/50 group-hover:text-white/70";
  const arrowClass = isPrimary ? "text-[#050403] opacity-100" : "text-white/30 group-hover:text-white/80";
  const glowClass = "group-hover:border-[#F4F0EA]/40 group-hover:bg-[#F4F0EA]/5";

  return (
    <motion.a
      href={href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 + index * 0.045, duration: 0.42 }}
      onClick={() => {
        triggerHaptic(item.variant === "primary" ? 14 : 8);
        trackSunsetsClick({ ...item, href });
      }}
      data-sunsets-link={item.eyebrow.toLowerCase()}
      className={`group relative flex min-h-[76px] items-center gap-4 overflow-hidden rounded-[1.1rem] border p-4 transition duration-500 hover:-translate-y-0.5 ${cardClass} ${isPrimary ? "" : glowClass}`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-transform duration-500 group-hover:scale-110 ${iconClass}`}
      >
        <Icon className="h-4 w-4" strokeWidth={1.2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-[13px] font-sans font-semibold uppercase tracking-[0.2em] ${eyebrowClass}`}>
          {item.eyebrow}
        </span>
        <span className="mt-0.5 flex items-center justify-between gap-3">
          <span className={`text-[14px] font-display tracking-[0.03em] transition-colors ${titleClass}`}>
            {item.label}
          </span>
          <ArrowUpRight className={`h-4 w-4 shrink-0 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 ${arrowClass}`} strokeWidth={1.5} />
        </span>
        <span className={`mt-1 block text-sm font-light leading-relaxed transition-colors ${subClass}`}>
          {item.sub}
        </span>
      </span>
    </motion.a>
  );
}

function AmbientFluidBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none bg-[#050505] z-0">
      {/* Amber / deep orange — top left, primary sunset tone */}
      <motion.div
        animate={{
          x: ["-10%", "12%", "-4%", "-10%"],
          y: ["-12%", "6%", "18%", "-12%"],
          scale: [1, 1.15, 0.92, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[20%] -left-[10%] w-[72vw] h-[72vw] rounded-full blur-[90px]"
        style={{ background: "radial-gradient(circle, rgba(232,184,109,0.24) 0%, rgba(194,112,62,0.12) 45%, transparent 70%)" }}
      />
      {/* Lake shadow — right side, keeps the page from going all-gold */}
      <motion.div
        animate={{
          x: ["8%", "-12%", "4%", "8%"],
          y: ["8%", "-6%", "-18%", "8%"],
          scale: [0.88, 1.05, 1.18, 0.88],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        className="absolute top-[30%] -right-[12%] w-[65vw] h-[65vw] rounded-full blur-[110px]"
        style={{ background: "radial-gradient(circle, rgba(25,59,59,0.28) 0%, rgba(44,24,16,0.10) 50%, transparent 72%)" }}
      />
      {/* Deep bronze — bottom center */}
      <motion.div
        animate={{
          x: ["-6%", "16%", "2%", "-6%"],
          y: ["16%", "2%", "-12%", "16%"],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[22%] left-[15%] w-[85vw] h-[85vw] rounded-full blur-[130px]"
        style={{ background: "radial-gradient(circle, rgba(58,40,22,0.30) 0%, rgba(5,4,3,0.08) 50%, transparent 68%)" }}
      />
      {/* Warm gold horizon accent — subtle strip at the bottom */}
      <motion.div
        animate={{ opacity: [0.18, 0.32, 0.18], y: ["0%", "-4%", "0%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 right-0 h-[28vh] blur-[60px]"
        style={{ background: "linear-gradient(to top, rgba(232,184,109,0.16) 0%, transparent 100%)" }}
      />
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:48px_48px]" />
    </div>
  );
}

export default function SunsetsLinkBio() {
  const [expandedMedia, setExpandedMedia] = useState<"youtube" | "soundcloud" | null>(null);

  useEffect(() => {
    trackFunnelPageView({
      pagePath: "/sunsets",
      eventSlug: JULY_4_EVENT_SLUG,
      source: "sunsets_link_bio",
    });
  }, []);

  return (
    <main className="min-h-[100dvh] w-full overflow-hidden bg-[#050505] text-white/90 font-sans selection:bg-[#F4F0EA]/30">
      <SEO
        title="Chasing Sun(Sets) | Chicago Lakefront House Music"
        description="Official Chasing Sun(Sets) mini hub for first access, tickets, VIP tables, recap video, SoundCloud, gallery, and partner inquiries."
        canonicalPath="/sunsets"
        image="/images/chasing-sunsets-premium.webp"
        absoluteTitle
      />

      <section className="relative flex min-h-[100dvh] flex-col items-center justify-start px-4 py-12 sm:px-6">
        <AmbientFluidBackground />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[480px] z-10"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-[#F4F0EA]/10 bg-[#111111] shadow-[0_0_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
            <ShareButton />
            {/* Subtle top glare */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(58,40,22,0.46)_0%,rgba(17,17,17,0.88)_30%,rgba(17,17,17,0.94)_52%,rgba(25,59,59,0.18)_73%,rgba(17,17,17,0.98)_100%)]" />
            <div className="pointer-events-none absolute left-1/2 top-14 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,210,138,0.26)_0%,rgba(232,184,109,0.13)_30%,rgba(194,112,62,0.09)_50%,transparent_74%)] blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 top-[21rem] h-[30rem] bg-[radial-gradient(ellipse_at_center,rgba(232,184,109,0.13),rgba(58,40,22,0.08)_42%,transparent_72%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(194,112,62,0.18),transparent_65%)]" />
            
            <div className="relative z-10 px-5 pb-8 pt-10 sm:px-8 sm:pb-10 sm:pt-12">
              <header className="text-center">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#F4F0EA]/20 bg-black/60 shadow-[0_0_42px_rgba(232,184,109,0.22)]"
                >
                  <Sun className="h-7 w-7 text-[#FFD28A]" strokeWidth={1} />
                </motion.div>

                <p className="text-[13px] font-sans font-light uppercase tracking-[0.4em] text-[#FFD28A]/80">
                  The Monolith Project Presents
                </p>
                <div className="relative mx-auto mt-4 w-fit max-w-full">
                  <h1 className="bg-gradient-to-b from-white via-[#F4F0EA] to-[#C9B08C] bg-clip-text font-display text-[clamp(2.45rem,10.5vw,4.5rem)] uppercase leading-[0.92] tracking-[-0.035em] text-transparent drop-shadow-[0_0_30px_rgba(232,184,109,0.20)]">
                    Chasing
                    <br />
                    <span className="whitespace-nowrap">Sun(Sets)</span>
                  </h1>
                  <span className="absolute right-0 -top-5 inline-flex items-center gap-1.5 rounded-full border border-[#E8B86D]/30 bg-[#111111]/86 px-2 py-1 text-[8px] font-black uppercase tracking-[0.14em] text-[#FFD28A]/78 backdrop-blur sm:-right-1 sm:top-1 sm:translate-x-1/4">
                    <motion.span
                      animate={{ scale: [1, 1.5, 1], opacity: [0.9, 0.25, 0.9] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      className="h-1.5 w-1.5 rounded-full bg-[#E8B86D]"
                    />
                    Official
                  </span>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.6 }}
                  className="relative mx-auto mt-6 w-full max-w-[280px] sm:max-w-[320px] aspect-[400/463] overflow-hidden rounded-xl border border-[#E8B86D]/35 shadow-[0_0_52px_rgba(232,184,109,0.18),0_18px_48px_rgba(0,0,0,0.48)]"
                >
                  <img
                    src={JULY_4_FIRST_ACCESS_IMAGE}
                    alt="Chasing Sun(Sets) July 4 First Access artwork"
                    className="h-full w-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,210,138,0.34),rgba(232,184,109,0.12)_30%,transparent_58%)] mix-blend-screen opacity-80" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(5,4,3,0.24)_100%)]" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-xl pointer-events-none" />
                </motion.div>

                <p className="mx-auto mt-8 max-w-xs text-sm font-light tracking-[0.1em] uppercase text-[#FFD28A]/90">
                  Watch the sun. Stay for the (sets).
                </p>
                <p className="mx-auto mt-5 max-w-[21rem] text-sm font-light leading-relaxed text-white/50">
                  Join the Chasing Sun(Sets) circle for first access, ticket drops, VIP tables, recap video, sound, gallery, and partner inquiries.
                </p>

                <InlineCaptureForm />
                <FunnelCue />
              </header>

              {/* Signals Grid */}
              <div className="mt-8 grid grid-cols-3 gap-2.5">
                {["Lakefront", "House", "Chicago"].map((item, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    key={item} 
                    className="flex min-h-[68px] flex-col items-center justify-center overflow-hidden rounded-lg border border-[#F4F0EA]/10 bg-[#111111]/70 px-1.5 py-3 transition-colors hover:border-[#F4F0EA]/30 hover:bg-[#F4F0EA]/5"
                  >
                    <p className="text-[9px] font-sans font-light uppercase tracking-[0.16em] text-white/40">
                      Signal
                    </p>
                    <p className="mt-1.5 max-w-full truncate text-[11px] font-display uppercase tracking-[0.04em] text-white/80 sm:text-[12px]">
                      {item}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* July 4th Featured Block */}
              <motion.a
                href={appendAttributionQueryParams(TICKET_HUB_HREF)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => {
                  triggerHaptic(14);
                  trackSunsetsClick({
                    buttonName: "July 4 Tickets",
                    href: appendAttributionQueryParams(TICKET_HUB_HREF),
                    eventSlug: JULY_4_EVENT_SLUG,
                    eventDate: "2026-07-04",
                    interestType: "ticket_click",
                    channel: "Posh",
                  });
                }}
                className="mt-8 group relative block overflow-hidden rounded-[1.4rem] border border-[#F4F0EA]/40 bg-gradient-to-br from-[#F4F0EA]/16 to-black/60 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[#F4F0EA]/70 hover:shadow-[0_15px_40px_rgba(244,240,234,0.18)]"
              >
                <div className="absolute right-0 top-0 h-full w-full bg-[radial-gradient(ellipse_at_top_right,rgba(244,240,234,0.12),transparent_60%)]" />
                <div className="relative z-10 flex items-start justify-between">
                  <div className="min-w-0">
                    <span className="inline-block rounded-full bg-[#F4F0EA] px-2.5 py-1 text-[13px] font-black uppercase tracking-[0.2em] text-black shadow-[0_0_15px_rgba(244,240,234,0.35)]">
                      Next Chapter
                    </span>
                    <h2 className="mt-3 font-display text-3xl uppercase leading-[0.9] tracking-[-0.02em] text-white">
                      July 4th
                      <br />
                      <span className="text-[#F4F0EA]">Open Air</span>
                    </h2>
                    <p className="mt-2 text-sm font-light text-white/70">
                      Castaways, Chicago • 3 PM - 10 PM
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {["Official Hub", "July 4", "Tickets Live Soon"].map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-[#F4F0EA]/14 bg-[#111111]/70 px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-[#F4F0EA]/68"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4F0EA] text-black transition-transform duration-500 group-hover:scale-110">
                    <ArrowUpRight className="h-5 w-5" strokeWidth={2} />
                  </div>
                </div>
                <div className="relative z-10 mt-4 border-t border-white/10 pt-3">
                  <p className="flex items-center gap-2 text-[14px] font-light uppercase tracking-[0.2em] text-[#F4F0EA]">
                    <Sparkles className="h-3 w-3" />
                    Tickets / Schedule Path
                  </p>
                </div>
              </motion.a>

              <div className="mt-5 rounded-[1.25rem] border border-[#F4F0EA]/12 bg-[#111111]/72 p-3">
                <div className="flex items-center justify-between gap-3 px-1 pb-2">
                  <p className="text-[13px] font-sans font-light uppercase tracking-[0.26em] text-[#F4F0EA]/80">
                    2026 Schedule
                  </p>
                  <a
                    href={appendAttributionQueryParams(TICKET_HUB_HREF)}
                    onClick={() => {
                      triggerHaptic(8);
                      trackSunsetsClick({
                        buttonName: "Schedule View",
                        href: appendAttributionQueryParams(TICKET_HUB_HREF),
                        eventSlug: JULY_4_EVENT_SLUG,
                        eventDate: "2026-07-04",
                        interestType: "schedule_view",
                        channel: "Posh",
                      });
                    }}
                    className="inline-flex items-center gap-1 text-[13px] font-black uppercase tracking-[0.16em] text-[#F4F0EA]/82 transition hover:text-[#F4F0EA]"
                  >
                    Tickets
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
                <div className="grid gap-2">
                  {schedule.map((event) => (
                    <a
                      key={event.eventSlug}
                      href={appendAttributionQueryParams(event.href)}
                      onClick={() => {
                        triggerHaptic(8);
                        trackSunsetsClick({
                          buttonName: `${event.date} Schedule`,
                          href: appendAttributionQueryParams(event.href),
                          eventSlug: event.eventSlug,
                          eventDate: event.eventDate,
                          interestType: "schedule_view",
                          channel: "Posh",
                        });
                      }}
                      className="group grid grid-cols-[3.85rem_1fr_auto] items-center gap-3 rounded-xl border border-[#F4F0EA]/8 bg-black/22 px-3 py-3 transition hover:border-[#F4F0EA]/40 hover:bg-[#F4F0EA]/6"
                    >
                      <span className="text-[14px] font-black uppercase tracking-[0.16em] text-[#FFFFFF]">
                        {event.date}
                      </span>
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[14px] font-semibold uppercase leading-snug tracking-[0.06em] text-white/88">
                            {event.title}
                          </span>
                          <span className="rounded-full border border-[#F4F0EA]/12 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-[0.1em] text-[#F4F0EA]/58">
                            {event.status}
                          </span>
                        </span>
                        <span className="mt-1 block text-[13px] leading-snug text-white/45">
                          {event.venue} · {event.time}
                        </span>
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-white/30 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#F4F0EA]" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Links Array */}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((item, index) => {
                  if (item.type === "youtube" || item.type === "soundcloud") {
                    return (
                      <MediaAccordion
                        key={item.label}
                        item={item}
                        index={index}
                        expanded={expandedMedia === item.type}
                        onToggle={() => {
                          triggerHaptic(10);
                          const href = appendAttributionQueryParams(item.href);
                          trackSunsetsClick({ ...item, href });
                          const mediaType = item.type === "youtube" ? "youtube" : "soundcloud";
                          setExpandedMedia((current) => (current === mediaType ? null : mediaType));
                        }}
                      />
                    );
                  }

                  if (item.type === "gallery") {
                    const Icon = item.icon;
                    const href = appendAttributionQueryParams(item.href);
                    return (
                      <motion.a
                        key={item.label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 + index * 0.045, duration: 0.42 }}
                        onClick={() => {
                          triggerHaptic(8);
                          trackSunsetsClick({ ...item, href });
                        }}
                        className="group my-3 block overflow-hidden rounded-[1.2rem] border border-[#F4F0EA]/12 bg-[#111111]/72 shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition hover:-translate-y-0.5 hover:border-[#F4F0EA]/40"
                      >
                        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Icon className="h-3.5 w-3.5 text-[#F4F0EA]" />
                            <span className="text-[13px] font-sans font-light uppercase tracking-[0.2em] text-[#F4F0EA]">
                              {item.eyebrow}
                            </span>
                          </div>
                          <span className="text-[14px] font-display tracking-[0.05em] text-white/60">
                            {item.label}
                          </span>
                        </div>
                        <div className="relative min-h-[156px] overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt=""
                              className="absolute inset-0 h-full w-full object-cover opacity-58 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-72"
                              loading="lazy"
                            />
                          ) : null}
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,4,3,0.18)_0%,rgba(5,4,3,0.88)_100%)]" />
                          <div className="relative flex min-h-[156px] flex-col justify-end p-4">
                            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#F4F0EA] text-[#050403] shadow-[0_0_24px_rgba(244,240,234,0.22)] transition group-hover:scale-105">
                              <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                            </div>
                            <p className="max-w-[15rem] text-sm font-semibold leading-snug text-white/90">
                              {item.sub}
                            </p>
                          </div>
                        </div>
                        <span className="flex items-center justify-between border-t border-white/5 px-4 py-3 text-[14px] font-black uppercase tracking-[0.18em] text-[#F4F0EA]/82 transition group-hover:text-[#F4F0EA]">
                          Open Gallery
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </motion.a>
                    );
                  }

                  return <LinkCard key={item.label} item={item} index={index} />;
                })}
              </div>

              <StickyActionDock />

              {/* Removed Schedule Section */}

              {/* Footer */}
              <footer className="mt-10 pt-4 text-center">
                <SocialUtilityRow />
                <div className="mx-auto mb-4 flex max-w-full w-fit items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-white/[0.02] px-3 py-2 text-[9px] font-sans font-light uppercase tracking-[0.16em] text-white/40 shadow-sm backdrop-blur-md transition-colors hover:border-[#F4F0EA]/30 hover:text-[#F4F0EA]/80 sm:text-[12px] sm:tracking-[0.24em]">
                  <Sparkles className="h-3.5 w-3.5 text-[#F4F0EA]/70" strokeWidth={1.5} />
                  <span className="truncate">monolithproject.com/sunsets</span>
                </div>
                <p className="text-[14px] uppercase font-light tracking-[0.3em] text-white/30">
                  Togetherness is the frequency.
                </p>
                <p className="mt-1.5 text-[14px] uppercase font-light tracking-[0.3em] text-white/30">
                  Music is the guide.
                </p>
              </footer>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
