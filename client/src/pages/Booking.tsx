import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ViewportLazy from "@/components/ViewportLazy";

const BookingFormSection = lazy(() => import("@/components/BookingFormSection"));

export default function Booking() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <section className="pt-48 pb-16 px-6">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="font-mono text-xs text-primary tracking-[0.3em] uppercase block mb-6">
              Work With Us
            </span>
            <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-[0.9] uppercase text-foreground mb-6">
              BOOKING
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Whether you represent a venue, an artist, or a brand — we review every inquiry for alignment with the collective.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="container max-w-4xl mx-auto">
          <ViewportLazy minHeightClassName="min-h-[640px]">
            <Suspense fallback={<div className="border border-border p-8 md:p-12 min-h-[640px]" aria-hidden="true" />}>
              <BookingFormSection />
            </Suspense>
          </ViewportLazy>
        </div>
      </section>

      <Footer />
    </div>
  );
}
