import type { PublishedEventState } from "@shared/events/publishedState";
import "@/styles/event-status-badge.css";

type Status = PublishedEventState["kind"];
const labels: Record<Status, string> = {
  "first-access": "Announcing soon",
  "on-sale": "Tickets available",
  "sold-out": "Sold out",
  postponed: "Postponed — new date to be confirmed",
  cancelled: "Cancelled",
  past: "Past event",
  unpublished: "Not announced",
};

export default function EventStatusBadge({
  status,
  label,
}: {
  status: Status;
  label?: string;
}) {
  return (
    <span className="event-status-badge" data-status={status}>
      <span aria-hidden="true" className="event-status-dot" />
      <span>{label || labels[status]}</span>
    </span>
  );
}
