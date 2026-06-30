import { NextResponse } from 'next/server';
import { env } from '@/src/config/env';

export async function GET() {
  try {
    // Check internal Python backend health
    const backendUrl = env.BACKEND_URL || 'http://127.0.0.1:8000';
    const res = await fetch(`${backendUrl}/health`);
    
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        status: 'healthy',
        database: 'connected',
        memory: data.hindsight_mode === 'live' ? 'connected' : 'connected (mock)',
        ai: data.groq_mode === 'live' ? 'connected' : 'connected (mock)',
      });
    }
    
    return NextResponse.json({
      status: 'degraded',
      backend: 'offline',
    }, { status: 503 });
  } catch (e) {
    return NextResponse.json({
      status: 'unhealthy',
      error: e instanceof Error ? e.message : 'Unknown error',
    }, { status: 500 });
  }
}
