import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getFilmBySlug } from '@/lib/supabase';
import { VideoPlayer } from '@/components/VideoPlayer';
import { ReviewSection } from '@/components/ReviewSection';
import { CommentSection } from '@/components/CommentSection';
import { FilmActions } from '@/components/FilmActions';
import { FollowButton } from '@/components/FollowButton';
import { Star, Clock, ShieldCheck } from 'lucide-react';

interface FilmDetailsProps {
  params: { slug: string };
}

export default async function FilmDetailsPage({ params }: FilmDetailsProps) {
  const film = await getFilmBySlug(params.slug);

  if (!film) {
    notFound();
  }

  const durationMin = Math.round(film.duration_seconds / 60);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Video Streaming Player Container */}
      <div className="mb-10">
        <VideoPlayer
          videoUrl={film.video_url}
          posterUrl={film.banner_url || film.poster_url}
          title={film.title}
        />
      </div>

      {/* Film Header Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-bold bg-cinema-accent text-white px-2.5 py-0.5 rounded-md">
                {film.certificate}
              </span>
              {film.languages && film.languages[0] && (
                <span className="text-xs font-semibold text-cinema-teal bg-cinema-surface border border-cinema-teal/30 px-2.5 py-0.5 rounded-md">
                  {film.languages[0].name}
                </span>
              )}
              {film.genres && film.genres[0] && (
                <span className="text-xs font-semibold text-cinema-gold bg-cinema-surface border border-cinema-gold/30 px-2.5 py-0.5 rounded-md">
                  {film.genres[0].name}
                </span>
              )}
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              {film.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-cinema-muted mt-3">
              <span className="flex items-center gap-1 text-cinema-gold font-bold">
                <Star className="w-4 h-4 fill-cinema-gold" />
                {film.rating_average.toFixed(1)} ({film.rating_count} ratings)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {durationMin} mins
              </span>
              <span>•</span>
              <span>{film.release_year}</span>
              <span>•</span>
              <span>{film.views_count.toLocaleString()} Views</span>
            </div>
          </div>

          {/* Interactive Action Row */}
          <FilmActions
            filmId={film.id}
            filmTitle={film.title}
            initialLikesCount={film.likes_count}
          />

          {/* Synopsis */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Synopsis</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{film.description}</p>
          </div>

          {/* Cast & Crew */}
          <div className="bg-cinema-card rounded-2xl p-5 border border-cinema-border space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Cast & Crew</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-cinema-muted block">Director</span>
                <span className="font-semibold text-white">{film.director}</span>
              </div>
              {film.producer && (
                <div>
                  <span className="text-cinema-muted block">Producer</span>
                  <span className="font-semibold text-white">{film.producer}</span>
                </div>
              )}
              {film.production_house && (
                <div>
                  <span className="text-cinema-muted block">Production House</span>
                  <span className="font-semibold text-white">{film.production_house}</span>
                </div>
              )}
            </div>

            {film.cast_members && film.cast_members.length > 0 && (
              <div className="pt-2">
                <span className="text-xs text-cinema-muted block mb-2">Key Cast</span>
                <div className="flex flex-wrap gap-2">
                  {film.cast_members.map((member, i) => (
                    <span key={i} className="text-xs bg-cinema-surface px-3 py-1 rounded-lg border border-cinema-border text-gray-200">
                      {member.name} ({member.role})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Poster Card & Filmmaker Showcase */}
        <div className="space-y-6">
          <div className="relative aspect-[2/3] w-full rounded-3xl overflow-hidden border border-cinema-border shadow-2xl">
            <Image src={film.poster_url} alt={film.title} fill className="object-cover" />
          </div>

          {/* Filmmaker Profile Box */}
          <div className="bg-cinema-card rounded-2xl p-5 border border-cinema-border space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cinema-accent/20 border border-cinema-accent flex items-center justify-center font-bold text-cinema-accent">
                {film.director.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h4 className="font-bold text-sm text-white">{film.director}</h4>
                  <ShieldCheck className="w-4 h-4 text-cinema-teal" />
                </div>
                <span className="text-xs text-cinema-muted">Independent Filmmaker</span>
              </div>
            </div>

            <FollowButton directorName={film.director} />
          </div>
        </div>

      </div>

      {/* Reviews & Ratings Section */}
      <ReviewSection filmId={film.id} />

      {/* Comments Section */}
      <CommentSection filmId={film.id} />

    </div>
  );
}
