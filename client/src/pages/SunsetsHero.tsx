import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { useEffect } from "react";

export default function SunsetsHero() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>
          Chasing Sun(Sets) 2026 — SUN(SETS) II August 22 Tickets On Sale | The
          Monolith Project
        </title>
      </Helmet>

      <div
        className="min-h-screen w-full relative font-sans text-white overflow-x-hidden pb-16"
        style={{
          backgroundImage: "url(/sunsets_hero_bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Softened dark overlay to make text readable without muddying the image */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80 pointer-events-none" />

        {/* Navigation Bar */}
        <nav className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50 backdrop-blur-md">
          <div
            className="text-3xl font-black tracking-tighter"
            style={{ fontFamily: "Impact, sans-serif" }}
          >
            SUN(SETS)
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wider">
            <Link
              href="/"
              className="text-pink-500 border-b-2 border-pink-500 pb-1"
            >
              HOME
            </Link>
            <Link
              href="/events"
              className="hover:text-pink-400 transition-colors"
            >
              EVENTS
            </Link>
            <a
              href="/go/tickets/css-aug22"
              className="hover:text-pink-400 transition-colors"
            >
              TICKETS
            </a>
            <Link
              href="/vip"
              className="hover:text-pink-400 transition-colors"
            >
              EXPERIENCE
            </Link>
            <Link
              href="/archive"
              className="hover:text-pink-400 transition-colors"
            >
              GALLERY
            </Link>
            <Link
              href="/guide"
              className="hover:text-pink-400 transition-colors"
            >
              INFO
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/go/tickets/css-aug22"
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-full transition-transform hover:scale-105 shadow-lg shadow-pink-500/30 text-sm tracking-widest"
            >
              GET TICKETS
            </a>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="relative z-10 container mx-auto px-6 pt-16 pb-32 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Column: Typography & CTA */}
          <div className="flex-1 flex flex-col items-start text-left max-w-2xl">
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
              <div className="h-1 w-16 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
              <span
                className="text-4xl md:text-5xl font-bold tracking-widest text-yellow-400 drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)]"
                style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
              >
                2026
              </span>
              <div className="h-1 w-16 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
            </div>

            <div className="bg-black/80 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6 mb-8 shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform">
              <h3 className="text-2xl md:text-3xl font-black tracking-wider text-white mb-1">
                AUGUST <span className="text-pink-500">22ND</span> 2026
              </h3>
              <p className="text-yellow-400 font-bold tracking-widest mb-1 text-sm md:text-base">
                CASTAWAYS BEACH CLUB
              </p>
              <p className="text-gray-400 text-sm tracking-widest uppercase">
                CHICAGO LAKEFRONT
              </p>
            </div>

            <p className="text-lg md:text-xl font-medium leading-relaxed max-w-lg mb-10 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Chapter Two lands August 22 at Castaways. Golden hour on the
              Chicago lakefront — open-air house, skyline views, and good
              people. Tickets are live now.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mb-16">
              <a
                href="/go/tickets/css-aug22"
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold py-4 px-10 rounded-full text-lg shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                GET TICKETS — AUG 22 <span className="text-2xl">🎟️</span>
              </a>
              <a
                href="/go/tickets/css-sep19"
                className="bg-black/80 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold py-4 px-10 rounded-full text-lg shadow-[0_0_20px_rgba(250,204,21,0.2)] transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                SEPT 19 — JOEZI X MASSUMA <span className="text-2xl">🌊</span>
              </a>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-xl">
              {[
                {
                  icon: "🌴",
                  label: "LAKEFRONT\nVIBES",
                  color: "text-pink-500",
                },
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
                    className={`w-16 h-16 rounded-full border-2 border-current ${badge.color} bg-black/60 flex items-center justify-center text-3xl shadow-lg backdrop-blur-sm`}
                  >
                    {badge.icon}
                  </div>
                  <div
                    className={`text-[10px] font-bold tracking-widest whitespace-pre-line leading-tight ${badge.color} drop-shadow-md`}
                  >
                    {badge.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Framed Poster — Chapter One archive piece */}
          <div className="flex-1 flex justify-end items-center w-full max-w-lg lg:max-w-xl relative">
            <Link
              href="/archive"
              className="relative block w-full aspect-[4/5] bg-[#111] p-4 rounded-lg shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] transform md:rotate-2 hover:rotate-0 transition-all duration-500 border border-gray-800"
            >
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
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pb-12 text-center border-t-2 border-pink-500/50">
                  <div className="bg-pink-500 text-white text-[10px] font-bold px-3 py-1 inline-block rounded-sm mb-3 transform -skew-x-12 uppercase tracking-widest">
                    CHAPTER ONE — COMPLETE
                  </div>
                  <div
                    className="text-3xl sm:text-4xl font-black text-white tracking-tighter leading-none mb-2"
                    style={{ fontFamily: "Impact, sans-serif" }}
                  >
                    JULY <span className="text-pink-500">4TH</span> 2026
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-yellow-400 tracking-widest uppercase mt-2 text-center leading-relaxed">
                    AUTOGRAF ★ KIKO FRANCO + FRIENDS
                  </div>
                  <div className="text-[10px] text-gray-400 tracking-widest uppercase mt-4 border-t border-gray-800 pt-3">
                    VIEW THE ARCHIVE →
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </main>

        {/* Bottom Scrolling Marquee Ticker */}
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-yellow-400/30 overflow-hidden py-3 z-[9999]">
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
                className="flex items-center gap-6 text-yellow-400 font-bold tracking-widest text-sm md:text-base uppercase px-6 shrink-0"
              >
                <span>THREE DATES • ONE LAKE • ONE HOME</span>
                <span className="text-pink-500">★</span>
                <span>AUG 22 + SEPT 19 • TICKETS ON SALE NOW</span>
                <span className="text-pink-500">★</span>
                <span className="text-white">SUNSETS.VIP</span>
                <span className="text-pink-500">★</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
