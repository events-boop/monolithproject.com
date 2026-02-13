import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6">
      <span className="font-mono text-xs text-primary tracking-widest uppercase mb-6">
        Lost Signal
      </span>
      <h1 className="font-display text-[clamp(5rem,20vw,14rem)] leading-[0.85] text-foreground">
        404
      </h1>
      <p className="text-muted-foreground text-lg mt-4 mb-10">
        This page doesn't exist.
      </p>
      <Link href="/" asChild>
        <a className="group flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-bold tracking-widest uppercase text-xs hover:bg-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
          Back to Monolith
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </Link>
    </div>
  );
}
