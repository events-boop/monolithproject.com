import { cn } from "@/lib/utils";

const SERIES_KEYS = [
  {
    tone: "chasing-sunsets",
    label: "Sun(Sets)",
    meta: "Daylight",
  },
  {
    tone: "untold-story",
    label: "Untold",
    meta: "After Dark",
  },
  {
    tone: "monolith-project",
    label: "Monolith",
    meta: "Platform",
  },
] as const;

export default function ScheduleSeriesKey({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn("schedule-series-key", className)}
      aria-label="Schedule series key"
    >
      {SERIES_KEYS.map(item => (
        <div
          key={item.tone}
          className="schedule-series-key-item"
          data-schedule-tone={item.tone}
        >
          <span aria-hidden="true" className="schedule-series-key-mark" />
          <span className="min-w-0">
            <span className="block font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/88">
              {item.label}
            </span>
            <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/42">
              {item.meta}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
