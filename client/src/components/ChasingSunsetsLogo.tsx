import { cn } from "@/lib/utils";

/** Approved artwork, shared by Sun(Sets) page and navigation branding. */
export default function ChasingSunsetsLogo({
  className,
  decorative = false,
  priority = false,
}: {
  className?: string;
  decorative?: boolean;
  priority?: boolean;
}) {
  return (
    <img
      src="/sunsets/assets/logo-640.webp"
      width={640}
      height={238}
      alt={decorative ? "" : "Chasing Sun(Sets)"}
      aria-hidden={decorative || undefined}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      className={cn("block h-auto max-w-full object-contain", className)}
    />
  );
}
