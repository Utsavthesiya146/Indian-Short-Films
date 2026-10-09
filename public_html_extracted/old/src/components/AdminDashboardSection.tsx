import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Film, 
  Inbox, 
  Users, 
  Check, 
  X, 
  Edit3, 
  Play, 
  Eye, 
  Search, 
  Sparkles, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Star
} from 'lucide-react';
import { ShortFilm, Creator, User, ReelVideo } from '../types';

interface AdminDashboardSectionProps {
  films: ShortFilm[];
  creators: Creator[];
  reels: ReelVideo[];
  currentUser: User | null;
  onSelectFilm: (film: ShortFilm) => void;
  onViewDetails: (film: ShortFilm) => void;
  onUpdateFilmStatus: (filmId: string, status: 'approved' | 'rejected' | 'changes_requested' | 'published') => void;
  onToggleFeatureFilm: (filmId: string) => void;
  onOpenSubmitFilm: () => void;
}

export const AdminDashboardSection: React.FC<AdminDashboardSectionProps> = ({
  films,
  creators,
  reels,
  currentUser,
  onSelectFilm,
  onViewDetails,
  onUpdateFilmStatus,
  onToggleFeatureFilm,
  onOpenSubmitFilm
}) => {
  const [activeTab, setActiveTab] = useState<'films' | 'queue' | 'creators'>('films');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const pendingSubmissions = films.filter(f => f.status === 'pending');
  const approvedFilms = films.filter(f => f.status === 'approved' || f.status === 'published' || !f.status);

  // Filtered films
  const displayedFilms = films.filter(film => {
    const matchesSearch = 
      film.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      film.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
      film.language.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (statusFilter === 'approved') return film.status === 'approved' || film.status === 'published' || !film.status;
    if (statusFilter === 'pending') return film.status === 'pending';
    return true;
  });

  return (
    <section id="admin-dashboard-section" className="relative py-20 bg-[#050505] overflow-hidden border-b border-white/10">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-xs font-semibold text-purple-300">
              <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
              <span>Studio & Catalog Administration</span>
            </div>
            <h2 className="cinematic-title text-3xl sm:text-4xl lg:text-5xl font-black text-white">
              Admin <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">Control Center</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl leading-relaxed">
              Live management dashboard for approving short movie submissions, toggling spotlights, managing director credentials, and curating OTT playlists.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSubmitFilm}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-[0_0_25px_rgba(139,92,246,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>+ Add Film / Screener</span>
            </button>
          </div>
        </div>

        {/* Dashboard Mockup / Interactive Panel */}
        <div className="rounded-3xl border border-white/15 bg-white/[0.02] backdrop-blur-2xl p-6 sm:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.8)] space-y-6">
          
          {/* Top Bar of the Dashboard: KPIs & Tabs */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
            
            {/* Sub-tabs */}
            <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10 w-fit">
              <button
                onClick={() => setActiveTab('films')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'films'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Film className="h-4 w-4" />
                <span>Film Management ({films.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('queue')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'queue'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Inbox className="h-4 w-4" />
                <span>Submission Queue ({pendingSubmissions.length})</span>
                {pendingSubmissions.length > 0 && (
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('creators')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'creators'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Filmmakers ({creators.length})</span>
              </button>
            </div>

            {/* Live KPI Quick Pills */}
            <div className="flex items-center gap-3 text-xs overflow-x-auto pb-1 lg:pb-0">
              <div className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-300 flex items-center gap-2 whitespace-nowrap">
                <span className="font-bold">{approvedFilms.length}</span>
                <span className="text-[11px] text-gray-400">Live Films</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 flex items-center gap-2 whitespace-nowrap">
                <span className="font-bold">{pendingSubmissions.length}</span>
                <span className="text-[11px] text-gray-400">Pending Review</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-300 flex items-center gap-2 whitespace-nowrap">
                <span className="font-bold">{reels.length}</span>
                <span className="text-[11px] text-gray-400">Reels</span>
              </div>
            </div>

          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, director, or language..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60"
              />
            </div>

            {activeTab === 'films' && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-gray-400">Status:</span>
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === 'all'
                      ? 'bg-white/15 text-white border border-white/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  All ({films.length})
                </button>
                <button
                  onClick={() => setStatusFilter('approved')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === 'approved'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Approved ({approvedFilms.length})
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === 'pending'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Pending ({pendingSubmissions.length})
                </button>
              </div>
            )}
          </div>

          {/* Active Tab View: FILMS */}
          {activeTab === 'films' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                    <th className="py-3 px-4">Film & Poster</th>
                    <th className="py-3 px-4">Director / Creator</th>
                    <th className="py-3 px-4">Language & Genre</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Rating & Views</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {displayedFilms.map((film) => (
                    <tr key={film.id} className="hover:bg-white/[0.02] transition-colors group">
                      
                      {/* Film & Poster */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={film.posterUrl}
                            alt={film.title}
                            referrerPolicy="no-referrer"
                            className="h-12 w-9 rounded-lg object-cover border border-white/10"
                          />
                          <div>
                            <p className="font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">{film.title}</p>
                            <p className="text-[11px] text-gray-400">{film.duration}</p>
                          </div>
                        </div>
                      </td>

                      {/* Director */}
                      <td className="py-3 px-4">
                        <p className="font-medium text-white">{film.director}</p>
                        <p className="text-[11px] text-gray-400">{film.creatorName}</p>
                      </td>

                      {/* Language & Genre */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[10px] font-semibold mr-1.5">
                          {film.language}
                        </span>
                        <span className="text-[11px] text-gray-400">{film.genre}</span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {film.status === 'pending' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold text-[10px]">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                            Pending Review
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold text-[10px]">
                            <Check className="h-3 w-3" />
                            Live on OTT
                          </span>
                        )}
                      </td>

                      {/* Rating & Views */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 font-bold text-yellow-400">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span>{film.rating}</span>
                        </div>
                        <p className="text-[11px] text-gray-400">{film.viewsCount?.toLocaleString() || 0} views</p>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onSelectFilm(film)}
                            className="p-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
                            title="Play Film / Screener"
                          >
                            <Play className="h-3.5 w-3.5 fill-current" />
                          </button>
                          
                          <button
                            onClick={() => onViewDetails(film)}
                            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors"
                            title="View Metadata Details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {film.status === 'pending' ? (
                            <button
                              onClick={() => onUpdateFilmStatus(film.id, 'approved')}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold transition-colors"
                            >
                              Approve
                            </button>
                          ) : (
                            <button
                              onClick={() => onToggleFeatureFilm(film.id)}
                              className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold border transition-colors ${
                                film.isFeatured
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                              }`}
                            >
                              {film.isFeatured ? '★ Featured' : 'Feature'}
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Active Tab View: QUEUE */}
          {activeTab === 'queue' && (
            <div className="space-y-4">
              {pendingSubmissions.length === 0 ? (
                <div className="py-12 text-center text-gray-400 space-y-2">
                  <Check className="h-10 w-10 text-emerald-400 mx-auto" />
                  <p className="font-bold text-white">All submissions are reviewed!</p>
                  <p className="text-xs">No pending films in the queue right now.</p>
                </div>
              ) : (
                pendingSubmissions.map((film) => (
                  <div key={film.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={film.posterUrl} alt={film.title} className="h-16 w-12 rounded-lg object-cover border border-white/10" />
                      <div>
                        <h4 className="font-bold text-white text-sm">{film.title}</h4>
                        <p className="text-xs text-gray-400">By {film.director} • {film.language} • {film.genre}</p>
                        <p className="text-xs text-gray-300 mt-1 line-clamp-1">{film.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onSelectFilm(film)}
                        className="px-3 py-2 rounded-xl bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 text-xs font-semibold"
                      >
                        Preview Screener
                      </button>
                      <button
                        onClick={() => onUpdateFilmStatus(film.id, 'approved')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                      >
                        Approve & Publish
                      </button>
                      <button
                        onClick={() => onUpdateFilmStatus(film.id, 'changes_requested')}
                        className="px-3 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 text-xs font-bold"
                      >
                        Request Changes
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Active Tab View: CREATORS */}
          {activeTab === 'creators' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {creators.map(creator => (
                <div key={creator.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex items-center gap-3">
                  <img
                    src={creator.avatar || creator.avatarUrl}
                    alt={creator.name}
                    className="h-12 w-12 rounded-full object-cover border border-purple-500/30"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-xs truncate">{creator.name}</h4>
                    <p className="text-[11px] text-gray-400 truncate">{creator.role || 'Filmmaker'}</p>
                    <span className="text-[10px] text-purple-400 font-semibold">{creator.filmographyCount || 1} Films</span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
