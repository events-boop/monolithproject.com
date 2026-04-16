export default function LiquidDistortion() {
  return (
    <svg style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }} aria-hidden="true">
      <defs>
        <filter id="liquid-distortion" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.02"
            numOctaves="3"
            result="noise"
          >
            {/* Animating the base frequency creates a flowing water/liquid effect */}
            <animate
              attributeName="baseFrequency"
              values="0.015 0.02;0.025 0.03;0.015 0.02"
              dur="12s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="15"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displacement"
          />
        </filter>
      </defs>
    </svg>
  );
}
