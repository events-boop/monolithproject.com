import { ReactNode } from "react";
import { signalChirp } from "@/lib/SignalChirpEngine";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
}

export default function MagneticButton({
  children,
  className = "",
  strength: _strength = 0,
  onClick,
}: MagneticButtonProps) {
  const handleMouseEnter = () => {
    signalChirp.hover();
  };

  const handleInternalClick = () => {
    signalChirp.click();
    onClick?.();
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onClick={handleInternalClick}
      className={`cursor-pointer active:scale-[0.97] ${className}`}
    >
      {children}
    </div>
  );
}
