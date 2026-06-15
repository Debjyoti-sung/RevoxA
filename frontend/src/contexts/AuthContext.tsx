"use client";

import { createContext } from 'react';
import { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  authenticated: boolean;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  logout: () => Promise<{ error: Error | null }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export default AuthContext;
