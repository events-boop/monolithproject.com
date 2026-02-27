import { useEffect, useRef } from "react";
// cobe doesn't have types out of the box
import createGlobe from "cobe";

export default function RadioGlobe() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let phi = 0;

        if (!canvasRef.current) return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 1200 * 2,
            height: 1200 * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.15, 0.15, 0.15], // Dark gray/black base
            markerColor: [0.88, 0.35, 0.23], // Primary orange
            glowColor: [0.1, 0.1, 0.1], // glow
            markers: [
                { location: [41.8781, -87.6298], size: 0.05 }, // Chicago
                { location: [48.8566, 2.3522], size: 0.05 }, // Paris
                { location: [40.4168, -3.7038], size: 0.05 }, // Madrid
                { location: [20.2114, -87.4653], size: 0.05 }, // Tulum
                { location: [38.9067, 1.4206], size: 0.05 }, // Ibiza
                { location: [40.7128, -74.0060], size: 0.05 }, // NYC
                { location: [-33.9249, 18.4241], size: 0.05 }, // Cape Town
                { location: [25.2048, 55.2708], size: 0.05 }, // Dubai
            ],
            onRender: (state: any) => {
                // Called on every animation frame.
                // `state` will be an empty object, return updated params.
                state.phi = phi;
                phi += 0.003;
            },
        });

        return () => {
            globe.destroy();
        };
    }, []);

    return (
        <div className="w-full h-full flex items-center justify-center inset-0 absolute">
            <div className="w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] relative mt-[20vh] md:mt-[10vh] max-w-[150vw]">
                <canvas
                    ref={canvasRef}
                    style={{
                        width: "100%",
                        height: "100%",
                        contain: "layout paint size",
                        opacity: 0.9,
                        transition: "opacity 1s ease",
                    }}
                />
                {/* Glow overlay to make it blend well with the background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,var(--background)_90%)] pointer-events-none" />
            </div>
        </div>
    );
}
