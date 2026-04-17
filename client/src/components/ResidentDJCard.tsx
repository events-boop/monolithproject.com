import { motion } from "framer-motion";
import { Music, MapPin, Radio, Instagram, ArrowUpRight, Disc3 } from "lucide-react";

export interface ResidentDJ {
    name: string;
    handle?: string;
    city: string;
    genre: string[];
    bio: string;
    image?: string;
    instagramUrl?: string;
    soundcloudUrl?: string;
    bookingEmail?: string;
    stats?: { label: string; value: string }[];
    accentColor?: string;
}

const DEFAULT_DJS: ResidentDJ[] = [
    {
        name: "JUANY BRAVO",
        handle: "@juanybravo",
        city: "Chicago, IL",
        genre: ["Afro House", "Melodic House", "Organic"],
        bio: "A cornerstone of the Chasing Sun(Sets) series since Season I. Juany brings a warm, sunrise energy to every set — weaving African rhythm with melodic house and organic textures that feel like golden hour itself.",
        image: "/images/dj-juany-bravo.jpg",
        instagramUrl: "https://instagram.com/juanybravo",
        soundcloudUrl: "https://soundcloud.com/juanybravo",
        bookingEmail: "music@monolithproject.com",
        stats: [
            { value: "4+", label: "Seasons" },
            { value: "12+", label: "Shows" },
            { value: "∞", label: "Sunsets" },
        ],
    },
    {
        name: "DERON",
        handle: "@deron",
        city: "Chicago, IL",
        genre: ["Progressive House", "Latin House", "Melodic"],
        bio: "Deron is the heartbeat of the Monolith sound — a deep, progressive groove rooted in Latin rhythm and soulful melody. Every set tells a story from dusk to dawn.",
        image: "/images/dj-deron.jpg",
        instagramUrl: "https://instagram.com/deron",
        soundcloudUrl: "https://soundcloud.com/deron",
        bookingEmail: "music@monolithproject.com",
        stats: [
            { value: "3+", label: "Seasons" },
            { value: "10+", label: "Shows" },
            { value: "B2B", label: "Partner" },
        ],
    },
];

interface ResidentDJCardProps {
    djs?: ResidentDJ[];
}

