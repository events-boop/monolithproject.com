import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

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

  useEffect(() => {
    if (!sectionIds.length) return;

    const evaluateSection = () => {
      let currentId = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.35) {
          currentId = id;
        }
      }
      setActiveId((prev) => (prev === currentId ? prev : currentId));
    };

    evaluateSection();
    window.addEventListener("scroll", evaluateSection, { passive: true });
    window.addEventListener("resize", evaluateSection);
    return () => {
      window.removeEventListener("scroll", evaluateSection);
      window.removeEventListener("resize", evaluateSection);
    };
  }, [sectionIds]);

  const shellToneClass = tone === "warm" ? "season-anchor-shell-warm" : "season-anchor-shell-nocturne";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className={`sticky top-[5.25rem] z-40 px-6 ${className}`}
    >
      <div className="container max-w-6xl mx-auto">
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
                  const top = target.getBoundingClientRect().top + window.scrollY - 150;
                  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
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
