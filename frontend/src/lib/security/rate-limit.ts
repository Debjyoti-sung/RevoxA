import { NextRequest } from 'next/server';

interface RateLimitRule {
  limit: number;
  windowMs: number;
}

const rates = new Map<string, { count: number; resetTime: number }>();

// Simple in-memory rate-limiter
export function isRateLimited(req: NextRequest, rule: RateLimitRule): boolean {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
  const path = req.nextUrl.pathname;
  const key = `${ip}:${path}`;
  const now = Date.now();

  const record = rates.get(key);

  if (!record || now > record.resetTime) {
    rates.set(key, {
      count: 1,
      resetTime: now + rule.windowMs,
    });
    return false;
  }

  record.count += 1;
  rates.set(key, record);

  return record.count > rule.limit;
}

// Clean up stale rate-limiting entries every 5 minutes to prevent memory leaks
if (typeof global !== 'undefined') {
  const intervalKey = '_rateLimitCleanupInterval';
  if (!(global as any)[intervalKey]) {
    (global as any)[intervalKey] = setInterval(() => {
      const now = Date.now();
      rates.forEach((val, key) => {
        if (now > val.resetTime) {
          rates.delete(key);
        }
      });
    }, 300000);
  }
}
