"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useStore } from '../store/useStore';
import { Bell, Sparkles, User, LogOut, Check, RefreshCw } from 'lucide-react';
import UserMenu from './UserMenu';

export default function Header() {
  const pathname = usePathname();
  const { notifications, dashboardStats, simulateFeedbackIngestion, workspaceMembers } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const getBreadcrumbs = () => {
    if (!pathname || pathname === '/') return ['Dashboard', 'Overview'];
    const parts = pathname.split('/').filter(Boolean);
    return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).replace('-', ' '));
  };

  const breadcrumbs = getBreadcrumbs();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-cardBg border-b border-cardBorder px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-secondaryText font-medium">REVOXA</span>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={crumb}>
            <span className="text-secondaryText/40">/</span>
            <span className={idx === breadcrumbs.length - 1 ? "text-primaryText font-bold" : "text-secondaryText font-medium"}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-4">
        {/* Real-time Ingestion Simulator Button */}
        <button
          onClick={simulateFeedbackIngestion}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-primary hover:opacity-90 text-white rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
          title="Inject random mock feedback item in real-time"
        >
          <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
          <span>Simulate Ingestion</span>
        </button>

        {/* Notifications Icon & Popover */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-xl bg-secondaryBg hover:bg-cardBorder flex items-center justify-center text-primaryText transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger rounded-full text-white text-[10px] flex items-center justify-center font-bold animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-cardBg border border-cardBorder rounded-xl shadow-lg p-4 z-30 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-cardBorder mb-3">
                <h3 className="font-heading font-bold text-sm text-primaryText">Notifications</h3>
                <span className="text-[10px] font-semibold text-primaryAccent px-2 py-0.5 bg-primaryAccent/10 rounded-full">
                  {unreadCount} Unread
                </span>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-3">
                {notifications.length === 0 ? (
                  <p className="text-xs text-secondaryText text-center py-4">No notifications</p>
                ) : (
                  notifications.map((not: any) => (
                    <div 
                      key={not.id} 
                      className={`p-2.5 rounded-lg text-xs transition-colors ${
                        not.read ? 'bg-transparent' : 'bg-primaryAccent/5 border-l-2 border-primaryAccent'
                      }`}
                    >
                      <div className="flex justify-between font-semibold text-primaryText mb-1">
                        <span>{not.title}</span>
                        <span className="text-[10px] text-secondaryText font-normal">{not.time || 'Just now'}</span>
                      </div>
                      <p className="text-secondaryText leading-relaxed">{not.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic User Menu Dropdown */}
        <UserMenu />
      </div>
    </header>
  );
}
