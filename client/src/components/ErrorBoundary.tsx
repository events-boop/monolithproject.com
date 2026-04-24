import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      const showDebugDetails = import.meta.env.DEV && Boolean(this.state.error?.stack);
      return (
        <div className="flex flex-col items-center justify-center min-h-[100svh] p-8 bg-background selection:bg-primary/30">
          <div className="flex flex-col items-start w-full max-w-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 md:p-12 shadow-[0_45px_100px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-4 mb-8">
               <div className="h-px w-12 bg-destructive/50" />
               <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-destructive">Signal Interruption</span>
            </div>
            
            <h2 className="font-display text-5xl md:text-7xl leading-[0.85] uppercase text-white mb-6 tracking-tighter">
              System<br/>
              Equilibrium<br/>
              Lost
            </h2>

            <p className="font-mono text-xs md:text-sm tracking-[0.1em] text-white/50 leading-relaxed mb-10 max-w-md">
              A fatal exception has occurred within the Monolith rendering engine. The current scene has been terminated to prevent data contamination.
            </p>

            {showDebugDetails && (
              <div className="w-full rounded bg-black/60 border border-white/5 p-5 overflow-auto mb-10 max-h-48 scrollbar-thin scrollbar-thumb-white/10">
                <pre className="font-mono text-[10px] text-destructive/80 whitespace-break-spaces">
                  {this.state.error?.stack}
                </pre>
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => window.location.reload()}
                className="group flex items-center gap-3 px-6 py-3 bg-white text-black font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-primary transition-all duration-500"
              >
                <RotateCcw size={14} className="group-hover:rotate-[-180deg] transition-transform duration-700" />
                Resynchronize
              </button>
              
              <a 
                href="/"
                className="flex items-center gap-3 px-6 py-3 border border-white/10 text-white/60 font-mono text-[11px] uppercase tracking-[0.2em] hover:text-white hover:border-white transition-all duration-500"
              >
                Return to Root
              </a>
            </div>
          </div>
          
          <div className="fixed inset-0 -z-10 pointer-events-none opacity-20">
             <div className="absolute inset-0 bg-noise mix-blend-overlay" />
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1),transparent_70%)]" />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
