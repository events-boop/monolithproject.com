export default function GridBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
            {/* Subtle Grain Overlay - Cinematic Texture */}
            <div className="absolute inset-0 opacity-[0.04] bg-noise mix-blend-overlay" />

            {/* Vignette to focus center */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div>
    );
}
