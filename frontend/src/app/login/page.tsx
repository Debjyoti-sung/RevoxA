"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Sparkles, Mail, Lock, ShieldCheck, ArrowRight, UserPlus, Info, AlertTriangle, RefreshCw } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, signInWithGoogle, authenticated, loading: authLoading } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [activeTimelineStep, setActiveTimelineStep] = useState(0);

  // Drag-and-drop state for buttons (resets to default on page navigation since not persisted)
  const [btnPos, setBtnPos] = useState({ submit: { x: 0, y: 0 }, google: { x: 0, y: 0 } });
  const [dragging, setDragging] = useState<null | 'submit' | 'google'>(null);
  // Tracks: where the mouse was + what the button position was when drag started
  const dragStart = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });

  // On mousedown: snapshot current mouse + current button offset
  const handleBtnMouseDown = (e: React.MouseEvent<HTMLButtonElement>, btn: 'submit' | 'google') => {
    e.preventDefault();
    setDragging(btn);
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: btnPos[btn].x,
      posY: btnPos[btn].y,
    };
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      // New position = where the button was + how far the mouse has moved
      setBtnPos((prev) => ({
        ...prev,
        [dragging]: {
          x: dragStart.current.posX + (e.clientX - dragStart.current.mouseX),
          y: dragStart.current.posY + (e.clientY - dragStart.current.mouseY),
        },
      }));
    };
    const onMouseUp = () => setDragging(null);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workspace, setWorkspace] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. If already authenticated, redirect to home immediately
  useEffect(() => {
    if (authenticated && !authLoading) {
      router.replace('/dashboard');
    }
  }, [authenticated, authLoading, router]);

  // 2. Handle form-based signup, login, password recovery
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setSuccessMsg("Logged in successfully! Redirecting...");
        setTimeout(() => router.replace('/dashboard'), 1200);
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              workspace_name: workspace || 'Acme Workspace',
              full_name: email.split('@')[0],
            }
          }
        });

        if (error) throw error;

        setSuccessMsg("Account created! Please check your email inbox to verify your account.");
      } else {
        // Recover password
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        if (error) throw error;

        setSuccessMsg("Password reset email sent. Please check your inbox.");
        setTimeout(() => {
          setSuccessMsg('');
          setMode('login');
        }, 5000);
      }
    } catch (err: any) {
      console.error('Auth action error:', err.message);
      setErrorMsg(err.message || "An authentication error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Google OAuth login flow
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMsg(error.message || "Google Sign-In failed. Please verify configurations.");
      setLoading(false);
    } else {
      setSuccessMsg("Connecting to Google authentication...");
    }
  };

  // Mock sign-in function for local offline development bypass
  const handleMockBypass = () => {
    setSuccessMsg("[DEV BYPASS] Mock log in success. Loading workspace...");

    // Simulate auth token for middleware
    const mockToken = 'mock-sb-token-12345';
    const expires = new Date(Date.now() + 7 * 24 * 3600 * 1000).toUTCString();
    document.cookie = `sb-access-token=${mockToken}; path=/; expires=${expires}; SameSite=Lax; Secure`;

    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1200);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-primaryAccent animate-spin" />
        <p className="text-xs text-secondaryText font-medium animate-pulse">Initializing Auth Gate...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 animate-fade-in font-sans">
      <div className="w-full max-w-4xl bg-cardBg border border-cardBorder rounded-2xl shadow-lg flex overflow-hidden min-h-[550px]">

        {/* LEFT PANE: Authentication Forms */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
          {/* Logo header */}
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="RevoxA Logo"
              className="h-8 w-auto object-contain"
            />
            <span className="font-heading font-extrabold text-sm text-primaryText uppercase tracking-wider">RevoxA</span>
          </div>

          <div className="my-auto py-6 space-y-5">
            <div>
              <h2 className="text-xl font-heading font-extrabold text-primaryText">
                {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create RevoxA Account' : 'Recover Password'}
              </h2>
              <p className="text-[11px] text-secondaryText mt-1">
                {mode === 'login'
                  ? 'Access your product long-term memory intelligence'
                  : mode === 'signup'
                    ? 'Start organizing customer feedbacks trends today'
                    : 'We will send a reset code link to your email'}
              </p>
            </div>

            {/* Error Message Box */}
            {errorMsg && (
              <div className="p-3 bg-danger/5 border border-danger/20 rounded-xl flex items-start gap-2.5 text-xs text-danger animate-fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold">Error Authenticating</span>
                  <p className="text-[10px] text-danger/80 leading-relaxed">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Success Message Box */}
            {successMsg && (
              <div className="p-3 bg-success/5 border border-success/20 rounded-xl flex items-start gap-2.5 text-xs text-success animate-fade-in">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold">Auth Action Status</span>
                  <p className="text-[10px] text-success/80 leading-relaxed">{successMsg}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="relative space-y-3.5 text-xs">
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="font-bold text-secondaryText uppercase block">Workspace Name</label>
                  <input
                    type="text"
                    value={workspace}
                    onChange={(e) => setWorkspace(e.target.value)}
                    placeholder="e.g. Acme Product Team"
                    className="w-full px-3.5 py-2.5 bg-secondaryBg rounded-xl focus:outline-none border border-cardBorder text-primaryText"
                    required
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-secondaryText uppercase block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondaryText" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-secondaryBg rounded-xl focus:outline-none border border-cardBorder text-primaryText"
                    required
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-1">
                  <label className="font-bold text-secondaryText uppercase block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondaryText" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-secondaryBg rounded-xl focus:outline-none border border-cardBorder text-primaryText"
                      required
                    />
                  </div>
                </div>
              )}

              <button onMouseDown={(e) => handleBtnMouseDown(e, 'submit')} style={{ transform: `translate(${btnPos.submit.x}px, ${btnPos.submit.y}px)`, cursor: dragging === 'submit' ? 'grabbing' : 'grab' }}
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-primary hover:opacity-95 text-white rounded-xl font-semibold shadow-sm transition-transform active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Gate...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {mode === 'login' ? 'Sign In to Workspace' : mode === 'signup' ? 'Create Free Workspace' : 'Send Reset Link'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Google Sign In */}
            {mode !== 'forgot' && (
              <div className="relative space-y-3">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-cardBorder"></div>
                  <span className="flex-shrink mx-4 text-secondaryText text-[9px] uppercase font-bold">Or continue with</span>
                  <div className="flex-grow border-t border-cardBorder"></div>
                </div>

                <button onMouseDown={(e) => handleBtnMouseDown(e, 'google')} style={{ transform: `translate(${btnPos.google.x}px, ${btnPos.google.y}px)`, cursor: dragging === 'google' ? 'grabbing' : 'grab' }}
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-2.5 border border-cardBorder hover:bg-secondaryBg rounded-xl font-semibold text-secondaryText hover:text-primaryText flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Google Account</span>
                </button>


              </div>
            )}


          </div>

          {/* Form footer toggle options */}
          <div className="flex justify-between text-[10px] font-semibold text-secondaryText pt-4 border-t border-cardBorder">
            {mode === 'login' ? (
              <>
                <button type="button" onClick={() => setMode('signup')} className="hover:text-primaryAccent">
                  Need an account? Sign Up
                </button>
                <button type="button" onClick={() => setMode('forgot')} className="hover:text-primaryAccent">
                  Forgot Password?
                </button>
              </>
            ) : mode === 'signup' ? (
              <>
                <button type="button" onClick={() => setMode('login')} className="hover:text-primaryAccent">
                  Already have an account? Sign In
                </button>
                <span />
              </>
            ) : (
              <>
                <button type="button" onClick={() => setMode('login')} className="hover:text-primaryAccent">
                  Return to Sign In
                </button>
                <span />
              </>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Branding Illustration */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-primary relative p-8 text-white flex-col justify-between">
          <div className="absolute inset-0 bg-black/10 z-0" />

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
                RevoxA Platform
              </span>
              <h1 className="text-3xl font-heading font-extrabold mt-4 leading-tight">
                Enterprise Memory Intelligence.
              </h1>
              <p className="text-xs text-white/80 mt-2 max-w-sm">
                A permanent feedback brain. Synthesize customer reviews, generate roadmap recommendations, and resolve bugs.
              </p>
            </div>

            {/* Illustration placement */}
            <div className="my-8 relative w-full h-44 rounded-xl border border-white/20 bg-white/10 overflow-hidden shadow-md flex items-center justify-center">
              <img
                src="/logo.png"
                alt="RevoxA Logo"
                className="max-h-[120px] w-auto object-contain drop-shadow-lg"
              />
            </div>


          </div>
        </div>

      </div>
    </div>
  );
}
