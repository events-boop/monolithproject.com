import { render } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { MediaItem, GalleryImageItem, GalleryVideoItem } from "@/data/galleryData";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// Capture the props the component passes to <Lightbox> so we can assert on
// the `slides` array that is built from `media` items.
let capturedProps: Record<string, unknown> = {};

vi.mock("yet-another-react-lightbox", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    capturedProps = props;
    return <div data-testid="lightbox-mock" />;
  },
}));

vi.mock("yet-another-react-lightbox/plugins/captions", () => ({
  __esModule: true,
  default: "CaptionsMock",
}));
vi.mock("yet-another-react-lightbox/plugins/counter", () => ({
  __esModule: true,
  default: "CounterMock",
}));
vi.mock("yet-another-react-lightbox/plugins/fullscreen", () => ({
  __esModule: true,
  default: "FullscreenMock",
}));
vi.mock("yet-another-react-lightbox/plugins/thumbnails", () => ({
  __esModule: true,
  default: "ThumbnailsMock",
}));
vi.mock("yet-another-react-lightbox/plugins/video", () => ({
  __esModule: true,
  default: "VideoMock",
}));
vi.mock("yet-another-react-lightbox/plugins/zoom", () => ({
  __esModule: true,
  default: "ZoomMock",
}));

// CSS imports are not handled in jsdom; stub them out.
vi.mock("yet-another-react-lightbox/styles.css", () => ({}));
vi.mock("yet-another-react-lightbox/plugins/captions.css", () => ({}));
vi.mock("yet-another-react-lightbox/plugins/counter.css", () => ({}));
vi.mock("yet-another-react-lightbox/plugins/thumbnails.css", () => ({}));

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeImage(overrides: Partial<GalleryImageItem> = {}): GalleryImageItem {
  return {
    id: "img-1",
    kind: "image",
    src: "/images/test.jpg",
    width: 1920,
    height: 1080,
    alt: "Test image",
    caption: "Test caption",
    description: "A beautiful scene",
    credit: "Photographer X",
    ...overrides,
  };
}

