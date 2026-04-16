import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageTrailProps {
    images: string[];
    maxImages?: number;
    distanceToEmit?: number;
}

interface TrailItem {
    id: number;
    x: number;
    y: number;
    src: string;
    rotation: number;
    scaleX: number;
    scaleY: number;
}

export default function ImageTrail({
    images,
    maxImages = 15,
    distanceToEmit = 75,
    isActive = false,
}: ImageTrailProps & { isActive?: boolean }) {
    const [trail, setTrail] = useState<TrailItem[]>([]);
    const trailRef = useRef<TrailItem[]>([]);
    const lastMousePos = useRef({ x: 0, y: 0 });
    const indexRef = useRef(0);
    const zIndexRef = useRef(10);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isActive) {
            setTrail([]);
            trailRef.current = [];
            return;
        }

        const handleMouseMove = (e: MouseEvent) => {
            // Ensure we have a valid container rect to only capture inside
            // if (containerRef.current) {
            //     const rect = containerRef.current.getBoundingClientRect();
            //     // If mouse is way outside of this section, we might skip, but let's just use global for smooth trails
            // }

            const dx = e.clientX - lastMousePos.current.x;
            const dy = e.clientY - lastMousePos.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > distanceToEmit) {
                lastMousePos.current = { x: e.clientX, y: e.clientY };

                // Determine stretch based on velocity
                const velocity = Math.min(distance / distanceToEmit, 2);
                const stretchX = 1 + velocity * 0.15;
                const stretchY = 1 - velocity * 0.1;
                // Rotation based on movement angle
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);

                const newItem: TrailItem = {
                    id: Date.now() + Math.random(),
                    x: e.clientX,
                    y: e.clientY,
                    src: images[indexRef.current % images.length],
                    rotation: angle + (Math.random() * 20 - 10), // slight random rotation
                    scaleX: stretchX,
                    scaleY: stretchY,
                };

                indexRef.current++;
                zIndexRef.current++;

                trailRef.current = [...trailRef.current, newItem].slice(-maxImages);
                setTrail(trailRef.current);

                // Remove item after short duration
                setTimeout(() => {
                    trailRef.current = trailRef.current.filter((i) => i.id !== newItem.id);
                    setTrail(trailRef.current);
                }, 1200);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [images, distanceToEmit, maxImages, isActive]);

    return (
        <div ref={containerRef} className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            <AnimatePresence>
                {trail.map((item) => (
                    <motion.img
                        key={item.id}
                        src={item.src}
                        initial={{
                            opacity: 0.8,
                            scale: 0.8,
                            x: item.x - 100, // offset by half width (assuming 200px width)
                            y: item.y - 125, // offset by half height (assuming 250px height)
                            rotate: item.rotation,
                            scaleX: item.scaleX,
                            scaleY: item.scaleY,
                            filter: "brightness(2) saturate(0)"
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            scaleX: 1,
                            scaleY: 1,
                            filter: "brightness(1) saturate(1)"
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.9,
                            filter: "blur(10px)",
                            y: item.y - 125 + 50, // drift downwards
                            transition: { duration: 0.8, ease: "easeInOut" }
                        }}
                        transition={{
                            duration: 1.2,
                            ease: "easeOut",
                        }}
                        style={{
                            zIndex: zIndexRef.current,
                            position: "absolute",
                            left: 0,
                            top: 0
                        }}
                        className="w-[200px] h-[250px] object-cover rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-white/20 mix-blend-plus-lighter pointer-events-none"
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
