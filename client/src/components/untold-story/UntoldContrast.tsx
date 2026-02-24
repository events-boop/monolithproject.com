import { Link } from "wouter";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";
import { motion } from "framer-motion";
export default function UntoldContrast() {
  return (
    <section id="untold-contrast" className="scroll-mt-44 py-32 px-6 border-t border-untold-violet-15">
      <div className="container max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-5xl md:text-7xl text-white mb-6"
        >
          TWO SIDES
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-white/50 text-lg max-w-xl mx-auto mb-4"
        >
          Chasing Sun(Sets) is the warmth. Untold Story is the weight. Together they make up The Monolith Project.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="text-white/40 max-w-xl mx-auto mb-12"
        >
          Same collective. Same community. Different time of night.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <MagneticButton strength={0.3}>
            <Link href="/chasing-sunsets">
              <div
                className="px-10 py-4 text-white font-display text-lg tracking-widest uppercase hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:border-orange-500/50 cursor-pointer rounded-full border border-untold-violet-30 group flex items-center justify-center gap-2"
              >
                CHASING SUN(SETS) <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </MagneticButton>
          <MagneticButton strength={0.3}>
            <Link href="/">
              <div
                className="px-10 py-4 font-display text-lg tracking-widest uppercase hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300 cursor-pointer text-white rounded-full bg-untold-hero-btn group flex items-center justify-center gap-2"
              >
                BACK TO MONOLITH <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </Link>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
