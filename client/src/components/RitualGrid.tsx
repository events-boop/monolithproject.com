import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const RitualItem = ({
    title,
    subtitle,
    description,
    image,
    reversed = false
}: {
    title: string;
    subtitle: string;
    description: string;
    image: string;
    reversed?: boolean;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

    return (
        <div ref={ref} className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 md:gap-24 items-center py-24`}>
            {/* Image Side */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, margin: "-10%" }}
                className="w-full md:w-1/2 relative"
            >
                <div className="aspect-[3/4] overflow-hidden rounded-sm relative group">
                    <div className="absolute inset-0 bg-stone-900/10 z-10 transition-opacity duration-500 group-hover:opacity-0" />
                    <motion.div style={{ y }} className="h-[120%] w-full -mt-[10%] relative">
                        <motion.img
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                        />
                    </motion.div>
                </div>
            </motion.div>

            {/* Content Side */}
            <div className="w-full md:w-1/2 flex flex-col justify-center">
                <motion.div
                    initial={{ opacity: 0, x: reversed ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    viewport={{ once: true }}
                >
                    <span className="text-xs font-mono tracking-widest uppercase text-stone-500 mb-4 block">
                        {subtitle}
                    </span>
                    <h2 className="font-display text-5xl md:text-7xl mb-8 text-stone-900 tracking-tight">
                        {title}
                    </h2>
                    <p className="font-serif text-xl md:text-2xl leading-relaxed text-stone-700 max-w-md">
                        {description}
                    </p>

                    <motion.button
                        whileHover={{ x: 10 }}
                        className="mt-12 text-sm font-medium uppercase tracking-widest border-b border-stone-900 pb-2 w-fit"
                    >
                        Discover More
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default function RitualGrid() {
    const containerRef = useRef(null);

    return (
        <section ref={containerRef} className="bg-[var(--color-sand)] text-[var(--color-charcoal)] relative z-10">
            <div className="container mx-auto px-6 py-32">
                {/* Intro */}
                <div className="mb-32 text-center max-w-3xl mx-auto">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-xs font-mono uppercase tracking-[0.3em] text-stone-500"
                    >
                        The Philosophy
                    </motion.span>
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="font-serif italic text-3xl md:text-5xl mt-6 leading-tight text-stone-800"
                    >
                        "The Monolith is not just a structure. It is a portal, a frequency, and a guide back to the present moment."
                    </motion.h3>
                </div>

                {/* Grid */}
                <div className="space-y-12">
                    <RitualItem
                        subtitle="/ 01 ORIGIN"
                        title="THE PORTAL"
                        description="A gateway to the present. Leave the algorithm behind and step into a space designed for genuine human connection."
                        image="https://images.unsplash.com/photo-1599961131154-1fe5871f7626?q=80&w=2000&auto=format&fit=crop"
                    />

                    <RitualItem
                        subtitle="/ 02 RESONANCE"
                        title="THE FREQUENCY"
                        description="Music as a narrative. We curate sounds that tell a story, evolving from the golden hour to the deep night."
                        image="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2000&auto=format&fit=crop"
                        reversed
                    />

                    <RitualItem
                        subtitle="/ 03 CONVERGENCE"
                        title="THE COLLECTIVE"
                        description="We are not just a crowd. We are a convergence of intention. Unified by rhythm, grounded in the now."
                        image="https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=2000&auto=format&fit=crop"
                    />
                </div>
            </div>
        </section>
    );
}
