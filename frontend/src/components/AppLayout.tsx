"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import AuthProvider from '../providers/AuthProvider';
import ProtectedRoute from '../components/ProtectedRoute';
import Sidebar from './Sidebar';
import Header from './Header';
import Copilot from './Copilot';
import MemoryDebugPanel from './debug/MemoryDebugPanel';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  // Pages that do not require layout structure or protection (e.g. Landing Page, Login, Auth Callback)
  const isPublicPage = pathname === '/' || pathname === '/login' || pathname?.startsWith('/auth/');

  return (
    <AuthProvider>
      {isPublicPage ? (
        // Raw page layout for public pages (Landing Page, Login, OAuth Callback, etc)
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

          {/* Floating UI controls stacked bottom-right */}
          <div className="fixed bottom-6 right-6 flex flex-col gap-4 items-end z-50 pointer-events-none">
            <div className="pointer-events-auto">
              <MemoryDebugPanel />
            </div>
            <div className="pointer-events-auto">
              <Copilot />
            </div>
          </div>
        </ProtectedRoute>
      )}
    </AuthProvider>
  );
};

export default AppLayout;
