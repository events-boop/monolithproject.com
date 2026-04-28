import { motion } from "framer-motion";

const partners = [
  "CASTAWAYS",
  "KASHMIR CHICAGO",
  "LA SONESTA",
  "HIDEAWAY CHICAGO",
  "BASSMENT CHICAGO",
  "MOSAIC CHICAGO",
  "JPARKER CHICAGO",
];

export default function PartnershipMarquee() {
  return (
    <section className="bg-black py-12 border-y border-white/5 overflow-hidden">
      <div className="container px-6 mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/58 text-center">
          Trusted Venue Partners
        </p>
      </div>
      
      <div className="flex select-none">
        <motion.div 
          className="flex whitespace-nowrap gap-16 md:gap-24 items-center"
          animate={{ x: [0, -1000] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {[...partners, ...partners].map((partner, i) => (
            <span 
              key={i} 
              className="font-display text-2xl md:text-3xl text-white/48 hover:text-white/82 transition-colors duration-500 uppercase tracking-widest italic"
            >
              {partner}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
