import { zodResolver } from "@hookform/resolvers/zod";
import { honeypotFieldName } from "@shared/generated/hardening";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Camera,
  CheckCircle2,
  Clock3,
  Handshake,
  Headphones,
  Info,
  Music2,
  Send,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
  X,
} from "lucide-react";
import {
  CSSProperties,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import HoneypotField from "@/components/HoneypotField";
import MagneticButton from "@/components/MagneticButton";
import RevealText from "@/components/RevealText";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useInquiry, type InquiryType } from "@/contexts/InquiryContext";
import {
  submitBookingInquiry,
  submitContactForm,
  type BookingInquiryPayload,
} from "@/lib/api";
import { cn } from "@/lib/utils";

type InquiryFormValues = {
  name: string;
  email: string;
  organization?: string;
  location?: string;
  subject?: string;
  streamLink?: string;
  message: string;
  [honeypotFieldName]?: string;
};

type InquirySubmissionResult = {
  requestId?: string;
  message?: string;
  deliveryState?: string;
};

type InquiryRouteConfig =
  | {
      kind: "booking";
      bookingType: BookingInquiryPayload["type"];
      entityFallback: string;
    }
  | {
      kind: "contact";
      subjectFallback: string;
    };

interface InquiryPortalConfig {
  eyebrow: string;
  title: string;
  desktopTitle?: string;
  description: string;
  submitLabel: string;
  successLabel: string;
  successDescription: string;
  replyWindow: string;
  accent: string;
  glow: string;
  accentSoft: string;
  icon: LucideIcon;
  highlights: string[];
  route: InquiryRouteConfig;
  organizationLabel: string;
  organizationPlaceholder: string;
  organizationHint: string;
  requireOrganization?: boolean;
  locationLabel?: string;
  locationPlaceholder?: string;
  locationHint?: string;
  requireLocation?: boolean;
  subjectLabel?: string;
  subjectPlaceholder?: string;
  subjectHint?: string;
  requireSubject?: boolean;
  streamLabel?: string;
  streamPlaceholder?: string;
  streamHint?: string;
  requireStreamLink?: boolean;
  messageLabel: string;
  messagePlaceholder: string;
  messageHint: string;
}

