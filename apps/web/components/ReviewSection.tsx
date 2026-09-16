'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RatingStars } from './RatingStars';
import { ThumbsUp, Flag, MessageSquare, Send, CheckCircle2, AlertCircle, LogIn } from 'lucide-react';
import { getFilmReviews, createReview, submitRating, createReport, getCurrentSession } from '@/lib/supabase';
import { Review } from '@/types';

interface ReviewSectionProps {
  filmId: string;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ filmId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [userSession, setUserSession] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const [data, session] = await Promise.all([
        getFilmReviews(filmId),
        getCurrentSession()
      ]);
      setReviews(data);
      setUserSession(session);
    }
    loadData();
  }, [filmId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    if (!userSession) {
      setErrorMsg('Please sign in to write a review.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Submit rating stars
      let ratingId: string | undefined;
      try {
        const ratingResult = await submitRating(filmId, newRating);
        ratingId = ratingResult?.id;
      } catch {
        // Rating optional fallback
      }

      // 2. Submit review text
      const newRev = await createReview({
        filmId,
        content: newReviewText,
        ratingId
      });

      setReviews([newRev, ...reviews]);
      setNewReviewText('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to post review. Please try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async (reviewId: string) => {
    try {
      await createReport({
        targetType: 'review',
        targetId: reviewId,
        reason: 'abusive',
        details: 'Reported by user from review section'
      });
      alert('Report submitted to moderators. Thank you.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Please sign in to report content.';
      alert(msg);
    }
  };

  return (
    <div className="bg-cinema-card rounded-3xl p-6 sm:p-8 border border-cinema-border mt-12">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-6 h-6 text-cinema-accent" />
        <h3 className="font-display font-bold text-xl text-white">Audience Reviews & Ratings</h3>
      </div>

      {/* Review Submission Form */}
      <form onSubmit={handleSubmit} className="bg-cinema-surface rounded-2xl p-5 border border-cinema-border mb-8 space-y-4">
        <h4 className="text-sm font-semibold text-white">Write a Review & Rate</h4>
        
        <div className="flex items-center gap-3">
          <span className="text-xs text-cinema-muted">Your Rating:</span>
          <RatingStars rating={newRating} interactive size="md" onRatingSubmit={setNewRating} />
        </div>

        <textarea
          value={newReviewText}
          onChange={(e) => setNewReviewText(e.target.value)}
          placeholder="Share your thoughts about the film, performance, screenplay..."
          rows={3}
          className="w-full bg-cinema-card border border-cinema-border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cinema-accent placeholder-gray-500"
          maxLength={1000}
        />

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {errorMsg}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-cinema-muted">{newReviewText.length} / 1000 characters</span>
          <button
            type="submit"
            disabled={loading || !newReviewText.trim()}
            className="px-5 py-2.5 rounded-xl bg-cinema-accent hover:bg-cinema-accentHover disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-all"
          >
            <Send className="w-3.5 h-3.5" /> {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>

        {submitted && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Your review has been published!
          </div>
        )}
      </form>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div key={rev.id} className="p-5 rounded-2xl bg-cinema-surface/60 border border-cinema-border/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-cinema-border flex-shrink-0 bg-cinema-card flex items-center justify-center font-bold text-white text-xs">
                    {rev.profile?.avatar_url ? (
                      <Image src={rev.profile.avatar_url} alt={rev.profile.full_name || 'User'} fill className="object-cover" sizes="36px" />
                    ) : (
                      (rev.profile?.full_name || 'Audience').charAt(0)
                    )}
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-white">{rev.profile?.full_name || rev.profile?.username || 'Audience Member'}</h5>
                    <span className="text-[11px] text-cinema-muted">{new Date(rev.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <RatingStars rating={rev.stars || 5} size="sm" />
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">{rev.content}</p>

              <div className="flex items-center gap-4 text-xs text-cinema-muted pt-1">
                <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <ThumbsUp className="w-3.5 h-3.5" /> {rev.likes_count || 0} Helpful
                </button>
                <button
                  onClick={() => handleReport(rev.id)}
                  className="flex items-center gap-1.5 hover:text-cinema-accent transition-colors"
                >
                  <Flag className="w-3.5 h-3.5" /> Report
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-xs text-cinema-muted">
            No reviews yet. Be the first to review this short film!
          </div>
        )}
      </div>
    </div>
  );
};
