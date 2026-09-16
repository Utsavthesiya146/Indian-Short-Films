'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getUserWatchlist, getUserWatchHistory, toggleWatchlist } from '@/lib/supabase';
import { Watchlist, WatchHistory } from '@/types';
import { Bookmark, Play, Trash2, Clock, Loader2 } from 'lucide-react';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<Watchlist[]>([]);
  const [watchHistory, setWatchHistory] = useState<WatchHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      setLoading(true);
      try {
        const [wList, wHist] = await Promise.all([
          getUserWatchlist(),
          getUserWatchHistory()
        ]);
        setWatchlist(wList);
        setWatchHistory(wHist);
      } catch {
        setWatchlist([]);
        setWatchHistory([]);
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, []);

  const handleRemove = async (filmId: string) => {
    try {
      await toggleWatchlist(filmId);
      setWatchlist(watchlist.filter((item) => item.film_id !== filmId));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update watchlist.';
      alert(msg);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Page Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-cinema-gold/20 border border-cinema-gold/40 flex items-center justify-center">
          <Bookmark className="w-5 h-5 text-cinema-gold" />
        </div>
        <div>
          <h1 className="font-display font-extrabold text-3xl text-white">My Watchlist</h1>
          <p className="text-xs text-cinema-muted">Saved short films synced across your devices</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-cinema-muted flex justify-center items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-cinema-accent" />
          <span className="text-xs">Loading your saved watchlist...</span>
        </div>
      ) : (
        <>
          {/* Continue Watching Section */}
          {watchHistory.length > 0 && (
            <section className="mb-12">
              <h2 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-cinema-teal" /> Continue Watching
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {watchHistory.map((item) => {
                  const film = item.film;
                  if (!film) return null;
                  const posMin = Math.floor(item.last_position_seconds / 60);
                  const durMin = Math.floor(item.duration_seconds / 60);

                  return (
                    <div
                      key={item.id}
                      className="bg-cinema-card rounded-2xl p-4 border border-cinema-border flex gap-4 items-center group hover:border-cinema-teal/50 transition-all"
                    >
                      <div className="relative w-28 aspect-video rounded-xl overflow-hidden flex-shrink-0 bg-black">
                        <Image src={film.banner_url || film.poster_url} alt={film.title} fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-white truncate">{film.title}</h4>
                        <span className="text-xs text-cinema-muted block mt-0.5">Resume at {posMin}:{item.last_position_seconds % 60 < 10 ? '0' : ''}{item.last_position_seconds % 60} / {durMin}m</span>
                        <div className="w-full bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div className="bg-cinema-teal h-full" style={{ width: `${item.completion_percentage}%` }} />
                        </div>
                      </div>
                      <Link
                        href={`/film/${film.slug}`}
                        className="px-3 py-1.5 rounded-xl bg-cinema-surface hover:bg-cinema-teal hover:text-cinema-bg text-xs font-semibold text-white border border-cinema-border transition-all flex-shrink-0"
                      >
                        Resume
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Watchlist Grid */}
          <section>
            <h2 className="font-display font-bold text-lg text-white mb-4">Saved Short Films ({watchlist.length})</h2>

            {watchlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {watchlist.map((item) => {
                  const film = item.film;
                  if (!film) return null;

                  return (
                    <div
                      key={item.id}
                      className="bg-cinema-card rounded-2xl p-4 border border-cinema-border flex gap-4 items-center"
                    >
                      <div className="relative w-20 aspect-[2/3] rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={film.poster_url} alt={film.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-white truncate">{film.title}</h4>
                        <span className="text-xs text-cinema-muted block mt-0.5">Dir. {film.director}</span>
                        <span className="text-xs text-cinema-gold font-semibold block mt-1">★ {(film.rating_average || 5.0).toFixed(1)}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/film/${film.slug}`}
                          className="p-2 rounded-xl bg-cinema-accent hover:bg-cinema-accentHover text-white flex items-center justify-center shadow-md"
                        >
                          <Play className="w-4 h-4 fill-white" />
                        </Link>
                        <button
                          onClick={() => handleRemove(item.film_id)}
                          className="p-2 rounded-xl bg-cinema-surface hover:bg-red-500/20 text-cinema-muted hover:text-red-400 border border-cinema-border transition-colors"
                          title="Remove from Watchlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-cinema-card rounded-3xl p-12 text-center border border-cinema-border">
                <Bookmark className="w-12 h-12 text-cinema-muted mx-auto mb-3 opacity-40" />
                <h3 className="font-bold text-white text-base">Your Watchlist is Empty</h3>
                <p className="text-xs text-cinema-muted mt-1 mb-4">Explore films and click &quot;+ Add to Watchlist&quot; to save stories for later.</p>
                <Link href="/discover" className="px-4 py-2 rounded-xl bg-cinema-accent text-white text-xs font-bold">
                  Browse Short Films
                </Link>
              </div>
            )}
          </section>
        </>
      )}

    </div>
  );
}
