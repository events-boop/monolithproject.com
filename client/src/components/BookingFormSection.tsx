import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { MapPin, Send, CheckCircle } from "lucide-react";

const bookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  entity: z.string().min(2, "Company or Artist name is required"),
  type: z.enum(["partner-on-location", "artist-booking", "sponsorship", "general"]),
  location: z.string().optional(),
  message: z.string().min(10, "Please provide more details"),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookingFormSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Form Submitted:", data);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="border border-border p-8 md:p-12"
    >
      {isSubmitted ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 border border-primary bg-primary/10 flex items-center justify-center mb-6 text-primary">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="font-display text-3xl mb-4 uppercase">Received</h3>
          <p className="text-muted-foreground max-w-md">
            We'll review your inquiry and get back to you if there's a fit.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
              Inquiry Type
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { id: "partner-on-location", label: "Venue Partner" },
                { id: "artist-booking", label: "Artist Booking" },
                { id: "sponsorship", label: "Sponsorship" },
                { id: "general", label: "General" },
              ].map((type) => (
                <label
                  key={type.id}
                  className={`cursor-pointer border p-4 text-center transition-colors ${
                    watch("type") === type.id
                      ? "border-primary text-primary bg-primary/5"
                      : "border-border text-muted-foreground hover:border-muted-foreground"
                  }`}
                >
                  <input type="radio" value={type.id} {...register("type")} className="sr-only" />
                  <span className="text-xs font-bold uppercase tracking-wider">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Name</label>
                <input
                  {...register("name")}
                  className="w-full bg-transparent border border-border p-4 text-foreground focus:border-primary focus:outline-none transition-colors"
                  placeholder="Full name"
                />
                {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Email</label>
                <input
                  {...register("email")}
                  className="w-full bg-transparent border border-border p-4 text-foreground focus:border-primary focus:outline-none transition-colors"
                  placeholder="email@address.com"
                />
                {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Organization</label>
                <input
                  {...register("entity")}
                  className="w-full bg-transparent border border-border p-4 text-foreground focus:border-primary focus:outline-none transition-colors"
                  placeholder="Company, venue, or artist name"
                />
                {errors.entity && <span className="text-red-500 text-xs mt-1 block">{errors.entity.message}</span>}
              </div>

              <motion.div animate={{ opacity: selectedType === "partner-on-location" ? 1 : 0.5 }}>
                <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> Location / Venue
                </label>
                <input
                  {...register("location")}
                  disabled={selectedType !== "partner-on-location"}
                  className={`w-full bg-transparent border border-border p-4 text-foreground focus:border-primary focus:outline-none transition-colors ${
                    selectedType !== "partner-on-location" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  placeholder={selectedType === "partner-on-location" ? "City, State, or Venue Name" : "N/A"}
                />
              </motion.div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Details</label>
            <textarea
              {...register("message")}
              rows={6}
              className="w-full bg-transparent border border-border p-4 text-foreground focus:border-primary focus:outline-none transition-colors resize-none"
              placeholder="Tell us about your proposal, dates, or vision..."
            />
            {errors.message && <span className="text-red-500 text-xs mt-1 block">{errors.message.message}</span>}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold tracking-widest uppercase text-xs hover:bg-foreground transition-colors disabled:opacity-50 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
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
        </form>
      )}
    </motion.div>
  );
}
