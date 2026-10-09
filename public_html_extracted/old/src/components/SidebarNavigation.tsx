import React from 'react';
import { 
  LayoutDashboard, 
  Film, 
  Inbox, 
  ShieldCheck, 
  Bookmark, 
  Users, 
  Smartphone, 
  PlusCircle, 
  Info, 
  Map,
  X,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Mail,
  Clapperboard
} from 'lucide-react';
import { User, ShortFilm } from '../types';

interface SidebarNavigationProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  pendingSubmissionsCount: number;
  savedFilmsCount: number;
  totalFilmsCount: number;
  currentUser: User | null;
  onOpenSubmitFilm: () => void;
  onOpenAuth: () => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  currentTab,
  setCurrentTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  pendingSubmissionsCount,
  savedFilmsCount,
  totalFilmsCount,
  currentUser,
  onOpenSubmitFilm,
  onOpenAuth
}) => {
  const handleSelect = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4 Primary Dashboard Pages
  const primaryNavItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
      description: 'Analytics, Spotlight & Feed'
    },
    {
      id: 'films',
      label: 'Film Management',
      icon: Film,
      badge: totalFilmsCount > 0 ? String(totalFilmsCount) : null,
      description: 'Catalog, filters & streaming'
    },
    {
      id: 'submissions',
      label: 'Submission Queue',
      icon: Inbox,
      badge: pendingSubmissionsCount > 0 ? String(pendingSubmissionsCount) : null,
      badgeAlert: pendingSubmissionsCount > 0,
      description: 'Filmmaker screening & review'
    },
    {
      id: 'moderation',
      label: 'Content Moderation',
      icon: ShieldCheck,
      badge: null,
      description: 'Reels, reviews & accounts'
    }
  ];

  // Secondary Essential Platform Tools
  const secondaryNavItems = [
    {
      id: 'saved',
      label: 'Watchlist & Favorites',
      icon: Bookmark,
      badge: savedFilmsCount > 0 ? String(savedFilmsCount) : null
    },
    {
      id: 'creators',
      label: 'Filmmakers Directory',
      icon: Users,
      badge: null
    },
    {
      id: 'reels',
      label: 'Vertical Cinema Reels',
      icon: Smartphone,
      badge: 'Live'
    },
    {
      id: 'about-harri',
      label: 'About Harri Kumar',
      icon: Info,
      badge: null
    },
    {
      id: 'floorplan',
      label: 'Studio Floor Plan',
      icon: Map,
      badge: null
    },
    {
      id: 'contact',
      label: 'Contact & Inquiries',
      icon: Mail,
      badge: null
    }
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4 bg-[#07070f]/90 backdrop-blur-2xl text-gray-300">
      
      {/* Top Section */}
      <div className="space-y-6">
        
        {/* Mobile Close Button Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 lg:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
            Navigation Menu
          </span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Primary 4 Dashboard Pages */}
        <div className="space-y-1.5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Main Dashboard
          </p>

          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => handleSelect(item.id)}
                className={`group flex w-full items-center justify-between rounded-2xl px-3.5 py-3 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/20 text-white border-l-4 border-purple-500 shadow-md font-bold'
                    : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive ? 'text-purple-400' : 'text-gray-400 group-hover:text-purple-300'
                  }`} />
                  <div className="text-left">
                    <p className="leading-none">{item.label}</p>
                    <p className="text-[10px] text-gray-500 font-normal mt-0.5">{item.description}</p>
                  </div>
                </div>

                {item.badge && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    item.badgeAlert
                      ? 'bg-gradient-to-r from-amber-500 to-red-500 text-white animate-pulse'
                      : 'bg-white/10 text-gray-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Secondary Navigation Tools */}
        <div className="space-y-1 pt-4 border-t border-white/10">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Platform Tools
          </p>

          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => handleSelect(item.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white/10 text-white font-bold'
                    : 'text-gray-400 hover:bg-white/[0.03] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-gray-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] font-semibold text-gray-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* Bottom Submit Action inside Sidebar */}
      <div className="pt-6 border-t border-white/10 space-y-3">
        <button
          onClick={onOpenSubmitFilm}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-4 py-3 text-xs font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>+ Submit Short Film</span>
        </button>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3 text-[11px] text-gray-400 text-center">
          <p className="font-semibold text-gray-300">Live Indian Cinema OTT</p>
          <p className="text-[10px] text-gray-500 mt-0.5">Dolby Atmos & 4K Streaming</p>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Fixed Left Sidebar */}
      <aside 
        id="desktop-left-sidebar"
        className="hidden lg:block w-72 shrink-0 border-r border-white/10 min-h-[calc(100vh-5rem)] sticky top-20 z-30"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlay + Slide-in menu) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop Blur Overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          />

          {/* Slide-out Menu Panel */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-[#07070f] shadow-2xl border-r border-white/10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
