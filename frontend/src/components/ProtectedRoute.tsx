"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If auth state is fully loaded and user is not authenticated, redirect to login page
    if (!loading && !authenticated) {
      router.replace('/login');
    }
  }, [authenticated, loading, router]);

  // Loading indicator / Skeleton loader
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-4">
        {/* Loading Spinner */}
        <div className="w-10 h-10 border-4 border-primaryAccent/30 border-t-primaryAccent rounded-full animate-spin"></div>
        <div className="space-y-2 text-center">
          <h3 className="font-heading font-bold text-sm text-primaryText animate-pulse">Restoring Memory Session</h3>
          <p className="text-[10px] text-secondaryText">Verifying credentials and loading intelligence vectors...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render children
  if (authenticated) {
    return <>{children}</>;
  }

  // Fallback while redirecting
  return null;
};

export default ProtectedRoute;