const portalConfigs: Record<InquiryType, InquiryPortalConfig> = {
  sponsor: {
    eyebrow: "Strategic Partnerships",
    title: "Partnership Inquiry",
    desktopTitle: "Build The Activation",
    description:
      "Bring us the audience, product, or energy you want to activate around. We route brand-fit opportunities into the production queue with context intact.",
    submitLabel: "Send Partnership Brief",
    successLabel: "We Got You",
    successDescription:
      "Your activation request is in the partnership queue. If the fit is there, the Monolith team will come back with next-step logistics.",
    replyWindow: "24-48h review",
    accent: "#E8B86D",
    glow: "rgba(232, 184, 109, 0.42)",
    accentSoft: "rgba(232, 184, 109, 0.16)",
    icon: Handshake,
    highlights: [
      "Brand fit review",
      "Experiential activations",
      "Production-ready intake",
    ],
    route: {
      kind: "booking",
      bookingType: "sponsorship",
      entityFallback: "Brand Partnership Inquiry",
    },
    organizationLabel: "Brand / Organization",
    organizationPlaceholder: "Studio, label, beverage partner, agency...",
    organizationHint: "Who is making the request?",
    requireOrganization: true,
    messageLabel: "Partnership Goals",
    messagePlaceholder:
      "Tell us what you want to launch, who you want to reach, and what success looks like.",
    messageHint:
      "Include event timing, deliverables, and any activation constraints.",
  },
  venue: {
    eyebrow: "Venue Collaboration",
    title: "Venue Inquiry",
    desktopTitle: "Host The Project",
    description:
      "Send the essentials on your property, market, and operating constraints. We will review the space against production needs and creative fit.",
    submitLabel: "Submit Venue Details",
    successLabel: "We Got You",
    successDescription:
      "The space has been logged for review. If it aligns with the project, operations will follow up with availability and fit questions.",
    replyWindow: "48h routing",
    accent: "#7DD3FC",
    glow: "rgba(125, 211, 252, 0.35)",
    accentSoft: "rgba(125, 211, 252, 0.14)",
    icon: Building2,
    highlights: [
      "Production logistics",
      "Footprint review",
      "On-site partnership path",
    ],
    route: {
      kind: "booking",
      bookingType: "partner-on-location",
      entityFallback: "Venue Collaboration Inquiry",
    },
    organizationLabel: "Venue / Property",
    organizationPlaceholder: "Warehouse, rooftop, resort, club...",
    organizationHint: "Name the space or operating group.",
    requireOrganization: true,
    locationLabel: "City / Neighborhood",
    locationPlaceholder: "Chicago, Fulton Market",
    locationHint: "Ground the space geographically.",
    requireLocation: true,
    messageLabel: "Venue Notes",
    messagePlaceholder:
      "Capacity, vibe, preferred dates, operating limitations, and anything we should know before a scout.",
    messageHint:
      "The sharper the operational details, the faster the evaluation.",
  },
  artist: {
    eyebrow: "Artist Intake",
    title: "Artist Submission",
    desktopTitle: "Submit Your Sound",
    description:
      "This route is for DJs, collectives, and live performers who can translate the Monolith atmosphere in a room. Send the strongest proof first.",
    submitLabel: "Send Artist Submission",
    successLabel: "Artist Submission Received",
    successDescription:
      "The submission has been routed to the booking desk. If the sound aligns, the team will reach out for context, dates, or a deeper listen.",
    replyWindow: "Rolling review",
    accent: "#C084FC",
    glow: "rgba(192, 132, 252, 0.36)",
    accentSoft: "rgba(192, 132, 252, 0.14)",
    icon: Music2,
    highlights: [
      "Mix link required",
      "Booking desk routing",
      "Talent-fit review",
    ],
    route: {
      kind: "booking",
      bookingType: "artist-booking",
      entityFallback: "Artist Submission",
    },
    organizationLabel: "Artist / Collective",
    organizationPlaceholder: "Stage name, duo, collective, or live act",
    organizationHint: "Name the act exactly how you want it referenced.",
    requireOrganization: true,
    streamLabel: "Streaming / Mix Link",
    streamPlaceholder:
      "https://soundcloud.com/..., Spotify, Mixcloud, YouTube...",
    streamHint: "Use your strongest public or private set link.",
    requireStreamLink: true,
    messageLabel: "Why You Fit",
    messagePlaceholder:
      "Residency history, markets played, sonic lane, and what makes your set right for this world.",
    messageHint: "A concise proof-of-fit note beats a generic bio.",
  },
  press: {
    eyebrow: "Media Desk",
    title: "Press Access",
    desktopTitle: "Request Media Access",
    description:
      "Editorial, press, photo, and content requests go through the media desk. We need enough context to route assets or credentials cleanly.",
    submitLabel: "Send Press Request",
    successLabel: "Press Request Logged",
    successDescription:
      "Your media request is now in the contact queue. The team will reply if credentials, assets, or follow-up materials are approved.",
    replyWindow: "24-72h reply",
    accent: "#93C5FD",
    glow: "rgba(147, 197, 253, 0.34)",
    accentSoft: "rgba(147, 197, 253, 0.14)",
    icon: Camera,
    highlights: [
      "Editorial routing",
      "Credential requests",
      "Asset delivery support",
    ],
    route: {
      kind: "contact",
      subjectFallback: "Media & Press Access",
    },
    organizationLabel: "Outlet / Publication",
    organizationPlaceholder: "Magazine, creator channel, press outlet...",
    organizationHint: "Optional, but useful for routing.",
    messageLabel: "Request Details",
    messagePlaceholder:
      "Tell us the event, story angle, assets needed, deadlines, and audience.",
    messageHint:
      "Include deliverable deadlines or credential counts if relevant.",
  },
  general: {
    eyebrow: "Office Contact",
    title: "General Inquiry",
    desktopTitle: "Reach The Office",
    description:
      "For questions that do not belong in tickets, booking, or a formal partner intake. This route lands in the general contact pipeline.",
    submitLabel: "Send Message",
    successLabel: "Message Received",
    successDescription:
      "Your note is in the office queue. If it needs a reply or redirect, the team will come back with the right next step.",
    replyWindow: "Office review",
    accent: "#F97316",
    glow: "rgba(249, 115, 22, 0.36)",
    accentSoft: "rgba(249, 115, 22, 0.15)",
    icon: Info,
    highlights: [
      "General operations",
      "Manual routing",
      "Direct office intake",
    ],
    route: {
      kind: "contact",
      subjectFallback: "General Inquiry",
    },
    organizationLabel: "Organization / Project",
    organizationPlaceholder: "Optional context",
    organizationHint: "Optional, but it helps us route the note faster.",
    subjectLabel: "Subject",
    subjectPlaceholder: "What is this about?",
    subjectHint: "Use a clear topic line.",
    requireSubject: true,
    messageLabel: "Message",
    messagePlaceholder:
      "Tell us what you need, with dates or links if relevant.",
    messageHint: "If this belongs to booking or press, say so explicitly.",
  },
  booking: {
    eyebrow: "Private Events",
    title: "Private Event Booking",
    desktopTitle: "Book The Experience",
    description:
      "Use this route for private clients, brand events, and custom Monolith-managed experiences. We need timing, city, and a sharp brief.",
    submitLabel: "Request Event Booking",
    successLabel: "Booking Request Received",
    successDescription:
      "The booking desk now has your request. If the scope aligns, the team will follow up with availability, pricing, or production questions.",
    replyWindow: "Priority routing",
    accent: "#FB7185",
    glow: "rgba(251, 113, 133, 0.36)",
    accentSoft: "rgba(251, 113, 133, 0.14)",
    icon: Headphones,
    highlights: ["Private clients", "Custom production", "Booking desk intake"],
    route: {
      kind: "booking",
      bookingType: "general",
      entityFallback: "Private Event Booking",
    },
    organizationLabel: "Client / Brand / Occasion",
    organizationPlaceholder: "Brand event, birthday, launch, private client...",
    organizationHint: "Who is hosting or commissioning the event?",
    requireOrganization: true,
    locationLabel: "City / Venue",
    locationPlaceholder: "Chicago, Miami, Tulum, or venue name",
    locationHint: "Add the market or confirmed venue if you have it.",
    messageLabel: "Event Brief",
    messagePlaceholder:
      "Share the event type, date window, guest count, music direction, and any production expectations.",
    messageHint: "This is the fastest way to get a useful follow-up.",
  },
};

