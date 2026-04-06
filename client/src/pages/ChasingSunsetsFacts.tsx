import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import EntityBoostStrip from "@/components/EntityBoostStrip";
import JsonLd from "@/components/JsonLd";
import { buildFaqSchema } from "@/lib/schema";
import { CTA_LABELS } from "@/lib/cta";
import { POSH_TICKET_URL } from "@/data/events";
import { Link } from "wouter";

const faqItems: Array<[string, string]> = [
  [
    "Is Chasing Sunsets a perfume?",
    "No. Chasing Sun(Sets) is a Chicago-based sunset house music event series and radio show by The Monolith Project.",
  ],
  ["Where is Chasing Sun(Sets) based?", "Chicago, Illinois, United States."],
  [
    "Where do I listen to the radio show?",
    "Listen on the official radio hub and SoundCloud episodes published by The Monolith Project.",
  ],
  ["Where do I buy tickets?", "Tickets are available on the official Tickets page and the official Posh event listing."],
  [
    "What’s the difference between Chasing Sunsets and Chasing Sun(Sets)?",
    "They refer to the same music brand. Chasing Sun(Sets) is the official styling; Chasing Sunsets is a common search variation.",
  ],
];

const officialLinks = [
  { label: "Official Chasing Sun(Sets) site", href: "/chasing-sunsets", external: false },
  { label: "Chasing Sun(Sets) Facts", href: "/chasing-sunsets-facts", external: false },
  { label: CTA_LABELS.radioHub, href: "/radio", external: false },
  { label: "Official Tickets", href: POSH_TICKET_URL, external: true },
  { label: "Instagram", href: "https://instagram.com/chasingsunsets.music", external: true },
  { label: "SoundCloud", href: "https://soundcloud.com/chasing-sun-sets", external: true },
  { label: "Mixcloud (show page publishing)", href: "https://mixcloud.com", external: true },
  { label: "YouTube", href: "https://youtube.com/@monolithproject", external: true },
];

const sectionTransition = { duration: 0.56, ease: [0.22, 1, 0.36, 1] as const };
const sectionReveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-90px" },
  transition: sectionTransition,
};

