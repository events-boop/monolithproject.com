import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Send, AlertCircle, Users, Wine, Ticket, Star } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { submitContactForm } from "@/lib/api";

const ambassadorSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    instagram: z.string().min(2, "Instagram handle is required"),
    message: z.string().optional(),
});

type AmbassadorFormValues = z.infer<typeof ambassadorSchema>;

const inputClass = `
  w-full px-4 py-3.5 text-sm text-white placeholder-white/25
  bg-white/[0.04] border border-white/10
  focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none
  transition-all duration-200
`;

const labelClass = "block text-[10px] font-mono uppercase tracking-[0.25em] text-white/35 mb-2";

const perks = [
    {
        icon: Ticket,
        title: "Free Access",
        desc: "Sell 5 tickets -> Your ticket is 100% free.",
        color: "#E05A3A"
    },
    {
        icon: Wine,
        title: "Drink Tokens",
        desc: "1 free drink for you + 1 for EACH friend who buys.",
        color: "#E8B86D"
    },
    {
        icon: Star,
        title: "VIP Status",
        desc: "Top sellers get upgraded to VIP entry + backstage access.",
        color: "#8B5CF6"
    }
];

export default function Ambassadors() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AmbassadorFormValues>({
        resolver: zodResolver(ambassadorSchema),
    });

    const onSubmit = async (data: AmbassadorFormValues) => {
        setIsSubmitting(true);
        setSubmitError("");
        try {
            await submitContactForm({
                name: data.name,
                email: data.email,
                subject: `Ambassador Application (@${data.instagram})`,
                message: `Instagram: ${data.instagram}\n\nNote: ${data.message || "No specific message."}`,
            });
            setIsSubmitted(true);
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : "Unable to submit application right now.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            <SEO
                title="Ambassador Program"
                description="Join the Monolith Project team. Sell 5 tickets and get yours free + drink tokens for the crew."
            />
            <Navigation />

            {/* Background Atmosphere */}
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.08),transparent_45%),radial-gradient(circle_at_20%_80%,rgba(224,90,58,0.06),transparent_45%)]" />
                <div className="absolute inset-0 bg-noise opacity-[0.04]" />
            </div>

            <main className="relative z-10 pt-44 md:pt-52 pb-32">
                <div className="container max-w-6xl mx-auto px-6">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-20 text-center max-w-3xl mx-auto"
                    >
                        <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/35 block mb-5">
                            — Join The Team
                        </span>
                        <h1 className="font-display text-[clamp(2.5rem,8vw,6rem)] leading-[0.9] uppercase tracking-tight-display text-white mb-6">
                            BRING THE CREW.<br />PARTY ON US.
                        </h1>
                        <p className="text-white/50 text-lg leading-relaxed max-w-2xl mx-auto">
                            You're already bringing your friends. You might as well get rewarded for it.
                            Join our ambassador program to earn free tickets, drink tokens, and exclusive perks.
                        </p>
                    </motion.div>

                    {/* The Offer Visualization */}
                    <div className="grid md:grid-cols-3 gap-6 mb-24">
                        {perks.map((perk, idx) => (
                            <motion.div
                                key={perk.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="relative overflow-hidden p-8 rounded-2xl border border-white/10 bg-white/[0.02]"
                            >
                                <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: perk.color }} />
                                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6" style={{ background: `${perk.color}15`, color: perk.color }}>
                                    <perk.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-display text-2xl uppercase text-white mb-3">{perk.title}</h3>
                                <p className="text-white/50 text-sm leading-relaxed">{perk.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Application Form */}
                    <div className="max-w-xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="relative overflow-hidden p-5 md:p-10 border border-white/10 bg-white/[0.02] rounded-xl"
                        >
                            <div className="text-center mb-10">
                                <h3 className="font-display text-2xl uppercase text-white mb-2">Apply for a Link</h3>
                                <p className="text-white/40 text-sm">We'll review your profile and send your unique tracking link.</p>
                            </div>

                            {isSubmitted ? (
                                <div className="flex flex-col items-center justify-center text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 border border-primary/20">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-display text-2xl uppercase text-white mb-4">Application Sent</h3>
                                    <p className="text-white/45 max-w-xs mx-auto text-sm leading-relaxed">
                                        Check your email in 24-48 hours. If approved, you'll receive your dashboard login and tracking link.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                                    {/* Name */}
                                    <div>
                                        <label className={labelClass}>Full Name</label>
                                        <input
                                            {...register("name")}
                                            className={inputClass}
                                            placeholder="Your name"
                                        />
                                        {errors.name && <span className="text-red-400 text-xs mt-1.5 block font-mono bg-red-400/10 px-2 py-1 inline-block rounded">{errors.name.message}</span>}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className={labelClass}>Email Address</label>
                                        <input
                                            {...register("email")}
                                            type="email"
                                            className={inputClass}
                                            placeholder="Where should we send your link?"
                                        />
                                        {errors.email && <span className="text-red-400 text-xs mt-1.5 block font-mono bg-red-400/10 px-2 py-1 inline-block rounded">{errors.email.message}</span>}
                                    </div>

                                    {/* Instagram */}
                                    <div>
                                        <label className={labelClass}>Instagram Handle</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">@</span>
                                            <input
                                                {...register("instagram")}
                                                className={`${inputClass} pl-8`}
                                                placeholder="yourhandle"
                                            />
                                        </div>
                                        {errors.instagram && <span className="text-red-400 text-xs mt-1.5 block font-mono bg-red-400/10 px-2 py-1 inline-block rounded">{errors.instagram.message}</span>}
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className={labelClass}>Why do you want to join? (Optional)</label>
                                        <textarea
                                            {...register("message")}
                                            rows={3}
                                            className={inputClass}
                                            placeholder="I have a big group for the March show..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 mt-4 bg-primary text-white font-bold tracking-widest uppercase text-xs hover:bg-primary/90 transition-all flex items-center justify-center gap-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <span className="animate-pulse">Sending...</span>
                                        ) : (
                                            <>
                                                APPLY NOW <Send className="w-3.5 h-3.5" />
                                            </>
                                        )}
                                    </button>

                                    {submitError && (
                                        <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/5 p-3 rounded border border-red-400/10">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            {submitError}
                                        </div>
                                    )}

                                    <p className="text-center text-[10px] text-white/20 font-mono uppercase tracking-widest pt-2">
                                        Limited spots available per event
                                    </p>
                                </form>
                            )}
                        </motion.div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
