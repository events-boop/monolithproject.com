import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertCircle,
  ArrowUpRight,
  CalendarDays,
  CheckCircle,
  ChevronRight,
  Crown,
  MapPin,
  Sparkles,
  Users,
  Wine,
} from "lucide-react";
import { Link, useSearch } from "wouter";
import type { VipAvailability, VipPackageSize } from "@shared/events/types";
import { honeypotFieldName } from "@shared/generated/hardening";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import SmartImage from "@/components/SmartImage";
import VipPackageConfigurator from "@/components/VipPackageConfigurator";
import HoneypotField from "@/components/HoneypotField";
import { submitBookingInquiry, trackAccessEvent } from "@/lib/api";
import { getPublicEvents, usePublicSiteDataVersion } from "@/lib/siteData";
import {
  getDefaultVipPackage,
  getTicketAvailabilityLabel,
  getVipAvailabilityLabel,
  getVipEventAvailability,
  getVipSelection,
  isVipPackageSoldOut,
} from "@/lib/vipExperience";

const vipSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  guests: z.string().min(1, "Enter your guest count"),
  phone: z.string().min(10, "Enter a valid phone number"),
  [honeypotFieldName]: z.string().optional(),
  honeypot: z.string().optional(),
});

type VipFormValues = z.infer<typeof vipSchema>;

const inputClass = `
  w-full px-4 py-3.5 text-sm text-white placeholder-white/25
  bg-white/[0.04] border border-white/10
  focus:border-primary/60 focus:ring-1 focus:ring-primary/20 focus:outline-none
  transition-all duration-200
`;

const availabilityTone: Record<VipAvailability, string> = {
  available: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  limited: "border-amber-300/35 bg-amber-300/10 text-amber-200",
  "sold-out": "border-red-400/30 bg-red-400/10 text-red-300",
};

const availabilityDot: Record<VipAvailability, string> = {
  available: "bg-emerald-400",
  limited: "bg-amber-300",
  "sold-out": "bg-red-400",
};

const perks = [
  {
    icon: Crown,
    title: "Priority Entry",
    desc: "A faster arrival path for your full group.",
  },
  {
    icon: Wine,
    title: "Dedicated Service",
    desc: "A venue host focused on your table or cabana.",
  },
  {
    icon: Users,
    title: "Reserved Space",
    desc: "A defined home base sized for your group.",
  },
  {
    icon: Sparkles,
    title: "Host Support",
    desc: "Placement and arrival details confirmed before the event.",
  },
];

function getEventTimestamp(value?: string) {
  if (!value) return Number.POSITIVE_INFINITY;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp;
}

