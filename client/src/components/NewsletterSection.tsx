
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
  description = "Chasing Sun(Sets) season is returning. Untold Story chapters continue. Sign up for first drops, exclusive DJ sets from Chasing Sun(Sets) Radio, and priority access.",
  benefits = [
    "First access to tickets",
    "Exclusive Chasing Sun(Sets) Mixes",
    "Untold Story Chapter announcements",
    "Private community drops",
  ],
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
    <section id="newsletter" className="relative section-rhythm-tight bg-[#050505] text-white overflow-hidden">
      {/* Gradient bridge from dark to light - removed, keeping it dark */}
      <div className="absolute inset-0 atmo-surface-soft pointer-events-none opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(34,211,238,0.05),transparent_32%),radial-gradient(circle_at_82%_74%,rgba(224,90,58,0.08),transparent_36%)] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-6 relative z-10">

        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 border border-white/20 bg-white/5 flex items-center justify-center mx-auto mb-8 rounded-full">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-4xl text-white mb-4">YOU'RE IN</h3>
              <p className="text-white/60">
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
                      <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-clay block mb-4">
                        Member Perks
                      </span>
                      <p className="text-white/70 leading-relaxed mb-6">
                        {description}
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="font-serif italic text-lg text-white/60 block mb-4">
                        Newsletter
                      </span>
                      <h2 className="font-display text-section-title text-white mb-6 tracking-tight-display">
                        <GlitchText className="text-white">STAY IN</GlitchText>
                        <br />
                        <GlitchText className="text-white">THE LOOP</GlitchText>
                      </h2>
                      <p className="text-white/70 leading-relaxed mb-8">
                        {description}
                      </p>
                    </>
                  )}

                  {/* What you get */}
                  <div className={`${compactIntro ? "grid gap-2" : "space-y-3"}`}>
                    {benefits.map((item) => (
                      <div key={item} className={`flex items-center gap-3 ${compactIntro ? "rounded-full border border-white/10 bg-white/5 px-3 py-2" : ""}`}>
                        <div className="w-1 h-1 bg-white" />
                        <span className={`text-sm font-mono uppercase ${compactIntro ? "text-white/80 tracking-[0.12em]" : "text-white/60 tracking-wide"}`}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right — form */}
                <form onSubmit={handleSubmit} className="relative z-[60] space-y-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 md:p-7 shadow-2xl" noValidate aria-describedby={submitError ? "newsletter-submit-error" : undefined}>
                  <div className="relative">
                    <label htmlFor="email" className="ui-chip text-white/50 block mb-2">
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
                      <label htmlFor="firstName" className="ui-chip text-white/50 block mb-2">
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
                      <label htmlFor="lastName" className="ui-chip text-white/50 block mb-2">
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
                      <div className={`w-4 h-4 border transition-colors flex items-center justify-center ${agreed ? "bg-white border-white" : touched.agreed && errors.agreed ? "border-red-400" : "border-white/30"}`}>
                        {agreed && <Check className="w-3 h-3 text-black" />}
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
                    className="w-full py-4 rounded-full bg-white text-black font-display font-bold tracking-widest text-sm disabled:opacity-50 relative overflow-hidden group hover:bg-white/90 transition-colors"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
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
