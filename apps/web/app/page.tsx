import React from 'react';
import Link from 'next/link';
import { getFeaturedFilms, getTrendingFilms, getFilms, getLanguages, getGenres } from '@/lib/supabase';
import { HeroBanner } from '@/components/HeroBanner';
import { FilmRow } from '@/components/FilmRow';
import { Flame, Star, Sparkles, Languages, Grid, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const featured = await getFeaturedFilms();
  const trendingFilms = await getTrendingFilms();
  const films = await getFilms();
  const languages = await getLanguages();
  const genres = await getGenres();

  const heroFilm = featured[0] || films[0];
  const topRatedFilms = [...films].sort((a, b) => b.rating_average - a.rating_average);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Hero Section */}
      {heroFilm && <HeroBanner film={heroFilm} />}

      {/* Section 1: Trending Now */}
      <FilmRow
        title="Trending Now"
        subtitle="Most watched Indian short films this week"
        films={trendingFilms.length > 0 ? trendingFilms : films.slice(0, 4)}
        icon={<Flame className="w-6 h-6 text-cinema-accent fill-cinema-accent" />}
      />

      {/* Section 2: Top Rated */}
      <FilmRow
        title="Top Rated Cinema"
        subtitle="Critically acclaimed short films rated by film lovers"
        films={topRatedFilms}
        icon={<Star className="w-6 h-6 text-cinema-gold fill-cinema-gold" />}
      />

      {/* Section 3: Indian Languages Quick Filter Grid */}
      <section className="my-14 bg-cinema-card rounded-3xl p-6 sm:p-8 border border-cinema-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Languages className="w-6 h-6 text-cinema-teal" />
            <div>
              <h3 className="font-display font-bold text-xl text-white">Browse by Indian Language</h3>
              <p className="text-xs text-cinema-muted">Stories told in native voices from across India</p>
            </div>
          </div>
          <Link href="/discover" className="text-xs font-semibold text-cinema-teal hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {languages.slice(0, 10).map((lang) => (
            <Link
              key={lang.id}
              href={`/discover?language=${lang.code}`}
              className="p-3.5 rounded-2xl bg-cinema-surface hover:bg-cinema-border/50 border border-cinema-border/60 flex flex-col items-center justify-center gap-1 group transition-all hover:scale-105"
            >
              <span className="font-bold text-sm text-white group-hover:text-cinema-teal transition-colors">
                {lang.name}
              </span>
              <span className="text-[11px] text-cinema-muted font-normal">
                {lang.native_name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 4: All Short Films Row */}
      <FilmRow
        title="Recently Added Stories"
        subtitle="Fresh independent releases from emerging directors"
        films={films}
        icon={<Sparkles className="w-6 h-6 text-cinema-teal" />}
      />

      {/* Section 5: Genres Showcase Grid */}
      <section className="my-14">
        <div className="flex items-center gap-3 mb-6">
          <Grid className="w-6 h-6 text-cinema-gold" />
          <div>
            <h3 className="font-display font-bold text-xl text-white">Explore Genres</h3>
            <p className="text-xs text-cinema-muted">From suspenseful thrillers to emotional slice-of-life dramas</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {genres.map((genre) => (
            <Link
              key={genre.id}
              href={`/discover?genre=${genre.slug}`}
              className="group relative h-28 rounded-2xl bg-gradient-to-br from-cinema-card to-cinema-surface border border-cinema-border p-4 flex flex-col justify-end overflow-hidden hover:border-cinema-gold/60 transition-all hover:-translate-y-1 shadow-lg"
            >
              <div className="absolute top-3 right-3 text-cinema-muted group-hover:text-cinema-gold transition-colors">
                <Grid className="w-5 h-5 opacity-40" />
              </div>
              <h4 className="font-bold text-base text-white group-hover:text-cinema-gold transition-colors">
                {genre.name}
              </h4>
              <p className="text-[11px] text-cinema-muted line-clamp-1">
                {genre.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
