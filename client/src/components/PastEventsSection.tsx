/*
  DESIGN: Cosmic Mysticism - Past Events Gallery Cards
  - Full-bleed image cards with overlay text
  - Event title, date, photographer credit
  - "View Gallery" button linking to Pixieset
  - Inspired by the reference screenshot style
*/

import { motion } from "framer-motion";
import { Camera, ArrowRight } from "lucide-react";

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
    id: "lazare-2025",
    title: "LAZARE",
    subtitle: "MONOLITH PROJECT",
    date: "December 12th, 2025",
    photographer: "JP Quindara",
    image: "/images/lazare-recap.png",
    galleryUrl: "https://pogistudios.pixieset.com/lazarecarbon/"
  },
  {
    id: "autograf-2025",
    title: "AUTOGRAF",
    subtitle: "MONOLITH PROJECT",
    date: "July 4th, 2025",
    photographer: "TBA",
    image: "/images/autograf-recap.jpg",
    galleryUrl: "#" // Placeholder
  }
];

export default function PastEventsSection() {
  return (
    <section id="recaps" className="relative py-24 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Camera className="w-6 h-6 text-primary" />
            <span className="text-sm tracking-ultra-wide text-muted-foreground uppercase">
              Moments Captured
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            PAST EVENTS
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Relive the energy. Browse galleries from our previous gatherings.
          </p>
        </motion.div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pastEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${event.image})` }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
              
              {/* Photographer Credit - Top Left */}
              <div className="absolute top-4 left-4 z-10">
                <span className="text-xs tracking-wider text-white/70 uppercase">
                  {event.photographer}
                </span>
              </div>
              
              {/* Content - Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
                {/* Event Title */}
                <h3 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-1">
                  {event.title} <span className="text-primary">|</span> {event.subtitle}
                </h3>
                
                {/* Date */}
                <p className="text-sm tracking-wider text-white/70 uppercase mb-6">
                  {event.date}
                </p>
                
                {/* View Gallery Button */}
                <a
                  href={event.galleryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white text-sm tracking-wider uppercase hover:bg-white/10 hover:border-white/50 transition-all duration-300 group/btn"
                  onClick={(e) => {
                    if (event.galleryUrl === "#") {
                      e.preventDefault();
                      // Could show a toast here
                    }
                  }}
                >
                  <span>View Gallery</span>
                  <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
