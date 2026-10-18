import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
interface SlimSubscribeStripProps {
  title: string;
  source: string;
  dark?: boolean;
}
export default function SlimSubscribeStrip({
  title,
  source,
}: SlimSubscribeStripProps) {
  return (
    <section className="signal-invitation" data-source={source}>
      <div className="container layout-wide signal-invitation-inner">
        <div>
          <p className="section-kicker">Stay connected</p>
          <h2>{title}</h2>
          <p>
            Upcoming shows, release windows and new music, straight from
            Monolith.
          </p>
        </div>
        <Link href="/newsletter" className="btn-pill-monolith">
          Get updates <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
