import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Film, 
  PlaySquare, 
  User as UserIcon, 
  Sparkles, 
  Eye, 
  Heart, 
  Clapperboard, 
  Building2, 
  Star,
  Play
} from 'lucide-react';
import { ShortFilm, ReelVideo, Creator } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  allFilms: ShortFilm[];
  allReels: ReelVideo[];
  allCreators: Creator[];
  onSelectFilm: (film: ShortFilm) => void;
  onSelectReel: (reel: ReelVideo) => void;
  onSelectCreator: (creatorId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  allFilms,
  allReels,
  allCreators,
  onSelectFilm,
  onSelectReel,
  onSelectCreator
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'films' | 'reels' | 'creators' | 'brands'>('all');

  const POPULAR_TAGS = ['Hindi', 'Kannada', 'Tamil', 'Telugu', 'Drama', 'Thriller', 'Comedy', 'Indie', 'Harri Kumar'];

  // Filter results based on query
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        films: allFilms.slice(0, 4),
        reels: allReels.slice(0, 4),
        creators: allCreators.slice(0, 4)
      };
    }

    const films = allFilms.filter(f => 
      f.title.toLowerCase().includes(q) ||
      f.genre.toLowerCase().includes(q) ||
      f.language.toLowerCase().includes(q) ||
      f.creatorName.toLowerCase().includes(q) ||
      f.director.toLowerCase().includes(q) ||
      f.tags.some(t => t.toLowerCase().includes(q))
    );

    const reels = allReels.filter(r => 
      r.title.toLowerCase().includes(q) ||
      r.creatorName.toLowerCase().includes(q) ||
      r.creatorHandle.toLowerCase().includes(q) ||
      r.musicTitle.toLowerCase().includes(q) ||
      r.tags.some(t => t.toLowerCase().includes(q))
    );

    const creators = allCreators.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.handle.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.bio.toLowerCase().includes(q) ||
      c.genres.some(g => g.toLowerCase().includes(q))
    );

    return { films, reels, creators };
  }, [query, allFilms, allReels, allCreators]);

  if (!isOpen) return null;

  return (
    <div 
      id="search-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/95 shadow-2xl p-4 sm:p-6 my-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-amber-400" />
          <input
            id="search-main-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search films, vertical reels, directors, or brands..."
            autoFocus
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 py-3.5 pl-12 pr-12 text-sm sm:text-base text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none shadow-inner"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 rounded-lg p-1 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="absolute right-4 rounded-lg p-1 text-slate-500 hover:text-white text-xs font-bold"
            >
              ESC
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-amber-500 text-black shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setActiveFilter('films')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              activeFilter === 'films'
                ? 'bg-amber-500 text-black shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Film className="h-3.5 w-3.5" />
            <span>Films ({filteredResults.films.length})</span>
          </button>
          <button
            onClick={() => setActiveFilter('reels')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              activeFilter === 'reels'
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <PlaySquare className="h-3.5 w-3.5" />
            <span>Reels ({filteredResults.reels.length})</span>
          </button>
          <button
            onClick={() => setActiveFilter('creators')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              activeFilter === 'creators'
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <UserIcon className="h-3.5 w-3.5" />
            <span>Creators ({filteredResults.creators.length})</span>
          </button>
        </div>

        {/* Popular Tags suggestions */}
        {!query && (
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
            <span className="text-[11px] font-bold text-slate-500">Popular:</span>
            {POPULAR_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="rounded-lg bg-slate-800/60 border border-slate-700/60 px-2 py-0.5 text-[11px] text-slate-300 hover:text-amber-400 hover:border-amber-400/40 transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto space-y-6 pr-1">

          {/* 1. SHORT FILMS */}
          {(activeFilter === 'all' || activeFilter === 'films') && filteredResults.films.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Film className="h-3.5 w-3.5" />
                <span>Short Films & Trailers ({filteredResults.films.length})</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredResults.films.map(film => (
                  <div
                    key={film.id}
                    onClick={() => {
                      onSelectFilm(film);
                      onClose();
                    }}
                    className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-2.5 hover:border-amber-500/40 hover:bg-slate-800/40 cursor-pointer transition-all group"
                  >
                    <div className="relative h-16 w-24 rounded-xl overflow-hidden bg-black shrink-0">
                      <img src={film.posterUrl} alt={film.title} referrerPolicy="no-referrer" className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                      <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-[9px] text-white font-mono">{film.duration}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold text-white group-hover:text-amber-400 truncate">{film.title}</h5>
                      <p className="text-[11px] text-slate-400 truncate">by {film.creatorName}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span className="text-amber-400 font-semibold">{film.language}</span>
                        <span>•</span>
                        <span>{film.genre}</span>
                        <span>•</span>
                        <span>{film.viewsCount.toLocaleString()} views</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. VERTICAL REELS */}
          {(activeFilter === 'all' || activeFilter === 'reels') && filteredResults.reels.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <PlaySquare className="h-3.5 w-3.5" />
                <span>Vertical Reels & Shorts ({filteredResults.reels.length})</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {filteredResults.reels.map(reel => (
                  <div
                    key={reel.id}
                    onClick={() => {
                      onSelectReel(reel);
                      onClose();
                    }}
                    className="group relative aspect-[9/14] rounded-2xl overflow-hidden bg-black border border-slate-800 hover:border-red-500/40 cursor-pointer transition-all shadow-lg"
                  >
                    <img src={reel.posterUrl} alt={reel.title} referrerPolicy="no-referrer" className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-2.5 flex flex-col justify-end">
                      <p className="text-xs font-bold text-white truncate">{reel.title}</p>
                      <p className="text-[10px] text-slate-400 truncate">{reel.creatorHandle}</p>
                      <div className="flex items-center gap-2 text-[9px] text-slate-400 mt-0.5">
                        <span>{reel.viewsCount.toLocaleString()} views</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. CREATORS & BRANDS */}
          {(activeFilter === 'all' || activeFilter === 'creators') && filteredResults.creators.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <UserIcon className="h-3.5 w-3.5" />
                <span>Creators & Filmmakers ({filteredResults.creators.length})</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredResults.creators.map(creator => (
                  <div
                    key={creator.id}
                    onClick={() => {
                      onSelectCreator(creator.id);
                      onClose();
                    }}
                    className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-3 hover:border-purple-500/40 hover:bg-slate-800/40 cursor-pointer transition-all group"
                  >
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      referrerPolicy="no-referrer"
                      className="h-12 w-12 rounded-full object-cover border border-purple-500/40 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h5 className="text-xs font-bold text-white group-hover:text-purple-300 truncate">{creator.name}</h5>
                        {creator.isVerified && (
                          <span className="text-amber-400 text-[10px]">✓</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{creator.role}</p>
                      <p className="text-[10px] text-slate-500 truncate">{creator.followersCount.toLocaleString()} followers</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredResults.films.length === 0 && filteredResults.reels.length === 0 && filteredResults.creators.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <Search className="h-8 w-8 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300">No results found for "{query}"</p>
              <p className="text-xs text-slate-500">Try searching for a different keyword, director name, or genre.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
