import { useState, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    sources?: {
        srcSet: string;
        type: string;
        media?: string;
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
    ...props
}: SmartImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div
            className={cn("relative overflow-hidden bg-white/5", containerClassName)}
            style={aspectRatio ? { aspectRatio } : undefined}
        >
            <picture>
                {sources?.map((source, idx) => (
                    <source key={idx} srcSet={source.srcSet} type={source.type} media={source.media} />
                ))}
                <img
                    src={src}
                    alt={alt}
                    loading={priority ? "eager" : "lazy"}
                    decoding={priority ? "sync" : "async"}
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
