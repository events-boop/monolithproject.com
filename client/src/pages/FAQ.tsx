import {
  TICKET_POLICY,
  SUNSETS_TICKET_HOLDER_UPDATE,
} from "@shared/events/ticket-policy";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Minus,
  MapPin,
  Clock,
  CreditCard,
  Shield,
  Accessibility,
  Music,
  HelpCircle,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import JsonLd from "@/components/JsonLd";
import { buildFaqSchema } from "@/lib/schema";
import { signalChirp } from "@/lib/SignalChirpEngine";
import { FAQ_SITE } from "@shared/faqs";

const CATEGORY_PRESENTATION: Record<
  string,
  { icon: typeof MapPin; color: string }
> = {
  "venue-location": { icon: MapPin, color: "#E05A3A" },
  "tickets-entry": { icon: CreditCard, color: "#E8B86D" },
  "night-of": { icon: Clock, color: "#8B5CF6" },
  "artists-bookings": { icon: Music, color: "#E05A3A" },
  "safety-community": { icon: Shield, color: "#1DB954" },
  accessibility: { icon: Accessibility, color: "#8B5CF6" },
};

const categories = FAQ_SITE.categories.map(category => ({
  icon: (CATEGORY_PRESENTATION[category.id] ?? { icon: HelpCircle }).icon,
  color: (CATEGORY_PRESENTATION[category.id] ?? { color: "#E05A3A" }).color,
  label: category.label,
  faqs: category.items.map(item => ({ q: item.question, a: item.answer })),
}));

function FAQItem({
  q,
  a,
  isOpen,
  onToggle,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-start justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 group"
      >
        <span className="text-sm md:text-base text-white/80 group-hover:text-white transition-colors leading-relaxed pr-4">
          {q}
        </span>
        <span className="flex-shrink-0 mt-0.5">
          {isOpen ? (
            <Minus className="w-4 h-4 text-primary" />
          ) : (
            <Plus className="w-4 h-4 text-white/70 group-hover:text-white/60 transition-colors" />
          )}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-white/70 leading-relaxed pr-8">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqSchemaEntries = categories.flatMap(category =>
    category.faqs.map(faq => [faq.q, faq.a] as [string, string])
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpenIndex(0);
  }, [activeCategory]);

  const current = categories[activeCategory];

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden"
      style={{ background: "#050505" }}
    >
      <SEO
        title="FAQ | The Monolith Project"
        description="Answers about tickets, venues, timing, and event details for The Monolith Project, Chasing Sun(Sets), and Untold Story."
        absoluteTitle
        canonicalPath="/faq"
      />
      <JsonLd id="schema-main-faq" data={buildFaqSchema(faqSchemaEntries)} />
      <Navigation />

      {/* Atmosphere */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_25%,rgba(224,90,58,0.07),transparent_50%),radial-gradient(ellipse_at_85%_75%,rgba(139,92,246,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-noise opacity-[0.03]" />
      </div>

      <main className="relative z-10 page-shell-start-loose pb-32">
        <div className="container layout-default px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16"
          >
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/70 block mb-5">
              — Got Questions
            </span>
            <h1 className="font-display text-[clamp(3.5rem,10vw,8rem)] leading-[0.85] uppercase tracking-tight-display text-white mb-6">
              FAQ
            </h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ originX: 0 }}
              className="h-[2px] w-32 bg-gradient-to-r from-primary via-primary/60 to-transparent mb-6"
            />
            <p className="text-white/70 max-w-xl leading-relaxed">
              Everything you need to know before, during, and after an event.
            </p>
          </motion.div>
          <aside
            id="ticket-policy"
            className="mb-10 rounded-2xl border border-amber-300/40 bg-amber-300/10 p-6 md:p-8"
            aria-labelledby="ticket-policy-title"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-amber-200 mb-3">
              Tickets & show updates
            </p>
            <h2
              id="ticket-policy-title"
              className="font-display text-2xl md:text-3xl text-white mb-3"
            >
              {TICKET_POLICY.salesFinal}
            </h2>
            <p className="text-white/80 leading-relaxed max-w-3xl">
              <strong>Sun(Sets) III — JOEZI × MASSUMA is postponed.</strong>{" "}
              {SUNSETS_TICKET_HOLDER_UPDATE}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-5 text-sm text-amber-200">
              <a
                className="underline underline-offset-4"
                href="/sunsets#event-status"
              >
                Latest ticket-holder update ↗
              </a>
              <a
                className="underline underline-offset-4"
                href="/sunsets#weather"
              >
                Full weather & ticket policy ↗
              </a>
            </div>
          </aside>

          <div className="layout-narrow space-y-4">
            {categories.map((cat, idx) => {
              const isCatOpen = activeCategory === idx;
              return (
                <div
                  key={cat.label}
                  className="border-b border-white/10 flex flex-col group scroll-mt-32 backdrop-blur-sm"
                >
                  {/* Category Header */}
                  <button
                    onClick={() => {
                      signalChirp.click();
                      setActiveCategory(isCatOpen ? -1 : idx);
                    }}
                    aria-expanded={isCatOpen}
                    onMouseEnter={() => signalChirp.hover()}
                    className="w-full text-left py-8 md:py-10 px-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors focus-visible:outline-none focus-visible:bg-white/[0.03]"
                  >
                    <div className="flex items-center gap-6">
                      <div
                        className="w-10 h-10 flex items-center justify-center rounded-none"
                        style={{
                          background: `${cat.color}15`,
                          border: `1px solid ${cat.color}30`,
                        }}
                      >
                        <cat.icon
                          className="w-4 h-4"
                          style={{ color: cat.color }}
                        />
                      </div>
                      <h2 className="font-display text-2xl md:text-3xl uppercase tracking-widest text-white/90 group-hover:text-white transition-all duration-300">
                        {cat.label}
                      </h2>
                    </div>

                    <div className="w-10 h-10 rounded-full border border-white/10 flex flex-shrink-0 items-center justify-center group-hover:bg-white group-hover:border-white transition-all">
                      <motion.div
                        animate={{ rotate: isCatOpen ? 45 : 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Plus className="w-5 h-5 text-white/60 group-hover:text-black transition-colors" />
                      </motion.div>
                    </div>
                  </button>

                  {/* Category Content */}
                  <AnimatePresence initial={false}>
                    {isCatOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 md:px-16 pb-12 pt-4">
                          <div className="space-y-2">
                            {cat.faqs.map((faq, fIdx) => (
                              <FAQItem
                                key={fIdx}
                                q={faq.q}
                                a={faq.a}
                                isOpen={openIndex === fIdx}
                                onToggle={() => {
                                  signalChirp.click();
                                  setOpenIndex(
                                    openIndex === fIdx ? null : fIdx
                                  );
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-24 pt-12 border-t border-white/10 text-center"
          >
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/70 mb-6">
              Still Have Questions?
            </p>
            <a
              href="mailto:events@monolithproject.com"
              className="btn-pill-monolith"
            >
              <HelpCircle className="w-4 h-4" />
              Direct Inquiry
            </a>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
