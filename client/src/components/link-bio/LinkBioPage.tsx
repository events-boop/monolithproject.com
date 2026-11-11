import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import "./link-bio.css";

/**
 * One link-in-bio layout for every campaign domain (sunsets.vip, untold.vip).
 * A bio page is a short list of places to go, not a full page: one brand block, one status badge,
 * a handful of big links, the socials. The series supply their own theme, words and links.
 */
export interface LinkBioLink {
  label: string;
  detail?: string;
  href: string;
  /** The one link we most want tapped right now. */
  primary?: boolean;
  /** A short status chip on the link itself, e.g. "Postponed". */
  badge?: string;
}

export interface LinkBioProps {
  theme: "sunsets" | "untold";
  kicker: string;
  title: string;
  titleAccent?: string;
  tagline: string;
  /** Short status chip above the links, e.g. "New show updates incoming". */
  badge?: string;
  /** One line under the badge that says what the badge means. */
  tease?: string;
  links: LinkBioLink[];
  socials: { label: string; href: string }[];
  footnote: string;
  logo?: { src: string; alt: string; width: number; height: number };
  showDestinations?: boolean;
  motif?: "rings";
}

const isExternal = (href: string) =>
  /^https?:\/\//i.test(href) || href.startsWith("/go/");
/** Standalone documents and in-page anchors must be real navigations, not client-side routes. */
const isDocument = (href: string) =>
  href.includes("#") || href.endsWith(".html");

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
        <strong>
          {link.label}
          {link.badge && <em className="link-bio-link-badge">{link.badge}</em>}
        </strong>
        {link.detail && <small>{link.detail}</small>}
        {showDestination && (
          <span className="link-bio-destination">
            {link.href.startsWith("/")
              ? `monolithproject.com${link.href}`
              : link.href.replace(/^https?:\/\//, "")}
          </span>
        )}
      </span>
      <ArrowUpRight size={18} aria-hidden="true" />
    </>
  );
  if (isExternal(link.href))
    return (
      <a
        className={className}
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {body}
      </a>
    );
  if (isDocument(link.href))
    return (
      <a className={className} href={link.href}>
        {body}
      </a>
    );
  return (
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
  socials,
  footnote,
  logo,
  showDestinations = false,
  motif,
}: LinkBioProps) {
  return (
    <div className={`link-bio link-bio--${theme}`}>
      <main className="link-bio-card">
        <header className="link-bio-head">
          <p className="link-bio-kicker">{kicker}</p>
          {motif && (
            <div
              className={`link-bio-motif link-bio-motif--${motif}`}
              aria-hidden="true"
            />
          )}
          {logo ? (
            <h1 className="link-bio-logo">
              <img
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
              />
            </h1>
          ) : (
            <h1 className="link-bio-title">
              {title}
              {titleAccent && <span> {titleAccent}</span>}
            </h1>
          )}
          <p className="link-bio-tagline">{tagline}</p>
        </header>

        {badge && (
          <div className="link-bio-status">
            <span className="link-bio-badge">
              <span className="link-bio-badge-dot" aria-hidden="true" />
              {badge}
            </span>
            {tease && <p>{tease}</p>}
          </div>
        )}

        <nav className="link-bio-links" aria-label={`${title} links`}>
          {links.map(link => (
            <BioLink
              key={`${link.label}-${link.href}`}
              link={link}
              showDestination={showDestinations}
            />
          ))}
        </nav>

        <footer className="link-bio-foot">
          <ul className="link-bio-socials">
            {socials.map(social => (
              <li key={social.href}>
                <a href={social.href} target="_blank" rel="noopener noreferrer">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
          <p>{footnote}</p>
        </footer>
      </main>
    </div>
  );
}
