import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Instagram, ExternalLink, Heart, MessageCircle } from "lucide-react";

function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
    );
}

interface InstagramPost {
    id: string;
    caption: string;
    media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
    media_url: string;
    permalink: string;
    thumbnail_url?: string;
    timestamp: string;
    like_count?: number;
    comments_count?: number;
}

// Fallback mock data for when API is not configured
const MOCK_POSTS: InstagramPost[] = [
    {
        id: "mock-1",
        media_type: "IMAGE",
        media_url: "/images/untold-story-juany-deron-v2.jpg",
        permalink: "https://instagram.com",
        caption: "The energy in the room was unmatched. ✨ #MonolithProject #UntoldStory",
        timestamp: new Date().toISOString(),
        like_count: 1240,
        comments_count: 45
    },
    {
        id: "mock-2",
        media_type: "IMAGE",
        media_url: "/images/artist-haai.webp",
        permalink: "https://instagram.com",
        caption: "HAAi taking us on a journey. Next stop: March 6th.",
        timestamp: new Date().toISOString(),
        like_count: 890,
        comments_count: 32
    },
    {
        id: "mock-3",
        media_type: "IMAGE",
        media_url: "/images/chasing-sunsets.jpg",
        permalink: "https://instagram.com",
        caption: "Chasing Sun(Sets) returns soon. Are you ready?",
        timestamp: new Date().toISOString(),
        like_count: 2100,
        comments_count: 120
    },
    {
        id: "mock-4",
        media_type: "IMAGE",
        media_url: "/images/lazare-recap.webp",
        permalink: "https://instagram.com",
        caption: "Lazare deep in the mix. 🌑",
        timestamp: new Date().toISOString(),
        like_count: 750,
        comments_count: 18
    },
    {
        id: "mock-5",
        media_type: "IMAGE",
        media_url: "/images/autograf-recap.jpg",
        permalink: "https://instagram.com",
        caption: "Autograf live set was pure magic.",
        timestamp: new Date().toISOString(),
        like_count: 1540,
        comments_count: 60
    }
];

export default function InstagramFeed() {
    const [posts, setPosts] = useState<InstagramPost[]>(MOCK_POSTS);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await fetch("/api/instagram");
                if (!res.ok) throw new Error("Failed to fetch instagram feed");
                const data = await res.json();
                if (data.posts && data.posts.length > 0) {
                    setPosts(data.posts);
                }
            } catch (error) {
                console.warn("Using mock instagram data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPosts();
    }, []);

    // Display only first 4-8 posts depending on layout
    const displayPosts = posts.slice(0, 4);

    return (
        <section className="bg-background py-20 px-4 md:px-6 relative overflow-hidden">
            {/* Background ambience */}
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.03),transparent_40%)] pointer-events-none" />

            <div className="container max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center mb-16 gap-10">
                    <div className="text-center mb-2">
                        <span className="font-mono text-xs text-clay tracking-[0.2em] uppercase mb-4 block">
                            Follow the Frequency
                        </span>
                        <h2 className="font-display text-4xl md:text-5xl uppercase text-white tracking-wide">
                            The Network
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-4xl px-4">
                        {/* Left: Chasing Sun(Sets) */}
                        <div className="flex flex-col items-center text-center space-y-4">
                            <h3 className="font-display text-xl text-[#E8B86D] uppercase tracking-widest hidden md:block opacity-80 shadow-orange-500/20 drop-shadow-sm">Chasing Sun(Sets)</h3>
                            <div className="flex flex-col gap-3">
                                <a href="https://instagram.com/chasingsunsets.music" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-mono text-white/70 hover:text-[#E8B86D] transition-colors group">
                                    <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span>@chasingsunsets.music</span>
                                </a>
                                <a href="https://tiktok.com/@chasingsunsets" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-mono text-white/70 hover:text-[#E8B86D] transition-colors group">
                                    <TikTokIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span>@chasingsunsets</span>
                                </a>
                            </div>
                        </div>

                        {/* Center: Monolith Project (Main) */}
                        <div className="flex flex-col items-center text-center space-y-5 md:scale-110 origin-top">
                            <div className="inline-block px-4 py-1 border border-white/10 rounded-full bg-white/5 mb-2">
                                <h3 className="font-display text-xl text-white uppercase tracking-widest">Monolith Project</h3>
                            </div>
                            <div className="flex flex-col gap-3">
                                <a href="https://instagram.com/monolithproject.events" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-base font-mono text-white hover:text-primary transition-colors group font-bold">
                                    <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span>@monolithproject.events</span>
                                </a>
                                <a href="https://tiktok.com/@monolithproject" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-base font-mono text-white hover:text-primary transition-colors group font-bold">
                                    <TikTokIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span>@monolithproject</span>
                                </a>
                            </div>
                        </div>

                        {/* Right: Untold Story */}
                        <div className="flex flex-col items-center text-center space-y-4">
                            <h3 className="font-display text-xl text-[#8B5CF6] uppercase tracking-widest hidden md:block opacity-80 shadow-purple-500/20 drop-shadow-sm">Untold Story</h3>
                            <div className="flex flex-col gap-3">
                                <a href="https://instagram.com/untoldstory.music" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-mono text-white/70 hover:text-[#8B5CF6] transition-colors group">
                                    <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span>@untoldstory.music</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {displayPosts.map((post, i) => (
                        <motion.a
                            key={post.id}
                            href={post.permalink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-square bg-card overflow-hidden block border border-white/10"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                        >
                            {/* Image */}
                            <img
                                src={post.media_type === "VIDEO" ? post.thumbnail_url || post.media_url : post.media_url}
                                alt={post.caption || "Instagram post"}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
                                loading="lazy"
                            />

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                                <div className="flex items-center gap-6 text-white mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="flex items-center gap-2">
                                        <Heart className="w-5 h-5 fill-white" />
                                        <span className="font-mono text-sm font-bold">{post.like_count || 100}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="w-5 h-5 fill-white" />
                                        <span className="font-mono text-sm font-bold">{post.comments_count || 10}</span>
                                    </div>
                                </div>
                                <p className="text-white/80 text-xs line-clamp-3 font-mono translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                    {post.caption}
                                </p>
                            </div>

                            {/* Corner Icon */}
                            <div className="absolute top-3 right-3 text-white/80 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                                <Instagram className="w-5 h-5 drop-shadow-md" />
                            </div>
                        </motion.a>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <a
                        href="https://instagram.com/monolithproject.events"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-white/60 hover:text-white transition-colors"
                    >
                        View actual feed on Instagram &rarr;
                    </a>
                </div>
            </div>
        </section>
    );
}
