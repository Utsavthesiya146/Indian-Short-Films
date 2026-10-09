import React, { useState, useMemo } from 'react';
import { 
  Film, 
  Search, 
  Flame, 
  Star, 
  Sparkles, 
  Clapperboard, 
  SlidersHorizontal,
  ChevronDown,
  X,
  Check
} from 'lucide-react';
import { ShortFilm, FilmGenre, IndianLanguage, User } from '../types';
import { FilmCard } from './FilmCard';

interface MoviesPageProps {
  films: ShortFilm[];
  onPlayFilm: (film: ShortFilm) => void;
  onViewDetails: (film: ShortFilm) => void;
  onOpenSubmit: () => void;
  onToggleSave?: (filmId: string) => void;
  currentUser?: User | null;
}

const GENRES: Array<'All' | FilmGenre> = [
  'All',
  'Drama',
  'Thriller',
  'Mystery',
  'Comedy',
  'Romance',
  'Action',
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

export const MoviesPage: React.FC<MoviesPageProps> = ({
  films,
  onPlayFilm,
  onViewDetails,
  onOpenSubmit,
  onToggleSave,
  currentUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<'All' | FilmGenre>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<'All' | IndianLanguage>('All');
  const [sortBy, setSortBy] = useState<'all' | 'trending' | 'latest' | 'popular' | 'featured' | 'rating'>('all');

  // Filter movies (approved/published only)
  const approvedMovies = useMemo(() => {
    return films.filter(f => {
      const isLive = f.status === 'approved' || f.status === 'published';
      const isMovieFormat = f.contentType === 'movie' || f.contentType === undefined;
      return isLive && isMovieFormat;
    });
  }, [films]);

  const filteredMovies = useMemo(() => {
    return approvedMovies.filter(film => {
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = film.title?.toLowerCase().includes(q);
        const matchDirector = film.director?.toLowerCase().includes(q);
        const matchCast = film.cast?.some(c => c.toLowerCase().includes(q));
        const matchGenre = film.genre?.toLowerCase().includes(q);
        const matchLanguage = film.language?.toLowerCase().includes(q);
        if (!matchTitle && !matchDirector && !matchCast && !matchGenre && !matchLanguage) {
          return false;
        }
      }

      // Genre filter
      if (selectedGenre !== 'All' && film.genre !== selectedGenre) {
        return false;
      }

      // Language filter
      if (selectedLanguage !== 'All' && film.language !== selectedLanguage) {
        return false;
      }

      // Sort / category filters
      if (sortBy === 'trending' && !film.isTrending && (film.viewsCount || 0) < 1) {
        return false;
      }
      if (sortBy === 'featured' && !film.isFeatured) {
        return false;
      }
      if (sortBy === 'popular' && (film.likesCount || 0) < 1 && !film.isPopular) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'latest') return (b.releaseYear || 0) - (a.releaseYear || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'popular') return (b.likesCount || 0) - (a.likesCount || 0);
      return 0;
    });
  }, [approvedMovies, searchTerm, selectedGenre, selectedLanguage, sortBy]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedGenre('All');
    setSelectedLanguage('All');
    setSortBy('all');
  };

  const hasActiveFilters = searchTerm || selectedGenre !== 'All' || selectedLanguage !== 'All' || sortBy !== 'all';

  return (
    <div id="movies-page" className="min-h-screen bg-[#f5f5fa] text-[#222222] pb-16 pt-4 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner & Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#222222] tracking-tight">
            Curated Movies & Indie Premieres
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Discover {filteredMovies.length} curated Indian movies, indie releases, and premieres
          </p>
        </div>

        {/* Quick Search Input */}
        <div className="relative max-w-md w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search movies..."
            className="w-full rounded-md border border-gray-300 bg-white pl-9 pr-8 py-2 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:border-[#f84464] focus:outline-none shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Layout: Left Filter Sidebar + Right Movie Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Filters Panel (BookMyShow style collapsible filter boxes) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="font-bold text-sm text-[#222222]">Filters</span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#f84464] font-semibold hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Languages Filter */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Languages
              </span>
              <div className="flex flex-wrap gap-1.5">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold border transition-all ${
                      selectedLanguage === lang
                        ? 'bg-[#f84464] text-white border-[#f84464] shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#f84464] hover:text-[#f84464]'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Genres Filter */}
            <div className="space-y-2.5 border-t border-gray-100 pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Genres
              </span>
              <div className="flex flex-wrap gap-1.5">
                {GENRES.map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGenre(g)}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold border transition-all ${
                      selectedGenre === g
                        ? 'bg-[#f84464] text-white border-[#f84464] shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#f84464] hover:text-[#f84464]'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Column */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Sort & Filter Pills Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-gray-500 font-semibold mr-1">Sort:</span>
              {[
                { id: 'all', label: 'All' },
                { id: 'trending', label: '🔥 Trending' },
                { id: 'latest', label: 'Latest' },
                { id: 'rating', label: 'Top Rated' },
                { id: 'popular', label: 'Popular' }
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSortBy(pill.id as any)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                    sortBy === pill.id
                      ? 'bg-[#f84464] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Total Count */}
            <span className="text-xs font-bold text-gray-600">
              {filteredMovies.length} {filteredMovies.length === 1 ? 'Movie' : 'Movies'}
            </span>
          </div>

          {/* Applied Filter Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-500">Active filters:</span>
              {selectedLanguage !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-[#f84464]/10 text-[#f84464] px-2.5 py-0.5 rounded-full font-semibold">
                  Language: {selectedLanguage}
                  <button onClick={() => setSelectedLanguage('All')}><X className="h-3 w-3" /></button>
                </span>
              )}
              {selectedGenre !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-[#f84464]/10 text-[#f84464] px-2.5 py-0.5 rounded-full font-semibold">
                  Genre: {selectedGenre}
                  <button onClick={() => setSelectedGenre('All')}><X className="h-3 w-3" /></button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-800 px-2.5 py-0.5 rounded-full font-semibold">
                  Query: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')}><X className="h-3 w-3" /></button>
                </span>
              )}
            </div>
          )}

          {/* Movie Results Grid */}
          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4">
              {filteredMovies.map(movie => (
                <FilmCard
                  key={movie.id}
                  film={movie}
                  onPlay={onPlayFilm}
                  onViewDetails={onViewDetails}
                  onToggleSave={onToggleSave}
                  currentUser={currentUser}
                  aspect="portrait"
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-2xl border border-gray-200 bg-white p-8 sm:p-12 text-center space-y-4 shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f84464]/10 text-[#f84464]">
                <Clapperboard className="h-8 w-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-[#222222]">No Movies Found</h3>
                <p className="text-xs text-gray-500">
                  Try adjusting or clearing your filters to see more cinema releases.
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={clearAllFilters}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Clear Filters
                </button>
                <button
                  onClick={onOpenSubmit}
                  className="rounded-lg bg-[#f84464] hover:bg-[#e03352] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all"
                >
                  Submit Your Movie
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
