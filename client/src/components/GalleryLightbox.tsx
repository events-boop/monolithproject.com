import Lightbox, { Slide } from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { MediaItem } from "@/data/galleryData";

interface GalleryLightboxProps {
  media: MediaItem[];
  index: number;
  onClose: () => void;
}

function buildDescription(item: MediaItem) {
  return [item.description, item.credit ? `Credit: ${item.credit}` : null]
    .filter(Boolean)
    .join(" ");
}

export default function GalleryLightbox({
  media,
  index,
  onClose,
}: GalleryLightboxProps) {
  const slides: Slide[] = media.map((item) => {
    if (item.kind === "video") {
      return {
        type: "video",
        width: item.width,
        height: item.height,
        poster: item.poster,
        title: item.caption || item.alt,
        description: buildDescription(item),
        sources: [{ src: item.src, type: "video/mp4" }],
      };
    }

    return {
      src: item.src,
      width: item.width,
      height: item.height,
      title: item.caption || item.alt,
      description: buildDescription(item),
    };
  });

  return (
    <Lightbox
      open={index >= 0}
      close={onClose}
      index={index}
      slides={slides}
      plugins={[Captions, Counter, Fullscreen, Thumbnails, Video, Zoom]}
      controller={{ closeOnBackdropClick: true }}
      carousel={{ padding: 0, spacing: 24 }}
      captions={{ descriptionTextAlign: "center", descriptionMaxLines: 3 }}
      video={{ controls: true, playsInline: true, preload: "metadata" }}
      zoom={{ maxZoomPixelRatio: 2.5, scrollToZoom: true }}
      thumbnails={{ position: "bottom", width: 96, height: 72, gap: 12, border: 0 }}
      styles={{
        container: { backgroundColor: "rgba(4, 4, 6, 0.96)", backdropFilter: "blur(18px)" },
      }}
    />
  );
}
