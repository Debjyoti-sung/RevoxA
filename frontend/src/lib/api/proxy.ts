import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/src/config/env';
import { getSession } from '@/src/lib/auth/session';
import { isRateLimited } from '@/src/lib/security/rate-limit';
import { ApiError } from '@/src/lib/errors/api-error';
import { handleApiError } from '@/src/lib/errors/error-handler';
import { z } from 'zod';

interface ProxyOptions {
  schema?: z.ZodSchema;
  requireAuth?: boolean;
  rateLimit?: { limit: number; windowMs: number };
}

export async function proxyToBackend(
  req: NextRequest,
  targetPath: string,
  options: ProxyOptions = {}
) {
  try {
    // 1. Rate Limiting Check
    const limitRule = options.rateLimit || { limit: 100, windowMs: 60000 }; // 100 req/min default
    if (isRateLimited(req, limitRule)) {
      throw ApiError.tooManyRequests();
    }

    // 2. Auth Session Check (skip in development mode)
    const isDev = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENV === 'development';
    const requireAuth = options.requireAuth !== false && !isDev;
    const session = await getSession(req);
    if (requireAuth && !session) {
      throw ApiError.unauthorized();
    }

    // 3. Request Body Zod Validation
    let body: any = null;
    if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'PUT') {
      try {
        body = await req.json();
      } catch (e) {
        // Body is optional or empty
      }

      if (options.schema) {
        body = options.schema.parse(body);
      }
    }

    // 4. Forward Request to Python Backend
    const backendBaseUrl = env.BACKEND_URL || 'http://127.0.0.1:8000';
    const targetUrl = `${backendBaseUrl}${targetPath}`;
    
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    if (session) {
      headers.set('X-User-Id', session.id);
      headers.set('X-User-Email', session.email);
      headers.set('X-User-Role', session.role);
    }

    // Include original queries if any
    const searchParams = req.nextUrl.searchParams.toString();
    const finalUrl = searchParams ? `${targetUrl}?${searchParams}` : targetUrl;

    const backendRes = await fetch(finalUrl, {
      method: req.method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      return NextResponse.json(
        { success: false, error: errorText || 'Backend service error' },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}
