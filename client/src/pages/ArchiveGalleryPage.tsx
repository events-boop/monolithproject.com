import { useEffect } from "react";
import { useRoute } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import MixedMediaGallery from "@/components/MixedMediaGallery";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { archiveCollectionsBySlug } from "@/data/galleryData";

export default function ArchiveGalleryPage() {
    const [match, params] = useRoute("/:series/:season");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!match || !params?.series || !params?.season) return null;

    const key = `${params.series}-${params.season}`;
    const gallery = archiveCollectionsBySlug[key];

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

            <main className="page-shell-start pb-32">
                <div className="container layout-default px-6">
                    <Link href={backLink} asChild>
                        <a className="inline-flex items-center gap-2 font-mono text-xs uppercase text-white/50 hover:text-white transition-colors mb-12">
                            <ArrowLeft className="w-4 h-4" /> Back to {params.series.replace("-", " ")}
                        </a>
                    </Link>

                    <MixedMediaGallery
                        title={gallery.title}
                        subtitle={gallery.subtitle}
                        description={gallery.description}
                        media={gallery.media}
                        className="bg-transparent"
                    />
                </div>
            </main>
        </div>
    );
}
