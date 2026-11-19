import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GlobalAudioProvider } from "@/contexts/AudioContext";
import {
  attachSoundCloudWidget,
  type SoundCloudAPI,
} from "@/lib/soundcloudWidget";
import RadioDeckPlayer from "../RadioDeckPlayer";
import StickyPlayer from "../StickyPlayer";

const events = {
  READY: "ready",
  PLAY: "play",
  PAUSE: "pause",
  PLAY_PROGRESS: "progress",
  FINISH: "finish",
  ERROR: "error",
};
const transports: Array<ReturnType<typeof makeTransport>> = [];
function makeTransport() {
  const callbacks = new Map<
    string,
    (payload?: { currentPosition?: number }) => void
  >();
  return {
    bind: vi.fn((name, callback) => callbacks.set(name, callback)),
    unbind: vi.fn(name => callbacks.delete(name)),
    play: vi.fn(),
    pause: vi.fn(),
    seekTo: vi.fn(),
    emit: (name: string, payload?: { currentPosition?: number }) =>
      callbacks.get(name)?.(payload),
  };
}
const src =
  "https://w.soundcloud.com/player/?url=https%3A%2F%2Fsoundcloud.com%2Ftest%2Frecord";
function Surface({ showDeck = true, alternate = false }) {
  return (
    <GlobalAudioProvider>
      {showDeck && (
        <RadioDeckPlayer
          title={alternate ? "Second record" : "First record"}
          src={alternate ? `${src}-two` : src}
          duration="64:17"
        />
      )}
      <StickyPlayer />
    </GlobalAudioProvider>
  );
}

beforeEach(() => {
  transports.length = 0;
  const Widget = Object.assign(
    vi.fn(() => {
      const widget = makeTransport();
      transports.push(widget);
      return widget;
    }),
    { Events: events }
  );
  (window as Window & { SC?: SoundCloudAPI }).SC = { Widget };
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn(() => ({
      matches: true,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
    })),
  });
});
afterEach(() => {
  cleanup();
  delete (window as Window & { SC?: SoundCloudAPI }).SC;
});

describe("persistent radio transport", () => {
  it("offers a real retry after a provider failure without adding another iframe", async () => {
    const view = render(<Surface />);
    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: "Play First record" }))
    );
    act(() => transports[0].emit(events.ERROR));
    expect(screen.getByRole("alert").textContent).toContain(
      "SoundCloud could not play"
    );
    await act(async () =>
      fireEvent.click(
        screen.getByRole("button", { name: "Retry First record" })
      )
    );
    expect(view.container.querySelectorAll("iframe")).toHaveLength(1);
    expect(screen.queryByRole("alert")).toBeNull();
    act(() => transports[1].emit(events.READY));
    expect(transports[1].play).toHaveBeenCalledTimes(1);
  });
  it("creates one player on intent and retains it when page controls unmount", async () => {
    const view = render(<Surface />);
    expect(view.container.querySelectorAll("iframe")).toHaveLength(0);
    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: "Play First record" }))
    );
    const frame = view.container.querySelector("iframe")!;
    expect(view.container.querySelectorAll("iframe")).toHaveLength(1);
    expect(new URL(frame.src).searchParams.get("auto_play")).toBe("false");
    act(() => transports[0].emit(events.READY));
    expect(transports[0].play).toHaveBeenCalledTimes(1);
    view.rerender(<Surface showDeck={false} />);
    expect(view.container.querySelector("iframe")).toBe(frame);
    expect(transports).toHaveLength(1);
  });

  it("honors pause while connecting and synchronizes seek and provider progress", async () => {
    render(<Surface />);
    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: "Play First record" }))
    );
    fireEvent.click(screen.getByRole("button", { name: "Pause First record" }));
    act(() => transports[0].emit(events.READY));
    expect(transports[0].play).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Play First record" }));
    expect(transports[0].play).toHaveBeenCalledTimes(1);
    fireEvent.change(screen.getByRole("slider"), {
      target: { value: "120000" },
    });
    expect(transports[0].seekTo).toHaveBeenLastCalledWith(120000);
    act(() =>
      transports[0].emit(events.PLAY_PROGRESS, { currentPosition: 121000 })
    );
    expect((screen.getByRole("slider") as HTMLInputElement).value).toBe(
      "121000"
    );
    fireEvent.click(screen.getByRole("button", { name: "Close audio player" }));
    expect(transports[0].pause).toHaveBeenCalled();
  });

  it("selecting another recording does not replace audio until Play", async () => {
    const view = render(<Surface />);
    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: "Play First record" }))
    );
    const frame = view.container.querySelector("iframe")!;
    const firstSrc = frame.src;
    view.rerender(<Surface alternate />);
    expect(frame.src).toBe(firstSrc);
    await act(async () =>
      fireEvent.click(
        screen.getByRole("button", { name: "Play Second record" })
      )
    );
    expect(view.container.querySelectorAll("iframe")).toHaveLength(1);
    expect(frame.src).not.toBe(firstSrc);
    expect(transports[0].unbind).toHaveBeenCalledWith(events.PLAY);
    expect(transports).toHaveLength(2);
  });

  it("ignores a provider READY arriving after unmount", async () => {
    const frame = document.createElement("iframe");
    document.body.append(frame);
    const detach = attachSoundCloudWidget({
      iframe: frame,
      shouldPlayOnReady: true,
    });
    await act(async () => {});
    detach();
    frame.remove();
    transports[0].emit(events.READY);
    expect(transports[0].play).not.toHaveBeenCalled();
  });
});
