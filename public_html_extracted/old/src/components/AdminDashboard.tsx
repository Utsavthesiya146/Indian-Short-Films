import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Film, 
  Smartphone, 
  Star, 
  MessageSquare, 
  Eye, 
  Heart, 
  Search, 
  Check, 
  X, 
  Trash2, 
  Edit3, 
  Flame, 
  Sparkles, 
  Filter, 
  AlertCircle,
  HardDrive,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  BarChart3,
  Award
} from 'lucide-react';
import { User, ShortFilm, ReelVideo, Creator, Comment, Review, UserRole } from '../types';
import { PlatformStore } from '../services/platformStore';

interface AdminDashboardProps {
  currentUser: User | null;
  allFilms: ShortFilm[];
  allReels: ReelVideo[];
  allCreators: Creator[];
  allComments: Comment[];
  allReviews: Review[];
  onSelectFilm: (film: ShortFilm) => void;
  onSelectReel: (reel: ReelVideo) => void;
  onUpdateFilms: (films: ShortFilm[]) => void;
  onUpdateReels: (reels: ReelVideo[]) => void;
  onUpdateCreators: (creators: Creator[]) => void;
  onUpdateComments: (comments: Comment[]) => void;
  onUpdateReviews: (reviews: Review[]) => void;
  onClose?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  allFilms,
  allReels,
  allCreators,
  allComments,
  allReviews,
  onSelectFilm,
  onSelectReel,
  onUpdateFilms,
  onUpdateReels,
  onUpdateCreators,
  onUpdateComments,
  onUpdateReviews,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'films' | 'submissions' | 'moderation' | 'users'>('overview');
  const [submissionFilter, setSubmissionFilter] = useState<'all' | 'pending' | 'changes_requested' | 'approved' | 'rejected'>('pending');
  const [moderationSubTab, setModerationSubTab] = useState<'reels' | 'reviews' | 'comments'>('reels');
  const [userContentSubTab, setUserContentSubTab] = useState<'users' | 'creators'>('users');
  const [usersList, setUsersList] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [inspectingFilm, setInspectingFilm] = useState<ShortFilm | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  useEffect(() => {
    setUsersList(PlatformStore.getUsers());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Real KPI calculations
  const totalFilmViews = allFilms.reduce((acc, f) => acc + (f.viewsCount || 0), 0);
  const totalReelViews = allReels.reduce((acc, r) => acc + (r.viewsCount || 0), 0);
  const totalViews = totalFilmViews + totalReelViews;

  const totalFilmLikes = allFilms.reduce((acc, f) => acc + (f.likesCount || 0), 0);
  const totalReelLikes = allReels.reduce((acc, r) => acc + (r.likesCount || 0), 0);
  const totalLikes = totalFilmLikes + totalReelLikes;

  // Film moderation actions
  const handleUpdateFilmStatus = (
    filmId: string, 
    newStatus: 'pending' | 'approved' | 'rejected' | 'changes_requested' | 'published' | 'draft',
    adminNotes?: string
  ) => {
    const updated = allFilms.map(f => {
      if (f.id === filmId) {
        return { 
          ...f, 
          status: newStatus,
          adminNotes: adminNotes !== undefined ? adminNotes : f.adminNotes
        };
      }
      return f;
    });
    PlatformStore.saveFilms(updated);
    onUpdateFilms(updated);
    showToast(`Film status updated to: ${newStatus}`);
  };

  const handleToggleFilmFeature = (filmId: string) => {
    const updated = allFilms.map(f => f.id === filmId ? { ...f, isFeatured: !f.isFeatured } : f);
    PlatformStore.saveFilms(updated);
    onUpdateFilms(updated);
    showToast('Featured spotlight updated');
  };

  const handleToggleFilmTrending = (filmId: string) => {
    const updated = allFilms.map(f => f.id === filmId ? { ...f, isTrending: !f.isTrending } : f);
    PlatformStore.saveFilms(updated);
    onUpdateFilms(updated);
    showToast('Trending status updated');
  };

  const handleDeleteFilm = (filmId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this short film?')) {
      const updated = allFilms.filter(f => f.id !== filmId);
      PlatformStore.saveFilms(updated);
      onUpdateFilms(updated);
      showToast('Film removed from platform');
    }
  };

  // Reel moderation actions
  const handleDeleteReel = (reelId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this reel?')) {
      const updated = allReels.filter(r => r.id !== reelId);
      PlatformStore.saveReels(updated);
      onUpdateReels(updated);
      showToast('Reel deleted');
    }
  };

