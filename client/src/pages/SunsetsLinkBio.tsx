import { type FormEvent, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  Check,
  ChevronRight,
  LockKeyhole,
  Mail,
  MapPin,
  Music,
  Phone,
  Play,
  Radio,
  Send,
  Ticket,
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
  trackLinkClick,
} from "@/lib/api";
import { buildLeadIdempotencyKey } from "@/lib/leadCapture";
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
const JULY_4_EVENT_SLUG = "chasing-sunsets-july-4-2026";
const JULY_4_EVENT_DATE = "2026-07-04";
const TICKET_HREF = "/go/tickets/css-jul04";
const HERO_IMAGE = "/images/chasing-sunsets-premium.webp";
const OG_IMAGE = "/images/chasing-sunsets-july4-first-access.png";
const SUNSETS_COVER_IMAGE = "/images/chasing-sunsets-firstaccess-flyer.png";
const AUTOGRAF_YOUTUBE_EMBED =
  "https://www.youtube.com/embed/9R6XH7JZlJI?start=5506&list=RD9R6XH7JZlJI&rel=0&modestbranding=1";
const SOMMERS_SOUNDCLOUD_URL =
  "https://soundcloud.com/chasing-sun-sets/sommers-uk-ep0011-chapter-1-chasing-sunsets";
