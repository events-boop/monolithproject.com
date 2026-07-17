import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Eye,
  Map as MapIcon,
  MoonStar,
  Rotate3D,
  Sun,
} from "lucide-react";
import type {
  ScheduledEvent,
  VipAvailability,
  VipPackage,
  VipPackageSize,
} from "@shared/events/types";
import { getVipVenueMap, type VipVenueViewId } from "@/data/vipVenueMaps";
import {
  getVipAvailabilityLabel,
  isVipPackageSoldOut,
} from "@/lib/vipExperience";
import type { VipVenueLighting } from "@/components/vip/CastawaysVenueScene";

const CastawaysVenueScene = lazy(
  () => import("@/components/vip/CastawaysVenueScene")
);

type VipVenueModelProps = {
  event: ScheduledEvent;
  packages: VipPackage[];
  selectedSize: VipPackageSize | null;
  onSelect: (size: VipPackageSize) => void;
};

type ViewMode = "model" | "plan";

const statusTone: Record<VipAvailability, string> = {
  available: "border-emerald-300/60 bg-emerald-300 text-black",
  limited: "border-amber-300/60 bg-amber-300 text-black",
  "sold-out": "border-white/20 bg-zinc-700 text-white/55",
};

const viewLabels: Array<{ id: VipVenueViewId; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "stage", label: "Stage" },
  { id: "cabanas", label: "Cabanas" },
];

function packageStatus(event: ScheduledEvent, vipPackage: VipPackage) {
  return isVipPackageSoldOut(event, vipPackage)
    ? ("sold-out" as const)
    : vipPackage.availability;
}

function supportsWebgl() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

function PlanVenue() {
  return (
    <svg
      viewBox="0 0 900 600"
      role="img"
      aria-label="Top-down illustrative plan of the Castaways event deck"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="vip-plan-deck" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#323338" />
          <stop offset="58%" stopColor="#18191d" />
          <stop offset="100%" stopColor="#090a0c" />
        </linearGradient>
        <linearGradient id="vip-plan-hull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d8d1c5" />
          <stop offset="100%" stopColor="#77736f" />
        </linearGradient>
        <pattern
          id="vip-plan-water"
          width="54"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 12 Q13 3 27 12 T54 12"
            fill="none"
            stroke="#ee5525"
            strokeOpacity=".12"
            strokeWidth="1.2"
          />
        </pattern>
        <filter
          id="vip-plan-shadow"
          x="-30%"
          y="-30%"
          width="160%"
          height="180%"
        >
          <feDropShadow
            dx="0"
            dy="24"
            stdDeviation="22"
            floodColor="#000"
            floodOpacity=".72"
          />
        </filter>
      </defs>
      <rect width="900" height="600" fill="#08090b" />
      <rect width="900" height="600" fill="url(#vip-plan-water)" />
      <g filter="url(#vip-plan-shadow)">
        <path
          d="M111 153 C238 69 556 60 731 159 C790 192 810 259 783 323 C742 420 616 499 455 518 C298 536 154 483 96 385 C50 307 56 190 111 153Z"
          fill="url(#vip-plan-hull)"
          stroke="rgba(255,255,255,.3)"
          strokeWidth="2"
        />
        <path
          d="M127 170 C250 96 546 89 708 177 C755 202 773 255 750 309 C712 397 598 465 451 482 C310 499 181 452 130 366 C91 299 91 198 127 170Z"
          fill="url(#vip-plan-deck)"
          stroke="rgba(255,255,255,.12)"
          strokeWidth="2"
        />
      </g>
      <rect
        x="152"
        y="197"
        width="157"
        height="227"
        rx="5"
        fill="#111216"
        stroke="rgba(255,255,255,.1)"
      />
      <rect
        x="332"
        y="174"
        width="189"
        height="256"
        rx="5"
        fill="#111216"
        stroke="rgba(255,255,255,.1)"
      />
      <rect
        x="548"
        y="183"
        width="148"
        height="210"
        rx="5"
        fill="#111216"
        stroke="rgba(255,255,255,.1)"
      />
      <rect
        x="101"
        y="234"
        width="62"
        height="120"
        rx="4"
        fill="#e8e2d7"
        fillOpacity=".14"
        stroke="rgba(255,255,255,.24)"
      />
      <rect
        x="380"
        y="230"
        width="54"
        height="142"
        rx="3"
        fill="#ee5525"
        fillOpacity=".14"
        stroke="#ee5525"
        strokeOpacity=".46"
      />
      <text
        x="392"
        y="302"
        fill="rgba(255,255,255,.48)"
        fontSize="12"
        letterSpacing="4"
        transform="rotate(-90 392 302)"
      >
        STAGE
      </text>
      <text
        x="108"
        y="139"
        fill="rgba(255,255,255,.4)"
        fontSize="12"
        letterSpacing="4"
      >
        HOST ENTRY
      </text>
      <text
        x="678"
        y="489"
        fill="rgba(238,85,37,.6)"
        fontSize="12"
        letterSpacing="4"
      >
        LAKE SIDE
      </text>
      <path
        d="M169 444 C310 490 520 482 695 405"
        fill="none"
        stroke="rgba(238,85,37,.16)"
        strokeDasharray="8 10"
      />
    </svg>
  );
}

