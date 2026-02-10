
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function DefinitionSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container max-w-4xl mx-auto px-6">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 border-t border-b border-primary/20 py-16 md:py-24"
                >
                    <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
                        {/* Word */}
                        <div className="md:w-1/3">
                            <h3 className="font-display text-5xl md:text-6xl text-foreground tracking-wide mb-2">
                                MONOLITH
                            </h3>
                            <p className="font-serif text-xl italic text-muted-foreground">
                                (noun) /ˈmɒnəlɪθ/
                            </p>
                        </div>

                        {/* Definition */}
                        <div className="md:w-2/3 space-y-8">
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <span className="font-mono text-primary text-sm pt-1">01</span>
                                    <p className="text-xl md:text-2xl text-foreground/90 font-light leading-relaxed">
                                        A large single block of stone, especially one shaped into or serving as a pillar or monument.
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <span className="font-mono text-primary text-sm pt-1">02</span>
                                    <p className="text-xl md:text-2xl text-foreground/90 font-light leading-relaxed">
                                        Something that shows up, grows, and doesn't go away. Built one show at a time.
                                    </p>
                                </div>
                            </div>

                            <div className="pl-8 border-l-2 border-primary/30">
                                <p className="text-muted-foreground italic font-serif">
                                    "We're not trying to be everything. We're trying to be one thing —
                                    a place where people show up for the music and leave feeling like they were part of something."
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
