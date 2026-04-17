import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, Lock, Mail, MapPin, Phone, User } from "lucide-react";
import { submitNewsletterLead } from "@/lib/api";
import type { ScheduledEvent } from "@/data/events";
import { buildFunnelLeadFields, buildLeadIdempotencyKey } from "@/lib/leadCapture";
import HoneypotField from "./HoneypotField";
import { honeypotFieldName } from "@shared/generated/hardening";

interface CoordinatesFunnelProps {
    event?: ScheduledEvent;
}

export default function CoordinatesFunnel({ event }: CoordinatesFunnelProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [botCheck, setBotCheck] = useState(""); // Honeypot state

    const eventLabel = event?.headline || event?.title;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !phone.trim()) return;

        setStatus("loading");
        setErrorMsg("");

        try {
            await submitNewsletterLead(
                {
                    email: email.trim(),
                    firstName: firstName.trim() || undefined,
                    phone: phone.trim(),
                    consent: true,
                    source: "coordinates_funnel",
                    ...buildFunnelLeadFields({
                        funnelId: "coordinates_drop",
                        offerId: "location_unlock",
                        event,
                        interestTags: ["coordinates", "sms", "locked-location"],
                    }),
                    utmContent: "coordinates_drop",
                    [honeypotFieldName]: botCheck || undefined,
                },
                buildLeadIdempotencyKey("coordinates_funnel", email, event?.id),
            );
            setStatus("success");
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
            setStatus("error");
        }
    };

    return (
        <section className="relative w-full py-24 overflow-hidden bg-black flex items-center justify-center border-y border-white/5">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
                <div className="w-[800px] h-[800px] rounded-full border border-white" />
                <div className="absolute w-[600px] h-[600px] rounded-full border border-white" />
                <div className="absolute w-[400px] h-[400px] rounded-full border border-white" />
                <div className="absolute w-[200px] h-[200px] rounded-full border border-white" />
                <div className="absolute w-full h-[1px] bg-white top-1/2 -translate-y-1/2" />
                <div className="absolute w-[1px] h-full bg-white left-1/2 -translate-x-1/2" />
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#22D3EE]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container relative z-10 px-4 md:px-6">
                <div className="max-w-5xl mx-auto grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
                    <div className="flex flex-col">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                        >
                            <MapPin className="w-6 h-6 text-[#22D3EE]" />
                        </motion.div>

                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                            className="font-display text-4xl md:text-5xl uppercase tracking-widest text-white mb-4"
                        >
                            Venue <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
                                Update Drops
                            </span>
                        </motion.h2>

                        {eventLabel ? (
                            <p className="text-[#22D3EE]/75 text-[10px] font-mono tracking-[0.3em] uppercase mb-6">
                                {eventLabel}{event?.date ? ` · ${event.date}` : ""}
                            </p>
                        ) : null}

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="text-white/60 text-sm md:text-base mb-10 max-w-lg font-mono leading-relaxed"
                        >
                            Some details go out close to the event. Leave your best email and phone so we can send venue info, guest list notes, and any day-of changes.
                        </motion.p>

                        <ul className="grid gap-4 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
                            <li className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-[#22D3EE]" />
                                Venue details go out close to the event when needed.
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-[#22D3EE]" />
                                Your signup stays attached to this event.
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-[#22D3EE]" />
                                Best for venue updates, guest list notes, and late changes.
                            </li>
                        </ul>
                    </div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="w-full"
                    >
                        <AnimatePresence mode="wait">
                            {status === "success" ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white/5 border border-[#22D3EE]/20 rounded-[2rem] p-10 backdrop-blur-md"
                                >
                                    <div className="w-16 h-16 rounded-full bg-[#22D3EE]/10 flex items-center justify-center mb-6 border border-[#22D3EE]/20">
                                        <CheckCircle className="w-8 h-8 text-[#22D3EE]" />
                                    </div>
                                    <h3 className="font-display text-3xl uppercase tracking-wider text-white mb-3">You're On The List</h3>
                                    <p className="font-mono text-xs leading-relaxed text-white/50 uppercase tracking-[0.2em]">
                                        {eventLabel
                                            ? `Your ${eventLabel} venue update request is confirmed. Watch the inbox and phone you submitted for the next update.`
                                            : "Your venue update request is confirmed. Watch the inbox and phone you submitted for the next update."}
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    onSubmit={handleSubmit}
                                    className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 md:p-10 backdrop-blur-md space-y-5"
                                >
                                    <div className="mb-2">
                                        <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/40 mb-3">Venue Updates</p>
                                        <h3 className="font-display text-3xl uppercase tracking-[0.1em] text-white">Get The Update</h3>
                                    </div>

                                    {/* Honeypot: Bot Trap */}
                                    <HoneypotField value={botCheck} onChange={(e) => setBotCheck(e.target.value)} />

                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            autoComplete="given-name"
                                            placeholder="First name (optional)"
                                            className="w-full rounded-xl border border-white/10 bg-black/30 py-4 pl-11 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#22D3EE]/50 transition-colors"
                                        />
                                    </div>

                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                        <input
                                            required
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            autoComplete="email"
                                            placeholder="Email address"
                                            className="w-full rounded-xl border border-white/10 bg-black/30 py-4 pl-11 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#22D3EE]/50 transition-colors"
                                        />
                                    </div>

                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                        <input
                                            required
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            autoComplete="tel"
                                            placeholder="Mobile number"
                                            className="w-full rounded-xl border border-white/10 bg-black/30 py-4 pl-11 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#22D3EE]/50 transition-colors"
                                        />
                                    </div>

                                    {status === "error" && errorMsg ? (
                                        <p className="flex items-center gap-2 text-red-400 text-xs font-mono">
                                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                            {errorMsg}
                                        </p>
                                    ) : null}

                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="w-full bg-white text-black px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-[0.3em] hover:bg-[#22D3EE] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                    >
                                        {status === "loading" ? "Submitting..." : "Get Venue Updates"}
                                        {status === "loading" ? null : <Lock className="w-4 h-4" />}
                                    </button>

                                    <p className="text-[10px] text-white/30 font-mono tracking-[0.2em] uppercase">
                                        We only use this for event access, location release, and critical updates.
                                    </p>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
