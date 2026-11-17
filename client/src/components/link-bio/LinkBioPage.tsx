import { ArrowUpRight, ArrowRight, Radio } from "lucide-react";
import { Link } from "wouter";
import GlyphBackdrop from "../GlyphBackdrop";
import {
  CAMPAIGN_BIOS,
  MONOLITH_ORIGIN,
  type CampaignBioTheme,
} from "@shared/campaign-bios";
import { ROUTES } from "@shared/routes";
import "./link-bio.css";

export interface LinkBioLink {
  label: string;
  detail?: string;
  href: string;
  primary?: boolean;
}
export interface LinkBioProps {
  theme: CampaignBioTheme;
  kicker: string;
  title: string;
  titleAccent?: string;
  tagline: string;
  badge?: string;
  tease?: string;
  links: readonly LinkBioLink[];
  notice?: LinkBioLink;
  socials: { label: string; href: string }[];
  footnote: string;
  showDestinations?: boolean;
}

function BioLink({
  link,
  showDestination,
}: {
  link: LinkBioLink;
  showDestination?: boolean;
}) {
  const className = `link-bio-link${link.primary ? " is-primary" : ""}`;
  const body = (
    <>
      <span className="link-bio-link-text">
        <strong>{link.label}</strong>
        {link.detail && <small>{link.detail}</small>}
        {showDestination && (
          <small>
            {link.href.startsWith("/")
              ? `monolithproject.com${link.href}`
              : link.href.replace(/^https?:\/\//, "")}
          </small>
        )}
      </span>
      <ArrowUpRight size={19} aria-hidden="true" />
    </>
  );
  return /^https?:\/\//i.test(link.href) ||
    link.href.includes("#") ||
    link.href.startsWith("/go/") ? (
    <a className={className} href={link.href}>
      {body}
    </a>
  ) : (
    <Link className={className} href={link.href}>
      {body}
    </Link>
  );
}

export default function LinkBioPage({
  theme,
  kicker,
  title,
  titleAccent,
  tagline,
  badge,
  tease,
  links,
  notice,
  socials,
  footnote,
  showDestinations = false,
}: LinkBioProps) {
  return (
    <div className={`link-bio link-bio--${theme}`}>
      <GlyphBackdrop surface="bio" />
      <main className="link-bio-card">
        <header className="link-bio-head">
          <a className="link-bio-parent" href={MONOLITH_ORIGIN}>
            MONOLITH <span>PROJECT</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <p className="link-bio-kicker">{kicker}</p>
          <h1 className="link-bio-title">
            {title}
            {titleAccent && <span>{titleAccent}</span>}
          </h1>
          <p className="link-bio-tagline">{tagline}</p>
          {badge && (
            <div className="link-bio-status">
              <span className="link-bio-badge">
                <span aria-hidden="true" />
                {badge}
              </span>
              {tease && <p>{tease}</p>}
            </div>
          )}
        </header>
        <nav
          className="link-bio-links"
          aria-label={`${title} ${titleAccent || ""} links`}
        >
          {links.map(link => (
            <BioLink
              key={link.href}
              link={link}
              showDestination={showDestinations}
            />
          ))}
        </nav>
        <a
          className="link-bio-network"
          href={MONOLITH_ORIGIN + ROUTES.openNetwork}
        >
          <span className="link-bio-network-label">
            <Radio size={16} aria-hidden="true" /> SUNSETS.FM{" "}
            <span>Coming soon</span>
          </span>
          <strong>A wider world of music.</strong>
          <span>
            Music, people & places. See what we’re building.
            <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </a>
        {notice && (
          <a className="link-bio-notice" href={notice.href}>
            <span>
              <strong>{notice.label}</strong>
              <small>{notice.detail}</small>
            </span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        )}
        <nav
          className="link-bio-worlds"
          aria-label="Explore the Monolith collective"
        >
          <p>
            Explore the collective <ArrowRight size={16} aria-hidden="true" />
          </p>
          <div>
            {Object.values(CAMPAIGN_BIOS).map(world => (
              <a
                key={world.theme}
                href={world.domain + "/"}
                data-theme={world.theme}
                aria-current={theme === world.theme ? "page" : undefined}
              >
                <i aria-hidden="true" />
                {world.name}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            ))}
          </div>
        </nav>
        <footer className="link-bio-foot">
          <ul className="link-bio-socials">
            {socials.map(social => (
              <li key={social.href}>
                <a href={social.href} target="_blank" rel="noopener noreferrer">
                  {social.label}
                  <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <p>{footnote}</p>
          <nav aria-label="Legal">
            <a href={MONOLITH_ORIGIN + ROUTES.privacy}>Privacy</a>
            <a href={MONOLITH_ORIGIN + ROUTES.terms}>Terms</a>
          </nav>
        </footer>
      </main>
    </div>
  );
}
