/** Owner-supplied glyph wall; tint and fades stay in CSS so the artwork is intact. */
export default function GlyphBackdrop({
  surface,
}: {
  surface: "footer" | "menu" | "nav" | "bio";
}) {
  return (
    <div
      className={`glyph-backdrop glyph-backdrop-${surface}`}
      aria-hidden="true"
    >
      <img
        src="/images/monolith-glyph-wall.webp"
        alt=""
        width={939}
        height={1675}
        loading={surface === "footer" ? "lazy" : "eager"}
        decoding="async"
        fetchPriority="low"
      />
    </div>
  );
}
