import React, { useState, useMemo } from 'react';
import { 
  Film, 
  Search, 
  Filter, 
  Play, 
  Info, 
  Star, 
  Flame, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  PlusCircle,
  LayoutGrid,
  List,
  Eye,
  Heart,
  Clock,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { ShortFilm, User, FilmGenre, IndianLanguage } from '../types';
import { PlatformStore } from '../services/platformStore';

interface FilmManagementPageProps {
  films: ShortFilm[];
  onSelectFilm: (film: ShortFilm) => void;
  onViewDetails: (film: ShortFilm) => void;
  onUpdateFilms: (films: ShortFilm[]) => void;
  onOpenSubmitFilm: () => void;
  currentUser: User | null;
}

export const FilmManagementPage: React.FC<FilmManagementPageProps> = ({
  films,
  onSelectFilm,
  onViewDetails,
  onUpdateFilms,
  onOpenSubmitFilm,
  currentUser
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'latest' | 'rating' | 'views' | 'title'>('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Distinct languages and genres from data
  const languages = ['All', 'Kannada', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Bengali', 'Marathi', 'English'];
  const genres = ['All', 'Drama', 'Thriller', 'Mystery', 'Comedy', 'Folk Folklore', 'Documentary', 'Indie Experimental', 'Romance', 'Action'];
  const statuses = ['All', 'approved', 'pending', 'changes_requested', 'rejected'];

  // Filtered and sorted films
  const filteredFilms = useMemo(() => {
    return films.filter(film => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = film.title?.toLowerCase().includes(q);
        const matchesDirector = film.director?.toLowerCase().includes(q);
        const matchesCast = film.cast?.some(c => c.toLowerCase().includes(q));
        const matchesGenre = film.genre?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDirector && !matchesCast && !matchesGenre) {
          return false;
        }
      }

      if (selectedLanguage !== 'All' && film.language !== selectedLanguage) {
        return false;
      }

      if (selectedGenre !== 'All' && film.genre !== selectedGenre) {
        return false;
      }

      if (selectedStatus !== 'All') {
        const filmStatus = film.status || 'approved';
        if (filmStatus !== selectedStatus) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'views') return (b.viewsCount || 0) - (a.viewsCount || 0);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0; // Default order
    });
  }, [films, searchQuery, selectedLanguage, selectedGenre, selectedStatus, sortBy]);

  // Actions
  const handleToggleFeature = (filmId: string) => {
    const updated = films.map(f => f.id === filmId ? { ...f, isFeatured: !f.isFeatured } : f);
    onUpdateFilms(updated);
    PlatformStore.saveFilms(updated);
    showToast('Featured status updated successfully');
  };

  const handleToggleTrending = (filmId: string) => {
    const updated = films.map(f => f.id === filmId ? { ...f, isTrending: !f.isTrending } : f);
    onUpdateFilms(updated);
    PlatformStore.saveFilms(updated);
    showToast('Trending status updated');
  };

  const handleDeleteFilm = (filmId: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from the catalog?`)) {
      const updated = films.filter(f => f.id !== filmId);
      onUpdateFilms(updated);
      PlatformStore.saveFilms(updated);
      showToast(`"${title}" was removed`);
    }
  };

  return (
    <div id="film-management-page" className="space-y-8 pb-16 text-gray-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 rounded-2xl bg-purple-600 px-5 py-3 text-xs font-bold text-white shadow-2xl animate-in fade-in slide-in-from-top-3">
          {toastMessage}
        </div>
      )}

      {/* 1. Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Catalog Database</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Film Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Manage your real film collection, update spotlights, edit languages, and view OTT streaming links.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSubmitFilm}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ Add New Film</span>
          </button>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, director, cast or genre..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:border-purple-500/60 focus:outline-none"
            />
          </div>

          {/* Language Filter */}
          <div>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#0d0d18] px-3.5 py-2.5 text-xs text-gray-200 focus:border-purple-500/60 focus:outline-none"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>Language: {lang}</option>
              ))}
            </select>
          </div>

          {/* Genre Filter */}
          <div>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#0d0d18] px-3.5 py-2.5 text-xs text-gray-200 focus:border-purple-500/60 focus:outline-none"
            >
              {genres.map(g => (
                <option key={g} value={g}>Genre: {g}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#0d0d18] px-3.5 py-2.5 text-xs text-gray-200 focus:border-purple-500/60 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="approved">Approved & Live</option>
              <option value="pending">Pending Review</option>
              <option value="changes_requested">Changes Requested</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

        </div>

        {/* View Toggle & Summary Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span>Showing <strong className="text-white">{filteredFilms.length}</strong> of {films.length} films</span>
            {(selectedLanguage !== 'All' || selectedGenre !== 'All' || selectedStatus !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedLanguage('All');
                  setSelectedGenre('All');
                  setSelectedStatus('All');
                  setSearchQuery('');
                }}
                className="text-purple-400 hover:underline font-semibold ml-2"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="rounded-xl border border-white/10 bg-[#0d0d18] px-2.5 py-1 text-xs text-white focus:outline-none"
              >
                <option value="latest">Latest</option>
                <option value="rating">Top Rated</option>
                <option value="views">Most Viewed</option>
                <option value="title">Alphabetical (A-Z)</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-purple-600 text-white shadow-xs' : 'text-gray-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-purple-600 text-white shadow-xs' : 'text-gray-400 hover:text-white'
                }`}
                title="Table View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Empty State */}
      {filteredFilms.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-12 text-center space-y-4">
          <Film className="h-12 w-12 text-gray-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Films Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            No films match your search or filter criteria. Try adjusting your filters or upload a new film.
          </p>
          <button
            onClick={onOpenSubmitFilm}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:scale-105 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Upload Short Film</span>
          </button>
        </div>
      )}

      {/* 4. Grid View */}
      {viewMode === 'grid' && filteredFilms.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredFilms.map((film) => (
            <div
              key={film.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-md transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.18)] hover:-translate-y-1"
            >
              {/* Poster frame */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                <img
                  src={film.posterUrl}
                  alt={film.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-black/60 border border-white/10 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-purple-300">
                    {film.language}
                  </span>
                  {film.isFeatured && (
                    <span className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      Featured
                    </span>
                  )}
                </div>

                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/70 border border-white/10 backdrop-blur-md px-2 py-0.5 text-[11px] font-bold text-yellow-400">
                  <Star className="h-3 w-3 fill-current" />
                  <span>{film.rating}</span>
                </div>

                {/* Quick Play Trigger */}
                <button
                  onClick={() => onSelectFilm(film)}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs cursor-pointer"
                >
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/50">
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  </div>
                </button>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-purple-300 transition-colors">
                    {film.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                    Dir. {film.director} • {film.duration}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                    {film.description}
                  </p>
                </div>

                {/* Actions & Toggles */}
                <div className="pt-3 border-t border-white/5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleToggleFeature(film.id)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-colors ${
                        film.isFeatured
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {film.isFeatured ? '★ Featured' : 'Feature'}
                    </button>

                    <button
                      onClick={() => handleToggleTrending(film.id)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-colors ${
                        film.isTrending
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {film.isTrending ? '🔥 Trending' : 'Trend'}
                    </button>

                    <button
                      onClick={() => onViewDetails(film)}
                      className="p-1.5 rounded-xl bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                      title="View Details"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteFilm(film.id, film.title)}
                      className="p-1.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete Film"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Table View */}
      {viewMode === 'table' && filteredFilms.length > 0 && (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 uppercase font-semibold text-[10px] tracking-wider bg-white/[0.02]">
                  <th className="py-4 px-4">Film & Poster</th>
                  <th className="py-4 px-4">Director</th>
                  <th className="py-4 px-4">Language / Genre</th>
                  <th className="py-4 px-4">Duration</th>
                  <th className="py-4 px-4">Rating</th>
                  <th className="py-4 px-4">Views</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredFilms.map((film) => (
                  <tr key={film.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={film.posterUrl}
                          alt={film.title}
                          referrerPolicy="no-referrer"
                          className="h-12 w-9 rounded-lg object-cover border border-white/10"
                        />
                        <div>
                          <p className="font-bold text-white group-hover:text-purple-300 transition-colors">{film.title}</p>
                          <p className="text-[10px] text-gray-400">{film.creatorName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-200">{film.director}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[10px] font-semibold mr-1">
                        {film.language}
                      </span>
                      <span className="text-[11px] text-gray-400">{film.genre}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{film.duration}</td>
                    <td className="py-3 px-4 font-bold text-yellow-400 flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      <span>{film.rating}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-300 tabular-nums">{film.viewsCount?.toLocaleString() || 0}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                        <CheckCircle2 className="h-3 w-3" />
                        Live
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectFilm(film)}
                          className="p-1.5 rounded-xl bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 transition-colors"
                          title="Stream Film"
                        >
                          <Play className="h-3.5 w-3.5 fill-current" />
                        </button>
                        <button
                          onClick={() => onViewDetails(film)}
                          className="p-1.5 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-colors"
                          title="Details"
                        >
                          <Info className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFilm(film.id, film.title)}
                          className="p-1.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
