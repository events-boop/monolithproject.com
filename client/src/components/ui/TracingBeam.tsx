
import React, { useEffect, useRef, useState } from "react";
import { motion, useTransform, useScroll, useSpring, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";

export const TracingBeam = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const contentRef = useRef<HTMLDivElement>(null);
    const [svgHeight, setSvgHeight] = useState(0);
    // Track whether user has scrolled past the start (binary, not per-frame)
    const [hasScrolled, setHasScrolled] = useState(false);

    useEffect(() => {
        if (contentRef.current) {
            setSvgHeight(contentRef.current.offsetHeight);
        }
    }, []);

    // Only fire once when scrollYProgress crosses 0 → avoids 3 per-frame transforms
    useMotionValueEvent(scrollYProgress, "change", (v) => {
        if (v > 0 && !hasScrolled) setHasScrolled(true);
    });

    // These 2 springs are needed for the SVG gradient line
    const y1 = useSpring(useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]), {
        stiffness: 500,
        damping: 90,
    });
    const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]), {
        stiffness: 500,
        damping: 90,
    });

    // Dot styles — static based on hasScrolled (was: 3 separate useTransform hooks)
    const dotStyles = hasScrolled
        ? { boxShadow: "none", bg: "#ffffff", border: "#ffffff" }
        : { boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", bg: "#18CCFC", border: "#0ea5e9" };

    return (
        <motion.div
            ref={ref}
            className={cn("relative w-full max-w-4xl mx-auto h-full", className)}
        >
            <div className="absolute -left-4 md:-left-20 top-3">
                <div
                    style={{ boxShadow: dotStyles.boxShadow }}
                    className="ml-[27px] h-4 w-4 rounded-full border border-neutral-200 shadow-sm flex items-center justify-center"
                >
                    <div
                        style={{ backgroundColor: dotStyles.bg, borderColor: dotStyles.border }}
                        className="h-2 w-2 rounded-full border border-neutral-300 bg-white"
                    />
                </div>
                <svg
                    viewBox={`0 0 20 ${svgHeight}`}
                    width="20"
                    height={svgHeight}
                    className=" ml-4 block"
                    aria-hidden="true"
                >
                    <motion.path
                        d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
                        fill="none"
                        stroke="#9091A0"
                        strokeOpacity="0.16"
                        transition={{
                            duration: 10,
                        }}
                    ></motion.path>
                    <motion.path
                        d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="1.25"
                        className="motion-reduce:hidden"
                        transition={{
                            duration: 10,
                        }}
                    ></motion.path>
                    <defs>
                        <motion.linearGradient
                            id="gradient"
                            gradientUnits="userSpaceOnUse"
                            x1="0"
                            x2="0"
                            y1={y1} // set y1 for start
                            y2={y2} // set y2 for end
                        >
                            <stop stopColor="#18CCFC" stopOpacity="0"></stop>
                            <stop stopColor="#18CCFC"></stop>
                            <stop offset="0.325" stopColor="#6344F5"></stop>
                            <stop offset="1" stopColor="#AE48FF" stopOpacity="0"></stop>
                        </motion.linearGradient>
                    </defs>
                </svg>
            </div>
            <div ref={contentRef}>{children}</div>
        </motion.div>
    );
};
