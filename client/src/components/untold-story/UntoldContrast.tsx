import { Link } from "wouter";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";
import { motion } from "framer-motion";
export default function UntoldContrast() {
  return (
    <section id="untold-contrast" className="scroll-shell-target py-16 md:py-24 px-6 border-t border-untold-violet-15">
      <div className="container layout-narrow text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-5xl md:text-7xl text-white mb-6"
        >
          TWO SERIES
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-white/50 text-lg max-w-xl mx-auto mb-4"
        >
          Chasing Sun(Sets) is the open-air series. Untold Story is the late-night series. Together they make up The Monolith Project.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="text-white/40 max-w-xl mx-auto mb-12"
        >
          Same standard. Different time of night.
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
                className="btn-pill-outline btn-pill-outline-sunsets group"
              >
                CHASING SUN(SETS) <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </MagneticButton>
          <MagneticButton strength={0.3}>
            <Link href="/">
              <div
                className="btn-pill-untold group"
              >
                MONOLITH HOME <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </Link>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
