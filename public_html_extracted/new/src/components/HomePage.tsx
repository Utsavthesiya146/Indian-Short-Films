import React from 'react';
import { 
  Play, 
  Star, 
  Info, 
  Flame, 
  TrendingUp, 
  Layers, 
  Clock, 
  ChevronRight,
  Bookmark,
  Sparkles
} from 'lucide-react';
import { ShortFilm } from '../types';

interface HomePageProps {
  films: ShortFilm[];
  onSelectFilm: (film: ShortFilm) => void;
  onNavigateTab: (tab: string) => void;
  onSelectLanguage?: (lang: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  films,
  onSelectFilm,
  onNavigateTab
}) => {
  const featuredFilm = films[0];
  const trendingFilms = films.filter(f => f.isTrending || f.isFeatured).slice(0, 6);
  const topRatedFilms = [...films].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6);
  const recentFilms = [...films].slice(0, 6);

  const languages = [
    { name: 'Hindi', script: 'हिन्दी', count: 18 },
    { name: 'Tamil', script: 'தமிழ்', count: 14 },
    { name: 'Kannada', script: 'ಕನ್ನಡ', count: 12 },
    { name: 'Telugu', script: 'తెలుగు', count: 10 },
    { name: 'Gujarati', script: 'ગુજરાતી', count: 8 },
    { name: 'Malayalam', script: 'മലയാളം', count: 9 },
    { name: 'Bengali', script: 'বাংলা', count: 7 },
    { name: 'Marathi', script: 'मराठी', count: 6 }
  ];

  const genres = [
    'Drama', 'Thriller', 'Mystery', 'Comedy', 'Folk Folklore', 
    'Documentary', 'Romance', 'Action', 'Indie Experimental'
  ];

  return (
    <div className="space-y-12 pb-12 animate-fadeIn">
      
      {/* 1. Hero Spotlight Film matching https://indian-short-films-lime.vercel.app/ */}
      {featuredFilm && (
        <div className="relative rounded-3xl overflow-hidden border border-cinema-border bg-cinema-card shadow-2xl">
          <div className="relative h-[480px] sm:h-[540px] w-full">
            {/* Backdrop Image */}
            <img
              src={featuredFilm.backdropUrl || featuredFilm.posterUrl}
              alt={featuredFilm.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-[#07080b]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07080b] via-[#07080b]/80 to-transparent" />

            {/* Hero Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-12 max-w-3xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cinema-accent text-white shadow-md shadow-cinema-accent/30">
                  Featured Presentation
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cinema-surface/80 border border-cinema-border text-cinema-teal">
                  {featuredFilm.language}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cinema-surface/80 border border-cinema-border text-cinema-gold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-cinema-gold" />
                  <span>{(featuredFilm.rating || 4.9).toFixed(1)}</span>
                </span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-none drop-shadow-md">
                {featuredFilm.title}
              </h1>

              <p className="text-xs sm:text-sm text-gray-300 line-clamp-3 leading-relaxed max-w-2xl drop-shadow">
                {featuredFilm.synopsis || featuredFilm.description}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => onSelectFilm(featuredFilm)}
                  className="px-6 py-3 rounded-2xl bg-cinema-accent hover:bg-cinema-accentHover text-white text-xs font-bold shadow-xl shadow-cinema-accent/30 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Watch Film</span>
                </button>
                <button
                  onClick={() => onSelectFilm(featuredFilm)}
                  className="px-5 py-3 rounded-2xl bg-cinema-surface/90 hover:bg-cinema-surface text-white text-xs font-bold border border-cinema-border flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md"
                >
                  <Info className="w-4 h-4 text-cinema-muted" />
                  <span>Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Trending Now Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-cinema-accent" />
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
              Trending Now
            </h2>
          </div>
          <button 
            onClick={() => onNavigateTab('films')} 
            className="text-xs text-cinema-teal hover:underline flex items-center gap-1 cursor-pointer font-semibold"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {trendingFilms.map((film) => (
            <div
              key={film.id}
              onClick={() => onSelectFilm(film)}
              className="bg-cinema-card rounded-2xl overflow-hidden border border-cinema-border group hover:border-cinema-gold/50 transition-all cursor-pointer flex flex-col shadow-lg"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-cinema-surface">
                <img
                  src={film.posterUrl}
                  alt={film.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-cinema-accent/90 flex items-center justify-center shadow-lg">
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </div>
                </div>
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 backdrop-blur-md text-cinema-gold border border-white/10">
                  ★ {(film.rating || 4.8).toFixed(1)}
                </span>
              </div>
              <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xs text-white truncate group-hover:text-cinema-accent transition-colors">
                    {film.title}
                  </h3>
                  <span className="text-[10px] text-cinema-muted block">
                    {film.director}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-cinema-teal pt-1">
                  <span>{film.language}</span>
                  <span className="text-cinema-muted font-mono">{film.releaseYear || 2026}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Top Rated Cinema */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-cinema-gold" />
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
              Top Rated Cinema
            </h2>
          </div>
          <button 
            onClick={() => onNavigateTab('films')} 
            className="text-xs text-cinema-teal hover:underline flex items-center gap-1 cursor-pointer font-semibold"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {topRatedFilms.map((film) => (
            <div
              key={film.id}
              onClick={() => onSelectFilm(film)}
              className="bg-cinema-card rounded-2xl overflow-hidden border border-cinema-border group hover:border-cinema-gold/50 transition-all cursor-pointer flex flex-col shadow-lg"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-cinema-surface">
                <img
                  src={film.posterUrl}
                  alt={film.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-cinema-accent/90 flex items-center justify-center shadow-lg">
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </div>
                </div>
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 backdrop-blur-md text-cinema-gold border border-white/10">
                  ★ {(film.rating || 4.8).toFixed(1)}
                </span>
              </div>
              <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xs text-white truncate group-hover:text-cinema-accent transition-colors">
                    {film.title}
                  </h3>
                  <span className="text-[10px] text-cinema-muted block">
                    {film.director}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-cinema-teal pt-1">
                  <span>{film.language}</span>
                  <span className="text-cinema-muted font-mono">{film.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Browse by Indian Language matching reference */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cinema-teal" />
          <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
            Browse by Indian Language
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {languages.map((lang, idx) => (
            <button
              key={idx}
              onClick={() => onNavigateTab('films')}
              className="p-3.5 rounded-2xl bg-cinema-card hover:bg-cinema-surface border border-cinema-border hover:border-cinema-teal/40 transition-all text-center group cursor-pointer"
            >
              <span className="text-base font-bold text-white block group-hover:text-cinema-teal transition-colors">
                {lang.name}
              </span>
              <span className="text-xs text-cinema-gold font-medium block mt-0.5">
                {lang.script}
              </span>
              <span className="text-[10px] text-cinema-muted block mt-1">
                {lang.count} Films
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 5. Recently Added Stories */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
              Recently Added Stories
            </h2>
          </div>
          <button 
            onClick={() => onNavigateTab('films')} 
            className="text-xs text-cinema-teal hover:underline flex items-center gap-1 cursor-pointer font-semibold"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {recentFilms.map((film) => (
            <div
              key={film.id}
              onClick={() => onSelectFilm(film)}
              className="bg-cinema-card rounded-2xl overflow-hidden border border-cinema-border group hover:border-cinema-gold/50 transition-all cursor-pointer flex flex-col shadow-lg"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-cinema-surface">
                <img
                  src={film.posterUrl}
                  alt={film.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-cinema-accent/90 flex items-center justify-center shadow-lg">
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="p-3 space-y-1">
                <h3 className="font-bold text-xs text-white truncate group-hover:text-cinema-accent transition-colors">
                  {film.title}
                </h3>
                <span className="text-[10px] text-cinema-muted block">
                  {film.genre} • {film.language}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Explore Genres */}
      <section className="space-y-4">
        <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
          Explore Genres
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {genres.map((g, idx) => (
            <button
              key={idx}
              onClick={() => onNavigateTab('films')}
              className="p-4 rounded-2xl bg-cinema-surface hover:bg-cinema-card border border-cinema-border hover:border-cinema-accent/40 text-left transition-all cursor-pointer group"
            >
              <span className="text-xs font-bold text-white block group-hover:text-cinema-accent transition-colors">
                {g}
              </span>
              <span className="text-[10px] text-cinema-muted mt-1 block">
                Short Films &amp; Docs
              </span>
            </button>
          ))}
        </div>
      </section>

    </div>
  );
};
