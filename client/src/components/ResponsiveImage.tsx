import type { ImgHTMLAttributes } from "react";
import { buildResponsiveImageSources, type ResponsiveImageSource } from "@/lib/responsiveImagePath";

interface ResponsiveImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
  priority?: boolean;
  sources?: ResponsiveImageSource[];
  src: string;
}

export default function ResponsiveImage({
  alt,
  decoding,
  fetchPriority,
  loading,
  priority = false,
  sizes = "100vw",
  sources,
  src,
  ...props
}: ResponsiveImageProps) {
  const imageSources = sources?.length ? sources : buildResponsiveImageSources(src, sizes);
  const imageLoading = loading ?? (priority ? "eager" : "lazy");
  const imageDecoding = decoding ?? "async";
  const imageFetchPriority = fetchPriority ?? (priority ? "high" : "auto");

  return (
    <picture className="contents">
      {imageSources.map((source, index) => (
        <source
          key={`${source.type}-${index}`}
          media={source.media}
          sizes={source.sizes || sizes}
          srcSet={source.srcSet}
          type={source.type}
        />
      ))}
      <img
        {...props}
        src={src}
        alt={alt}
        loading={imageLoading}
        decoding={imageDecoding}
        fetchPriority={imageFetchPriority}
        sizes={sizes}
      />
    </picture>
  );
}
