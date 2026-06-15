"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import AuthProvider from '../providers/AuthProvider';
import ProtectedRoute from '../components/ProtectedRoute';
import Sidebar from './Sidebar';
import Header from './Header';
import Copilot from './Copilot';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  // Pages that do not require layout structure or protection
  const isAuthPage = pathname === '/login' || pathname?.startsWith('/auth/');

  return (
    <AuthProvider>
      {isAuthPage ? (
        // Raw page layout for Auth pages (Login, OAuth Callback, etc)
        <main className="min-h-screen">
          {children}
        </main>
      ) : (
        // Full protected workspace layout
        <ProtectedRoute>
          <div className="flex min-h-screen">
            {/* Side Navigation Sidebar */}
            <Sidebar />

            {/* Main Content Pane */}
            <div className="flex-1 pl-64 flex flex-col min-h-screen">
              {/* Header Toolbar */}
              <Header />

              {/* Viewport Render Area */}
              <main className="flex-1 p-8 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>

          {/* Floating Copilot Widget */}
          <Copilot />
        </ProtectedRoute>
      )}
    </AuthProvider>
  );
};

export default AppLayout;
