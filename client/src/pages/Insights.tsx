import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, CalendarRange, Clock3 } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import EntityBoostStrip from "@/components/EntityBoostStrip";
import { insightEntries } from "@/data/insights";

const sortedEntries = [...insightEntries].sort(
  (a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime(),
);

export default function Insights() {
  const [featured, ...articles] = sortedEntries;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-white">
      <SEO
        title="Articles"
        description="News, notes, artist features, and event context from The Monolith Project."
        canonicalPath="/insights"
      />
      <Navigation />

      <main id="main-content" tabIndex={-1} className="page-shell-start-loose pb-24 px-6">
        <div className="container layout-default">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 md:mb-20"
          >
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary/80 block mb-5">
              Articles
            </span>
            <h1 className="font-display text-[clamp(3.4rem,9vw,7rem)] leading-[0.85] uppercase tracking-tight-display text-white">
              News, Notes,
              <br />
              And Event Context
            </h1>
            <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-white/70">
              Clear writing about lineups, radio episodes, series updates, and how The Monolith
              Project is being built.
            </p>
          </motion.section>

          {featured ? (
            <motion.section
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mb-16 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_24px_60px_rgba(0,0,0,0.28)]"
            >
              <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                <div className="relative min-h-[320px]">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    loading="eager"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                </div>

                <div className="flex flex-col justify-between p-8 md:p-10">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                        Featured Article
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                        <CalendarRange className="h-3.5 w-3.5" />
                        {featured.displayDate}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                        <Clock3 className="h-3.5 w-3.5" />
                        {featured.readTime}
                      </span>
                    </div>

                    <h2 className="mt-6 font-display text-[clamp(2rem,4vw,3.6rem)] leading-[0.92] uppercase text-white">
                      {featured.title}
                    </h2>
                    <p className="mt-5 text-base leading-relaxed text-white/70">
                      {featured.summary}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href={`/insights/${featured.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-black transition-colors hover:bg-primary hover:text-white"
                    >
                      Read Article
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/radio"
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.03] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 transition-colors hover:border-white/20 hover:text-white"
                    >
                      Open Radio Show
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.section>
          ) : null}

          <section className="grid gap-5 md:grid-cols-2">
            {articles.map((article, index) => (
              <motion.article
                key={article.slug}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025]"
              >
                <Link href={`/insights/${article.slug}`} className="block">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-6 md:p-7">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                        {article.category}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                        <CalendarRange className="h-3.5 w-3.5" />
                        {article.displayDate}
                      </span>
                    </div>

                    <h3 className="mt-5 font-display text-3xl uppercase leading-[0.95] text-white">
                      {article.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-base">
                      {article.summary}
                    </p>

                    <div className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
                      Read Article
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </section>
        </div>
      </main>

      <EntityBoostStrip tone="dark" className="pb-8" />
    </div>
  );
}
