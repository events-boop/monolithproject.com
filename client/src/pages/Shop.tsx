import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SlimSubscribeStrip from "@/components/SlimSubscribeStrip";
import SEO from "@/components/SEO";
import RevealText from "@/components/RevealText";
import { ShoppingBag } from "lucide-react";

export default function Shop() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
            <SEO
                title="Shop"
                description="Official Monolith Project merchandise coming soon. Sign up for early access to the collection."
            />

            {/* Background Atmosphere */}
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(224,90,58,0.08),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(139,92,246,0.06),transparent_45%)]" />
                <div className="absolute inset-0 bg-noise opacity-[0.04]" />
            </div>

            <Navigation />

            <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 py-32 min-h-[80vh]">
                <div className="container max-w-4xl mx-auto text-center">

                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-white/10 bg-white/5 mb-8 md:mb-12">
                        <ShoppingBag className="w-6 h-6 text-primary" />
                    </div>

                    <RevealText
                        as="h1"
                        className="font-display text-[clamp(3.5rem,10vw,8rem)] leading-[0.85] uppercase text-white mb-6 drop-shadow-2xl"
                        blurStrength={16}
                        delay={0.2}
                    >
                        COLLECTION 01
                    </RevealText>

                    <RevealText
                        as="p"
                        className="font-mono text-sm md:text-base text-primary/80 tracking-[0.3em] uppercase mb-12"
                        delay={0.4}
                        stagger={0.02}
                    >
                        Coming Soon · Spring 2026
                    </RevealText>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-md mx-auto w-full"
                    >
                        <p className="text-white/50 text-sm mb-6 leading-relaxed">
                            Limited run garments and accessories for the underground.
                            Be the first to know when the shop opens.
                        </p>
                    </motion.div>
                </div>
            </main>

            {/* Newsletter Integration for "Notify Me" */}
            <div className="relative z-20">
                <SlimSubscribeStrip
                    title="GET NOTIFIED ON LAUNCH"
                    source="shop_coming_soon"
                />
            </div>

            <Footer />
        </div>
    );
}
