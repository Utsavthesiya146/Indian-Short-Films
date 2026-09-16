'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Plus, Check, Share2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  toggleFilmLike,
  checkUserLiked,
  toggleWatchlist,
  checkInWatchlist,
  getCurrentSession
} from '@/lib/supabase';

interface FilmActionsProps {
  filmId: string;
  filmTitle: string;
  initialLikesCount: number;
}

export const FilmActions: React.FC<FilmActionsProps> = ({ filmId, filmTitle, initialLikesCount }) => {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadStatus() {
      const session = await getCurrentSession();
      if (session?.user) {
        const [isLiked, isWatch] = await Promise.all([
          checkUserLiked(filmId),
          checkInWatchlist(filmId)
        ]);
        setLiked(isLiked);
        setInWatchlist(isWatch);
      }
    }
    loadStatus();
  }, [filmId]);

  const handleLike = async () => {
    setLikeLoading(true);
    try {
      const isNowLiked = await toggleFilmLike(filmId);
      setLiked(isNowLiked);
      setLikesCount(prev => (isNowLiked ? prev + 1 : Math.max(0, prev - 1)));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Please sign in to like films.');
      router.push('/login');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleWatchlist = async () => {
    setWatchlistLoading(true);
    try {
      const isNowWatch = await toggleWatchlist(filmId);
      setInWatchlist(isNowWatch);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Please sign in to manage your watchlist.');
      router.push('/login');
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: filmTitle,
          text: `Watch ${filmTitle} on Indian Short Films!`,
          url: url
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 pt-2 pb-4 border-b border-cinema-border">
      {/* Like Button */}
      <button
        onClick={handleLike}
        disabled={likeLoading}
        className={`px-5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
          liked
            ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
            : 'bg-cinema-surface hover:bg-cinema-card text-white border-cinema-border'
        }`}
      >
        {likeLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-cinema-accent" />
        ) : (
          <Heart className={`w-4 h-4 ${liked ? 'text-rose-500 fill-rose-500' : 'text-cinema-accent'}`} />
        )}
        {liked ? `Liked (${likesCount})` : `Like (${likesCount})`}
      </button>

      {/* Watchlist Button */}
      <button
        onClick={handleWatchlist}
        disabled={watchlistLoading}
        className={`px-5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
          inWatchlist
            ? 'bg-cinema-gold/10 border-cinema-gold/40 text-cinema-gold'
            : 'bg-cinema-surface hover:bg-cinema-card text-white border-cinema-border'
        }`}
      >
        {watchlistLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-cinema-gold" />
        ) : inWatchlist ? (
          <Check className="w-4 h-4 text-cinema-gold" />
        ) : (
          <Plus className="w-4 h-4 text-cinema-gold" />
        )}
        {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
      </button>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="px-5 py-2.5 rounded-xl bg-cinema-surface hover:bg-cinema-card text-white border border-cinema-border text-xs font-semibold flex items-center gap-2 transition-all"
      >
        <Share2 className="w-4 h-4 text-cinema-teal" />
        {copied ? 'Link Copied!' : 'Share'}
      </button>
    </div>
  );
};
