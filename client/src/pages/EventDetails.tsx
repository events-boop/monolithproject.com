import { lazy, useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { getPublicEvents } from "@/lib/siteData";
import { ArrowLeft, Clock, MapPin, Music, Ticket, Star, CalendarPlus } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";
import { getEventCta } from "@/lib/cta";
import { useIntentPrefetch } from "@/hooks/useIntentPrefetch";
import ConversionCTA from "@/components/ConversionCTA";

export default function EventDetails() {
  const [match, params] = useRoute("/events/:slug");
  const [location, setLocation] = useLocation();
  const slug = params?.slug;

  const event = getPublicEvents().find((e) => e.slug === slug || e.id === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!event) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="font-display text-4xl mb-4">Event Cipher Null</h1>
        <p className="font-mono text-white/50 mb-8">The requested event data could not be located.</p>
        <MagneticButton>
          <button onClick={() => setLocation("/schedule")} className="border border-white/20 px-8 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
            Return to Schedule
          </button>
        </MagneticButton>
      </div>
    );
  }

  const bgImage = event.image || "/images/hero-monolith.jpg";
  const cta = getEventCta(event);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      <SEO
        title={`${event.title} - ${event.venue}`}
        description={event.description || `Join us for ${event.title} at ${event.venue} on ${event.date}.`}
      />
      <Navigation />

      {/* GOD-TIER EVENT HERO */}
      <div className="relative pt-[20vh] pb-[10vh] min-h-[70vh] flex flex-col justify-end px-6 xl:px-12 border-b border-white/10">
         <div className="absolute inset-0 z-0 bg-cover bg-center opacity-40 transition-opacity duration-1000 blur-sm brightness-50" style={{ backgroundImage: `url(${bgImage})` }} />
         <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
         
         <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-start">
            <button onClick={() => setLocation("/schedule")} className="mb-12 flex items-center gap-3 text-white/50 hover:text-white transition-colors font-mono text-[10px] tracking-widest uppercase">
              <ArrowLeft className="w-4 h-4" /> Schedule
            </button>
            
            <div className="flex flex-col gap-2 mb-6">
               <span className="font-mono text-primary text-xs uppercase tracking-[0.4em]">{event.series.replace("-", " ")}</span>
            </div>

            <h1 className="font-display text-[clamp(3rem,8vw,8rem)] leading-[0.85] tracking-tighter uppercase mb-6 drop-shadow-2xl max-w-5xl">
              {event.headline || event.title}
            </h1>

            <div className="flex flex-wrap gap-x-8 gap-y-4 font-mono text-white/70 text-xs md:text-sm tracking-[0.2em] uppercase mb-12">
               <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-white/40" /> {event.venue}</div>
               <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-white/40" /> {event.date} // {event.time}</div>
               {event.ticketTiers && event.ticketTiers.length > 0 && (
                 <div className="flex items-center gap-2 text-white"><Ticket className="w-4 h-4" /> From ${event.ticketTiers[0].price}</div>
               )}
            </div>

            <div className="w-full sm:w-auto">
               <ConversionCTA event={event} size="lg" className="w-full sm:w-auto px-12 py-5 text-[15px]" showUrgency={true} />
            </div>
         </div>
      </div>

      {/* GOD-TIER EVENT DOSSIER CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 xl:px-12 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
         {/* LEFT ARCHITECTURE: DETAILS */}
         <div className="lg:col-span-7 flex flex-col gap-16">
            {event.description && (
              <section>
                <h3 className="font-mono text-[10px] tracking-[0.4em] text-white/40 uppercase mb-8 border-b border-white/10 pb-4">Transmission</h3>
                <div className="prose prose-invert prose-p:text-white/70 prose-p:leading-relaxed prose-p:font-light text-lg">
                   <p>{event.description}</p>
                </div>
              </section>
            )}

            {event.whatToExpect && event.whatToExpect.length > 0 && (
               <section>
                 <h3 className="font-mono text-[10px] tracking-[0.4em] text-white/40 uppercase mb-8 border-b border-white/10 pb-4">Atmosphere</h3>
                 <ul className="flex flex-col gap-4">
                    {event.whatToExpect.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-4 text-white/80"><Star className="w-5 h-5 text-primary shrink-0 mt-0.5" /> {item}</li>
                    ))}
                 </ul>
               </section>
            )}
            
            {event.faqs && event.faqs.length > 0 && (
               <section>
                 <h3 className="font-mono text-[10px] tracking-[0.4em] text-white/40 uppercase mb-8 border-b border-white/10 pb-4">Logistics</h3>
                 <div className="flex flex-col gap-6">
                    {event.faqs.map((faq, idx) => (
                      <div key={idx} className="bg-white/[0.02] border border-white/5 p-6 rounded-sm">
                         <h4 className="font-bold text-white mb-2 font-mono tracking-wide text-sm">{faq.q}</h4>
                         <p className="text-white/60 text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                 </div>
               </section>
            )}
         </div>

         {/* RIGHT ARCHITECTURE: DOSSIER */}
         <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-white/[0.03] border border-white/10 p-8 flex flex-col gap-6 sticky top-32">
               <h3 className="font-mono text-[10px] tracking-[0.4em] text-white/40 uppercase border-b border-white/10 pb-4">Dossier</h3>
               
               <div className="flex flex-col gap-4 text-sm font-mono tracking-wide text-white/80">
                 {event.format && <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-white/40">Format</span><span>{event.format}</span></div>}
                 {event.sound && <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-white/40">Sound</span><span>{event.sound}</span></div>}
                 {event.dress && <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-white/40">Dress</span><span>{event.dress}</span></div>}
                 {event.age && <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-white/40">Age</span><span>{event.age}</span></div>}
                 <div className="flex justify-between pb-2"><span className="text-white/40">Location</span><span>{event.location}</span></div>
               </div>

               {event.eventNotice && (
                 <div className="mt-4 p-4 bg-primary/10 border border-primary/20 text-primary text-xs leading-relaxed font-mono">
                   {event.eventNotice}
                 </div>
               )}
            </div>
         </div>
      </div>

    </div>
  );
}
