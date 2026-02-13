import RevealText from "./RevealText";

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
        <RevealText
          as="span"
          className="ui-kicker text-primary/85 mb-4 block"
          delay={0.1}
          stagger={0.02}
        >
          {kicker}
        </RevealText>
        <RevealText
          as="h2"
          className={`ui-heading font-display text-[clamp(2.6rem,7vw,6.2rem)] tracking-[0.02em] uppercase ${titleClass}`}
          delay={0.2}
          blurStrength={16}
        >
          {title}
        </RevealText>
        {description && (
          <RevealText
            as="p"
            className={`mt-4 max-w-2xl leading-relaxed ${bodyClass}`}
            delay={0.4}
            stagger={0.008} // Fast stagger for long text
            blurStrength={8}
          >
            {description}
          </RevealText>
        )}
      </div>
      {rightMeta && (
        <RevealText
          as="span"
          className={`ui-meta md:pb-3 ${metaClass}`}
          delay={0.5}
        >
          {rightMeta}
        </RevealText>
      )}
    </div>
  );
}
