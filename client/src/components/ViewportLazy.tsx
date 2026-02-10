import { ReactNode, useEffect, useRef, useState } from "react";

interface ViewportLazyProps {
  children: ReactNode;
  minHeightClassName?: string;
  rootMargin?: string;
}

export default function ViewportLazy({
  children,
  minHeightClassName = "min-h-[320px]",
  rootMargin = "200px 0px",
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

  return <div ref={ref} className={visible ? undefined : minHeightClassName}>{visible ? children : null}</div>;
}
