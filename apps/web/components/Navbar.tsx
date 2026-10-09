'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Film, Search, PlusCircle, Shield, Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  const handleLogout = async () => {
    try {
      await signOut();
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
            <Link href="/" className="flex flex-col items-center justify-center gap-0 group">
              <div className="flex items-center">
                {/* "indian" */}
                <span className="font-display font-black text-[28px] text-white tracking-tight flex items-center">
                  <span className="relative inline-block">i<span className="absolute top-[7px] left-1/2 -translate-x-1/2 w-[11px] h-[11px] rounded-full bg-[#FF204E]"></span></span>
                  nd
                  <span className="relative inline-block">i<span className="absolute top-[7px] left-1/2 -translate-x-1/2 w-[11px] h-[11px] rounded-full bg-[#FF204E]"></span></span>
                  an
                </span>
                
                {/* "short" badge */}
                <div className="-rotate-[3deg] inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-[#f84464] via-[#dc2626] to-[#8b5cf6] mx-1.5 shadow-lg">
                  <span className="font-display font-black text-white text-[19px] tracking-tight leading-none mt-0.5">short</span>
                  <div className="w-[18px] h-[18px] rounded-full bg-white flex items-center justify-center shadow-inner">
                    <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-[#dc2626] border-b-[4px] border-b-transparent ml-[2px]"></div>
                  </div>
                </div>

                {/* "movie" */}
                <span className="font-display font-black text-[28px] text-white tracking-tight flex items-center">
                  mov
                  <span className="relative inline-block">i<span className="absolute top-[7px] left-1/2 -translate-x-1/2 w-[11px] h-[11px] rounded-full bg-[#FF204E]"></span></span>
                  e
                </span>
              </div>

              {/* Tagline */}
              <div className="flex items-center gap-2 mt-1 w-full justify-center opacity-80">
                <span className="w-6 h-[1px] bg-[#FF204E]"></span>
                <span className="text-[9px] font-bold tracking-[0.25em] text-gray-400 uppercase">
                  India&apos;s Stories on Screen
                </span>
                <span className="w-6 h-[1px] bg-[#FF204E]"></span>
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