function getInquiryDefaults(type: InquiryType): InquiryFormValues {
  const config = portalConfigs[type];
  return {
    name: "",
    email: "",
    organization: "",
    location: "",
    subject:
      config.route.kind === "contact" && !config.requireSubject
        ? config.route.subjectFallback
        : "",
    streamLink: "",
    message: "",
    [honeypotFieldName]: "",
  };
}

function buildInquirySchema(type: InquiryType) {
  const config = portalConfigs[type];

  return z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Name is required")
        .max(120, "Name is too long"),
      email: z
        .string()
        .trim()
        .email("Enter a valid email address")
        .max(320, "Email is too long"),
      organization: z
        .string()
        .trim()
        .max(160, "Organization is too long")
        .optional(),
      location: z.string().trim().max(180, "Location is too long").optional(),
      subject: z.string().trim().max(200, "Subject is too long").optional(),
      streamLink: z.string().trim().max(500, "Link is too long").optional(),
      message: z
        .string()
        .trim()
        .min(12, "Please provide more detail")
        .max(5000, "Message is too long"),
      [honeypotFieldName]: z.string().optional(),
    })
    .superRefine((values, ctx) => {
      if (config.requireOrganization && !values.organization?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["organization"],
          message: `${config.organizationLabel} is required`,
        });
      }

      if (config.requireLocation && !values.location?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["location"],
          message: `${config.locationLabel || "Location"} is required`,
        });
      }

      if (config.requireSubject && !values.subject?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["subject"],
          message: `${config.subjectLabel || "Subject"} is required`,
        });
      }

      if (config.requireStreamLink) {
        const link = values.streamLink?.trim();
        if (!link) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["streamLink"],
            message: `${config.streamLabel || "Streaming link"} is required`,
          });
        } else if (!isValidUrl(link)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["streamLink"],
            message: "Enter a valid URL",
          });
        }
      }
    });
}

