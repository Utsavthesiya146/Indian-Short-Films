import React from 'react';
import { Film, Clapperboard, Shield, Heart } from 'lucide-react';
import { IndianShortMovieLogo } from './Navbar';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
  onOpenSubmitFilm: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateTab,
  onOpenSubmitFilm
}) => {
  return (
    <footer className="bg-cinema-surface border-t border-cinema-border mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4-Column Grid matching reference */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <IndianShortMovieLogo isMobile={true} />
            </div>
            <p className="text-xs text-cinema-muted leading-relaxed">
              Dedicated platform celebrating independent storytelling, short cinema, and visionary filmmakers across all Indian languages.
            </p>
            <div className="text-[11px] text-cinema-muted bg-cinema-card px-3 py-1.5 rounded-lg border border-cinema-border inline-block">
              Demo Content — Educational &amp; Showcase Release
            </div>
          </div>

          {/* Discover */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Discover</h4>
            <ul className="space-y-2 text-xs text-cinema-muted">
              <li>
                <button 
                  onClick={() => onNavigateTab('films')} 
                  className="hover:text-cinema-accent transition-colors text-left"
                >
                  Trending Now
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateTab('films')} 
                  className="hover:text-cinema-accent transition-colors text-left"
                >
                  Top Rated
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateTab('films')} 
                  className="hover:text-cinema-accent transition-colors text-left"
                >
                  Hindi Short Films
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateTab('films')} 
                  className="hover:text-cinema-accent transition-colors text-left"
                >
                  Gujarati Short Films
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateTab('films')} 
                  className="hover:text-cinema-accent transition-colors text-left"
                >
                  Tamil Short Films
                </button>
              </li>
            </ul>
          </div>

          {/* Filmmakers */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Filmmakers</h4>
            <ul className="space-y-2 text-xs text-cinema-muted">
              <li>
                <button 
                  onClick={onOpenSubmitFilm} 
                  className="hover:text-cinema-gold transition-colors flex items-center gap-1.5 text-left"
                >
                  <Clapperboard className="w-3.5 h-3.5 text-cinema-gold" />
                  <span>Submit Your Film</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateTab('filmmakers')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Filmmaker Directory
                </button>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-xs text-cinema-muted">
              <li>
                <button 
                  onClick={() => onNavigateTab('admin')} 
                  className="hover:text-cinema-accent transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-cinema-accent" />
                  <span>Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Exact Copyright & Hosting Baba Attribution */}
        <div className="border-t border-cinema-border/50 pt-6 flex items-center justify-between text-xs text-cinema-muted">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span>© 2026 Indian Short Films. All rights reserved.</span>
            <span>With love ❤️ <a href="https://webhostingbaba.com" target="_blank" rel="noopener noreferrer" style={{ color: '#FF0000' }} className="font-bold hover:underline transition-opacity hover:opacity-90">HOSTING BABA</a></span>
          </div>
        </div>

      </div>
    </footer>
  );
};
