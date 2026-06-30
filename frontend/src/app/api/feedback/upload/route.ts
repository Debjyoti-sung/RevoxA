import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/src/lib/api/proxy';
import { z } from 'zod';

const feedbackUploadSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(5, 'Content must be at least 5 characters'),
  source_type: z.string().min(1, 'Source type is required'),
  customer_name: z.string().min(1, 'Customer name is required'),
  customer_email: z.string().email('Invalid customer email address'),
});

export async function POST(req: NextRequest) {
  return proxyToBackend(req, '/api/feedbacks', {
    schema: feedbackUploadSchema,
    requireAuth: true,
  });
}