function buildInquiryMessage(type: InquiryType, values: InquiryFormValues) {
  const config = portalConfigs[type];
  const organization = values.organization?.trim() || "";
  const location = values.location?.trim() || "";
  const streamLink = values.streamLink?.trim() || "";
  const lines = [`Inquiry type: ${config.title}`];

  if (organization) {
    lines.push(`${config.organizationLabel}: ${organization}`);
  }

  if (location) {
    lines.push(`${config.locationLabel || "Location"}: ${location}`);
  }

  if (streamLink) {
    lines.push(`${config.streamLabel || "Streaming link"}: ${streamLink}`);
  }

  lines.push("", values.message.trim());

  return lines.join("\n");
}

async function submitInquiry(
  type: InquiryType,
  values: InquiryFormValues
): Promise<InquirySubmissionResult> {
  const config = portalConfigs[type];

  if (config.route.kind === "booking") {
    return submitBookingInquiry({
      name: values.name.trim(),
      email: values.email.trim(),
      entity: values.organization?.trim() || config.route.entityFallback,
      type: config.route.bookingType,
      location: values.location?.trim() || undefined,
      message: buildInquiryMessage(type, values),
      [honeypotFieldName]: values[honeypotFieldName]?.trim() || undefined,
    });
  }

  return submitContactForm({
    name: values.name.trim(),
    email: values.email.trim(),
    subject: values.subject?.trim() || config.route.subjectFallback,
    message: buildInquiryMessage(type, values),
    [honeypotFieldName]: values[honeypotFieldName]?.trim() || undefined,
  });
}

