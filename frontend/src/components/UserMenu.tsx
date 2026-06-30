"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogOut, User as UserIcon, Settings, Shield, ChevronDown } from 'lucide-react';

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  if (!user) return null;

  // Retrieve user metadata details
  const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const email = user.email || '';
  const avatarUrl = user.user_metadata?.avatar_url || '';
  const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-xl hover:bg-secondaryBg transition-all outline-none"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-primary p-[1.5px] transition-transform hover:scale-105">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full rounded-[10px] object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-[10px] bg-cardBg flex items-center justify-center font-heading font-bold text-sm text-primaryAccent">
              {initials}
            </div>
          )}
        </div>
        <div className="hidden lg:flex flex-col items-start text-left">
          <span className="text-xs font-bold text-primaryText leading-none mb-0.5">{name}</span>
          <span className="text-[9px] text-secondaryText truncate max-w-[100px]">{email}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-secondaryText transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-60 bg-cardBg border border-cardBorder rounded-2xl shadow-xl z-50 p-2 animate-fade-in origin-top-right">
          {/* Header context */}
          <div className="px-3 py-2.5 border-b border-cardBorder mb-2">
            <p className="font-heading font-bold text-xs text-primaryText truncate">{name}</p>
            <p className="text-[10px] text-secondaryText truncate mt-0.5">{email}</p>
          </div>

          {/* Action links */}
          <div className="space-y-0.5">
            <button
              onClick={() => {
                setIsOpen(false);
                window.location.href = '/settings';
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-secondaryBg rounded-xl text-xs text-secondaryText hover:text-primaryText transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Workspace Settings</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                window.location.href = '/workspace';
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-secondaryBg rounded-xl text-xs text-secondaryText hover:text-primaryText transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Security Audits</span>
            </button>
          </div>

          <div className="border-t border-cardBorder my-1.5" />

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-danger/5 rounded-xl text-xs text-danger transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Securely</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
