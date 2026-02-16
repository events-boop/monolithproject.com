import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import EditorialHeader from "./EditorialHeader";

interface PastEvent {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  photographer: string;
  image: string;
  galleryUrl: string;
}

const pastEvents: PastEvent[] = [
  {
    id: "lazare-sabry-s3e1",
    title: "LAZARE SABRY",
    subtitle: "UNTOLD STORY S3·E1",
    date: "December 12th, 2025",
    photographer: "JP Quindara",
    image: "/images/lazare-recap.webp",
    galleryUrl: "https://pogistudios.pixieset.com/lazarecarbon/",
  },
  {
    id: "autograf-2025",
    title: "AUTOGRAF",
    subtitle: "MONOLITH PROJECT",
    date: "July 4th, 2025",
    photographer: "TBA",
    image: "/images/autograf-recap.jpg",
    galleryUrl: "#",
  },
];

export default function PastEventsSection() {
  return (
    <section id="recaps" className="section-rhythm bg-background relative overflow-hidden">
      <div className="absolute inset-0 atmo-surface opacity-80 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_22%,rgba(255,255,255,0.08),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0)_35%,rgba(0,0,0,0.25)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        <EditorialHeader
          kicker="Archive"
          title="Past Events"
          description="Select recaps from the archive. Moments, crowd energy, and sets that shaped the season."
        />
      </div>

      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pastEvents.map((event, index) => {
            const hasGallery = event.galleryUrl !== "#";
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.35 }}
              >
                <div className="ui-card relative aspect-[4/3] overflow-hidden border border-white/10">
                  {hasGallery ? (
                    <a
                      href={event.galleryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                    >
                      {/* Image */}
                      <img
                        src={event.image}
                        alt={event.title}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

                      <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 text-charcoal ui-chip">
                        Recap
                      </div>

                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-8">
                        <span className="ui-chip text-white/70 mb-2">
                          {event.date} · {event.photographer}
                        </span>
                        <h3 className="ui-heading font-display text-3xl md:text-4xl text-white mb-3 uppercase">
                          {event.title}
                        </h3>
                        <p className="ui-chip text-white/65 mb-5">
                          {event.subtitle}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-white/80 group-hover:text-primary transition-colors">
                          <span>View Gallery</span>
                          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div className="group absolute inset-0 cursor-not-allowed">
                      {/* Image */}
                      <img
                        src={event.image}
                        alt={event.title}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover opacity-85"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/45 to-transparent" />

                      <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 text-charcoal ui-chip">
                        Recap
                      </div>

                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-8">
                        <span className="ui-chip text-white/70 mb-2">
                          {event.date} · {event.photographer}
                        </span>
                        <h3 className="ui-heading font-display text-3xl md:text-4xl text-white mb-3 uppercase">
                          {event.title}
                        </h3>
                        <p className="ui-chip text-white/65 mb-5">
                          {event.subtitle}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-white/55">
                          <span>Gallery Coming Soon</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