export default function InquiryPortal() {
  const { isOpen, type, closeInquiry } = useInquiry();
  const [submission, setSubmission] = useState<InquirySubmissionResult | null>(
    null
  );
  const [submitError, setSubmitError] = useState("");
  const config = portalConfigs[type];
  const schema = useMemo(() => buildInquirySchema(type), [type]);
  const defaults = useMemo(() => getInquiryDefaults(type), [type]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    setSubmission(null);
    setSubmitError("");
    reset(defaults);

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeInquiry();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [closeInquiry, defaults, isOpen, reset, type]);

  const onSubmit = async (values: InquiryFormValues) => {
    setSubmitError("");
    try {
      const response = await submitInquiry(type, values);
      setSubmission(response);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to submit inquiry right now."
      );
    }
  };

  const surfaceStyle = {
    "--portal-accent": config.accent,
    "--portal-accent-soft": config.accentSoft,
    "--portal-glow": config.glow,
  } as CSSProperties;

  const auxiliaryFields = [
    config.subjectLabel || config.requireSubject ? "subject" : null,
    config.locationLabel ? "location" : null,
    config.streamLabel || config.requireStreamLink ? "stream" : null,
  ].filter(Boolean) as Array<"subject" | "location" | "stream">;

  const renderAuxiliaryField = (field: "subject" | "location" | "stream") => {
    if (field === "subject") {
      return (
        <PortalField
          label={config.subjectLabel || "Subject"}
          hint={config.subjectHint || "Topic line"}
          error={errors.subject?.message}
          required={Boolean(config.requireSubject)}
        >
          <Input
            {...register("subject")}
            autoComplete="off"
            placeholder={config.subjectPlaceholder || "Topic"}
            aria-invalid={Boolean(errors.subject)}
            className={portalInputClass}
          />
        </PortalField>
      );
    }

    if (field === "location") {
      return (
        <PortalField
          label={config.locationLabel || "Location"}
          hint={config.locationHint || "Optional context"}
          error={errors.location?.message}
          required={Boolean(config.requireLocation)}
        >
          <Input
            {...register("location")}
            autoComplete="off"
            placeholder={config.locationPlaceholder || "Location"}
            aria-invalid={Boolean(errors.location)}
            className={portalInputClass}
          />
        </PortalField>
      );
    }

    return (
      <PortalField
        label={config.streamLabel || "Streaming link"}
        hint={config.streamHint || "Public or private URL"}
        error={errors.streamLink?.message}
        required={Boolean(config.requireStreamLink)}
      >
        <Input
          {...register("streamLink")}
          autoComplete="off"
          placeholder={config.streamPlaceholder || "https://..."}
          aria-invalid={Boolean(errors.streamLink)}
          className={portalInputClass}
        />
      </PortalField>
    );
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[100] overflow-hidden px-0 py-0 md:px-6 md:py-6 lg:px-10 lg:py-8">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeInquiry}
            aria-label="Close inquiry portal"
            className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),linear-gradient(135deg,rgba(5,5,5,0.82),rgba(2,2,2,0.96))] backdrop-blur-2xl"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-portal-title"
            initial={{ opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.99 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="relative ml-auto flex h-full w-full max-w-[1080px] overflow-hidden border border-white/10 bg-[#050505]/95 text-white shadow-[0_38px_120px_rgba(0,0,0,0.58)] md:rounded-[2rem]"
            style={surfaceStyle}
          >
            <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.05),transparent_32%),radial-gradient(circle_at_top_right,var(--portal-accent-soft),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.04),transparent_24%)]" />
            <div
              className="pointer-events-none absolute right-[-6rem] top-[-5rem] h-56 w-56 rounded-full blur-[110px]"
              style={{ backgroundColor: config.glow }}
            />
            <div
              className="pointer-events-none absolute left-[-4rem] bottom-[-5rem] h-48 w-48 rounded-full blur-[120px]"
              style={{ backgroundColor: config.accentSoft }}
            />
            <div className="pointer-events-none absolute inset-y-0 left-[44%] hidden w-px bg-gradient-to-b from-transparent via-white/10 to-transparent lg:block" />

            <div className="relative grid h-full w-full lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
              <section className="relative flex min-h-[17rem] flex-col justify-between overflow-hidden border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:p-10 xl:p-12">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_52%)]" />
                <div className="absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent sm:inset-x-8 lg:inset-x-10 xl:inset-x-12" />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 shadow-[0_10px_34px_rgba(0,0,0,0.28)]">
                    <span
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/25"
                      style={{ boxShadow: `0 0 32px ${config.glow}` }}
                    >
                      <config.icon
                        className="h-4 w-4"
                        style={{ color: config.accent }}
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                        Monolith Office
                      </p>
                      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/80">
                        {config.eyebrow}
                      </p>
                    </div>
                  </div>

                  <MagneticButton strength={0.16}>
                    <button
                      type="button"
                      onClick={closeInquiry}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                      aria-label="Close inquiry portal"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </MagneticButton>
                </div>

                <div className="relative mt-10 max-w-xl">
                  <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em] text-white/40">
                    Direct Route To The Office
                  </p>
                  <h2
                    id="inquiry-portal-title"
                    className="font-display text-[clamp(2.8rem,8vw,5.8rem)] uppercase leading-[0.88] tracking-[-0.04em] text-white"
                  >
                    {config.desktopTitle || config.title}
                  </h2>
                  <RevealText
                    as="p"
                    className="mt-5 max-w-lg text-[1.02rem] leading-relaxed text-white/60 md:text-[1.08rem]"
                  >
                    {config.description}
                  </RevealText>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <SignalChip icon={ShieldCheck} label="Protected route" />
                    <SignalChip icon={Clock3} label={config.replyWindow} />
                    <SignalChip icon={Sparkles} label="Human review" />
                  </div>
                </div>

                <div className="relative mt-10 grid gap-3 sm:grid-cols-3">
                  {config.highlights.map(highlight => (
                    <motion.div
                      key={highlight}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      className="rounded-[1.25rem] border border-white/10 bg-black/20 px-4 py-4 backdrop-blur-sm"
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                        Scope
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-white/80">
                        {highlight}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section className="relative flex min-h-0 flex-col">
                <div className="sticky top-0 z-10 border-b border-white/10 bg-[linear-gradient(180deg,rgba(5,5,5,0.95),rgba(5,5,5,0.82))] px-6 py-5 backdrop-blur-xl sm:px-8 lg:px-10 xl:px-12">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                        What We Need
                      </p>
                      <p className="mt-1 text-sm text-white/60">
                        Fill what's relevant. Skip what isn't. A real person reviews every note.
                      </p>
                    </div>
                    <div
                      className="rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/70"
                      style={{
                        borderColor: config.accentSoft,
                        backgroundColor: "rgba(255,255,255,0.03)",
                      }}
                    >
                      {config.title}
                    </div>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 pt-6 sm:px-8 lg:px-10 xl:px-12">
                  {submission ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex min-h-full flex-col justify-center py-10"
                    >
                      <div className="max-w-xl rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-7 shadow-[0_24px_70px_rgba(0,0,0,0.26)] sm:p-9">
                        <div
                          className="inline-flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-black/20"
                          style={{ boxShadow: `0 0 40px ${config.glow}` }}
                        >
                          <CheckCircle2
                            className="h-7 w-7"
                            style={{ color: config.accent }}
                          />
                        </div>

                        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                          You're In
                        </p>
                        <h3 className="mt-3 font-display text-4xl uppercase leading-none tracking-[-0.04em] text-white">
                          {config.successLabel}
                        </h3>
                        <p className="mt-4 max-w-lg text-base leading-relaxed text-white/60">
                          {submission.message || config.successDescription}
                        </p>

                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                          <SuccessMeta
                            label="Delivery state"
                            value={
                              submission.deliveryState === "queued"
                                ? "Queued for follow-up"
                                : "Delivered"
                            }
                          />
                          <SuccessMeta
                            label="Request ID"
                            value={
                              submission.requestId
                                ? submission.requestId.slice(0, 8).toUpperCase()
                                : "Issued"
                            }
                          />
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setSubmission(null);
                              setSubmitError("");
                              reset(defaults);
                            }}
                            className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-white/10 px-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                          >
                            Send Another
                          </button>
                          <button
                            type="button"
                            onClick={closeInquiry}
                            className="inline-flex min-h-[46px] items-center justify-center rounded-full px-5 text-[11px] font-bold uppercase tracking-[0.2em] text-black transition-transform hover:scale-[1.01]"
                            style={{ backgroundColor: config.accent }}
                          >
                            Close Portal
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="mx-auto max-w-2xl space-y-7"
                    >
                      <HoneypotField {...register(honeypotFieldName)} />

                      <div className="grid gap-5 md:grid-cols-2">
                        <PortalField
                          label="Full Name"
                          hint="Who should we reply to?"
                          error={errors.name?.message}
                          required
                        >
                          <Input
                            {...register("name")}
                            autoComplete="name"
                            placeholder="Alex Rivera"
                            aria-invalid={Boolean(errors.name)}
                            className={portalInputClass}
                          />
                        </PortalField>

                        <PortalField
                          label="Email Address"
                          hint="We use this for follow-up only."
                          error={errors.email?.message}
                          required
                        >
                          <Input
                            {...register("email")}
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            placeholder="alex@frequency.com"
                            aria-invalid={Boolean(errors.email)}
                            className={portalInputClass}
                          />
                        </PortalField>
                      </div>

                      <div className="grid gap-5 md:grid-cols-2">
                        <PortalField
                          label={config.organizationLabel}
                          hint={config.organizationHint}
                          error={errors.organization?.message}
                          required={Boolean(config.requireOrganization)}
                        >
                          <Input
                            {...register("organization")}
                            autoComplete="organization"
                            placeholder={config.organizationPlaceholder}
                            aria-invalid={Boolean(errors.organization)}
                            className={portalInputClass}
                          />
                        </PortalField>

                        {auxiliaryFields[0] ? (
                          renderAuxiliaryField(auxiliaryFields[0])
                        ) : (
                          <AccentNote config={config} />
                        )}
                      </div>

                      {auxiliaryFields.length > 1 ? (
                        <div className="grid gap-5 md:grid-cols-2">
                          {renderAuxiliaryField(auxiliaryFields[1])}
                          {auxiliaryFields[2] ? (
                            renderAuxiliaryField(auxiliaryFields[2])
                          ) : (
                            <AccentNote config={config} />
                          )}
                        </div>
                      ) : null}

                      <PortalField
                        label={config.messageLabel}
                        hint={config.messageHint}
                        error={errors.message?.message}
                        required
                      >
                        <Textarea
                          {...register("message")}
                          rows={7}
                          placeholder={config.messagePlaceholder}
                          aria-invalid={Boolean(errors.message)}
                          className={cn(
                            portalInputClass,
                            "min-h-[190px] resize-y py-4"
                          )}
                        />
                      </PortalField>

                      {submitError ? (
                        <div className="rounded-3xl border border-red-500/30 bg-red-500/8 px-4 py-3 text-sm text-red-100 shadow-[0_12px_40px_rgba(120,0,0,0.16)]">
                          <p className="flex items-start gap-2.5">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>{submitError}</span>
                          </p>
                        </div>
                      ) : null}

                      <div className="flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="max-w-md text-sm leading-relaxed text-white/50">
                          Your note lands directly with the Monolith office.
                          No auto-replies — a real person reviews every submission.
                        </p>

                        <MagneticButton strength={0.12}>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex min-h-[54px] items-center justify-center gap-3 rounded-full px-6 text-[11px] font-black uppercase tracking-[0.25em] text-black transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                            style={{
                              backgroundColor: config.accent,
                              boxShadow: `0 18px 48px ${config.glow}`,
                            }}
                          >
                            {isSubmitting ? (
                              <>
                                <span className="h-2 w-2 animate-pulse rounded-full bg-black/70" />
                                Transmitting
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4" />
                                {config.submitLabel}
                                <ArrowRight className="h-4 w-4" />
                              </>
                            )}
                          </button>
                        </MagneticButton>
                      </div>
                    </form>
                  )}
                </div>
              </section>
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

