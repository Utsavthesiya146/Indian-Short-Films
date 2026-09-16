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
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-cinema-accent flex items-center justify-center shadow-lg shadow-cinema-accent/30 group-hover:scale-105 transition-transform">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-xl tracking-tight text-white group-hover:text-cinema-accent transition-colors">
                  INDIAN SHORT FILMS
                </span>
                <span className="text-[10px] text-cinema-muted font-medium tracking-wider uppercase">
                  Discover India. Watch Stories.
                </span>
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

            {/* Admin Dashboard Entry Link */}
            <Link
              href="/admin"
              className="px-3 py-2 rounded-xl bg-cinema-card/80 hover:bg-cinema-accent/20 border border-cinema-border text-xs font-medium text-cinema-muted hover:text-cinema-accent flex items-center gap-1.5 transition-all"
            >
              <Shield className="w-4 h-4 text-cinema-accent" />
              Admin
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
          <Link
            href="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-cinema-accent hover:bg-cinema-card"
          >
            Admin Dashboard
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
