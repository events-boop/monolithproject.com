
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Check, ArrowUpRight, AlertCircle } from "lucide-react";
import GlitchText from "./GlitchText";
import { submitNewsletterLead } from "@/lib/api";

interface NewsletterSectionProps {
  source?: string;
  compactIntro?: boolean;
  description?: string;
  benefits?: string[];
}

const defaultBenefits = [
  "Early access ticket windows",
  "Lineup announcements first",
  "New radio show mixes",
  "Private event drops",
];

export default function NewsletterSection({
  source = "newsletter_section",
  compactIntro = false,
  description = "Get early ticket access, lineup announcements, and updates on upcoming shows. No spam — just the stuff that matters.",
  benefits = defaultBenefits,
}: NewsletterSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState("");

  const validateEmail = (value: string) => {
    if (!value) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email";
    return "";
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;
    if (!agreed) newErrors.agreed = "Please agree to continue";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setTouched({ email: true, agreed: true });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await submitNewsletterLead(
        {
          email,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          consent: true,
          source,
        },
        crypto.randomUUID()
      );
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="newsletter" className="relative section-rhythm-tight bg-sand text-charcoal overflow-hidden">
      {/* Gradient bridge from dark to light */}
      <div className="absolute -top-32 left-0 right-0 h-32 bg-gradient-to-b from-background to-sand pointer-events-none" />
      <div className="absolute inset-0 atmo-surface-soft pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(34,211,238,0.08),transparent_32%),radial-gradient(circle_at_82%_74%,rgba(224,90,58,0.12),transparent_36%)] pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-[0.025] pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-[52%] pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.055] blur-[0.5px]"
          style={{
            backgroundImage:
              "linear-gradient(to left, rgba(241,245,249,0.52), rgba(241,245,249,0.16) 26%, transparent 72%), url('/images/chasing-sunsets.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>
      <div className="container max-w-6xl mx-auto px-6">

        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 border border-clay bg-clay/10 flex items-center justify-center mx-auto mb-8">
                <Check className="w-6 h-6 text-clay" />
              </div>
              <h3 className="font-display text-4xl text-charcoal mb-4">YOU'RE IN</h3>
              <p className="text-stone">
                We'll be in touch when tickets drop and new shows are announced.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={`grid md:grid-cols-2 items-start ${compactIntro ? "gap-10 md:gap-12" : "gap-16"}`}>

                {/* Left — copy */}
                <div>
                  {compactIntro ? (
                    <>
                      <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-clay/80 block mb-4">
                        Member Perks
                      </span>
                      <p className="text-stone leading-relaxed mb-6">
                        {description}
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="font-serif italic text-lg text-clay/80 block mb-4">
                        Newsletter
                      </span>
                      <h2 className="font-display text-section-title text-charcoal mb-6 tracking-tight-display">
                        <GlitchText className="text-charcoal">STAY IN</GlitchText>
                        <br />
                        <GlitchText className="text-charcoal">THE LOOP</GlitchText>
                      </h2>
                      <p className="text-stone leading-relaxed mb-8">
                        {description}
                      </p>
                    </>
                  )}

                  {/* What you get */}
                  <div className={`${compactIntro ? "grid gap-2" : "space-y-3"}`}>
                    {benefits.map((item) => (
                      <div key={item} className={`flex items-center gap-3 ${compactIntro ? "rounded-full border border-charcoal/15 bg-white/60 px-3 py-2" : ""}`}>
                        <div className="w-1 h-1 bg-clay" />
                        <span className={`text-sm font-mono uppercase ${compactIntro ? "text-charcoal/80 tracking-[0.12em]" : "text-stone tracking-wide"}`}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right — form */}
                <form onSubmit={handleSubmit} className="relative z-[60] space-y-6 rounded-2xl border border-charcoal/15 bg-white/38 backdrop-blur-md p-6 md:p-7 shadow-[0_12px_30px_rgba(0,0,0,0.08)]" noValidate aria-describedby={submitError ? "newsletter-submit-error" : undefined}>
                  <div className="relative">
                    <label htmlFor="email" className="ui-chip text-stone block mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (touched.email) {
                          const err = validateEmail(e.target.value);
                          setErrors(prev => err ? { ...prev, email: err } : (({ email: _, ...rest }) => rest)(prev));
                        }
                      }}
                      onBlur={() => {
                        setTouched(prev => ({ ...prev, email: true }));
                        const err = validateEmail(email);
                        setErrors(prev => err ? { ...prev, email: err } : (({ email: _, ...rest }) => rest)(prev));
                      }}
                      placeholder="you@email.com"
                      aria-invalid={Boolean(touched.email && errors.email)}
                      aria-describedby={touched.email && errors.email ? "newsletter-email-error" : undefined}
                      className={`w-full bg-white/88 border px-4 py-4 text-charcoal placeholder:text-stone/70 focus:outline-none focus:border-l-4 focus:border-l-clay transition-all duration-200 ${touched.email && errors.email ? "border-red-400" : "border-charcoal/20"}`}
                    />
                    {touched.email && errors.email && (
                      <p id="newsletter-email-error" className="flex items-center gap-1.5 mt-1.5 text-red-500 text-xs font-mono">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="ui-chip text-stone block mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First"
                        className="w-full bg-white/88 border border-charcoal/20 px-4 py-4 text-charcoal placeholder:text-stone/70 focus:outline-none focus:border-l-4 focus:border-l-clay transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="ui-chip text-stone block mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last"
                        className="w-full bg-white/88 border border-charcoal/20 px-4 py-4 text-charcoal placeholder:text-stone/70 focus:outline-none focus:border-l-4 focus:border-l-clay transition-all duration-200"
                      />
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group pt-2">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => {
                          setAgreed(e.target.checked);
                          setTouched(prev => ({ ...prev, agreed: true }));
                          if (e.target.checked) {
                            setErrors(prev => { const { agreed: _, ...rest } = prev; return rest; });
                          }
                        }}
                        className="peer sr-only"
                      />
                      <div className={`w-4 h-4 border transition-colors flex items-center justify-center ${agreed ? "bg-clay border-clay" : touched.agreed && errors.agreed ? "border-red-400" : "border-charcoal/30"}`}>
                        {agreed && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    <span className={`text-[13px] font-mono tracking-wide group-hover:text-charcoal transition-colors ${touched.agreed && errors.agreed ? "text-red-500" : "text-stone/90"}`}>
                      I agree to receive emails from The Monolith Project
                    </span>
                  </label>
                  {touched.agreed && errors.agreed && (
                    <p className="flex items-center gap-1.5 -mt-4 text-red-500 text-xs font-mono">
                      <AlertCircle className="w-3 h-3" /> {errors.agreed}
                    </p>
                  )}
                  {submitError && (
                    <p id="newsletter-submit-error" className="flex items-center gap-1.5 -mt-2 text-red-600 text-xs font-mono" role="alert" aria-live="polite">
                      <AlertCircle className="w-3 h-3" /> {submitError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-label={isSubmitting ? "Joining newsletter..." : "Join newsletter list"}
                    className="btn-pill-dark w-full justify-center text-sm disabled:opacity-50 relative overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent skew-x-[-20deg] translate-x-[-200%] group-hover:animate-[shine_1s_ease-in-out_infinite]" />
                    <span className="relative z-10 flex items-center gap-2">
                      {isSubmitting ? "JOINING..." : "JOIN THE LIST"}
                      {!isSubmitting && <ArrowUpRight className="w-4 h-4" />}
                    </span>
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
