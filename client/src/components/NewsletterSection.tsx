
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Check, ArrowUpRight, AlertCircle, Sparkles, Radio, MapPinned } from "lucide-react";
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

const invitationNotes = [
  {
    icon: Sparkles,
    label: "Private invitations",
    copy: "Get first notice when we drop something limited, intimate, or unexpected.",
  },
  {
    icon: MapPinned,
    label: "Secret locations",
    copy: "Stay close to the details before the rest of the room catches up.",
  },
  {
    icon: Radio,
    label: "Signal before noise",
    copy: "Lineups, mixes, and community updates without the filler.",
  },
] as const;

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
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isAdult, setIsAdult] = useState(false);
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
    if (!isAdult) newErrors.isAdult = "Please confirm you are 18 or older";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setTouched({ email: true, agreed: true, isAdult: true });
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
          consent: true,
          source,
          utmContent: phone ? "sms_interest" : undefined,
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
              <h3 className="font-display text-4xl text-white mb-4">YOU'RE ON THE LIST</h3>
              <p className="text-white/60 max-w-xl mx-auto">
                Expect first access to lineups, secret drops, and private invitations before they hit the wider feed.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={`grid md:grid-cols-[1.05fr_0.95fr] items-start ${compactIntro ? "gap-10 md:gap-12" : "gap-16"}`}>

                {/* Left — copy */}
                <div>
                  {compactIntro ? (
                    <>
                      <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-clay block mb-4">
                        Inner Circle Access
                      </span>
                      <p className="text-white/70 leading-relaxed mb-4 max-w-xl">
                        Be the first to know. Be part of the story.
                      </p>
                      <p className="text-white/48 leading-relaxed mb-6 max-w-xl">
                        Get involved and stay close to upcoming experiences, from lineups and limited-access venues to invitation-only moments.
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="font-serif italic text-lg text-white/60 block mb-4">
                        Join Us
                      </span>
                      <h2 className="font-display text-section-title text-white mb-6 tracking-tight-display">
                        <GlitchText className="text-white">JOIN THE</GlitchText>
                        <br />
                        <GlitchText className="text-white">INNER CIRCLE</GlitchText>
                      </h2>
                      <p className="text-white/70 leading-relaxed mb-3 max-w-xl">
                        Be the first to know. Be part of the story.
                      </p>
                      <p className="text-white/48 leading-relaxed mb-8 max-w-xl">
                        Get first access to lineups, secret locations, private invitations, and Monolith updates without the generic blast-email feel.
                      </p>
                    </>
                  )}

                  <div className="grid gap-3 mb-8">
                    {invitationNotes.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-sm"
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-clay">
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-display text-lg uppercase text-white">{item.label}</p>
                            <p className="mt-1 text-sm leading-relaxed text-white/52">{item.copy}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

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
                <form action="/api/leads" method="POST" onSubmit={handleSubmit} className="relative z-[60] space-y-6 rounded-[2rem] border border-white/12 bg-[linear-gradient(165deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] backdrop-blur-xl p-6 md:p-8 shadow-2xl" noValidate aria-describedby={submitError ? "newsletter-submit-error" : undefined}>
                  <div className="space-y-3 border-b border-white/10 pb-5">
                    <span className="font-mono text-[10px] tracking-[0.26em] uppercase text-clay/85">Join Us</span>
                    <div>
                      <h3 className="font-display text-[clamp(2rem,5vw,3rem)] leading-[0.9] uppercase text-white">Get Early Access</h3>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-white/55">
                        Email is all we need. Add your phone only if you want text-first updates when something special drops.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <label htmlFor="firstName" className="ui-chip text-white/50 block mb-2">
                        First Name <span className="text-white/30">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Erik"
                        autoComplete="given-name"
                        className="w-full rounded-2xl bg-white/90 border border-charcoal/15 px-4 py-4 text-charcoal placeholder:text-stone/70 focus:outline-none focus:border-l-4 focus:border-l-clay transition-all duration-200"
                      />
                    </div>
                  </div>

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
                      autoComplete="email"
                      aria-invalid={Boolean(touched.email && errors.email)}
                      aria-describedby={touched.email && errors.email ? "newsletter-email-error" : undefined}
                      className={`w-full rounded-2xl bg-white/90 border px-4 py-4 text-charcoal placeholder:text-stone/70 focus:outline-none focus:border-l-4 focus:border-l-clay transition-all duration-200 ${touched.email && errors.email ? "border-red-400" : "border-charcoal/15"}`}
                    />
                    {touched.email && errors.email && (
                      <p id="newsletter-email-error" className="flex items-center gap-1.5 mt-1.5 text-red-500 text-xs font-mono">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="phone" className="ui-chip text-white/50 block mb-2">
                        Phone Number <span className="text-white/30">(Optional, for text alerts)</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(312) 555-0148"
                        autoComplete="tel"
                        className="w-full rounded-2xl bg-white/90 border border-charcoal/15 px-4 py-4 text-charcoal placeholder:text-stone/70 focus:outline-none focus:border-l-4 focus:border-l-clay transition-all duration-200"
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
                      I agree to receive updates and event announcements from The Monolith Project.
                    </span>
                  </label>
                  {touched.agreed && errors.agreed && (
                    <p className="flex items-center gap-1.5 -mt-4 text-red-500 text-xs font-mono">
                      <AlertCircle className="w-3 h-3" /> {errors.agreed}
                    </p>
                  )}

                  <label className="flex items-start gap-3 cursor-pointer group -mt-1">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={isAdult}
                        onChange={(e) => {
                          setIsAdult(e.target.checked);
                          setTouched(prev => ({ ...prev, isAdult: true }));
                          if (e.target.checked) {
                            setErrors(prev => {
                              const { isAdult: _isAdult, ...rest } = prev;
                              return rest;
                            });
                          }
                        }}
                        className="peer sr-only"
                      />
                      <div className={`w-4 h-4 border transition-colors flex items-center justify-center ${isAdult ? "bg-white border-white" : touched.isAdult && errors.isAdult ? "border-red-400" : "border-white/30"}`}>
                        {isAdult && <Check className="w-3 h-3 text-black" />}
                      </div>
                    </div>
                    <span className={`text-[13px] font-mono tracking-wide group-hover:text-charcoal transition-colors ${touched.isAdult && errors.isAdult ? "text-red-500" : "text-stone/90"}`}>
                      I confirm that I am 18 years old or older.
                    </span>
                  </label>
                  {touched.isAdult && errors.isAdult && (
                    <p className="flex items-center gap-1.5 -mt-4 text-red-500 text-xs font-mono">
                      <AlertCircle className="w-3 h-3" /> {errors.isAdult}
                    </p>
                  )}

                  {submitError && (
                    <p id="newsletter-submit-error" className="flex items-center gap-1.5 -mt-2 text-red-600 text-xs font-mono" role="alert" aria-live="polite">
                      <AlertCircle className="w-3 h-3" /> {submitError}
                    </p>
                  )}

                  <p className="text-[11px] leading-relaxed text-white/40">
                    You can unsubscribe anytime. Phone number is only used for priority text updates when enabled in future drops.
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-label={isSubmitting ? "Joining newsletter..." : "Get early access"}
                    className="w-full py-4 rounded-full bg-white text-black font-display font-bold tracking-widest text-sm disabled:opacity-50 relative overflow-hidden group hover:bg-white/90 transition-colors"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? "JOINING..." : "GET EARLY ACCESS"}
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
