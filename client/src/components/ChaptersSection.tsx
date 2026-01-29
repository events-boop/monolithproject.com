/*
  DESIGN: Cosmic Mysticism - Chapters section
  - Event pillars: Chasing Sun(Sets) and Untold Story
  - Card-based layout with hover effects
  - Each chapter as a distinct experience
*/

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";
import { Sun, Moon, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const chapters = [
  {
    id: "chasing-sunsets",
    number: "01",
    title: "CHASING SUN(SETS)",
    tagline: "Where light meets sound.",
    description:
      "A seasonal gathering aligned with the golden hour — that sacred moment when day surrenders to night. Set against rooftops, beaches, and elevated natural spaces, each experience is a musical ceremony celebrating light, change, and human connection.",
    sound: "Afro House · Organic House · Global Rhythms",
    moment: "Always golden hour. Always intentional.",
    image: "/images/chasing-sunsets.jpg",
    icon: Sun,
    accent: "from-amber-500/20 to-orange-500/20",
  },
  {
    id: "untold-story",
    number: "02",
    title: "UNTOLD STORY",
    tagline: "For the energy givers. The storytellers.",
    description:
      "A 360-degree sonic experience where the story is told through sound with deep meaning. The only unbroken story is the art of DJing — and the narrator is the DJ. Built on togetherness, this is where the monolith collective gathers to witness sound as narrative.",
    sound: "Immersive · Intimate · Intentional",
    moment: "360 sound experience",
    image: "/images/untold-story.jpg",
    icon: Moon,
    accent: "from-purple-500/20 to-indigo-500/20",
  },
];

export default function ChaptersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleExplore = (chapterTitle: string) => {
    toast("Coming Soon", {
      description: `${chapterTitle} events will be announced soon. Join our newsletter to be notified.`,
    });
  };

  return (
    <section
      id="chapters"
      ref={ref}
      className="relative section-padding bg-card"
    >
      {/* Section Header */}
      <div className="container max-w-6xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="font-mono text-xs text-primary tracking-widest uppercase mb-4 block">
            02 — The Chapters
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide text-foreground mb-4">
            EACH EXPERIENCE IS A CHAPTER
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            In our collective story.
          </p>
        </motion.div>
      </div>

      {/* Chapters Grid */}
      <div className="container max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group relative overflow-hidden"
            >
              {/* Card */}
              <div className="relative h-full bg-background border border-border hover:border-primary/50 transition-all duration-500">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={chapter.image}
                    alt={chapter.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${chapter.accent} to-transparent`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                  {/* Chapter Number */}
                  <div className="absolute top-4 left-4">
                    <span className="font-mono text-xs text-primary tracking-widest">
                      CHAPTER {chapter.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="absolute top-4 right-4">
                    <chapter.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="font-display text-2xl md:text-3xl tracking-wide text-foreground mb-2">
                    {chapter.title}
                  </h3>
                  <p className="text-primary text-sm tracking-widest uppercase mb-4">
                    {chapter.tagline}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {chapter.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 mb-6 pb-6 border-b border-border">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground uppercase tracking-widest">
                        The Sound:
                      </span>
                      <span className="text-foreground">{chapter.sound}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground uppercase tracking-widest">
                        The Moment:
                      </span>
                      <span className="text-foreground">{chapter.moment}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-auto">
                    <Link href={chapter.id === "chasing-sunsets" ? "/chasing-sunsets" : "/story"}>
                      <button className="group/btn flex items-center gap-2 text-sm text-primary hover:text-foreground transition-colors">
                        <span className="tracking-widest uppercase">Explore</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
