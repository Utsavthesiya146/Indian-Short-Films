'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Film } from '@/types';
import { Play, Star, Clock } from 'lucide-react';

interface FilmCardProps {
  film: Film;
  className?: string;
}

export const FilmCard: React.FC<FilmCardProps> = ({ film, className = '' }) => {
  const durationMin = Math.round((film.duration_seconds ?? 0) / 60);

  return (
    <div className={`group relative flex flex-col flex-shrink-0 w-48 sm:w-56 ${className}`}>
      
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-cinema-card border border-cinema-border poster-glow transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-cinema-accent/60 shadow-lg">
        <Image
          src={film.poster_url || 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80'}
          alt={film.title ?? 'Short Film'}
          fill
          sizes="(max-width: 640px) 192px, 224px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Hover Dark Overlay & Play Icon */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            href={`/film/${film.slug}`}
            className="w-12 h-12 rounded-full bg-cinema-accent flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300"
          >
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </Link>
        </div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {film.languages && film.languages[0] && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-cinema-teal px-2 py-0.5 rounded-md border border-cinema-teal/30">
              {film.languages[0].name}
            </span>
          )}

          <span className="text-[10px] font-bold bg-black/75 backdrop-blur-md text-cinema-gold px-2 py-0.5 rounded-md border border-cinema-gold/30 flex items-center gap-1">
            <Star className="w-3 h-3 fill-cinema-gold" />
            {(film.rating_average ?? 0).toFixed(1)}
          </span>
        </div>

        {/* Bottom Duration Overlay */}
        <div className="absolute bottom-2.5 right-2.5 pointer-events-none">
          <span className="text-[10px] font-medium bg-black/80 backdrop-blur-md text-gray-300 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {durationMin}m
          </span>
        </div>

      </div>

      {/* Film Title & Info */}
      <div className="mt-3 flex flex-col">
        <Link
          href={`/film/${film.slug}`}
          className="font-semibold text-sm text-white hover:text-cinema-accent transition-colors line-clamp-1"
        >
          {film.title}
        </Link>
        <span className="text-xs text-cinema-muted line-clamp-1 mt-0.5">
          Dir. {film.director ?? 'Independent Director'}
        </span>
      </div>

    </div>
  );
};
