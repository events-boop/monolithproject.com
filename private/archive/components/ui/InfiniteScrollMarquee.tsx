import { motion, useScroll, useTransform, useVelocity, useSpring, useAnimationFrame, useMotionValue } from "framer-motion";
import { useRef } from "react";

const wrap = (min: number, max: number, v: number) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

interface InfiniteScrollMarqueeProps {
  children: React.ReactNode;
  baseVelocity?: number;
  className?: string;
  parallax?: boolean;
}

export default function InfiniteScrollMarquee({ 
  children, 
  baseVelocity = 100,
  className = "",
  parallax = true 
}: InfiniteScrollMarqueeProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

    const x = useTransform(baseX, (v) => `${wrap(-20, -50, v)}%`);
    const skewX = useTransform(smoothVelocity, [-1000, 1000], [-3, 3]);
    const blur = useTransform(smoothVelocity, [-2000, 0, 2000], [4, 0, 4]);

    const directionFactor = useRef<number>(1);
    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        if (parallax) {
            if (velocityFactor.get() < 0) {
                directionFactor.current = -1;
            } else if (velocityFactor.get() > 0) {
                directionFactor.current = 1;
            }
            moveBy += directionFactor.current * moveBy * velocityFactor.get();
        }

        baseX.set(baseX.get() + moveBy);
    });

    return (
        <div className={`overflow-hidden whitespace-nowrap flex flex-nowrap ${className}`}>
            <motion.div 
                className="flex whitespace-nowrap flex-nowrap shrink-0 items-center justify-center gap-[5vw]" 
                style={{ x, skewX, filter: `blur(${blur.get()}px)` }}
            >
                <span className="block shrink-0">{children}</span>
                <span className="block shrink-0">{children}</span>
                <span className="block shrink-0">{children}</span>
                <span className="block shrink-0">{children}</span>
            </motion.div>
        </div>
    );
}
