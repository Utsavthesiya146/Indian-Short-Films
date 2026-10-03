'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Film, Search, PlusCircle, Shield, Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { supabase, signOutUser } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOutUser();
      setUser(null);
    } catch {
      // Fail silently
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-cinema-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex flex-col items-start gap-0.5 group">
              <div className="flex items-center gap-1">
                <span className="font-sans font-black text-xl text-white tracking-tight relative">
                  i<span className="relative inline-block">n<span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#f84464]"></span></span>d<span className="relative inline-block">i<span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#f84464]"></span></span>an
                </span>
                <div className="-rotate-2 inline-block mx-1">
                  <svg viewBox="0 0 94 36" className="h-6 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="ticketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f84464" />
                        <stop offset="60%" stopColor="#dc2626" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                    <path d="M 6 0 L 39 0 A 6 6 0 0 1 55 0 L 88 0 C 91.3 0 94 2.7 94 6 L 94 30 C 94 33.3 89.3 36 88 36 L 55 36 A 6 6 0 0 1 39 36 L 6 36 C 2.7 36 0 33.3 0 30 L 0 6 C 0 2.7 2.7 0 6 0 Z" fill="url(#ticketGradient)" />
                    <text x="11" y="24" fill="#ffffff" className="font-sans font-black text-[16.5px] tracking-[-0.6px]">short</text>
                    <g transform="translate(64, 10)">
                      <circle cx="8" cy="8" r="7.5" fill="#ffffff" />
                      <polygon points="6.5,5 11.5,8 6.5,11" fill="#dc2626" />
                    </g>
                  </svg>
                </div>
                <span className="font-sans font-black text-xl text-white tracking-tight relative">
                  mov<span className="relative inline-block">i<span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#f84464]"></span></span>e
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-3 h-[1px] bg-cinema-accent/60"></span>
                <span className="text-[8px] font-bold tracking-[0.2em] text-cinema-muted uppercase">
                  India&apos;s Stories on Screen
                </span>
                <span className="w-3 h-[1px] bg-cinema-accent/60"></span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-white hover:text-cinema-accent transition-colors">
                Home
              </Link>
              <Link href="/discover" className="text-sm font-medium text-cinema-muted hover:text-white transition-colors">
                Discover
              </Link>
              <Link href="/watchlist" className="text-sm font-medium text-cinema-muted hover:text-white transition-colors">
                Watchlist
              </Link>
              <Link href="/filmmakers" className="text-sm font-medium text-cinema-muted hover:text-white transition-colors">
                Filmmakers
              </Link>
            </nav>
          </div>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Search Button */}
            <Link
              href="/discover"
              className="p-2.5 rounded-xl text-cinema-muted hover:text-white hover:bg-cinema-surface transition-all flex items-center gap-2 border border-transparent hover:border-cinema-border"
            >
              <Search className="w-5 h-5" />
              <span className="text-xs text-cinema-muted hidden lg:inline">Search films...</span>
            </Link>

            {/* Submit Film CTA */}
            <Link
              href="/submit"
              className="px-4 py-2 rounded-xl bg-cinema-surface hover:bg-cinema-card border border-cinema-border text-xs font-semibold text-white flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4 text-cinema-gold" />
              Submit Film
            </Link>



            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-cinema-muted font-medium flex items-center gap-1 bg-cinema-surface px-3 py-1.5 rounded-xl border border-cinema-border">
                  <User className="w-3.5 h-3.5 text-cinema-gold" />
                  {user.email?.split('@')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl bg-cinema-accent hover:bg-cinema-accentHover text-white text-xs font-bold shadow-md shadow-cinema-accent/20 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/discover" className="p-2 text-cinema-muted hover:text-white">
              <Search className="w-6 h-6" />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-cinema-muted hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-cinema-border px-4 pt-4 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-cinema-card"
          >
            Home
          </Link>
          <Link
            href="/discover"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-cinema-muted hover:text-white hover:bg-cinema-card"
          >
            Discover
          </Link>
          <Link
            href="/watchlist"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-cinema-muted hover:text-white hover:bg-cinema-card"
          >
            Watchlist
          </Link>
          <Link
            href="/submit"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-cinema-gold hover:bg-cinema-card"
          >
            Submit Film
          </Link>

          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-center px-4 py-2.5 rounded-xl bg-rose-500/20 text-rose-400 font-bold text-sm"
            >
              Sign Out ({user.email?.split('@')[0]})
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-2.5 rounded-xl bg-cinema-accent text-white font-bold text-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
