import { useState } from "react";
import { ArrowUpRight, AlertCircle } from "lucide-react";
import { submitNewsletterLead } from "@/lib/api";

interface SlimSubscribeStripProps {
  title: string;
  source: string;
  dark?: boolean;
}

export default function SlimSubscribeStrip({ title, source, dark = true }: SlimSubscribeStripProps) {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email");
      return;
    }
    if (!agreed) {
      setError("Please agree to continue");
      return;
    }

    setSubmitting(true);
    try {
      await submitNewsletterLead({ email, consent: true, source }, crypto.randomUUID());
      setOk(true);
      setEmail("");
      setAgreed(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not subscribe right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={`relative py-8 md:py-10 px-6 border-t ${dark ? "border-white/10 bg-background text-white" : "border-charcoal/15 bg-paper text-charcoal"}`}>
      <div className={`pointer-events-none absolute inset-0 ${dark
        ? "bg-[radial-gradient(circle_at_18%_40%,rgba(34,211,238,0.12),transparent_36%),radial-gradient(circle_at_82%_60%,rgba(224,90,58,0.12),transparent_34%)]"
        : "bg-[radial-gradient(circle_at_18%_40%,rgba(34,211,238,0.08),transparent_36%),radial-gradient(circle_at_82%_60%,rgba(224,90,58,0.08),transparent_34%)]"
        }`} />
      <div className="container max-w-6xl mx-auto relative z-10">
        <form onSubmit={onSubmit} className="grid lg:grid-cols-[1.1fr_1.5fr_auto] gap-4 lg:gap-8 items-center">
          <h3 className={`font-display text-3xl md:text-5xl leading-[0.9] uppercase ${dark ? "text-white" : "text-charcoal"}`}>{title}</h3>

          <div className="space-y-3">
            <label htmlFor={`strip-email-${source}`} className={`${dark ? "text-white/80" : "text-charcoal/80"} text-lg`}>
              Enter Your Email Address
            </label>
            <input
              id={`strip-email-${source}`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className={`w-full bg-transparent border-b pb-2 outline-none ${dark ? "border-white/35 text-white placeholder:text-white/45" : "border-charcoal/30 text-charcoal placeholder:text-charcoal/50"}`}
            />
            <label className={`inline-flex items-center gap-2 text-sm ${dark ? "text-white/70" : "text-charcoal/70"}`}>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="accent-primary" />
              I agree to the <span className="underline">Privacy Policy</span>.
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold tracking-widest text-xs transition-all ${dark
                ? "bg-white text-black hover:bg-white/90 border border-white"
                : "bg-charcoal text-white hover:bg-charcoal/90 border border-charcoal"
              } disabled:opacity-50`}
          >
            {ok ? "SUBSCRIBED" : submitting ? "JOINING..." : "JOIN THE LIST"}
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </form>

        {error && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-red-400 text-xs font-mono">
            <AlertCircle className="w-3 h-3" /> {error}
          </p>
        )}
      </div>
    </section>
  );
}

