import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Instagram, Sparkles, Copy, CheckCircle, ArrowRight, Gift, AlertCircle, Share2 } from "lucide-react";
import { signalChirp } from "@/lib/SignalChirpEngine";
import { submitNewsletterLead } from "@/lib/api";
import type { ScheduledEvent } from "@/data/events";
import {
    buildCommunityShareUrl,
    buildFunnelLeadFields,
    buildLeadIdempotencyKey,
    normalizeInstagramHandle,
    splitFullName,
} from "@/lib/leadCapture";
import HoneypotField from "./HoneypotField";
import { honeypotFieldName } from "@shared/generated/hardening";

interface GiveawayFunnelProps {
    event?: ScheduledEvent;
}

export default function GiveawayFunnel({ event }: GiveawayFunnelProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [copied, setCopied] = useState(false);
    const [shared, setShared] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [handle, setHandle] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [botCheck, setBotCheck] = useState(""); // Honeypot state
    const shareUrl = useMemo(() => buildCommunityShareUrl(event), [event]);
    const eventLabel = event?.headline || event?.title;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        signalChirp.click();
        setStatus("loading");
        setErrorMsg("");

        const { firstName, lastName } = splitFullName(fullName);
        const instagramHandle = normalizeInstagramHandle(handle);

        try {
            await submitNewsletterLead(
                {
                    email: email.trim(),
                    firstName: firstName || undefined,
                    lastName,
                    instagramHandle: instagramHandle || undefined,
                    consent: true,
                    source: "giveaway_funnel",
                    ...buildFunnelLeadFields({
                        funnelId: "giveaway_entry",
                        offerId: "crew_access",
                        event,
                        interestTags: ["giveaway", "social-share"],
                    }),
                    utmContent: instagramHandle ? `ig:${instagramHandle}` : undefined,
                    [honeypotFieldName]: botCheck || undefined,
                },
                buildLeadIdempotencyKey("giveaway_funnel", email, event?.id),
            );
            signalChirp.boot();
            setStatus("success");
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
            setStatus("error");
        }
    };

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setShared(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareEntry = async () => {
        const sharePayload = {
            title: eventLabel ? `${eventLabel} | The Monolith Project` : "The Monolith Project",
            text: eventLabel
                ? `I'm on the list for ${eventLabel}. Lock in early.`
                : "I'm on the list for the next Monolith drop. Lock in early.",
            url: shareUrl,
        };

        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share(sharePayload);
                setShared(true);
                return;
            } catch {
                // Fall back to clipboard if native share is dismissed or unavailable.
            }
        }

        await copyToClipboard();
    };

    return (
        <section className="relative w-full py-24 lg:py-40 overflow-hidden bg-black flex items-center justify-center border-y border-white/5">
            {/* Architectural Grid Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>

            {/* Atmosphere Orbs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container relative z-10 px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-6xl mx-auto rounded-[2rem] p-[1px] bg-gradient-to-b from-white/10 via-white/5 to-transparent relative shadow-[0_40px_100px_rgba(0,0,0,0.6)] bg-scanlines"
                >
                    {/* Inner Card */}
                    <div className="bg-[#0a0a0c]/80 backdrop-blur-3xl rounded-[2rem] overflow-hidden grid lg:grid-cols-12 relative">
                        
                        {/* Header/Prize Section */}
                        <div className="lg:col-span-7 p-10 lg:p-20 border-b lg:border-b-0 lg:border-r border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 1 }}
                                className="inline-flex items-center gap-3 px-4 py-2 mb-10 rounded-full border border-primary/20 bg-primary/5"
                            >
                                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-primary font-bold">
                                    Open Entry
                                </span>
                            </motion.div>

                            <h2 className="font-display text-5xl lg:text-7xl uppercase tracking-[0.1em] text-white mb-10 leading-[0.9] drop-shadow-2xl">
                                Enter The <span className="text-primary italic">Guest</span> <br />List
                            </h2>

                            <div className="h-px w-20 bg-white/10 mb-10" />

                            {eventLabel ? (
                                <p className="text-primary/85 text-[10px] mb-6 font-mono uppercase tracking-[0.4em]">
                                    {eventLabel}{event?.date ? ` · ${event.date}` : ""}
                                </p>
                            ) : null}

                            <p className="text-white/50 text-base md:text-lg mb-12 max-w-lg leading-relaxed font-mono uppercase tracking-widest text-balance">
                                Enter for a chance at guest list spots, private room access, and artist-connected perks for the next night.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 font-mono text-[11px] tracking-[0.15em] uppercase">
                                {[
                                    { text: "Guest list spots", icon: Gift },
                                    { text: "Private Room Entry", icon: Sparkles },
                                    { text: "Artist-connected perks", icon: CheckCircle },
                                    { text: "Priority event updates", icon: Gift }
                                ].map((perk, i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + (i * 0.1), duration: 0.8 }}
                                        className="flex items-center gap-4 group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0 group-hover:border-primary/40 transition-colors duration-500">
                                            <perk.icon className="w-4 h-4 text-white/30 group-hover:text-primary transition-colors duration-500" />
                                        </div>
                                        <span className="text-white/40 group-hover:text-white/70 transition-colors duration-500">{perk.text}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="lg:col-span-5 p-10 lg:p-16 relative flex flex-col justify-center bg-white/[0.01]">
                            <AnimatePresence mode="wait">
                                {status === "success" ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center text-center"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                            className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-10 border border-primary/20"
                                        >
                                            <CheckCircle className="w-10 h-10 text-primary" />
                                        </motion.div>

                                        <h3 className="font-display text-3xl uppercase text-white mb-4 tracking-widest">You're In</h3>
                                        <p className="text-[11px] text-white/40 mb-10 font-mono uppercase tracking-[0.2em] max-w-xs">
                                            Your entry has been recorded.
                                        </p>

                                        <div className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-left mb-6 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none text-white group-hover:opacity-[0.05] transition-opacity duration-700">
                                                <Sparkles className="w-32 h-32" />
                                            </div>
                                            <h4 className="text-primary font-mono text-[10px] mb-4 uppercase tracking-[0.3em] font-bold">Share Link</h4>
                                            <p className="text-white/40 text-[11px] mb-8 leading-relaxed font-mono uppercase tracking-widest">
                                                Share the event with the people you actually want in the room. This link keeps the event context attached.
                                            </p>

                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={shareUrl.replace(/^https?:\/\//, "")}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-5 text-[10px] text-white/60 font-mono outline-none focus:border-primary/50 transition-colors uppercase tracking-widest"
                                                />
                                                <button
                                                    onClick={copyToClipboard}
                                                    type="button"
                                                    className="shrink-0 bg-primary h-12 w-12 flex items-center justify-center text-white rounded-xl hover:bg-white hover:text-black transition-all duration-500 shadow-lg shadow-primary/20"
                                                >
                                                    {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => void shareEntry()}
                                            className="btn-pill-outline btn-pill-wide group"
                                        >
                                            {shared ? "Shared / Copied" : "Share With Your Crew"}
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        <div className="mb-8">
                                            <div className="h-px w-8 bg-primary mb-4" />
                                            <h3 className="font-display text-4xl uppercase text-white mb-2 tracking-[0.1em]">Enter Now</h3>
                                            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">Add your details to join the entry list.</p>
                                        </div>

                                        {/* Honeypot: Bot Trap */}
                                        <HoneypotField value={botCheck} onChange={(e) => setBotCheck(e.target.value)} />

                                        <div className="space-y-4">
                                            <div className="relative group">
                                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                                                <input
                                                    required
                                                    type="text"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    autoComplete="name"
                                                    placeholder="Full name"
                                                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-5 pl-14 pr-6 text-white text-xs font-mono uppercase tracking-widest placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/[0.04] transition-all"
                                                />
                                            </div>

                                            <div className="relative group">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                                                <input
                                                    required
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    autoComplete="email"
                                                    placeholder="Email address"
                                                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-5 pl-14 pr-6 text-white text-xs font-mono uppercase tracking-widest placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/[0.04] transition-all"
                                                />
                                            </div>

                                            <div className="relative group">
                                                <Instagram className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                                                <input
                                                    type="text"
                                                    value={handle}
                                                    onChange={(e) => setHandle(e.target.value)}
                                                    placeholder="Instagram handle (optional)"
                                                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-5 pl-14 pr-6 text-white text-xs font-mono uppercase tracking-widest placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/[0.04] transition-all"
                                                />
                                            </div>
                                        </div>

                                        {status === "error" && errorMsg && (
                                            <p className="flex items-center gap-2 text-red-400 text-xs font-mono mt-1">
                                                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errorMsg}
                                            </p>
                                        )}

                                        <div className="pt-6">
                                            <button
                                                type="submit"
                                                disabled={status === "loading"}
                                                className="btn-pill-monolith btn-pill-wide group disabled:opacity-50"
                                            >
                                                {status === "loading" ? (
                                                    <span className="flex items-center gap-3">
                                                        <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                        Submitting...
                                                    </span>
                                                ) : (
                                                    <>
                                                        Submit Entry
                                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-3 pt-4">
                                            <div className="h-px flex-1 bg-white/5" />
                                            <p className="text-[10px] text-white/20 font-mono uppercase tracking-[0.2em] whitespace-nowrap">
                                                21+ only
                                            </p>
                                            <div className="h-px flex-1 bg-white/5" />
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>

                    </div>
                </motion.div>
            </div>
        </section>
    );
}
