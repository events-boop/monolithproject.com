import {
  ArrowUpRight,
  ChevronDown,
  Disc3,
  Images,
  UploadCloud,
} from "lucide-react";
import { ROUTES } from "@shared/routes";

export const COMMUNITY_UPLOAD_URL =
  "https://www.dropbox.com/request/3f0662s872jlukad0r4h";

type ContributionTone = "sunsets" | "untold";

type CommunityContributionSectionProps = {
  tone: ContributionTone;
  seriesName: string;
  archiveLabel: string;
  compact?: boolean;
  className?: string;
  onDjSetClick?: () => void;
  onMediaClick?: () => void;
};

const seriesFitByTone: Record<ContributionTone, string> = {
  sunsets: "chasing-sunsets",
  untold: "untold-story",
};

export default function CommunityContributionSection({
  tone,
  seriesName,
  archiveLabel,
  compact = false,
  className = "",
  onDjSetClick,
  onMediaClick,
}: CommunityContributionSectionProps) {
  const djSetHref = `${ROUTES.submit}?intent=dj-set&series=${seriesFitByTone[tone]}`;

  return (
    <section
      id={`${tone}-contribute`}
      className={`community-contribution ${compact ? "community-contribution-compact" : ""} ${className}`}
      data-contribution-tone={tone}
      aria-labelledby={`${tone}-contribution-title`}
    >
      <div className="community-contribution-etch" aria-hidden="true" />

      <details className="community-contribution-disclosure">
        <summary className="community-contribution-header">
          <div>
            <p className="community-contribution-kicker">
              Archive Contribution / Open Channel
            </p>
            <h2
              id={`${tone}-contribution-title`}
              className="community-contribution-title"
            >
              ADD TO THE RECORD.
            </h2>
          </div>
          <div className="community-contribution-summary-meta">
            <span className="community-contribution-index" aria-hidden="true">
              02 / CHANNELS
            </span>
            <span className="community-contribution-toggle">
              <span className="community-contribution-toggle-label-closed">
                Open
              </span>
              <span className="community-contribution-toggle-label-open">
                Close
              </span>
              <ChevronDown aria-hidden="true" />
            </span>
          </div>
        </summary>

        <div className="community-contribution-body">
          <p className="community-contribution-intro">
            Were you in the room for {archiveLabel}? Help build the living
            archive of {seriesName}. Send the set that moved the room, or the
            moments only the crowd could capture.
          </p>

          <div className="community-contribution-grid">
            <article className="community-contribution-card">
              <div className="community-contribution-card-head">
                <span className="community-contribution-channel">
                  Channel 01
                </span>
                <Disc3 aria-hidden="true" />
              </div>
              <h3>Submit a DJ Set</h3>
              <p>
                Send a full recorded set through a private or public SoundCloud,
                Mixcloud, or Drive link. Include the artist, chapter, and sound.
              </p>
              <a
                href={djSetHref}
                onClick={onDjSetClick}
                className="community-contribution-action"
              >
                Submit Your Set <ArrowUpRight aria-hidden="true" />
              </a>
            </article>

            <article className="community-contribution-card">
              <div className="community-contribution-card-head">
                <span className="community-contribution-channel">
                  Channel 02
                </span>
                <Images aria-hidden="true" />
              </div>
              <h3>Upload Photos + Video</h3>
              <p>
                Drop original crowd clips, booth footage, portraits, and
                lakefront moments. Selected media may enter the official recap
                and archive.
              </p>
              <a
                href={COMMUNITY_UPLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onMediaClick}
                className="community-contribution-action"
              >
                Open Upload Portal <UploadCloud aria-hidden="true" />
              </a>
            </article>
          </div>

          <div className="community-contribution-footer">
            <span>Original files preferred</span>
            <span>Credit included when provided</span>
            <span>Only send media you own</span>
          </div>
        </div>
      </details>
    </section>
  );
}
