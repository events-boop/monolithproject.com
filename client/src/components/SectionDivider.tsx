import { motion } from "framer-motion";

interface SectionDividerProps {
  number: string;
  label?: string;
}

export default function SectionDivider({ number, label }: SectionDividerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="container max-w-6xl mx-auto px-6"
    >
      <div className="flex items-center gap-4 py-8">
        <motion.span
          initial={{ scale: 0.7, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="font-mono text-[11px] text-white tracking-[0.25em] tabular-nums px-2 py-1 border border-primary/70 rounded-full bg-gradient-to-r from-primary to-clay shadow-[0_0_18px_rgba(224,90,58,0.35)]"
        >
          {number}
        </motion.span>
        <div className="flex-1 overflow-hidden">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ originX: 0 }}
            className="h-[2px] bg-gradient-to-r from-primary/80 via-clay/55 to-transparent shadow-[0_0_14px_rgba(224,90,58,0.25)]"
          />
        </div>
        {label && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="font-mono text-[10px] text-white/75 tracking-[0.25em] uppercase"
          >
            {label}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
