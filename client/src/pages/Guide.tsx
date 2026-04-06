import { Clock, MapPin, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import TacticalVenueMap from "@/components/TacticalVenueMap";
import SEO from "@/components/SEO";
import {
    getEventEyebrow,
    getEventVenueLabel,
    getExperienceEvent,
    getPrimaryTicketUrl,
} from "@/lib/siteExperience";
import { usePublicSiteDataVersion } from "@/lib/siteData";

const checklist = [
    { icon: CheckCircle, text: "Valid Government ID (21+)" },
    { icon: CheckCircle, text: "Ticket QR Code (Screenshot it!)" },
    { icon: CheckCircle, text: "Credit/Debit Card (Cashless Bar)" },
    { icon: AlertCircle, text: "No Professional Cameras" },
    { icon: AlertCircle, text: "No Outside Drinks" }
];

const venueMapHref = "https://maps.google.com/?q=1240+W+Randolph+St+Chicago+IL+60607";

function formatIsoTime(value?: string) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

export default function Guide() {
    usePublicSiteDataVersion();
    const guideEvent = getExperienceEvent("guide");
    const ticketUrl = getPrimaryTicketUrl(guideEvent);
    const timeline = guideEvent
        ? [
              {
                  time: guideEvent.doors || guideEvent.time,
                  event: "Doors Open",
                  desc: "Arrive in the first hour for the easiest entry and the full room arc.",
              },
              {
                  time: guideEvent.mainExperience || "Peak Window",
                  event: guideEvent.title === "AUTOGRAF" ? "Featured Performance" : "Main Experience",
                  desc:
                      guideEvent.description ||
                      "This is when the room locks in and the production hits full intensity.",
              },
              {
                  time: formatIsoTime(guideEvent.endsAt) || "Late",
                  event: "Closing Arc",
                  desc: "Last call energy. Confirm your exit plan before you leave the venue.",
              },
          ]
        : [];

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            <SEO
                title="Arrival Guide"
                description="Know before you go. Set times, parking, entry requirements, and pro-tips for a smooth night."
            />
            <Navigation />

            {/* Mobile-focused minimal header */}
            <main className="relative z-10 page-shell-start pb-32">
                <div className="container layout-narrow px-6">

                    <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
                        <div>
                            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary mb-2">
                                ● {getEventEyebrow(guideEvent)}
                            </p>
                            <h1 className="font-display text-4xl md:text-6xl uppercase text-white">The Night Of</h1>
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="font-mono text-xs text-white/50 tracking-wide">{guideEvent?.date || "Date TBA"}</p>
                            <p className="font-mono text-xs text-white/50 tracking-wide">{guideEvent?.venue || "Venue TBA"}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">

                        {/* Timeline */}
                        <section>
                            <h2 className="font-display text-2xl uppercase text-white mb-6 flex items-center gap-3">
                                <Clock className="w-5 h-5 text-primary" /> Set Times
                            </h2>
                            <div className="space-y-0 relative border-l border-white/10 ml-2 pl-8 pb-2">
                                {timeline.map((slot, idx) => (
                                    <div key={slot.time} className="relative mb-10 last:mb-0">
                                        <span className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-background border-2 border-white/20" />
                                        {idx === 0 && <span className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-primary animate-ping opacity-75" />}

                                        <p className="font-mono text-xs text-primary mb-1 tracking-widest">{slot.time}</p>
                                        <h3 className="font-display text-xl uppercase text-white mb-1">{slot.event}</h3>
                                        <p className="text-sm text-white/40">{slot.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Checklist & Map placeholder */}
                        <section className="space-y-12">

                            {/* Entry Requirements */}
                            <div id="entry" className="scroll-mt-32 bg-white/5 border border-white/10 rounded-xl p-6">
                                <h3 className="font-display text-lg uppercase text-white mb-4">Entry Checklist</h3>
                                <ul className="space-y-3">
                                    {checklist.map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                                            <item.icon className={`w-4 h-4 ${i < 3 ? "text-green-400" : "text-amber-400"}`} />
                                            {item.text}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Arrival Map */}
                            <div className="space-y-6">
                                <h3 className="font-display text-lg uppercase text-white flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary" /> Arrival Strategy
                                </h3>
                                
                                <TacticalVenueMap />
                                
                                <p className="mt-3 text-xs text-white/40 font-mono tracking-wide">
                                    Use the main entrance for general admission. <br />
                                    {guideEvent ? `${getEventVenueLabel(guideEvent)}.` : "VIP/Table check-in fast lane on the left."}
                                </p>
                            </div>

                            {guideEvent && ticketUrl && (
                                <a
                                    href={ticketUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-primary transition-colors hover:bg-primary/15"
                                >
                                    Tickets
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                            )}
                        </section>
                    </div>

                </div>
            </main>
        </div>
    );
}
