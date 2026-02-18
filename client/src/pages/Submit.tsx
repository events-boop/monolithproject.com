import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Music, Sun, Mic2, ArrowUpRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

// ─── Types ───────────────────────────────────────────────────────────────────

type SeriesFit = "chasing-sunsets" | "untold-story" | "both" | "unsure";

type FormState = {
    artistName: string;
    realName: string;
    email: string;
    city: string;
    seriesFit: SeriesFit;
    genres: string;
    mixUrl: string;
    socialUrl: string;
    bio: string;
    availability: string;
    hasPlayed: string;
};

const defaultForm: FormState = {
    artistName: "",
    realName: "",
    email: "",
    city: "",
    seriesFit: "unsure",
    genres: "",
    mixUrl: "",
    socialUrl: "",
    bio: "",
    availability: "",
    hasPlayed: "",
};

// ─── Series fit options ───────────────────────────────────────────────────────

const seriesOptions: { id: SeriesFit; label: string; sub: string; color: string; icon: React.ElementType }[] = [
    {
        id: "chasing-sunsets",
        label: "Chasing Sun(Sets)",
        sub: "Rooftop · Golden Hour · Afro / Organic House",
        color: "#E8B86D",
        icon: Sun,
    },
    {
        id: "untold-story",
        label: "Untold Story",
        sub: "Late Night · 360° Immersive · Melodic / Deep",
        color: "#8B5CF6",
        icon: Mic2,
    },
    {
        id: "both",
        label: "Both Series",
        sub: "I can flex across vibes",
        color: "#E05A3A",
        icon: Music,
    },
    {
        id: "unsure",
        label: "Not Sure",
        sub: "Let the music decide",
        color: "rgba(255,255,255,0.3)",
        icon: Music,
    },
];

// ─── What we look for ────────────────────────────────────────────────────────

const lookFor = [
    { label: "Sound", desc: "Afro house, melodic house, organic house, global rhythms. We don't do generic." },
    { label: "Journey", desc: "We want selectors who build a story — not just play tracks back to back." },
    { label: "Community", desc: "Artists who show up for the culture, not just the gig." },
    { label: "Professionalism", desc: "On time, prepared, and easy to work with. The basics matter." },
    { label: "Originality", desc: "Your own voice. Your own selections. Not a copy of someone else's set." },
];

// ─── Styles ──────────────────────────────────────────────────────────────────

const inputClass =
    "w-full px-4 py-3.5 text-sm text-white placeholder-white/25 bg-white/[0.04] border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-200";

const labelClass = "block text-[10px] font-mono uppercase tracking-[0.25em] text-white/35 mb-2";

// ─── Component ───────────────────────────────────────────────────────────────

