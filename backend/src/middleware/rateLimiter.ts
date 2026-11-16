import { Request, Response, NextFunction } from "express";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

/**
 * Creates an in-memory sliding rate limiter middleware for sensitive endpoints
 * @param windowMs Window duration in milliseconds (e.g. 15 * 60 * 1000 for 15 mins)
 * @param max Max allowed requests within window
 * @param message Custom client error response
 */
export function createRateLimiter(
  windowMs: number,
  max: number,
  message: string = "Too many requests. Please try again later."
) {
  const store = new Map<string, RateLimitRecord>();

  // Cleanup expired entries periodically to prevent memory leaks
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (now > record.resetTime) {
        store.delete(key);
      }
    }
  }, Math.min(windowMs, 60000));

  return (req: Request, res: Response, next: NextFunction) => {
    // Get client IP address
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown-ip";

    const now = Date.now();
    const record = store.get(ip);

    if (!record || now > record.resetTime) {
      store.set(ip, { count: 1, resetTime: now + windowMs });
      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", max - 1);
      return next();
    }

    if (record.count >= max) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader("Retry-After", retryAfterSeconds);
      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", 0);
      return res.status(429).json({
        success: false,
        error: message,
        retryAfter: retryAfterSeconds,
      });
    }

    record.count++;
    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", max - record.count);
    next();
  };
}

// 5 failed/login attempts per 10 minutes per IP
export const authRateLimiter = createRateLimiter(
  10 * 60 * 1000,
  10,
  "Too many authentication attempts from this IP address. Please wait 10 minutes before retrying."
);

// 30 candidate registration submissions per 10 minutes per IP
export const registrationRateLimiter = createRateLimiter(
  10 * 60 * 1000,
  30,
  "Submission rate limit reached for this IP. Please wait a few minutes before submitting another registration."
);
