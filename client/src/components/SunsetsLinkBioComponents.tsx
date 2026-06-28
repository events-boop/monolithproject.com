import { type FormEvent, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  LockKeyhole,
  Mail,
  MapPin,
  Music,
  Phone,
  Play,
  QrCode,
  Radio,
  Send,
  ShieldCheck,
  Ticket,
  Users,
  Waves,
  X,
  type LucideIcon,
} from "lucide-react";
import SEO from "@/components/SEO";
import HoneypotField from "@/components/HoneypotField";
import { Button } from "@/components/ui/button";
import { appendAttributionQueryParams } from "@/lib/attribution";
import {
  submitContactForm,
  submitNewsletterLead,
  trackFunnelPageView,
  trackLeadConversion,
  trackLinkClick,
} from "@/lib/api";
import { trackLakeLead, trackLakePageView } from "@/lib/campaignPixel";
import { buildLeadIdempotencyKey } from "@/lib/leadCapture";
import {
  SUNSETS_2026_SEASON_CHAPTERS,
  SUNSETS_2026_SEASON_PASS,
  SUNSETS_2026_SEASON_PASS_CTA_LABEL,
  SUNSETS_JULY4_ADMISSION_TIERS,
  SUNSETS_JULY4_EVENT_DATE as JULY_4_EVENT_DATE,
  SUNSETS_JULY4_EVENT_SLUG as JULY_4_EVENT_SLUG,
  SUNSETS_JULY4_LINEUP,
  SUNSETS_JULY4_TABLE_MINIMUM,
  SUNSETS_JULY4_TICKET_PATH as TICKET_HREF,
  SUNSETS_JULY4_TOTAL_CAPACITY,
  SUNSETS_TICKET_CTA_LABEL,
  SUNSETS_TICKET_CTA_SUPPORT,
  captureSunsetsTicketCtaClick,
  SUNSETS_PRELAUNCH_LOCKED,
} from "@/lib/sunsetsTicketing";
import { honeypotFieldName } from "@shared/generated/hardening";

type Chapter = {
  title: string;
  date: string;
  place: string;
  status: string;
  action: string;
  eventSlug?: string;
  eventDate?: string;
  href?: string;
};

type TrackableLink = {
  buttonName: string;
  href: string;
  eventSlug?: string;
  eventDate?: string;
  interestType?: string;
  channel?: string;
};

const PAGE_PATH = "/sunsets";
const PAGE_SOURCE = "sunsets_wrapper";
const CANONICAL_SUNSETS_URL = "https://sunsets.vip";
const HERO_IMAGE = "/images/chasing-sunsets-premium.webp";
const OG_IMAGE = "/images/css-2026-og.png";
const SUNSETS_COVER_IMAGE = "/images/css-2026-poster.jpg";
const SUNSETS_QR_IMAGE = "/images/sunsets-vip-sunsets-qr.svg";
const AUTOGRAF_YOUTUBE_EMBED =
  "https://www.youtube.com/embed/9R6XH7JZlJI?start=5506&list=RD9R6XH7JZlJI&rel=0&modestbranding=1";
const SOMMERS_SOUNDCLOUD_URL =
  "https://soundcloud.com/chasing-sun-sets/sommers-uk-ep0011-chapter-1-chasing-sunsets";
