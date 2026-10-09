import React, { useState, useMemo } from 'react';
import { 
  Film, 
  Inbox, 
  Search
} from 'lucide-react';
import { ShortFilm, Creator, User, ReelVideo } from '../types';
import { FilmCard } from './FilmCard';
import { FilmCarouselRow } from './FilmCarouselRow';
import { HeroSection } from './HeroSection';

interface OverviewPageProps {
  films: ShortFilm[];
  creators: Creator[];
  reels: ReelVideo[];
  currentUser: User | null;
  onSelectFilm: (film: ShortFilm) => void;
  onViewDetails: (film: ShortFilm) => void;
  onNavigateTab: (tab: string) => void;
  onOpenSubmitFilm: () => void;
  onLikeFilm: (filmId: string) => void;
  onSaveFilm: (filmId: string) => void;
  savedFilmIds?: string[];
  onSelectCreator: (creatorId: string) => void;
  onUpdateFilmStatus?: (filmId: string, status: any) => void;
  onToggleFeatureFilm?: (filmId: string) => void;
  onOpenAuth?: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  films,
  creators,
  reels,
  currentUser,
  onSelectFilm,
  onViewDetails,
  onNavigateTab,
  onOpenSubmitFilm,
  onLikeFilm,
  onSaveFilm,
  savedFilmIds = [],
  onSelectCreator,
  onUpdateFilmStatus,
  onToggleFeatureFilm,
  onOpenAuth = () => {}
}) => {
  // Search and filter state from Hero / Search Section
  const [activeFilters, setActiveFilters] = useState<{
    query: string;
    genre: string;
    language: string;
    category: string;
    duration: string;
  }>({
    query: '',
    genre: 'All',
    language: 'All',
    category: 'All',
    duration: 'All'
  });

  const [selectedLanguageChip, setSelectedLanguageChip] = useState<string>('All');

  // Compute approved films
  const approvedFilms = useMemo(() => {
    return films.filter(f => f.status === 'approved' || f.status === 'published' || !f.status);
  }, [films]);

  const featuredFilm = useMemo(() => {
    return approvedFilms.find(f => f.isFeatured) || approvedFilms[0] || films[0];
  }, [approvedFilms, films]);

  // Filtered films based on search in Hero
  const filteredSearchResults = useMemo(() => {
    return approvedFilms.filter(film => {
      // Query filter
      if (activeFilters.query.trim()) {
        const q = activeFilters.query.toLowerCase();
        const matchesTitle = film.title?.toLowerCase().includes(q);
        const matchesDirector = film.director?.toLowerCase().includes(q);
        const matchesCast = film.cast?.some(c => c.toLowerCase().includes(q));
        const matchesGenre = film.genre?.toLowerCase().includes(q);
        const matchesDesc = film.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDirector && !matchesCast && !matchesGenre && !matchesDesc) {
          return false;
        }
      }
      // Genre filter
      if (activeFilters.genre !== 'All' && film.genre !== activeFilters.genre) {
        return false;
      }
      // Language filter
      if (activeFilters.language !== 'All' && film.language !== activeFilters.language) {
        return false;
      }
      // Category filter
      if (activeFilters.category !== 'All') {
        const type = film.contentType === 'movie' ? 'Movie' : 'Short Film';
        if (type !== activeFilters.category) return false;
      }
      // Duration filter
      if (activeFilters.duration !== 'All') {
        const durNumber = parseInt(film.duration, 10) || 15;
        if (activeFilters.duration === 'Under 10 mins' && durNumber >= 10) return false;
        if (activeFilters.duration === '10 - 25 mins' && (durNumber < 10 || durNumber > 25)) return false;
        if (activeFilters.duration === '25+ mins' && durNumber < 25) return false;
      }
      return true;
    });
  }, [approvedFilms, activeFilters]);

  const isSearchActive = activeFilters.query || activeFilters.genre !== 'All' || activeFilters.language !== 'All' || activeFilters.category !== 'All' || activeFilters.duration !== 'All';

  // 4 Horizontal Carousel Collections matching reference:
  // 1. Featured Films
  const featuredRowFilms = useMemo(() => {
    const list = approvedFilms.filter(f => f.isFeatured || f.rating >= 8.5);
    return list.length > 0 ? list : approvedFilms;
  }, [approvedFilms]);

  // 2. Trending Films
  const trendingRowFilms = useMemo(() => {
    const list = approvedFilms.filter(f => f.isTrending || (f.viewsCount && f.viewsCount > 10000));
    return list.length > 0 ? list : approvedFilms.slice().reverse();
  }, [approvedFilms]);

  // 3. New Releases
  const newReleasesRowFilms = useMemo(() => {
    const list = approvedFilms.filter(f => f.isNewRelease || f.releaseYear >= 2024);
    return list.length > 0 ? list : approvedFilms;
  }, [approvedFilms]);

  // Filter creators (exclude Harri Kumar from general list since he has dedicated section)
  const generalCreators = useMemo(() => {
    return creators.filter(c => 
      !c.name.toLowerCase().includes('harri') && !c.name.toLowerCase().includes('gowda')
    );
  }, [creators]);

  return (
    <div id="overview-dashboard-page" className="space-y-12 sm:space-y-16 pb-20 text-gray-200">
      
      {/* 1. HERO SECTION (Clean, Centered, No Spotlight Video, Exact Text & Buttons) */}
      <HeroSection
        featuredFilm={featuredFilm}
        onPlayFilm={onSelectFilm}
        onGoToReels={() => onNavigateTab('reels')}
        onOpenUpload={onOpenSubmitFilm}
        onExploreDiscover={() => onNavigateTab('films')}
        onFilterSearch={(filters) => {
          setActiveFilters(filters);
        }}
      />

      {/* Main Content Aligned Grid (Navbar, Hero, Rows, and Footer All Share max-w-7xl) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* SEARCH RESULTS DISPLAY (If user is searching or filtering) */}
        {isSearchActive && (
          <section id="search-active-results" className="relative py-4 space-y-6">
            <div className="flex items-center justify-between border-b border-purple-500/30 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-purple-400">
                  <Search className="h-4 w-4" />
                  <span>Search & Filter Results</span>
                </div>
                <h2 className="cinematic-title text-2xl font-black text-white mt-1">
                  Matching Films ({filteredSearchResults.length})
                </h2>
              </div>
              <button
                onClick={() => setActiveFilters({ query: '', genre: 'All', language: 'All', category: 'All', duration: 'All' })}
                className="text-xs text-purple-400 hover:text-purple-300 font-bold underline cursor-pointer"
              >
                Clear Search
              </button>
            </div>

            {filteredSearchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {filteredSearchResults.map(film => (
                  <FilmCard
                    key={film.id}
                    film={film}
                    onPlay={onSelectFilm}
                    onViewDetails={onViewDetails}
                    onToggleSave={onSaveFilm}
                    currentUser={currentUser}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center text-gray-400">
                <Film className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                <p className="text-white font-bold">No films match your search</p>
                <p className="text-xs mt-1">Try resetting filters or searching with different keywords.</p>
              </div>
            )}
          </section>
        )}

        {/* 2. FEATURED FILM ROWS (Featured, Trending, New Releases - Popular Removed Completely) */}
        <div id="featured-film-rows-container" className="space-y-10 sm:space-y-14">
          
          {/* ROW 1: FEATURED FILMS CAROUSEL */}
          <FilmCarouselRow
            id="featured-films-carousel"
            title="Featured Films"
            subtitle="Curated independent festival winners and high-rating screeners."
            badge="Curator's Choice"
            films={featuredRowFilms}
            onPlayFilm={onSelectFilm}
            onViewDetails={onViewDetails}
            onToggleSave={onSaveFilm}
            currentUser={currentUser}
            onViewAll={() => onNavigateTab('films')}
          />

          {/* ROW 2: TRENDING FILMS CAROUSEL */}
          <FilmCarouselRow
            id="trending-films-carousel"
            title="Trending Films"
            subtitle="Most discussed and shared stories across social cinema circles."
            badge="Trending Now"
            films={trendingRowFilms}
            onPlayFilm={onSelectFilm}
            onViewDetails={onViewDetails}
            onToggleSave={onSaveFilm}
            currentUser={currentUser}
            onViewAll={() => onNavigateTab('films')}
          />

          {/* ROW 3: NEW RELEASES CAROUSEL */}
          <FilmCarouselRow
            id="new-releases-carousel"
            title="New Releases"
            subtitle="Fresh premieres and direct-from-edit room screener debuts."
            badge="Fresh Premieres"
            films={newReleasesRowFilms}
            onPlayFilm={onSelectFilm}
            onViewDetails={onViewDetails}
            onToggleSave={onSaveFilm}
            currentUser={currentUser}
            onViewAll={() => onNavigateTab('films')}
          />

        </div>

      </div>

    </div>
  );
};
