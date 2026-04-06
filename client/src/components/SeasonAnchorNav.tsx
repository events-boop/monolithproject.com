import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

interface SeasonAnchorItem {
  label: string;
  href: string;
}

interface SeasonAnchorNavProps {
  items: SeasonAnchorItem[];
  tone?: "warm" | "nocturne";
  className?: string;
}

export default function SeasonAnchorNav({ items, tone = "warm", className = "" }: SeasonAnchorNavProps) {
  const sectionIds = useMemo(
    () =>
      items
        .map((item) => (item.href.startsWith("#") ? item.href.slice(1) : item.href))
        .filter(Boolean),
    [items],
  );
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");
  const visibleRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!sectionIds.length) return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleRef.current.add(entry.target.id);
          } else {
            visibleRef.current.delete(entry.target.id);
          }
        }
        // Pick the last visible section in document order
        let picked = sectionIds[0];
        for (const id of sectionIds) {
          if (visibleRef.current.has(id)) picked = id;
        }
        setActiveId((prev) => (prev === picked ? prev : picked));
      },
      { rootMargin: "-35% 0px -64% 0px" },
    );

    for (const el of elements) observer.observe(el);

    return () => observer.disconnect();
  }, [sectionIds]);

  const shellToneClass = tone === "warm" ? "season-anchor-shell-warm" : "season-anchor-shell-nocturne";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className={`sticky sticky-shell-top z-40 px-6 ${className}`}
    >
      <div className="container layout-default">
        <nav className={`season-anchor-shell ${shellToneClass}`} aria-label="Season page sections">
          {items.map((item) => {
            const sectionId = item.href.startsWith("#") ? item.href.slice(1) : item.href;
            const isActive = sectionId === activeId;
            const activeClass =
              tone === "warm" ? "season-anchor-link-active-warm" : "season-anchor-link-active-nocturne";

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  if (!item.href.startsWith("#")) return;
                  const target = document.getElementById(sectionId);
                  if (!target) return;
                  e.preventDefault();
                  target.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`season-anchor-link ${isActive ? activeClass : ""}`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
}