export default function ResidentDJCard({
    djs = DEFAULT_DJS,
}: ResidentDJCardProps) {
    return (
        <div className="space-y-10">
            {djs.map((dj, i) => (
                <motion.article
                    key={dj.name}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative grid grid-cols-1 lg:grid-cols-12 gap-8 rounded-3xl overflow-hidden p-8 md:p-10 border backdrop-blur-sm transition-all duration-500 hover:shadow-[0_24px_60px_rgba(0,0,0,0.3)] sunset-border-accent-20 sunset-glass-card"
                    data-cursor-text="LISTEN"
                >
                    {/* Ambient glow */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 sunset-accent-glow" />

                    {/* LEFT — Info */}
                    <div className="lg:col-span-7 flex flex-col justify-between gap-6 relative z-10">
                        {/* Name + handle */}
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-[0.2em] uppercase border sunset-accent-tag">
                                    <Disc3 size={10} />
                                    Resident DJ
                                </span>
                                {dj.handle && (
                                    <span className="font-mono text-[11px] tracking-wider sunset-text-50">
                                        {dj.handle}
                                    </span>
                                )}
                            </div>

                            <h3 className="font-display text-[clamp(2.8rem,6vw,5rem)] leading-[0.9] uppercase tracking-tight mb-5">
                                {dj.name.split(" ").map((word, wi) => (
                                    <span key={wi} className="block">
                                        {wi === 0 ? (
                                            <span className="bg-clip-text text-transparent sunset-gradient-btn [-webkit-background-clip:text]">
                                                {word}
                                            </span>
                                        ) : (
                                            <span className="sunset-text">{word}</span>
                                        )}
                                    </span>
                                ))}
                            </h3>

                            <p className="text-base md:text-lg leading-relaxed max-w-lg sunset-text-80">
                                {dj.bio}
                            </p>
                        </div>

                        {/* Genre tags */}
                        <div className="flex flex-wrap gap-2">
                            {dj.genre.map((g) => (
                                <span
                                    key={g}
                                    className="px-3 py-1.5 text-[11px] font-mono tracking-[0.15em] uppercase rounded-full border sunset-warmGold-tag"
                                >
                                    {g}
                                </span>
                            ))}
                            <span className="px-3 py-1.5 text-[11px] font-mono tracking-[0.15em] uppercase rounded-full border flex items-center gap-1 sunset-text-50 border-[color-mix(in_srgb,var(--sunset-text)_9%,transparent)]">
                                <MapPin size={10} />
                                {dj.city}
                            </span>
                        </div>

                        {/* Stats */}
                        {dj.stats && (
                            <div className="grid grid-cols-3 gap-4 pt-5 border-t sunset-border-accent-20">
                                {dj.stats.map((s) => (
                                    <div key={s.label}>
                                        <div className="text-2xl md:text-3xl font-display tracking-tight mb-0.5 sunset-warmGold">
                                            {s.value}
                                        </div>
                                        <div className="text-[10px] font-mono tracking-[0.2em] uppercase sunset-text-50">
                                            {s.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-3 pt-2">
                            {dj.soundcloudUrl && (
                                <a
                                    href={dj.soundcloudUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold tracking-wide uppercase transition-opacity hover:opacity-80 text-[#1A0E08] sunset-gradient-btn"
                                >
                                    <Radio size={13} />
                                    Listen
                                </a>
                            )}
                            {dj.bookingEmail && (
                                <a
                                    href={`mailto:${dj.bookingEmail}?subject=Booking Inquiry — ${dj.name}`}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold tracking-wide uppercase border transition-all hover:bg-white/5 sunset-text border-[color-mix(in_srgb,var(--sunset-text)_15%,transparent)]"
                                >
                                    Book
                                    <ArrowUpRight size={13} />
                                </a>
                            )}
                            {dj.instagramUrl && (
                                <a
                                    href={dj.instagramUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center w-10 h-10 rounded-full border transition-all hover:bg-white/5 sunset-text-60 border-[color-mix(in_srgb,var(--sunset-text)_12%,transparent)]"
                                    aria-label={`${dj.name} Instagram`}
                                >
                                    <Instagram size={15} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* RIGHT — Photo */}
                    <div className="lg:col-span-5 relative z-10">
                        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border sunset-border-accent-20">
                            {dj.image ? (
                                <img
                                    src={dj.image}
                                    alt={dj.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    style={{ filter: "saturate(0.85) contrast(1.05)" }}
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).style.display = "none";
                                    }}
                                />
                            ) : null}

                            {/* Gradient overlay — always visible */}
                            <div className={`absolute inset-0 ${dj.image ? "sunset-glass-overlay" : "sunset-glass-card"}`} />

                            {/* Fallback placeholder when no image */}
                            {!dj.image && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Music size={64} className="sunset-accent opacity-40" />
                                </div>
                            )}

                            {/* Bottom name label overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                <div className="text-[10px] font-mono tracking-[0.25em] uppercase mb-1 sunset-warmGold opacity-60">
                                    Resident · Chasing Sun(Sets)
                                </div>
                                <div className="font-display text-xl uppercase tracking-wide sunset-text">
                                    {dj.name}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.article>
            ))}

            {/* Submission CTA */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-2xl p-8 text-center border sunset-border-accent-20 bg-[color-mix(in_srgb,var(--sunset-glass)_25%,transparent)]"
            >
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase block mb-3 sunset-accent">
                    Want To Join The Roster?
                </span>
                <p className="text-sm mb-5 max-w-sm mx-auto sunset-text-60">
                    Afro · Organic · Latin · Brazilian · Melodic House — if you have the sound, we have the sunset.
                </p>
                <a
                    href="mailto:music@monolithproject.com?subject=Chasing Sun(Sets) Resident DJ Submission"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold tracking-widest uppercase border transition-all hover:opacity-80 sunset-accent-tag"
                >
                    Submit Your Mix
                    <ArrowUpRight size={13} />
                </a>
            </motion.div>
        </div>
    );
}