const SOMMERS_SOUNDCLOUD_EMBED = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
  SOMMERS_SOUNDCLOUD_URL
)}&color=%23E8B86D&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=true`;

const HERO_SIGNAL_STATS = [
  { label: "Date", value: "July 4", note: "Saturday" },
  { label: "Time", value: "12PM-10PM", note: "12PM doors" },
  { label: "Venue", value: "Castaways", note: "Chicago" },
] as const;

const TICKET_RAIL_STATS = [
  {
    label: "Capacity",
    value: SUNSETS_PRELAUNCH_LOCKED
      ? "Locked"
      : SUNSETS_JULY4_TOTAL_CAPACITY.toLocaleString("en-US"),
    note: SUNSETS_PRELAUNCH_LOCKED ? "revealed at launch" : "guest admissions",
  },
  {
    label: "First Access",
    value: SUNSETS_PRELAUNCH_LOCKED ? "Locked" : "SUNSET26",
    note: SUNSETS_PRELAUNCH_LOCKED ? "Lake List only" : "$30 Lake List code",
  },
  {
    label: "Tables",
    value: SUNSETS_PRELAUNCH_LOCKED
      ? "By request"
      : SUNSETS_JULY4_TABLE_MINIMUM,
    note: "limited cabanas",
  },
] as const;

const FEATURED_TICKET_TIERS = SUNSETS_JULY4_ADMISSION_TIERS.filter(tier =>
  [
    "before-2pm-arrival",
    "first-access-lake-list",
    "ga-tier-1",
    "four-pack-group-bundle",
  ].includes(tier.id)
);

export function triggerHaptic(pattern: number | number[] = 10) {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  navigator.vibrate(pattern);
}

// Placeholder art block — clearly marked so real artwork can be dropped in later.
export function ArtPlaceholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center overflow-hidden border border-dashed border-[#E8B86D]/45 bg-[repeating-linear-gradient(45deg,rgba(97,232,255,0.14)_0,rgba(97,232,255,0.14)_9px,rgba(10,16,36,0.48)_9px,rgba(10,16,36,0.48)_18px)] ${className}`}
    >
      <span className="pointer-events-none px-2 text-center text-[8px] font-black uppercase leading-tight tracking-[0.22em] text-[#d9fbff]">
        ART · {label}
      </span>
    </div>
  );
}

function newEventId() {
  return crypto.randomUUID();
}

export function appendEventAttribution(href: string, eventSlug?: string) {
  const attributedHref = appendAttributionQueryParams(href);
  if (!eventSlug) return attributedHref;

  try {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://monolithproject.com";
    const isAbsolute = /^https?:\/\//i.test(attributedHref);
    const url = new URL(attributedHref, origin);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return attributedHref;
    }

    if (!url.searchParams.has("event_slug")) {
      url.searchParams.set("event_slug", eventSlug);
    }

    if (url.origin === origin && !isAbsolute) {
      return `${url.pathname}${url.search}${url.hash}`;
    }

    return url.toString();
  } catch {
    return attributedHref;
  }
}

export function trackSunsetsClick(item: TrackableLink) {
  if (typeof window === "undefined") return;

  const win = window as Window & {
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
  };

  win.gtag?.("event", "sunsets_wrapper_click", {
    link_label: item.buttonName,
    link_url: item.href,
    page_path: PAGE_PATH,
    event_slug: item.eventSlug,
    interest_type: item.interestType,
  });

  trackLinkClick({
    buttonName: item.buttonName,
    destinationUrl: item.href,
    pagePath: PAGE_PATH,
    eventSlug: item.eventSlug,
    eventDate: item.eventDate,
    interestType: item.interestType,
    channel: item.channel,
    source: PAGE_SOURCE,
  });
}

