import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { submitBookingInquiry } from "@/lib/api";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120, "Name is too long"),
  email: z.string().trim().email("Invalid email address").max(320, "Email is too long"),
  subject: z.string().trim().min(2, "Subject is required").max(160, "Subject is too long"),
  message: z.string().trim().min(10, "Please provide more details").max(5000, "Message is too long"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const inputClass = `
  w-full px-4 py-3.5 text-sm text-white placeholder-white/25
  bg-white/[0.04] border border-white/10
  focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none
  transition-all duration-200
  rounded-none
`;

const labelClass = "block text-[10px] font-mono uppercase tracking-[0.25em] text-white/35 mb-2";

export default function ContactFormSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await submitBookingInquiry({
        name: data.name.trim(),
        email: data.email.trim(),
        entity: data.subject.trim(),
        type: "general",
        message: data.message.trim(),
      });
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to submit message right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden p-8 md:p-10"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-primary/70 via-primary/30 to-transparent" />

      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="min-h-[360px] flex flex-col items-center justify-center text-center"
        >
          <div
            className="w-16 h-16 flex items-center justify-center mb-6 text-primary"
            style={{ background: "rgba(224,90,58,0.12)", border: "1px solid rgba(224,90,58,0.3)" }}
          >
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="font-display text-3xl mb-4 uppercase text-white tracking-wide">Message Received</h3>
          <p className="text-white/45 max-w-md text-sm leading-relaxed">
            We read everything. If it needs a reply, we'll get back to you.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contact-name" className={labelClass}>Name</label>
              <input
                id="contact-name"
                {...register("name")}
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                className={inputClass}
                placeholder="Full name"
              />
              {errors.name && <span className="text-red-400 text-xs mt-1.5 block font-mono">{errors.name.message}</span>}
            </div>
            <div>
              <label htmlFor="contact-email" className={labelClass}>Email</label>
              <input
                id="contact-email"
                type="email"
                inputMode="email"
                {...register("email")}
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                className={inputClass}
                placeholder="email@address.com"
              />
              {errors.email && <span className="text-red-400 text-xs mt-1.5 block font-mono">{errors.email.message}</span>}
            </div>
          </div>

          <div>
            <label htmlFor="contact-subject" className={labelClass}>Subject</label>
            <input
              id="contact-subject"
              {...register("subject")}
              autoComplete="off"
              aria-invalid={Boolean(errors.subject)}
              className={inputClass}
              placeholder="What is this about?"
            />
            {errors.subject && <span className="text-red-400 text-xs mt-1.5 block font-mono">{errors.subject.message}</span>}
          </div>

          <div>
            <label htmlFor="contact-message" className={labelClass}>Message</label>
            <textarea
              id="contact-message"
              {...register("message")}
              autoComplete="off"
              aria-invalid={Boolean(errors.message)}
              rows={6}
              className={`${inputClass} resize-none`}
              placeholder="Tell us what you need, with dates/links if relevant..."
            />
            {errors.message && <span className="text-red-400 text-xs mt-1.5 block font-mono">{errors.message.message}</span>}
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/25">
              Or email{" "}
              <a className="text-primary/60 hover:text-primary transition-colors" href="mailto:events@monolithproject.com">
                events@monolithproject.com
              </a>
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
                  <span>Send</span>
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
