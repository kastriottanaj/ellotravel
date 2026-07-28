/**
 * Fixed-window rate limiting, held in process memory.
 *
 * The site runs as a single container behind nginx (see the README), so one
 * process sees every request and an in-memory window is the whole picture. The
 * day a second replica appears this has to move to a shared store — until then
 * Redis would be infrastructure for nothing.
 *
 * This is a backstop, not a wall: it protects the expensive step (handing an
 * email to Resend) from a script hammering the enquiry action. Blunt flooding
 * of the HTTP endpoint itself belongs to nginx's `limit_req`.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

/**
 * A caller rotating source addresses would otherwise grow the map without
 * bound. Expired entries are swept first, so this ceiling is only reached
 * under a genuinely distributed flood — where dropping the oldest windows
 * costs an attacker nothing and keeps the process alive.
 */
const MAX_TRACKED = 20_000;

function sweep(now: number) {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  /** How long until the window resets, for a Retry-After or a message. */
  retryAfterMs: number;
};

/**
 * Records one attempt against `key` and says whether it may proceed. Call this
 * immediately before the work being protected — a rejected attempt is not
 * counted twice.
 */
export function consumeRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    if (windows.size >= MAX_TRACKED) {
      sweep(now);
      if (windows.size >= MAX_TRACKED) windows.clear();
    }
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (existing.count >= limit) {
    return { allowed: false, retryAfterMs: existing.resetAt - now };
  }

  existing.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}

/**
 * The address to bucket a request under.
 *
 * `X-Forwarded-For` is read from the *right*, not the left: nginx appends the
 * peer it actually saw (`proxy_add_x_forwarded_for`), so the last entry is the
 * one hop we trust. The leftmost entry is whatever the client claimed, which
 * would let one script pose as thousands of visitors.
 *
 * Returns null where no proxy set anything — local development, or a deploy
 * put straight on the internet. Callers decide what to do with that rather
 * than silently bucketing every visitor together.
 */
export function clientAddress(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const hops = forwarded
      .split(",")
      .map((hop) => hop.trim())
      .filter(Boolean);
    const nearest = hops.at(-1);
    if (nearest) return nearest;
  }

  return headers.get("x-real-ip")?.trim() || null;
}
