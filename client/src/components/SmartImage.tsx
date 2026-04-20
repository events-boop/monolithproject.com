import { useState, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { buildResponsiveImageSources } from "@/lib/responsiveImagePath";

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    sources?: {
        srcSet: string;
        type: string;
        media?: string;
        sizes?: string;
    }[];
    priority?: boolean;
    className?: string;
    containerClassName?: string;
    aspectRatio?: string; // e.g. "16/9"
}

export default function SmartImage({
    src,
    alt,
    sources,
    priority = false,
    className,
    containerClassName,
    aspectRatio,
    decoding,
    fetchPriority,
    loading,
    sizes,
    ...props
}: SmartImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const imageSizes = sizes || "100vw";
    const imageSources = sources?.length ? sources : buildResponsiveImageSources(src, imageSizes);
    const imageLoading = loading ?? (priority ? "eager" : "lazy");
    const imageDecoding = decoding ?? "async";
    const imageFetchPriority = fetchPriority ?? (priority ? "high" : "auto");

    return (
        <div
            className={cn("relative overflow-hidden bg-white/5", containerClassName)}
            style={aspectRatio ? { aspectRatio } : undefined}
        >
            <picture className="contents">
                {imageSources.map((source, idx) => (
                    <source
                        key={idx}
                        srcSet={source.srcSet}
                        type={source.type}
                        media={source.media}
                        sizes={source.sizes || imageSizes}
                    />
                ))}
                <img
                    src={src}
                    alt={alt}
                    loading={imageLoading}
                    decoding={imageDecoding}
                    fetchPriority={imageFetchPriority}
                    sizes={imageSizes}
                    onLoad={() => setIsLoaded(true)}
                    className={cn(
                        "w-full h-full object-cover transition-opacity duration-700 ease-out",
                        isLoaded ? "opacity-100" : "opacity-0",
                        className
                    )}
                    {...props}
                />
            </picture>
        </div>
    );
}
