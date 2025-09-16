import type { CityRanking } from '@activity/shared';

interface CacheEntry {
  data: CityRanking;
  timestamp: number;
}

export class CacheManager {
  private cache = new Map<string, CacheEntry>();
  private ttlMs: number;

  constructor(ttlMs: number) {
    this.ttlMs = ttlMs;
  }

  private getCacheKey(city: string): string {
    return city.toLowerCase().trim();
  }

  get(city: string): CityRanking | null {
    const key = this.getCacheKey(city);
    const entry = this.cache.get(key);

    if (!entry) return null;

    const now = Date.now();
    const isExpired = now - entry.timestamp > this.ttlMs;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return {
      ...entry.data,
      cache: {
        hit: true,
        ttlSeconds: Math.floor((this.ttlMs - (now - entry.timestamp)) / 1000),
      },
    };
  }

  set(city: string, data: CityRanking): void {
    const key = this.getCacheKey(city);
    this.cache.set(key, {
      data: {
        ...data,
        cache: { hit: false, ttlSeconds: Math.floor(this.ttlMs / 1000) },
      },
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}
