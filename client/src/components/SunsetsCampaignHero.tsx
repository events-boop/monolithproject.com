import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { CHASING_SUNSETS_DROP_URL } from "@/lib/dropLinks";
import {
  SUNSETS_JULY4_TICKET_PATH,
  captureSunsetsTicketCtaClick,
} from "@/lib/sunsetsTicketing";
import { appendAttributionQueryParams } from "@/lib/attribution";

export default function SunsetsCampaignHero() {
  const julyFourTicketHref = appendAttributionQueryParams(
    SUNSETS_JULY4_TICKET_PATH
  );

  return (
    <section
      className="relative w-full min-h-[90vh] flex flex-col justify-end lg:justify-center font-sans text-white overflow-hidden pb-20 pt-28 lg:pt-20"
      style={{
        backgroundImage: "url(/sunsets_hero_bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "scroll",
      }}
    >
      {/* Softened dark overlay for readability without muddying the image */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      {/* Top gradient for Navigation bar legibility */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
      {/* Bottom gradient to blend into the next section smoothly */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12 mt-10">
        {/* Left Column: Typography & CTA */}
        <div className="flex-1 flex flex-col items-start text-left max-w-2xl w-full">
          <h2 className="text-yellow-400 font-bold tracking-widest uppercase mb-4 text-sm md:text-base drop-shadow-md">
            LAKE • MUSIC • COMMUNITY
          </h2>

          <h1
            className="text-7xl md:text-9xl font-black leading-none tracking-tighter mb-2 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
            style={{
              fontFamily: "Impact, sans-serif",
              WebkitTextStroke: "2px rgba(0,0,0,0.5)",
            }}
          >
            SUN(SETS)
          </h1>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-1 w-12 sm:w-16 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
            <span
              className="text-4xl md:text-5xl font-bold tracking-widest text-yellow-400 drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
            >
              2026
            </span>
            <div className="h-1 w-12 sm:w-16 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
          </div>

          {/* Badge & Date Block */}
          <div className="bg-black/80 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6 mb-8 shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform relative">
            <div className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-sm transform rotate-6 uppercase tracking-wider shadow-lg border border-red-400/50">
              FIRST ACCESS NOW OPEN
            </div>
            <h3 className="text-2xl md:text-3xl font-black tracking-wider text-white mb-1">
              JULY <span className="text-pink-500">4TH</span> 2026
            </h3>
            <p className="text-yellow-400 font-bold tracking-widest mb-1 text-sm md:text-base">
              CASTAWAYS BEACH CLUB
            </p>
            <p className="text-gray-400 text-sm tracking-widest uppercase">
              CHICAGO LAKEFRONT
            </p>
          </div>

          <p className="text-lg md:text-xl font-medium leading-relaxed max-w-lg mb-10 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hidden sm:block">
            Chasing Sun(Sets) returns to the lake for Independence Day. A
            full-day Chicago lakefront celebration with house music, fireworks,
            skyline views, sunset energy, and good people.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-12 sm:mb-16 w-full sm:w-auto">
            <a
              href={julyFourTicketHref}
              onClick={() =>
                captureSunsetsTicketCtaClick({
                  destinationUrl: julyFourTicketHref,
                  pagePath: "/",
                  ctaPosition: "hero_primary",
                  sourcePage: "homepage",
                })
              }
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold py-4 px-10 rounded-full text-lg shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              GET TICKETS <ArrowUpRight className="w-5 h-5" />
            </a>
            <a
              href={appendAttributionQueryParams(CHASING_SUNSETS_DROP_URL)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black/80 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold py-4 px-10 rounded-full text-lg shadow-[0_0_20px_rgba(250,204,21,0.2)] transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              JOIN LAKE LIST <ArrowUpRight className="w-5 h-5" />
            </a>
          </div>

          {/* Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-xl">
            {[
              { icon: "🌴", label: "LAKEFRONT\nVIBES", color: "text-pink-500" },
              {
                icon: "🌐",
                label: "DAY INTO\nNIGHT",
                color: "text-yellow-400",
              },
              {
                icon: "👁️",
                label: "GOOD PEOPLE\nGOOD ENERGY",
                color: "text-cyan-400",
              },
              {
                icon: "✨",
                label: "MUSIC\nTHAT MOVES",
                color: "text-yellow-500",
              },
            ].map((badge, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center gap-2"
              >
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-current ${badge.color} bg-black/60 flex items-center justify-center text-2xl sm:text-3xl shadow-lg backdrop-blur-sm`}
                >
                  {badge.icon}
                </div>
                <div
                  className={`text-[9px] sm:text-[10px] font-bold tracking-widest whitespace-pre-line leading-tight ${badge.color} drop-shadow-md`}
                >
                  {badge.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Framed Poster */}
        <div className="flex-1 flex justify-center lg:justify-end items-center w-full max-w-sm lg:max-w-xl relative mt-12 lg:mt-0">
          <div className="relative w-full aspect-[4/5] bg-[#111] p-3 sm:p-4 rounded-lg shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] transform md:rotate-2 hover:rotate-0 transition-all duration-500 border border-gray-800">
            {/* Inner Poster Frame */}
            <div
              className="w-full h-full rounded border-2 border-black relative overflow-hidden"
              style={{
                backgroundImage: "url(/sunsets_poster.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Gradient overlay for text readability at the bottom */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 sm:p-6 pb-8 sm:pb-12 text-center border-t-2 border-pink-500/50">
                <div className="bg-pink-500 text-white text-[9px] sm:text-[10px] font-bold px-3 py-1 inline-block rounded-sm mb-2 sm:mb-3 transform -skew-x-12 uppercase tracking-widest">
                  CO-HEADLINERS
                </div>
                <div
                  className="text-2xl sm:text-4xl font-black text-white tracking-tighter leading-none mb-2"
                  style={{ fontFamily: "Impact, sans-serif" }}
                >
                  AUTOGRAF <span className="text-pink-500">★</span> KIKO FRANCO
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-yellow-400 tracking-widest uppercase mt-2 text-center leading-relaxed">
                  AMARI • ELIANA • GIANNI BLU • FRANK BONO{" "}
                  <br className="hidden sm:block" /> ERIK THE DJ • JEROME •
                  COLIN • NOMAR
                </div>
                <div className="text-[9px] sm:text-[10px] text-gray-400 tracking-widest uppercase mt-3 sm:mt-4 border-t border-gray-800 pt-2 sm:pt-3">
                  FINAL JULY 4 LINEUP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scrolling Marquee Ticker */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/90 border-t border-yellow-400/30 overflow-hidden py-3 z-20 backdrop-blur-md">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: "marquee 25s linear infinite" }}
        >
          <style
            dangerouslySetInnerHTML={{
              __html: `
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `,
            }}
          />
          {/* Repeat content enough times to ensure seamless infinite scroll */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 sm:gap-6 text-yellow-400 font-bold tracking-widest text-xs sm:text-sm md:text-base uppercase px-4 sm:px-6 shrink-0"
            >
              <span>THREE DATES • ONE LAKE • ONE HOME</span>
              <span className="text-pink-500">★</span>
              <span>FIRST ACCESS • EXCLUSIVE DROPS • SPECIAL OFFERS</span>
              <span className="text-pink-500">★</span>
              <span className="text-white">SUNSETS.VIP</span>
              <span className="text-pink-500">★</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
