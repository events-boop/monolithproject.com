import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { shouldEnablePageTransitions } from "../lib/runtimePerformance";
import { getSceneForPath, type SceneConfig } from "../lib/scenes";
import UntoldButterflyLogo from "./UntoldButterflyLogo";
import HorizonDiscMark from "./HorizonDiscMark";
import SignalBarsMark from "./SignalBarsMark";

interface PageTransitionProps {
    children: React.ReactNode;
}

let hasCompletedInitialPageLoad = false;

const SCENE_COPY: Record<SceneConfig["id"], string> = {
    monolith: "Entering Monolith",
    story: "After Dark",
    sunsets: "Chasing The Sun",
    radio: "Tuning In",
    paper: "Transmitting Scene",
};

function SceneMark({ scene }: { scene: SceneConfig }) {
    switch (scene.id) {
        case "sunsets":
            return <HorizonDiscMark className="w-12 h-12" />;
        case "story":
            return <UntoldButterflyLogo className="w-12 h-12" glow />;
        case "radio":
            return <SignalBarsMark className="w-14 h-10" />;
        case "monolith":
        case "paper":
        default:
            return (
                <div
                    className="font-display text-[2.25rem] leading-none tracking-[0.12em] text-white"
                    style={{ textShadow: `0 0 24px ${scene.glow}` }}
                >
                    M
                </div>
            );
    }
}

export default function PageTransition({ children }: PageTransitionProps) {
    const [location] = useLocation();
    const scene = useMemo(() => getSceneForPath(location), [location]);
    const [transitionsEnabled] = useState(() => shouldEnablePageTransitions());
    const [isTransitioning, setIsTransitioning] = useState(
        transitionsEnabled && hasCompletedInitialPageLoad,
    );

    useEffect(() => {
        if (!transitionsEnabled) return;
        if (!hasCompletedInitialPageLoad) {
            hasCompletedInitialPageLoad = true;
            return;
        }

        const timer = setTimeout(() => setIsTransitioning(false), 420);
        return () => clearTimeout(timer);
    }, [transitionsEnabled]);

    if (!transitionsEnabled || !isTransitioning) {
        return <div className="relative w-full bg-background min-h-screen overflow-hidden">{children}</div>;
    }

    const label = SCENE_COPY[scene.id] ?? SCENE_COPY.monolith;

    return (
        <div className="relative w-full bg-background min-h-screen overflow-hidden">
            <motion.div
                className="relative w-full min-h-screen"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
                {children}
            </motion.div>

            <AnimatePresence>
                {isTransitioning && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-[999] bg-[#020202] flex items-center justify-center pointer-events-none"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{
                                y: "-100%",
                                transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
                            }}
                        >
                            <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
                            <div
                                className="absolute inset-0 pointer-events-none mix-blend-screen opacity-60"
                                style={{
                                    background: `radial-gradient(65% 50% at 50% 50%, ${scene.glow}, transparent 70%)`,
                                }}
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 1.1, opacity: 0 }}
                                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-col items-center gap-4"
                            >
                                <SceneMark scene={scene} />
                                <span
                                    className="font-mono text-[9px] uppercase tracking-[0.8em]"
                                    style={{ color: scene.accent, opacity: 0.75 }}
                                >
                                    {label}
                                </span>
                            </motion.div>
                        </motion.div>
                        <motion.div
                            className="fixed inset-0 z-[998] pointer-events-none"
                            style={{ backgroundColor: scene.accent, opacity: 0.18 }}
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{
                                y: "-100%",
                                transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 },
                            }}
                        />
                    </>
                )}
            </AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[900] bg-white pointer-events-none"
                initial={{ opacity: 0.08 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
            />
        </div>
    );
}