const SOMMERS_SOUNDCLOUD_EMBED = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
  SOMMERS_SOUNDCLOUD_URL
)}&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=true`;

function triggerHaptic(pattern: number | number[] = 10) {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  navigator.vibrate(pattern);
}

function appendEventAttribution(href: string, eventSlug?: string) {
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

function trackSunsetsClick(item: TrackableLink) {
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

function focusLakeList() {
  if (typeof document === "undefined") return;
  const target = document.getElementById("lake-list");
  target?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function scrollToSection(id: string) {
  if (typeof document === "undefined") return;
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function LakeListForm() {
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

      trackSunsetsClick({
        buttonName: "Register for First Access",
        href: PAGE_PATH,
        eventSlug: JULY_4_EVENT_SLUG,
        eventDate: JULY_4_EVENT_DATE,
        interestType: "lake_list_signup",
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
      <div className="border border-[#c9e8bd]/35 bg-[#c9e8bd]/10 p-4 text-sm font-semibold leading-relaxed text-[#d8f0ce]">
        <div className="mb-2 flex items-center gap-2 text-white">
          <Check className="size-4 text-[#c9e8bd]" />
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
      <label className="flex items-center gap-2 bg-white/[0.11] px-3 py-3 text-sm text-stone-300 ring-1 ring-white/10 focus-within:ring-[#c9e8bd]/40">
        <Mail className="size-4 text-[#dfc27a]" />
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
      <label className="flex items-center gap-2 bg-white/[0.11] px-3 py-3 text-sm text-stone-300 ring-1 ring-white/10 focus-within:ring-[#c9e8bd]/40">
        <Phone className="size-4 text-[#dfc27a]" />
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
        Project / Chasing Sun(Sets). Message rates may apply. You also agree
        to Laylo&apos;s{" "}
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
        className="h-12 w-full bg-[#c9e8bd] text-sm font-black text-black hover:bg-[#d8f0ce] disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        <LockKeyhole className="size-4" />
        {isSubmitting ? "Registering..." : "Register for First Access"}
      </Button>
    </form>
  );
}

function FeaturedDropSignup() {
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
      <div className="border border-[#c9e8bd]/35 bg-[#c9e8bd]/10 p-3 text-xs font-semibold leading-relaxed text-[#d8f0ce]">
        <div className="mb-1 flex items-center gap-2 text-white">
          <Check className="size-4 text-[#c9e8bd]" />
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
      <label className="flex items-center gap-2 bg-white/[0.10] px-3 py-3 text-sm text-stone-300 ring-1 ring-white/10 focus-within:ring-[#dfc27a]/45">
        <Mail className="size-4 text-[#dfc27a]" />
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
        className="h-12 w-full bg-[#dfc27a] text-xs font-black uppercase tracking-[0.12em] text-black hover:bg-[#efd48d] disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        <Radio className="size-4" />
        {isSubmitting ? "Signing up..." : "Sign up for featured set drops"}
      </Button>
    </form>
  );
}

function DJSubmissionModal({
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
      <div className="max-h-[92svh] w-full max-w-[460px] overflow-y-auto border border-white/15 bg-[#10140f] shadow-2xl shadow-black/70">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#10140f]/95 p-4 backdrop-blur">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#dfc27a]">
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
            <div className="border border-[#c9e8bd]/35 bg-[#c9e8bd]/10 p-5 text-sm font-semibold leading-relaxed text-[#d8f0ce]">
              <div className="mb-2 flex items-center gap-2 text-white">
                <Check className="size-4 text-[#c9e8bd]" />
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
                className="h-12 w-full bg-[#c9e8bd] text-xs font-black uppercase tracking-[0.12em] text-black hover:bg-[#d8f0ce] disabled:opacity-60"
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

function FormInput({
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
        className="w-full border border-white/10 bg-white/[0.06] px-3 py-3 text-sm text-white outline-none transition placeholder:text-stone-500 focus:border-[#dfc27a]/50"
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={event => onChange(event.currentTarget.value)}
      />
    </label>
  );
}

function SelectField({
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
        className="w-full border border-white/10 bg-[#151914] px-3 py-3 text-sm text-white outline-none transition focus:border-[#dfc27a]/50"
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

export default function SunsetsLinkBio() {
  const [isDjModalOpen, setIsDjModalOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
    trackFunnelPageView({
      pagePath: PAGE_PATH,
      eventSlug: JULY_4_EVENT_SLUG,
      source: PAGE_SOURCE,
    });
  }, []);

  const chapters = useMemo<Chapter[]>(
    () => [
      {
        title: "SUN(SETS) I",
        date: "July 4, 2026",
        place: "Castaways - North Ave Beach",
        status: "July 4 access",
        action: "Get Tickets",
        eventSlug: JULY_4_EVENT_SLUG,
        eventDate: JULY_4_EVENT_DATE,
        href: TICKET_HREF,
      },
      {
        title: "SUN(SETS) II",
        date: "Summer 2026",
        place: "Chicago chapter pending",
        status: "Private drop",
        action: "Join Lake List",
      },
      {
        title: "SUN(SETS) III",
        date: "Final chapter",
        place: "Location hidden",
        status: "Signal locked",
        action: "Unlock Later",
      },
    ],
    []
  );

  const ticketHref = appendEventAttribution(TICKET_HREF, JULY_4_EVENT_SLUG);

  return (
    <div className="min-h-screen bg-[#080a07] text-stone-100 selection:bg-[#c9a45d] selection:text-black">
      <SEO
        title="Sun(Sets) Lake List & First Access"
        description="Join the Lake List for Sun(Sets) July 4 ticket access, artist drops, recap video, radio, VIP, and partner inquiries."
        image={OG_IMAGE}
        canonicalPath={PAGE_PATH}
      />

      <div className="fixed inset-0 pointer-events-none">
        <img
          src={HERO_IMAGE}
          alt=""
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,7,0.75)_0%,rgba(8,10,7,0.92)_48%,#080a07_100%)]" />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-[460px] flex-col px-4 py-5 sm:py-8">
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="overflow-hidden border border-[#d8e8c8]/25 bg-[#10140f]/86 shadow-2xl shadow-black/60 backdrop-blur"
        >
          <div className="relative h-[255px] overflow-hidden">
            <img
              src={HERO_IMAGE}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(201,164,93,.28),rgba(20,23,17,.05)_40%,rgba(8,10,7,.35)),linear-gradient(0deg,#10140f_0%,rgba(16,20,15,0)_54%)]" />
            <div className="absolute left-4 top-4 border border-white/20 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur">
              The Monolith Project
            </div>
            <div className="absolute right-4 top-4 border border-[#c9e8bd]/30 bg-[#172015]/75 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#c9e8bd] backdrop-blur">
              Lake List
            </div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="absolute bottom-5 left-5 right-5"
            >
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#dfc27a]">
                <Waves className="size-3.5" />
                Chicago 2026
              </div>
              <h1 className="text-[clamp(3.1rem,16vw,4.3rem)] font-black leading-[0.86] tracking-normal text-white">
                SUN<span className="text-[#dfc27a]">(</span>SETS
                <span className="text-[#dfc27a]">)</span>
              </h1>
              <p className="mt-3 max-w-[330px] text-sm font-medium leading-relaxed text-stone-200/90">
                A full-day open-air chapter of house music, lakefront energy,
                and golden-hour connection.
              </p>
            </motion.div>
          </div>

          <div className="space-y-5 p-5 pt-6">
            <div className="flex flex-wrap gap-2">
              <span className="border border-white/10 bg-white/[.06] px-3 py-1 text-xs font-semibold text-stone-200">
                July 4th, 2026
              </span>
              <span className="border border-white/10 bg-white/[.06] px-3 py-1 text-xs font-semibold text-stone-200">
                Castaways / Chicago Lakefront
              </span>
              <span className="border border-[#c9e8bd]/25 bg-[#c9e8bd]/10 px-3 py-1 text-xs font-semibold text-[#c9e8bd]">
                Lake List
              </span>
            </div>

            <section
              id="lake-list"
              className="border border-white/10 bg-black/22 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black tracking-normal">
                    Join the Lake List
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-stone-300">
                    Artist drops, private codes, ticket releases, and location
                    signals before the public.
                  </p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#c9e8bd] text-black">
                  <LockKeyhole className="size-4.5" />
                </div>
              </div>
              <LakeListForm />
            </section>

            <section className="grid gap-3 pt-1">
              <Button
                type="button"
                className="h-12 w-full bg-[#c9e8bd] text-xs font-black uppercase tracking-[0.12em] text-black hover:bg-[#d8f0ce]"
                onClick={() => {
                  triggerHaptic(8);
                  focusLakeList();
                  trackSunsetsClick({
                    buttonName: "Join the Lake List",
                    href: "#lake-list",
                    eventSlug: JULY_4_EVENT_SLUG,
                    eventDate: JULY_4_EVENT_DATE,
                    interestType: "lake_list_focus",
                    channel: "CRM",
                  });
                }}
              >
                <LockKeyhole className="size-4" />
                Join the Lake List
              </Button>
              <Button
                asChild
                className="h-12 w-full bg-[#dfc27a] text-xs font-black uppercase tracking-[0.12em] text-black hover:bg-[#efd48d]"
              >
                <a
                  href={ticketHref}
                  onClick={() => {
                    triggerHaptic(16);
                    // Primary TicketCTA_Click event — per campaign spec.
                    const win = window as Window & {
                      gtag?: (cmd: string, name: string, params?: Record<string, unknown>) => void;
                    };
                    win.gtag?.("event", "TicketCTA_Click", {
                      event_slug: JULY_4_EVENT_SLUG,
                      source_page: "sunsets.vip",
                      destination: "posh",
                      cta_position: "primary",
                    });
                    trackSunsetsClick({
                      buttonName: "BUY TICKETS — JULY 4",
                      href: ticketHref,
                      eventSlug: JULY_4_EVENT_SLUG,
                      eventDate: JULY_4_EVENT_DATE,
                      interestType: "ticket_click",
                      channel: "Posh",
                    });
                  }}
                >
                  <Ticket className="size-4" />
                  BUY TICKETS — JULY 4
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full border-white/10 bg-white/[.04] text-xs font-black uppercase tracking-[0.12em] text-stone-100 hover:bg-white/[.08]"
                onClick={() => {
                  triggerHaptic(8);
                  scrollToSection("last-chapter");
                  trackSunsetsClick({
                    buttonName: "Watch 2025 Recap",
                    href: "#last-chapter",
                    eventSlug: JULY_4_EVENT_SLUG,
                    eventDate: JULY_4_EVENT_DATE,
                    interestType: "recap_embed_focus",
                    channel: "YouTube",
                  });
                }}
              >
                <Play className="size-4" />
                Watch 2025 Recap
              </Button>
            </section>

            <section
              id="last-chapter"
              className="space-y-3 border border-[#dfc27a]/20 bg-[#dfc27a]/10 p-4"
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#dfc27a]">
                  Recap
                </p>
                <h2 className="mt-1 text-2xl font-black leading-none tracking-normal text-white">
                  WATCH THE LAST CHAPTER
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-stone-300">
                  Autograf returns to the lake for Sun(Sets) 2026. Revisit the
                  energy from the last chapter.
                </p>
              </div>
              <div className="aspect-video overflow-hidden border border-white/10 bg-black">
                <iframe
                  className="h-full w-full"
                  src={AUTOGRAF_YOUTUBE_EMBED}
                  title="Autograf Sun(Sets) July 4 recap"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </section>

            <section className="space-y-3 pt-1">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#dfc27a]">
                  Event / artist teaser
                </p>
                <h3 className="mt-1 text-xl font-black tracking-normal text-white">
                  Upcoming Chapters
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-stone-300">
                  SUN(SETS) returns to Castaways with July 4 first access,
                  private summer drops, and radio-led artist signals.
                </p>
              </div>

              {chapters.map((chapter, index) => {
                const Icon = index === 0 ? Ticket : Calendar;
                const chapterHref = chapter.href
                  ? appendEventAttribution(chapter.href, chapter.eventSlug)
                  : undefined;

                return (
                  <motion.div
                    key={chapter.title}
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.1 * index + 0.15,
                      duration: 0.45,
                    }}
                  >
                    {chapterHref ? (
                      <a
                        href={chapterHref}
                        onClick={() => {
                          triggerHaptic(12);
                          trackSunsetsClick({
                            buttonName: chapter.action,
                            href: chapterHref,
                            eventSlug: chapter.eventSlug,
                            eventDate: chapter.eventDate,
                            interestType: "chapter_ticket_click",
                            channel: "Posh",
                          });
                        }}
                        className="group block border border-white/10 bg-white/[.055] p-4 transition hover:border-[#dfc27a]/35 hover:bg-white/[.075]"
                      >
                        <ChapterContent
                          chapter={chapter}
                          icon={Icon}
                          isLinked
                        />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic(8);
                          focusLakeList();
                          trackSunsetsClick({
                            buttonName: chapter.action,
                            href: "#lake-list",
                            interestType: "lake_list_focus",
                            channel: "CRM",
                          });
                        }}
                        className="group block w-full border border-white/10 bg-white/[.055] p-4 text-left transition hover:border-[#dfc27a]/35 hover:bg-white/[.075]"
                      >
                        <ChapterContent
                          chapter={chapter}
                          icon={Icon}
                          isLinked
                        />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </section>

            <section className="border border-[#dfc27a]/20 bg-[#dfc27a]/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#dfc27a]">
                    Official short link
                  </p>
                  <p className="mt-1 truncate text-sm font-bold text-white">
                    sunsets.vip
                  </p>
                </div>
                <Button
                  asChild
                  className="h-10 shrink-0 bg-white px-3 text-black hover:bg-stone-200"
                >
                  <a
                    href="/partners"
                    onClick={() =>
                      trackSunsetsClick({
                        buttonName: "Partner Inquiry",
                        href: "/partners",
                        eventSlug: JULY_4_EVENT_SLUG,
                        eventDate: JULY_4_EVENT_DATE,
                        interestType: "partner_inquiry_click",
                        channel: "Monolith",
                      })
                    }
                  >
                    Partners
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </Button>
              </div>
            </section>

            <section
              id="featured-drop"
              className="space-y-4 border border-white/10 bg-black/24 p-4"
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#dfc27a]">
                  SUN(SETS) RADIO — FEATURED DROP
                </p>
                <h2 className="mt-1 text-xl font-black tracking-normal text-white">
                  Sommers UK
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-300">
                  Sommers UK featured SoundCloud selection.
                </p>
              </div>
              <div className="overflow-hidden border border-white/10 bg-black">
                <iframe
                  title="Sommers UK featured SoundCloud selection"
                  className="h-[300px] w-full"
                  scrolling="no"
                  frameBorder="no"
                  allow="autoplay"
                  src={SOMMERS_SOUNDCLOUD_EMBED}
                />
              </div>
              <img
                src={SUNSETS_COVER_IMAGE}
                alt="Sun(Sets) featured drop cover artwork"
                className="w-full border border-white/10 object-cover"
                loading="lazy"
              />
              <FeaturedDropSignup />
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full border-white/10 bg-white/[.04] text-xs font-black uppercase tracking-[0.12em] text-stone-100 hover:bg-white/[.08]"
                onClick={() => {
                  triggerHaptic(8);
                  setIsDjModalOpen(true);
                  trackSunsetsClick({
                    buttonName: "DJs - submit your track",
                    href: "#dj-submit",
                    eventSlug: JULY_4_EVENT_SLUG,
                    eventDate: JULY_4_EVENT_DATE,
                    interestType: "sunsets_radio_submission_open",
                    channel: "Contact",
                  });
                }}
              >
                <Music className="size-4" />
                DJs — submit your track
              </Button>
            </section>

            <footer className="pb-1 pt-2 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                Togetherness is the frequency.
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                Music is the guide.
              </p>
            </footer>
          </div>
        </motion.section>
        <DJSubmissionModal
          isOpen={isDjModalOpen}
          onClose={() => setIsDjModalOpen(false)}
        />
      </main>
    </div>
  );
}

function ChapterContent({
  chapter,
  icon: Icon,
  isLinked,
}: {
  chapter: Chapter;
  icon: LucideIcon;
  isLinked?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-white/[.10] text-[#d8f0ce]">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="text-base font-black tracking-normal text-white">
              {chapter.title}
            </h4>
            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-stone-300">
              <Calendar className="size-3.5 shrink-0" />
              {chapter.date}
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs text-stone-400">
              <MapPin className="size-3.5 shrink-0" />
              {chapter.place}
            </p>
          </div>
          {isLinked ? (
            <ChevronRight className="mt-1 size-4.5 shrink-0 text-stone-500 transition group-hover:translate-x-1 group-hover:text-[#dfc27a]" />
          ) : null}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="bg-black/25 px-2.5 py-1 text-[11px] font-bold text-stone-300">
            {chapter.status}
          </span>
          <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[#dfc27a]">
            {chapter.action}
          </span>
        </div>
      </div>
    </div>
  );
}
