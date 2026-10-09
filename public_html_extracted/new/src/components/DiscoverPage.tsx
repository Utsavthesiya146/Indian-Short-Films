import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Flame, 
  Star, 
  Clock, 
  Play, 
  Sparkles, 
  Globe, 
  Layers, 
  SlidersHorizontal,
  Bookmark,
  Heart,
  Clapperboard,
  Users,
  Film,
  Check
} from 'lucide-react';
import { ShortFilm, ReelVideo, Creator, FilmGenre, IndianLanguage, User } from '../types';

interface DiscoverPageProps {
  films: ShortFilm[];
  reels?: ReelVideo[];
  creators?: Creator[];
  onSelectFilm: (film: ShortFilm) => void;
  onSelectReel?: (reel: ReelVideo) => void;
  onSelectCreator?: (creatorId: string) => void;
  onOpenUpload?: () => void;
  currentUser: User | null;
  onLikeFilm: (filmId: string) => void;
  onSaveFilm: (filmId: string) => void;
  initialFilter?: string;
}

const GENRES: Array<'All' | FilmGenre> = [
  'All',
  'Drama',
  'Thriller',
  'Mystery',
  'Comedy',
  'Romance',
  'Sci-Fi',
  'Folk Folklore',
  'Documentary',
  'Indie Experimental'
];

const LANGUAGES: Array<'All' | IndianLanguage> = [
  'All',
  'Hindi',
  'Kannada',
  'Tamil',
  'Telugu',
  'Malayalam',
  'Bengali',
  'Marathi',
  'Punjabi',
  'English'
];

