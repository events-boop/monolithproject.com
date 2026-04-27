import { useState, useEffect, useRef } from "react";

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
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

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

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) observer.disconnect();
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { rootMargin: "-10% 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [triggerOnce, text]);

  return (
    <span 
      ref={ref}
      onMouseEnter={() => startScramble(true)}
      className={`${className} cursor-default relative`}
    >
      <span className="sr-only">{text}</span>
      {autoStart || isScrambling ? (
        <>
          <span aria-hidden="true" className="invisible">
            {text}
          </span>
          <span aria-hidden="true" className="absolute inset-0">
            {displayText}
          </span>
        </>
      ) : (
        <span aria-hidden="true">{displayText}</span>
      )}
    </span>
  );
}
