'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilmCard } from '@/components/FilmCard';
import { Film, Language, Genre } from '@/types';
import { getFilms, getLanguages, getGenres } from '@/lib/supabase';
import { Search, SlidersHorizontal, X, Film as FilmIcon, Loader2 } from 'lucide-react';

function DiscoverContent() {
  const searchParams = useSearchParams();
  const initialLang = searchParams?.get('language') || 'all';
  const initialGenre = searchParams?.get('genre') || 'all';

  const [films, setFilms] = useState<Film[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLang);
  const [selectedGenre, setSelectedGenre] = useState<string>(initialGenre);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadMetadata() {
      const [langs, gnrs] = await Promise.all([getLanguages(), getGenres()]);
      setLanguages(langs);
      setGenres(gnrs);
    }
    loadMetadata();
  }, []);

  useEffect(() => {
    async function fetchLiveFilms() {
      setLoading(true);
      try {
        const data = await getFilms({
          search: searchQuery || undefined,
          sort: sortBy === 'newest' ? undefined : sortBy,
          language: selectedLanguage !== 'all' ? selectedLanguage : undefined,
          genre: selectedGenre !== 'all' ? selectedGenre : undefined
        });
        setFilms(data);
      } catch {
        setFilms([]);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchLiveFilms();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedLanguage, selectedGenre, sortBy]);

  // Client-side filtering fallback for native language/genre objects
  const filteredFilms = films.filter((film) => {
    const matchesLanguage =
      selectedLanguage === 'all' ||
      film.languages?.some((l) => l.code === selectedLanguage);

    const matchesGenre =
      selectedGenre === 'all' ||
      film.genres?.some((g) => g.slug === selectedGenre);

    return matchesLanguage && matchesGenre;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Search & Header Title */}
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-2">
          Discover Short Films
        </h1>
        <p className="text-xs sm:text-sm text-cinema-muted">
          Search thousands of short stories across all Indian languages and genres.
        </p>

        {/* Live Search Bar Input */}
        <div className="relative mt-6 max-w-2xl">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-cinema-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by film title, director, actor..."
            className="w-full bg-cinema-card border border-cinema-border rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white focus:outline-none focus:border-cinema-accent shadow-xl placeholder-gray-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3.5 text-cinema-muted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-cinema-card/70 backdrop-blur-md rounded-2xl p-4 border border-cinema-border mb-8 flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-cinema-muted font-medium">
            <SlidersHorizontal className="w-4 h-4 text-cinema-gold" />
            <span>Filters:</span>
          </div>

          {/* Language Selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-cinema-surface border border-cinema-border rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-cinema-gold"
          >
            <option value="all">All Languages</option>
            {languages.map((l) => (
              <option key={l.id} value={l.code}>
                {l.name} ({l.native_name})
              </option>
            ))}
          </select>

          {/* Genre Selector */}
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-cinema-surface border border-cinema-border rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-cinema-gold"
          >
            <option value="all">All Genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.slug}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-cinema-muted">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-cinema-surface border border-cinema-border rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-cinema-accent"
          >
            <option value="newest">Newest Releases</option>
            <option value="rating">Highest Rated</option>
            <option value="views">Most Viewed</option>
            <option value="likes">Most Liked</option>
          </select>
        </div>

      </div>

      {/* Results Count & Grid */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-semibold text-cinema-muted">
          Showing {filteredFilms.length} short films
        </span>
        {loading && <Loader2 className="w-4 h-4 text-cinema-accent animate-spin" />}
      </div>

      {loading ? (
        <div className="py-20 text-center text-cinema-muted flex justify-center items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-cinema-accent" />
          <span className="text-xs">Loading cinema catalog...</span>
        </div>
      ) : filteredFilms.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredFilms.map((film) => (
            <FilmCard key={film.id} film={film} className="w-full" />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-cinema-card rounded-3xl p-12 text-center border border-cinema-border my-12">
          <FilmIcon className="w-16 h-16 text-cinema-muted mx-auto mb-4 opacity-40" />
          <h3 className="text-lg font-bold text-white mb-1">No Short Films Found</h3>
          <p className="text-xs text-cinema-muted max-w-md mx-auto mb-6">
            We couldn&apos;t find any films matching your search or selected filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedLanguage('all');
              setSelectedGenre('all');
            }}
            className="px-5 py-2.5 rounded-xl bg-cinema-surface hover:bg-cinema-border text-xs font-semibold text-white border border-cinema-border"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center text-cinema-muted flex justify-center items-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-cinema-accent" />
        <span className="text-xs">Loading discover catalog...</span>
      </div>
    }>
      <DiscoverContent />
    </Suspense>
  );
}