export default function Submit() {
    const [form, setForm] = useState<FormState>(defaultForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const set = (field: keyof FormState) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.artistName || !form.email || !form.mixUrl) {
            setError("Artist name, email, and a mix link are required.");
            return;
        }
        setIsSubmitting(true);
        setError("");
        try {
            // Submit via contact endpoint — same infrastructure as booking
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.realName || form.artistName,
                    email: form.email,
                    subject: `Artist Submission — ${form.artistName}`,
                    message: `
ARTIST SUBMISSION

Artist Name: ${form.artistName}
Real Name: ${form.realName || "Not provided"}
Email: ${form.email}
City: ${form.city}
Series Fit: ${form.seriesFit}
Genres: ${form.genres}
Mix / Demo URL: ${form.mixUrl}
Social / EPK: ${form.socialUrl || "Not provided"}
Availability: ${form.availability || "Not provided"}
Played Chicago Before: ${form.hasPlayed || "Not specified"}

Bio / Statement:
${form.bio}
          `.trim(),
                }),
            });
            if (!res.ok) throw new Error("Submission failed");
            setIsSubmitted(true);
        } catch {
            setError("Something went wrong. Email us directly at bookings@monolithproject.com");
        } finally {
            setIsSubmitting(false);
        }
    };

    const activeColor = seriesOptions.find((s) => s.id === form.seriesFit)?.color ?? "#E05A3A";

    return (
        <div className="min-h-screen text-white relative overflow-hidden" style={{ background: "#050505" }}>
            <SEO
                title="Artist Submission"
                description="Submit your mix or demo to The Monolith Project. We're always looking for selectors who fit the Chasing Sun(Sets) or Untold Story vibe."
            />
            <Navigation />

            {/* Atmosphere */}
            <div className="pointer-events-none fixed inset-0 z-0">
                <div
                    className="absolute inset-0 transition-all duration-700"
                    style={{
                        background: `radial-gradient(ellipse at 15% 25%, ${activeColor}08, transparent 50%), radial-gradient(ellipse at 85% 75%, ${activeColor}05, transparent 50%)`,
                    }}
                />
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
                            — Join The Lineup
                        </span>
                        <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-[0.82] uppercase tracking-tight-display text-white mb-6">
                            ARTIST<br />SUBMISSION
                        </h1>
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            style={{ originX: 0 }}
                            className="h-[2px] w-44 bg-gradient-to-r from-primary via-primary/60 to-transparent mb-8"
                        />
                        <p className="text-white/50 text-lg leading-relaxed max-w-2xl">
                            We're always building the pipeline. If your sound fits the vibe, drop your mix here. We listen to everything.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-12 gap-12">

                        {/* Left — what we look for */}
                        <motion.div
                            initial={{ opacity: 0, x: -16 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="lg:col-span-4"
                        >
                            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-6">What We Look For</p>
                            <ul className="space-y-5 mb-10">
                                {lookFor.map((item) => (
                                    <li key={item.label} className="flex items-start gap-4">
                                        <span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-white/80 font-medium mb-0.5">{item.label}</p>
                                            <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-8 border-t border-white/8">
                                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/25 mb-3">Response Time</p>
                                <p className="text-xs text-white/40 leading-relaxed">
                                    We review submissions on a rolling basis. If there's a fit, we'll reach out within 4–6 weeks. Not every submission gets a response — but every one gets listened to.
                                </p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/8">
                                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/25 mb-3">Already Have a Booking Inquiry?</p>
                                <a
                                    href="/booking"
                                    className="inline-flex items-center gap-1.5 text-xs text-primary/70 hover:text-primary transition-colors font-mono"
                                >
                                    Use the Booking Form instead
                                    <ArrowUpRight className="w-3 h-3" />
                                </a>
                            </div>
                        </motion.div>

                        {/* Right — form */}
                        <div className="lg:col-span-8">
                            <AnimatePresence mode="wait">
                                {isSubmitted ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.97 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="min-h-[500px] flex flex-col items-center justify-center text-center p-10"
                                        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }}
                                    >
                                        <div
                                            className="w-16 h-16 flex items-center justify-center mb-6"
                                            style={{ background: "rgba(224,90,58,0.12)", border: "1px solid rgba(224,90,58,0.3)" }}
                                        >
                                            <CheckCircle className="w-8 h-8 text-primary" />
                                        </div>
                                        <h2 className="font-display text-3xl uppercase text-white mb-4">Submitted</h2>
                                        <p className="text-white/45 max-w-md text-sm leading-relaxed">
                                            We've got your mix. If there's a fit, we'll be in touch within 4–6 weeks. Keep creating.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        initial={{ opacity: 0, y: 18 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                        onSubmit={handleSubmit}
                                        className="relative overflow-hidden p-5 md:p-8 lg:p-10 space-y-8"
                                        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }}
                                    >
                                        {/* Top accent — changes with series selection */}
                                        <div
                                            className="absolute top-0 left-0 right-0 h-[1px] transition-all duration-500"
                                            style={{ background: `linear-gradient(to right, ${activeColor}80, ${activeColor}20, transparent)` }}
                                        />

                                        {/* Series fit selector */}
                                        <div>
                                            <label className={labelClass}>Which series fits your sound?</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {seriesOptions.map((opt) => {
                                                    const isActive = form.seriesFit === opt.id;
                                                    return (
                                                        <button
                                                            key={opt.id}
                                                            type="button"
                                                            onClick={() => setForm((p) => ({ ...p, seriesFit: opt.id }))}
                                                            className="flex items-start gap-3 p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                                            style={{
                                                                background: isActive ? `${opt.color}10` : "rgba(255,255,255,0.03)",
                                                                border: `1px solid ${isActive ? opt.color + "45" : "rgba(255,255,255,0.07)"}`,
                                                            }}
                                                        >
                                                            <opt.icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: isActive ? opt.color : "rgba(255,255,255,0.25)" }} />
                                                            <div>
                                                                <p className="text-xs font-mono tracking-wide" style={{ color: isActive ? opt.color : "rgba(255,255,255,0.5)" }}>
                                                                    {opt.label}
                                                                </p>
                                                                <p className="text-[10px] text-white/30 mt-0.5 leading-snug">{opt.sub}</p>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Artist name + Real name */}
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="submit-artist" className={labelClass}>Artist Name *</label>
                                                <input
                                                    id="submit-artist"
                                                    value={form.artistName}
                                                    onChange={set("artistName")}
                                                    className={inputClass}
                                                    placeholder="Your DJ / artist name"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="submit-real" className={labelClass}>Real Name</label>
                                                <input
                                                    id="submit-real"
                                                    value={form.realName}
                                                    onChange={set("realName")}
                                                    className={inputClass}
                                                    placeholder="Optional"
                                                />
                                            </div>
                                        </div>

                                        {/* Email + City */}
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="submit-email" className={labelClass}>Email *</label>
                                                <input
                                                    id="submit-email"
                                                    type="email"
                                                    value={form.email}
                                                    onChange={set("email")}
                                                    className={inputClass}
                                                    placeholder="email@address.com"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="submit-city" className={labelClass}>City / Based In</label>
                                                <input
                                                    id="submit-city"
                                                    value={form.city}
                                                    onChange={set("city")}
                                                    className={inputClass}
                                                    placeholder="Chicago, IL"
                                                />
                                            </div>
                                        </div>

                                        {/* Mix URL + Social */}
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="submit-mix" className={labelClass}>Mix / Demo Link *</label>
                                                <input
                                                    id="submit-mix"
                                                    value={form.mixUrl}
                                                    onChange={set("mixUrl")}
                                                    className={inputClass}
                                                    placeholder="SoundCloud, Mixcloud, Drive..."
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="submit-social" className={labelClass}>Instagram / EPK</label>
                                                <input
                                                    id="submit-social"
                                                    value={form.socialUrl}
                                                    onChange={set("socialUrl")}
                                                    className={inputClass}
                                                    placeholder="@handle or link"
                                                />
                                            </div>
                                        </div>

                                        {/* Genres */}
                                        <div>
                                            <label htmlFor="submit-genres" className={labelClass}>Genres / Sound Description</label>
                                            <input
                                                id="submit-genres"
                                                value={form.genres}
                                                onChange={set("genres")}
                                                className={inputClass}
                                                placeholder="e.g. Afro House, Melodic Techno, Organic House..."
                                            />
                                        </div>

                                        {/* Bio */}
                                        <div>
                                            <label htmlFor="submit-bio" className={labelClass}>Artist Statement / Bio</label>
                                            <textarea
                                                id="submit-bio"
                                                value={form.bio}
                                                onChange={set("bio")}
                                                rows={4}
                                                className={`${inputClass} resize-none`}
                                                placeholder="Tell us who you are, what you bring to a room, and why you'd be a fit for Monolith..."
                                            />
                                        </div>

                                        {/* Availability + Played Chicago */}
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="submit-avail" className={labelClass}>Availability</label>
                                                <input
                                                    id="submit-avail"
                                                    value={form.availability}
                                                    onChange={set("availability")}
                                                    className={inputClass}
                                                    placeholder="e.g. Summer 2026, weekends..."
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="submit-played" className={labelClass}>Played Chicago Before?</label>
                                                <select
                                                    id="submit-played"
                                                    value={form.hasPlayed}
                                                    onChange={set("hasPlayed")}
                                                    className={`${inputClass} appearance-none`}
                                                    style={{ backgroundImage: "none" }}
                                                >
                                                    <option value="" disabled>Select...</option>
                                                    <option value="yes-regularly">Yes, regularly</option>
                                                    <option value="yes-few-times">Yes, a few times</option>
                                                    <option value="yes-once">Yes, once</option>
                                                    <option value="no">No, first time</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Error */}
                                        {error && (
                                            <p className="flex items-center gap-1.5 text-red-400 text-xs font-mono" role="alert">
                                                <AlertCircle className="w-3 h-3" />
                                                {error}
                                            </p>
                                        )}

                                        {/* Submit */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                                            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20">
                                                * Required fields
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
                                                        <span>Submit Mix</span>
                                                        <Send className="w-3.5 h-3.5" />
                                                    </>
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
