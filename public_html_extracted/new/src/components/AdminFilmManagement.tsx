import React, { useState, useMemo } from 'react';
import { 
  Film, 
  Search, 
  Filter, 
  Play, 
  Star, 
  Flame, 
  Trash2, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Eye,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { ShortFilm } from '../types';
import { PlatformStore } from '../services/platformStore';

interface AdminFilmManagementProps {
  films: ShortFilm[];
  onUpdateFilms: (films: ShortFilm[]) => void;
  onSelectFilm: (film: ShortFilm) => void;
  onOpenSubmitFilm: () => void;
  onToast: (msg: string) => void;
}

export const AdminFilmManagement: React.FC<AdminFilmManagementProps> = ({
  films,
  onUpdateFilms,
  onSelectFilm,
  onOpenSubmitFilm,
  onToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const languages = ['All', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Malayalam', 'Gujarati', 'Bengali', 'Marathi', 'English'];
  const genres = ['All', 'Drama', 'Thriller', 'Mystery', 'Comedy', 'Folk Folklore', 'Documentary', 'Indie Experimental', 'Romance', 'Action'];
  const statuses = ['All', 'approved', 'pending', 'rejected'];

  const filteredFilms = useMemo(() => {
    return films.filter(film => {
      const matchesSearch = 
        film.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        film.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (film.cast && film.cast.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesLang = selectedLanguage === 'All' || film.language.toLowerCase() === selectedLanguage.toLowerCase();
      const matchesGenre = selectedGenre === 'All' || film.genre.toLowerCase() === selectedGenre.toLowerCase();
      const matchesStatus = selectedStatus === 'All' || 
        (selectedStatus === 'approved' && (film.status === 'approved' || film.status === 'published')) ||
        film.status === selectedStatus;

      return matchesSearch && matchesLang && matchesGenre && matchesStatus;
    });
  }, [films, searchQuery, selectedLanguage, selectedGenre, selectedStatus]);

  const handleToggleFeatured = (filmId: string) => {
    const updated = films.map(f => {
      if (f.id === filmId) {
        const next = !f.isFeatured;
        onToast(`Toggled Featured status for "${f.title}" (${next ? 'Featured' : 'Standard'})`);
        return { ...f, isFeatured: next };
      }
      return f;
    });
    onUpdateFilms(updated);
    PlatformStore.saveFilms(updated);
  };

  const handleToggleTrending = (filmId: string) => {
    const updated = films.map(f => {
      if (f.id === filmId) {
        const next = !f.isTrending;
        onToast(`Toggled Trending status for "${f.title}" (${next ? 'Trending' : 'Standard'})`);
        return { ...f, isTrending: next };
      }
      return f;
    });
    onUpdateFilms(updated);
    PlatformStore.saveFilms(updated);
  };

  const handleToggleStatus = (filmId: string) => {
    const updated = films.map(f => {
      if (f.id === filmId) {
        const nextStatus = f.status === 'approved' || f.status === 'published' ? 'pending' : 'approved';
        onToast(`Changed status for "${f.title}" to ${nextStatus}`);
        return { ...f, status: nextStatus };
      }
      return f;
    });
    onUpdateFilms(updated);
    PlatformStore.saveFilms(updated);
  };

  const handleDeleteFilm = (filmId: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from the catalog?`)) {
      const updated = films.filter(f => f.id !== filmId);
      onUpdateFilms(updated);
      PlatformStore.deleteFilm(filmId);
      onToast(`Removed "${title}" from catalog`);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Film Catalog Management
          </h1>
          <p className="text-xs text-cinema-muted mt-1">
            Publish, feature, mark trending, or archive short films
          </p>
        </div>
        <button
          onClick={onOpenSubmitFilm}
          className="px-4 py-2.5 rounded-xl bg-cinema-accent hover:bg-cinema-accentHover text-white text-xs font-bold shadow-lg shadow-cinema-accent/25 transition-all flex items-center gap-2 self-start sm:self-auto hover:scale-[1.02]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Film</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-cinema-card rounded-2xl p-4 border border-cinema-border flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search films by title or director..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-cinema-surface border border-cinema-border text-xs text-white placeholder-cinema-muted focus:outline-none focus:border-cinema-accent transition-colors"
          />
          <Search className="w-4 h-4 text-cinema-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Language filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-2 rounded-xl bg-cinema-surface border border-cinema-border text-xs text-cinema-muted focus:text-white focus:outline-none focus:border-cinema-accent cursor-pointer"
          >
            {languages.map(l => (
              <option key={l} value={l} className="bg-cinema-surface text-white">
                {l === 'All' ? 'All Languages' : l}
              </option>
            ))}
          </select>

          {/* Genre filter */}
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-3 py-2 rounded-xl bg-cinema-surface border border-cinema-border text-xs text-cinema-muted focus:text-white focus:outline-none focus:border-cinema-accent cursor-pointer"
          >
            {genres.map(g => (
              <option key={g} value={g} className="bg-cinema-surface text-white">
                {g === 'All' ? 'All Genres' : g}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-cinema-surface border border-cinema-border text-xs text-cinema-muted focus:text-white focus:outline-none focus:border-cinema-accent cursor-pointer"
          >
            <option value="All" className="bg-cinema-surface text-white">All Statuses</option>
            <option value="approved" className="bg-cinema-surface text-white">Published</option>
            <option value="pending" className="bg-cinema-surface text-white">Pending</option>
            <option value="rejected" className="bg-cinema-surface text-white">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Catalog Table matching Reference */}
      <div className="bg-cinema-card rounded-3xl border border-cinema-border overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cinema-surface border-b border-cinema-border text-cinema-muted uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4">Film</th>
                <th className="p-4">Director</th>
                <th className="p-4">Language</th>
                <th className="p-4">Views / Rating</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cinema-border/50">
              {filteredFilms.length > 0 ? (
                filteredFilms.map((film) => {
                  const isPublished = film.status === 'approved' || film.status === 'published';
                  const isPending = film.status === 'pending' || film.status === 'changes_requested';
                  const isRejected = film.status === 'rejected';

                  return (
                    <tr key={film.id} className="hover:bg-cinema-surface/50 transition-colors">
                      {/* Film Thumbnail & Info */}
                      <td className="p-4 flex items-center gap-3">
                        <div 
                          onClick={() => onSelectFilm(film)}
                          className="relative w-10 h-14 rounded-lg overflow-hidden border border-cinema-border flex-shrink-0 bg-cinema-surface cursor-pointer group"
                        >
                          <img
                            src={film.posterUrl || '/harri-kumar.jpg'}
                            alt={film.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Play className="w-4 h-4 text-white fill-white" />
                          </div>
                        </div>
                        <div>
                          <span 
                            onClick={() => onSelectFilm(film)}
                            className="font-bold text-white block text-sm hover:text-cinema-accent cursor-pointer transition-colors"
                          >
                            {film.title}
                          </span>
                          <span className="text-[11px] text-cinema-muted">
                            {film.releaseYear || 2026} • {film.genre} • {film.duration}
                          </span>
                        </div>
                      </td>

                      {/* Director */}
                      <td className="p-4 font-semibold text-gray-200">
                        {film.director}
                      </td>

                      {/* Language */}
                      <td className="p-4 text-cinema-teal font-semibold">
                        {film.language}
                      </td>

                      {/* Views / Rating */}
                      <td className="p-4">
                        <div className="text-white font-bold font-mono">
                          {(film.viewsCount || 0).toLocaleString()} views
                        </div>
                        <div className="text-cinema-gold font-semibold">
                          ★ {(film.rating || 4.8).toFixed(1)} ({film.reviewsCount || 14})
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleStatus(film.id)}
                          title="Click to toggle status"
                          className="focus:outline-none transition-transform active:scale-95"
                        >
                          {isPublished && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Published</span>
                            </span>
                          )}
                          {isPending && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              <Clock className="w-3 h-3" />
                              <span>Pending</span>
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                              <XCircle className="w-3 h-3" />
                              <span>Rejected</span>
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Trending toggle */}
                          <button
                            onClick={() => handleToggleTrending(film.id)}
                            title={film.isTrending ? 'Marked Trending' : 'Mark as Trending'}
                            className={`p-2 rounded-xl transition-all ${
                              film.isTrending 
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' 
                                : 'bg-cinema-surface hover:bg-cinema-card text-cinema-muted hover:text-white border border-cinema-border'
                            }`}
                          >
                            <Flame className="w-3.5 h-3.5 fill-current" />
                          </button>

                          {/* Featured toggle */}
                          <button
                            onClick={() => handleToggleFeatured(film.id)}
                            title={film.isFeatured ? 'Featured on Platform' : 'Feature this Film'}
                            className={`p-2 rounded-xl transition-all ${
                              film.isFeatured 
                                ? 'bg-cinema-gold/20 text-cinema-gold border border-cinema-gold/40' 
                                : 'bg-cinema-surface hover:bg-cinema-card text-cinema-muted hover:text-white border border-cinema-border'
                            }`}
                          >
                            <Star className="w-3.5 h-3.5 fill-current" />
                          </button>

                          {/* Play screener */}
                          <button
                            onClick={() => onSelectFilm(film)}
                            title="Play Video"
                            className="p-2 rounded-xl bg-cinema-surface hover:bg-cinema-accent hover:text-white text-cinema-muted border border-cinema-border transition-all"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteFilm(film.id, film.title)}
                            title="Archive / Remove"
                            className="p-2 rounded-xl bg-cinema-surface hover:bg-red-600 hover:text-white text-cinema-muted border border-cinema-border transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-cinema-muted">
                    <Film className="w-10 h-10 mx-auto text-cinema-border mb-3" />
                    <p className="font-bold text-white text-sm">No short films found</p>
                    <p className="text-xs text-cinema-muted mt-1">Try adjusting your search criteria or filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table summary footer */}
        <div className="p-4 bg-cinema-surface border-t border-cinema-border flex items-center justify-between text-xs text-cinema-muted">
          <span>
            Showing <strong className="text-white">{filteredFilms.length}</strong> of{' '}
            <strong className="text-white">{films.length}</strong> short films
          </span>
          <span className="text-[11px]">Database synchronized</span>
        </div>
      </div>
    </div>
  );
};
