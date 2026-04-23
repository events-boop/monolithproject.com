import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ChevronRight, Share2, Mail } from "lucide-react";
import { Link, useParams } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import EntityBoostStrip from "@/components/EntityBoostStrip";
import { getInsightEntry } from "@/data/insights";
import { CTA_LABELS } from "@/lib/cta";
import MagneticButton from "@/components/MagneticButton";
import ResponsiveImage from "@/components/ResponsiveImage";

function isExternalLink(url: string) {
  return /^https?:\/\//i.test(url);
}

function getAccentClasses(accent: string) {
  switch (accent) {
    case "sunsets":
      return {
        chip: "text-clay border-clay/28 bg-clay/10",
        line: "from-clay/60 to-transparent",
        glow: "rgba(232, 184, 109, 0.15)",
      };
    case "radio":
      return {
        chip: "text-rose-300 border-rose-400/28 bg-rose-400/10",
        line: "from-rose-400/60 to-transparent",
        glow: "rgba(244, 63, 94, 0.15)",
      };
    case "story":
      return {
        chip: "text-primary border-primary/28 bg-primary/10",
        line: "from-primary/60 to-transparent",
        glow: "rgba(139, 92, 246, 0.15)",
      };
    default:
      return {
        chip: "text-primary border-primary/28 bg-primary/10",
        line: "from-primary/60 to-transparent",
        glow: "rgba(222, 75, 38, 0.15)",
      };
  }
}

const sectionTransition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const };
const sectionReveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
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
              This article is not live yet. Head back to the Journal to browse published pieces.
            </p>
            <Link href="/insights" className="btn-pill-monolith">
              {CTA_LABELS.backToJournal}
            </Link>
          </section>
        </main>
      </div>
    );
  }

  const accent = getAccentClasses(article.accent);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-white bg-scanlines relative">
      <SEO
        title={`${article.title} | Journal`}
        description={article.summary}
        absoluteTitle
        canonicalPath={`/insights/${article.slug}`}
      />
      <Navigation />

      {/* Atmospheric Immersive Backdrop */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 blur-[120px] saturate-[1.5]"
         >
            <ResponsiveImage
              src={article.image}
              alt=""
              sizes="100vw"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
         </motion.div>
         <div className="absolute inset-0 bg-black/60" />
      </div>

      <main id="main-content" tabIndex={-1} className="relative z-10 page-shell-start-loose pb-24">
        
        {/* Editorial Header */}
        <motion.section 
          className="container layout-default px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 mb-10 font-mono text-[9px] uppercase tracking-[0.2em] text-white/40" aria-label="Breadcrumb">
             <Link href="/" className="hover:text-white transition-colors">Root</Link>
             <ChevronRight size={10} />
             <Link href="/insights" className="hover:text-white transition-colors">Journal</Link>
             <ChevronRight size={10} />
             <span className="text-white/80">{article.category}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end mb-20 md:mb-32">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <span className={`inline-flex items-center rounded-sm border px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] ${accent.chip}`}>
                  {article.category}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                  {article.displayDate} // {article.readTime}
                </span>
                <button className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/20 hover:text-white/60 transition-colors ml-auto md:ml-0">
                    <Share2 size={12} /> Share Signal
                </button>
              </div>

              <h1 className="font-display text-[clamp(2.8rem,7vw,6.5rem)] leading-[0.85] uppercase text-white mb-10 text-balance drop-shadow-2xl">
                {article.title}
              </h1>
              
              <div className="h-0.5 w-32 mb-10" style={{ backgroundColor: accent.glow || '#DE4B26' }} />

              <p className="text-xl md:text-2xl leading-[1.4] text-white/60 font-light italic max-w-2xl">
                {article.summary}
              </p>
            </div>

            <div className="relative group">
               <div className="absolute -inset-4 bg-white/5 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
                 <ResponsiveImage
                    src={article.image}
                    alt={article.title}
                    priority
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="aspect-[4/5] md:aspect-auto h-[400px] md:h-[600px] w-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                  />
               </div>
            </div>
          </div>
        </motion.section>

        {/* Article Body */}
        <div className="container layout-narrow px-6">
          
          <motion.div 
            className="mb-16 border-l-2 pl-8 border-white/5"
            {...sectionReveal}
          >
             <p className="text-2xl md:text-3xl font-display uppercase leading-tight text-white italic opacity-90">{article.deck}</p>
             <div className="mt-8 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-white/30 border border-white/5 rounded-sm">
                        #{tag.replace(/\s+/g, '_').toLowerCase()}
                    </span>
                ))}
             </div>
          </motion.div>

          {/* Main Content Sections */}
          <div className="space-y-20 md:space-y-32">
            {article.sections.map((section, sIdx) => (
              <motion.section
                key={section.title}
                className="relative"
                {...sectionReveal}
              >
                <div className="flex items-center gap-4 mb-8">
                    <span className="font-mono text-[10px] text-primary">0{sIdx + 1}</span>
                    <h2 className="font-display text-4xl uppercase text-white tracking-wide">{section.title}</h2>
                </div>
                
                <div className="space-y-8 text-lg md:text-xl leading-[1.6] text-white/70 font-light">
                  {section.paragraphs.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>

          {/* Related Actions */}
          <motion.section className="mt-32 pt-16 border-t border-white/5" {...sectionReveal}>
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/20 mb-8 block text-center md:text-left">Related Transmissions</span>
            <div className="grid sm:grid-cols-2 gap-4">
              {article.relatedLinks.map((link) => (
                <Link
                   key={link.label}
                   href={link.href}
                   asChild
                >
                   <a className="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all flex items-center justify-between">
                      <span className="font-display text-xl uppercase tracking-wider">{link.label}</span>
                      <ArrowUpRight className="text-white/20 group-hover:text-primary transition-colors" />
                   </a>
                </Link>
              ))}
            </div>
          </motion.section>

          {/* Contextual Conversion — driving organic drive */}
          <motion.section 
            className="mt-32 p-10 md:p-16 rounded-[2.5rem] bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 relative overflow-hidden"
            {...sectionReveal}
          >
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="text-center md:text-left flex-1">
                   <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 mx-auto md:mx-0">
                      <Mail className="text-primary" size={20} />
                   </div>
                   <h3 className="font-display text-3xl md:text-4xl uppercase mb-4">Signal Subscription</h3>
                   <p className="text-white/40 font-mono text-[11px] uppercase tracking-[0.3em] leading-relaxed">
                      Receive deeper context on lineup drops, <br className="hidden md:block"/> radio programming, and private events.
                   </p>
                </div>
                
                <MagneticButton strength={0.3}>
                   <Link href="/newsletter" asChild>
                      <a className="btn-pill-neutral whitespace-nowrap">
                         Secure Access
                      </a>
                   </Link>
                </MagneticButton>
             </div>
             
             {/* Architectural Aura */}
             <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full blur-[100px] opacity-[0.05]" style={{ backgroundColor: accent.glow || '#DE4B26' }} />
          </motion.section>

        </div>
      </main>

      <EntityBoostStrip tone="dark" className="pb-8" />
    </div>
  );
}