export function focusLakeList() {
  if (typeof document === "undefined") return;
  const target = document.getElementById("lake-list");
  target?.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function scrollToSection(id: string) {
  if (typeof document === "undefined") return;
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export function LakeListForm() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [honeypotValue, setHoneypotValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();
    if (!normalizedEmail) return;

    setIsSubmitting(true);
    setSubmitError("");
    triggerHaptic(12);

    try {
      await submitNewsletterLead(
        {
          email: normalizedEmail,
          phone: normalizedPhone || undefined,
          consent: true,
          source: "sunsets_lake_list",
          formType: "lake_list_signup",
          funnelId: "chasing-sunsets-wrapper",
          offerId: "lake-list",
          eventInterest: JULY_4_EVENT_SLUG,
          eventSeries: "chasing-sunsets",
          eventTitle: "Chasing Sun(Sets) July 4 2026",
          interestTags: [
            "chasing_sunsets",
            "laylo",
            "laylo_signup",
            "lake_list",
            "first_access_signup",
            "july4_interest",
            "sunsets_wrapper",
          ],
          [honeypotFieldName]: honeypotValue || undefined,
        },
        buildLeadIdempotencyKey(
          "sunsets-lake-list",
          normalizedEmail,
          JULY_4_EVENT_SLUG
        )
      );

      const eventId = newEventId();
      trackLakeLead(eventId);
      trackLeadConversion(eventId, {
        email: normalizedEmail,
        phone: normalizedPhone || undefined,
        eventSourceUrl:
          typeof window !== "undefined" ? window.location.href : undefined,
      });

      trackSunsetsClick({
        buttonName: "Register for First Access",
        href: PAGE_PATH,
        eventSlug: JULY_4_EVENT_SLUG,
        eventDate: JULY_4_EVENT_DATE,
        interestType: "lake_list_signup",
        channel: "CRM",
      });

      setIsSubmitted(true);

      // Browser pixel + CAPI fire-and-forget with keepalive survive the redirect.
      // Brief delay to let the browser pixel serialize before navigation.
      setTimeout(() => {
        window.location.href = "/go/waitlist/chasing-sunsets";
      }, 600);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to register right now. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="border border-[#ff6b8a]/35 bg-[#ff6b8a]/10 p-4 text-sm font-semibold leading-relaxed text-[#ffd0dc]">
        <div className="mb-2 flex items-center gap-2 text-white">
          <Check className="size-4 text-[#ff6b8a]" />
          You are on the Lake List.
        </div>
        First signal arrives soon.
      </div>
    );
  }

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <HoneypotField
        value={honeypotValue}
        onChange={event => setHoneypotValue(event.currentTarget.value)}
      />
      <label className="flex items-center gap-2 bg-white/[0.11] px-3 py-3 text-sm text-stone-300 ring-1 ring-white/10 focus-within:ring-[#ff6b8a]/40">
        <Mail className="size-4 text-[#E8B86D]" />
        <span className="sr-only">Email</span>
        <input
          className="w-full bg-transparent text-base outline-none placeholder:text-stone-400 sm:text-sm"
          placeholder="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={event => setEmail(event.currentTarget.value)}
          required
        />
      </label>
      <label className="flex items-center gap-2 bg-white/[0.11] px-3 py-3 text-sm text-stone-300 ring-1 ring-white/10 focus-within:ring-[#ff6b8a]/40">
        <Phone className="size-4 text-[#E8B86D]" />
        <span className="sr-only">Phone</span>
        <input
          className="w-full bg-transparent text-base outline-none placeholder:text-stone-400 sm:text-sm"
          placeholder="Phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={event => setPhone(event.currentTarget.value)}
        />
      </label>
      <p className="px-1 text-[10px] leading-snug text-stone-400">
        By registering, you agree to receive event updates from The Monolith
        Project / Chasing Sun(Sets). Message rates may apply. You also agree to
        Laylo&apos;s{" "}
        <a
          className="underline underline-offset-2 hover:text-white"
          href="https://laylo.com/terms"
          target="_blank"
          rel="noreferrer"
        >
          Terms
        </a>{" "}
        and{" "}
        <a
          className="underline underline-offset-2 hover:text-white"
          href="https://laylo.com/privacy"
          target="_blank"
          rel="noreferrer"
        >
          Privacy Policy
        </a>
        .
      </p>
      {submitError ? (
        <div
          role="alert"
          className="flex items-start gap-2 border border-red-400/30 bg-red-500/10 p-3 text-xs font-semibold leading-relaxed text-red-100"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {submitError}
        </div>
      ) : null}
      <Button
        className="h-12 w-full bg-[#ff6b8a] text-sm font-black text-black hover:bg-[#ffd0dc] disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        <LockKeyhole className="size-4" />
        {isSubmitting ? "Registering..." : "Register for First Access"}
      </Button>
    </form>
  );
}

