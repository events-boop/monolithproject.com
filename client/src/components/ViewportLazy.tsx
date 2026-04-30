import { ReactNode, useEffect, useRef, useState } from "react";

interface ViewportLazyProps {
  children: ReactNode;
  minHeightClassName?: string;
  rootMargin?: string;
  revealAfterMs?: number;
}

export default function ViewportLazy({
  children,
  minHeightClassName = "min-h-[320px]",
  rootMargin = "200px 0px",
  revealAfterMs,
}: ViewportLazyProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  useEffect(() => {
    if (visible || typeof revealAfterMs !== "number") return;
    const timeoutId = window.setTimeout(() => setVisible(true), revealAfterMs);
    return () => window.clearTimeout(timeoutId);
  }, [revealAfterMs, visible]);

  return <div ref={ref} className={visible ? undefined : minHeightClassName}>{visible ? children : null}</div>;
}
