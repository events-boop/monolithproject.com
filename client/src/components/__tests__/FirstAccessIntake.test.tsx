import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import FirstAccessIntake from "../FirstAccessIntake";
import { trackMetaPixelLead } from "@/lib/metaPixel";
import { COOKIE_CONSENT_STORAGE_KEY } from "@/lib/cookieConsent";
import { FIRST_ACCESS_CONSENT_VERSION } from "@shared/first-access";

vi.mock("../Navigation", () => ({ default: () => null }));
vi.mock("../SEO", () => ({ default: () => null }));
vi.mock("@/lib/metaPixel", () => ({ trackMetaPixelLead: vi.fn() }));

const response = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "accepted");
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

async function reachFinalStep() {
  render(<FirstAccessIntake />);
  fireEvent.click(await screen.findByRole("checkbox", { name: /CHASING SUN/ }));
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  fireEvent.change(screen.getByLabelText("First name"), {
    target: { value: "Alex" },
  });
  fireEvent.change(screen.getByLabelText("Email address"), {
    target: { value: "alex@example.com" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
}

function giveConsent() {
  fireEvent.click(screen.getByRole("checkbox", { name: /email updates/ }));
  fireEvent.click(screen.getByRole("checkbox", { name: /18 or older/ }));
}

describe("First Access signup outcomes", () => {
  it("offers hosted signup immediately and leaves checking after four seconds", async () => {
    vi.useFakeTimers();
    const fetch = vi.fn(
      (_url: RequestInfo | URL, _options?: RequestInit) =>
        new Promise<Response>(() => {})
    );
    vi.stubGlobal("fetch", fetch);
    render(<FirstAccessIntake />);
    expect(
      screen.getByRole("link", { name: "Get First Access" })
    ).toBeVisible();
    expect(screen.getByRole("status")).toBeVisible();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(4000);
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(fetch.mock.calls[0][1]?.signal?.aborted).toBe(true);
  });

  it("focuses the missing final consent and never tracks intermediate steps", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(response({ available: true }))
    );
    await reachFinalStep();
    fireEvent.click(screen.getByRole("button", { name: "Count me in" }));
    await waitFor(() =>
      expect(
        screen.getByRole("checkbox", { name: /email updates/ })
      ).toHaveFocus()
    );
    expect(trackMetaPixelLead).not.toHaveBeenCalled();
  });

  it("locks editing during a slow request and tracks only the confirmed receipt", async () => {
    let complete!: (value: Response) => void;
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(response({ available: true }))
      .mockImplementationOnce(
        () =>
          new Promise<Response>(resolve => {
            complete = resolve;
          })
      );
    vi.stubGlobal("fetch", fetch);
    await reachFinalStep();
    giveConsent();
    fireEvent.click(screen.getByRole("button", { name: "Count me in" }));
    expect(screen.getByRole("button", { name: "Edit details" })).toBeDisabled();
    expect(trackMetaPixelLead).not.toHaveBeenCalled();
    await act(async () =>
      complete(response({ ok: true, state: "subscribed" }))
    );
    expect(JSON.parse(fetch.mock.calls[1][1].body).consentVersion).toBe(
      FIRST_ACCESS_CONSENT_VERSION
    );
    expect(await screen.findByText("FIRST ACCESS, CONFIRMED")).toBeVisible();
    expect(screen.getByText("alex@example.com")).toBeVisible();
    expect(trackMetaPixelLead).toHaveBeenCalledTimes(1);
    expect(trackMetaPixelLead).toHaveBeenCalledWith(
      expect.objectContaining({
        content_ids: ["monolith-first-access-2027"],
      })
    );
    expect(
      JSON.stringify(vi.mocked(trackMetaPixelLead).mock.calls)
    ).not.toContain("alex@example.com");
  });

  it.each(["declined", null])(
    "does not track a subscription with analytics consent %s",
    async consent => {
      if (consent)
        window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, consent);
      else window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
      vi.stubGlobal(
        "fetch",
        vi
          .fn()
          .mockResolvedValueOnce(response({ available: true }))
          .mockResolvedValueOnce(response({ ok: true, state: "subscribed" }))
      );
      await reachFinalStep();
      giveConsent();
      fireEvent.click(screen.getByRole("button", { name: "Count me in" }));
      expect(await screen.findByText("FIRST ACCESS, CONFIRMED")).toBeVisible();
      expect(trackMetaPixelLead).not.toHaveBeenCalled();
    }
  );

  it("keeps the same operation key after a retryable failure and retains details", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(response({ available: true }))
      .mockResolvedValueOnce(
        response({ ok: false, message: "Please retry." }, 502)
      )
      .mockResolvedValueOnce(response({ ok: true, state: "subscribed" }));
    vi.stubGlobal("fetch", fetch);
    await reachFinalStep();
    giveConsent();
    fireEvent.click(screen.getByRole("button", { name: "Count me in" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Please retry.");
    expect(trackMetaPixelLead).not.toHaveBeenCalled();
    expect(screen.getByText("alex@example.com")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Count me in" }));
    await screen.findByText("FIRST ACCESS, CONFIRMED");
    expect(fetch.mock.calls[1][1].headers["Idempotency-Key"]).toBe(
      fetch.mock.calls[2][1].headers["Idempotency-Key"]
    );
  });

  it("does not report a saved-only response as a confirmed subscription", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(response({ available: true }))
        .mockResolvedValueOnce(response({ ok: true, state: "saved" }))
    );
    await reachFinalStep();
    giveConsent();
    fireEvent.click(screen.getByRole("button", { name: "Count me in" }));
    await screen.findByRole("alert");
    expect(
      screen.queryByText("FIRST ACCESS, CONFIRMED")
    ).not.toBeInTheDocument();
    expect(trackMetaPixelLead).not.toHaveBeenCalled();
  });

  it("uses the server's retry interval instead of promising a fixed fifteen-minute wait", async () => {
    const limited = response({ ok: false }, 429);
    limited.headers.set("Retry-After", "61");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(response({ available: true }))
        .mockResolvedValueOnce(limited)
    );
    await reachFinalStep();
    giveConsent();
    fireEvent.click(screen.getByRole("button", { name: "Count me in" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Please wait 2 minutes"
    );
    expect(trackMetaPixelLead).not.toHaveBeenCalled();
  });

  it("does not count a decoy acknowledgement as a conversion", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(response({ available: true }))
        .mockResolvedValueOnce(
          response(
            {
              ok: true,
              state: "accepted",
              message: "Your request was received.",
            },
            202
          )
        )
    );
    await reachFinalStep();
    giveConsent();
    fireEvent.click(screen.getByRole("button", { name: "Count me in" }));
    await screen.findByRole("alert");
    expect(
      screen.queryByText("FIRST ACCESS, CONFIRMED")
    ).not.toBeInTheDocument();
    expect(trackMetaPixelLead).not.toHaveBeenCalled();
  });

  it("recovers from a stalled submit without claiming the request was never received", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(response({ available: true }))
        .mockImplementationOnce(
          (_url: RequestInfo | URL, options: RequestInit) =>
            new Promise<Response>((_resolve, reject) => {
              options.signal?.addEventListener("abort", () =>
                reject(new DOMException("Aborted", "AbortError"))
              );
            })
        )
    );
    await reachFinalStep();
    giveConsent();
    vi.useFakeTimers();
    fireEvent.click(screen.getByRole("button", { name: "Count me in" }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(30000);
    });
    expect(screen.getByRole("alert")).toHaveTextContent(
      "couldn’t confirm whether your signup completed"
    );
    expect(screen.getByRole("button", { name: "Count me in" })).toBeEnabled();
    expect(screen.getByText("alex@example.com")).toBeVisible();
    expect(trackMetaPixelLead).not.toHaveBeenCalled();
  });
});
