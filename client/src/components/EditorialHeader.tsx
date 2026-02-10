interface EditorialHeaderProps {
  kicker: string;
  title: string;
  description?: string;
  rightMeta?: string;
  dark?: boolean;
}

export default function EditorialHeader({
  kicker,
  title,
  description,
  rightMeta,
  dark = false,
}: EditorialHeaderProps) {
  const titleClass = dark ? "text-charcoal" : "text-foreground";
  const bodyClass = dark ? "text-stone" : "text-muted-foreground";
  const metaClass = dark ? "text-stone" : "text-muted-foreground";

  return (
    <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="max-w-3xl">
        <span className="ui-kicker text-primary/85 mb-4 block">
          {kicker}
        </span>
        <h2 className={`ui-heading font-display text-[clamp(2.6rem,7vw,6.2rem)] tracking-[0.02em] uppercase ${titleClass}`}>
          {title}
        </h2>
        {description && (
          <p className={`mt-3 max-w-2xl ${bodyClass}`}>{description}</p>
        )}
      </div>
      {rightMeta && (
        <span className={`ui-meta md:pb-3 ${metaClass}`}>
          {rightMeta}
        </span>
      )}
    </div>
  );
}
