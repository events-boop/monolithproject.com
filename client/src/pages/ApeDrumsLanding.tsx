import { Redirect, useLocation } from "wouter";
import ArtistShowLanding from "@/components/artist-show/ArtistShowLanding";
import { APE_DRUMS_SHOW_CONFIG } from "@/content/artist-shows/apeDrums";
import { APE_DRUMS_RELEASE } from "@/lib/apeDrumsRelease";
import { ROUTES } from "@shared/routes";

export default function ApeDrumsLanding() {
  const [location] = useLocation();
  const preview = location === ROUTES.apeDrumsPreview;

  if (!preview && !APE_DRUMS_RELEASE.publicReady) {
    return <Redirect to={ROUTES.notFound} />;
  }

  return (
    <ArtistShowLanding
      config={APE_DRUMS_SHOW_CONFIG}
      release={APE_DRUMS_RELEASE}
      preview={preview}
    />
  );
}