export function FeaturedDropSignup() {
  const [email, setEmail] = useState("");
  const [honeypotValue, setHoneypotValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;

    setIsSubmitting(true);
    setSubmitError("");
    triggerHaptic(12);

    try {
      await submitNewsletterLead(
        {
          email: normalizedEmail,
          consent: true,
          source: "sunsets_radio_feature_drops",
          formType: "featured_drop_signup",
          funnelId: "chasing-sunsets-radio",
          offerId: "featured-set-drops",
          eventInterest: JULY_4_EVENT_SLUG,
          eventSeries: "chasing-sunsets",
          eventTitle: "Sun(Sets) Radio Featured Drops",
          interestTags: [
            "chasing_sunsets",
            "laylo",
            "laylo_feature_drop_signup",
            "sunsets_radio_feature_drops",
            "featured_drop_signup",
          ],
          [honeypotFieldName]: honeypotValue || undefined,
        },
        buildLeadIdempotencyKey(
          "sunsets-radio-feature-drops",
          normalizedEmail,
          "featured-drops"
        )
      );

      trackSunsetsClick({
        buttonName: "Sign up for featured set drops",
        href: "#featured-drop",
        eventSlug: JULY_4_EVENT_SLUG,
        eventDate: JULY_4_EVENT_DATE,
        interestType: "sunsets_radio_feature_drops",
        channel: "CRM",
      });

      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to register right now. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="border border-[#ff6b8a]/35 bg-[#ff6b8a]/10 p-3 text-xs font-semibold leading-relaxed text-[#ffd0dc]">
        <div className="mb-1 flex items-center gap-2 text-white">
          <Check className="size-4 text-[#ff6b8a]" />
          You are on the featured drop list.
        </div>
        New selections land here first.
      </div>
    );
  }

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <HoneypotField
        value={honeypotValue}
        onChange={event => setHoneypotValue(event.currentTarget.value)}
      />
      <label className="flex items-center gap-2 bg-white/[0.10] px-3 py-3 text-sm text-stone-300 ring-1 ring-white/10 focus-within:ring-[#E8B86D]/45">
        <Mail className="size-4 text-[#E8B86D]" />
        <span className="sr-only">Email for featured set drops</span>
        <input
          className="w-full bg-transparent text-base outline-none placeholder:text-stone-400 sm:text-sm"
          placeholder="Email for featured set drops"
          type="email"
          autoComplete="email"
          value={email}
          onChange={event => setEmail(event.currentTarget.value)}
          required
        />
      </label>
      {submitError ? (
        <div
          role="alert"
          className="flex items-start gap-2 border border-red-400/30 bg-red-500/10 p-3 text-xs font-semibold leading-relaxed text-red-100"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {submitError}
        </div>
      ) : null}
      <Button
        className="h-12 w-full bg-[#E8B86D] text-xs font-black uppercase tracking-[0.12em] text-black hover:bg-[#d4a574] disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        <Radio className="size-4" />
        {isSubmitting ? "Signing up..." : "Sign up for featured set drops"}
      </Button>
    </form>
  );
}