const CATEGORIES = [
  'All',
  'Short Film',
  'Documentary',
  'Animation',
  'Indie Spotlight',
  'Festival Winner'
];

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  films,
  reels = [],
  creators = [],
  onSelectFilm,
  onSelectReel,
  onSelectCreator,
  onOpenUpload,
  currentUser,
  onLikeFilm,
  onSaveFilm,
  initialFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<'All' | FilmGenre>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<'All' | IndianLanguage>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'trending' | 'views' | 'rating' | 'newest'>('trending');
  const [resultTypeTab, setResultTypeTab] = useState<'all' | 'films' | 'reels' | 'creators'>('all');

  // Filter films
  const filteredFilms = useMemo(() => {
    return films.filter((f) => {
      // Search term checks title, video, creator, actor, director, genre, language, category
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchTitle = f.title.toLowerCase().includes(query);
        const matchDesc = f.description.toLowerCase().includes(query);
        const matchDirector = f.director.toLowerCase().includes(query);
        const matchCreator = f.creatorName.toLowerCase().includes(query);
        const matchCast = f.cast?.some(c => c.toLowerCase().includes(query));
        const matchGenre = f.genre.toLowerCase().includes(query);
        const matchLang = f.language.toLowerCase().includes(query);
        const matchCat = f.category.toLowerCase().includes(query);
        const matchTags = f.tags?.some(t => t.toLowerCase().includes(query));

        if (!matchTitle && !matchDesc && !matchDirector && !matchCreator && !matchCast && !matchGenre && !matchLang && !matchCat && !matchTags) {
          return false;
        }
      }

      // Genre
      if (selectedGenre !== 'All' && f.genre !== selectedGenre) {
        return false;
      }

      // Language
      if (selectedLanguage !== 'All' && f.language !== selectedLanguage) {
        return false;
      }

      // Category
      if (selectedCategory !== 'All' && f.category !== selectedCategory) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'views') return b.viewsCount - a.viewsCount;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.releaseYear || 2026) - (a.releaseYear || 2026);
      return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0) || b.viewsCount - a.viewsCount;
    });
  }, [films, searchTerm, selectedGenre, selectedLanguage, selectedCategory, sortBy]);

  // Filter Reels / Short Videos
  const filteredReels = useMemo(() => {
    if (!searchTerm.trim() && selectedLanguage === 'All' && selectedCategory === 'All') {
      return reels;
    }
    const query = searchTerm.toLowerCase();
    return reels.filter(r => {
      const matchSearch = !query || 
        r.title.toLowerCase().includes(query) || 
        r.description.toLowerCase().includes(query) || 
        r.creatorName.toLowerCase().includes(query) || 
        r.creatorHandle.toLowerCase().includes(query) ||
        r.tags?.some(t => t.toLowerCase().includes(query)) ||
        r.language.toLowerCase().includes(query);

      const matchLang = selectedLanguage === 'All' || r.language === selectedLanguage;
      return matchSearch && matchLang;
    });
  }, [reels, searchTerm, selectedLanguage, selectedCategory]);

  // Filter Creators
  const filteredCreators = useMemo(() => {
    if (!searchTerm.trim()) return creators;
    const query = searchTerm.toLowerCase();
    return creators.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.handle.toLowerCase().includes(query) || 
      c.bio.toLowerCase().includes(query) ||
      c.designation.toLowerCase().includes(query)
    );
  }, [creators, searchTerm]);

  return (
    <div id="discover-page-container" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Header & Search Input */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
            Explore Indian Independent Cinema
          </span>
          <h1 className="cinematic-title text-2xl sm:text-3xl font-black text-white">
            Search Films, Reels & Creators
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search across titles, actors, directors, genres, languages, and creators.
          </p>
        </div>

        {/* Big Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-400" />
          <input
            id="discover-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by film title, actor, director, creator, genre, or language..."
            className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 py-3.5 pl-12 pr-10 text-sm text-white placeholder-slate-400 shadow-xl focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Result Category Tabs (All / Films / Reels / Creators) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <button
            onClick={() => setResultTypeTab('all')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              resultTypeTab === 'all'
                ? 'bg-amber-500 text-black shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>All Results</span>
            <span className="rounded-full bg-black/30 px-1.5 py-0.2 text-[10px]">
              {filteredFilms.length + filteredReels.length + filteredCreators.length}
            </span>
          </button>

          <button
            onClick={() => setResultTypeTab('films')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              resultTypeTab === 'films'
                ? 'bg-amber-500 text-black shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Film className="h-3.5 w-3.5" />
            <span>Short Films ({filteredFilms.length})</span>
          </button>

          <button
            onClick={() => setResultTypeTab('reels')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              resultTypeTab === 'reels'
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Clapperboard className="h-3.5 w-3.5" />
            <span>Reels ({filteredReels.length})</span>
          </button>

          <button
            onClick={() => setResultTypeTab('creators')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              resultTypeTab === 'creators'
                ? 'bg-amber-500 text-black shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Creators ({filteredCreators.length})</span>
          </button>
        </div>
      </div>

      {/* Multi-Dimensional Filter Controls */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-3.5 backdrop-blur-md">
        {/* Languages Strip */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Regional Language:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  selectedLanguage === lang
                    ? 'bg-amber-500 text-black font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Genres Strip */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Film Genre:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  selectedGenre === genre
                    ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Sort and Category Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-semibold text-white focus:outline-none"
            >
              <option value="trending">🔥 Trending First</option>
              <option value="rating">⭐ Highest Rated</option>
              <option value="views">👁 Most Viewed</option>
              <option value="newest">🆕 Newest Releases</option>
            </select>
          </div>

          <div className="text-slate-400">
            Showing <strong className="text-amber-400">{filteredFilms.length}</strong> films & <strong className="text-red-400">{filteredReels.length}</strong> reels
          </div>
        </div>
      </div>

      {/* RESULTS DISPLAY */}

      {/* 1. Creators Results (if all or creators) */}
      {(resultTypeTab === 'all' || resultTypeTab === 'creators') && filteredCreators.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Users className="h-4 w-4 text-amber-400" />
            <span>Creators & Filmmakers ({filteredCreators.length})</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCreators.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectCreator?.(c.id)}
                className="flex items-center gap-3.5 p-3 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-amber-400/60 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-amber-400 shrink-0">
                  <img src={c.avatar} alt={c.name} referrerPolicy="no-referrer" className="h-full w-full object-cover object-top" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-white truncate">{c.name}</h4>
                    {c.isVerified && <Sparkles className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />}
                  </div>
                  <p className="text-xs text-amber-300 truncate">{c.designation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Reels Results (if all or reels) */}
      {(resultTypeTab === 'all' || resultTypeTab === 'reels') && filteredReels.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Clapperboard className="h-4 w-4 text-red-400" />
            <span>Short Videos & Reels ({filteredReels.length})</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredReels.map((reel) => (
              <div
                key={reel.id}
                onClick={() => onSelectReel?.(reel)}
                className="group relative aspect-[9/14] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 cursor-pointer hover:border-red-500/60 transition-all hover:scale-[1.02]"
              >
                <img
                  src={reel.posterUrl}
                  alt={reel.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                <div className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white">
                  <Play className="h-3 w-3 fill-current" />
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 space-y-0.5">
                  <span className="text-[10px] font-bold text-amber-400 truncate block">{reel.creatorName}</span>
                  <p className="text-[11px] font-bold text-white line-clamp-2 leading-tight">{reel.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Short Films Grid (if all or films) */}
      {(resultTypeTab === 'all' || resultTypeTab === 'films') && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Film className="h-4 w-4 text-amber-400" />
            <span>Short Films ({filteredFilms.length})</span>
          </h3>

          {films.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Film className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-white">No short films uploaded yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Be the first creator, filmmaker, or production house to publish an independent short movie on Indian Short Movie!
              </p>
              {onOpenUpload && (
                <button
                  onClick={onOpenUpload}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-black hover:bg-amber-400"
                >
                  <span>Upload First Short Film</span>
                </button>
              )}
            </div>
          ) : filteredFilms.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-3">
              <Search className="h-10 w-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No films found matching your search</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try clearing your search keyword or switching the language/genre filter.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedGenre('All');
                  setSelectedLanguage('All');
                  setSelectedCategory('All');
                }}
                className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFilms.map((film) => {
                const isLiked = currentUser?.likedFilmIds.includes(film.id);
                const isSaved = currentUser?.savedFilmIds.includes(film.id);

                return (
                  <div
                    key={film.id}
                    id={`discover-card-${film.id}`}
                    onClick={() => onSelectFilm(film)}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 transition-all hover:-translate-y-1 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/10"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                      <img
                        src={film.posterUrl}
                        alt={film.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="rounded-lg bg-amber-500 px-2 py-0.5 text-[10px] font-extrabold text-black">
                          {film.genre}
                        </span>
                        <span className="rounded-lg bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                          {film.language}
                        </span>
                      </div>

                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-0.5 text-[11px] font-bold text-amber-400 backdrop-blur-md">
                        <Star className="h-3 w-3 fill-current" />
                        <span>{film.rating}</span>
                      </div>

                      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-md bg-black/80 px-2 py-0.5 text-[11px] font-mono text-slate-200">
                        <Clock className="h-3 w-3" />
                        <span>{film.duration}</span>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-black shadow-lg shadow-amber-500/50">
                          <Play className="h-6 w-6 translate-x-0.5 fill-current" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                        {film.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-400 leading-relaxed">
                        {film.description}
                      </p>
                      
                      {film.cast && film.cast.length > 0 && (
                        <p className="mt-1.5 text-[11px] text-slate-400 truncate">
                          Cast: <span className="text-slate-300">{film.cast.join(', ')}</span>
                        </p>
                      )}

                      <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400">
                        <span>Directed by <strong className="text-slate-200">{film.director}</strong></span>
                        <span>{film.viewsCount.toLocaleString()} views</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
