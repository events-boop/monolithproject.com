
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function DefinitionSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-[80px]" />
            </div>

            <div className="container max-w-4xl mx-auto px-6">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 border-t border-b border-primary/20 py-16 md:py-24"
                >
                    <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
                        {/* Word & Pronunciation */}
                        <div className="md:w-1/3">
                            <h3 className="font-display text-5xl md:text-6xl text-foreground tracking-wide mb-2">
                                TOGETHERNESS
                            </h3>
                            <p className="font-serif text-xl italic text-muted-foreground">
                                (noun) /təˈɡɛðənəs/
                            </p>
                        </div>

                        {/* Definition Content */}
                        <div className="md:w-2/3 space-y-8">
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <span className="font-mono text-primary text-sm pt-1">01</span>
                                    <p className="text-xl md:text-2xl text-foreground/90 font-light leading-relaxed">
                                        The state of being close to another person or other people; a feeling of unity and connection.
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <span className="font-mono text-primary text-sm pt-1">02</span>
                                    <p className="text-xl md:text-2xl text-foreground/90 font-light leading-relaxed">
                                        <span className="text-silver-red-gradient">The frequency</span> at which individual rhythms synchronize into a collective experience.
                                    </p>
                                </div>
                            </div>

                            <div className="pl-8 border-l-2 border-primary/30">
                                <p className="text-muted-foreground italic font-serif">
                                    "In the age of digital isolation, we return to the primal necessity of gathering.
                                    Not just to be in the same room, but to be on the same frequency."
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
