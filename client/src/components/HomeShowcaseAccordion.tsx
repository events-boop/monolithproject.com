import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

interface AccordionItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

interface Props {
  items: AccordionItem[];
}

export default function HomeShowcaseAccordion({ items }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full flex flex-col border-t border-white/10 mt-12 mb-12">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} id={item.id} className="w-full border-b border-white/10 flex flex-col group scroll-mt-32">
            {/* Header / Trigger */}
            <button
              onClick={() => toggle(item.id)}
              className="w-full text-left py-8 md:py-12 px-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors focus-visible:outline-none focus-visible:bg-white/[0.03]"
            >
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                <span className="font-mono text-xs tracking-widest uppercase text-[#E8B86D] shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                  {item.number}
                </span>
                <div>
                  <h2 className="font-display text-4xl md:text-6xl uppercase tracking-widest text-white/90 group-hover:text-white transition-colors">
                    {item.title}
                  </h2>
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 mt-2">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <div className="w-12 h-12 rounded-full border border-white/20 flex flex-shrink-0 items-center justify-center group-hover:bg-white group-hover:border-white transition-all ml-4">
                <motion.div
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Plus className="w-6 h-6 text-white/60 group-hover:text-black transition-colors" />
                </motion.div>
              </div>
            </button>

            {/* Folded Content Container */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: "auto" },
                    collapsed: { opacity: 0, height: 0 }
                  }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-16 w-full">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
