interface UntoldButterflyLogoProps {
  className?: string;
  glow?: boolean;
}

export default function UntoldButterflyLogo({ className = "w-16 h-16", glow = false }: UntoldButterflyLogoProps) {
  return (
    <svg
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={glow ? { filter: "drop-shadow(0 0 12px rgba(120, 200, 255, 0.6)) drop-shadow(0 0 4px rgba(120, 200, 255, 0.3))" } : undefined}
    >
      {/* Left wing - upper */}
      <path
        d="M58 50 C55 38, 45 18, 28 12 C16 8, 6 14, 8 26 C10 36, 18 44, 30 48 C38 50, 50 50, 58 50Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Left wing - lower */}
      <path
        d="M58 50 C52 54, 40 62, 28 68 C18 73, 10 72, 10 64 C10 56, 18 52, 30 50 C42 48, 52 49, 58 50Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Right wing - upper */}
      <path
        d="M62 50 C65 38, 75 18, 92 12 C104 8, 114 14, 112 26 C110 36, 102 44, 90 48 C82 50, 70 50, 62 50Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Right wing - lower */}
      <path
        d="M62 50 C68 54, 80 62, 92 68 C102 73, 110 72, 110 64 C110 56, 102 52, 90 50 C78 48, 68 49, 62 50Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Body */}
      <line
        x1="60" y1="42" x2="60" y2="72"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Antennae */}
      <path
        d="M60 42 C58 36, 52 30, 48 26"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M60 42 C62 36, 68 30, 72 26"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
