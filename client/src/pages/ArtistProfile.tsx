
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Play, Share2, Instagram, Twitter, Globe, Clock, MapPin, Calendar } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AudioPlayer from "@/components/AudioPlayer";
import StickyCTA from "@/components/StickyCTA";

// Mock data - in a real app this would come from an API or store
const ARTISTS = {
    "1": {
        name: "HAAi",
        image: "https://images.unsplash.com/photo-1594988463878-0da48466b039?q=80&w=2000&auto=format&fit=crop",
        role: "HEADLINER",
        bio: "Hailing from Australia and based in London, HAAi continues to redefine the boundaries of club music. Her sets are a journey through genre-bending soundscapes, perfect for the Monolith's mission of connection.",
        tags: ["Techno", "Psychedelic", "Alternative"],
        socials: { instagram: "#", twitter: "#", website: "#" },
        tracks: [
            { title: "Baby, We're Ascending", duration: "5:42" },
            { title: "The Sun Made For A Soft Landing", duration: "4:15" },
            { title: "Lights Out", duration: "6:03" }
        ]
    },
    "2": {
        name: "KEINEMUSIK",
        image: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2000&auto=format&fit=crop",
        role: "KLOUD",
        bio: "A collective that needs no introduction. Keinemusik brings their signature crue sound to Chicago, promising a sunrise set that will resonate with the frequency of togetherness.",
        tags: ["Deep House", "Afro House", "Electronic"],
        socials: { instagram: "#", twitter: "#", website: "#" },
        tracks: [
            { title: "Muye", duration: "7:12" },
            { title: "Les Gout", duration: "5:55" },
            { title: "Before the Flood", duration: "6:28" }
        ]
    },
    "3": {
        name: "LAZARE",
        image: "/images/lazare-profile.jpg",
        role: "RESIDENT",
        bio: "A staple of the Monolith sound, Lazare brings a sophisticated blend of melodic techno and progressive rhythms. His sets are known for their emotional depth and driving energy.",
        tags: ["Melodic Techno", "Progressive", "Resident"],
        socials: { instagram: "#", twitter: "#", website: "#" },
        tracks: [
            { title: "Eternal Echoes", duration: "6:15" },
            { title: "Nightfall", duration: "5:30" },
            { title: "Resonance", duration: "4:45" }
        ]
    },
    "4": {
        name: "JOEZI",
        image: "https://images.unsplash.com/photo-1571266028243-379e309d8d95?q=80&w=2000&auto=format&fit=crop",
        role: "GUEST",
        bio: "Joezi's Afro-house rhythms and infectious energy have captivated audiences worldwide. He brings a vibrant, rhythmic soul to the Monolith stage.",
        tags: ["Afro House", "Tribal", "Energy"],
        socials: { instagram: "#", twitter: "#", website: "#" },
        tracks: [
            { title: "7 Seconds", duration: "6:20" },
            { title: "Africa", duration: "5:10" },
            { title: "The Way", duration: "4:55" }
        ]
    },
    "5": {
        name: "AUTOGRAF",
        image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2000&auto=format&fit=crop",
        role: "LIVE SET",
        bio: "Autograf blends live instrumentation with electronic production, creating a unique and immersive experience. Their 'Future Soup' sound is a perfect fit for Chasing Sun(Sets).",
        tags: ["Live Electronic", "Indie Dance", "Future Bass"],
        socials: { instagram: "#", twitter: "#", website: "#" },
        tracks: [
            { title: "Dream", duration: "3:45" },
            { title: "Nobody Knows", duration: "3:58" },
            { title: "Simple", duration: "4:12" }
        ]
    }
};

export default function ArtistProfile() {
    const { id } = useParams();
    const [location] = useLocation();

    // Default to first artist if ID not found or invalid
    const artist = ARTISTS[id as keyof typeof ARTISTS] || ARTISTS["1"];

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Navigation activeSection="artists" />

            {/* Hero Section */}
            <div className="relative h-[70vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background z-10" />
                <div className="absolute inset-0 bg-black/30 z-0" />
                <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                />

                <div className="absolute bottom-0 left-0 w-full z-20 pb-20 pt-32 bg-gradient-to-t from-background to-transparent">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <span className="px-3 py-1 border border-primary text-primary text-xs tracking-widest uppercase">
                                    {artist.role}
                                </span>
                                {artist.tags.map(tag => (
                                    <span key={tag} className="text-muted-foreground text-xs uppercase tracking-wider">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <h1 className="font-display text-7xl md:text-9xl text-silver-red-gradient mb-6">
                                {artist.name}
                            </h1>

                            <div className="flex flex-wrap gap-6 text-sm font-mono text-muted-foreground uppercase tracking-widest">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    Chicago, IL
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    Nov 14, 2026
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    22:00 - 04:00
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Bio & Info */}
                <div className="lg:col-span-8 space-y-12">
                    {/* Bio */}
                    <section>
                        <h3 className="font-display text-3xl text-foreground mb-6">About The Artist</h3>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
                            {artist.bio}
                        </p>

                        <div className="flex gap-4 mt-8">
                            <a href={artist.socials.instagram} className="p-3 border border-border rounded-full hover:border-primary hover:text-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href={artist.socials.twitter} className="p-3 border border-border rounded-full hover:border-primary hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href={artist.socials.website} className="p-3 border border-border rounded-full hover:border-primary hover:text-primary transition-colors">
                                <Globe className="w-5 h-5" />
                            </a>
                            <button className="p-3 border border-border rounded-full hover:border-primary hover:text-primary transition-colors ml-auto">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </section>

                    {/* Popular Tracks */}
                    <section>
                        <h3 className="font-display text-3xl text-foreground mb-6">Selected Sounds</h3>
                        <div className="space-y-4">
                            {artist.tracks.map((track, i) => (
                                <div key={i} className="group flex items-center justify-between p-4 border border-white/5 bg-white/5 hover:bg-white/10 transition-colors rounded-sm cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <span className="text-muted-foreground font-mono text-sm">{(i + 1).toString().padStart(2, '0')}</span>
                                        <button className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play className="w-4 h-4 ml-0.5" />
                                        </button>
                                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                                            {track.title}
                                        </span>
                                    </div>
                                    <span className="text-sm font-mono text-muted-foreground">
                                        {track.duration}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="p-8 border border-primary/20 bg-primary/5 rounded-sm">
                        <h4 className="font-display text-2xl text-primary mb-4">Event Details</h4>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-border pb-4">
                                <span className="text-muted-foreground uppercase tracking-widest text-xs">Date</span>
                                <span className="font-medium">Saturday, Nov 14</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-border pb-4">
                                <span className="text-muted-foreground uppercase tracking-widest text-xs">Venue</span>
                                <span className="font-medium">The Salt Shed</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-border pb-4">
                                <span className="text-muted-foreground uppercase tracking-widest text-xs">Time</span>
                                <span className="font-medium">10:00 PM - 04:00 AM</span>
                            </div>

                            <button className="w-full py-4 bg-primary text-primary-foreground font-medium uppercase tracking-widest hover:bg-primary/90 transition-colors mt-4">
                                Get Tickets
                            </button>
                        </div>
                    </div>

                    {/* Similar Artists */}
                    <div>
                        <h4 className="font-display text-xl text-muted-foreground mb-6">Similar Artists</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-sm" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <StickyCTA />
            <AudioPlayer />
        </div>
    );
}
