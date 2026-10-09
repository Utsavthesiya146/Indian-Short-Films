import React, { useState, useMemo, useEffect } from 'react';
import { 
  Play, 
  Flame, 
  Clock, 
  Star, 
  Sparkles, 
  Upload, 
  ArrowRight, 
  Film, 
  Bookmark, 
  Share2, 
  PlusCircle, 
  Compass, 
  Eye, 
  Award, 
  Clapperboard, 
  Info,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Heart,
  Calendar,
  Layers,
  Video
} from 'lucide-react';
import { ShortFilm, ReelVideo, Creator, User, FilmGenre, IndianLanguage } from '../types';
import { FilmCard } from './FilmCard';

interface HomeDiscoveryViewProps {
  films: ShortFilm[];
  reels: ReelVideo[];
  creators: Creator[];
  currentUser: User | null;
  onSelectFilm: (film: ShortFilm) => void;
  onViewDetails: (film: ShortFilm) => void;
  onSelectReel: (reel: ReelVideo) => void;
  onSelectCreator: (creatorId: string) => void;
  onOpenUpload: () => void;
  onGoToReels: () => void;
  onGoToDiscover: (filter?: string) => void;
  onGoToMovies?: () => void;
  onGoToShortFilms?: () => void;
  onLikeFilm?: (filmId: string) => void;
  onSaveFilm?: (filmId: string) => void;
}

