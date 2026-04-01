import { useState, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

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
    const imageLoading = loading ?? (priority ? "eager" : "lazy");
    const imageDecoding = decoding ?? (priority ? "sync" : "async");
    const imageFetchPriority = fetchPriority ?? (priority ? "high" : "auto");

    return (
        <div
            className={cn("relative overflow-hidden bg-white/5", containerClassName)}
            style={aspectRatio ? { aspectRatio } : undefined}
        >
            <picture>
                {sources?.map((source, idx) => (
                    <source
                        key={idx}
                        srcSet={source.srcSet}
                        type={source.type}
                        media={source.media}
                        sizes={source.sizes || sizes}
                    />
                ))}
                <img
                    src={src}
                    alt={alt}
                    loading={imageLoading}
                    decoding={imageDecoding}
                    fetchPriority={imageFetchPriority}
                    sizes={sizes}
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