export default function VipVenueModel({
  event,
  packages,
  selectedSize,
  onSelect,
}: VipVenueModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const map = useMemo(() => getVipVenueMap(event.venueMap?.id), [event]);
  const [viewMode, setViewMode] = useState<ViewMode>("model");
  const [cameraView, setCameraView] = useState<VipVenueViewId>("overview");
  const [lighting, setLighting] = useState<VipVenueLighting>("sunset");
  const [webglReady, setWebglReady] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);
  const [sceneRequested, setSceneRequested] = useState(false);

  useEffect(() => {
    const available = supportsWebgl();
    setWebglReady(available);
    setSceneFailed(!available);
    if (!available) setViewMode("plan");
  }, []);

  useEffect(() => {
    setCameraView("overview");
    setSceneReady(false);
    setSceneFailed(false);
  }, [map?.id]);

  useEffect(() => {
    if (sceneRequested) return;
    const target = containerRef.current;
    if (!target || typeof IntersectionObserver === "undefined") {
      setSceneRequested(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        setSceneRequested(true);
        observer.disconnect();
      },
      { rootMargin: "480px 0px", threshold: 0.01 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [sceneRequested]);

  if (!map) {
    return (
      <div className="flex min-h-[32rem] items-center justify-center border border-white/10 bg-[#08090b] p-8 text-center">
        <div>
          <Box className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-5 font-display text-2xl uppercase text-white">
            Venue model incoming
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/55">
            Package inventory is live. The event-specific placement model will
            appear after the venue layout is approved.
          </p>
        </div>
      </div>
    );
  }

  const modelVisible = viewMode === "model" && webglReady && !sceneFailed;
  const modelMounted = modelVisible && sceneRequested;

  return (
    <div
      ref={containerRef}
      className={`relative min-h-[34rem] flex-1 overflow-hidden transition-colors sm:min-h-[38rem] ${
        lighting === "sunset"
          ? "bg-[radial-gradient(circle_at_68%_62%,rgba(238,85,37,.24),transparent_26%),linear-gradient(180deg,#150d25_0%,#51203e_47%,#dd6741_72%,#101114_100%)]"
          : "bg-[linear-gradient(180deg,#5b96c3_0%,#a7cddd_54%,#efe4c8_76%,#111317_100%)]"
      }`}
      aria-label={`Interactive illustrative VIP venue model for ${event.venue}`}
    >
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(0,0,0,.08),rgba(0,0,0,.03)_58%,rgba(0,0,0,.52))]" />

      {modelMounted ? (
        <Suspense fallback={null}>
          <CastawaysVenueScene
            map={map}
            packages={packages}
            selectedSize={selectedSize}
            view={cameraView}
            lighting={lighting}
            onSelect={onSelect}
            onReady={() => setSceneReady(true)}
            onError={() => {
              setSceneFailed(true);
              setViewMode("plan");
            }}
          />
        </Suspense>
      ) : (
        <PlanVenue />
      )}

      {viewMode === "plan"
        ? map.zones.map(zone => {
            const vipPackage = packages.find(
              item => item.size === zone.packageSize
            );
            if (!vipPackage) return null;
            const status = packageStatus(event, vipPackage);
            const isSelected =
              status !== "sold-out" && zone.packageSize === selectedSize;

            return (
              <button
                key={zone.id}
                type="button"
                disabled={status === "sold-out"}
                aria-pressed={isSelected}
                aria-label={`${zone.name}, ${zone.placement}, ${getVipAvailabilityLabel(status)}`}
                onClick={() => onSelect(zone.packageSize)}
                style={{ left: `${zone.plan.left}%`, top: `${zone.plan.top}%` }}
                className={`absolute z-[6] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 font-display text-lg shadow-[0_0_0_7px_rgba(0,0,0,.24),0_0_26px_currentColor] transition hover:scale-110 sm:h-14 sm:w-14 sm:text-xl ${
                  isSelected
                    ? "border-primary bg-primary text-black"
                    : statusTone[status]
                } disabled:cursor-not-allowed disabled:opacity-45`}
              >
                {zone.code}
              </button>
            );
          })
        : null}

      {modelMounted && !sceneReady ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/35 backdrop-blur-[2px]">
          <div className="text-center">
            <span className="mx-auto block h-8 w-8 animate-spin rounded-full border border-white/20 border-t-primary" />
            <p className="mt-4 font-mono text-[8px] font-bold uppercase tracking-[0.28em] text-white/55">
              Building the venue
            </p>
          </div>
        </div>
      ) : null}

      <div className="absolute left-3 top-3 z-20 border border-white/14 bg-black/72 px-3 py-2 backdrop-blur-xl sm:left-4 sm:top-4">
        <p className="font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-white/44">
          Model {String(map.version).padStart(2, "0")} · {event.episode}
        </p>
        <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.16em] text-white/78">
          {map.label}
        </p>
      </div>

      <div className="absolute right-3 top-3 z-20 flex border border-white/14 bg-black/76 p-1 backdrop-blur-xl sm:right-4 sm:top-4">
        <button
          type="button"
          aria-pressed={viewMode === "model"}
          disabled={!webglReady || sceneFailed}
          onClick={() => setViewMode("model")}
          className={`inline-flex min-h-9 items-center gap-2 px-3 font-mono text-[8px] font-bold uppercase tracking-[0.14em] transition ${
            viewMode === "model"
              ? "bg-primary text-black"
              : "text-white/48 hover:bg-white/8 hover:text-white disabled:opacity-30"
          }`}
        >
          <Rotate3D className="h-3.5 w-3.5" /> 3D
        </button>
        <button
          type="button"
          aria-pressed={viewMode === "plan"}
          onClick={() => setViewMode("plan")}
          className={`inline-flex min-h-9 items-center gap-2 px-3 font-mono text-[8px] font-bold uppercase tracking-[0.14em] transition ${
            viewMode === "plan"
              ? "bg-primary text-black"
              : "text-white/48 hover:bg-white/8 hover:text-white"
          }`}
        >
          <MapIcon className="h-3.5 w-3.5" /> Plan
        </button>
      </div>

      {viewMode === "model" ? (
        <div className="absolute left-1/2 top-[4.25rem] z-20 flex -translate-x-1/2 border border-white/12 bg-black/58 p-1 backdrop-blur-xl sm:top-4">
          {viewLabels.map(item => (
            <button
              key={item.id}
              type="button"
              aria-pressed={cameraView === item.id}
              onClick={() => setCameraView(item.id)}
              className={`min-h-8 px-2.5 font-mono text-[7px] font-bold uppercase tracking-[0.14em] transition sm:px-3 ${
                cameraView === item.id
                  ? "bg-white/14 text-white"
                  : "text-white/42 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() =>
          setLighting(current => (current === "sunset" ? "day" : "sunset"))
        }
        className="absolute bottom-[7.5rem] right-3 z-20 inline-flex min-h-9 items-center gap-2 border border-white/14 bg-black/68 px-3 font-mono text-[7px] font-bold uppercase tracking-[0.14em] text-white/62 backdrop-blur-xl transition hover:border-primary/50 hover:text-white sm:bottom-4 sm:right-4"
      >
        {lighting === "sunset" ? (
          <Sun className="h-3.5 w-3.5 text-amber-200" />
        ) : (
          <MoonStar className="h-3.5 w-3.5 text-primary" />
        )}
        {lighting === "sunset" ? "Day view" : "Sunset view"}
      </button>

      <div className="absolute inset-x-3 bottom-3 z-20 sm:bottom-4 sm:left-4 sm:right-auto sm:w-[min(41rem,calc(100%-8rem))]">
        <div className="grid grid-cols-3 gap-1 border border-white/14 bg-black/76 p-1.5 backdrop-blur-xl">
          {packages.map(vipPackage => {
            const status = packageStatus(event, vipPackage);
            const isSelected =
              status !== "sold-out" && vipPackage.size === selectedSize;
            const zone = map.zones.find(
              item => item.packageSize === vipPackage.size
            );

            return (
              <button
                key={vipPackage.size}
                type="button"
                disabled={status === "sold-out"}
                aria-pressed={isSelected}
                aria-label={`${vipPackage.name} package, ${vipPackage.guestRange}, ${getVipAvailabilityLabel(status)}`}
                onClick={() => onSelect(vipPackage.size)}
                className={`group min-w-0 border px-2 py-2.5 text-left transition sm:px-3 ${
                  isSelected
                    ? "border-primary bg-primary/[.16]"
                    : "border-white/8 bg-white/[.035] hover:border-white/22"
                } disabled:cursor-not-allowed disabled:opacity-45`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-display text-sm ${
                      isSelected
                        ? "border-primary bg-primary text-black"
                        : statusTone[status]
                    }`}
                  >
                    {zone?.code || vipPackage.name.charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-display text-sm uppercase text-white sm:text-base">
                      {vipPackage.name}
                    </span>
                    <span className="hidden truncate font-mono text-[7px] uppercase tracking-[0.1em] text-white/42 sm:block">
                      {vipPackage.guestRange}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 px-1 font-mono text-[7px] uppercase tracking-[0.13em] text-white/45">
          <span className="inline-flex items-center gap-1.5">
            <Eye className="h-3 w-3 text-primary" />
            Drag to orbit · pinch or scroll to zoom
          </span>
          <span>
            {event.venueMap?.illustrative === false
              ? "Venue-approved plan"
              : "Illustrative · final placement by host"}
          </span>
        </div>
      </div>
    </div>
  );
}
