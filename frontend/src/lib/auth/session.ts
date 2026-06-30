import { NextRequest } from 'next/server';
import { verifySessionToken } from '@/src/server/auth';
import { UserRole } from './roles';

export interface UserSession {
  id: string;
  email: string;
  role: UserRole;
}

export async function getSession(req: NextRequest): Promise<UserSession | null> {
  // Try to retrieve token from cookie or Authorization header
  let token = req.cookies.get('sb-access-token')?.value || '';

  if (!token) {
    const authHeader = req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    // If running in development, bypass auth and return a mock session.
    const bypassAuth = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENV === 'development';
    if (bypassAuth) {
      return {
        id: 'mock-user-id',
        email: 'dev-admin@memora.ai',
        role: 'owner',
      };
    }
    return null;
  }

  const session = await verifySessionToken(token);
  if (session) {
    return {
      id: session.id,
      email: session.email,
      role: session.role as UserRole,
    };
  }

  return null;
}
