import React from 'react';
import { Bookmark, Play, Trash2, ArrowRight, Film } from 'lucide-react';
import { ShortFilm } from '../types';

interface WatchlistPageProps {
  films: ShortFilm[];
  savedFilmIds: string[];
  onSelectFilm: (film: ShortFilm) => void;
  onRemoveFromWatchlist: (filmId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const WatchlistPage: React.FC<WatchlistPageProps> = ({
  films,
  savedFilmIds,
  onSelectFilm,
  onRemoveFromWatchlist,
  onNavigateTab
}) => {
  const savedFilms = films.filter(f => savedFilmIds.includes(f.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-2">
          My Watchlist
        </h1>
        <p className="text-xs sm:text-sm text-cinema-muted">
          Curate your personal collection of must-watch Indian short cinema.
        </p>
      </div>

      {/* Grid of Saved Films or Empty State */}
      {savedFilms.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {savedFilms.map((film) => (
            <div
              key={film.id}
              className="bg-cinema-card rounded-2xl overflow-hidden border border-cinema-border group hover:border-cinema-gold/50 transition-all flex flex-col justify-between shadow-xl"
            >
              <div 
                onClick={() => onSelectFilm(film)}
                className="relative aspect-[2/3] w-full overflow-hidden bg-cinema-surface cursor-pointer"
              >
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

              <div className="p-4 space-y-2">
                <div>
                  <h3 
                    onClick={() => onSelectFilm(film)}
                    className="font-bold text-sm text-white truncate cursor-pointer hover:text-cinema-accent transition-colors"
                  >
                    {film.title}
                  </h3>
                  <span className="text-xs text-cinema-muted block mt-0.5">
                    Dir. {film.director}
                  </span>
                  <span className="text-[11px] text-cinema-teal font-medium block">
                    {film.language} • {film.genre}
                  </span>
                </div>

                <div className="pt-2 border-t border-cinema-border/50 flex items-center justify-between">
                  <button
                    onClick={() => onSelectFilm(film)}
                    className="text-xs text-cinema-gold font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Watch</span>
                    <Play className="w-3 h-3 fill-cinema-gold" />
                  </button>
                  <button
                    onClick={() => onRemoveFromWatchlist(film.id)}
                    className="p-1.5 rounded-lg bg-cinema-surface hover:bg-red-500/20 text-cinema-muted hover:text-red-400 transition-colors cursor-pointer"
                    title="Remove from Watchlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-cinema-card rounded-3xl p-16 text-center border border-cinema-border space-y-4 max-w-xl mx-auto shadow-2xl">
          <Bookmark className="w-16 h-16 text-cinema-border mx-auto opacity-70" />
          <h3 className="font-display font-bold text-white text-xl">
            Your Watchlist is Empty
          </h3>
          <p className="text-xs text-cinema-muted leading-relaxed">
            Explore hundreds of award-winning regional short films, documentaries, and indie gems across India to save them here for later viewing.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigateTab('films')}
              className="px-6 py-3 rounded-2xl bg-cinema-accent hover:bg-cinema-accentHover text-white text-xs font-bold shadow-lg shadow-cinema-accent/30 inline-flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
            >
              <span>Explore Discover Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
