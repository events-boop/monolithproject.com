import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

const CHARS = "ABCDEF0123456789!@#$%^&*()_+{}[]:;<>,.?/~";

export default function KineticDecryption({ 
  text, 
  className = "", 
  triggerOnce = true,
  autoStart = true
}: { 
  text: string; 
  className?: string;
  triggerOnce?: boolean;
  autoStart?: boolean;
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: triggerOnce, margin: "-10%" });

  const startScramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) return text[index];
            if (char === " ") return " ";
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setIsScrambling(false);
      }

      iteration += 1 / 3;
    }, 30);
  };

  useEffect(() => {
    if (autoStart && isInView) {
      startScramble();
    }
  }, [isInView, autoStart]);

  return (
    <span 
      ref={ref}
      onMouseEnter={startScramble}
      className={`${className} cursor-default inline-block whitespace-nowrap`}
    >
      {displayText}
    </span>
  );
}
