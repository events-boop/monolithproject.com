/*
  DESIGN: Cosmic Mysticism - About Page
  - Brand story and founder's vision
  - The mythology behind The Monolith
  - Team/collective info
  - Values and philosophy
*/

import { motion } from "framer-motion";
import { ArrowLeft, Heart, Users, Music, Sparkles, Target } from "lucide-react";
import { Link } from "wouter";
import ParticleField from "@/components/ParticleField";

const values = [
  {
    icon: Heart,
    title: "Authenticity",
    description: "Every experience is rooted in genuine intention, not trends or algorithms."
  },
  {
    icon: Users,
    title: "Togetherness",
    description: "We believe gathering should feel shared — a collective moment, not isolated consumption."
  },
  {
    icon: Target,
    title: "Intention",
    description: "Every detail is deliberate. From the sound to the setting, nothing is accidental."
  },
  {
    icon: Music,
    title: "Artistry",
    description: "We elevate DJing to storytelling. The selector is the narrator, the dancefloor is the audience."
  },
  {
    icon: Sparkles,
    title: "Timelessness",
    description: "We create moments that transcend the night — memories that stay with you."
  }
];

const chapters = [
  {
    name: "Chasing Sun(Sets)",
    tagline: "Where Light Meets Sound",
    description: "Seasonal sunset-aligned gatherings celebrating the golden hour. Rooftops, beaches, and elevated natural spaces become the stage for Afro house, organic rhythms, and global sounds. Each experience is a musical ceremony honoring light, change, and human connection.",
    color: "text-amber-400"
  },
  {
    name: "Untold Story",
    tagline: "For the Energy Givers. The Storytellers.",
    description: "A 360-degree sonic experience where the story is told through sound with deep meaning. The only unbroken story is the art of DJing — and the narrator is the DJ. Built on togetherness, this is where the monolith collective gathers to witness sound as narrative.",
    color: "text-purple-400"
  },
  {
    name: "Chasing Sun(Sets) Radio",
    tagline: "The Frequency Continues",
    description: "Beyond the gatherings, the sound lives on. Curated mixes and live sessions from our resident artists and global guests. Carry the golden hour with you, wherever you are.",
    color: "text-primary"
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden bg-noise">
      {/* Particle background */}
      <ParticleField />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm tracking-wider">Back to Home</span>
            </a>
          </Link>
          <span className="font-display text-lg tracking-ultra-wide text-primary">
            THE MONOLITH PROJECT
          </span>
        </div>
      </header>
      
      <main className="relative z-10 pt-24 pb-20">
        {/* Hero Section */}
        <section className="container py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Monolith Symbol */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              className="mb-8"
            >
              <svg
                viewBox="0 0 100 120"
                className="w-20 h-24 mx-auto text-primary"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              >
                <path d="M50 5 L85 115 L15 115 Z" />
                <path d="M50 25 L70 100 L30 100 Z" />
              </svg>
            </motion.div>
            
            <h1 className="font-display text-5xl md:text-7xl tracking-ultra-wide text-foreground mb-6">
              ABOUT THE<br />
              <span className="text-primary">MONOLITH</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground tracking-wide font-light">
              Guided by Authentic Intention — the purest form of energy.
            </p>
          </motion.div>
        </section>

        {/* The Why Section */}
        <section className="container py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-8 text-center">
              WHY WE <span className="text-primary">EXIST</span>
            </h2>
            
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Nightlife has become transactional. Disconnected. Focused on short attention spans and content creation rather than genuine human connection. We've traded presence for performance, community for clout.
              </p>
              
              <p>
                <span className="text-foreground font-medium">The Monolith Project exists to restore meaning to the spaces where we gather.</span>
              </p>
              
              <p>
                We create experiences where music guides people back into presence. Where sound carries emotion. Where gathering feels shared — rooted in rhythm, story, and togetherness.
              </p>
              
              <blockquote className="border-l-2 border-primary pl-6 py-4 my-8 italic text-foreground">
                "We believe music carries emotion. We believe gathering should feel shared. We believe in rhythm, story, and togetherness."
              </blockquote>
              
              <p>
                The Monolith is a metaphor — a portal, a frequency, a guide. Each chapter is part of a collective mythology, designed to unify communities through intentional sound, elevated design, and story-driven experiences.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Values Section */}
        <section className="container py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              OUR <span className="text-primary">VALUES</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The principles that guide every decision, every experience, every moment.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card/30 border border-border rounded-lg p-6 text-center hover:border-primary/30 transition-colors"
              >
                <value.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-display text-lg text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Chapters Section */}
        <section className="container py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              THE <span className="text-primary">CHAPTERS</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Each sub-brand is a chapter in our collective mythology.
            </p>
          </motion.div>
          
          <div className="space-y-8 max-w-3xl mx-auto">
            {chapters.map((chapter, index) => (
              <motion.div
                key={chapter.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-card/30 border border-border rounded-lg p-8 hover:border-primary/30 transition-colors"
              >
                <h3 className={`font-display text-2xl ${chapter.color} mb-2`}>
                  {chapter.name}
                </h3>
                <p className="text-sm text-muted-foreground tracking-wider uppercase mb-4">
                  {chapter.tagline}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {chapter.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Core Message */}
        <section className="container py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 border border-primary/20 rounded-2xl p-12 md:p-16">
              <p className="font-display text-3xl md:text-5xl tracking-ultra-wide text-foreground leading-tight">
                TOGETHERNESS IS THE FREQUENCY.
                <br />
                <span className="text-primary">MUSIC IS THE GUIDE.</span>
              </p>
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="container py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link href="/">
              <a className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-display text-lg tracking-widest hover:bg-primary/90 transition-colors">
                <span>ENTER THE PORTAL</span>
              </a>
            </Link>
          </motion.div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 The Monolith Project. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
