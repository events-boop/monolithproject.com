import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

const CHARS = "ABCDEF0123456789!@#$%^&*()_+{}[]:;<>,.?/~";

export default function KineticDecryption({ 
  text, 
  className = "", 
  triggerOnce = true,
  autoStart = true,
  sessionOnce = false
}: { 
  text: string; 
  className?: string;
  triggerOnce?: boolean;
  autoStart?: boolean;
  sessionOnce?: boolean;
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: triggerOnce, margin: "-10%" });

  const startScramble = (force = false) => {
    if (isScrambling) return;

    if (!force && sessionOnce) {
      const sessionKey = `kinetic_${text.replace(/\s+/g, '_')}`;
      if (sessionStorage.getItem(sessionKey)) {
        return;
      }
      sessionStorage.setItem(sessionKey, 'true');
    }

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
      onMouseEnter={() => startScramble(true)}
      className={`${className} cursor-default inline-block whitespace-nowrap`}
    >
      {displayText}
    </span>
  );
}
