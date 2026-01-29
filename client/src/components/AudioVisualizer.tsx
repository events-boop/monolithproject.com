import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function AudioVisualizer() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        let particles: {
            x: number;
            y: number;
            height: number;
            speed: number;
            color: string;
        }[] = [];

        const resize = () => {
            canvas.width = containerRef.current?.offsetWidth || 300;
            canvas.height = 100;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const barCount = 40;
            const barWidth = canvas.width / barCount;

            for (let i = 0; i < barCount; i++) {
                particles.push({
                    x: i * barWidth,
                    y: canvas.height / 2,
                    height: Math.random() * 50,
                    speed: Math.random() * 0.1 + 0.05,
                    color: i % 2 === 0 ? "rgba(212, 165, 116, 0.8)" : "rgba(212, 165, 116, 0.4)",
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, i) => {
                // Simple mock visualization animation
                const time = Date.now() * 0.002;
                const wave = Math.sin(time + i * 0.5) * 30; // Sine wave motion

                // Dynamic height based on mouse proximity could go here

                ctx.fillStyle = p.color;
                const barHeight = Math.abs(wave) + 10;

                ctx.fillRect(p.x, (canvas.height - barHeight) / 2, canvas.width / 40 - 2, barHeight);
            });

            animationId = requestAnimationFrame(animate);
        };

        window.addEventListener("resize", resize);
        resize();
        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full h-24 relative overflow-hidden rounded-lg bg-background/5 border border-primary/20 backdrop-blur-sm group cursor-pointer hover:border-primary/50 transition-colors">
            <canvas ref={canvasRef} className="absolute inset-0 z-10" />
            <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="font-display text-xl tracking-widest text-primary bg-background/80 px-4 py-2 rounded-full border border-primary/50 backdrop-blur-md">
                    PLAY MIX
                </span>
            </div>
        </div>
    );
}
