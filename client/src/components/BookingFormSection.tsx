import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { MapPin, Send, CheckCircle, AlertCircle, Mic2, Handshake, Music, HelpCircle } from "lucide-react";
import { submitBookingInquiry } from "@/lib/api";

const bookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  entity: z.string().min(2, "Company or Artist name is required"),
  type: z.enum(["partner-on-location", "artist-booking", "sponsorship", "general"]),
  location: z.string().optional(),
  message: z.string().min(10, "Please provide more details"),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const inquiryTypes = [
  { id: "artist-booking", label: "Artist Booking", icon: Mic2, color: "#E05A3A" },
  { id: "partner-on-location", label: "Venue Partner", icon: MapPin, color: "#E8B86D" },
  { id: "sponsorship", label: "Sponsorship", icon: Handshake, color: "#8B5CF6" },
  { id: "general", label: "General", icon: HelpCircle, color: "rgba(255,255,255,0.4)" },
] as const;

const inputClass = `
  w-full px-4 py-3.5 text-sm text-white placeholder-white/25
  bg-white/[0.04] border border-white/10
  focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none
  transition-all duration-200
`;

const labelClass = "block text-[10px] font-mono uppercase tracking-[0.25em] text-white/35 mb-2";

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
    defaultValues: { type: "artist-booking" },
  });

  const selectedType = watch("type");

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await submitBookingInquiry({
        ...data,
        location: data.location?.trim() || undefined,
      });
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to submit inquiry right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeType = inquiryTypes.find((t) => t.id === selectedType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden p-8 md:p-10"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Top accent line — changes color with inquiry type */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] transition-all duration-500"
        style={{ background: `linear-gradient(to right, ${activeType?.color ?? "#E05A3A"}80, ${activeType?.color ?? "#E05A3A"}20, transparent)` }}
      />

      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="min-h-[400px] flex flex-col items-center justify-center text-center"
        >
          <div
            className="w-16 h-16 flex items-center justify-center mb-6 text-primary"
            style={{ background: "rgba(224,90,58,0.12)", border: "1px solid rgba(224,90,58,0.3)" }}
          >
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="font-display text-3xl mb-4 uppercase text-white tracking-wide">Received</h3>
          <p className="text-white/45 max-w-md text-sm leading-relaxed">
            We'll review your inquiry and get back to you if there's a fit. Thanks for reaching out.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

          {/* Inquiry type selector */}
          <div>
            <label className={labelClass}>Inquiry Type</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {inquiryTypes.map((type) => {
                const isActive = selectedType === type.id;
                return (
                  <label
                    key={type.id}
                    className="cursor-pointer relative group"
                  >
                    <input type="radio" value={type.id} {...register("type")} className="sr-only" />
                    <div
                      className="flex flex-col items-center gap-2 p-4 transition-all duration-200 text-center"
                      style={{
                        background: isActive ? `${type.color}12` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${isActive ? type.color + "50" : "rgba(255,255,255,0.08)"}`,
                      }}
                    >
                      <type.icon className="w-4 h-4" style={{ color: isActive ? type.color : "rgba(255,255,255,0.3)" }} />
                      <span
                        className="text-[10px] font-mono tracking-widest uppercase transition-colors"
                        style={{ color: isActive ? type.color : "rgba(255,255,255,0.4)" }}
                      >
                        {type.label}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Name + Email */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="booking-name" className={labelClass}>Name</label>
              <input
                id="booking-name"
                {...register("name")}
                className={inputClass}
                placeholder="Full name"
                autoComplete="name"
              />
              {errors.name && <span className="text-red-400 text-xs mt-1.5 block font-mono">{errors.name.message}</span>}
            </div>
            <div>
              <label htmlFor="booking-email" className={labelClass}>Email</label>
              <input
                id="booking-email"
                type="email"
                {...register("email")}
                className={inputClass}
                placeholder="email@address.com"
                autoComplete="email"
              />
              {errors.email && <span className="text-red-400 text-xs mt-1.5 block font-mono">{errors.email.message}</span>}
            </div>
          </div>

          {/* Organization + Location */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="booking-entity" className={labelClass}>
                {selectedType === "artist-booking" ? "Artist / Act Name" : "Organization"}
              </label>
              <input
                id="booking-entity"
                {...register("entity")}
                className={inputClass}
                placeholder={selectedType === "artist-booking" ? "Your artist name" : "Company or venue name"}
              />
              {errors.entity && <span className="text-red-400 text-xs mt-1.5 block font-mono">{errors.entity.message}</span>}
            </div>
            <div style={{ opacity: selectedType === "partner-on-location" ? 1 : 0.4 }}>
              <label htmlFor="booking-location" className={labelClass}>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> Location / Venue
                </span>
              </label>
              <input
                id="booking-location"
                {...register("location")}
                disabled={selectedType !== "partner-on-location"}
                className={`${inputClass} ${selectedType !== "partner-on-location" ? "cursor-not-allowed" : ""}`}
                placeholder={selectedType === "partner-on-location" ? "City, State, or Venue Name" : "N/A"}
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="booking-message" className={labelClass}>Details</label>
            <textarea
              id="booking-message"
              {...register("message")}
              rows={6}
              className={`${inputClass} resize-none`}
              placeholder={
                selectedType === "artist-booking"
                  ? "Share your SoundCloud, mix link, genre, availability, and what makes you a fit..."
                  : "Tell us about your proposal, dates, capacity, or vision..."
              }
            />
            {errors.message && <span className="text-red-400 text-xs mt-1.5 block font-mono">{errors.message.message}</span>}
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20">
              We review every submission
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-white font-bold tracking-widest uppercase text-xs hover:bg-primary/85 transition-all duration-200 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Sending...</span>
              ) : (
                <>
                  <span>Submit</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {submitError && (
            <p className="flex items-center gap-1.5 text-red-400 text-xs font-mono" role="alert" aria-live="polite">
              <AlertCircle className="w-3 h-3" />
              {submitError}
            </p>
          )}
        </form>
      )}
    </motion.div>
  );
}