const ALL_GENRES: Array<{ name: FilmGenre; icon: string; color: string }> = [
  { name: 'Drama', icon: '🎭', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { name: 'Thriller', icon: '⚡', color: 'bg-red-50 text-red-700 border-red-200' },
  { name: 'Mystery', icon: '🔍', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { name: 'Comedy', icon: '😄', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { name: 'Romance', icon: '❤️', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { name: 'Action', icon: '💥', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { name: 'Sci-Fi', icon: '🚀', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { name: 'Folk Folklore', icon: '🌿', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { name: 'Documentary', icon: '📽️', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Indie Experimental', icon: '🎨', color: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' },
];

const ALL_LANGUAGES: Array<{ name: IndianLanguage; native: string }> = [
  { name: 'Kannada', native: 'ಕನ್ನಡ' },
  { name: 'Hindi', native: 'हिंदी' },
  { name: 'Tamil', native: 'தமிழ்' },
  { name: 'Telugu', native: 'తెలుగు' },
  { name: 'Malayalam', native: 'മലയാളം' },
  { name: 'Marathi', native: 'मराठी' },
  { name: 'Bengali', native: 'বাংলা' },
  { name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { name: 'English', native: 'English' }
];

export const HomeDiscoveryView: React.FC<HomeDiscoveryViewProps> = ({
  films,
  reels,
  creators,
  currentUser,
  onSelectFilm,
  onViewDetails,
  onSelectReel,
  onSelectCreator,
  onOpenUpload,
  onGoToReels,
  onGoToDiscover,
  onGoToMovies,
  onGoToShortFilms,
  onLikeFilm,
  onSaveFilm
}) => {
  // Filter for approved/published films
  const liveFilms = useMemo(() => {
    return films.filter(f => f.status === 'approved' || f.status === 'published');
  }, [films]);

  // Featured films for the carousel
  const carouselFilms = useMemo(() => {
    const featured = liveFilms.filter(f => f.isFeatured);
    return featured.length > 0 ? featured.slice(0, 5) : liveFilms.slice(0, 5);
  }, [liveFilms]);

  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  // Auto-advance carousel every 6 seconds
  useEffect(() => {
    if (carouselFilms.length <= 1) return;
    const timer = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % carouselFilms.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [carouselFilms.length]);

  // Recommended movies
  const recommendedFilms = useMemo(() => {
    return liveFilms.slice(0, 8);
  }, [liveFilms]);

  // Trending films
  const trendingFilms = useMemo(() => {
    return liveFilms.filter(f => f.isTrending || (f.viewsCount && f.viewsCount > 0));
  }, [liveFilms]);

  // Latest short films
  const latestShortFilms = useMemo(() => {
    return [...liveFilms]
      .filter(f => f.contentType === 'short_film' || f.contentType === undefined)
      .sort((a, b) => (b.releaseYear || 0) - (a.releaseYear || 0));
  }, [liveFilms]);

  // New releases
  const newReleases = useMemo(() => {
    return liveFilms.filter(f => f.isNewRelease || (f.releaseYear && f.releaseYear >= 2025));
  }, [liveFilms]);

  // Stream premieres (BookMyShow Stream style)
  const streamPremieres = useMemo(() => {
    return liveFilms.filter(f => f.isFeatured || f.isNewRelease).slice(0, 4);
  }, [liveFilms]);

  const currentBannerFilm = carouselFilms[activeBannerIdx] || liveFilms[0];

  return (
    <div id="home-discovery-view" className="space-y-10 pb-16 bg-[#f5f5fa]">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. BOOKMYSHOW STYLE HERO BANNER CAROUSEL                      */}
      {/* ------------------------------------------------------------- */}
      <section id="hero-banner-carousel" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4">
        {currentBannerFilm ? (
          <div className="relative overflow-hidden rounded-2xl shadow-lg bg-black group">
            {/* Banner Backdrop */}
            <div className="relative h-64 sm:h-80 md:h-[420px] w-full overflow-hidden">
              <img
                src={currentBannerFilm.backdropUrl || currentBannerFilm.posterUrl}
                alt={currentBannerFilm.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center brightness-[0.6] transition-transform duration-700 group-hover:scale-105"
              />
              {/* Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent max-w-2xl" />

              {/* Banner Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-10 max-w-2xl space-y-3 sm:space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded bg-[#f84464] px-2.5 py-0.5 font-bold uppercase tracking-wider text-white shadow-sm">
                    Premiere
                  </span>
                  <span className="rounded bg-black/60 backdrop-blur-md px-2 py-0.5 font-semibold text-white">
                    {currentBannerFilm.genre}
                  </span>
                  <span className="rounded bg-black/60 backdrop-blur-md px-2 py-0.5 text-gray-200">
                    {currentBannerFilm.language}
                  </span>
                  <span className="rounded bg-black/60 backdrop-blur-md px-2 py-0.5 text-gray-200">
                    {currentBannerFilm.duration}
                  </span>
                  {currentBannerFilm.rating > 0 && (
                    <span className="flex items-center gap-1 rounded bg-black/60 backdrop-blur-md px-2 py-0.5 font-bold text-amber-300">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{currentBannerFilm.rating.toFixed(1)}/10</span>
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
                  {currentBannerFilm.title}
                </h1>

                <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 max-w-xl leading-relaxed">
                  {currentBannerFilm.logline || currentBannerFilm.description || currentBannerFilm.synopsis}
                </p>

                {/* Banner CTA Buttons in signature BookMyShow Red */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    id="carousel-watch-btn"
                    onClick={() => onSelectFilm(currentBannerFilm)}
                    className="flex items-center gap-2 rounded-lg bg-[#f84464] hover:bg-[#e03352] px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-lg transition-all active:scale-95"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    <span>Watch Now</span>
                  </button>

                  <button
                    id="carousel-details-btn"
                    onClick={() => onViewDetails(currentBannerFilm)}
                    className="flex items-center gap-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition-all"
                  >
                    <Info className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>

              {/* Prev / Next Carousel Controls */}
              {carouselFilms.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveBannerIdx((prev) => (prev === 0 ? carouselFilms.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-all"
                    aria-label="Previous Banner"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setActiveBannerIdx((prev) => (prev + 1) % carouselFilms.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-all"
                    aria-label="Next Banner"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Dot Indicators */}
                  <div className="absolute bottom-3 right-4 flex items-center gap-1.5 z-20">
                    {carouselFilms.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveBannerIdx(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === activeBannerIdx ? 'w-6 bg-[#f84464]' : 'w-2 bg-white/50 hover:bg-white/80'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : null}
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. RECOMMENDED MOVIES (BookMyShow Main Grid)                  */}
      {/* ------------------------------------------------------------- */}
      <section id="recommended-movies-section" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#222222] tracking-tight">
              Recommended Movies
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              Top curated films and festival releases across India
            </p>
          </div>
          {onGoToMovies && (
            <button
              onClick={onGoToMovies}
              className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#f84464] hover:underline transition-colors"
            >
              <span>See All</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {recommendedFilms.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
            {recommendedFilms.slice(0, 5).map(film => (
              <FilmCard
                key={film.id}
                film={film}
                onPlay={onSelectFilm}
                onViewDetails={onViewDetails}
                onToggleSave={onSaveFilm}
                currentUser={currentUser}
                aspect="portrait"
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white p-8 text-center text-xs text-gray-500 border border-gray-200">
            No recommended movies yet. Check back soon!
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. BOOKMYSHOW STREAM PREMIERES PROMO BANNER                   */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#2b3148] text-white p-6 sm:p-8 shadow-md relative overflow-hidden">
          {/* Subtle glow accent */}
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[#f84464]/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 mb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded bg-[#f84464] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                <Sparkles className="h-3 w-3" />
                <span>STREAM PREMIERES</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Brand New Short Movies & Indie Films Every Week
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
                Handpicked Indian award winners, festival favorites, and untold regional stories streaming in high definition.
              </p>
            </div>

            <button
              onClick={onOpenUpload}
              className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-[#f84464] hover:bg-[#e03352] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all active:scale-95"
            >
              <Clapperboard className="h-4 w-4" />
              <span>Submit Your Film</span>
            </button>
          </div>

          {/* Premiere Thumbnails Row */}
          {streamPremieres.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 relative z-10">
              {streamPremieres.map(film => (
                <div
                  key={film.id}
                  onClick={() => onViewDetails(film)}
                  className="group relative cursor-pointer overflow-hidden rounded-xl bg-gray-900 border border-gray-700/80 shadow-sm hover:border-[#f84464] transition-all"
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={film.backdropUrl || film.posterUrl}
                      alt={film.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-2.5">
                    <h5 className="text-xs font-bold text-white line-clamp-1 group-hover:text-[#f84464]">
                      {film.title}
                    </h5>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                      <span>{film.language}</span>
                      <span>⭐ {film.rating > 0 ? film.rating.toFixed(1) : '8.5'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. TOP INDIAN SHORT FILMS                                     */}
      {/* ------------------------------------------------------------- */}
      <section id="short-films-row" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#222222] tracking-tight">
              Top Indian Short Films
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              Award-winning digital shorts, narrative dramas, and documentaries
            </p>
          </div>
          {onGoToShortFilms && (
            <button
              onClick={onGoToShortFilms}
              className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#f84464] hover:underline transition-colors"
            >
              <span>See All</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {latestShortFilms.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
            {latestShortFilms.slice(0, 5).map(film => (
              <FilmCard
                key={film.id}
                film={film}
                onPlay={onSelectFilm}
                onViewDetails={onViewDetails}
                onToggleSave={onSaveFilm}
                currentUser={currentUser}
                aspect="portrait"
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white p-8 text-center text-xs text-gray-500 border border-gray-200">
            No short films available yet.
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. BROWSE BY LANGUAGES (BookMyShow Signature Language Chips)   */}
      {/* ------------------------------------------------------------- */}
      <section id="browse-languages-section" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-[#222222] tracking-tight">
            Browse by Language
          </h2>
          <button
            onClick={() => onGoToDiscover()}
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#f84464] hover:underline transition-colors"
          >
            <span>All Languages</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2.5 sm:gap-3">
          {ALL_LANGUAGES.map((lang) => {
            const count = liveFilms.filter(f => f.language === lang.name).length;
            return (
              <button
                key={lang.name}
                onClick={() => onGoToDiscover(lang.name)}
                className="group flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-gray-200/80 shadow-sm hover:border-[#f84464] hover:shadow-md transition-all text-center"
              >
                <span className="text-xs font-semibold text-[#f84464]">{lang.native}</span>
                <span className="text-xs font-bold text-[#222222] mt-0.5 group-hover:text-[#f84464]">{lang.name}</span>
                <span className="text-[10px] text-[#888888] mt-0.5">{count} {count === 1 ? 'Film' : 'Films'}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. BROWSE BY GENRES                                           */}
      {/* ------------------------------------------------------------- */}
      <section id="browse-genres-section" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-[#222222] tracking-tight">
            Explore Genres
          </h2>
          <button
            onClick={() => onGoToDiscover()}
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#f84464] hover:underline transition-colors"
          >
            <span>All Genres</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {ALL_GENRES.map((g) => {
            const count = liveFilms.filter(f => f.genre === g.name).length;
            return (
              <button
                key={g.name}
                onClick={() => onGoToDiscover(g.name)}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-gray-200/80 shadow-sm hover:border-[#f84464] hover:shadow-md transition-all text-left group"
              >
                <div className="text-2xl">{g.icon}</div>
                <div>
                  <h4 className="text-sm font-bold text-[#222222] group-hover:text-[#f84464] transition-colors">
                    {g.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{count} Films</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. TRENDING VERTICAL REELS                                    */}
      {/* ------------------------------------------------------------- */}
      {reels.length > 0 && (
        <section id="trending-reels-section" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#222222] tracking-tight flex items-center gap-2">
                <Video className="h-5 w-5 text-[#f84464]" />
                <span>Trending Vertical Cinema Reels</span>
              </h2>
              <p className="text-xs text-[#666666] mt-0.5">
                Bite-sized mobile storytelling by India's top creators
              </p>
            </div>
            <button
              onClick={onGoToReels}
              className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#f84464] hover:underline transition-colors"
            >
              <span>Watch Reels</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {reels.slice(0, 5).map(reel => (
              <div
                key={reel.id}
                onClick={() => onSelectReel(reel)}
                className="group relative cursor-pointer overflow-hidden rounded-xl bg-gray-900 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="aspect-[9/16] w-full overflow-hidden">
                  <img
                    src={reel.thumbnailUrl}
                    alt={reel.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                  {/* Play icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-10 w-10 rounded-full bg-[#f84464] flex items-center justify-center text-white shadow-lg">
                      <Play className="h-5 w-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Bottom details */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <h5 className="text-xs font-bold line-clamp-1">{reel.title}</h5>
                    <p className="text-[10px] text-gray-300">@{reel.creatorHandle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 8. FILMMAKERS & CREATORS SPOTLIGHT (Indie directors & creators) */}
      {/* ------------------------------------------------------------- */}
      {creators.filter(c => c.id !== 'creator-harri-kumar' && !c.name.toLowerCase().includes('harri')).length > 0 && (
        <section id="creators-spotlight-section" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-[#222222] tracking-tight">
              Filmmakers & Creators
            </h2>
            <button
              onClick={() => onGoToDiscover()}
              className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#f84464] hover:underline transition-colors"
            >
              <span>Explore All Creators</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {creators
              .filter(c => c.id !== 'creator-harri-kumar' && !c.name.toLowerCase().includes('harri'))
              .slice(0, 5)
              .map(creator => (
                <div
                  key={creator.id}
                  onClick={() => onSelectCreator(creator.id)}
                  className="group flex flex-col items-center p-4 rounded-xl bg-white border border-gray-200/80 shadow-sm hover:border-[#f84464] hover:shadow-md transition-all text-center cursor-pointer"
                >
                  <div className="relative mb-2.5">
                    <img
                      src={creator.avatar || creator.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={creator.name}
                      referrerPolicy="no-referrer"
                      className="h-16 w-16 sm:h-18 sm:w-18 rounded-full object-cover border-2 border-gray-200 group-hover:border-[#f84464] transition-colors"
                    />
                    {creator.isVerified && (
                      <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-[#f84464] text-white flex items-center justify-center text-[9px] font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#222222] line-clamp-1 group-hover:text-[#f84464] transition-colors">
                    {creator.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{creator.role || creator.designation}</p>
                  <span className="text-[10px] text-[#f84464] font-semibold mt-1">
                    {creator.filmographyCount || 1} {(creator.filmographyCount || 1) === 1 ? 'Film' : 'Films'}
                  </span>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 9. "LIST YOUR SHOW / SUBMIT FILM" CALLOUT BANNER               */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white border border-gray-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-[#222222]">
              Got a Short Movie, Feature Film or Script?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
              Partner with Indian Global Films to showcase your cinema to film enthusiasts and distributors across India.
            </p>
          </div>

          <button
            onClick={onOpenUpload}
            className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-[#f84464] hover:bg-[#e03352] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-sm transition-all active:scale-95"
          >
            <Clapperboard className="h-4 w-4" />
            <span>Submit Your Film Now</span>
          </button>
        </div>
      </section>

    </div>
  );
};
