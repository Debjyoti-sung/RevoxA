import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/src/lib/api/proxy';
import { z } from 'zod';

const memoryStoreSchema = z.object({
  bank_id: z.string().default('default'),
  content: z.string().min(3, 'Memory content must be at least 3 characters'),
});

export async function POST(req: NextRequest) {
  return proxyToBackend(req, '/api/memory/retain', {
    schema: memoryStoreSchema,
    requireAuth: true,
  });
}
