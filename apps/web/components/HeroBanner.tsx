'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Film } from '@/types';
import { useVideoModal } from '@/context/VideoModalContext';
import { Play, Plus, Check, Star, Clock, Globe, Award, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  film: Film;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ film }) => {
  const [inWatchlist, setInWatchlist] = useState(false);
  const { openVideoModal } = useVideoModal();

  const durationMin = Math.round(film.duration_seconds / 60);

  return (
    <div className="relative w-full h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden bg-black">
      
      {/* Backdrop Image with Dark Gradients */}
      <div className="absolute inset-0">
        <Image
          src={film.banner_url || film.poster_url}
          alt={film.title}
          fill
          priority
          className="object-cover object-center scale-105 transform transition-all duration-[10000ms] ease-out hover:scale-100"
        />
        {/* Right side gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent w-full md:w-[60%]" />
        {/* Bottom gradient to blend into the next section */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-20">
        
        {/* Spotlight Tag */}
        <div className="flex items-center gap-2 text-cinema-gold bg-cinema-gold/10 border border-cinema-gold/30 px-3 py-1 rounded-full w-fit text-xs font-semibold mb-4 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FEATURED SHORT FILM</span>
        </div>

        {/* Title */}
        <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight mb-4 drop-shadow-md">
          {film.title}
        </h1>

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-cinema-muted mb-4 font-medium">
          <span className="flex items-center gap-1 text-cinema-gold font-bold bg-cinema-surface/80 px-2.5 py-1 rounded-md border border-cinema-border">
            <Star className="w-3.5 h-3.5 fill-cinema-gold" />
            {film.rating_average.toFixed(1)} ({film.rating_count})
          </span>

          <span className="bg-cinema-surface/80 px-2.5 py-1 rounded-md border border-cinema-border text-white">
            {film.certificate}
          </span>

          <span className="flex items-center gap-1 bg-cinema-surface/80 px-2.5 py-1 rounded-md border border-cinema-border">
            <Clock className="w-3.5 h-3.5" />
            {durationMin} mins
          </span>

          {film.languages && film.languages[0] && (
            <span className="flex items-center gap-1 bg-cinema-surface/80 px-2.5 py-1 rounded-md border border-cinema-border text-cinema-teal font-semibold">
              <Globe className="w-3.5 h-3.5" />
              {film.languages[0].name}
            </span>
          )}

          <span className="bg-cinema-surface/80 px-2.5 py-1 rounded-md border border-cinema-border">
            {film.release_year}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-sm text-gray-300 max-w-2xl line-clamp-3 mb-6 font-normal leading-relaxed">
          {film.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          
          <button
            onClick={() => openVideoModal(film)}
            className="px-6 py-3.5 rounded-2xl bg-cinema-accent hover:bg-cinema-accentHover text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-cinema-accent/30 hover:scale-105 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            Watch Now
          </button>

          <button
            onClick={() => setInWatchlist(!inWatchlist)}
            className={`px-5 py-3.5 rounded-2xl text-sm font-semibold flex items-center gap-2 transition-all border ${
              inWatchlist
                ? 'bg-cinema-surface text-cinema-gold border-cinema-gold/40'
                : 'bg-cinema-card/80 hover:bg-cinema-surface text-white border-cinema-border hover:border-white/40'
            }`}
          >
            {inWatchlist ? (
              <>
                <Check className="w-4 h-4 text-cinema-gold" />
                In Watchlist
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add to Watchlist
              </>
            )}
          </button>

          <Link
            href={`/film/${film.slug}#details`}
            className="px-5 py-3.5 rounded-2xl bg-cinema-surface/60 hover:bg-cinema-surface text-cinema-muted hover:text-white border border-cinema-border text-sm font-medium transition-all"
          >
            Film Details
          </Link>

        </div>

      </div>
    </div>
  );
};
