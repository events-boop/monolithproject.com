import { useEffect, useRef } from "react";

export default function CinematicGrain() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let w: number, h: number;

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };

        const drawNoise = () => {
            w = canvas.width;
            h = canvas.height;
            const idata = ctx.createImageData(w, h);
            const buffer32 = new Uint32Array(idata.data.buffer);
            const len = buffer32.length;

            for (let i = 0; i < len; i++) {
                if (Math.random() < 0.1) { // 10% density
                    // Random grey noise
                    const val = Math.random() * 255;
                    // Alpha 0-255 (but usually low opacity is handled by css)
                    // We'll set full alpha here and control opacity via CSS for performance
                    buffer32[i] = 0xff000000 | (val << 16) | (val << 8) | val;
                }
            }
            ctx.putImageData(idata, 0, 0);
        };

        // Optimizing: Using CSS animation on a static noise texture is preferred over per-frame canvas redrawing 
        // which eats CPU.
        // Let's generate a static noise pattern and shift it with CSS steps() animation?
        // Actually, for "S-Tier", a pure CSS SVG filter is best for performance, 
        // but since we want a "Live" feel, let's use a keyframe animation of background-position.
    }, []);

    return (
        <div className="fixed inset-0 z-[50] pointer-events-none opacity-[0.035] mix-blend-overlay">
            {/* Using a highly optimized SVG noise filter inline rather than massive JS loop */}
            <svg className="absolute inset-0 w-full h-full opacity-100">
                <filter id="noiseFilter">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.6"
                        stitchTiles="stitch"
                        numOctaves="1"
                    />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>
            {/* We can add a subtle animation if needed, but static high-freq noise often reads as 'film grain' to the eye just fine if combined with scrolling */}
        </div>
    );
}

// Actually, static SVG noise is good, but "alive" noise is better.
// Let's just use the CSS we already have in index.css (.bg-noise) but make it global component.
// The existing .bg-noise utility is decent. I'll wrap it.

export function KineticGrain() {
    return (
        <div className="fixed inset-0 z-[40] pointer-events-none w-full h-full mix-blend-overlay">
            <div className="absolute inset-0 bg-noise opacity-[0.04] w-[200%] h-[200%] animate-grain" />
        </div>
    );
}
