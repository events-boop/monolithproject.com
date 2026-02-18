import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Send, Crown, Wine, Users, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { submitContactForm } from "@/lib/api";

const vipSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    guests: z.string().min(1, "Guest count required"),
    phone: z.string().min(10, "Phone number required"),
});

type VipFormValues = z.infer<typeof vipSchema>;

const inputClass = `
  w-full px-4 py-3.5 text-sm text-white placeholder-white/25
  bg-white/[0.04] border border-white/10
  focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none
  transition-all duration-200
`;

const perks = [
    { icon: Crown, title: "Priority Entry", desc: "Skip the line. Escorted entry for your entire group." },
    { icon: Wine, title: "Bottle Service", desc: "Dedicated server. Premium selection. Sparklers on arrival." },
    { icon: Users, title: "Private Section", desc: "Elevated view of the stage. Your own space in the crowd." },
    { icon: Sparkles, title: "Concierge", desc: "Personal host to handle requests throughout the night." },
];

export default function VIP() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<VipFormValues>({
        resolver: zodResolver(vipSchema)
    });

    const onSubmit = async (data: VipFormValues) => {
        setIsSubmitting(true);
        try {
            await submitContactForm({
                name: data.name,
                email: data.email,
                subject: `VIP Table Request — ${data.name}`,
                message: `Phone: ${data.phone}\nGuests: ${data.guests}\n\nInterest: VIP Table Service`,
            });
            setIsSubmitted(true);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            <SEO
                title="VIP Experience"
                description="Elevate your night. Private tables, bottle service, and priority entry for The Monolith Project."
            />
            <Navigation />

            <main className="relative z-10 pt-44 md:pt-52 pb-32">
                <div className="container max-w-6xl mx-auto px-6">

                    <div className="grid lg:grid-cols-2 gap-16 mb-24">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-primary block mb-6">
                                — Elevated Access
                            </span>
                            <h1 className="font-display text-[clamp(3.5rem,8vw,7rem)] leading-[0.85] uppercase text-white mb-8">
                                THE VIP<br />EXPERIENCE
                            </h1>
                            <p className="text-white/50 text-lg leading-relaxed max-w-lg mb-10">
                                Experience the event from the best vantage point in the house.
                                Full service, private space, and zero friction.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-8">
                                {perks.map((p) => (
                                    <div key={p.title}>
                                        <p className="font-display text-lg uppercase text-white mb-2 flex items-center gap-2">
                                            <p.icon className="w-4 h-4 text-primary" /> {p.title}
                                        </p>
                                        <p className="text-sm text-white/40">{p.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Placeholder for VIP Gallery/Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative aspect-[4/5] bg-white/5 rounded-2xl overflow-hidden border border-white/10"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                            <div className="absolute bottom-8 left-8 z-20">
                                <p className="font-mono text-xs uppercase tracking-widest text-white/70 mb-2">The View</p>
                                <p className="font-display text-2xl uppercase text-white">Main Room Balcony</p>
                            </div>
                            {/* This would be a real image */}
                            <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center text-white/10 font-display text-6xl uppercase tracking-tighter">
                                VIP VIEW
                            </div>
                        </motion.div>
                    </div>

                    {/* Request Form */}
                    <section className="max-w-xl mx-auto text-center border-t border-white/10 pt-20">
                        <h2 className="font-display text-3xl uppercase text-white mb-8">Request A Table</h2>

                        {isSubmitted ? (
                            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                                <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                                <h3 className="font-display text-xl uppercase text-white mb-2">Request Received</h3>
                                <p className="text-sm text-white/50">Our VIP host will text you shortly to confirm availability.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <input {...register("name")} placeholder="Full Name" className={inputClass} />
                                    <input {...register("phone")} placeholder="Phone Number" className={inputClass} />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <input {...register("email")} placeholder="Email Address" className={inputClass} />
                                    <input {...register("guests")} placeholder="Number of Guests" className={inputClass} />
                                </div>
                                <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-primary text-white font-bold tracking-widest uppercase text-xs hover:bg-primary/90 transition-all rounded">
                                    {isSubmitting ? "Sending..." : "Check Availability"}
                                </button>
                            </form>
                        )}
                    </section>

                </div>
            </main>

            <Footer />
        </div>
    );
}
