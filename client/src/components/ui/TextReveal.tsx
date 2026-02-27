import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
    stagger?: number;
}

export default function TextReveal({ text, className = "", delay = 0, stagger = 0.05 }: TextRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

    // Split text into words, then letters to handle wrapping correctly
    const words = text.split(" ");

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: stagger, delayChildren: delay * i },
        }),
    };

    const childVariants: Variants = {
        hidden: {
            opacity: 0,
            y: "120%",
            rotate: 15,
            filter: "blur(8px)"
        },
        visible: {
            opacity: 1,
            y: "0%",
            rotate: 0,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                damping: 24,
                stiffness: 200,
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={`flex flex-wrap ${className}`}
        >
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block overflow-hidden mr-3 pb-2 -mb-2">
                    {word.split("").map((char, charIndex) => (
                        <motion.span
                            key={charIndex}
                            variants={childVariants}
                            className="inline-block will-change-transform font-display transform-gpu origin-bottom-left"
                        >
                            {char}
                        </motion.span>
                    ))}
                </span>
            ))}
        </motion.div>
    );
}
