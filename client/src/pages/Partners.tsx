import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Handshake, Camera, Music, Shield, Lightbulb,
  Drama, Beer, Wrench, Send, CheckCircle, AlertCircle,
  ArrowUpRight, Star, Users, Zap, Globe
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

// ─── Data ─────────────────────────────────────────────────────────────────────

const partnerTypes = [
  {
    icon: Building2,
    title: "Corporate & Private Events",
    tag: "Full Turnkey Production",
    color: "#E05A3A",
    description:
      "Company parties, brand activations, private celebrations, product launches. We handle everything — sound, lighting, DJ, production, and creative direction. You show up, we deliver the experience.",
    includes: [
      "Full sound system & engineer",
      "DJ / live music curation",
      "Lighting & visual design",
      "Event creative direction",
      "On-site production team",
      "Custom branding integration",
    ],
  },
  {
    icon: Handshake,
    title: "Brand Sponsorships",
    tag: "Authentic Activations",
    color: "#E8B86D",
    description:
      "We work with brands that want to reach a real, engaged community — not just logo placement. Co-branded experiences, activation spaces, product integrations. Always authentic, never forced.",
    includes: [
      "Logo placement & co-branding",
      "On-site activation space",
      "Social media integration",
      "Email list exposure",
      "VIP table packages",
      "Content creation rights",
    ],
  },
  {
    icon: Globe,
    title: "Venue Partners",
    tag: "Host an Event",
    color: "#8B5CF6",
    description:
      "Rooftops, warehouses, galleries, clubs, outdoor spaces. If your venue has the right energy, we'll bring the crowd, sound, and production. You provide the canvas — we build the experience.",
    includes: [
      "Full event production",
      "Crowd & ticket management",
      "Sound & lighting setup",
      "Marketing & promotion",
      "Revenue share model",
      "Ongoing series residency",
    ],
  },
];

const sponsorTiers = [
  {
    name: "Community",
    color: "rgba(255,255,255,0.4)",
    bg: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.1)",
    perks: [
      "Logo on event flyers",
      "Social media mention",
      "2 complimentary tickets",
    ],
  },
  {
    name: "Partner",
    color: "#E8B86D",
    bg: "rgba(232,184,109,0.06)",
    border: "rgba(232,184,109,0.25)",
    perks: [
      "Everything in Community",
      "On-site activation space",
      "Email list feature",
      "4 VIP tickets",
      "Co-branded content",
    ],
    featured: true,
  },
  {
    name: "Presenting",
    color: "#E05A3A",
    bg: "rgba(224,90,58,0.06)",
    border: "rgba(224,90,58,0.25)",
    perks: [
      "Everything in Partner",
      "\"Presented by\" naming rights",
      "Dedicated activation zone",
      "8 VIP tickets + table",
      "Post-event recap content",
      "Season-long partnership",
    ],
  },
];

const productionRoles = [
  { icon: Beer, title: "Bartenders", desc: "Craft cocktails and high-volume service." },
  { icon: Shield, title: "Security", desc: "Professional staff who understand event culture." },
  { icon: Wrench, title: "Stagehands", desc: "Load-in, load-out, setup, teardown." },
  { icon: Camera, title: "Photo & Video", desc: "Capture real moments — not just posed shots." },
  { icon: Lightbulb, title: "Lighting & Visuals", desc: "Atmosphere that matches the music." },
  { icon: Drama, title: "Performers", desc: "Dancers and live performers who add energy." },
  { icon: Music, title: "Live Musicians", desc: "Percussionists, saxophonists, vocalists." },
  { icon: Wrench, title: "Sound Engineers", desc: "FOH and monitor engineers." },
];

type InquiryType = "corporate" | "sponsorship" | "venue" | "crew";

const inquiryOptions: { id: InquiryType; label: string; color: string }[] = [
  { id: "corporate", label: "Corporate / Private Event", color: "#E05A3A" },
  { id: "sponsorship", label: "Brand Sponsorship", color: "#E8B86D" },
  { id: "venue", label: "Venue Partnership", color: "#8B5CF6" },
  { id: "crew", label: "Production Crew", color: "rgba(255,255,255,0.5)" },
];

