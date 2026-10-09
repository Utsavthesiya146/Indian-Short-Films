import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { ShortFilm, User } from '../types';
import { FilmCard } from './FilmCard';

interface FilmCarouselRowProps {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  films: ShortFilm[];
  onPlayFilm: (film: ShortFilm) => void;
  onViewDetails: (film: ShortFilm) => void;
  onToggleSave?: (filmId: string) => void;
  currentUser?: User | null;
  onViewAll?: () => void;
}

export const FilmCarouselRow: React.FC<FilmCarouselRowProps> = ({
  id,
  title,
  subtitle,
  badge,
  films,
  onPlayFilm,
  onViewDetails,
  onToggleSave,
  currentUser,
  onViewAll,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (films.length === 0) return null;

  return (
    <section id={id} className="relative py-6 space-y-4">
      {/* Header with Title, Badge, and Carousel Controls */}
      <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div className="space-y-1">
          {badge && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-0.5 text-[11px] font-semibold text-purple-300">
              <Sparkles className="h-3 w-3 text-purple-400" />
              <span>{badge}</span>
            </div>
          )}
          <h2 className="cinematic-title text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* Carousel Navigation Arrows & View All */}
        <div className="flex items-center gap-2 shrink-0">
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors mr-2 hidden sm:inline-block cursor-pointer"
            >
              View All ({films.length})
            </button>
          )}

          <button
            onClick={() => handleScroll('left')}
            aria-label="Scroll Left"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:bg-purple-600 hover:text-white hover:border-purple-500/40 transition-all duration-200 cursor-pointer active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={() => handleScroll('right')}
            aria-label="Scroll Right"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:bg-purple-600 hover:text-white hover:border-purple-500/40 transition-all duration-200 cursor-pointer active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 scroll-smooth scrollbar-none snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {films.map((film) => (
          <div
            key={film.id}
            className="w-52 sm:w-60 md:w-64 shrink-0 snap-start flex flex-col transition-transform duration-300 hover:scale-[1.02]"
          >
            <FilmCard
              film={film}
              onPlay={onPlayFilm}
              onViewDetails={onViewDetails}
              onToggleSave={onToggleSave}
              currentUser={currentUser}
              aspect="portrait"
            />
          </div>
        ))}
      </div>
    </section>
  );
};
