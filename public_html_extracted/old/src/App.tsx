import React, { useState, useEffect } from 'react';
import { 
  ShortFilm, 
  ReelVideo, 
  Creator, 
  Review, 
  Comment, 
  User 
} from './types';
import { PlatformStore } from './services/platformStore';
import { HARRI_KUMAR_CREATOR } from './data/mockData';

// Icons for Sidebar
import { 
  LayoutDashboard, 
  Film, 
  FileCheck, 
  ShieldAlert, 
  Shield, 
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';

// Components
import { Navbar, IndianShortMovieLogo } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { FilmmakersPage } from './components/FilmmakersPage';
import { WatchlistPage } from './components/WatchlistPage';
import { AdminOverview } from './components/AdminOverview';
import { AdminFilmManagement } from './components/AdminFilmManagement';
import { AdminSubmissionsQueue } from './components/AdminSubmissionsQueue';
import { AdminContentModeration } from './components/AdminContentModeration';
import { Footer } from './components/Footer';

// Modals
import { FilmPlayerModal } from './components/FilmPlayerModal';
import { SubmitFilmModal } from './components/SubmitFilmModal';
import { CreatorProfileModal } from './components/CreatorProfileModal';
import { AuthModal } from './components/AuthModal';

export default function App() {
  // Main Data State backed by PlatformStore
  const [currentUser, setCurrentUser] = useState<User | null>(() => PlatformStore.getCurrentSession());
  const [films, setFilms] = useState<ShortFilm[]>(() => PlatformStore.getFilms());
  const [reels, setReels] = useState<ReelVideo[]>(() => PlatformStore.getReels());
  const [creators, setCreators] = useState<Creator[]>(() => PlatformStore.getCreators());
  const [reviews, setReviews] = useState<Review[]>(() => PlatformStore.getReviews());
  const [comments, setComments] = useState<Comment[]>(() => PlatformStore.getComments());

  // URL-Aware Initial Tab Routing:
  // Defaults to 'admin' so the Admin Portal with left sidebar is visible by default!
  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      const s = window.location.search.toLowerCase();
      const h = window.location.hash.toLowerCase();
      if (p.includes('discover') || s.includes('discover') || h.includes('discover')) return 'films';
      if (p.includes('watchlist') || s.includes('watchlist') || h.includes('watchlist')) return 'watchlist';
      if (p.includes('filmmakers') || s.includes('filmmakers') || h.includes('filmmakers')) return 'filmmakers';
      if (p.includes('home') || s.includes('home') || h.includes('home')) return 'home';
    }
    return 'admin';
  });

  // Admin Internal Section Tab: 'overview' | 'films' | 'submissions' | 'reports'
  const [adminSubTab, setAdminSubTab] = useState<'overview' | 'films' | 'submissions' | 'reports'>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [adminMobileSidebarOpen, setAdminMobileSidebarOpen] = useState<boolean>(false);

  // Modals & Feedback
  const [activeFilmModal, setActiveFilmModal] = useState<ShortFilm | null>(null);
  const [selectedCreatorModal, setSelectedCreatorModal] = useState<Creator | null>(null);
  const [showSubmitFilmModal, setShowSubmitFilmModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic counts for badges
  const pendingSubmissionsCount = films.filter(f => f.status === 'pending' || f.status === 'changes_requested').length;
  const [pendingReportsCount, setPendingReportsCount] = useState<number>(() => {
    const saved = localStorage.getItem('ism_admin_reports');
    if (saved) {
      try {
        return JSON.parse(saved).length;
      } catch {
        return 3;
      }
    }
    return 3;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Synchronize browser history / URL path
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    if (typeof window !== 'undefined') {
      const pathMap: Record<string, string> = {
        home: '/',
        films: '/discover',
        watchlist: '/watchlist',
        filmmakers: '/filmmakers',
        admin: '/admin'
      };
      const newPath = pathMap[tab] || '/';
      if (window.location.pathname !== newPath) {
        window.history.pushState({ tab }, '', newPath);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to browser popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname.toLowerCase();
      const s = window.location.search.toLowerCase();
      const h = window.location.hash.toLowerCase();
      if (p.includes('admin') || s.includes('admin') || h.includes('admin')) setCurrentTab('admin');
      else if (p.includes('discover') || s.includes('discover') || h.includes('discover')) setCurrentTab('films');
      else if (p.includes('watchlist') || s.includes('watchlist') || h.includes('watchlist')) setCurrentTab('watchlist');
      else if (p.includes('filmmakers') || s.includes('filmmakers') || h.includes('filmmakers')) setCurrentTab('filmmakers');
      else setCurrentTab('home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Admin Sidebar navigation items matching reference /admin exactly
  const adminSidebarItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard
    },
    {
      id: 'films',
      label: 'Film Management',
      icon: Film
    },
    {
      id: 'submissions',
      label: 'Submissions Queue',
      icon: FileCheck,
      badge: pendingSubmissionsCount > 0 ? pendingSubmissionsCount : undefined
    },
    {
      id: 'reports',
      label: 'Content Moderation',
      icon: ShieldAlert,
      badge: pendingReportsCount > 0 ? pendingReportsCount : undefined
    }
  ];

  const handleSelectCreatorById = (creatorId: string) => {
    const found = creators.find(c => c.id === creatorId);
    if (found) {
      setSelectedCreatorModal(found);
    } else {
      setSelectedCreatorModal({
        ...HARRI_KUMAR_CREATOR,
        id: creatorId,
        name: 'Independent Indian Director',
        handle: '@director'
      });
    }
  };

  const handleLikeFilm = (filmId: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    const isLiked = currentUser.likedFilmIds?.includes(filmId);
    const newLiked = isLiked
      ? currentUser.likedFilmIds.filter(id => id !== filmId)
      : [...(currentUser.likedFilmIds || []), filmId];

    const updatedUser: User = { ...currentUser, likedFilmIds: newLiked };
    setCurrentUser(updatedUser);
    PlatformStore.setCurrentSession(updatedUser);

    setFilms(prev => {
      const updated = prev.map(f => {
        if (f.id === filmId) {
          return {
            ...f,
            likesCount: Math.max(0, isLiked ? f.likesCount - 1 : f.likesCount + 1),
            isLiked: !isLiked
          };
        }
        return f;
      });
      PlatformStore.saveFilms(updated);
      return updated;
    });
  };

  const handleSaveFilm = (filmId: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    const isSaved = currentUser.savedFilmIds?.includes(filmId);
    const newSaved = isSaved
      ? currentUser.savedFilmIds.filter(id => id !== filmId)
      : [...(currentUser.savedFilmIds || []), filmId];

    const updatedUser: User = { ...currentUser, savedFilmIds: newSaved };
    setCurrentUser(updatedUser);
    PlatformStore.setCurrentSession(updatedUser);
    showToast(isSaved ? 'Removed from saved films' : 'Added to saved films');
  };

  const handleAddReview = (filmId: string, rating: number, headline: string, commentText: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      filmId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating,
      headline,
      comment: commentText,
      helpfulCount: 0,
      createdAt: new Date().toISOString()
    };
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    PlatformStore.saveReviews(updatedReviews);

    // Update film average rating
    const filmReviews = updatedReviews.filter(r => r.filmId === filmId);
    const avg = filmReviews.reduce((sum, r) => sum + r.rating, 0) / filmReviews.length;
    setFilms(prev => {
      const updated = prev.map(f => f.id === filmId ? { ...f, rating: Number(avg.toFixed(1)) } : f);
      PlatformStore.saveFilms(updated);
      return updated;
    });
    showToast('Review submitted successfully');
  };

  const handleAddComment = (targetId: string, text: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    const newComment: Comment = {
      id: `com-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      targetId,
      targetType: 'film',
      text,
      likesCount: 0,
      createdAt: new Date().toISOString()
    };
    const updated = [newComment, ...comments];
    setComments(updated);
    PlatformStore.saveComments(updated);
    showToast('Comment published');
  };

  const handleFilmSubmitted = (newFilm: ShortFilm) => {
    const updated = [newFilm, ...films];
    setFilms(updated);
    PlatformStore.saveFilms(updated);
    setShowSubmitFilmModal(false);
    showToast(`"${newFilm.title}" submitted to catalog queue!`);
    setCurrentTab('admin');
    setAdminSubTab('submissions');
  };

  const handleLogout = () => {
    PlatformStore.setCurrentSession(null);
    setCurrentUser(null);
    showToast('Signed out of session');
  };

  return (
    <div className="min-h-screen bg-cinema-bg text-white flex flex-col antialiased selection:bg-cinema-accent selection:text-white">
      
      {/* 1. Sticky Transparent Glass Header matching reference exactly */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onOpenSubmitFilm={() => setShowSubmitFilmModal(true)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onSearch={() => handleTabChange('films')}
      />

      {/* 2. Main Page Content View */}
      <main className="flex-grow">
        
        {/* VIEW 1: HOME PAGE (Matching https://indian-short-films-lime.vercel.app/) */}
        {currentTab === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
            <HomePage
              films={films}
              onSelectFilm={(f) => setActiveFilmModal(f)}
              onNavigateTab={handleTabChange}
            />
          </div>
        )}

        {/* VIEW 2: DISCOVER (Catalog & Search matching https://indian-short-films-lime.vercel.app/discover) */}
        {currentTab === 'films' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
            <AdminFilmManagement
              films={films}
              onUpdateFilms={setFilms}
              onSelectFilm={(f) => setActiveFilmModal(f)}
              onOpenSubmitFilm={() => setShowSubmitFilmModal(true)}
              onToast={showToast}
            />
          </div>
        )}

        {/* VIEW 3: WATCHLIST (Matching https://indian-short-films-lime.vercel.app/watchlist) */}
        {currentTab === 'watchlist' && (
          <WatchlistPage
            films={films}
            savedFilmIds={currentUser?.savedFilmIds || []}
            onSelectFilm={(f) => setActiveFilmModal(f)}
            onRemoveFromWatchlist={handleSaveFilm}
            onNavigateTab={handleTabChange}
          />
        )}

        {/* VIEW 4: FILMMAKERS (Matching https://indian-short-films-lime.vercel.app/filmmakers) */}
        {currentTab === 'filmmakers' && (
          <FilmmakersPage
            creators={creators}
            films={films}
            onSelectCreator={(c) => setSelectedCreatorModal(c)}
          />
        )}

        {/* VIEW 5: ADMIN PORTAL WITH COMPLETE FIXED LEFT SIDEBAR & MOBILE HAMBURGER SLIDE MENU */}
        {currentTab === 'admin' && (
          <div className="min-h-[calc(100vh-80px)] bg-cinema-bg flex flex-col md:flex-row w-full max-w-full overflow-x-hidden relative">
            
            {/* Mobile Header Bar with Hamburger Button for Admin Portal */}
            <div className="md:hidden flex items-center justify-between px-4 py-3 bg-cinema-surface border-b border-cinema-border w-full z-20 shrink-0">
              <button
                onClick={() => setAdminMobileSidebarOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cinema-card hover:bg-cinema-border border border-cinema-border text-white text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
                aria-label="Open Admin Menu"
              >
                <Menu className="w-4 h-4 text-cinema-accent shrink-0" />
                <span>Admin Menu</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cinema-accent animate-pulse" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-cinema-accent font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-cinema-accent/10 border border-cinema-accent/20">
                  Role-Based Access
                </span>
              </div>
            </div>

            {/* Mobile Backdrop Overlay when slide menu is open */}
            {adminMobileSidebarOpen && (
              <div
                className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 md:hidden transition-opacity"
                onClick={() => setAdminMobileSidebarOpen(false)}
                aria-hidden="true"
              />
            )}

            {/* Admin Left Sidebar:
                - Desktop: Fixed left sidebar (w-64, sticky top-20)
                - Mobile: Slide-in hamburger drawer */}
            <aside className={`
              bg-cinema-surface border-r border-cinema-border p-6 flex flex-col justify-between overflow-y-auto
              md:flex md:w-64 md:min-w-[16rem] md:shrink-0 md:sticky md:top-20 md:h-[calc(100vh-80px)] md:z-30
              ${adminMobileSidebarOpen 
                ? 'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] h-full shadow-2xl transition-transform duration-300 translate-x-0' 
                : 'hidden md:flex -translate-x-full md:translate-x-0'}
            `}>
              <div className="space-y-6">
                
                {/* Top: Logo & Mobile Close Button */}
                <div className="flex items-center justify-between pb-5 border-b border-cinema-border/50">
                  <button
                    onClick={() => {
                      handleTabChange('home');
                      setAdminMobileSidebarOpen(false);
                    }}
                    className="focus:outline-none cursor-pointer text-left block group"
                    title="Indian Short Movie - Home"
                  >
                    <IndianShortMovieLogo isMobile={true} />
                  </button>

                  <button
                    onClick={() => setAdminMobileSidebarOpen(false)}
                    className="md:hidden p-1.5 rounded-lg text-cinema-muted hover:text-white hover:bg-cinema-card transition-colors cursor-pointer"
                    aria-label="Close Admin Menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Below it: ADMIN PORTAL & ROLE-BASED ACCESS Header */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cinema-accent flex items-center justify-center shadow-lg shadow-cinema-accent/30 shrink-0">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-display font-bold text-sm text-white tracking-tight">
                      ADMIN PORTAL
                    </h2>
                    <span className="text-[10px] text-cinema-accent font-semibold uppercase tracking-wider block">
                      Role-Based Access
                    </span>
                  </div>
                </div>

                {/* Left Sidebar Navigation */}
                <nav className="space-y-1.5">
                  {adminSidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = adminSubTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setAdminSubTab(item.id as any);
                          setAdminMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer group ${
                          isActive
                            ? 'bg-cinema-accent text-white shadow-md shadow-cinema-accent/20'
                            : 'text-cinema-muted hover:text-white hover:bg-cinema-card'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                        <span className="truncate">{item.label}</span>
                        {item.badge !== undefined && (
                          <span className={`ml-auto text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                            isActive ? 'bg-black/30 text-white' : 'bg-cinema-surface text-cinema-muted border border-cinema-border/50'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>

              </div>

              {/* Sidebar Bottom: Back to Main Site */}
              <div className="pt-6 border-t border-cinema-border/60 space-y-3">
                <button
                  onClick={() => {
                    handleTabChange('home');
                    setAdminMobileSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-cinema-muted hover:text-white hover:bg-cinema-card rounded-xl transition-all cursor-pointer text-left"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Main Site</span>
                </button>
              </div>
            </aside>

            {/* Admin Workspace Content - Full Width on Mobile, Zero Horizontal Scroll */}
            <div className="flex-1 w-full min-w-0 p-4 sm:p-6 md:p-10 overflow-y-auto overflow-x-hidden">
              
              {/* ADMIN SUBPAGE 1: OVERVIEW (Platform Analytics & Dashboard) */}
              {adminSubTab === 'overview' && (
                <AdminOverview
                  films={films}
                  creators={creators}
                  reviews={reviews}
                  pendingReportsCount={pendingReportsCount}
                  onNavigateTab={(tab) => {
                    if (tab === 'films' || tab === 'submissions' || tab === 'reports') {
                      setAdminSubTab(tab as any);
                    } else {
                      handleTabChange(tab);
                    }
                  }}
                  onOpenSubmitFilm={() => setShowSubmitFilmModal(true)}
                />
              )}

              {/* ADMIN SUBPAGE 2: FILM MANAGEMENT */}
              {adminSubTab === 'films' && (
                <AdminFilmManagement
                  films={films}
                  onUpdateFilms={setFilms}
                  onSelectFilm={(f) => setActiveFilmModal(f)}
                  onOpenSubmitFilm={() => setShowSubmitFilmModal(true)}
                  onToast={showToast}
                />
              )}

              {/* ADMIN SUBPAGE 3: SUBMISSIONS QUEUE */}
              {adminSubTab === 'submissions' && (
                <AdminSubmissionsQueue
                  films={films}
                  onUpdateFilms={setFilms}
                  onSelectFilm={(f) => setActiveFilmModal(f)}
                  onOpenSubmitFilm={() => setShowSubmitFilmModal(true)}
                  onToast={showToast}
                />
              )}

              {/* ADMIN SUBPAGE 4: CONTENT MODERATION */}
              {adminSubTab === 'reports' && (
                <AdminContentModeration
                  onToast={showToast}
                  onUpdatePendingCount={setPendingReportsCount}
                />
              )}

            </div>

          </div>
        )}

      </main>

      {/* 3. Exact 4-Column Footer with exact required HOSTING BABA credit */}
      <Footer
        onNavigateTab={handleTabChange}
        onOpenSubmitFilm={() => setShowSubmitFilmModal(true)}
      />

      {/* MODAL 1: Film Video Player Screener */}
      {activeFilmModal && (
        <FilmPlayerModal
          film={activeFilmModal}
          onClose={() => setActiveFilmModal(null)}
          currentUser={currentUser}
          onLikeFilm={handleLikeFilm}
          onSaveFilm={handleSaveFilm}
          onAddReview={handleAddReview}
          onAddComment={handleAddComment}
          reviews={reviews}
          comments={comments}
          onSelectCreator={handleSelectCreatorById}
        />
      )}

      {/* MODAL 2: Submit / Upload New Film Modal */}
      {showSubmitFilmModal && (
        <SubmitFilmModal
          isOpen={showSubmitFilmModal}
          onClose={() => setShowSubmitFilmModal(false)}
          currentUser={currentUser}
          onFilmSubmitted={handleFilmSubmitted}
          onRequireAuth={() => setShowAuthModal(true)}
        />
      )}

      {/* MODAL 3: Creator Profile Modal */}
      {selectedCreatorModal && (
        <CreatorProfileModal
          creator={selectedCreatorModal}
          onClose={() => setSelectedCreatorModal(null)}
          films={films}
          reels={reels}
          onSelectFilm={(f) => setActiveFilmModal(f)}
          onSelectReel={() => {}}
        />
      )}

      {/* MODAL 4: Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={(user) => {
            setCurrentUser(user);
            setShowAuthModal(false);
            showToast(`Welcome back, ${user.name}!`);
          }}
        />
      )}

      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-cinema-card border border-cinema-border text-white text-xs font-semibold shadow-2xl animate-slideUp">
          <div className="w-2 h-2 rounded-full bg-cinema-accent shadow-[0_0_8px_#e50914]" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
