import { ChevronDown, ArrowUpRight } from "lucide-react";
import EditorialHeader from "./EditorialHeader";
import { POSH_TICKET_URL } from "@/data/events";

const faqs = [
  {
    q: "What kind of music do you play?",
    a: "We focus on afro house, melodic house, and deeper club-forward sounds depending on the series and venue.",
  },
  {
    q: "What is the difference between Chasing Sun(Sets) and Untold Story?",
    a: "Chasing Sun(Sets) is rooftop sunset energy. Untold Story is a deeper, darker late-night chapter with immersive sound.",
  },
  {
    q: "What should I wear?",
    a: "Elevated nightlife attire is recommended. We curate a strong room and ask guests to match the energy.",
  },
  {
    q: "Are tickets available at the door?",
    a: "Some events may have limited door availability, but we recommend buying early to lock your spot and tier pricing.",
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="section-rhythm bg-paper text-charcoal relative overflow-hidden">
      <div className="absolute inset-0 atmo-surface-soft pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_84%_72%,rgba(224,90,58,0.12),transparent_36%)] pointer-events-none" />
      <div className="container max-w-5xl mx-auto px-6 relative z-10">
        <EditorialHeader
          kicker="FAQ"
          title="Before You Go"
          description="Quick answers before your next chapter."
          dark
        />

        <div className="space-y-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group ui-card border border-charcoal/20 bg-[linear-gradient(140deg,rgba(255,255,255,0.7),rgba(255,255,255,0.5))] backdrop-blur-sm open:bg-[linear-gradient(140deg,rgba(255,255,255,0.82),rgba(255,255,255,0.66))]"
            >
              <summary className="list-none cursor-pointer flex items-center justify-between gap-4 px-5 md:px-6 py-4 md:py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
                <span className="font-display text-2xl md:text-3xl leading-none">{item.q}</span>
                <ChevronDown className="w-4 h-4 text-charcoal/65 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 md:px-6 pb-5 text-stone leading-relaxed max-w-3xl">
                {item.a}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 rounded-xl border border-charcoal/20 bg-white/45 px-5 py-4 backdrop-blur-sm">
          <p className="text-sm text-stone">Still have questions? Reach out and we’ll help before the event.</p>
          <a
            href={POSH_TICKET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill-coral inline-flex items-center gap-2"
          >
            Get Tickets
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
