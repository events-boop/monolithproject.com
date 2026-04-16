import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";

/**
 * Because `getYouTubeVideoId` is not exported from the module, we test it
 * indirectly through the component's rendering behaviour:
 *   - Valid URLs  -> component renders an <iframe> whose `src` contains the
 *                    expected video ID embedded in the youtube-nocookie domain.
 *   - Invalid URLs -> component renders nothing (returns null).
 */

describe("YouTubeEmbed", () => {
  // ------------------------------------------------------------------
  // Helper
  // ------------------------------------------------------------------

  /** Returns the iframe element when one was rendered, or null otherwise. */
  function renderAndGetIframe(url: string) {
    const { container } = render(
      <YouTubeEmbed url={url} title="Test video" />,
    );
    return container.querySelector("iframe");
  }

  // ------------------------------------------------------------------
  // Video-ID extraction (tested via rendering)
  // ------------------------------------------------------------------

  describe("getYouTubeVideoId (via render)", () => {
    it("extracts the ID from a standard watch URL", () => {
      const iframe = renderAndGetIframe(
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      );
      expect(iframe).not.toBeNull();
      expect(iframe!.src).toContain(
        "youtube-nocookie.com/embed/dQw4w9WgXcQ",
      );
    });

    it("extracts the ID from a short youtu.be URL", () => {
      const iframe = renderAndGetIframe("https://youtu.be/dQw4w9WgXcQ");
      expect(iframe).not.toBeNull();
      expect(iframe!.src).toContain(
        "youtube-nocookie.com/embed/dQw4w9WgXcQ",
      );
    });

    it("extracts the ID from an embed URL", () => {
      const iframe = renderAndGetIframe(
        "https://www.youtube.com/embed/dQw4w9WgXcQ",
      );
      expect(iframe).not.toBeNull();
      expect(iframe!.src).toContain(
        "youtube-nocookie.com/embed/dQw4w9WgXcQ",
      );
    });

    it("extracts the ID from a shorts URL", () => {
      const iframe = renderAndGetIframe(
        "https://www.youtube.com/shorts/dQw4w9WgXcQ",
      );
      expect(iframe).not.toBeNull();
      expect(iframe!.src).toContain(
        "youtube-nocookie.com/embed/dQw4w9WgXcQ",
      );
    });

    it("extracts the ID when extra query params are present", () => {
      const iframe = renderAndGetIframe(
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30",
      );
      expect(iframe).not.toBeNull();
      expect(iframe!.src).toContain(
        "youtube-nocookie.com/embed/dQw4w9WgXcQ",
      );
    });

    it("returns null for an invalid URL", () => {
      const iframe = renderAndGetIframe("not-a-valid-url");
      expect(iframe).toBeNull();
    });

    it("returns null for an empty string", () => {
      const iframe = renderAndGetIframe("");
      expect(iframe).toBeNull();
    });

    it("returns null for a non-YouTube URL", () => {
      const iframe = renderAndGetIframe("https://vimeo.com/123456789");
      expect(iframe).toBeNull();
    });
  });

  // ------------------------------------------------------------------
  // Embed URL parameter construction
  // ------------------------------------------------------------------

  describe("embed URL parameters", () => {
    it("applies default parameters correctly", () => {
      const iframe = renderAndGetIframe(
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      );
      expect(iframe).not.toBeNull();

      const src = new URL(iframe!.src);
      expect(src.searchParams.get("autoplay")).toBe("0");
      expect(src.searchParams.get("mute")).toBe("0");
      expect(src.searchParams.get("controls")).toBe("1");
      expect(src.searchParams.get("playsinline")).toBe("1");
      expect(src.searchParams.get("rel")).toBe("0");
      expect(src.searchParams.get("modestbranding")).toBe("1");
      expect(src.searchParams.get("enablejsapi")).toBe("0");
      expect(src.searchParams.get("iv_load_policy")).toBe("3");
      expect(src.searchParams.get("disablekb")).toBe("1");
    });

    it("sets autoplay and mute when requested", () => {
      const { container } = render(
        <YouTubeEmbed
          url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          title="Test"
          autoplay
          muted
        />,
      );
      const iframe = container.querySelector("iframe")!;
      const src = new URL(iframe.src);

      expect(src.searchParams.get("autoplay")).toBe("1");
      expect(src.searchParams.get("mute")).toBe("1");
    });

    it("adds loop and playlist params when loop is true", () => {
      const { container } = render(
        <YouTubeEmbed
          url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          title="Test"
          loop
        />,
      );
      const iframe = container.querySelector("iframe")!;
      const src = new URL(iframe.src);

      expect(src.searchParams.get("loop")).toBe("1");
      expect(src.searchParams.get("playlist")).toBe("dQw4w9WgXcQ");
    });

    it("does not include loop param when loop is false (default)", () => {
      const iframe = renderAndGetIframe(
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      );
      const src = new URL(iframe!.src);
      expect(src.searchParams.has("loop")).toBe(false);
    });

    it("sets start when a positive finite number is provided", () => {
      const { container } = render(
        <YouTubeEmbed
          url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          title="Test"
          start={42}
        />,
      );
      const iframe = container.querySelector("iframe")!;
      const src = new URL(iframe.src);

      expect(src.searchParams.get("start")).toBe("42");
    });

    it("floors the start value to an integer", () => {
      const { container } = render(
        <YouTubeEmbed
          url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          title="Test"
          start={42.7}
        />,
      );
      const iframe = container.querySelector("iframe")!;
      const src = new URL(iframe.src);

      expect(src.searchParams.get("start")).toBe("42");
    });

    it("omits start when value is 0 or negative", () => {
      const { container } = render(
        <YouTubeEmbed
          url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          title="Test"
          start={0}
        />,
      );
      const iframe = container.querySelector("iframe")!;
      const src = new URL(iframe.src);

      expect(src.searchParams.has("start")).toBe(false);
    });
  });

  // ------------------------------------------------------------------
  // iframe attributes
  // ------------------------------------------------------------------

  describe("iframe attributes", () => {
    it("sets the title attribute", () => {
      render(
        <YouTubeEmbed
          url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          title="My video title"
        />,
      );
      expect(screen.getByTitle("My video title")).toBeTruthy();
    });

    it("uses lazy loading by default", () => {
      const iframe = renderAndGetIframe(
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      );
      expect(iframe!.getAttribute("loading")).toBe("lazy");
    });

    it("applies a custom className", () => {
      const { container } = render(
        <YouTubeEmbed
          url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          title="Test"
          className="my-custom-class"
        />,
      );
      expect(container.querySelector("iframe")!.classList.contains("my-custom-class")).toBe(true);
    });

    it("sets allowFullScreen to true by default", () => {
      const iframe = renderAndGetIframe(
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      );
      expect(iframe!.allowFullscreen).toBe(true);
    });
  });
});
