import { forwardRef, type ReactNode, type HTMLAttributes } from "react";

type SectionWidth = "narrow" | "default" | "wide" | "full";
type SectionSpacing = "none" | "tight" | "standard" | "loose";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  /** Container max-width tier */
  width?: SectionWidth;
  /** Vertical padding rhythm */
  spacing?: SectionSpacing;
  /** Horizontal gutter — px-6 by default, false to disable */
  gutter?: boolean;
  /** Render as div instead of section */
  as?: "section" | "div";
  /** Adds scroll-shell-target class for scroll-offset anchoring */
  scrollAnchor?: boolean;
  /** Top border — true for border-t border-white/5, or pass a custom class string */
  borderTop?: boolean | string;
  /** Bottom border — true for border-b border-white/5, or pass a custom class string */
  borderBottom?: boolean | string;
  /** Background class(es) passed through */
  bg?: string;
  /** Additional className for the inner container div */
  containerClassName?: string;
  children: ReactNode;
}

const widthClass: Record<SectionWidth, string> = {
  narrow: "layout-narrow",
  default: "layout-default",
  wide: "layout-wide",
  full: "",
};

const spacingClass: Record<SectionSpacing, string> = {
  none: "",
  tight: "section-shell-tight",
  standard: "section-shell",
  loose: "section-shell-loose",
};

function resolveBorder(value: boolean | string | undefined, fallback: string) {
  if (value === true) return fallback;
  if (typeof value === "string") return value;
  return "";
}

const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      width = "default",
      spacing = "standard",
      gutter = true,
      as: Tag = "section",
      scrollAnchor = false,
      borderTop = false,
      borderBottom = false,
      bg,
      className,
      containerClassName,
      children,
      ...rest
    },
    ref,
  ) => {
    const outer = [
      spacingClass[spacing],
      gutter ? "px-6" : "",
      scrollAnchor ? "scroll-shell-target" : "",
      resolveBorder(borderTop, "border-t border-white/5"),
      resolveBorder(borderBottom, "border-b border-white/5"),
      bg ?? "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    if (width === "full") {
      return (
        <Tag ref={ref as never} className={outer || undefined} {...rest}>
          {children}
        </Tag>
      );
    }

    const inner = ["container", widthClass[width], containerClassName ?? ""]
      .filter(Boolean)
      .join(" ");

    return (
      <Tag ref={ref as never} className={outer || undefined} {...rest}>
        <div className={inner}>{children}</div>
      </Tag>
    );
  },
);

Section.displayName = "Section";
export default Section;
