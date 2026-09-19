import EventNotice from "./EventNotice";
import { ArrowUpRight, AlertTriangle } from "lucide-react";
import {
  currentSunsets,
  sunsetsNeedsUpdate,
  sunsetsUpdatedLabel,
  sunsetsStatusLabel,
} from "@shared/events/sunsets-current";
import "@/styles/event-alert.css";
export default function EventStatusFloat() {
  if (!sunsetsNeedsUpdate) return null;
  return (
    <>
      <EventNotice />
      <aside className="event-status-float" aria-label="Important event update">
        <AlertTriangle aria-hidden="true" size={24} />
        <div>
          <strong>{sunsetsStatusLabel()} · JOEZI × MASSUMA</strong>
          <span>September 19 show · New date to be announced</span>
          <time dateTime={currentSunsets.updatedAt}>
            Updated {sunsetsUpdatedLabel} · Chicago
          </time>
        </div>
        <a href="/sunsets#event-update" data-open-event-notice>
          Read update
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </aside>
    </>
  );
}
