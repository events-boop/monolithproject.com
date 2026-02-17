import { Link } from "wouter";
import { violet, cyan } from "./constants";

export default function UntoldContrast() {
  return (
    <section id="untold-contrast" className="scroll-mt-44 py-32 px-6 border-t" style={{ borderColor: `${violet}15` }}>
      <div className="container max-w-4xl mx-auto text-center">
        <h2 className="font-display text-5xl md:text-7xl text-white mb-6">TWO SIDES</h2>
        <p className="text-white/50 text-lg max-w-xl mx-auto mb-4">
          Chasing Sun(Sets) is the warmth. Untold Story is the weight. Together they make up The Monolith Project.
        </p>
        <p className="text-white/40 max-w-xl mx-auto mb-12">
          Same collective. Same community. Different time of night.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/chasing-sunsets">
            <div
              className="px-10 py-4 text-white font-display text-lg tracking-widest uppercase hover:text-white transition-colors cursor-pointer rounded-full"
              style={{ border: `1px solid ${violet}40` }}
            >
              CHASING SUN(SETS)
            </div>
          </Link>
          <Link href="/">
            <div
              className="px-10 py-4 font-display text-lg tracking-widest uppercase hover:opacity-90 transition-opacity cursor-pointer text-white rounded-full"
              style={{ background: `linear-gradient(135deg, ${violet}, ${cyan})` }}
            >
              BACK TO MONOLITH
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
