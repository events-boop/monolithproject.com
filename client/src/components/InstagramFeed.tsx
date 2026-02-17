import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Instagram, ExternalLink, Heart, MessageCircle } from "lucide-react";

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
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div>
                        <span className="font-mono text-xs text-clay tracking-widest uppercase mb-3 block">
                            Social
                        </span>
                        <h2 className="font-display text-4xl md:text-6xl uppercase text-white mb-2">
                            @MonolithProject
                        </h2>
                        <p className="text-white/60 text-lg">
                            Follow the frequency.
                        </p>
                    </div>

                    <a
                        href="https://instagram.com/monolithproject"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-pill group border-white/20 hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                    >
                        <Instagram className="w-4 h-4 mr-2" />
                        <span className="font-bold tracking-widest text-xs uppercase">Follow Us</span>
                        <ExternalLink className="w-3 h-3 ml-2 opacity-50 group-hover:opacity-100" />
                    </a>
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
                        href="https://instagram.com/monolithproject"
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