function makeVideo(overrides: Partial<GalleryVideoItem> = {}): GalleryVideoItem {
  return {
    id: "vid-1",
    kind: "video",
    src: "/videos/test.mp4",
    width: 1920,
    height: 1080,
    poster: "/images/test-poster.jpg",
    posterWidth: 1920,
    posterHeight: 1080,
    alt: "Test video",
    caption: "Video caption",
    description: "A moving sequence",
    credit: "Director Y",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

// We need to import AFTER mocks are set up so the module picks them up.
// With vitest hoisting this already works, but the explicit ordering is clear.
import GalleryLightbox from "@/components/GalleryLightbox";

describe("GalleryLightbox", () => {
  const noop = () => {};

  beforeEach(() => {
    capturedProps = {};
  });

  // ----------------------------------------------------------------
  // Image slide conversion
  // ----------------------------------------------------------------

  describe("image items", () => {
    it("converts an image MediaItem to the correct Slide shape", () => {
      const img = makeImage();
      render(<GalleryLightbox media={[img]} index={0} onClose={noop} />);

      const slides = capturedProps.slides as Record<string, unknown>[];
      expect(slides).toHaveLength(1);

      const slide = slides[0];
      expect(slide.src).toBe("/images/test.jpg");
      expect(slide.width).toBe(1920);
      expect(slide.height).toBe(1080);
      expect(slide.title).toBe("Test caption");
    });

    it("falls back to alt when caption is undefined", () => {
      const img = makeImage({ caption: undefined });
      render(<GalleryLightbox media={[img]} index={0} onClose={noop} />);

      const slides = capturedProps.slides as Record<string, unknown>[];
      expect(slides[0].title).toBe("Test image");
    });

    it("builds description from description + credit", () => {
      const img = makeImage({
        description: "Sunset glow",
        credit: "Photo Co.",
      });
      render(<GalleryLightbox media={[img]} index={0} onClose={noop} />);

      const slides = capturedProps.slides as Record<string, unknown>[];
      expect(slides[0].description).toBe("Sunset glow Credit: Photo Co.");
    });

    it("builds description with only description when credit is absent", () => {
      const img = makeImage({ description: "Sunset glow", credit: undefined });
      render(<GalleryLightbox media={[img]} index={0} onClose={noop} />);

      const slides = capturedProps.slides as Record<string, unknown>[];
      expect(slides[0].description).toBe("Sunset glow");
    });

    it("builds description with only credit when description is absent", () => {
      const img = makeImage({ description: undefined, credit: "Photo Co." });
      render(<GalleryLightbox media={[img]} index={0} onClose={noop} />);

      const slides = capturedProps.slides as Record<string, unknown>[];
      expect(slides[0].description).toBe("Credit: Photo Co.");
    });

    it("returns empty description when both fields are absent", () => {
      const img = makeImage({ description: undefined, credit: undefined });
      render(<GalleryLightbox media={[img]} index={0} onClose={noop} />);

      const slides = capturedProps.slides as Record<string, unknown>[];
      expect(slides[0].description).toBe("");
    });

    it("does not include a type field on image slides", () => {
      const img = makeImage();
      render(<GalleryLightbox media={[img]} index={0} onClose={noop} />);

      const slides = capturedProps.slides as Record<string, unknown>[];
      expect(slides[0]).not.toHaveProperty("type");
    });
  });

  // ----------------------------------------------------------------
  // Video slide conversion
  // ----------------------------------------------------------------

  describe("video items", () => {
    it("converts a video MediaItem to the correct Slide shape", () => {
      const vid = makeVideo();
      render(<GalleryLightbox media={[vid]} index={0} onClose={noop} />);

      const slides = capturedProps.slides as Record<string, unknown>[];
      expect(slides).toHaveLength(1);

      const slide = slides[0];
      expect(slide.type).toBe("video");
      expect(slide.width).toBe(1920);
      expect(slide.height).toBe(1080);
      expect(slide.poster).toBe("/images/test-poster.jpg");
      expect(slide.title).toBe("Video caption");
    });

    it("includes video sources with src and type", () => {
      const vid = makeVideo();
      render(<GalleryLightbox media={[vid]} index={0} onClose={noop} />);

      const slides = capturedProps.slides as Record<string, unknown>[];
      const sources = slides[0].sources as { src: string; type: string }[];

      expect(sources).toEqual([{ src: "/videos/test.mp4", type: "video/mp4" }]);
    });

    it("builds description from description + credit for videos", () => {
      const vid = makeVideo({
        description: "Moving moment",
        credit: "Studio Z",
      });
      render(<GalleryLightbox media={[vid]} index={0} onClose={noop} />);

      const slides = capturedProps.slides as Record<string, unknown>[];
      expect(slides[0].description).toBe("Moving moment Credit: Studio Z");
    });

    it("falls back to alt when caption is undefined on video", () => {
      const vid = makeVideo({ caption: undefined });
      render(<GalleryLightbox media={[vid]} index={0} onClose={noop} />);

      const slides = capturedProps.slides as Record<string, unknown>[];
      expect(slides[0].title).toBe("Test video");
    });
  });

  // ----------------------------------------------------------------
  // Mixed arrays & edge cases
  // ----------------------------------------------------------------

  describe("mixed and edge-case arrays", () => {
    it("correctly converts a mixed array of images and videos", () => {
      const media: MediaItem[] = [
        makeImage({ id: "img-a", caption: "Image A" }),
        makeVideo({ id: "vid-b", caption: "Video B" }),
        makeImage({ id: "img-c", caption: "Image C" }),
      ];

      render(<GalleryLightbox media={media} index={0} onClose={noop} />);

      const slides = capturedProps.slides as Record<string, unknown>[];
      expect(slides).toHaveLength(3);

      // First slide: image
      expect(slides[0]).not.toHaveProperty("type");
      expect(slides[0].title).toBe("Image A");

      // Second slide: video
      expect(slides[1].type).toBe("video");
      expect(slides[1].title).toBe("Video B");

      // Third slide: image
      expect(slides[2]).not.toHaveProperty("type");
      expect(slides[2].title).toBe("Image C");
    });

    it("handles an empty media array", () => {
      render(<GalleryLightbox media={[]} index={0} onClose={noop} />);

      const slides = capturedProps.slides as Record<string, unknown>[];
      expect(slides).toEqual([]);
    });
  });

  // ----------------------------------------------------------------
  // Lightbox prop forwarding
  // ----------------------------------------------------------------

  describe("Lightbox prop forwarding", () => {
    it("passes index and onClose through to the Lightbox component", () => {
      const onClose = vi.fn();
      render(
        <GalleryLightbox media={[makeImage()]} index={3} onClose={onClose} />,
      );

      expect(capturedProps.index).toBe(3);
      expect(capturedProps.close).toBe(onClose);
    });

    it("sets open to true when index >= 0", () => {
      render(
        <GalleryLightbox media={[makeImage()]} index={0} onClose={noop} />,
      );
      expect(capturedProps.open).toBe(true);
    });

    it("sets open to false when index is -1", () => {
      render(
        <GalleryLightbox media={[makeImage()]} index={-1} onClose={noop} />,
      );
      expect(capturedProps.open).toBe(false);
    });
  });
});
