import { useEffect } from "react";
import { useRoute } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import MixedMediaGallery from "@/components/MixedMediaGallery";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { chasingSeason1, chasingSeason2, untoldSeason1, untoldSeason2 } from "@/data/galleryData";

const GALLERY_MAP: Record<string, any> = {
    "chasing-sunsets-season-1": { title: "Chasing Sun(Sets) - Season I", media: chasingSeason1, color: "#E8B86D" },
    "chasing-sunsets-season-2": { title: "Chasing Sun(Sets) - Season II", media: chasingSeason2, color: "#E8B86D" },
    "chasing-sunsets-season-3": { title: "Chasing Sun(Sets) - Season III", media: [], color: "#E8B86D" }, // Empty placeholder
    "untold-story-season-1": { title: "Untold Story - Season I", media: untoldSeason1, color: "#8B5CF6" },
    "untold-story-season-2": { title: "Untold Story - Season II", media: untoldSeason2, color: "#8B5CF6" },
    "untold-story-season-3": { title: "Untold Story - Season III", media: [], color: "#8B5CF6" },
};

export default function ArchiveGalleryPage() {
    const [match, params] = useRoute("/:series/:season");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!match || !params?.series || !params?.season) return null;

    const key = `${params.series}-${params.season}`;
    const gallery = GALLERY_MAP[key];

    if (!gallery) {
        return (
            <div className="min-h-screen text-white flex items-center justify-center">
                <p className="font-mono uppercase tracking-widest text-white/50">Gallery not found</p>
            </div>
        );
    }

    const backLink = params.series === "chasing-sunsets" ? "/chasing-sunsets" : "/story";

    return (
        <div className="min-h-screen text-white relative overflow-hidden" style={{ background: "#050505" }}>
            <SEO title={`${gallery.title} Archive`} />
            <Navigation variant="dark" brand={params.series as any} />

            <main className="pt-32 pb-32">
                <div className="container max-w-6xl mx-auto px-6">
                    <Link href={backLink} asChild>
                        <a className="inline-flex items-center gap-2 font-mono text-xs uppercase text-white/50 hover:text-white transition-colors mb-12">
                            <ArrowLeft className="w-4 h-4" /> Back to {params.series.replace("-", " ")}
                        </a>
                    </Link>

                    <MixedMediaGallery
                        title={gallery.title}
                        subtitle="Archive Collection"
                        description={`Visual records from ${gallery.title}`}
                        media={gallery.media}
                        className="bg-transparent"
                    />
                </div>
            </main>
        </div>
    );
}
