import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { HOME_NEXT_CHAPTER } from "@shared/home-next-chapter";
import "@/styles/programme-links.css";

/** Shared permanent series entrances, with each series keeping its own identity. */
export default function ProgrammeLinks({
  className = "",
}: {
  className?: string;
}) {
  return (
    <nav
      className={`programme-links ${className}`}
      aria-label="Explore the 2027 series"
    >
      {HOME_NEXT_CHAPTER.programmes.map((programme, index) => (
        <Link
          key={programme.href}
          href={programme.href}
          className="programme-link"
          data-programme={index}
        >
          <span className="programme-link-meta">
            <span>0{index + 1}</span>
            <span>{programme.edition}</span>
          </span>
          <svg
            className="programme-link-art"
            viewBox="0 0 240 120"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            {index === 0 &&
              [24, 38, 52, 66, 80].map(radius => (
                <ellipse
                  key={radius}
                  cx="120"
                  cy="60"
                  rx={radius}
                  ry={radius * 0.56}
                />
              ))}
            {index === 1 && (
              <>
                {[38, 54, 70, 86].map(radius => (
                  <path
                    key={radius}
                    d={`M ${120 - radius} 94 a ${radius} ${radius} 0 0 1 ${radius * 2} 0`}
                  />
                ))}
                <path d="M 20 94 H 220" />
              </>
            )}
            {index === 2 && (
              <>
                {[72, 104, 136, 168].map(cx => (
                  <circle key={cx} cx={cx} cy="60" r="35" />
                ))}
              </>
            )}
            {index === 3 && (
              <svg
                x="20"
                y="0"
                width="200"
                height="120"
                viewBox="400 460 1180 680"
              >
                {/* Crop the approved master; never redraw its original waveform. */}
                <image
                  href="/brand/sunsets-fm/sunsets-fm-warm-signal-master.svg"
                  width="1974"
                  height="1974"
                />
              </svg>
            )}
          </svg>
          <span className="programme-link-name">{programme.name}</span>
          <span className="programme-link-footer">
            <span>{programme.note}</span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </Link>
      ))}
    </nav>
  );
}
