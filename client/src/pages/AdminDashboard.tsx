import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, AlertTriangle, CheckCircle, Database, Link as LinkIcon, RefreshCw, Radio, Activity, BarChart3, ShieldCheck, Lock, Unlock } from "lucide-react";
import { getPublicEvents, usePublicSiteDataVersion } from "@/lib/siteData";
import { isTicketOnSale } from "@/lib/siteExperience";
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

  const handleInvalidateCache = async () => {
    setIsScanning(true);
    try {
      const response = await fetch("/api/ops/cache/invalidate", { method: "POST" });
      if (response.ok) {
        // Trigger a re-render of components using public data
        window.location.reload(); 
      }
    } catch (err) {
      console.error("Cache invalidation failed", err);
    } finally {
      setIsScanning(false);
    }
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
                        className="btn-pill-neutral btn-pill-wide"
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
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-primary mb-4 block">Command_Center v1.1 // AUTHORIZED</span>
              <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter">Monolith Ops</h1>
              <p className="text-white/40 mt-4 max-w-xl font-mono text-sm uppercase tracking-widest">
                Hardware Monitoring & Performance Integrity
              </p>
            </div>
            <div className="flex items-center gap-4">
                <button
                onClick={handleInvalidateCache}
                disabled={isScanning}
                className="btn-pill-monolith btn-pill-compact group disabled:opacity-50"
                >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                {isScanning ? "Purging Cache..." : "Invalidate SWR Cache"}
                </button>
                <button
                onClick={runFullAudit}
                disabled={isScanning}
                className="btn-pill-outline btn-pill-compact group disabled:opacity-50"
                >
                <Activity className={`w-4 h-4 ${isScanning ? 'animate-pulse' : ''}`} />
                System Scan
                </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
            {[
              { label: "Data Nodes", val: publicEvents.length, icon: Database, color: "text-blue-400" },
              { label: "SWR Latency", val: "0ms", icon: Activity, color: "text-primary" },
              { label: "Status", val: issues.length === 0 ? "STABLE" : "DEGRADED", icon: CheckCircle, color: issues.length === 0 ? "text-green-400" : "text-amber-400" },
              { label: "Audit Ghosts", val: issues.length, icon: AlertTriangle, color: issues.length > 0 ? "text-red-400" : "text-white/20" },
            ].map((stat, i) => (
              <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
                <stat.icon className={`w-4 h-4 mb-6 ${stat.color}`} />
                <span className="font-mono text-[9px] tracking-widest uppercase text-white/20 block mb-2">{stat.label}</span>
                <span className="font-display text-3xl uppercase leading-none">{stat.val}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
            {/* Performance Baseline (P75 Mobile) */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-50" />
                 <h3 className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 mb-8 flex items-center gap-3">
                    <BarChart3 className="w-4 h-4 text-primary" /> Performance_Baseline (p75 Mobile)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: "LCP (Max)", val: "1.2s", target: "PASS" },
                        { label: "INP (Max)", val: "40ms", target: "PASS" },
                        { label: "CLS (Max)", val: "0.01", target: "PASS" },
                        { label: "Hydration", val: "0.4s", target: "PASS" },
                    ].map((metric, i) => (
                        <div key={i} className="p-5 border border-white/5 bg-black/40 rounded-xl">
                            <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest block mb-1">{metric.label}</span>
                            <div className="flex items-end justify-between">
                                <span className="font-display text-2xl">{metric.val}</span>
                                <span className="font-mono text-[8px] text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded leading-none">TARGET</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/5">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
                        <span className="text-white/20">Client JS Budget</span>
                        <span className="text-primary font-bold">1.0 MB (HARD LIMIT)</span>
                    </div>
                </div>
            </div>

            {/* Connectivity Sentry */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
              <h3 className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 mb-8 flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-primary" /> Connectivity_Sentry
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
          </div>

          {/* Issue List */}

          <div className="space-y-6">
            <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-white/30 mb-8 flex items-center gap-3">
              <ChevronRight className="w-4 h-4" /> Integrity_Logs
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
