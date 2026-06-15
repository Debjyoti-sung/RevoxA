"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Exchange code for session or wait for Supabase to parse URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data?.session) {
          // Sync cookies for middleware immediately
          const expires = new Date(data.session.expires_at ? data.session.expires_at * 1000 : Date.now() + 7 * 24 * 3600 * 1000).toUTCString();
          document.cookie = `sb-access-token=${data.session.access_token}; path=/; expires=${expires}; SameSite=Lax; Secure`;
          
          console.log('Session synchronized, redirecting to Dashboard...');
          router.replace('/');
        } else {
          // If no session found yet, wait briefly to allow hash parsing
          setTimeout(async () => {
            const { data: retryData } = await supabase.auth.getSession();
            if (retryData?.session) {
              router.replace('/');
            } else {
              setErrorMsg('No valid active session detected. Re-authenticating...');
              setTimeout(() => router.replace('/login'), 2000);
            }
          }, 1500);
        }
      } catch (err: any) {
        console.error('Callback error:', err.message || err);
        setErrorMsg(err.message || 'Authentication exchange failed.');
        setTimeout(() => router.replace('/login'), 3000);
      }
    };

    checkSession();
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-4">
      {errorMsg ? (
        <>
          <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center text-danger animate-bounce">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2 text-center">
            <h3 className="font-heading font-bold text-sm text-primaryText">Authentication Failed</h3>
            <p className="text-xs text-secondaryText max-w-xs">{errorMsg}</p>
          </div>
        </>
      ) : (
        <>
          <div className="w-12 h-12 rounded-xl bg-primaryAccent/10 flex items-center justify-center text-primaryAccent">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-2 text-center font-sans">
            <h3 className="font-heading font-bold text-sm text-primaryText">Syncing Context Session</h3>
            <p className="text-[10px] text-secondaryText">Synchronizing security keys and loading database caches...</p>
          </div>
        </>
      )}
    </div>
  );
}
