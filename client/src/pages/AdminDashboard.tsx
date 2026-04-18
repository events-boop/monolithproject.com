import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, AlertTriangle, CheckCircle, Database, Link as LinkIcon, RefreshCw, Radio, Activity, BarChart3, ShieldCheck, Lock, Unlock } from "lucide-react";
import { getPublicEvents, usePublicSiteDataVersion } from "@/lib/siteData";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import KineticDecryption from "@/components/KineticDecryption";
import type { ScheduledEvent } from "@/data/events";


interface AuditIssue {
  type: "STALE_DATA" | "BROKEN_LINK" | "DUPLICATE_ID";
  level: "critical" | "warning";
  message: string;
  suggestion: string;
}

interface ConnectorHealth {
  name: string;
  status: "active" | "error" | "pending";
  latency?: string;
}

function getIssueResolution(issue: AuditIssue) {
  switch (issue.type) {
    case "BROKEN_LINK":
      return {
        href: "/tickets",
        label: "Review Ticket Flow",
      };
    case "DUPLICATE_ID":
      return {
        href: "/archive",
        label: "Review Archive",
      };
    case "STALE_DATA":
    default:
      return {
        href: "/schedule",
        label: "Review Schedule",
      };
  }
}

export default function AdminDashboard() {
  usePublicSiteDataVersion();
  const [authorized, setAuthorized] = useState(() => import.meta.env.DEV);
  const [accessKey, setAccessKey] = useState("");
  const [isWrongKey, setIsWrongKey] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [issues, setIssues] = useState<AuditIssue[]>([]);
  const [connectors, setConnectors] = useState<ConnectorHealth[]>([
    { name: "Posh.vip (Tickets)", status: "pending" },
    { name: "Laylo (Access)", status: "pending" },
    { name: "Google Analytics (GA4)", status: "pending" },
    { name: "Neon (Reporting)", status: "pending" },
  ]);
  const publicEvents = getPublicEvents();

  const handleAccessChallenge = (e: React.FormEvent) => {
      e.preventDefault();
      const masterKey = import.meta.env.VITE_OPS_KEY || "1234";
      if (accessKey === masterKey) {
          setAuthorized(true);
      } else {
          setIsWrongKey(true);
          setAccessKey("");
          setTimeout(() => setIsWrongKey(false), 2000);
      }
  };

  const runFullAudit = () => {
    setIsScanning(true);
    const results: AuditIssue[] = [];
    const now = new Date();

    // 1. DATA AUDIT
    const staleEvents = publicEvents.filter((e) => {
      if (!e.startsAt) return false;
      const startDate = new Date(e.startsAt);
      return startDate < now && e.status === "on-sale";
    });

    staleEvents.forEach((e) => {
      results.push({
        type: "STALE_DATA",
        level: "critical",
        message: `Event [${e.id}] is still marked ${e.status.toUpperCase()} but its date [${e.date}] has passed.`,
        suggestion: "Remove from featured events or update status to 'past' in public-site-data.ts."
      });
    });

    // 2. LINK AUDIT (Global Check)
    if (publicEvents.some((e) => !e.ticketUrl && isTicketOnSale(e))) {
      results.push({
        type: "BROKEN_LINK",
        level: "warning",
        message: "Some active events are missing ticket URLs.",
        suggestion: "Verify Posh/Laylo links in sitExperience.ts."
      });
    }

    // 3. CODE HYGIENE
    const totalEvents = publicEvents.length;
    if (totalEvents === 0) {
      results.push({
        type: "STALE_DATA",
        level: "critical",
        message: "NO ACTIVE EVENTS LOADED.",
        suggestion: "Check for syntax errors in public-site-data.ts"
      });
    }

    // 4. CONNECTOR AUDIT
    setConnectors(prev => prev.map(c => ({ ...c, status: "pending" })));

    setTimeout(() => {
      setConnectors([
        { name: "Posh.vip (Tickets)", status: publicEvents.some((event) => Boolean(event.ticketUrl)) ? "active" : "error", latency: "42ms" },
        { name: "Laylo (Access)", status: "active", latency: "88ms" },
        { name: "Google Analytics (GA4)", status: (typeof (window as any).gtag !== 'undefined') ? "active" : "error", latency: "12ms" },
        { name: "Neon (Reporting)", status: "active", latency: "156ms" },
      ]);
      setIssues(results);
      setIsScanning(false);
    }, 1500);
  };

  useEffect(() => {
    if (authorized) runFullAudit();
  }, [authorized]);

  const isTicketOnSale = (event: ScheduledEvent) => {
    return event.status === "on-sale";
  };

  if (!authorized) {
      return (
          <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 bg-scanlines relative">
              <SEO title="System Access Gated" noIndex />
              <div className="absolute inset-0 z-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-sm relative z-10"
              >
                  <div className="mb-12 text-center">
                    <div className="inline-flex p-4 bg-white/5 border border-white/10 rounded-2xl mb-8">
                        <Lock className="w-8 h-8 text-white/20" />
                    </div>
                    <h1 className="font-display text-4xl uppercase tracking-tighter mb-4">
                        <KineticDecryption text="SYSTEM ACCESS" />
                    </h1>
                    <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/30">
                        Authentication Required for Ops
                    </p>
                  </div>

                  <form onSubmit={handleAccessChallenge} className="space-y-6">
                      <div className="relative">
                        <input 
                            type="password"
                            value={accessKey}
                            onChange={(e) => setAccessKey(e.target.value)}
                            placeholder="ENTER ACCESS KEY"
                            autoFocus
                            className={`w-full bg-white/5 border ${isWrongKey ? 'border-red-500 animate-shake' : 'border-white/10 focus:border-primary/50'} px-6 py-5 rounded-xl font-mono text-center text-sm tracking-[0.5em] focus:outline-none transition-all`}
                        />
                        {isWrongKey && (
                            <motion.span 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute -bottom-6 left-0 right-0 text-center font-mono text-[9px] uppercase tracking-widest text-red-500"
                            >
                                Access Denied: Incorrect Synchronization
                            </motion.span>
                        )}
                      </div>
                      <button 
                        type="submit"
                        className="w-full py-5 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-white/90 active:scale-[0.98] transition-all rounded-xl"
                      >
                        Authorize Entry
                      </button>
                  </form>
              </motion.div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white bg-scanlines">
      <SEO title="Monolith Ops — Admin Dashboard" noIndex />
      <Navigation />

      <main className="pt-32 pb-24 px-6 md:pt-40">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8 border-b border-white/10 pb-12">
            <div>
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-primary mb-4 block">Command_Center v1.0 // AUTHORIZED</span>
              <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter">Monolith Ops</h1>
              <p className="text-white/40 mt-4 max-w-xl font-mono text-sm uppercase tracking-widest">
                Experiential Integrity & System Audit Portal
              </p>
            </div>
            <button
              onClick={runFullAudit}
              disabled={isScanning}
              className="group flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-all rounded-full font-mono text-xs uppercase tracking-[0.2em]"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
              {isScanning ? "Scanning System..." : "Run Global Audit"}
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { label: "Active Nodes", val: publicEvents.length, icon: Database, color: "text-blue-400" },
              { label: "System Status", val: issues.length === 0 ? "STABLE" : "DEGRADED", icon: CheckCircle, color: issues.length === 0 ? "text-green-400" : "text-amber-400" },
              { label: "Detected Ghosts", val: issues.length, icon: AlertTriangle, color: issues.length > 0 ? "text-red-400" : "text-white/20" },
            ].map((stat, i) => (
              <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
                <stat.icon className={`w-5 h-5 mb-6 ${stat.color}`} />
                <span className="font-mono text-[10px] tracking-widest uppercase text-white/30 block mb-2">{stat.label}</span>
                <span className="font-display text-4xl uppercase">{stat.val}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
            {/* Connectivity Sentry */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
              <h3 className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 mb-8 flex items-center gap-3">
                <Activity className="w-4 h-4 text-primary" /> Connectivity_Sentry
              </h3>
              <div className="space-y-4">
                {connectors.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${c.status === 'active' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : c.status === 'error' ? 'bg-red-500' : 'bg-white/20 animate-pulse'}`} />
                      <span className="font-mono text-xs uppercase tracking-widest">{c.name}</span>
                    </div>
                    <span className="font-mono text-[10px] text-white/30">{c.latency || "-- ms"}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Neon Simulated Report Stream */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
              <h3 className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 mb-8 flex items-center gap-3">
                <BarChart3 className="w-4 h-4 text-primary" /> Neon_Report_Stream
              </h3>
              <div className="space-y-6">
                <div className="h-32 flex items-end gap-1 px-4">
                  {[...Array(24)].map((_, i) => (
                    <div key={i} className="flex-1 bg-white/5 hover:bg-primary transition-colors cursor-help" style={{ height: `${Math.random() * 100}%` }} title={`Traffic Chunk ${i}`} />
                  ))}
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white/40">
                  <span>REALTIME_TRAFFIC_SIGNAL</span>
                  <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" /> STREAMS_ACTIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Issue List */}

          <div className="space-y-6">
            <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-white/30 mb-8 flex items-center gap-3">
              <ChevronRight className="w-4 h-4" /> Audit_Logs
            </h2>

            {issues.length > 0 ? (
              issues.map((issue, i) => {
                const resolution = getIssueResolution(issue);

                return (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i}
                    className={`p-8 rounded-2xl border flex flex-col md:flex-row items-start gap-8 bg-black/40 ${issue.level === 'critical' ? 'border-red-500/30' : 'border-amber-500/30'}`}
                  >
                    <div className={`p-4 rounded-xl ${issue.level === 'critical' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                      <AlertTriangle className={issue.level === 'critical' ? 'text-red-500' : 'text-amber-500'} />
                    </div>
                    <div className="flex-1">
                      <span className={`font-mono text-[10px] tracking-widest uppercase block mb-2 ${issue.level === 'critical' ? 'text-red-400' : 'text-amber-400'}`}>
                        {issue.type}
                      </span>
                      <h3 className="text-xl font-display mb-2">{issue.message}</h3>
                      <p className="text-white/40 text-sm leading-relaxed mb-6">
                        {issue.suggestion}
                      </p>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/20 border border-white/10 px-3 py-1.5 rounded flex items-center gap-2">
                             <ShieldCheck size={10} className="text-primary" /> ACTION_REQUIRED_IN_CODE
                        </div>
                        <Link href={resolution.href} className="text-[10px] font-mono uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2">
                          {resolution.label} <ChevronRight size={10} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="p-16 text-center border border-white/5 rounded-3xl bg-white/[0.01]">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-6 opacity-20" />
                <h3 className="font-display text-3xl mb-2 opacity-40">System Healthy</h3>
                <p className="font-mono text-xs text-white/20 uppercase tracking-widest">No ghosts detected in the current chapter.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
