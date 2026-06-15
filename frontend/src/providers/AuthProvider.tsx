"use client";

import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AuthContext } from '../contexts/AuthContext';

// Helper to set cookie for Next.js server-side middleware verification
const setSessionCookie = (session: Session | null) => {
  if (typeof document === 'undefined') return;

  if (session) {
    const expires = new Date(session.expires_at ? session.expires_at * 1000 : Date.now() + 7 * 24 * 3600 * 1000).toUTCString();
    document.cookie = `sb-access-token=${session.access_token}; path=/; expires=${expires}; SameSite=Lax; Secure`;
  } else {
    document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Check active session on initial load
    const initializeAuth = async () => {
      try {
        const { data: { session: activeSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching initial session:', error.message);
        }

        if (activeSession) {
          setSession(activeSession);
          setUser(activeSession.user);
          setSessionCookie(activeSession);
        } else {
          setSession(null);
          setUser(null);
          setSessionCookie(null);
        }
      } catch (err) {
        console.error('Fatal auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 2. Setup real-time listener for Auth updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setSessionCookie(currentSession);
        setLoading(false);

        if (event === 'SIGNED_IN') {
          console.log('User signed in successfully.');
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out successfully.');
          // Redirect to login on sign out
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('User access token refreshed.');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Google OAuth sign-in handler
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const redirectUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/auth/callback`
        : 'http://localhost:3000/auth/callback';

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Google Sign-In Error:', error.message);
      setLoading(false);
      return { error };
    }
  };

  // Secure Sign out handler
  const logout = async () => {
    try {
      setLoading(true);
      
      // Clear all state cookies before calling Supabase signOut
      setSessionCookie(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clean local storage items
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token');
      }

      setUser(null);
      setSession(null);
      return { error: null };
    } catch (error: any) {
      console.error('Sign-Out Error:', error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const authenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        authenticated,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
