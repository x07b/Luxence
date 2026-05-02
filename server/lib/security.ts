/**
 * Centralised security middleware — no external dependencies required.
 * Covers: rate limiting, security headers, request sanitisation.
 */

// ─── In-memory rate limiter ───────────────────────────────────────────────────

interface RateRecord {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateRecord>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, rec] of store) {
    if (now > rec.resetAt) store.delete(key);
  }
}, 5 * 60 * 1000);

function getClientIp(req: any): string {
  const xff = req.headers["x-forwarded-for"];
  if (xff) {
    const first = Array.isArray(xff) ? xff[0] : xff.split(",")[0];
    return first.trim();
  }
  return req.socket?.remoteAddress ?? "unknown";
}

/**
 * Rate-limit middleware.
 * @param max      Max requests allowed in the window
 * @param windowMs Time window in milliseconds
 * @param key      Optional key prefix to isolate different limiters
 */
export function rateLimit(max: number, windowMs: number, key = "global") {
  return (req: any, res: any, next: any) => {
    const ip = getClientIp(req);
    const mapKey = `${key}:${ip}`;
    const now = Date.now();
    const rec = store.get(mapKey);

    if (!rec || now > rec.resetAt) {
      store.set(mapKey, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (rec.count >= max) {
      res.setHeader("Retry-After", Math.ceil((rec.resetAt - now) / 1000));
      return res.status(429).json({
        success: false,
        error: "Trop de requêtes. Réessayez dans quelques instants.",
      });
    }

    rec.count++;
    next();
  };
}

// ─── Security headers ─────────────────────────────────────────────────────────

export function securityHeaders() {
  return (_req: any, res: any, next: any) => {
    // Prevent MIME-type sniffing
    res.setHeader("X-Content-Type-Options", "nosniff");
    // Block clickjacking
    res.setHeader("X-Frame-Options", "DENY");
    // Force HTTPS (1 year)
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
    // Control referrer info
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    // Restrict browser features
    res.setHeader(
      "Permissions-Policy",
      "geolocation=(), microphone=(), camera=(), payment=()",
    );
    // Remove fingerprinting header
    res.removeHeader("X-Powered-By");
    next();
  };
}

// ─── Input sanitiser ──────────────────────────────────────────────────────────

/**
 * Strips null bytes and trims excessively long strings from req.body.
 * Runs before route handlers as a lightweight first-pass defence.
 */
export function sanitiseBody() {
  return (req: any, _res: any, next: any) => {
    if (req.body && typeof req.body === "object") {
      req.body = deepSanitise(req.body);
    }
    next();
  };
}

function deepSanitise(obj: any): any {
  if (Array.isArray(obj)) return obj.map(deepSanitise);
  if (obj !== null && typeof obj === "object") {
    const clean: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      clean[key] = deepSanitise(obj[key]);
    }
    return clean;
  }
  if (typeof obj === "string") {
    // Remove null bytes (common SQL/NoSQL injection prefix)
    return obj.replace(/\0/g, "").slice(0, 100_000);
  }
  return obj;
}

// ─── Allowed status values ────────────────────────────────────────────────────

export const ORDER_STATUSES = ["en attente", "en cours", "livré", "annulé"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function isValidOrderStatus(s: unknown): s is OrderStatus {
  return typeof s === "string" && ORDER_STATUSES.includes(s as OrderStatus);
}
