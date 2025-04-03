interface RateLimitInfo {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store: Map<string, RateLimitInfo>;
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 5, windowMs: number = 60000) {
    this.store = new Map();
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isRateLimited(key: string): boolean {
    const now = Date.now();
    const info = this.store.get(key);

    if (!info) {
      this.store.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return false;
    }

    if (now > info.resetTime) {
      this.store.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return false;
    }

    if (info.count >= this.maxRequests) {
      return true;
    }

    info.count++;
    return false;
  }

  getRemainingTime(key: string): number {
    const info = this.store.get(key);
    if (!info) return 0;
    return Math.max(0, info.resetTime - Date.now());
  }
}

// Create a singleton instance
export const rateLimiter = new RateLimiter();
