import { motion, useScroll, useTransform } from "framer-motion";
import { Ticket } from "lucide-react";
import { getPublicEvents, usePublicSiteDataVersion } from "@/lib/siteData";
import { getPublishedCatalogue } from "@shared/events/publishedState";
import {
  SUNSETS_JULY4_TICKET_PATH,
  captureSunsetsTicketCtaClick,
} from "@/lib/sunsetsTicketing";

export default function FixedTicketBadge() {
  usePublicSiteDataVersion();
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, [0, 1000], [0, 360]);

  const { upcoming } = getPublishedCatalogue(getPublicEvents());
  const onSaleEntry = upcoming.find(entry => entry.state.kind === "on-sale");

  if (!onSaleEntry || onSaleEntry.state.kind !== "on-sale") {
    return null;
  }

  const href = onSaleEntry.state.ticketUrl;
  const label = `Get Tickets — ${onSaleEntry.event.headline || onSaleEntry.event.title}`;
  const shortDate = onSaleEntry.event.date.replace(/,\s*\d{4}$/, "");
  const ring = `Get Tickets • ${shortDate} • Posh • Get Tickets •`;
  const isExternal = /^https?:\/\//i.test(href);

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden md:block mix-blend-difference">
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        onClick={() => {
          if (href === SUNSETS_JULY4_TICKET_PATH) {
            captureSunsetsTicketCtaClick({
              destinationUrl: href,
              pagePath:
                typeof window !== "undefined"
                  ? window.location.pathname
                  : undefined,
              ctaPosition: "footer",
            });
          }
        }}
        className="group relative flex h-32 w-32 cursor-pointer items-center justify-center rounded-full"
        aria-label={label}
      >
        <motion.div
          style={{ rotate }}
          className="absolute inset-0 flex h-full w-full items-center justify-center"
        >
          <svg
            viewBox="0 0 100 100"
            width="100%"
            height="100%"
            className="animate-[spin_10s_linear_infinite]"
          >
            <defs>
              <path
                id="circlePath"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              />
            </defs>
            <text className="font-mono fill-white text-[10px] font-bold uppercase tracking-[0.2em]">
              <textPath xlinkHref="#circlePath" startOffset="0%">
                {ring}
              </textPath>
            </text>
          </svg>
        </motion.div>

        <div className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:scale-110">
          <Ticket className="h-5 w-5" />
        </div>
      </a>
    </div>
  );
}
