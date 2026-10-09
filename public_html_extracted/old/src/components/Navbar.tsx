import React, { useState } from 'react';
import { 
  Film, 
  Search, 
  PlusCircle, 
  Menu, 
  X, 
  LogIn, 
  LogOut, 
  Shield, 
  User as UserIcon, 
  LayoutDashboard,
  FileCheck,
  ShieldAlert,
  Award
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenSubmitFilm: () => void;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
  onSearch?: (query: string) => void;
}

/**
 * Premium Cinematic 'INDIAN SHORT MOVIE' Logo Component
 * 100% Transparent Background - Keep existing logo unchanged
 */
export const IndianShortMovieLogo: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
  return (
    <div className="group flex flex-col items-start select-none bg-transparent">
      {/* Top Wordmark & Cinema Ticket Row */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* 'indian' wordmark with vibrant red dot accents on 'i's */}
        <span className={`font-sans font-black tracking-tight text-white flex items-center leading-none ${
          isMobile ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'
        }`}>
          <span className="relative inline-block">
            <span>i</span>
            <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-[#f84464] shadow-[0_0_8px_#f84464]" />
          </span>
          <span>nd</span>
          <span className="relative inline-block">
            <span>i</span>
            <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-[#f84464] shadow-[0_0_8px_#f84464]" />
          </span>
          <span>an</span>
        </span>

        {/* Cinema Ticket Badge: 'short' with play icon */}
        <div className="relative inline-flex items-center justify-center -rotate-2 transition-transform duration-200 group-hover:rotate-0 group-hover:scale-105">
          <svg 
            viewBox="0 0 94 36" 
            className={`w-auto drop-shadow-md ${
              isMobile ? 'h-5 sm:h-5.5' : 'h-6 sm:h-6.5'
            }`}
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="navTicketGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f84464" />
                <stop offset="60%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>

            {/* Ticket body with semicircular notches */}
            <path 
              d="M 6 0
                 L 39 0 
                 A 6 6 0 0 1 55 0 
                 L 88 0 
                 C 91.3 0 94 2.7 94 6 
                 L 94 30 
                 C 94 33.3 89.3 36 88 36 
                 L 55 36 
                 A 6 6 0 0 1 39 36 
                 L 6 36 
                 C 2.7 36 0 33.3 0 30 
                 L 0 6 
                 C 0 2.7 2.7 0 6 0 Z" 
              fill="url(#navTicketGradientDark)" 
            />

            {/* 'short' in bold white font */}
            <text 
              x="11" 
              y="24" 
              fill="#ffffff" 
              fontFamily="system-ui, -apple-system, sans-serif" 
              fontWeight="900" 
              fontSize="16.5" 
              letterSpacing="-0.6px"
            >
              short
            </text>

            {/* Play Button */}
            <g transform="translate(64, 10)">
              <circle cx="8" cy="8" r="7.5" fill="#ffffff" />
              <polygon points="6.5,5 11.5,8 6.5,11" fill="#dc2626" />
            </g>
          </svg>
        </div>

        {/* 'movie' wordmark with red dot accent */}
        <span className={`font-sans font-black tracking-tight text-white flex items-center leading-none ${
          isMobile ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'
        }`}>
          <span>m</span>
          <span>o</span>
          <span>v</span>
          <span className="relative inline-block">
            <span>i</span>
            <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-[#f84464] shadow-[0_0_8px_#f84464]" />
          </span>
          <span>e</span>
        </span>
      </div>

      {/* Tagline */}
      <div className="flex items-center gap-1.5 mt-0.5 opacity-80">
        <span className="h-px w-3 bg-[#e50914]/60" />
        <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] text-gray-400 uppercase whitespace-nowrap">
          India's Stories on Screen
        </span>
        <span className="h-px w-3 bg-[#e50914]/60" />
      </div>
    </div>
  );
};

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenSubmitFilm,
  mobileMenuOpen = false,
  setMobileMenuOpen,
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Exact reference navbar tabs
  const navTabs = [
    { id: 'home', label: 'Home' },
    { id: 'films', label: 'Discover' },
    { id: 'watchlist', label: 'Watchlist' },
    { id: 'filmmakers', label: 'Filmmakers' }
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    if (setMobileMenuOpen) setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
    setCurrentTab('films');
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-cinema-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Brand Logo & Navigation matching reference */}
          <div className="flex items-center gap-8">
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 group text-left focus:outline-none cursor-pointer"
            >
              <IndianShortMovieLogo isMobile={false} />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              {navTabs.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-sm font-medium transition-colors cursor-pointer ${
                      isActive 
                        ? 'text-white font-bold' 
                        : 'text-cinema-muted hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Controls matching reference */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (onSearch) onSearch(e.target.value);
                }}
                placeholder="Search films..."
                className="w-40 lg:w-48 pl-8 pr-3 py-2 rounded-xl bg-cinema-surface border border-cinema-border text-xs text-white placeholder-cinema-muted focus:outline-none focus:border-cinema-accent focus:w-56 transition-all"
              />
              <Search className="w-4 h-4 text-cinema-muted absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>

            {/* Submit Film Button matching reference */}
            <button
              onClick={onOpenSubmitFilm}
              className="px-4 py-2 rounded-xl bg-cinema-surface hover:bg-cinema-card border border-cinema-border text-xs font-semibold text-white flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-cinema-gold" />
              <span>Submit Film</span>
            </button>

            {/* Admin Badge button */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                currentTab === 'admin'
                  ? 'bg-cinema-card border-cinema-border text-cinema-accent shadow-sm'
                  : 'bg-cinema-card/80 hover:bg-cinema-accent/20 border-cinema-border text-cinema-muted hover:text-cinema-accent'
              }`}
            >
              <Shield className="w-4 h-4 text-cinema-accent" />
              <span>Admin</span>
            </button>

            {/* Sign In / User Profile */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-cinema-surface transition-colors cursor-pointer"
                >
                  <img
                    src={currentUser.avatar || '/harri-kumar.jpg'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-lg object-cover border border-cinema-border"
                  />
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-cinema-card border border-cinema-border rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-3 py-2 border-b border-cinema-border/50 text-xs">
                      <p className="font-bold text-white">{currentUser.name}</p>
                      <p className="text-[10px] text-cinema-muted truncate">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleNavClick('filmmakers');
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-cinema-muted hover:text-white hover:bg-cinema-surface flex items-center gap-2 cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4" />
                      Filmmaker Directory
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-cinema-surface flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl bg-cinema-accent hover:bg-cinema-accentHover text-white text-xs font-bold shadow-md shadow-cinema-accent/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenSubmitFilm}
              className="p-2 rounded-lg bg-cinema-surface border border-cinema-border text-cinema-gold"
              aria-label="Submit Film"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
            {setMobileMenuOpen && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-cinema-muted hover:text-white rounded-lg hover:bg-cinema-surface"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cinema-surface border-b border-cinema-border p-4 space-y-3">
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                currentTab === 'home' ? 'bg-cinema-accent text-white' : 'text-cinema-muted hover:text-white hover:bg-cinema-card'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button
              onClick={() => handleNavClick('films')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                currentTab === 'films' ? 'bg-cinema-accent text-white' : 'text-cinema-muted hover:text-white hover:bg-cinema-card'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Discover</span>
            </button>
            <button
              onClick={() => handleNavClick('watchlist')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                currentTab === 'watchlist' ? 'bg-cinema-accent text-white' : 'text-cinema-muted hover:text-white hover:bg-cinema-card'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Watchlist</span>
            </button>
            <button
              onClick={() => handleNavClick('filmmakers')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                currentTab === 'filmmakers' ? 'bg-cinema-accent text-white' : 'text-cinema-muted hover:text-white hover:bg-cinema-card'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Filmmakers</span>
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                currentTab === 'admin' ? 'bg-cinema-accent text-white' : 'text-cinema-muted hover:text-white hover:bg-cinema-card'
              }`}
            >
              <Shield className="w-4 h-4 text-cinema-accent" />
              <span>Admin Portal</span>
            </button>
          </div>

          <div className="pt-3 border-t border-cinema-border/50 flex flex-col gap-2">
            <button
              onClick={() => {
                if (setMobileMenuOpen) setMobileMenuOpen(false);
                onOpenSubmitFilm();
              }}
              className="w-full py-2.5 rounded-xl bg-cinema-card border border-cinema-border text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-cinema-gold" />
              <span>Submit Film</span>
            </button>
            {currentUser ? (
              <button
                onClick={() => {
                  if (setMobileMenuOpen) setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full py-2.5 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({currentUser.name})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (setMobileMenuOpen) setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 rounded-xl bg-cinema-accent text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
