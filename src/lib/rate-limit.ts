/**
 * Best-effort rate limiting for the public lead endpoint.
 *
 * Without this, /api/leads is an open, unauthenticated endpoint that writes to
 * the database and sends email. A trivial script could fill the leads table and
 * burn the daily SMTP quota — which, in the worst case, means the form is dead
 * during a pitch.
 *
 * "Best-effort" is honest, not a hedge: this counter lives in the memory of one
 * serverless instance, so a distributed attacker hitting several instances gets
 * more than the limit. It stops casual abuse and accidental double-submits,
 * which is what this demo actually faces. A production deployment with real
 * traffic should move this to Upstash/Redis or Vercel's WAF.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 5;

type Hit = { count: number; resetAt: number };
const hits = new Map<string, Hit>();

export function rateLimit(key: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const hit = hits.get(key);

  if (!hit || now > hit.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  hit.count += 1;

  if (hit.count > MAX_PER_WINDOW) {
    return {
      allowed: false,
      retryAfter: Math.ceil((hit.resetAt - now) / 1000),
    };
  }

  return { allowed: true, retryAfter: 0 };
}

/**
 * The caller's IP, taken only from headers our own proxy sets.
 *
 * The obvious version of this — `x-forwarded-for.split(",")[0]` — is a bypass.
 * That header is a client-supplied list that proxies append to, so its leftmost
 * entry is whatever the caller typed. An attacker sends a random X-Forwarded-For
 * per request, lands in a fresh bucket every time, and the limit never fires.
 *
 * `x-real-ip` (and `x-vercel-forwarded-for`) are set by the platform and
 * overwrite anything the client sent, so they can be trusted. We deliberately
 * do NOT fall back to raw x-forwarded-for: a limiter that's trivially bypassed
 * is worse than none, because it looks like protection.
 */
export function clientIp(request: Request): string {
  return (
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

/** Keeps the Map from growing without bound on a long-lived instance. */
export function sweepExpired(): void {
  const now = Date.now();
  for (const [key, hit] of hits) {
    if (now > hit.resetAt) hits.delete(key);
  }
}
