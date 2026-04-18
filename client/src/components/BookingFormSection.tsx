import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";
import { submitBookingInquiry } from "@/lib/api";
import HoneypotField from "@/components/HoneypotField";
import { honeypotFieldName } from "@shared/generated/hardening";

const bookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  entity: z.string().min(2, "Company or Artist name is required"),
  type: z.enum(["partner-on-location", "artist-booking", "sponsorship", "general"]),
  location: z.string().optional(),
  message: z.string().min(10, "Please provide more details"),
  [honeypotFieldName]: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const inquiryTypes = [
  {
    id: "partner-on-location" as const,
    label: "Venue Partner",
    code: "VENUE",
    description: "For venues, rooftops, and hospitality settings.",
  },
  {
    id: "artist-booking" as const,
    label: "Artist Booking",
    code: "ARTIST",
    description: "For DJs, live performers, and management teams.",
  },
  {
    id: "sponsorship" as const,
    label: "Sponsorship",
    code: "BRAND",
    description: "For activations, partnerships, and aligned brand work.",
  },
  {
    id: "general" as const,
    label: "General",
    code: "OPEN",
    description: "For anything that does not fit the other lanes.",
  },
];

export default function BookingFormSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      type: "partner-on-location",
    },
  });

  const selectedType = watch("type");

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await submitBookingInquiry({
        ...data,
        location: data.location?.trim() || undefined,
        [honeypotFieldName]: data[honeypotFieldName] || undefined,
      });
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to submit inquiry right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] p-8 md:p-12"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-0 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
      </div>
      {isSubmitted ? (
        <div className="relative min-h-[400px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center mb-6 text-primary">
            <CheckCircle className="w-8 h-8" />
          </div>
          <span className="mb-4 font-mono text-[10px] uppercase tracking-[0.35em] text-primary/70">
            Submission Received
          </span>
          <h3 className="font-display text-3xl mb-4 uppercase text-white">Received</h3>
          <p className="text-white/55 max-w-md leading-relaxed">
            We'll review your inquiry and get back to you if there's a fit.
          </p>
        </div>
      ) : (
        <form action="/api/booking-inquiry" method="POST" onSubmit={handleSubmit(onSubmit)} className="relative space-y-10">
          <HoneypotField {...register(honeypotFieldName)} />

          <div className="flex flex-col gap-6 border-b border-white/8 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="mb-4 block font-mono text-[10px] uppercase tracking-[0.35em] text-primary/70">
                Submission Intake
              </span>
              <h3 className="font-display text-3xl md:text-4xl uppercase tracking-tight text-white">
                Tell Us What You Are Building
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/55 md:text-base">
                Use the form below for artist bookings, venue partnerships, sponsor interest, or broader collaboration ideas. Location is only required for venue inquiries.
              </p>
            </div>
            <div className="inline-flex items-center gap-3 self-start rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Manual Review
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-[0.32em] text-white/40 mb-4">
              Inquiry Type
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {inquiryTypes.map((type) => (
                <label
                  key={type.id}
                  className={`group cursor-pointer rounded-[1.5rem] border px-4 py-5 transition-all duration-300 ${selectedType === type.id
                      ? "border-primary/40 bg-primary/[0.08] text-white shadow-[0_18px_50px_rgba(212,165,116,0.12)]"
                      : "border-white/8 bg-white/[0.02] text-white/65 hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                >
                  <input type="radio" value={type.id} {...register("type")} className="sr-only" />
                  <span className={`mb-4 inline-flex rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.28em] ${selectedType === type.id ? "border-primary/40 text-primary" : "border-white/10 text-white/35"}`}>
                    {type.code}
                  </span>
                  <span className="block text-sm font-semibold uppercase tracking-[0.16em]">{type.label}</span>
                  <span className="mt-2 block text-xs leading-relaxed text-white/45">
                    {type.description}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-10 border-t border-white/8 pt-10 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/35">
                  Contact
                </p>
                <p className="mt-2 text-sm text-white/45">
                  The person we should reply to directly.
                </p>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-[0.28em] text-white/40 mb-3">Name</label>
                <input
                  {...register("name")}
                  autoComplete="name"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white placeholder:text-white/25 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Full name"
                />
                {errors.name && <span className="text-rose-400 text-xs mt-2 block">{errors.name.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-[0.28em] text-white/40 mb-3">Email</label>
                <input
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white placeholder:text-white/25 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="email@address.com"
                />
                {errors.email && <span className="text-rose-400 text-xs mt-2 block">{errors.email.message}</span>}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/35">
                  Context
                </p>
                <p className="mt-2 text-sm text-white/45">
                  Tell us what lane this request belongs to.
                </p>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-[0.28em] text-white/40 mb-3">Organization</label>
                <input
                  {...register("entity")}
                  autoComplete="organization"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white placeholder:text-white/25 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Company, venue, or artist name"
                />
                {errors.entity && <span className="text-rose-400 text-xs mt-2 block">{errors.entity.message}</span>}
              </div>

              <motion.div animate={{ opacity: selectedType === "partner-on-location" ? 1 : 0.5 }}>
                <label className="block text-xs font-mono uppercase tracking-[0.28em] text-white/40 mb-3 flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> Location / Venue
                </label>
                <input
                  {...register("location")}
                  disabled={selectedType !== "partner-on-location"}
                  className={`w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white placeholder:text-white/25 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${selectedType !== "partner-on-location" ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  placeholder={selectedType === "partner-on-location" ? "City, State, or Venue Name" : "N/A"}
                />
              </motion.div>
            </div>
          </div>

          <div className="border-t border-white/8 pt-10">
            <label className="block text-xs font-mono uppercase tracking-[0.32em] text-white/40 mb-3">Details</label>
            <textarea
              {...register("message")}
              rows={6}
              className="min-h-[180px] w-full rounded-[1.75rem] border border-white/10 bg-white/[0.03] px-5 py-4 text-white placeholder:text-white/25 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              placeholder="Tell us about your proposal, dates, or vision..."
            />
            {errors.message && <span className="text-rose-400 text-xs mt-2 block">{errors.message.message}</span>}
          </div>

          <div className="flex flex-col gap-5 border-t border-white/8 pt-8 md:flex-row md:items-center md:justify-between">
            <p className="max-w-md text-xs leading-relaxed text-white/35">
              Venue location is only required for on-site partnership requests. Everything else should live in the brief.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-w-[240px] items-center justify-center gap-3 rounded-full border border-primary/30 bg-primary px-8 py-4 font-mono text-[11px] uppercase tracking-[0.28em] text-black shadow-[0_24px_60px_rgba(212,165,116,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#f0d5a3] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Sending...</span>
              ) : (
                <>
                  <span>Submit</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {submitError && (
            <p className="flex items-center gap-1.5 text-rose-400 text-xs font-mono" role="alert" aria-live="polite">
              <AlertCircle className="w-3 h-3" />
              {submitError}
            </p>
          )}
        </form>
      )}
    </motion.div>
  );
}
