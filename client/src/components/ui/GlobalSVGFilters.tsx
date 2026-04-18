export default function GlobalSVGFilters() {
    return (
        <svg className="fixed top-0 left-0 w-0 h-0 pointer-events-none" style={{ position: "absolute" }}>
            <defs>
                {/* The Liquid Hover Distortion Filter */}
                <filter id="liquid-distortion">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.015"
                        numOctaves="3"
                        result="noise"
                        seed="1"
                    >
                        <animate
                            attributeName="baseFrequency"
                            values="0.015; 0.035; 0.015"
                            dur="12s"
                            repeatCount="indefinite"
                        />
                    </feTurbulence>
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="20"
                        xChannelSelector="R"
                        yChannelSelector="G"
                        result="displacement"
                    />
                    {/* Subtle color shift during distortion */}
                    <feColorMatrix
                        in="displacement"
                        type="matrix"
                        values="1.1 0   0   0   0
                    0   1.0 0   0   0
                    0   0   1.2 0   0
                    0   0   0   1   0"
                    />
                </filter>

                {/* Glass Refraction — subtle continuous shimmer for album cover shelf */}
                <filter id="glass-refraction">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.008"
                        numOctaves="2"
                        seed="4"
                        result="noise"
                    >
                        <animate
                            attributeName="baseFrequency"
                            values="0.008; 0.014; 0.008"
                            dur="9s"
                            repeatCount="indefinite"
                        />
                    </feTurbulence>
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="8"
                        xChannelSelector="R"
                        yChannelSelector="G"
                        result="warp"
                    />
                    {/* Mild chromatic lift: warm the reds, cool the blues for a glass read */}
                    <feColorMatrix
                        in="warp"
                        type="matrix"
                        values="1 0 0 0 0.02
                                0 1 0 0 0
                                0 0 1 0 -0.02
                                0 0 0 1 0"
                    />
                </filter>

                {/* Cinematic Glitch Shudder */}
                <filter id="cinematic-glitch">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.1 0.01"
                        numOctaves="1"
                        result="noise"
                    />
                    <feColorMatrix
                        type="matrix"
                        values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 3 -1"
                        in="noise"
                        result="coloredNoise"
                    />
                    <feOffset dx="15" dy="0" in="coloredNoise" result="offset1" />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="offset1"
                        scale="10"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </defs>
        </svg>
    );
}
