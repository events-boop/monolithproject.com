import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, CalendarRange, Clock3, Tag, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import ResponsiveImage from "@/components/ResponsiveImage";
import SEO from "@/components/SEO";
import EntityBoostStrip from "@/components/EntityBoostStrip";
import { insightEntries } from "@/data/insights";
import { CTA_LABELS } from "@/lib/cta";
import SplitText from "@/components/ui/SplitText";

const sortedEntries = [...insightEntries].sort(
  (a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime(),
);

const ALL_TAGS = Array.from(new Set(insightEntries.flatMap(e => e.tags))).sort();

function getAccentColor(accent: string) {
  switch (accent) {
    case "sunsets": return "#E8B86D";
    case "radio": return "#F43F5E";
    case "story": return "#8B5CF6";
    default: return "#DE4B26";
  }
}

export default function Insights() {
  const [featured, ...articles] = sortedEntries;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-white bg-scanlines">
      <SEO
        title="Journal"
        description="News, notes, artist features, and event context from The Monolith Project. Deeper logic for the Chicago ecosystem."
        canonicalPath="/insights"
      />
      <Navigation />

      <main id="main-content" tabIndex={-1} className="page-shell-start-loose pb-24 px-6">
        <div className="container layout-default">
          
          {/* Breadcrumbs for SEO Drive */}
          <nav className="flex items-center gap-2 mb-8 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30" aria-label="Breadcrumb">
             <Link href="/" className="hover:text-white transition-colors">Root</Link>
             <ChevronRight size={10} />
             <span className="text-white/60">Journal</span>
          </nav>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 md:mb-24"
          >
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-primary mb-4 block">
               System_Pulse // Journal
            </span>
            <h1 className="font-display text-[clamp(3.4rem,9vw,8rem)] leading-[0.82] uppercase tracking-tight-display text-white mb-8">
              <SplitText text="DEEPER LOGIC" initialDelay={0.2} />
              <br />
              <span className="opacity-40">& CONTEXT</span>
            </h1>
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                <p className="max-w-2xl text-lg md:text-xl leading-relaxed text-white/60 italic">
                  Clear writing about lineups, technical standards, series updates, and how the Chicago ecosystem is being built.
                </p>

                {/* Tag Discovery */}
                <div className="flex flex-wrap gap-2 max-w-md lg:justify-end">
                    {ALL_TAGS.slice(0, 6).map(tag => (
                        <span key={tag} className="px-3 py-1.5 rounded-sm border border-white/10 bg-white/5 font-mono text-[9px] uppercase tracking-widest text-white/40 hover:text-white transition-colors cursor-pointer">
                            #{tag.replace(/\s+/g, '_').toLowerCase()}
                        </span>
                    ))}
                </div>
            </div>
          </motion.section>

          {/* Featured Entry — immersive Wide Card */}
          {featured ? (
            <motion.section
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mb-20 group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-black"
            >
              <Link href={`/insights/${featured.slug}`} className="block relative min-h-[500px] md:min-h-[600px] overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <ResponsiveImage
                    src={featured.image}
                    alt={featured.title}
                    priority
                    sizes="100vw"
                    className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
                </div>

                <div className="absolute inset-0 z-10 p-8 md:p-16 flex flex-col justify-end items-start md:max-w-4xl">
                   <div className="flex flex-wrap items-center gap-4 mb-6">
                      <span 
                        className="px-4 py-1.5 rounded-full font-mono text-[10px] font-black uppercase tracking-[0.25em]"
                        style={{ backgroundColor: `${getAccentColor(featured.accent)}22`, color: getAccentColor(featured.accent), border: `1px solid ${getAccentColor(featured.accent)}44` }}
                      >
                         Featured Insight
                      </span>
                      <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.2em]">{featured.displayDate} // {featured.readTime}</span>
                   </div>

                   <h2 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.85] uppercase text-white mb-6 drop-shadow-2xl">
                     {featured.title}
                   </h2>
                   
                   <p className="text-lg md:text-xl text-white/70 max-w-xl mb-8 leading-relaxed line-clamp-2">
                     {featured.summary}
                   </p>

                   <div className="btn-text-action">
                      Read Full Analysis
                   </div>
                </div>
              </Link>
            </motion.section>
          ) : null}

          {/* Gallery Grid */}
          <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <motion.article
                key={article.slug}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                <Link href={`/insights/${article.slug}`} className="group flex flex-col h-full rounded-[2rem] overflow-hidden border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500">
                  <div className="aspect-[4/5] overflow-hidden relative">
                    <ResponsiveImage
                      src={article.image}
                      alt={article.title}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                    
                    {/* Corner Accent */}
                    <div 
                        className="absolute top-6 left-6 w-2 h-2 rounded-full" 
                        style={{ backgroundColor: getAccentColor(article.accent), boxShadow: `0 0 10px ${getAccentColor(article.accent)}` }}
                    />

                    <div className="absolute bottom-6 left-6 right-6">
                        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/50 block mb-3">
                            {article.category} // {article.displayDate}
                        </span>
                        <h3 className="font-display text-2xl md:text-3xl uppercase leading-[0.9] text-white group-hover:text-primary transition-colors">
                            {article.title}
                        </h3>
                    </div>
                  </div>
                  
                  <div className="p-7 flex flex-col flex-1 border-t border-white/5">
                    <p className="text-sm leading-relaxed text-white/40 mb-8 line-clamp-3">
                      {article.summary}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                        <span className="font-mono text-[9px] tracking-widest uppercase text-white/30 group-hover:text-white transition-colors">
                            Deep Context
                        </span>
                        <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </section>

          {/* Deeper Drive CTA */}
          <section className="mt-32 p-12 md:p-20 rounded-[3rem] border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent text-center">
             <span className="font-mono text-xs tracking-[0.4em] uppercase text-primary mb-6 block">Stay Informed</span>
             <h2 className="font-display text-4xl md:text-6xl uppercase mb-8">Never Miss A Signal</h2>
             <p className="max-w-xl mx-auto text-white/50 mb-12 italic text-lg leading-relaxed">
                Join the inner circle for deeper context on Chicago's best nights, artist research, and early access to the schedule.
             </p>
             <Link href="/newsletter" asChild>
                <a className="btn-pill-outline">
                    Join The Newsletter
                </a>
             </Link>
          </section>
        </div>
      </main>

      <EntityBoostStrip tone="dark" className="pb-8" />
    </div>
  );
}
