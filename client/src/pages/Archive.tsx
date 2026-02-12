import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Disc3 } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SlimSubscribeStrip from "@/components/SlimSubscribeStrip";
import { archiveRecaps, radioEpisodes } from "@/data/archive";

export default function Archive() {
  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          "radial-gradient(circle at 16% 18%, rgba(34,211,238,0.22), transparent 36%), radial-gradient(circle at 82% 16%, rgba(224,90,58,0.24), transparent 34%), linear-gradient(180deg,#091023 0%, #060914 100%)",
      }}
    >
      <Navigation />

      <section className="pt-44 pb-14 px-6">
        <div className="container max-w-6xl mx-auto">
          <p className="font-mono text-xs tracking-[0.22em] uppercase text-white/60 mb-5">Living Archive</p>
          <h1 className="font-display text-[clamp(3rem,11vw,7.2rem)] leading-[0.86] mb-5">ARCHIVE</h1>
          <p className="text-white/80 max-w-3xl text-lg">
            A permanent record of chapters, sets, and story moments. Every event and mix becomes a connected part of
            Monolith mythology.
          </p>
        </div>
      </section>

      <section className="px-6 pb-14">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-6 pb-4 border-b border-white/15">
            <h2 className="font-display text-3xl md:text-4xl">Event Recaps</h2>
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/55">
              {archiveRecaps.length} Stories
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {archiveRecaps.map((recap, index) => (
              <motion.article
                key={recap.slug}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="border border-white/20 rounded-2xl p-5 bg-white/5 backdrop-blur-md"
              >
                <div className="overflow-hidden rounded-xl border border-white/15 mb-4">
                  <img src={recap.image} alt={recap.title} className="w-full h-52 object-cover" />
                </div>
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/55 mb-2">{recap.date}</p>
                <h3 className="font-display text-3xl leading-[0.9] mb-2">{recap.title}</h3>
                <p className="text-white/70 mb-5">{recap.summary}</p>
                <div className="flex flex-wrap gap-3">
                  <Link href={`/archive/${recap.slug}`}>
                    <a className="px-4 py-2 border border-clay/70 text-clay rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-clay/10 transition-colors inline-flex items-center gap-2">
                      Read Recap
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </Link>
                  {recap.galleryUrl && (
                    <a
                      href={recap.galleryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-white/25 rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:border-white/50 transition-colors inline-flex items-center gap-2"
                    >
                      Gallery
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-6 pb-4 border-b border-white/15">
            <h2 className="font-display text-3xl md:text-4xl">Radio Episodes</h2>
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/55">
              {radioEpisodes.length} Mixes
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {radioEpisodes.map((episode, index) => (
              <motion.a
                key={episode.slug}
                href={episode.soundcloudUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="group border border-white/20 rounded-xl p-4 bg-white/5 backdrop-blur-md hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-md border border-primary/30 bg-primary/10 flex items-center justify-center">
                    <Disc3 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/50">{episode.publishedAt}</p>
                    <p className="font-semibold text-white">{episode.artist}</p>
                  </div>
                </div>
                <h3 className="font-display text-2xl leading-[0.9] mb-2">{episode.title}</h3>
                <p className="text-sm text-white/70 mb-3">{episode.commentary}</p>
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-primary">
                  Listen
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <SlimSubscribeStrip title="ARCHIVE UPDATES FIRST" source="archive_page_strip" />
      <Footer />
    </div>
  );
}

