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
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="ui-card border border-charcoal/15 bg-white/75 backdrop-blur-sm p-8 md:p-10"
    >
      {isSubmitted ? (
        <div className="min-h-[360px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 border border-primary/50 bg-primary/10 flex items-center justify-center mb-6 text-primary rounded-2xl">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="font-display text-3xl mb-4 uppercase text-charcoal">Message Received</h3>
          <p className="text-charcoal/70 max-w-md">
            We read everything. If it needs a reply, we will get back to you.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
          <div>
            <label htmlFor="contact-name" className="block text-xs font-mono uppercase tracking-widest text-charcoal/60 mb-2">Name</label>
            <input
              id="contact-name"
              {...register("name")}
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              className="w-full bg-white/60 border border-charcoal/15 p-4 text-charcoal placeholder:text-charcoal/35 focus:border-primary/50 focus:ring-2 focus:ring-primary/15 focus:outline-none transition-colors rounded-xl"
              placeholder="Full name"
            />
            {errors.name && <span className="text-red-600 text-xs mt-1 block">{errors.name.message}</span>}
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-xs font-mono uppercase tracking-widest text-charcoal/60 mb-2">Email</label>
            <input
              id="contact-email"
              type="email"
              inputMode="email"
              {...register("email")}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              className="w-full bg-white/60 border border-charcoal/15 p-4 text-charcoal placeholder:text-charcoal/35 focus:border-primary/50 focus:ring-2 focus:ring-primary/15 focus:outline-none transition-colors rounded-xl"
              placeholder="email@address.com"
            />
            {errors.email && <span className="text-red-600 text-xs mt-1 block">{errors.email.message}</span>}
          </div>

          <div>
            <label htmlFor="contact-subject" className="block text-xs font-mono uppercase tracking-widest text-charcoal/60 mb-2">Subject</label>
            <input
              id="contact-subject"
              {...register("subject")}
              autoComplete="off"
              aria-invalid={Boolean(errors.subject)}
              className="w-full bg-white/60 border border-charcoal/15 p-4 text-charcoal placeholder:text-charcoal/35 focus:border-primary/50 focus:ring-2 focus:ring-primary/15 focus:outline-none transition-colors rounded-xl"
              placeholder="What is this about?"
            />
            {errors.subject && <span className="text-red-600 text-xs mt-1 block">{errors.subject.message}</span>}
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-xs font-mono uppercase tracking-widest text-charcoal/60 mb-2">Message</label>
            <textarea
              id="contact-message"
              {...register("message")}
              autoComplete="off"
              aria-invalid={Boolean(errors.message)}
              rows={6}
              className="w-full bg-white/60 border border-charcoal/15 p-4 text-charcoal placeholder:text-charcoal/35 focus:border-primary/50 focus:ring-2 focus:ring-primary/15 focus:outline-none transition-colors resize-none rounded-xl"
              placeholder="Tell us what you need, with dates/links if relevant..."
            />
            {errors.message && <span className="text-red-600 text-xs mt-1 block">{errors.message.message}</span>}
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-charcoal/55">
              Or email{" "}
              <a className="underline hover:text-charcoal transition-colors" href="mailto:events@monolithproject.com">
                events@monolithproject.com
              </a>
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-primary-foreground font-bold tracking-widest uppercase text-xs hover:bg-primary/90 transition-colors disabled:opacity-50 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Sending...</span>
              ) : (
                <>
                  <span>Send</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {submitError && (
            <p className="flex items-center gap-1.5 text-red-600 text-xs font-mono" role="alert" aria-live="polite">
              <AlertCircle className="w-3 h-3" />
              {submitError}
            </p>
          )}
        </form>
      )}
    </motion.div>
  );
}
