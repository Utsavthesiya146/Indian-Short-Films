'use client';

import React from 'react';
import Link from 'next/link';
import { Film, Heart, Shield, Clapperboard } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-cinema-surface border-t border-cinema-border mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-sans font-black text-lg text-white tracking-tight">
                INDIAN SHORT MOVIE
              </span>
            </div>
            <p className="text-xs text-cinema-muted leading-relaxed">
              Dedicated platform celebrating independent storytelling, short cinema, and visionary filmmakers across all Indian languages.
            </p>
            <div className="text-[11px] text-cinema-muted bg-cinema-card px-3 py-1.5 rounded-lg border border-cinema-border inline-block">
              Demo Content — Educational & Showcase Release
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Discover</h4>
            <ul className="space-y-2 text-xs text-cinema-muted">
              <li><Link href="/discover?sort=trending" className="hover:text-cinema-accent transition-colors">Trending Now</Link></li>
              <li><Link href="/discover?sort=rating" className="hover:text-cinema-accent transition-colors">Top Rated</Link></li>
              <li><Link href="/discover?language=hi" className="hover:text-cinema-accent transition-colors">Hindi Short Films</Link></li>
              <li><Link href="/discover?language=gu" className="hover:text-cinema-accent transition-colors">Gujarati Short Films</Link></li>
              <li><Link href="/discover?language=ta" className="hover:text-cinema-accent transition-colors">Tamil Short Films</Link></li>
            </ul>
          </div>

          {/* Filmmakers */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Filmmakers</h4>
            <ul className="space-y-2 text-xs text-cinema-muted">
              <li><Link href="/submit" className="hover:text-cinema-gold transition-colors flex items-center gap-1"><Clapperboard className="w-3.5 h-3.5 text-cinema-gold" /> Submit Your Film</Link></li>
              <li><Link href="/filmmakers" className="hover:text-white transition-colors">Filmmaker Directory</Link></li>
            </ul>
          </div>

          {/* Legal & System */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-xs text-cinema-muted">
              <li><Link href="/admin" className="hover:text-cinema-accent transition-colors flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-cinema-accent" /> Admin Portal</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-cinema-border/50 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-cinema-muted gap-4">
          <p>© {new Date().getFullYear()} Indian Short Movie. All rights reserved.</p>
          <p className="flex items-center gap-1">
            With love ❤️ <a href="https://webhostingbaba.com" target="_blank" rel="noopener noreferrer" className="text-red-500 font-bold hover:underline">HOSTING BABA</a>
          </p>
        </div>
      </div>
    </footer>
  );
};
