
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Check, ArrowUpRight, AlertCircle, Sparkles, Radio, MapPinned } from "lucide-react";
import { submitNewsletterLead } from "@/lib/api";
import { signalChirp } from "@/lib/SignalChirpEngine";
import HoneypotField from "./HoneypotField";
import { buildFunnelLeadFields, buildLeadIdempotencyKey } from "@/lib/leadCapture";
import { honeypotFieldName } from "@shared/generated/hardening";

interface NewsletterSectionProps {
  source?: string;
}

const invitationNotes = [
  {
    icon: Sparkles,
    label: "Early access",
    copy: "Get ticket windows and limited drops before the general public.",
  },
  {
    icon: MapPinned,
    label: "Event updates",
    copy: "See lineup announcements, venue notes, and important changes in one place.",
  },
  {
    icon: Radio,
    label: "Radio drops",
    copy: "New mixes, artist sessions, and Monolith updates without the filler.",
  },
] as const;

export default function NewsletterSection({
  source = "newsletter_section",
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
  const [botCheck, setBotCheck] = useState(""); // Honeypot state
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isSubmitted && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isSubmitted]);

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
          phone: phone || undefined,
          consent: true,
          source,
          ...buildFunnelLeadFields({
            funnelId: "newsletter_section",
            offerId: "inner_circle",
            interestTags: ["newsletter", "always-on"],
          }),
          utmContent: phone ? "sms_interest" : undefined,
          [honeypotFieldName]: botCheck || undefined,
        },
        buildLeadIdempotencyKey(source, email)
      );
      signalChirp.boot();
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="newsletter" ref={sectionRef} className="relative py-24 md:py-32 bg-[#050505] text-white border-t border-white/10">
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />

      <div className="container layout-wide px-6 relative z-10">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative max-w-2xl mx-auto border border-white/20 bg-black/60 p-12 backdrop-blur-3xl overflow-hidden group"
            >
              <div className="absolute inset-0 bg-noise opacity-[0.05]" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[100px]" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 border border-primary/40 flex items-center justify-center mb-10 bg-primary/5">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                
                <span className="font-mono text-[11px] text-primary tracking-[0.5em] uppercase mb-4">Membership Secured</span>
                <h3 className="font-heavy text-4xl md:text-6xl uppercase tracking-tighter text-white mb-8">Welcome To The Circle</h3>
                <p className="max-w-xl text-center text-base text-white/60 mb-10 leading-relaxed">
                  We&apos;ll send new dates, ticket windows, lineup news, and radio drops when they matter.
                </p>
                
                <div className="w-full border-y border-white/10 py-10 mb-10 grid md:grid-cols-2 gap-12 text-left">
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-[11px] text-white/40 uppercase tracking-widest">Name</span>
                    <span className="font-heavy text-2xl text-white uppercase">{firstName || "You"}</span>
                  </div>
                  <div className="flex flex-col gap-2 text-right md:text-left">
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Signed Up On</span>
                    <span className="font-heavy text-lg text-white/80">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">What You&apos;ll Get</span>
                    <span className="font-heavy text-lg text-white/80">Dates, ticket windows, lineup news, and radio drops</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <a 
                    href="/schedule"
                    className="flex-1 py-5 bg-white text-black font-heavy text-xs uppercase tracking-[0.2em] hover:pr-12 transition-all relative flex items-center justify-center group"
                  >
                    <span>View Schedule</span>
                    <ArrowUpRight className="w-4 h-4 ml-3" />
                  </a>
                  <a 
                    href="/"
                    className="flex-1 py-5 border border-white/10 font-heavy text-xs uppercase tracking-[0.2em] hover:bg-white/5 transition-all flex items-center justify-center gap-3 group"
                  >
                    <span>Back Home</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </a>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`grid lg:grid-cols-[1fr_1.1fr] items-start gap-16 lg:gap-24`}
            >
              {/* Left — massive cinematic copy */}
              <div className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.5em] text-primary font-bold">
                    INVENTORY IS CAPPED TO PROTECT THE ROOM.
                  </span>
                  <div className="h-[1px] w-24 bg-white/10" />
                </div>
                
                <h2 className="font-heavy text-[clamp(4.5rem,8vw,9rem)] leading-[0.85] tracking-tighter uppercase text-white mb-10 flex flex-col">
                  <span className="text-white/40">NEXT</span>
                  <span>DROP.</span>
                </h2>
                
                <p className="font-sans text-xl md:text-2xl text-white/80 leading-relaxed font-light mb-12 max-w-xl">
                  Get ticket windows and limited drops before the general public. No generic blasts. Just world-class electronic music in spaces designed for it.
                </p>

                <div className="grid gap-6 border-t border-white/5 pt-12">
                  {invitationNotes.map((item) => (
                    <div key={item.label} className="flex items-start gap-6 group">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/10 bg-[#050505] transition-colors group-hover:border-primary">
                        <item.icon className="h-5 w-5 text-white/60 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="font-heavy text-2xl uppercase tracking-tight text-white/90 group-hover:text-white transition-colors">
                          {item.label}
                        </p>
                        <p className="font-sans text-sm text-white/60 mt-1 max-w-sm group-hover:text-white/80 transition-colors">
                          {item.copy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Brutalist Form */}
              <form 
                onSubmit={handleSubmit} 
                className="relative z-20 flex flex-col gap-8 bg-[#050505] border border-white/10 p-8 md:p-12 xl:p-16" 
                noValidate 
                aria-describedby={submitError ? "newsletter-submit-error" : undefined}
              >
                <div className="mb-4">
                  <h3 className="font-heavy text-4xl uppercase tracking-tighter text-white mb-2">Join The Newsletter</h3>
                  <p className="font-sans text-sm text-white/60 font-light">
                    Email is required. Phone is optional if you want text-first drops.
                  </p>
                </div>

                {/* Honeypot: Bot Trap */}
                <HoneypotField
                  value={botCheck}
                  onChange={(e) => setBotCheck(e.target.value)}
                />

                {/* Inputs */}
                <div className="flex flex-col gap-8">
                  <div className="relative group">
                    <label htmlFor="firstName" className="font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] text-white/60 block mb-3 group-hover:text-white/80 transition-colors">
                      First Name (Optional)
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter name"
                      className="w-full bg-transparent border-0 border-b border-white/10 px-0 py-3 text-white text-xl md:text-2xl font-light placeholder:text-white/40 focus:outline-none focus:ring-0 focus:border-white transition-colors rounded-none"
                    />
                  </div>

                  <div className="relative group">
                    <label htmlFor="email" className={`font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] block mb-3 transition-colors ${touched.email && errors.email ? "text-primary" : "text-white/60 group-hover:text-white/80"}`}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      autoComplete="email"
                      aria-describedby={touched.email && errors.email ? "newsletter-email-error" : undefined}
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
                      className={`w-full bg-transparent border-0 border-b px-0 py-3 text-white text-xl md:text-2xl font-light placeholder:text-white/40 focus:outline-none focus:ring-0 transition-colors rounded-none ${touched.email && errors.email ? "border-primary" : "border-white/10 focus:border-white"}`}
                    />
                    {touched.email && errors.email && (
                      <p id="newsletter-email-error" className="flex items-center gap-2 mt-3 text-primary text-[11px] font-mono uppercase tracking-[0.1em]">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="relative group">
                    <label htmlFor="phone" className="font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] text-white/60 block mb-3 group-hover:text-white/80 transition-colors">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      autoComplete="tel"
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (000) 000-0000"
                      className="w-full bg-transparent border-0 border-b border-white/10 px-0 py-3 text-white text-xl md:text-2xl font-light placeholder:text-white/40 focus:outline-none focus:ring-0 focus:border-white transition-colors rounded-none"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex flex-col gap-6 mt-4">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative mt-1 shrink-0">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => {
                          setAgreed(e.target.checked);
                          setTouched(prev => ({ ...prev, agreed: true }));
                          if (e.target.checked) setErrors(prev => { const { agreed: _, ...rest } = prev; return rest; });
                        }}
                        className="peer sr-only"
                      />
                      <div className={`w-5 h-5 border transition-all flex items-center justify-center rounded-none ${agreed ? "bg-white border-white text-black" : touched.agreed && errors.agreed ? "border-primary text-primary" : "border-white/20 group-hover:border-white/40"}`}>
                        {agreed && <Check className="w-4 h-4" />}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-mono text-xs uppercase tracking-[0.1em] transition-colors leading-relaxed ${touched.agreed && errors.agreed ? "text-primary" : "text-white/60 group-hover:text-white/80"}`}>
                        I agree to receive updates and event announcements.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative mt-1 shrink-0">
                      <input
                        type="checkbox"
                        checked={isAdult}
                        onChange={(e) => {
                          setIsAdult(e.target.checked);
                          setTouched(prev => ({ ...prev, isAdult: true }));
                          if (e.target.checked) setErrors(prev => { const { isAdult: _, ...rest } = prev; return rest; });
                        }}
                        className="peer sr-only"
                      />
                      <div className={`w-5 h-5 border transition-all flex items-center justify-center rounded-none ${isAdult ? "bg-white border-white text-black" : touched.isAdult && errors.isAdult ? "border-primary text-primary" : "border-white/20 group-hover:border-white/40"}`}>
                        {isAdult && <Check className="w-4 h-4" />}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-mono text-xs uppercase tracking-[0.1em] transition-colors leading-relaxed ${touched.isAdult && errors.isAdult ? "text-primary" : "text-white/60 group-hover:text-white/80"}`}>
                        I confirm that I am 18 years of age or older.
                      </span>
                    </div>
                  </label>
                </div>

                {submitError && (
                  <p id="newsletter-submit-error" className="flex items-center gap-2 mt-2 text-primary text-[10px] font-mono uppercase tracking-[0.1em]">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 w-full py-6 md:py-8 bg-white border border-white text-black font-heavy text-2xl md:text-3xl uppercase tracking-tighter disabled:opacity-50 transition-all duration-500 hover:bg-black hover:text-white flex items-center justify-between px-8 md:px-10 group"
                >
                  <span>{isSubmitting ? "TRANSMITTING..." : "SECURE MEMBERSHIP"}</span>
                  {!isSubmitting && <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2" />}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