const inputClass =
  "w-full px-4 py-3.5 text-sm text-white placeholder-white/25 bg-white/[0.04] border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-200";
const labelClass = "block text-[10px] font-mono uppercase tracking-[0.25em] text-white/35 mb-2";

// ─── Component ────────────────────────────────────────────────────────────────

export default function Partners() {
  const [inquiryType, setInquiryType] = useState<InquiryType>("corporate");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [collabType, setCollabType] = useState("");
  const [budget, setBudget] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const activeColor = inquiryOptions.find((o) => o.id === inquiryType)?.color ?? "#E05A3A";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !details) {
      setError("Name, email, and details are required.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: `Partnership Inquiry — ${inquiryOptions.find((o) => o.id === inquiryType)?.label}`,
          message: `
PARTNERSHIP INQUIRY

Type: ${inquiryOptions.find((o) => o.id === inquiryType)?.label}
Name: ${name}
Company / Organization: ${company || "Not provided"}
Email: ${email}
Collab / Partnership Type: ${collabType || "Not specified"}
Budget Range: ${budget || "Not specified"}

Details:
${details}
          `.trim(),
        }),
      });
      if (!res.ok) throw new Error();
      setIsSubmitted(true);
    } catch {
      setError("Something went wrong. Email us at partners@monolithproject.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ background: "#050505" }}>
      <SEO
        title="Partners & Corporate Events"
        description="Corporate events, brand sponsorships, venue partnerships, and production crew — work with The Monolith Project."
      />
      <Navigation />

      {/* Atmosphere */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_20%,rgba(224,90,58,0.07),transparent_50%),radial-gradient(ellipse_at_90%_80%,rgba(139,92,246,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-noise opacity-[0.03]" />
      </div>

      <main className="relative z-10 pt-44 md:pt-52 pb-32">
        <div className="container max-w-6xl mx-auto px-6">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-20"
          >
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/35 block mb-5">
              — Work With Us
            </span>
            <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-[0.82] uppercase tracking-tight-display text-white mb-6">
              PARTNERS &<br />EVENTS
            </h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ originX: 0 }}
              className="h-[2px] w-44 bg-gradient-to-r from-primary via-primary/60 to-transparent mb-8"
            />
            <p className="text-white/50 text-lg leading-relaxed max-w-2xl">
              From corporate events to brand activations to venue partnerships — we build experiences that move people. Let's talk about what we can create together.
            </p>
          </motion.div>

          {/* Partnership types */}
          <div className="grid lg:grid-cols-3 gap-4 mb-20">
            {partnerTypes.map((type, idx) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: idx * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="p-6 relative overflow-hidden"
                style={{ background: `${type.color}08`, border: `1px solid ${type.color}20` }}
              >
                <div className="absolute top-0 left-0 right-0 h-[1px]"
                  style={{ background: `linear-gradient(to right, ${type.color}60, transparent)` }} />

                <div className="w-10 h-10 flex items-center justify-center mb-5"
                  style={{ background: `${type.color}15`, border: `1px solid ${type.color}30` }}>
                  <type.icon className="w-5 h-5" style={{ color: type.color }} />
                </div>

                <p className="font-mono text-[9px] tracking-[0.3em] uppercase mb-2" style={{ color: type.color }}>{type.tag}</p>
                <h2 className="font-display text-xl uppercase text-white mb-3">{type.title}</h2>
                <p className="text-sm text-white/45 leading-relaxed mb-5">{type.description}</p>

                <ul className="space-y-2">
                  {type.includes.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-white/40">
                      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: type.color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Sponsorship tiers */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-8">Sponsorship Tiers</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {sponsorTiers.map((tier, idx) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.45 }}
                  className="p-6 relative overflow-hidden"
                  style={{ background: tier.bg, border: `1px solid ${tier.border}` }}
                >
                  {tier.featured && (
                    <div className="absolute top-0 left-0 right-0 h-[1px]"
                      style={{ background: `linear-gradient(to right, ${tier.color}80, ${tier.color}20, transparent)` }} />
                  )}
                  <div className="flex items-center gap-2 mb-5">
                    {tier.featured && <Star className="w-3.5 h-3.5" style={{ color: tier.color }} />}
                    <p className="font-display text-lg uppercase" style={{ color: tier.color }}>{tier.name}</p>
                  </div>
                  <ul className="space-y-2.5">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2 text-xs text-white/50">
                        <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: tier.color }} />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
            <p className="mt-4 text-xs text-white/25 font-mono">Custom packages available — all pricing discussed directly.</p>
          </motion.div>

          {/* Production crew */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-2">Production Crew</p>
            <p className="text-white/40 text-sm mb-8">We're always building our roster. If you work in events, we want to hear from you.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {productionRoles.map((role, idx) => (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  className="p-4 group"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <role.icon className="w-4 h-4 text-primary/60 mb-3 group-hover:text-primary transition-colors" />
                  <p className="font-display text-sm uppercase text-white mb-1">{role.title}</p>
                  <p className="text-xs text-white/35 leading-relaxed">{role.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Inquiry Form ── */}
          <div className="h-px bg-gradient-to-r from-primary/30 via-white/10 to-transparent mb-16" />

          <div className="grid lg:grid-cols-12 gap-10">
            {/* Left label */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-4"
            >
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-5">Inquire Directly</p>
              <p className="font-display text-3xl uppercase text-white mb-4">Let's Build<br />Something</p>
              <p className="text-sm text-white/40 leading-relaxed mb-8">
                Tell us what you're working on. We'll get back to you within 48 hours.
              </p>
              <div className="space-y-3">
                {[
                  { icon: Users, text: "Corporate events from 50–500 guests" },
                  { icon: Zap, text: "Full turnkey or à la carte production" },
                  { icon: Star, text: "Custom packages for every budget" },
                  { icon: ArrowUpRight, text: "48-hour response guarantee" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-xs text-white/40">
                    <Icon className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right form */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="min-h-[400px] flex flex-col items-center justify-center text-center p-10"
                    style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <div className="w-16 h-16 flex items-center justify-center mb-6"
                      style={{ background: "rgba(224,90,58,0.12)", border: "1px solid rgba(224,90,58,0.3)" }}>
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-display text-3xl uppercase text-white mb-4">Received</h3>
                    <p className="text-white/45 max-w-md text-sm leading-relaxed">
                      We'll review your inquiry and get back to you within 48 hours.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    onSubmit={handleSubmit}
                    className="relative overflow-hidden p-8 md:p-10 space-y-7"
                    style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    {/* Top accent */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[1px] transition-all duration-500"
                      style={{ background: `linear-gradient(to right, ${activeColor}80, ${activeColor}20, transparent)` }}
                    />

                    {/* Inquiry type */}
                    <div>
                      <label className={labelClass}>I'm interested in</label>
                      <div className="grid grid-cols-2 gap-2">
                        {inquiryOptions.map((opt) => {
                          const isActive = inquiryType === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => { setInquiryType(opt.id); setCollabType(""); setBudget(""); }}
                              className="px-4 py-3 text-left font-mono text-[10px] tracking-[0.2em] uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                              style={{
                                background: isActive ? `${opt.color}12` : "rgba(255,255,255,0.03)",
                                border: `1px solid ${isActive ? opt.color + "45" : "rgba(255,255,255,0.07)"}`,
                                color: isActive ? opt.color : "rgba(255,255,255,0.4)",
                              }}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Name + Company */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="partner-name" className={labelClass}>Your Name *</label>
                        <input id="partner-name" value={name} onChange={(e) => setName(e.target.value)}
                          className={inputClass} placeholder="Full name" required />
                      </div>
                      <div>
                        <label htmlFor="partner-company" className={labelClass}>
                          {inquiryType === "crew" ? "Role / Specialty" : "Company / Organization"}
                        </label>
                        <input id="partner-company" value={company} onChange={(e) => setCompany(e.target.value)}
                          className={inputClass}
                          placeholder={inquiryType === "crew" ? "e.g. Photographer, Sound Engineer" : "Company name"} />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="partner-email" className={labelClass}>Email *</label>
                      <input id="partner-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className={inputClass} placeholder="email@company.com" required />
                    </div>

                    {/* Collab type + Budget */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="partner-collab" className={labelClass}>Collab / Partnership Type</label>
                        <select
                          id="partner-collab"
                          value={collabType}
                          onChange={(e) => setCollabType(e.target.value)}
                          className={`${inputClass} appearance-none`}
                        >
                          <option value="" disabled>Select type...</option>
                          {inquiryType === "corporate" && (
                            <>
                              <option value="private-party">Private Party</option>
                              <option value="corporate-event">Corporate Event</option>
                              <option value="product-launch">Product Launch</option>
                              <option value="brand-activation">Brand Activation</option>
                              <option value="holiday-party">Holiday Party</option>
                              <option value="other">Other</option>
                            </>
                          )}
                          {inquiryType === "sponsorship" && (
                            <>
                              <option value="presenting-sponsor">Presenting Sponsor</option>
                              <option value="partner-sponsor">Partner Sponsor</option>
                              <option value="community-sponsor">Community Sponsor</option>
                              <option value="product-placement">Product Placement</option>
                              <option value="content-collab">Content Collaboration</option>
                              <option value="other">Other</option>
                            </>
                          )}
                          {inquiryType === "venue" && (
                            <>
                              <option value="single-event">Single Event</option>
                              <option value="recurring-residency">Recurring Residency</option>
                              <option value="series-home">Series Home Base</option>
                              <option value="pop-up">Pop-Up / One Night</option>
                              <option value="other">Other</option>
                            </>
                          )}
                          {inquiryType === "crew" && (
                            <>
                              <option value="single-event">Single Event</option>
                              <option value="ongoing-roster">Ongoing Roster</option>
                              <option value="seasonal">Seasonal</option>
                              <option value="other">Other</option>
                            </>
                          )}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="partner-budget" className={labelClass}>
                          {inquiryType === "crew" ? "Rate / Expectation" : "Budget Range"}
                        </label>
                        <select
                          id="partner-budget"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className={`${inputClass} appearance-none`}
                        >
                          <option value="" disabled>Select range...</option>
                          {inquiryType === "crew" ? (
                            <>
                              <option value="under-500">Under $500 / event</option>
                              <option value="500-1000">$500 – $1,000 / event</option>
                              <option value="1000-2500">$1,000 – $2,500 / event</option>
                              <option value="2500-plus">$2,500+ / event</option>
                              <option value="discuss">Let's discuss</option>
                            </>
                          ) : (
                            <>
                              <option value="under-2500">Under $2,500</option>
                              <option value="2500-5000">$2,500 – $5,000</option>
                              <option value="5000-10000">$5,000 – $10,000</option>
                              <option value="10000-25000">$10,000 – $25,000</option>
                              <option value="25000-plus">$25,000+</option>
                              <option value="discuss">Let's discuss</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>

                    {/* Details */}
                    <div>
                      <label htmlFor="partner-details" className={labelClass}>
                        {inquiryType === "corporate"
                          ? "Tell us about your event — date, guest count, vision *"
                          : inquiryType === "sponsorship"
                            ? "Tell us about your brand and what you're looking for *"
                            : inquiryType === "venue"
                              ? "Tell us about your space — capacity, location, availability *"
                              : "Tell us about your experience and availability *"}
                      </label>
                      <textarea
                        id="partner-details"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        rows={5}
                        className={`${inputClass} resize-none`}
                        placeholder={
                          inquiryType === "corporate"
                            ? "e.g. Company holiday party, ~150 guests, December 2026, Chicago..."
                            : inquiryType === "sponsorship"
                              ? "e.g. We're a spirits brand looking to activate at 2–3 events this summer..."
                              : inquiryType === "venue"
                                ? "e.g. Rooftop venue, 300 capacity, West Loop, available weekends..."
                                : "e.g. 5 years FOH experience, available weekends, Chicago-based..."
                        }
                        required
                      />
                    </div>

                    {error && (
                      <p className="flex items-center gap-1.5 text-red-400 text-xs font-mono" role="alert">
                        <AlertCircle className="w-3 h-3" /> {error}
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-4 pt-1">
                      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20">
                        48-hour response
                      </p>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-white font-bold tracking-widest uppercase text-xs hover:bg-primary/85 transition-all duration-200 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                      >
                        {isSubmitting ? <span className="animate-pulse">Sending...</span> : (
                          <><span>Send Inquiry</span><Send className="w-3.5 h-3.5" /></>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
