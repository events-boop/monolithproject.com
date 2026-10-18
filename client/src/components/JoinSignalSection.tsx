import { useId } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { ROUTES } from "@shared/routes";
interface JoinSignalSectionProps {
  className?: string;
  tone?: "dark" | "warm";
}
export default function JoinSignalSection({
  className,
  tone = "dark",
}: JoinSignalSectionProps) {
  const titleId = useId();
  const [location] = useLocation();
  if (location === ROUTES.newsletter) return null;
  return (
    <section
      className={cn("signal-invitation", className)}
      data-tone={tone}
      aria-labelledby={titleId}
    >
      <div className="container layout-wide signal-invitation-inner">
        <div>
          <p className="section-kicker">Between the shows</p>
          <h2 id={titleId}>Stay in the loop.</h2>
          <p>
            Show announcements, ticket windows and new music. One direct
            connection to Monolith.
          </p>
        </div>
        <Link href={ROUTES.newsletter} className="btn-pill-monolith">
          Get updates <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
