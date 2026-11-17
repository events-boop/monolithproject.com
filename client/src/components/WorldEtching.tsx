/** Shared, decorative relief. Each project supplies its own light through CSS. */
export default function WorldEtching() {
  return (
    <div className="world-etching" aria-hidden="true">
      <img
        src="/images/world-etchings.webp"
        alt=""
        width={1536}
        height={1024}
        decoding="async"
        fetchPriority="low"
      />
    </div>
  );
}
