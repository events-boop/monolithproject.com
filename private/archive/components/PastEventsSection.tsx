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

      <div className="container layout-default px-6 relative z-10">
        <EditorialHeader
          kicker="Archive"
          title="Past Events"
          description="Select recaps from the archive. Moments, crowd energy, and sets that shaped the season."
        />
      </div>

      <div className="container layout-default px-6 relative z-10">
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
                <div className="ui-card relative aspect-[4/3] overflow-hidden rounded-[24px] border border-white/10 shadow-2xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

                      <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md text-white/90 border border-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-lg">
                        Recap
                      </div>

                      {/* Content */}
                      <div className="absolute inset-x-4 bottom-4 flex flex-col justify-end p-6 md:p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-[20px] transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
                        <span className="text-[10px] font-mono tracking-widest uppercase text-white/60 mb-2">
                          {event.date} · {event.photographer}
                        </span>
                        <h3 className="font-display text-2xl md:text-3xl lg:text-4xl text-white mb-2 uppercase drop-shadow-md">
                          {event.title}
                        </h3>
                        <p className="text-sm font-bold tracking-widest uppercase text-primary mb-4 drop-shadow-[0_0_10px_rgba(212,165,116,0.3)]">
                          {event.subtitle}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-white/80 group-hover:text-primary transition-colors">
                          <span>View Gallery</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
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
                        className="absolute inset-0 w-full h-full object-cover opacity-85 grayscale-[30%]"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />

                      <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md text-white/90 border border-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-lg">
                        Recap
                      </div>

                      {/* Content */}
                      <div className="absolute inset-x-4 bottom-4 flex flex-col justify-end p-6 md:p-8 bg-black/20 backdrop-blur-sm border border-white/5 rounded-[20px]">
                        <span className="text-[10px] font-mono tracking-widest uppercase text-white/50 mb-2">
                          {event.date} · {event.photographer}
                        </span>
                        <h3 className="font-display text-2xl md:text-3xl lg:text-4xl text-white/80 mb-2 uppercase">
                          {event.title}
                        </h3>
                        <p className="text-sm font-bold tracking-widest uppercase text-white/50 mb-4">
                          {event.subtitle}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-white/40">
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
