import React, { useState } from 'react';
import { 
  Play, 
  Upload, 
  Sparkles, 
  Star, 
  ChevronDown, 
  Film, 
  PlusCircle, 
  Search, 
  Filter, 
  Clock, 
  Globe, 
  Layers, 
  ArrowRight,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { ShortFilm } from '../types';

interface HeroSectionProps {
  featuredFilm?: ShortFilm;
  onPlayFilm: (film: ShortFilm) => void;
  onGoToReels: () => void;
  onOpenUpload: () => void;
  onExploreDiscover?: () => void;
  onFilterSearch?: (filters: {
    query: string;
    genre: string;
    language: string;
    category: string;
    duration: string;
  }) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredFilm,
  onPlayFilm,
  onGoToReels,
  onOpenUpload,
  onExploreDiscover,
  onFilterSearch,
}) => {
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const genres = ['All', 'Drama', 'Thriller', 'Mystery', 'Comedy', 'Folk Folklore', 'Documentary', 'Indie Experimental', 'Romance', 'Action'];
  const languages = ['All', 'Kannada', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Bengali', 'Marathi', 'English'];
  const categories = ['All', 'Short Film', 'Movie', 'Web Series', 'Documentary'];
  const durations = ['All', 'Under 10 mins', '10 - 25 mins', '25+ mins'];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (onFilterSearch) {
      onFilterSearch({
        query: searchQuery,
        genre: selectedGenre,
        language: selectedLanguage,
        category: selectedCategory,
        duration: selectedDuration
      });
    }
    // Scroll down to catalog/showcase
    const showcase = document.getElementById('featured-films-carousel') || document.getElementById('streaming-catalog-showcase');
    if (showcase) {
      showcase.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('All');
    setSelectedLanguage('All');
    setSelectedCategory('All');
    setSelectedDuration('All');
    if (onFilterSearch) {
      onFilterSearch({
        query: '',
        genre: 'All',
        language: 'All',
        category: 'All',
        duration: 'All'
      });
    }
  };

  const scrollToContent = () => {
    const nextSection = document.getElementById('search-explore-section') || 
                        document.getElementById('featured-films-carousel') || 
                        document.getElementById('analytics-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: 650, behavior: 'smooth' });
    }
  };

  const hasActiveFilters = searchQuery || selectedGenre !== 'All' || selectedLanguage !== 'All' || selectedCategory !== 'All' || selectedDuration !== 'All';

  return (
    <section 
      id="hero-banner-section" 
      className="relative overflow-hidden bg-[#050505] text-white pt-4 sm:pt-6 pb-10 border-b border-white/10"
    >
      {/* 1. Premium Static Hero Background (Clean, Static, No Video) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle cinematic backdrop image with dark overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 scale-100"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80')"
          }}
        />
        {/* Deep cinematic gradient overlays matching the luxury dark purple theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-[#050505]/80 to-[#050505]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,40,200,0.15),rgba(255,255,255,0))]" />
      </div>

      {/* 2. Floating Purple & Blue Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-96 h-96 rounded-full bg-purple-600/15 blur-[130px] pointer-events-none animate-glow" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 w-[30rem] h-[30rem] rounded-full bg-blue-600/10 blur-[140px] pointer-events-none animate-glow" style={{ animationDelay: '2s' }} />

      {/* 3. Main Hero Content (Clean, Centered, Perfectly Balanced Alignment - No Spotlight Video) */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full z-10 pt-4 pb-2">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-300 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span>India's Premier Digital Cinema & Reels Stage</span>
          </div>

          {/* Main Headline (Exact words preserved) */}
          <h1 className="cinematic-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
            Discover Stories. <br />
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
              Watch Short Films.
            </span> <br />
            Connect With Filmmakers.
          </h1>

          {/* Description Prose */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-300/90 leading-relaxed font-normal">
            Experience the finest independent Indian short films, vertical cinematic reels, and documentary storytelling across Hindi, Kannada, Tamil, Telugu, Malayalam, and regional languages.
          </p>

          {/* Premium CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {featuredFilm ? (
              <button
                id="hero-watch-featured-btn"
                onClick={() => onPlayFilm(featuredFilm)}
                className="group relative inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-7 py-3.5 text-xs sm:text-sm font-bold text-white shadow-[0_0_30px_rgba(139,92,246,0.35)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.55)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Play className="h-4 w-4 fill-current group-hover:scale-110 transition-transform" />
                <span>Watch Featured Film</span>
              </button>
            ) : (
              <button
                id="hero-upload-first-btn"
                onClick={onOpenUpload}
                className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-7 py-3.5 text-xs sm:text-sm font-bold text-white shadow-[0_0_30px_rgba(139,92,246,0.35)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                <span>Upload the First Film</span>
              </button>
            )}

            <button
              id="hero-submit-film-btn"
              onClick={onOpenUpload}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-md px-6 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-white/10 hover:border-purple-500/40 transition-all duration-300 cursor-pointer"
            >
              <PlusCircle className="h-4 w-4 text-purple-400" />
              <span>+ Submit Your Film</span>
            </button>

            <button
              id="hero-reels-btn"
              onClick={onGoToReels}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-3.5 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 cursor-pointer"
            >
              <span>Vertical Cinema Reels</span>
              <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* 4. SEARCH & FILTER INTERFACE (Centered, Balanced Width) */}
        <div id="search-explore-section" className="mt-8 sm:mt-10 max-w-4xl mx-auto">
          <form 
            onSubmit={handleSearchSubmit}
            className="rounded-3xl border border-white/15 bg-white/[0.04] backdrop-blur-2xl p-4 sm:p-5 shadow-2xl space-y-3.5 transition-all duration-300 hover:border-purple-500/30"
          >
            {/* Primary Search Bar Row */}
            <div className="flex flex-col md:flex-row items-center gap-3">
              {/* Search Query Input */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search short films, directors, cast, genres, stories..."
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-10 py-3 text-xs sm:text-sm text-white placeholder-gray-400 focus:border-purple-500/70 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Toggle Advanced Filters Button */}
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold border transition-all cursor-pointer w-full md:w-auto shrink-0 ${
                  showFilters || hasActiveFilters
                    ? 'border-purple-500/50 bg-purple-500/15 text-purple-300 shadow-sm'
                    : 'border-white/10 bg-white/[0.03] text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4 text-purple-400" />
                <span>Filters {hasActiveFilters && '(Active)'}</span>
              </button>

              {/* Submit Search Button */}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer w-full md:w-auto shrink-0"
              >
                <Search className="h-4 w-4" />
                <span>Search Films</span>
              </button>
            </div>

            {/* Filter Dropdowns Grid (Genre, Language, Category, Duration) */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-white/5 ${showFilters ? 'block' : 'hidden md:grid'}`}>
              
              {/* Genre Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1">Genre</label>
                <select
                  value={selectedGenre}
                  onChange={(e) => {
                    setSelectedGenre(e.target.value);
                    if (onFilterSearch) {
                      onFilterSearch({
                        query: searchQuery,
                        genre: e.target.value,
                        language: selectedLanguage,
                        category: selectedCategory,
                        duration: selectedDuration
                      });
                    }
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#0d0d18] px-3 py-2 text-xs text-white focus:border-purple-500/60 focus:outline-none"
                >
                  {genres.map(g => (
                    <option key={g} value={g}>{g === 'All' ? 'All Genres' : g}</option>
                  ))}
                </select>
              </div>

              {/* Language Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => {
                    setSelectedLanguage(e.target.value);
                    if (onFilterSearch) {
                      onFilterSearch({
                        query: searchQuery,
                        genre: selectedGenre,
                        language: e.target.value,
                        category: selectedCategory,
                        duration: selectedDuration
                      });
                    }
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#0d0d18] px-3 py-2 text-xs text-white focus:border-purple-500/60 focus:outline-none"
                >
                  {languages.map(l => (
                    <option key={l} value={l}>{l === 'All' ? 'All Languages' : l}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    if (onFilterSearch) {
                      onFilterSearch({
                        query: searchQuery,
                        genre: selectedGenre,
                        language: selectedLanguage,
                        category: e.target.value,
                        duration: selectedDuration
                      });
                    }
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#0d0d18] px-3 py-2 text-xs text-white focus:border-purple-500/60 focus:outline-none"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
                  ))}
                </select>
              </div>

              {/* Duration Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1">Duration</label>
                <select
                  value={selectedDuration}
                  onChange={(e) => {
                    setSelectedDuration(e.target.value);
                    if (onFilterSearch) {
                      onFilterSearch({
                        query: searchQuery,
                        genre: selectedGenre,
                        language: selectedLanguage,
                        category: selectedCategory,
                        duration: e.target.value
                      });
                    }
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#0d0d18] px-3 py-2 text-xs text-white focus:border-purple-500/60 focus:outline-none"
                >
                  {durations.map(d => (
                    <option key={d} value={d}>{d === 'All' ? 'All Durations' : d}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Active Filters Reset Indicator */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <span className="text-gray-400 text-[11px]">
                  Filters active: {searchQuery && `"${searchQuery}" · `}{selectedGenre !== 'All' && `${selectedGenre} · `}{selectedLanguage !== 'All' && `${selectedLanguage} · `}{selectedCategory !== 'All' && `${selectedCategory} · `}{selectedDuration !== 'All' && selectedDuration}
                </span>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-purple-400 hover:text-purple-300 font-semibold text-xs cursor-pointer hover:underline"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </form>

          {/* Quick Regional Language Selection Chips (Centered, Equal Spacing) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {['All', 'Kannada', 'Hindi', 'Malayalam', 'Tamil', 'Telugu'].map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => {
                  setSelectedLanguage(lang);
                  if (onFilterSearch) {
                    onFilterSearch({
                      query: searchQuery,
                      genre: selectedGenre,
                      language: lang,
                      category: selectedCategory,
                      duration: selectedDuration
                    });
                  }
                }}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  selectedLanguage === lang
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                    : 'bg-white/[0.04] border border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