  // User management actions
  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    const updated = usersList.map(u => u.id === userId ? { ...u, role: newRole } : u);
    setUsersList(updated);
    PlatformStore.saveUsers(updated);
    showToast(`User role changed to ${newRole}`);
  };

  const handleToggleUserVerification = (userId: string) => {
    const updated = usersList.map(u => u.id === userId ? { ...u, isVerified: !u.isVerified } : u);
    setUsersList(updated);
    PlatformStore.saveUsers(updated);
    showToast('User verification toggled');
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      alert('You cannot delete your own active administrator account.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updated = usersList.filter(u => u.id !== userId);
      setUsersList(updated);
      PlatformStore.saveUsers(updated);
      showToast('User deleted');
    }
  };

  // Comment & Review moderation
  const handleDeleteComment = (commentId: string) => {
    const updated = allComments.filter(c => c.id !== commentId);
    PlatformStore.saveComments(updated);
    onUpdateComments(updated);
    showToast('Comment deleted');
  };

  const handleDeleteReview = (reviewId: string) => {
    const updated = allReviews.filter(r => r.id !== reviewId);
    PlatformStore.saveReviews(updated);
    onUpdateReviews(updated);
    showToast('Review removed');
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-black text-white">Administrator Access Required</h2>
        <p className="text-xs text-slate-400">
          You must be logged in as an authorized Platform Administrator to access the moderation console.
        </p>
      </div>
    );
  }

  return (
    <div id="admin-dashboard-container" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black shadow-2xl animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-red-900/50 bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-950 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-500/15 border border-red-500/30 px-3 py-1 text-xs font-bold text-red-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Platform Executive Governance</span>
            </div>
            <h1 className="cinematic-title text-2xl sm:text-3xl font-black text-white">
              Indian Short Movie • Admin Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Manage films, moderate vertical reels, inspect creator/brand registrations, and administer users.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://webhostingbaba.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              <HardDrive className="h-3.5 w-3.5" />
              <span>Hosting Baba Infra</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Real KPI Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800/80 p-3.5">
            <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-amber-400" />
              <span>Registered Users</span>
            </p>
            <p className="text-xl font-black text-white mt-1">{usersList.length}</p>
          </div>

          <div className="rounded-2xl bg-slate-950/80 border border-slate-800/80 p-3.5">
            <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Film className="h-3.5 w-3.5 text-amber-400" />
              <span>Short Films</span>
            </p>
            <p className="text-xl font-black text-amber-400 mt-1">{allFilms.length}</p>
          </div>

          <div className="rounded-2xl bg-slate-950/80 border border-slate-800/80 p-3.5">
            <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Smartphone className="h-3.5 w-3.5 text-red-400" />
              <span>Vertical Reels</span>
            </p>
            <p className="text-xl font-black text-red-400 mt-1">{allReels.length}</p>
          </div>

          <div className="rounded-2xl bg-slate-950/80 border border-slate-800/80 p-3.5">
            <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Eye className="h-3.5 w-3.5 text-sky-400" />
              <span>Real Views</span>
            </p>
            <p className="text-xl font-black text-white mt-1">{totalViews.toLocaleString()}</p>
          </div>

          <div className="rounded-2xl bg-slate-950/80 border border-slate-800/80 p-3.5">
            <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Heart className="h-3.5 w-3.5 text-rose-400" />
              <span>Real Likes</span>
            </p>
            <p className="text-xl font-black text-white mt-1">{totalLikes.toLocaleString()}</p>
          </div>

          <div className="rounded-2xl bg-slate-950/80 border border-slate-800/80 p-3.5">
            <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
              <span>Reviews & Comments</span>
            </p>
            <p className="text-xl font-black text-emerald-400 mt-1">{allReviews.length + allComments.length}</p>
          </div>
        </div>

        {/* Navigation Tabs (5 Clear Sections) */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-800">
          <button
            id="admin-tab-overview"
            onClick={() => setActiveTab('overview')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-black shadow-md'
                : 'border border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Overview
          </button>

          <button
            id="admin-tab-films"
            onClick={() => setActiveTab('films')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'films'
                ? 'bg-amber-500 text-black shadow-md'
                : 'border border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Film Management ({allFilms.length})
          </button>

          <button
            id="admin-tab-submissions"
            onClick={() => setActiveTab('submissions')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'submissions'
                ? 'bg-amber-500 text-black shadow-md'
                : 'border border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Submissions ({allFilms.filter(f => f.status === 'pending' || f.status === 'changes_requested').length})
          </button>

          <button
            id="admin-tab-moderation"
            onClick={() => setActiveTab('moderation')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'moderation'
                ? 'bg-amber-500 text-black shadow-md'
                : 'border border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Moderation ({allReels.length + allReviews.length + allComments.length})
          </button>

          <button
            id="admin-tab-users"
            onClick={() => setActiveTab('users')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-amber-500 text-black shadow-md'
                : 'border border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            User / Content Info ({usersList.length + allCreators.length})
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}

      {/* 1. OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* System Health */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-emerald-400" />
                <span>Storage & Database Architecture</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-300">IndexedDB Blob Storage</span>
                  <span className="font-mono text-emerald-400 font-bold">READY (Active)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-300">Metadata Persistence Engine</span>
                  <span className="font-mono text-emerald-400 font-bold">READY (LocalStorage)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-300">PHP/MySQL Script Deployment Files</span>
                  <span className="font-mono text-amber-400 font-bold">Generated in /php_backend</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-300">Cloud Web Hosting Provider</span>
                  <span className="font-mono text-white font-bold">Web Hosting Baba</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Moderation Highlights</span>
              </h3>

              <div className="space-y-2 text-xs">
                <p className="text-slate-300">
                  Pending short films for review: <strong className="text-amber-400">{allFilms.filter(f => f.status === 'pending').length}</strong>
                </p>
                <p className="text-slate-300">
                  Currently featured on home: <strong className="text-amber-400">{allFilms.filter(f => f.isFeatured).length}</strong>
                </p>
                <p className="text-slate-300">
                  Currently ranked trending: <strong className="text-red-400">{allFilms.filter(f => f.isTrending).length}</strong>
                </p>
                <p className="text-slate-300">
                  Verified directors & creators: <strong className="text-white">{allCreators.filter(c => c.isVerified).length}</strong>
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab('submissions')}
                  className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 transition-colors"
                >
                  Review Submissions ({allFilms.filter(f => f.status === 'pending').length}) →
                </button>
                <button
                  onClick={() => setActiveTab('films')}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700 transition-colors"
                >
                  Film Management →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. FILM MANAGEMENT */}
      {activeTab === 'films' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Film Management & OTT Catalog ({allFilms.length})</h3>
              <p className="text-xs text-slate-400">Control active OTT playback, featured spotlight tags, trending markers, and catalog status.</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search catalog films..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {allFilms.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center text-slate-400 text-xs">
              No films registered on the platform yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
              {allFilms
                .filter(f => !searchQuery || f.title.toLowerCase().includes(searchQuery.toLowerCase()) || f.creatorName.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((film) => (
                <div key={film.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <img
                      src={film.posterUrl}
                      alt={film.title}
                      referrerPolicy="no-referrer"
                      className="h-16 w-24 rounded-xl object-cover shrink-0 bg-black cursor-pointer hover:opacity-90"
                      onClick={() => onSelectFilm(film)}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 
                          onClick={() => onSelectFilm(film)} 
                          className="text-sm font-bold text-white hover:text-amber-400 cursor-pointer"
                        >
                          {film.title}
                        </h4>
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                          film.status === 'published' || film.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : film.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-400'
                            : film.status === 'changes_requested'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {film.status || 'published'}
                        </span>
                        {film.isFeatured && (
                          <span className="rounded bg-amber-500/20 px-1 py-0.2 text-[9px] font-bold text-amber-300">
                            ★ Featured
                          </span>
                        )}
                        {film.isTrending && (
                          <span className="rounded bg-red-500/20 px-1 py-0.2 text-[9px] font-bold text-red-400">
                            🔥 Trending
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {film.language} • {film.genre} • {film.duration} • by {film.creatorName} ({film.productionHouse || 'Independent'})
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Views: {film.viewsCount || 0} • Likes: {film.likesCount || 0}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end text-xs">
                    <button
                      onClick={() => onSelectFilm(film)}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 font-semibold text-slate-200 hover:bg-slate-700"
                    >
                      ▶ Play
                    </button>

                    <button
                      onClick={() => {
                        setInspectingFilm(film);
                        setAdminNoteInput(film.adminNotes || '');
                      }}
                      className="rounded-lg bg-amber-500/20 border border-amber-500/40 px-2.5 py-1.5 font-bold text-amber-300 hover:bg-amber-500/30 transition-all"
                    >
                      Inspect
                    </button>

                    <button
                      onClick={() => handleToggleFilmFeature(film.id)}
                      className={`rounded-lg px-2.5 py-1.5 font-semibold transition-colors ${
                        film.isFeatured ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {film.isFeatured ? '★ Featured' : 'Feature'}
                    </button>

                    <button
                      onClick={() => handleToggleFilmTrending(film.id)}
                      className={`rounded-lg px-2.5 py-1.5 font-semibold transition-colors ${
                        film.isTrending ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {film.isTrending ? '🔥 Trending' : 'Trend'}
                    </button>

                    <button
                      onClick={() => handleUpdateFilmStatus(film.id, film.status === 'published' ? 'draft' : 'published')}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 font-semibold text-slate-300 hover:bg-slate-700"
                    >
                      {film.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>

                    <button
                      onClick={() => handleDeleteFilm(film.id)}
                      className="rounded-lg border border-red-900/60 bg-red-950/40 p-2 text-red-400 hover:bg-red-900/60"
                      title="Delete Film"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SUBMISSIONS                                                            */}
      {/* ========================================================================= */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Filmmaker Submissions & Reviews</h3>
              <p className="text-xs text-slate-400">Inspect scripts, cast/crew, preview video files, and approve or request changes.</p>
            </div>

            {/* Submission Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setSubmissionFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  submissionFilter === 'all' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({allFilms.length})
              </button>
              <button
                onClick={() => setSubmissionFilter('pending')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  submissionFilter === 'pending' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pending ({allFilms.filter(f => f.status === 'pending').length})
              </button>
              <button
                onClick={() => setSubmissionFilter('changes_requested')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  submissionFilter === 'changes_requested' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Changes ({allFilms.filter(f => f.status === 'changes_requested').length})
              </button>
              <button
                onClick={() => setSubmissionFilter('approved')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  submissionFilter === 'approved' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Approved ({allFilms.filter(f => f.status === 'approved' || f.status === 'published').length})
              </button>
            </div>
          </div>

          {allFilms.filter(f => submissionFilter === 'all' || (submissionFilter === 'approved' ? (f.status === 'approved' || f.status === 'published') : f.status === submissionFilter)).length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center text-slate-400 text-xs">
              No submissions found under the selected filter.
            </div>
          ) : (
            <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
              {allFilms
                .filter(f => submissionFilter === 'all' || (submissionFilter === 'approved' ? (f.status === 'approved' || f.status === 'published') : f.status === submissionFilter))
                .map((film) => (
                <div key={film.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <img
                      src={film.posterUrl}
                      alt={film.title}
                      referrerPolicy="no-referrer"
                      className="h-16 w-24 rounded-xl object-cover shrink-0 bg-black"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{film.title}</h4>
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                          film.status === 'published' || film.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : film.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-400 animate-pulse'
                            : film.status === 'changes_requested'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {film.status || 'pending'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {film.language} • {film.genre} • {film.duration} • Submitted by {film.creatorName} ({film.productionHouse || 'Independent'})
                      </p>
                      {film.adminNotes && (
                        <p className="text-[11px] text-amber-300/90 mt-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 inline-block">
                          Reviewer Note: {film.adminNotes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submission Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end text-xs">
                    <button
                      onClick={() => {
                        setInspectingFilm(film);
                        setAdminNoteInput(film.adminNotes || '');
                      }}
                      className="rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 font-bold text-amber-300 hover:bg-amber-500/30 transition-all"
                    >
                      🔍 Inspect Submission
                    </button>

                    {film.status !== 'approved' && film.status !== 'published' && (
                      <button
                        onClick={() => handleUpdateFilmStatus(film.id, 'approved')}
                        className="rounded-lg bg-emerald-600 px-2.5 py-1.5 font-semibold text-white hover:bg-emerald-500 transition-all"
                      >
                        ✓ Approve
                      </button>
                    )}

                    {film.status !== 'changes_requested' && (
                      <button
                        onClick={() => {
                          const note = window.prompt('Enter modification notes for the filmmaker:', film.adminNotes || '');
                          if (note !== null) {
                            handleUpdateFilmStatus(film.id, 'changes_requested', note);
                          }
                        }}
                        className="rounded-lg border border-blue-800 bg-blue-950/60 px-2.5 py-1.5 font-semibold text-blue-300 hover:bg-blue-900/60"
                      >
                        Request Changes
                      </button>
                    )}

                    {film.status !== 'rejected' && (
                      <button
                        onClick={() => {
                          const reason = window.prompt('Reason for rejection:', 'Does not meet current submission guidelines');
                          if (reason !== null) {
                            handleUpdateFilmStatus(film.id, 'rejected', reason);
                          }
                        }}
                        className="rounded-lg border border-red-800 bg-red-950/60 px-2.5 py-1.5 font-semibold text-red-300 hover:bg-red-900/60"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODERATION                                                             */}
      {/* ========================================================================= */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Community & Content Moderation</h3>
              <p className="text-xs text-slate-400">Moderate vertical video reels, user reviews, and discussion comments with instant removal.</p>
            </div>

            {/* Moderation Subtabs */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setModerationSubTab('reels')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  moderationSubTab === 'reels' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Reels ({allReels.length})
              </button>
              <button
                onClick={() => setModerationSubTab('reviews')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  moderationSubTab === 'reviews' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Reviews ({allReviews.length})
              </button>
              <button
                onClick={() => setModerationSubTab('comments')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  moderationSubTab === 'comments' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Comments ({allComments.length})
              </button>
            </div>
          </div>

          {/* Subtab: Reels */}
          {moderationSubTab === 'reels' && (
            <div className="space-y-3">
              {allReels.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-400 text-xs">
                  No vertical reels uploaded yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                  {allReels.map((reel) => (
                    <div key={reel.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={reel.posterUrl}
                          alt={reel.title}
                          referrerPolicy="no-referrer"
                          className="h-16 w-12 rounded-xl object-cover shrink-0 bg-black"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-white">{reel.title}</h4>
                          <p className="text-xs text-slate-400">
                            {reel.creatorName} ({reel.creatorHandle}) • {reel.duration}
                          </p>
                          <p className="text-[11px] text-red-400/90 mt-0.5">
                            Views: {reel.viewsCount} • Likes: {reel.likesCount}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectReel(reel)}
                          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700"
                        >
                          Watch
                        </button>
                        <button
                          onClick={() => handleDeleteReel(reel.id)}
                          className="rounded-lg border border-red-900/60 bg-red-950/40 p-2 text-red-400 hover:bg-red-900/60"
                          title="Delete Reel"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Subtab: Reviews */}
          {moderationSubTab === 'reviews' && (
            <div className="space-y-3">
              {allReviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-400 text-xs">
                  No film reviews submitted yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                  {allReviews.map((r) => (
                    <div key={r.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{r.userName}</span>
                          <span className="text-amber-400 font-semibold">★ {r.rating}/5</span>
                        </div>
                        <p className="text-slate-300 mt-1 font-medium">{r.headline}</p>
                        <p className="text-slate-400 mt-0.5">{r.comment}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteReview(r.id)}
                        className="rounded-lg border border-red-900/60 bg-red-950/40 p-2 text-red-400 hover:bg-red-900/60 shrink-0"
                        title="Delete Review"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Subtab: Comments */}
          {moderationSubTab === 'comments' && (
            <div className="space-y-3">
              {allComments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-400 text-xs">
                  No discussion comments posted yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                  {allComments.map((c) => (
                    <div key={c.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{c.userName}</span>
                          <span className="text-slate-500">{c.createdAt}</span>
                        </div>
                        <p className="text-slate-300 mt-1">{c.text}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="rounded-lg border border-red-900/60 bg-red-950/40 p-2 text-red-400 hover:bg-red-900/60 shrink-0"
                        title="Delete Comment"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. USER / CONTENT INFORMATION                                             */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">User & Creator Directory</h3>
              <p className="text-xs text-slate-400">View user credentials, update RBAC roles (Viewer, Filmmaker, Creator, Brand, Admin), and verify creators.</p>
            </div>

            {/* Subtabs */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setUserContentSubTab('users')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  userContentSubTab === 'users' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Accounts ({usersList.length})
              </button>
              <button
                onClick={() => setUserContentSubTab('creators')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  userContentSubTab === 'creators' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Creators & Brands ({allCreators.length})
              </button>
            </div>
          </div>

          {/* Subtab: User Accounts */}
          {userContentSubTab === 'users' && (
            <div className="space-y-3">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                {usersList
                  .filter(u => !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.username.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((u) => (
                    <div key={u.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          referrerPolicy="no-referrer"
                          className="h-10 w-10 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-white">{u.name}</span>
                            <span className="text-xs text-slate-400">@{u.username}</span>
                            {u.isVerified && (
                              <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-bold text-amber-400">
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">{u.email} • Joined {u.joinedDate}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
                        {/* Role Selector */}
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateUserRole(u.id, e.target.value as UserRole)}
                          className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-slate-200 focus:outline-none focus:border-amber-400 capitalize"
                        >
                          <option value="viewer">Viewer</option>
                          <option value="creator">Creator</option>
                          <option value="brand">Brand</option>
                          <option value="filmmaker">Filmmaker</option>
                          <option value="admin">Admin</option>
                        </select>

                        <button
                          onClick={() => handleToggleUserVerification(u.id)}
                          className={`rounded-lg px-2.5 py-1 font-semibold ${
                            u.isVerified ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {u.isVerified ? 'Verified' : 'Verify'}
                        </button>

                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="rounded-lg border border-red-900/60 bg-red-950/40 p-1.5 text-red-400 hover:bg-red-900/60"
                          title="Delete User"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Subtab: Creators & Brands */}
          {userContentSubTab === 'creators' && (
            <div className="space-y-3">
              <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                {allCreators.map((c) => (
                  <div key={c.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        referrerPolicy="no-referrer"
                        className="h-10 w-10 rounded-full object-cover border border-amber-400"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span>{c.name}</span>
                          {c.isVerified && <span className="text-[10px] text-amber-400">✓</span>}
                        </h4>
                        <p className="text-xs text-slate-400">{c.designation}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{c.followersCount || 0} Followers</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-300 capitalize">
                        {c.type || 'creator'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Universal Submission Inspection Modal */}
      {inspectingFilm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-white">Film Submission Review</h3>
                <p className="text-xs text-slate-400">Examine media, script, and metadata before approval</p>
              </div>
              <button
                onClick={() => setInspectingFilm(null)}
                className="rounded-full bg-slate-900 p-2 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video & Poster Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase">Video Stream / File</p>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800">
                  <video
                    src={inspectingFilm.videoUrl}
                    poster={inspectingFilm.posterUrl}
                    controls
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase">Poster & Backdrop</p>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800">
                  <img
                    src={inspectingFilm.posterUrl}
                    alt={inspectingFilm.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Core Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="text-slate-400 block text-[10px] uppercase">Title</span>
                <strong className="text-white text-sm">{inspectingFilm.title}</strong>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="text-slate-400 block text-[10px] uppercase">Language & Genre</span>
                <strong className="text-white">{inspectingFilm.language} • {inspectingFilm.genre}</strong>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="text-slate-400 block text-[10px] uppercase">Director / Submitter</span>
                <strong className="text-white">{inspectingFilm.director}</strong>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="text-slate-400 block text-[10px] uppercase">Production House</span>
                <strong className="text-white">{inspectingFilm.productionHouse || inspectingFilm.producer || 'Indie'}</strong>
              </div>
            </div>

            {/* Logline & Synopsis */}
            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-400 uppercase">Logline & Synopsis</p>
              <p className="text-slate-200 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                {inspectingFilm.logline || inspectingFilm.description || 'No logline provided.'}
              </p>
            </div>

            {/* Script / Screenplay if available */}
            {inspectingFilm.script && (
              <div className="space-y-2 text-xs">
                <p className="font-bold text-slate-400 uppercase">Script / Screenplay Notes</p>
                <div className="max-h-40 overflow-y-auto whitespace-pre-wrap font-mono text-[11px] text-slate-300 bg-black/70 p-3.5 rounded-xl border border-slate-800">
                  {inspectingFilm.script}
                </div>
              </div>
            )}

            {/* Cast & Crew */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Cast</span>
                <p className="text-slate-200">
                  {inspectingFilm.cast && inspectingFilm.cast.length > 0 ? inspectingFilm.cast.join(', ') : 'Not listed'}
                </p>
              </div>
              <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Crew / Department</span>
                <p className="text-slate-200">
                  {inspectingFilm.crew && inspectingFilm.crew.length > 0 ? inspectingFilm.crew.join(', ') : 'Not listed'}
                </p>
              </div>
            </div>

            {/* Admin Notes Input */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-400 uppercase">Admin Feedback / Notes for Submitter</label>
              <input
                type="text"
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                placeholder="e.g. Please provide high-res 16:9 poster or check audio sync"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Action Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleUpdateFilmStatus(inspectingFilm.id, 'rejected', adminNoteInput);
                    setInspectingFilm(null);
                  }}
                  className="rounded-xl border border-red-900/60 bg-red-950/40 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-900/60"
                >
                  Reject Submission
                </button>
                <button
                  onClick={() => {
                    handleUpdateFilmStatus(inspectingFilm.id, 'changes_requested', adminNoteInput);
                    setInspectingFilm(null);
                  }}
                  className="rounded-xl border border-blue-900/60 bg-blue-950/40 px-3 py-2 text-xs font-bold text-blue-400 hover:bg-blue-900/60"
                >
                  Request Changes
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleUpdateFilmStatus(inspectingFilm.id, 'approved', adminNoteInput);
                    setInspectingFilm(null);
                  }}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500"
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => {
                    handleUpdateFilmStatus(inspectingFilm.id, 'published', adminNoteInput);
                    setInspectingFilm(null);
                  }}
                  className="rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-amber-500/20"
                >
                  ✓ Approve & Publish Live
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
