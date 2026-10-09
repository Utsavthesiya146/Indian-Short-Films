import React, { useState, useMemo } from 'react';
import { 
  Film, 
  Search, 
  Flame, 
  Star, 
  Sparkles, 
  SlidersHorizontal,
  PlusCircle,
  Play,
  X,
  Layers,
  ChevronDown
} from 'lucide-react';
import { ShortFilm, FilmGenre, IndianLanguage, User } from '../types';
import { FilmCard } from './FilmCard';

interface ProjectsGalleryPageProps {
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
  'Kannada',
  'Hindi',
  'Tamil',
  'Telugu',
  'Malayalam',
  'Bengali',
  'Marathi',
  'English'
];

export const ProjectsGalleryPage: React.FC<ProjectsGalleryPageProps> = ({
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
  const [sortBy, setSortBy] = useState<'all' | 'trending' | 'latest' | 'popular' | 'rating'>('all');

  const approvedFilms = useMemo(() => {
    return films.filter(f => f.status === 'approved' || f.status === 'published' || !f.status);
  }, [films]);

  const filteredFilms = useMemo(() => {
    return approvedFilms.filter(film => {
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = film.title?.toLowerCase().includes(q);
        const matchDirector = film.director?.toLowerCase().includes(q);
        const matchCast = film.cast?.some(c => c.toLowerCase().includes(q));
        const matchGenre = film.genre?.toLowerCase().includes(q);
        const matchLanguage = film.language?.toLowerCase().includes(q);
        const matchDesc = film.description?.toLowerCase().includes(q);
        if (!matchTitle && !matchDirector && !matchCast && !matchGenre && !matchLanguage && !matchDesc) {
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

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') return (b.viewsCount || 0) - (a.viewsCount || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'latest') return new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime();
      return 0;
    });
  }, [approvedFilms, searchTerm, selectedGenre, selectedLanguage, sortBy]);

  return (
    <div id="projects-gallery-page" className="py-8 sm:py-12 space-y-10 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-xs font-semibold text-purple-300">
            <Layers className="h-3.5 w-3.5 text-purple-400" />
            <span>Curated Short Films & Projects Gallery</span>
          </div>
          <h1 className="cinematic-title text-3xl sm:text-4xl lg:text-5xl font-black text-white">
            Indian Cinema <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">Showcase</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl">
            Explore authentic independent short films, festival winners, and narrative cinema across Kannada, Hindi, Tamil, Telugu, and regional languages.
          </p>
        </div>

        <button
          onClick={onOpenSubmit}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-purple-600/30 hover:scale-105 transition-all cursor-pointer w-full md:w-auto shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          <span>+ Submit Your Film</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5">
        
        {/* Top Search Input & Sort Selector */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search films by title, director, cast, keywords..."
              className="w-full rounded-2xl border border-white/10 bg-black/40 pl-11 pr-10 py-3 text-xs sm:text-sm text-white focus:border-purple-500 focus:outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-2xl border border-white/10 bg-[#0c0c16] px-4 py-3 text-xs sm:text-sm text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="all">Sort: Curated</option>
              <option value="popular">Sort: Most Streamed</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="latest">Sort: Newest Releases</option>
            </select>

            {(searchTerm || selectedGenre !== 'All' || selectedLanguage !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedGenre('All');
                  setSelectedLanguage('All');
                  setSortBy('all');
                }}
                className="text-xs text-purple-400 hover:underline px-3 py-3 font-semibold whitespace-nowrap cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Language Filter Chips */}
        <div className="space-y-1.5 pt-2 border-t border-white/5">
          <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Language:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {LANGUAGES.map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedLanguage === lang
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Genre Filter Chips */}
        <div className="space-y-1.5 pt-2 border-t border-white/5">
          <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Genre:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {GENRES.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedGenre === genre
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Films Count Banner */}
      <div className="flex items-center justify-between text-xs text-gray-400 px-1">
        <span>Showing <strong className="text-white">{filteredFilms.length}</strong> Films</span>
        <span>Filtered from {approvedFilms.length} catalog screeners</span>
      </div>

      {/* Film Cards Grid */}
      {filteredFilms.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredFilms.map(film => (
            <FilmCard
              key={film.id}
              film={film}
              onPlay={onPlayFilm}
              onViewDetails={onViewDetails}
              onToggleSave={onToggleSave}
              currentUser={currentUser}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-16 text-center space-y-3">
          <Film className="h-12 w-12 text-purple-400 mx-auto opacity-60" />
          <h3 className="text-lg font-bold text-white">No films found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            No projects matched your active filters. Try changing language or genre filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedGenre('All');
              setSelectedLanguage('All');
            }}
            className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-purple-500 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
};
