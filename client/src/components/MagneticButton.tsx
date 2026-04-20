import { ReactNode, useRef, useState } from "react";
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
  strength = 0.5,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    setOffset({
      x: (clientX - centerX) * strength,
      y: (clientY - centerY) * strength,
    });
  };

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

  const handleMouseEnter = () => {
    signalChirp.hover();
  };

  const handleInternalClick = () => {
    signalChirp.click();
    onClick?.();
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleInternalClick}
      style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
      className={`cursor-pointer transition-transform duration-150 ease-out active:scale-[0.97] ${className}`}
    >
      {children}
    </div>
  );
}
