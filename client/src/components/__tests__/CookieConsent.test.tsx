import { act, cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import CookieConsent from "../CookieConsent";

vi.mock("@/contexts/AudioContext", () => ({
  useOptionalGlobalAudio: () => null,
}));

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.useRealTimers();
});

describe("signup consent placement", () => {
  it("places the notice in the intake slot and returns to fixed placement when the slot leaves", async () => {
    vi.useFakeTimers();
    const slot = document.createElement("div");
    slot.id = "first-access-cookie-notice";
    document.body.append(slot);
    render(<CookieConsent />);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3600);
    });
    expect(slot).toContainElement(
      screen.getByRole("region", { name: "Cookie consent" })
    );
    expect(
      screen.getByRole("region", { name: "Cookie consent" })
    ).not.toHaveClass("fixed");
    await act(async () => {
      slot.remove();
    });
    expect(screen.getByRole("region", { name: "Cookie consent" })).toHaveClass(
      "fixed"
    );
  });

  it("finds the intake slot when a lazy route mounts after the notice", async () => {
    vi.useFakeTimers();
    render(<CookieConsent />);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3600);
    });
    expect(screen.getByRole("region", { name: "Cookie consent" })).toHaveClass(
      "fixed"
    );
    const slot = document.createElement("div");
    slot.id = "first-access-cookie-notice";
    await act(async () => {
      document.body.append(slot);
    });
    expect(slot).toContainElement(
      screen.getByRole("region", { name: "Cookie consent" })
    );
    cleanup();
    slot.remove();
  });
});
