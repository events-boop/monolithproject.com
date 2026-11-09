import { describe, it, expect, beforeEach, vi } from "vitest";
import { recoverFromStaleChunk, isChunkLoadError } from "../chunkRecovery";

describe("chunkRecovery", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  describe("isChunkLoadError", () => {
    it("identifies chunk and CSS preload errors", () => {
      expect(
        isChunkLoadError(new Error("Unable to preload CSS for /assets/6E_FkNJ-.css"))
      ).toBe(true);
      expect(
        isChunkLoadError(new Error("Failed to fetch dynamically imported module"))
      ).toBe(true);
      expect(
        isChunkLoadError(new Error("Loading chunk 404 failed"))
      ).toBe(true);
      expect(
        isChunkLoadError(new Error("Error loading dynamically imported module"))
      ).toBe(true);
      expect(
        isChunkLoadError(new Error("Failed to load module script"))
      ).toBe(true);
    });

    it("returns false for non-chunk errors", () => {
      expect(isChunkLoadError(new Error("Network timeout on /api/tickets"))).toBe(
        false
      );
      expect(isChunkLoadError(null)).toBe(false);
      expect(isChunkLoadError(undefined)).toBe(false);
      expect(isChunkLoadError("Simple string error")).toBe(false);
    });
  });

  describe("recoverFromStaleChunk", () => {
    it("initiates recovery and sets cooldown timestamp in sessionStorage", () => {
      const reloadMock = vi.fn();
      Object.defineProperty(window, "location", {
        configurable: true,
        value: { reload: reloadMock },
      });

      const recovered = recoverFromStaleChunk();
      expect(recovered).toBe(true);
      expect(sessionStorage.getItem("monolith:chunk-reload")).toBeTruthy();
    });

    it("declines recovery if called within 60-second cooldown to prevent infinite loop", () => {
      const reloadMock = vi.fn();
      Object.defineProperty(window, "location", {
        configurable: true,
        value: { reload: reloadMock },
      });

      // First recovery call
      expect(recoverFromStaleChunk()).toBe(true);

      // Immediate second call should be declined
      expect(recoverFromStaleChunk()).toBe(false);
      expect(reloadMock).not.toHaveBeenCalled();
    });
  });
});
