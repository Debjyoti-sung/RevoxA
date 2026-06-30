import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/src/lib/api/proxy';
import { z } from 'zod';

const insightsGenerateSchema = z.object({
  content: z.string().min(5, 'Content must be at least 5 characters to analyze'),
});

export async function POST(req: NextRequest) {
  return proxyToBackend(req, '/api/reasoning/analyze', {
    schema: insightsGenerateSchema,
    requireAuth: true,
  });
}