const portalInputClass =
  "min-h-[54px] rounded-3xl border-white/10 bg-white/[0.04] px-4 text-[15px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm placeholder:text-white/20 focus-visible:border-white/20 focus-visible:ring-[3px] focus-visible:ring-white/8";

function SignalChip({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
      <Icon className="h-3.5 w-3.5 text-white/70" />
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
        {label}
      </span>
    </div>
  );
}

function SuccessMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
        {label}
      </p>
      <p className="mt-2 text-sm text-white/80">{value}</p>
    </div>
  );
}

function AccentNote({ config }: { config: InquiryPortalConfig }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/60">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">
        Where This Goes
      </p>
      <p className="mt-2 leading-relaxed">
        This note lands in the{" "}
        <span style={{ color: config.accent }}>{config.title}</span> queue, reviewed on its own cadence.
      </p>
    </div>
  );
}

function PortalField({
  children,
  label,
  hint,
  error,
  required = false,
}: {
  children: ReactNode;
  label: string;
  hint: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-4">
        <label className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
          {label}
          {required ? <span className="ml-1 text-white/90">*</span> : null}
        </label>
        <span className="text-[11px] text-white/30">{hint}</span>
      </div>
      {children}
      {error ? <p className="text-xs text-red-300">{error}</p> : null}
    </div>
  );
}

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}
