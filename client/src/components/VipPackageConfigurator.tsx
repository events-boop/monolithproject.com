import { Check, ChevronRight, Users } from "lucide-react";
import type {
  ScheduledEvent,
  VipAvailability,
  VipPackage,
  VipPackageSize,
} from "@shared/events/types";
import {
  getVipAvailabilityLabel,
  isVipPackageSoldOut,
} from "@/lib/vipExperience";
import { getVipVenueMap, getVipVenueZone } from "@/data/vipVenueMaps";
import VipVenueModel from "@/components/VipVenueModel";

type VipPackageConfiguratorProps = {
  event?: ScheduledEvent | null;
  selectedSize: VipPackageSize | null;
  onSelect: (size: VipPackageSize) => void;
  onContinue: () => void;
};

const statusTone: Record<VipAvailability, string> = {
  available: "border-emerald-300/45 bg-emerald-300/10 text-emerald-200",
  limited: "border-amber-300/50 bg-amber-300/10 text-amber-100",
  "sold-out": "border-red-300/35 bg-red-300/10 text-red-200",
};

const statusDot: Record<VipAvailability, string> = {
  available: "bg-emerald-300",
  limited: "bg-amber-300",
  "sold-out": "bg-red-300",
};

function getPackageStatus(event: ScheduledEvent, vipPackage: VipPackage) {
  return isVipPackageSoldOut(event, vipPackage)
    ? ("sold-out" as const)
    : vipPackage.availability;
}

export default function VipPackageConfigurator({
  event,
  selectedSize,
  onSelect,
  onContinue,
}: VipPackageConfiguratorProps) {
  const packages = event?.vipPackages || [];
  const selectedPackage =
    packages.find(item => item.size === selectedSize) || null;
  const map = getVipVenueMap(event?.venueMap?.id);
  const selectedZone = getVipVenueZone(map, selectedSize);

  if (!event || packages.length === 0) {
    return (
      <div className="border border-white/10 bg-white/[0.025] p-8">
        <p className="font-display text-2xl uppercase text-white">
          Package map incoming
        </p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60">
          Select an announced VIP date to see its live package inventory and
          placement model.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-white/12 bg-[#070707] shadow-2xl shadow-black/30">
      <div className="grid xl:grid-cols-[minmax(20rem,.68fr)_minmax(0,1.32fr)]">
        <div className="order-1 border-b border-white/10 p-4 sm:p-6 xl:border-b-0 xl:border-r">
          <div className="mb-5 flex items-end justify-between gap-4 border-b border-white/8 pb-5">
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-primary">
                Live package selector
              </p>
              <h3 className="mt-2 font-display text-2xl uppercase text-white sm:text-3xl">
                Size the night
              </h3>
            </div>
            <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">
              Event inventory
            </p>
          </div>

          <div className="space-y-3">
            {packages.map((vipPackage, index) => {
              const packageStatus = getPackageStatus(event, vipPackage);
              const isSoldOut = packageStatus === "sold-out";
              const isSelected = !isSoldOut && vipPackage.size === selectedSize;
              const zone = getVipVenueZone(map, vipPackage.size);

              return (
                <button
                  key={vipPackage.size}
                  type="button"
                  disabled={isSoldOut}
                  aria-pressed={isSelected}
                  onClick={() => onSelect(vipPackage.size)}
                  className={`group w-full border p-4 text-left transition sm:p-5 ${
                    isSelected
                      ? "border-primary bg-primary/[0.09] shadow-[inset_3px_0_0_#ee5525]"
                      : isSoldOut
                        ? "cursor-not-allowed border-white/8 bg-white/[0.015] opacity-50"
                        : "border-white/10 bg-white/[0.025] hover:border-white/25 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="mt-1 font-mono text-[9px] font-bold text-white/28">
                        0{index + 1}
                      </span>
                      <div>
                        <h4 className="font-display text-2xl uppercase text-white sm:text-3xl">
                          {vipPackage.name}
                        </h4>
                        <p className="mt-1 flex items-center gap-2 text-xs text-white/58">
                          <Users className="h-3.5 w-3.5 text-primary" />
                          {vipPackage.guestRange}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 border px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.12em] ${statusTone[packageStatus]}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${statusDot[packageStatus]}`}
                      />
                      {getVipAvailabilityLabel(packageStatus)}
                    </span>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-white/48">
                    {vipPackage.description}
                  </p>

                  <div className="mt-4 flex items-end justify-between gap-4 border-t border-white/8 pt-3">
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/32">
                        {zone?.placement || "Placement by host"}
                      </p>
                      <p className="mt-1 text-sm font-medium text-white/76">
                        {vipPackage.minimumSpend || "Host quote"}
                      </p>
                    </div>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                        isSelected
                          ? "border-primary bg-primary text-black"
                          : "border-white/15 text-white/40 group-hover:border-primary/50 group-hover:text-primary"
                      }`}
                    >
                      {isSelected ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="order-2 flex min-h-[40rem] flex-col bg-[#0a0a0a]">
          <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-primary">
                Interactive venue experience
              </p>
              <h3 className="mt-2 font-display text-2xl uppercase text-white sm:text-3xl">
                {event.venue} · Choose your placement
              </h3>
            </div>
            <div className="flex flex-wrap gap-3 font-mono text-[8px] uppercase tracking-[0.12em] text-white/48">
              {(["available", "limited", "sold-out"] as const).map(status => (
                <span key={status} className="inline-flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${statusDot[status]}`}
                  />
                  {getVipAvailabilityLabel(status)}
                </span>
              ))}
            </div>
          </div>

          <VipVenueModel
            event={event}
            packages={packages}
            selectedSize={selectedSize}
            onSelect={onSelect}
          />

          <div className="border-t border-white/10 p-5 sm:p-6">
            {selectedPackage ? (
              <div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-primary">
                      Selected setup
                    </p>
                    <p className="mt-2 font-display text-2xl uppercase text-white">
                      {selectedPackage.name} · {selectedPackage.guestRange}
                    </p>
                    {selectedZone ? (
                      <p className="mt-1 text-xs text-white/42">
                        {selectedZone.placement}
                      </p>
                    ) : null}
                  </div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/50">
                    {selectedPackage.minimumSpend || "Host quote"}
                  </p>
                </div>

                <ul className="mt-5 grid gap-3 border-t border-white/8 pt-5 text-xs text-white/62 sm:grid-cols-3">
                  {selectedPackage.features.map(feature => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-white/55">
                Select any available package to preview the group fit.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-5 border-t border-white/10 bg-white/[0.025] p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-white/40">
            Your request
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/72">
            {selectedPackage
              ? `${event.episode} · ${selectedPackage.name} · ${selectedPackage.guestRange}${selectedZone ? ` · ${selectedZone.placement}` : ""}`
              : "Choose an available package to continue."}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-white/42">
            Final minimum, exact placement, tax, gratuity, and service fees are
            confirmed by the venue host. A request is not a reservation.
          </p>
        </div>
        <button
          type="button"
          onClick={onContinue}
          disabled={!selectedPackage}
          className="inline-flex min-h-12 items-center justify-center gap-2 bg-primary px-6 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue to request <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