export default function ChasingSunsetsFacts() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <SEO
        title="Chasing Sun(Sets) Facts | Chicago Sunset House Music Series + Radio Show"
        description="Official identity and disambiguation for Chasing Sun(Sets): a Chicago sunset house music event series and radio show by The Monolith Project, not a fragrance brand."
        absoluteTitle
        canonicalPath="/chasing-sunsets-facts"
      />
      <JsonLd id="schema-chasing-sunsets-faq" data={buildFaqSchema(faqItems)} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(224,90,58,0.14),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_72%_78%,rgba(139,92,246,0.11),transparent_36%)]" />
      <Navigation />

      <main id="main-content" tabIndex={-1} className="page-shell-start pb-24 px-6">
        <motion.section className="container layout-default" {...sectionReveal}>
          <div className="luxe-surface-dark px-6 py-6 md:px-8 md:py-8">
            <p className="font-mono text-xs tracking-[0.28em] uppercase text-primary mb-5">
              Official Entity & Disambiguation
            </p>
            <h1 className="font-display text-[clamp(2.6rem,7vw,5.3rem)] leading-[0.9] uppercase mb-6">
              Chasing Sun(Sets) — Official Facts & Identity
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl">
              Chasing Sun(Sets) is a Chicago-based sunset house music event series and radio show by The Monolith Project.
            </p>
            <p className="text-base md:text-lg text-white/75 mt-3 max-w-3xl">
              If you&apos;re looking for the fragrance with a similar name, this page is for the music brand.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center rounded-full border border-white/16 bg-white/[0.04] px-3 py-1.5 ui-chip text-white/78">
                Chicago Based
              </span>
              <span className="inline-flex items-center rounded-full border border-white/16 bg-white/[0.04] px-3 py-1.5 ui-chip text-white/78">
                Event Series + Radio Show
              </span>
              <span className="inline-flex items-center rounded-full border border-primary/28 bg-primary/10 px-3 py-1.5 ui-chip text-primary">
                Not a Fragrance Product
              </span>
            </div>
            <div className="mt-6 cta-stack">
              <Link href="/radio" className="btn-pill-coral">
                {CTA_LABELS.radioHub}
              </Link>
              <a
                href={POSH_TICKET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill-dark"
              >
                {CTA_LABELS.tickets}
              </a>
            </div>
          </div>
        </motion.section>

        <motion.section className="container layout-default mt-16 grid md:grid-cols-2 gap-6" {...sectionReveal}>
          <article className="luxe-surface-dark rounded-2xl p-7">
            <h2 className="font-display text-3xl mb-4 uppercase">What It Is</h2>
            <p className="text-muted-foreground leading-relaxed">
              Chasing Sun(Sets) is The Monolith Project&apos;s Chicago-rooted sunset series and radio platform. It includes
              in-person events, ticketed dates, and a continuing radio show featuring guest mixes and full episodes.
            </p>
          </article>
          <article className="luxe-surface-dark rounded-2xl p-7">
            <h2 className="font-display text-3xl mb-4 uppercase">What It Isn&apos;t</h2>
            <p className="text-muted-foreground leading-relaxed">
              Chasing Sun(Sets) is not a perfume, cosmetic, or fragrance product line. This brand is strictly a music identity:
              events, tickets, and radio episodes presented by The Monolith Project.
            </p>
          </article>
        </motion.section>

        <motion.section className="container layout-default mt-14" {...sectionReveal}>
          <div className="luxe-surface-dark rounded-2xl p-7 md:p-8">
            <h2 className="font-display text-3xl uppercase mb-5">Official Links</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {officialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="group rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 text-white/88 hover:text-white hover:border-primary/36 transition-colors"
                >
                  <span className="inline-flex items-center gap-2 text-sm">
                    {item.label}
                    {item.external && <ArrowUpRight className="w-3.5 h-3.5 text-primary/85" />}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section className="container layout-default mt-14" {...sectionReveal}>
          <div className="luxe-surface-dark rounded-2xl p-7 md:p-8">
            <h2 className="font-display text-3xl uppercase mb-5">Brand Names & Spellings</h2>
            <ul className="flex flex-wrap gap-2.5">
              <li className="inline-flex items-center rounded-full border border-white/14 bg-white/[0.03] px-3 py-1.5 ui-chip text-white/85">
                Chasing Sun(Sets)
              </li>
              <li className="inline-flex items-center rounded-full border border-white/14 bg-white/[0.03] px-3 py-1.5 ui-chip text-white/85">
                Chasing Sunsets (common search variant)
              </li>
              <li className="inline-flex items-center rounded-full border border-white/14 bg-white/[0.03] px-3 py-1.5 ui-chip text-white/85">
                The Monolith Project Presents: Chasing Sun(Sets)
              </li>
            </ul>
          </div>
        </motion.section>

        <motion.section className="container layout-default mt-14" {...sectionReveal}>
          <div className="luxe-surface-dark rounded-2xl p-7 md:p-8">
            <h2 className="font-display text-3xl uppercase mb-5">Fast Facts</h2>
            <dl className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <dt className="font-mono text-xs tracking-[0.22em] uppercase text-white/55 mb-2">Founded</dt>
                <dd className="text-lg">2024</dd>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <dt className="font-mono text-xs tracking-[0.22em] uppercase text-white/55 mb-2">Location</dt>
                <dd className="text-lg">Chicago, IL</dd>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <dt className="font-mono text-xs tracking-[0.22em] uppercase text-white/55 mb-2">Format</dt>
                <dd className="text-lg">Sunset events + radio/podcast episodes</dd>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <dt className="font-mono text-xs tracking-[0.22em] uppercase text-white/55 mb-2">Genres</dt>
                <dd className="text-lg">Afro House / Organic House / Melodic House</dd>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 md:col-span-2">
                <dt className="font-mono text-xs tracking-[0.22em] uppercase text-white/55 mb-2">Organizer</dt>
                <dd className="text-lg">The Monolith Project</dd>
              </div>
            </dl>
          </div>
        </motion.section>

        <motion.section className="container layout-default mt-14" {...sectionReveal}>
          <div className="luxe-surface-dark rounded-2xl p-7 md:p-8">
            <h2 className="font-display text-3xl uppercase mb-5">FAQ</h2>
            <div className="space-y-3">
              {faqItems.map(([question, answer]) => (
                <article key={question} className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-4">
                  <h3 className="font-semibold text-lg mb-2">{question}</h3>
                  <p className="text-muted-foreground">{answer}</p>
                </article>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section className="container layout-default mt-14" {...sectionReveal}>
          <div className="luxe-surface-dark rounded-2xl p-6">
            <p className="text-sm text-muted-foreground leading-loose">
              Need the short version?{" "}
              <Link href="/chasing-sunsets-facts" className="inline-flex items-center justify-center rounded-full border border-primary/40 px-3 py-1 text-[10px] font-[800] tracking-widest uppercase transition-all duration-300 hover:scale-[1.03] shadow-sm text-primary bg-primary/5 hover:bg-primary/15 hover:border-primary hover:text-white mx-1 align-middle">
                Official Chasing Sun(Sets) Identity
              </Link>{" "}
              and{" "}
              <Link href="/chasing-sunsets-facts" className="inline-flex items-center justify-center rounded-full border border-primary/40 px-3 py-1 text-[10px] font-[800] tracking-widest uppercase transition-all duration-300 hover:scale-[1.03] shadow-sm text-primary bg-primary/5 hover:bg-primary/15 hover:border-primary hover:text-white mx-1 align-middle">
                Not the fragrance — official music series
              </Link>
              . Listen on the{" "}
              <Link href="/radio" className="inline-flex items-center justify-center rounded-full border border-primary/40 px-3 py-1 text-[10px] font-[800] tracking-widest uppercase transition-all duration-300 hover:scale-[1.03] shadow-sm text-primary bg-primary/5 hover:bg-primary/15 hover:border-primary hover:text-white mx-1 align-middle">
                official radio hub
              </Link>
              .
            </p>
          </div>
        </motion.section>
      </main>

      <EntityBoostStrip tone="dark" className="pb-16" />
    </div>
  );
}
