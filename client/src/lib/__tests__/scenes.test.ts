import { describe, it, expect } from "vitest";
import { getSceneForPath } from "@/lib/scenes";
import type { SceneConfig, SceneId } from "@/lib/scenes";

describe("scenes", () => {
  // ---------------------------------------------------------------------------
  // Scene config completeness
  // ---------------------------------------------------------------------------
  describe("scene configs", () => {
    const allSceneIds: SceneId[] = ["monolith", "story", "sunsets", "radio", "paper"];

    it("getSceneForPath always returns an object with all required properties", () => {
      const scene = getSceneForPath("/");
      expect(scene).toHaveProperty("id");
      expect(scene).toHaveProperty("variant");
      expect(scene).toHaveProperty("brand");
      expect(scene).toHaveProperty("ticketTheme");
      expect(scene).toHaveProperty("accent");
      expect(scene).toHaveProperty("glow");
    });

    it.each(allSceneIds)("scene '%s' is reachable via at least one path", (sceneId) => {
      const pathMap: Record<SceneId, string> = {
        monolith: "/",
        story: "/story",
        sunsets: "/chasing-sunsets",
        radio: "/radio",
        paper: "/newsletter",
      };
      const scene = getSceneForPath(pathMap[sceneId]);
      expect(scene.id).toBe(sceneId);
    });

    it("monolith scene has correct properties", () => {
      const scene = getSceneForPath("/");
      expect(scene).toEqual<SceneConfig>({
        id: "monolith",
        variant: "dark",
        brand: "monolith",
        ticketTheme: "default",
        accent: "#E05A3A",
        glow: "rgba(224, 90, 58, 0.35)",
      });
    });

    it("story scene has correct properties", () => {
      const scene = getSceneForPath("/story");
      expect(scene).toEqual<SceneConfig>({
        id: "story",
        variant: "dark",
        brand: "monolith",
        ticketTheme: "violet",
        accent: "#8B5CF6",
        glow: "rgba(139, 92, 246, 0.38)",
      });
    });

    it("sunsets scene has correct properties", () => {
      const scene = getSceneForPath("/chasing-sunsets");
      expect(scene).toEqual<SceneConfig>({
        id: "sunsets",
        variant: "dark",
        brand: "chasing-sunsets",
        ticketTheme: "warm",
        accent: "#C2703E",
        glow: "rgba(194, 112, 62, 0.35)",
      });
    });

    it("radio scene has correct properties", () => {
      const scene = getSceneForPath("/radio");
      expect(scene).toEqual<SceneConfig>({
        id: "radio",
        variant: "dark",
        brand: "monolith",
        ticketTheme: "default",
        accent: "#F43F5E",
        glow: "rgba(244, 63, 94, 0.3)",
      });
    });

    it("paper scene has correct properties", () => {
      const scene = getSceneForPath("/newsletter");
      expect(scene).toEqual<SceneConfig>({
        id: "paper",
        variant: "light",
        brand: "monolith",
        ticketTheme: "default",
        accent: "#8B5CF6",
        glow: "rgba(139, 92, 246, 0.16)",
      });
    });

    it("paper is the only light-variant scene", () => {
      const paperScene = getSceneForPath("/newsletter");
      expect(paperScene.variant).toBe("light");

      const darkPaths = ["/", "/story", "/chasing-sunsets", "/radio"];
      for (const path of darkPaths) {
        expect(getSceneForPath(path).variant).toBe("dark");
      }
    });

    it("sunsets is the only chasing-sunsets brand scene", () => {
      const sunsetsScene = getSceneForPath("/chasing-sunsets");
      expect(sunsetsScene.brand).toBe("chasing-sunsets");

      const monolithPaths = ["/", "/story", "/radio", "/newsletter"];
      for (const path of monolithPaths) {
        expect(getSceneForPath(path).brand).toBe("monolith");
      }
    });
  });

  // ---------------------------------------------------------------------------
  // Route matching
  // ---------------------------------------------------------------------------
  describe("getSceneForPath() route matching", () => {
    // Story scene
    it("returns story scene for /story", () => {
      expect(getSceneForPath("/story").id).toBe("story");
    });

    it("returns story scene for /story/sub-page", () => {
      expect(getSceneForPath("/story/sub-page").id).toBe("story");
    });

    it("returns story scene for /untold-story", () => {
      expect(getSceneForPath("/untold-story").id).toBe("story");
    });

    it("returns story scene for /untold-story/anything", () => {
      expect(getSceneForPath("/untold-story/anything").id).toBe("story");
    });

    // Sunsets scene
    it("returns sunsets scene for /chasing-sunsets", () => {
      expect(getSceneForPath("/chasing-sunsets").id).toBe("sunsets");
    });

    it("returns sunsets scene for /chasing-sunsets/gallery", () => {
      expect(getSceneForPath("/chasing-sunsets/gallery").id).toBe("sunsets");
    });

    // Radio scene
    it("returns radio scene for /radio", () => {
      expect(getSceneForPath("/radio").id).toBe("radio");
    });

    it("returns radio scene for /radio/episode-5", () => {
      expect(getSceneForPath("/radio/episode-5").id).toBe("radio");
    });

    // Paper scene
    it("returns paper scene for /newsletter", () => {
      expect(getSceneForPath("/newsletter").id).toBe("paper");
    });

    it("returns paper scene for /contact", () => {
      expect(getSceneForPath("/contact").id).toBe("paper");
    });

    it("returns paper scene for /faq", () => {
      expect(getSceneForPath("/faq").id).toBe("paper");
    });

    it("returns paper scene for /faq/sub-path", () => {
      expect(getSceneForPath("/faq/sub-path").id).toBe("paper");
    });

    it("returns paper scene for /contact/info", () => {
      expect(getSceneForPath("/contact/info").id).toBe("paper");
    });

    // Default (monolith)
    it("returns monolith scene for /", () => {
      expect(getSceneForPath("/").id).toBe("monolith");
    });

    it("returns monolith scene for /lineup", () => {
      expect(getSceneForPath("/lineup").id).toBe("monolith");
    });

    it("returns monolith scene for /tickets", () => {
      expect(getSceneForPath("/tickets").id).toBe("monolith");
    });

    it("returns monolith scene for /about", () => {
      expect(getSceneForPath("/about").id).toBe("monolith");
    });

    it("returns monolith scene for /partners", () => {
      expect(getSceneForPath("/partners").id).toBe("monolith");
    });

    it("returns monolith scene for /schedule", () => {
      expect(getSceneForPath("/schedule").id).toBe("monolith");
    });

    it("returns monolith scene for unknown deep paths", () => {
      expect(getSceneForPath("/some/random/path").id).toBe("monolith");
    });
  });

  // ---------------------------------------------------------------------------
  // Path normalization
  // ---------------------------------------------------------------------------
  describe("path normalization", () => {
    it("strips trailing slashes before matching", () => {
      expect(getSceneForPath("/story/").id).toBe("story");
      expect(getSceneForPath("/chasing-sunsets/").id).toBe("sunsets");
      expect(getSceneForPath("/radio/").id).toBe("radio");
      expect(getSceneForPath("/newsletter/").id).toBe("paper");
    });

    it("strips query strings before matching", () => {
      expect(getSceneForPath("/story?foo=bar").id).toBe("story");
      expect(getSceneForPath("/radio?episode=5").id).toBe("radio");
      expect(getSceneForPath("/contact?ref=footer").id).toBe("paper");
    });

    it("strips hashes before matching", () => {
      expect(getSceneForPath("/story#section").id).toBe("story");
      expect(getSceneForPath("/chasing-sunsets#top").id).toBe("sunsets");
      expect(getSceneForPath("/faq#question-1").id).toBe("paper");
    });

    it("strips both query string and hash", () => {
      expect(getSceneForPath("/story?a=1#heading").id).toBe("story");
      expect(getSceneForPath("/radio?ep=2#listen").id).toBe("radio");
    });

    it("handles undefined pathname and defaults to monolith", () => {
      expect(getSceneForPath(undefined).id).toBe("monolith");
    });

    it("handles empty string pathname and defaults to monolith", () => {
      expect(getSceneForPath("").id).toBe("monolith");
    });

    it("preserves root path /", () => {
      expect(getSceneForPath("/").id).toBe("monolith");
    });

    it("does not strip trailing slash from root /", () => {
      // Root path "/" should remain "/", not become ""
      const scene = getSceneForPath("/");
      expect(scene.id).toBe("monolith");
    });

    it("handles path with only query string", () => {
      expect(getSceneForPath("/?utm_source=ig").id).toBe("monolith");
    });

    it("handles trailing slash combined with query string", () => {
      expect(getSceneForPath("/story/?page=2").id).toBe("story");
    });
  });
});
