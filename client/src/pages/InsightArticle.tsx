import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useParams } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import EntityBoostStrip from "@/components/EntityBoostStrip";
import { getInsightEntry } from "@/data/insights";
import { CTA_LABELS } from "@/lib/cta";

function isExternalLink(url: string) {
  return /^https?:\/\//i.test(url);
}

function getAccentClasses(accent: string) {
  switch (accent) {
    case "sunsets":
      return {
        chip: "text-clay border-clay/28 bg-clay/10",
        line: "from-clay/60 to-transparent",
      };
    case "radio":
      return {
        chip: "text-rose-300 border-rose-400/28 bg-rose-400/10",
        line: "from-rose-400/60 to-transparent",
      };
    case "story":
      return {
        chip: "text-primary border-primary/28 bg-primary/10",
        line: "from-primary/60 to-transparent",
      };
    default:
      return {
        chip: "text-primary border-primary/28 bg-primary/10",
        line: "from-primary/60 to-transparent",
      };
  }
}

const sectionTransition = { duration: 0.58, ease: [0.22, 1, 0.36, 1] as const };
const sectionReveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: sectionTransition,
};

export default function InsightArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getInsightEntry(slug) : undefined;

  if (!article) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SEO
          title="Article Not Found"
          description="The requested article was not found."
          canonicalPath="/insights"
        />
        <Navigation />
        <main id="main-content" tabIndex={-1} className="page-shell-start pb-24 px-6">
          <section className="container layout-narrow text-center">
            <h1 className="font-display text-[clamp(2.8rem,7vw,5.4rem)] uppercase mb-5">
              Article Not Found
            </h1>
            <p className="text-white/70 mb-8">
              This article is not live yet. Head back to Articles to browse the published pieces.
            </p>
            <Link href="/insights" className="btn-pill-coral">
              {CTA_LABELS.backToJournal}
            </Link>
          </section>
        </main>
      </div>
    );
  }

  const accent = getAccentClasses(article.accent);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <SEO
        title={`${article.title} | Inside Monolith`}
        description={article.summary}
        absoluteTitle
        canonicalPath={`/insights/${article.slug}`}
      />
      <Navigation />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-[-8vw] top-[8vh] h-[34rem] w-[34rem] rounded-full opacity-[0.12] bg-[radial-gradient(circle,rgba(224,90,58,0.22)_0%,transparent_64%)]" />
        <div className="absolute right-[-10vw] bottom-[-8vh] h-[28rem] w-[28rem] rounded-full opacity-[0.1] bg-[radial-gradient(circle,rgba(139,92,246,0.2)_0%,transparent_66%)]" />
      </div>

      <main id="main-content" tabIndex={-1} className="relative z-10 page-shell-start-loose pb-24">
        <motion.section className="container layout-default px-6" {...sectionReveal}>
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {CTA_LABELS.backToJournal}
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] ${accent.chip}`}>
                  {article.category}
                </span>
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                  {article.displayDate}
                </span>
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                  {article.readTime}
                </span>
              </div>

              <h1 className="mt-6 font-display text-[clamp(2.8rem,7vw,5.8rem)] leading-[0.9] uppercase text-white">
                {article.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
                {article.summary}
              </p>

              <div className="mt-6 h-px w-28 bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}>
                <div className={`h-px w-full bg-gradient-to-r ${accent.line}`} />
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 shadow-[0_22px_52px_rgba(0,0,0,0.24)]">
              <img
                src={article.image}
                alt={article.title}
                loading="lazy"
                decoding="async"
                className="h-[300px] w-full object-cover"
              />
            </div>
          </div>
        </motion.section>

        <motion.section className="container layout-narrow px-6 mt-12" {...sectionReveal}>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.025] p-7 md:p-8">
            <p className="text-lg leading-relaxed text-white/80 md:text-xl">{article.deck}</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        <section className="container layout-narrow px-6 mt-12 space-y-8">
          {article.sections.map((section) => (
            <motion.article
              key={section.title}
              className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-7 md:p-8"
              {...sectionReveal}
            >
              <h2 className="font-display text-3xl uppercase text-white">{section.title}</h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-white/70 md:text-lg">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </motion.article>
          ))}
        </section>

        <motion.section className="container layout-narrow px-6 mt-12" {...sectionReveal}>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.025] p-7 md:p-8">
            <h2 className="font-display text-3xl uppercase text-white">Related Links</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {article.relatedLinks.map((link) =>
                isExternalLink(link.href) || link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.03] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 transition-colors hover:border-white/20 hover:text-white"
                  >
                    {link.label}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.03] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 transition-colors hover:border-white/20 hover:text-white"
                  >
                    {link.label}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                ),
              )}
            </div>
          </div>
        </motion.section>
      </main>

      <EntityBoostStrip tone="dark" className="pb-8" />
    </div>
  );
}