export default function VIP() {
  const siteDataVersion = usePublicSiteDataVersion();
  const search = useSearch();
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedPackageSize, setSelectedPackageSize] =
    useState<VipPackageSize | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const vipEvents = useMemo(
    () =>
      getPublicEvents()
        .filter(
          event => event.status !== "past" && Boolean(event.vipPackages?.length)
        )
        .sort(
          (left, right) =>
            getEventTimestamp(left.startsAt || left.date) -
            getEventTimestamp(right.startsAt || right.date)
        ),
    [siteDataVersion]
  );

  const requestedEventId = useMemo(
    () => new URLSearchParams(search).get("event"),
    [search]
  );

  useEffect(() => {
    if (vipEvents.some(event => event.id === selectedEventId)) return;

    const requestedEvent = vipEvents.find(
      event => event.id === requestedEventId || event.slug === requestedEventId
    );
    const firstBookableEvent = vipEvents.find(
      event => getVipEventAvailability(event) !== "sold-out"
    );

    setSelectedEventId(
      requestedEvent?.id || firstBookableEvent?.id || vipEvents[0]?.id || ""
    );
  }, [requestedEventId, selectedEventId, vipEvents]);

  const selectedEvent =
    vipEvents.find(event => event.id === selectedEventId) || null;

  useEffect(() => {
    const currentPackage = selectedEvent?.vipPackages?.find(
      item => item.size === selectedPackageSize
    );

    if (
      selectedEvent &&
      currentPackage &&
      !isVipPackageSoldOut(selectedEvent, currentPackage)
    ) {
      return;
    }

    setSelectedPackageSize(getDefaultVipPackage(selectedEvent)?.size || null);
  }, [selectedEvent, selectedPackageSize]);

  const selectedPackage =
    selectedEvent?.vipPackages?.find(
      item => item.size === selectedPackageSize
    ) || null;
  const selectedExperience =
    selectedEvent && selectedPackageSize
      ? getVipSelection(selectedEvent, selectedPackageSize)
      : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VipFormValues>({
    resolver: zodResolver(vipSchema),
  });

  const onSubmit = async (data: VipFormValues) => {
    if (!selectedEvent || !selectedPackage) {
      setSubmitError("Choose an event and package before submitting.");
      return;
    }

    if (isVipPackageSoldOut(selectedEvent, selectedPackage)) {
      setSubmitError("That package just sold out. Choose another option.");
      return;
    }

    const venueMap = selectedExperience?.map;
    const venueZone = selectedExperience?.zone;
    setIsSubmitting(true);
    setSubmitError("");
    trackAccessEvent("vip_inquiry_click", {
      buttonName: `Submit ${selectedPackage.name} VIP Request`,
      destinationUrl: `/vip?event=${selectedEvent.id}#vip-request`,
      pagePath: "/vip",
      eventSlug: selectedEvent.slug || selectedEvent.id,
      eventDate: selectedEvent.date,
      channel: "native",
      source: `vip_request_${selectedPackage.size}_${venueZone?.id || "host-placement"}`,
    });

    try {
      await submitBookingInquiry({
        name: data.name,
        email: data.email,
        entity: `VIP Request — ${selectedEvent.episode} — ${selectedPackage.name}`,
        type: "general",
        location: selectedEvent.venue,
        message: [
          `Phone: ${data.phone}`,
          `Guests: ${data.guests}`,
          `Event ID: ${selectedEvent.id}`,
          `Event: ${selectedEvent.episode} — ${selectedEvent.date}`,
          `Venue: ${selectedEvent.venue}`,
          `Venue ID: ${selectedEvent.venueMap?.venueId || "host-confirmed"}`,
          `Map ID: ${venueMap?.id || selectedEvent.venueMap?.id || "host-confirmed"}`,
          `Zone ID: ${venueZone?.id || "host-confirmed"}`,
          `Placement: ${venueZone?.placement || "Final placement by host"}`,
          `Package: ${selectedPackage.name} (${selectedPackage.guestRange})`,
          `Minimum: ${selectedPackage.minimumSpend || "Host quote"}`,
          "",
          "Interest: VIP table / cabana service",
        ].join("\n"),
        [honeypotFieldName]: data[honeypotFieldName] || undefined,
      });
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to submit request right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToRequest = () => {
    document
      .getElementById("vip-request")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <SEO
        title="VIP Experience"
        description="Choose your Monolith event, explore its venue model, compare live VIP packages, and send one clear request to the host."
      />
      <Navigation />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[58rem] bg-[radial-gradient(circle_at_78%_18%,rgba(238,85,37,0.16),transparent_34%),radial-gradient(circle_at_20%_8%,rgba(255,255,255,0.05),transparent_28%)]" />

      <main
        id="main-content"
        tabIndex={-1}
        className="relative z-10 page-shell-start-loose pb-32"
      >
        <div className="container layout-default px-4 sm:px-6">
          <section className="mb-28 grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="mb-6 block font-mono text-[10px] uppercase tracking-[0.22em] text-primary sm:tracking-[0.3em]">
                — Elevated access · built around your group
              </span>
              <h1 className="mb-8 max-w-none text-balance font-display text-[clamp(2.6rem,5.2vw,4.75rem)] uppercase leading-[0.88] text-white">
                <span className="block whitespace-nowrap">The VIP</span>
                <span className="block whitespace-nowrap">Experience</span>
              </h1>
              <p className="mb-10 max-w-xl text-lg leading-relaxed text-white/72">
                Start with the date. Explore the venue, confirm live
                availability, and choose the package that fits your group before
                sending one clear request to the host.
              </p>

              <div className="grid gap-7 sm:grid-cols-2">
                {perks.map(perk => (
                  <div key={perk.title}>
                    <div className="mb-2 flex items-center gap-2 font-display text-lg uppercase text-white">
                      <perk.icon className="h-4 w-4 text-primary" />{" "}
                      {perk.title}
                    </div>
                    <p className="text-sm leading-relaxed text-white/62">
                      {perk.desc}
                    </p>
                  </div>
                ))}
              </div>

              <a
                href="#vip-dates"
                className="mt-10 inline-flex items-center gap-2 border-b border-primary/60 pb-2 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-primary transition hover:border-primary hover:text-white"
              >
                Choose your date <ChevronRight className="h-4 w-4" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative aspect-[4/5] overflow-hidden border border-white/12 bg-white/[0.04]"
            >
              <SmartImage
                src="/images/chasing-sunsets-premium.webp"
                alt="A private Monolith group experience overlooking the Chicago skyline"
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="absolute inset-0 h-full w-full object-cover"
                containerClassName="absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-black/10" />
              <div className="absolute left-5 top-5 border border-white/20 bg-black/55 px-3 py-2 backdrop-blur-md sm:left-8 sm:top-8">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-white/80">
                  Chicago · Private hosting
                </p>
              </div>
              <div className="absolute inset-x-5 bottom-5 border border-white/12 bg-black/65 p-5 backdrop-blur-md sm:inset-x-8 sm:bottom-8 sm:p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
                  Your night, sized correctly
                </p>
                <p className="mt-2 font-display text-2xl uppercase text-white sm:text-3xl">
                  Select · Explore · Request
                </p>
              </div>
            </motion.div>
          </section>

          <section id="vip-dates" className="scroll-mt-28 pb-28">
            <div className="mb-10 flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
                  01 / Select the event
                </p>
                <h2 className="mt-3 font-display text-[clamp(2.4rem,6vw,4.8rem)] uppercase leading-[0.9] text-white">
                  Pick your night
                </h2>
              </div>
              <p className="max-w-lg text-sm leading-relaxed text-white/58 md:text-right">
                Every date carries its own live inventory and event-specific
                venue model. Change the date and the complete experience updates
                with it.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {vipEvents.length > 0 ? (
                vipEvents.map(event => {
                  const isSelected = event.id === selectedEvent?.id;
                  const eventAvailability = getVipEventAvailability(event);

                  return (
                    <button
                      key={event.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedEventId(event.id)}
                      className={`w-full border p-5 text-left transition sm:p-6 ${
                        isSelected
                          ? "border-primary bg-primary/[0.08] shadow-[inset_3px_0_0_#ee5525]"
                          : "border-white/10 bg-white/[0.025] hover:border-white/25 hover:bg-white/[0.045]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-white/45">
                            {event.episode}
                          </p>
                          <h3 className="mt-2 font-display text-2xl uppercase text-white">
                            {event.date.replace(/,\s*\d{4}$/, "")}
                          </h3>
                        </div>
                        <span
                          className={`inline-flex items-center gap-2 border px-2.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] ${availabilityTone[eventAvailability]}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${availabilityDot[eventAvailability]}`}
                          />
                          VIP {getVipAvailabilityLabel(eventAvailability)}
                        </span>
                      </div>

                      <div className="mt-6 grid gap-3 text-sm text-white/66 sm:grid-cols-2">
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          {event.venue}
                        </span>
                        <span className="flex items-center gap-2 sm:justify-end">
                          <CalendarDays className="h-4 w-4 text-white/35" />
                          {getTicketAvailabilityLabel(event.status)}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="border border-white/10 bg-white/[0.03] p-8 md:col-span-2">
                  <p className="font-display text-2xl uppercase text-white">
                    New dates incoming
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    VIP inventory and venue models appear here as each date
                    opens.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section id="vip-packages" className="scroll-mt-28 pb-28">
            <div className="mb-10 flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
                  02 / Explore and select
                </p>
                <h2 className="mt-3 font-display text-[clamp(2.4rem,6vw,4.8rem)] uppercase leading-[0.9] text-white">
                  Enter the venue
                </h2>
              </div>
              {selectedEvent ? (
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/48 md:text-right">
                  {selectedEvent.episode}
                  <span className="mt-1 block text-white/78">
                    {selectedEvent.date} · {selectedEvent.venue}
                  </span>
                </p>
              ) : null}
            </div>

            <VipPackageConfigurator
              event={selectedEvent}
              selectedSize={selectedPackageSize}
              onSelect={setSelectedPackageSize}
              onContinue={scrollToRequest}
            />
          </section>

          <section
            id="vip-request"
            className="scroll-mt-28 border-t border-white/10 pt-20"
          >
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-20">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
                  03 / Send the request
                </p>
                <h2 className="mt-4 max-w-[8ch] font-display text-[clamp(2.6rem,6vw,5rem)] uppercase leading-[0.9] text-white">
                  Request your space
                </h2>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60">
                  Your event, package, map, and placement zone are included
                  automatically. The host confirms exact inventory and the final
                  minimum directly with you.
                </p>

                {selectedEvent && selectedPackage ? (
                  <div className="mt-8 border border-primary/30 bg-primary/[0.07] p-5 sm:p-6">
                    <p className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-primary">
                      Selected experience
                    </p>
                    <p className="mt-3 font-display text-2xl uppercase text-white">
                      {selectedPackage.name} · {selectedPackage.guestRange}
                    </p>
                    <dl className="mt-5 space-y-3 text-sm">
                      <div className="flex justify-between gap-4 border-t border-white/8 pt-3">
                        <dt className="text-white/42">Date</dt>
                        <dd className="text-right text-white/78">
                          {selectedEvent.date}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4 border-t border-white/8 pt-3">
                        <dt className="text-white/42">Venue</dt>
                        <dd className="text-right text-white/78">
                          {selectedEvent.venue}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4 border-t border-white/8 pt-3">
                        <dt className="text-white/42">Placement</dt>
                        <dd className="text-right text-white/78">
                          {selectedExperience?.zone?.placement ||
                            "Confirmed by host"}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4 border-t border-white/8 pt-3">
                        <dt className="text-white/42">Minimum</dt>
                        <dd className="text-right text-white/78">
                          {selectedPackage.minimumSpend || "Host quote"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ) : null}
              </div>

              <div>
                {isSubmitted ? (
                  <div className="border border-white/10 bg-white/[0.04] p-8 text-center sm:p-12">
                    <CheckCircle className="mx-auto mb-5 h-12 w-12 text-primary" />
                    <h3 className="font-display text-3xl uppercase text-white">
                      Request received
                    </h3>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/66">
                      Your selected date, package, and placement are with the
                      VIP host. They will text you to confirm availability and
                      next steps.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                    noValidate
                  >
                    <HoneypotField {...register(honeypotFieldName)} />

                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="block" htmlFor="vip-name">
                        <span className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/52">
                          Full name
                        </span>
                        <input
                          id="vip-name"
                          {...register("name")}
                          autoComplete="name"
                          placeholder="Your name"
                          aria-invalid={Boolean(errors.name)}
                          className={inputClass}
                        />
                        {errors.name ? (
                          <span className="mt-2 block text-xs text-red-300">
                            {errors.name.message}
                          </span>
                        ) : null}
                      </label>

                      <label className="block" htmlFor="vip-phone">
                        <span className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/52">
                          Phone
                        </span>
                        <input
                          id="vip-phone"
                          type="tel"
                          {...register("phone")}
                          autoComplete="tel"
                          placeholder="(312) 555-0123"
                          aria-invalid={Boolean(errors.phone)}
                          className={inputClass}
                        />
                        {errors.phone ? (
                          <span className="mt-2 block text-xs text-red-300">
                            {errors.phone.message}
                          </span>
                        ) : null}
                      </label>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="block" htmlFor="vip-email">
                        <span className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/52">
                          Email
                        </span>
                        <input
                          id="vip-email"
                          type="email"
                          {...register("email")}
                          autoComplete="email"
                          placeholder="you@example.com"
                          aria-invalid={Boolean(errors.email)}
                          className={inputClass}
                        />
                        {errors.email ? (
                          <span className="mt-2 block text-xs text-red-300">
                            {errors.email.message}
                          </span>
                        ) : null}
                      </label>

                      <label className="block" htmlFor="vip-guests">
                        <span className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/52">
                          Expected guests
                        </span>
                        <input
                          id="vip-guests"
                          type="number"
                          min="1"
                          max="50"
                          inputMode="numeric"
                          {...register("guests")}
                          placeholder="Guest count"
                          aria-invalid={Boolean(errors.guests)}
                          className={inputClass}
                        />
                        {errors.guests ? (
                          <span className="mt-2 block text-xs text-red-300">
                            {errors.guests.message}
                          </span>
                        ) : null}
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={
                        isSubmitting || !selectedEvent || !selectedPackage
                      }
                      className={`cta-fillout w-full rounded-none py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
                        isSubmitting ? "opacity-50" : ""
                      }`}
                    >
                      {isSubmitting
                        ? "Sending request..."
                        : selectedPackage
                          ? `Request ${selectedPackage.name} package`
                          : "Choose a package first"}
                    </button>

                    {submitError ? (
                      <div className="mt-4 flex items-center gap-2 border border-red-400/15 bg-red-400/[0.06] p-3 text-xs text-red-300">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {submitError}
                      </div>
                    ) : null}

                    <p className="text-center text-[11px] leading-relaxed text-white/38">
                      Submitting a request does not guarantee a reservation. The
                      host confirms availability and payment details.
                    </p>
                  </form>
                )}

                <div className="mt-12 flex flex-col items-center justify-center gap-6 border-t border-white/5 pt-10 sm:flex-row sm:gap-12">
                  <Link href="/tickets" asChild>
                    <a className="cta-ghost group">
                      Tickets
                      <ArrowUpRight className="ml-2 h-3 w-3 opacity-40 group-hover:opacity-100" />
                    </a>
                  </Link>
                  <Link href="/newsletter" asChild>
                    <a className="cta-ghost group">
                      Join SMS updates
                      <ArrowUpRight className="ml-2 h-3 w-3 opacity-40 group-hover:opacity-100" />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
