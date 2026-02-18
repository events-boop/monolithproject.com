import { useEffect, useRef, useState } from "react";
import { Users, Zap } from "lucide-react";

interface SocialSnapshot {
    summary: {
        totalGoing: number;
        totalPending: number;
        liveEvents: number;
    };
    events: Array<{
        eventTitle: string;
        goingCount: number;
    }>;
    activity: Array<{
        id: string;
        eventType: string;
        eventTitle: string;
        quantity: number;
        city?: string;
        at: string;
    }>;
}

export default function SocialEchoTicker() {
    const [snapshot, setSnapshot] = useState<SocialSnapshot | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/social/echo");
                if (res.ok) {
                    const data = await res.json();
                    if (data.ok) setSnapshot(data);
                }
            } catch { /* silent */ }
        };

        // Only poll when the ticker is visible on screen
        let interval: ReturnType<typeof setInterval> | null = null;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    fetchStats();
                    interval = setInterval(fetchStats, 60_000); // 60s (was 30s)
                } else if (interval) {
                    clearInterval(interval);
                    interval = null;
                }
            },
            { threshold: 0 },
        );

        const node = containerRef.current;
        if (node) observer.observe(node);
        fetchStats(); // initial fetch

        return () => {
            observer.disconnect();
            if (interval) clearInterval(interval);
        };
    }, []);

    if (!snapshot) return null;

    // Transform activity into marquee items
    const items: Array<{ type: "activity" | "stat" | "sales"; label: string; sub?: string }> = [];

    // 1. Total Stats
    if (snapshot.summary.totalGoing > 0) {
        items.push({
            type: "stat",
            label: `${snapshot.summary.totalGoing} PEOPLE GOING`,
            sub: "JOIN THE MOVEMENT",
        });
    }

    // 2. Recent Activity (Latest 5)
    snapshot.activity.slice(0, 5).forEach((act) => {
        const action = act.eventType.toLowerCase().includes("order") ? "BOUGHT TICKETS" : "RSVP'D";
        const location = act.city ? `FROM ${act.city.toUpperCase()}` : "";
        items.push({
            type: "sales",
            label: `SOMEONE ${location} JUST ${action}`,
            sub: act.eventTitle?.toUpperCase() || "MONOLITH EVENT",
        });
    });

    // 3. Event Specifics
    snapshot.events.forEach((evt) => {
        if (evt.goingCount > 0) {
            items.push({
                type: "stat",
                label: `${evt.goingCount} GOING TO ${evt.eventTitle.toUpperCase()}`,
            });
        }
    });

    // Fallback if empty
    if (items.length === 0) {
        items.push({ type: "stat", label: "JOIN THE RITUAL", sub: "TICKETS SELLING FAST" });
        items.push({ type: "stat", label: "LIVE ACTIVITY", sub: "MONOLITH PROJECT" });
    }

    // Duplicate for marquee loop
    const marqueeItems = [...items, ...items, ...items];

    return (
        <div ref={containerRef} className="w-full overflow-hidden h-[40px] md:h-[48px] bg-charcoal text-white flex items-center relative z-40 border-y border-white/10">
            <div className="flex animate-marquee whitespace-nowrap min-w-full shrink-0 items-center gap-12 px-6">
                {marqueeItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 shrink-0 opacity-90 transition-opacity hover:opacity-100">
                        {item.type === "sales" ? (
                            <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400/20" />
                        ) : (
                            <Users className="w-3.5 h-3.5 text-primary" />
                        )}
                        <div className="flex flex-col justify-center">
                            <span className="font-mono text-[10px] md:text-[11px] tracking-[0.15em] uppercase font-bold text-white/95 leading-none">
                                {item.label}
                            </span>
                            {item.sub && (
                                <span className="font-sans text-[9px] tracking-wide text-white/60 leading-none mt-0.5">
                                    {item.sub}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex animate-marquee whitespace-nowrap min-w-full shrink-0 items-center gap-12 px-6" aria-hidden="true">
                {marqueeItems.map((item, i) => (
                    <div key={`clone-${i}`} className="flex items-center gap-3 shrink-0 opacity-90">
                        {item.type === "sales" ? (
                            <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400/20" />
                        ) : (
                            <Users className="w-3.5 h-3.5 text-primary" />
                        )}
                        <div className="flex flex-col justify-center">
                            <span className="font-mono text-[10px] md:text-[11px] tracking-[0.15em] uppercase font-bold text-white/95 leading-none">
                                {item.label}
                            </span>
                            {item.sub && (
                                <span className="font-sans text-[9px] tracking-wide text-white/60 leading-none mt-0.5">
                                    {item.sub}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
