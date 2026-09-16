'use client';

import React, { useRef } from 'react';
import { Film } from '@/types';
import { FilmCard } from './FilmCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FilmRowProps {
  title: string;
  subtitle?: string;
  films: Film[];
  icon?: React.ReactNode;
}

export const FilmRow: React.FC<FilmRowProps> = ({ title, subtitle, films, icon }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!films || films.length === 0) return null;

  return (
    <section className="mb-10 relative">
      
      {/* Header */}
      <div className="flex items-end justify-between mb-4 px-1">
        <div>
          <div className="flex items-center gap-2">
            {icon && <span className="text-cinema-accent">{icon}</span>}
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
              {title}
            </h2>
          </div>
          {subtitle && <p className="text-xs text-cinema-muted mt-0.5">{subtitle}</p>}
        </div>

        {/* Scroll Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="p-2 rounded-xl bg-cinema-card hover:bg-cinema-surface text-cinema-muted hover:text-white border border-cinema-border transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-2 rounded-xl bg-cinema-card hover:bg-cinema-surface text-cinema-muted hover:text-white border border-cinema-border transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrolling Strip */}
      <div
        ref={rowRef}
        className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-4 pt-1 px-1 scroll-smooth"
      >
        {films.map((film) => (
          <FilmCard key={film.id} film={film} />
        ))}
      </div>

    </section>
  );
};
