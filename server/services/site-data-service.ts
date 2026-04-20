import { createHash } from "crypto";
import { readPublicScheduledEvents } from "../db/scheduledEventsRepo";
import { buildPublicSiteData } from "../data/public-site-data";
import { logEvent } from "../lib/logging";
import type { ScheduledEvent, PublicSiteData } from "../../shared/events/types";

type CachedSiteDataResponse = {
  etag: string;
  payload: PublicSiteData;
  serialized: string;
};

/**
 * SiteDataService
 * Implements a Singleton Cache with Background Revalidation (SWR)
 * to ensure God-Tier response times under heavy load.
 */
class SiteDataService {
  private static instance: SiteDataService;
  
  private cachedEvents: ScheduledEvent[] | null = null;
  private cachedResponses = new Map<string, CachedSiteDataResponse>();
  private lastFetchTime: number = 0;
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<void> | null = null;
  
  // Cache TTL: 60 seconds. Stale period: High (background refresh)
  private readonly TTL_MS = 60 * 1000;

  private constructor() {}

  public static getInstance(): SiteDataService {
    if (!SiteDataService.instance) {
      SiteDataService.instance = new SiteDataService();
    }
    return SiteDataService.instance;
  }

  /**
   * Main entry point for the API route.
   * Returns shaped site data for a specific path, optimized for speed.
   */
  public async getSiteData(path: string): Promise<PublicSiteData> {
    const response = await this.getSiteDataResponse(path);
    return response.payload;
  }

  public async getSiteDataResponse(path: string): Promise<CachedSiteDataResponse> {
    const events = await this.getEventsWithSWR();
    const cachedResponse = this.cachedResponses.get(path);
    if (cachedResponse) {
      return cachedResponse;
    }

    const payload = buildPublicSiteData(path, events);
    const serialized = JSON.stringify(payload);
    const etag = `W/"${createHash("sha1").update(serialized).digest("base64url")}"`;
    const response = { etag, payload, serialized };
    this.cachedResponses.set(path, response);
    return response;
  }

  /**
   * Retrieves events from memory if valid, otherwise triggers a refresh.
   * If cache is stale but present, returns stale data and refreshes in background.
   */
  private async getEventsWithSWR(): Promise<ScheduledEvent[]> {
    const now = Date.now();
    const isStale = now - this.lastFetchTime > this.TTL_MS;

    // 1. If we have no data at all, we must wait for the first fetch
    if (!this.cachedEvents) {
      logEvent("site_data.cache_miss", { reason: "bootstrap" });
      if (!this.refreshPromise) {
        this.refreshPromise = this.refreshCache().finally(() => {
          this.refreshPromise = null;
        });
      }
      await this.refreshPromise;
      return this.cachedEvents || [];
    }

    // 2. If data is stale and we aren't already refreshing, trigger background update
    if (isStale && !this.isRefreshing) {
      logEvent("site_data.cache_stale", { age: now - this.lastFetchTime });
      // Non-blocking background refresh
      this.refreshCache().catch(err => {
        console.error("[SiteDataService] Background refresh failed", err);
      });
    }

    // 3. Return what we have immediately (Hit or Stale-Hit)
    return this.cachedEvents;
  }

  /**
   * Performs the heavy lifting: database query and mapping.
   */
  private async refreshCache(): Promise<void> {
    this.isRefreshing = true;
    const startTime = Date.now();
    
    try {
      const events = await readPublicScheduledEvents();
      this.cachedEvents = events;
      this.cachedResponses.clear();
      this.lastFetchTime = Date.now();
      
      logEvent("site_data.cache_refreshed", { 
        latency: Date.now() - startTime,
        count: events.length 
      });
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Manual cache invalidation (useful for webhooks or admin updates)
   */
  public invalidate() {
    this.cachedEvents = null;
    this.cachedResponses.clear();
    this.lastFetchTime = 0;
    logEvent("site_data.cache_invalidated", {});
  }
}

export const siteDataService = SiteDataService.getInstance();
