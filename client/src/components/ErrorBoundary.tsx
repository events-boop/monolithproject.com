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
      // Force showing debug details even in production for now to diagnose the crash
      const showDebugDetails = true;
      const errorMessage = this.state.error?.message || "Unknown error";
      const errorStack = this.state.error?.stack || "";

      return (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-8 bg-black text-white"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, backgroundColor: '#000', color: '#fff', overflow: 'auto' }}
        >
          <div className="flex flex-col items-center w-full max-w-4xl p-8 border border-red-500 rounded-lg bg-[#111]">
            <AlertTriangle
              size={48}
              className="text-red-500 mb-6 flex-shrink-0"
              style={{ color: '#ef4444' }}
            />

            <h2 className="text-2xl font-bold mb-4 text-red-500">APPLICATION CRASHED</h2>
            <p className="text-lg mb-6 text-center text-gray-300">{errorMessage}</p>

            {showDebugDetails && (
              <div className="p-4 w-full rounded bg-[#222] overflow-auto mb-6 max-h-[60vh] border border-gray-700">
                <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap">
                  {errorStack}
                </pre>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg font-bold",
                "bg-white text-black hover:bg-gray-200 cursor-pointer"
              )}
            >
              <RotateCcw size={16} />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
