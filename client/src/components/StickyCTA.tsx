/*
  DESIGN: Cosmic Mysticism - Sticky bottom-right CTA
  - Fixed position in bottom-right corner
  - Appears after scrolling past hero
  - "Get Tickets" button links to /tickets
*/

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket } from "lucide-react";
import { Link } from "wouter";

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past 50% of viewport height
      const scrollThreshold = window.innerHeight * 0.5;
      setIsVisible(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <Link href="/tickets">
          <motion.a
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="fixed bottom-24 right-6 z-40 flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium text-sm tracking-wide shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          >
            <Ticket className="w-4 h-4" />
            <span>Get Tickets</span>
          </motion.a>
        </Link>
      )}
    </AnimatePresence>
  );
}
