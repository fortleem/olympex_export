/**
 * Minimal in-memory rate limiter (fixed window per key).
 *
 * Good enough for a single-instance deployment. For a cluster, swap the
 * `windows` Map for Redis — the API stays identical.
 */
type Window = {
  count: number;
  resetAt: number;
};

const windows = new Map<string, Window>();

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * Consume one unit for `key`.
 * @param key     Stable identity, e.g. `quote:<ip>`
 * @param limit   Max requests allowed inside the window
 * @param windowMs Window length in milliseconds
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const entry = windows.get(key);

  if (!entry || entry.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  entry.count += 1;
  const allowed = entry.count <= limit;

  return {
    allowed,
    remaining: Math.max(0, limit - entry.count),
    retryAfterSeconds: allowed ? 0 : Math.ceil((entry.resetAt - now) / 1000),
  };
}

/** Drop expired windows so the map cannot grow unbounded. */
export function pruneRateLimits(): void {
  const now = Date.now();
  for (const [key, entry] of windows) {
    if (entry.resetAt <= now) windows.delete(key);
  }
}

/**
 * Best-effort client IP extraction for a Request.
 * Behind the Caddy gateway the real client IP arrives in X-Forwarded-For.
 */
export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}
