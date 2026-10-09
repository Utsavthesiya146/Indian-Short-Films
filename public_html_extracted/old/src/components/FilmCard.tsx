import React, { useState } from 'react';
import { Play, Info, Bookmark, Star, Clock, Globe, Plus, Check } from 'lucide-react';
import { ShortFilm, User } from '../types';

interface FilmCardProps {
  film: ShortFilm;
  onPlay: (film: ShortFilm) => void;
  onViewDetails: (film: ShortFilm) => void;
  onToggleSave?: (filmId: string) => void;
  currentUser?: User | null;
  aspect?: 'portrait' | 'landscape';
}

export const FilmCard: React.FC<FilmCardProps> = ({
  film,
  onPlay,
  onViewDetails,
  onToggleSave,
  currentUser,
  aspect = 'portrait'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isSaved = currentUser?.savedFilmIds?.includes(film.id);

  const votesCount = Math.max(12, Math.round(((film.likesCount || 8) * 1.5) + ((film.viewsCount || 50) / 40)));

  return (
    <div
      id={`film-card-${film.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(film)}
      className="group relative flex flex-col h-full cursor-pointer transition-all duration-300 select-none bg-white/[0.03] backdrop-blur-xl rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] hover:-translate-y-1.5"
    >
      {/* Poster Image Container */}
      <div 
        className={`relative w-full overflow-hidden bg-neutral-900 ${
          aspect === 'portrait' ? 'aspect-[2/3]' : 'aspect-video'
        }`}
      >
        <img
          src={film.posterUrl}
          alt={film.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none z-10">
          {film.isNewRelease ? (
            <span className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
              Premiere
            </span>
          ) : film.isTrending ? (
            <span className="rounded-full bg-gradient-to-r from-amber-500 to-red-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
              Trending
            </span>
          ) : (
            <span className="rounded-full bg-black/60 border border-white/10 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              {film.contentType === 'movie' ? 'Movie' : 'Short Film'}
            </span>
          )}

          <span className="rounded-full bg-black/60 border border-white/10 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold text-gray-200">
            {film.duration}
          </span>
        </div>

        {/* Rating Strip inside poster bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#0a0a14]/90 backdrop-blur-md text-white flex items-center justify-between px-3 py-1.5 text-xs font-semibold z-10 border-t border-white/5">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-white font-bold">{film.rating > 0 ? film.rating.toFixed(1) : '8.5'}</span>
            <span className="text-[10px] text-gray-400 font-normal">({votesCount}K)</span>
          </div>
          <span className="text-[11px] font-medium text-purple-300">
            {film.language}
          </span>
        </div>

        {/* Quick Action Overlay on Hover */}
        <div 
          className={`absolute inset-0 hidden sm:flex flex-col justify-end p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 z-20 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white line-clamp-1">{film.title}</h4>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-300">
              <span className="font-semibold text-purple-400">{film.genre}</span>
              <span>•</span>
              <span>{film.releaseYear}</span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                id={`card-watch-now-${film.id}`}
                onClick={() => onPlay(film)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 px-3 py-2 text-xs font-bold text-white shadow-md transition-all active:scale-95"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Watch</span>
              </button>

              <button
                id={`card-details-${film.id}`}
                onClick={() => onViewDetails(film)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="View Film Details"
              >
                <Info className="h-4 w-4" />
              </button>

              {onToggleSave && (
                <button
                  id={`card-bookmark-${film.id}`}
                  onClick={() => onToggleSave(film.id)}
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                    isSaved 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  title={isSaved ? 'In Watchlist' : 'Add to Watchlist'}
                >
                  <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Info Below Poster */}
      <div className="p-3.5 flex flex-col justify-between flex-1 space-y-1">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-purple-300 transition-colors">
            {film.title}
          </h3>
          <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
            {film.director ? `Dir. ${film.director}` : film.creatorName}
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-white/5">
          <span>{film.genre}</span>
          <span className="font-medium text-gray-400">{film.language}</span>
        </div>
      </div>
    </div>
  );
};
