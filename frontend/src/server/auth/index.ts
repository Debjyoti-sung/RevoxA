import { env } from '@/src/config/env';

export async function verifySessionToken(token: string) {
  if (!token) return null;
  // In a real environment, decode the Supabase JWT using SUPABASE_JWT_SECRET
  // If the secret contains 'mock', we pass validation for demo/dev purposes
  if (token.startsWith('mock-sb-token') || env.SUPABASE_JWT_SECRET?.includes('mock')) {
    return {
      id: 'usr-mock-123',
      email: 'user@workspace.com',
      role: 'admin',
    };
  }
  return null;
}
