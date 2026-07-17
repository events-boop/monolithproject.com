// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ScheduledEvent } from "@shared/events/types";
import VipPackageConfigurator from "@/components/VipPackageConfigurator";

vi.mock("@/components/VipVenueModel", () => ({
  default: () => <div data-testid="venue-model">Venue model</div>,
}));

const event: ScheduledEvent = {
  id: "vip-component-test",
  series: "chasing-sunsets",
  episode: "SUN(SETS) TEST",
  title: "VIP Component Test",
  date: "August 22, 2026",
  time: "Golden Hour",
  venue: "Castaways",
  location: "Chicago, IL",
  status: "on-sale",
  venueMap: {
    id: "castaways-sunsets-ii-2026",
    venueId: "castaways-chicago",
    address: "1603 N Lake Shore Dr, Chicago, IL 60611",
    illustrative: true,
  },
  vipPackages: [
    {
      size: "small",
      name: "Small",
      guestRange: "2–6 guests",
      description: "Small setup",
      features: ["Priority check-in"],
      availability: "available",
      minimumSpend: "Host quote",
    },
    {
      size: "medium",
      name: "Medium",
      guestRange: "7–10 guests",
      description: "Medium setup",
      features: ["Reserved space"],
      availability: "limited",
      minimumSpend: "Host quote",
    },
    {
      size: "large",
      name: "Large",
      guestRange: "11–15 guests",
      description: "Large setup",
      features: ["Dedicated service"],
      availability: "sold-out",
      minimumSpend: "$2,000 minimum spend",
    },
  ],
};

afterEach(cleanup);

describe("VipPackageConfigurator", () => {
  it("selects a live package and keeps the venue model mounted", () => {
    const onSelect = vi.fn();
    render(
      <VipPackageConfigurator
        event={event}
        selectedSize="small"
        onSelect={onSelect}
        onContinue={vi.fn()}
      />
    );

    const mediumHeading = screen.getByRole("heading", { name: "Medium" });
    fireEvent.click(mediumHeading.closest("button")!);

    expect(onSelect).toHaveBeenCalledWith("medium");
    expect(screen.getByTestId("venue-model")).toBeDefined();
  });

  it("disables sold-out packages", () => {
    const onSelect = vi.fn();
    render(
      <VipPackageConfigurator
        event={event}
        selectedSize="small"
        onSelect={onSelect}
        onContinue={vi.fn()}
      />
    );

    const largeButton = screen
      .getByRole("heading", { name: "Large" })
      .closest("button") as HTMLButtonElement;

    expect(largeButton.disabled).toBe(true);
    fireEvent.click(largeButton);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("carries the selected placement into the request summary", () => {
    const onContinue = vi.fn();
    render(
      <VipPackageConfigurator
        event={event}
        selectedSize="medium"
        onSelect={vi.fn()}
        onContinue={onContinue}
      />
    );

    expect(screen.getAllByText("Central crew placement")).toHaveLength(2);
    fireEvent.click(
      screen.getByRole("button", { name: /continue to request/i })
    );
    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});