export function DJSubmissionModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [artistName, setArtistName] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [soundCloudLink, setSoundCloudLink] = useState("");
  const [trackTitle, setTrackTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [isUnreleased, setIsUnreleased] = useState("");
  const [permission, setPermission] = useState("");
  const [honeypotValue, setHoneypotValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  if (!isOpen) return null;

  const resetAndClose = () => {
    setSubmitError("");
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!artistName.trim() || !email.trim() || !soundCloudLink.trim()) {
      setSubmitError("Artist name, email, and SoundCloud link are required.");
      return;
    }
    if (permission !== "yes") {
      setSubmitError("Permission to feature on Sun(Sets) Radio is required.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    triggerHaptic(12);

    try {
      await submitContactForm({
        name: artistName.trim(),
        email: email.trim().toLowerCase(),
        subject: `Sun(Sets) Radio Submission - ${artistName.trim()}`,
        source: "sunsets_radio_submission",
        formType: "sunsets_radio_submission",
        funnelId: "chasing-sunsets-radio",
        interestTags: ["sunsets_radio_submission", "chasing_sunsets"],
        [honeypotFieldName]: honeypotValue || undefined,
        message: `
TAG: sunsets_radio_submission

Artist / DJ name: ${artistName.trim()}
Email: ${email.trim().toLowerCase()}
Instagram: ${instagram.trim() || "Not provided"}
SoundCloud link: ${soundCloudLink.trim()}
Track title: ${trackTitle.trim() || "Not provided"}
Genre: ${genre.trim() || "Not provided"}
Unreleased: ${isUnreleased || "Not specified"}
Permission to feature on Sun(Sets) Radio: ${permission}
        `.trim(),
      });

      trackSunsetsClick({
        buttonName: "DJs submit your track",
        href: "#dj-submit",
        eventSlug: JULY_4_EVENT_SLUG,
        eventDate: JULY_4_EVENT_DATE,
        interestType: "sunsets_radio_submission",
        channel: "Contact",
      });

      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to submit right now. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/75 px-4 py-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sunsets-dj-submit-title"
    >
      <div className="max-h-[92svh] w-full max-w-[460px] overflow-y-auto border border-white/15 bg-[#0a1024] shadow-2xl shadow-black/70">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0a1024]/95 p-4 backdrop-blur">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#E8B86D]">
              Sun(Sets) Radio
            </p>
            <h2
              id="sunsets-dj-submit-title"
              className="mt-1 text-lg font-black text-white"
            >
              DJs - submit your track
            </h2>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="flex h-10 w-10 items-center justify-center border border-white/10 text-stone-300 transition hover:bg-white/10 hover:text-white"
            aria-label="Close submission form"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-4">
          {isSubmitted ? (
            <div className="border border-[#ff6b8a]/35 bg-[#ff6b8a]/10 p-5 text-sm font-semibold leading-relaxed text-[#ffd0dc]">
              <div className="mb-2 flex items-center gap-2 text-white">
                <Check className="size-4 text-[#ff6b8a]" />
                Submission received.
              </div>
              Tagged as sunsets_radio_submission.
              <Button
                className="mt-4 h-11 w-full bg-white text-black hover:bg-stone-200"
                type="button"
                onClick={resetAndClose}
              >
                Back to Sun(Sets)
              </Button>
            </div>
          ) : (
            <form className="space-y-3" onSubmit={handleSubmit}>
              <HoneypotField
                value={honeypotValue}
                onChange={event => setHoneypotValue(event.currentTarget.value)}
              />
              <FormInput
                label="Artist / DJ name"
                value={artistName}
                onChange={setArtistName}
                required
              />
              <FormInput
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                required
              />
              <FormInput
                label="Instagram"
                value={instagram}
                onChange={setInstagram}
                placeholder="@handle"
              />
              <FormInput
                label="SoundCloud link"
                type="url"
                value={soundCloudLink}
                onChange={setSoundCloudLink}
                placeholder="https://soundcloud.com/..."
                required
              />
              <FormInput
                label="Track title"
                value={trackTitle}
                onChange={setTrackTitle}
              />
              <FormInput label="Genre" value={genre} onChange={setGenre} />
              <SelectField
                label="Is this unreleased?"
                value={isUnreleased}
                onChange={setIsUnreleased}
                options={[
                  ["", "Select one"],
                  ["yes", "Yes"],
                  ["no", "No"],
                ]}
              />
              <SelectField
                label="Permission to feature on Sun(Sets) Radio"
                value={permission}
                onChange={setPermission}
                required
                options={[
                  ["", "Select one"],
                  ["yes", "Yes"],
                  ["no", "No"],
                ]}
              />

              {submitError ? (
                <div
                  role="alert"
                  className="flex items-start gap-2 border border-red-400/30 bg-red-500/10 p-3 text-xs font-semibold leading-relaxed text-red-100"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  {submitError}
                </div>
              ) : null}

              <Button
                className="h-12 w-full bg-[#ff6b8a] text-xs font-black uppercase tracking-[0.12em] text-black hover:bg-[#ffd0dc] disabled:opacity-60"
                disabled={isSubmitting}
                type="submit"
              >
                <Send className="size-4" />
                {isSubmitting ? "Submitting..." : "Submit track"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export function FormInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">
        {label}
      </span>
      <input
        className="w-full border border-white/10 bg-white/[0.06] px-3 py-3 text-sm text-white outline-none transition placeholder:text-stone-500 focus:border-[#E8B86D]/50"
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={event => onChange(event.currentTarget.value)}
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">
        {label}
      </span>
      <select
        className="w-full border border-white/10 bg-[#0a0a0a] px-3 py-3 text-sm text-white outline-none transition focus:border-[#E8B86D]/50"
        value={value}
        required={required}
        onChange={event => onChange(event.currentTarget.value)}
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue || optionLabel} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
