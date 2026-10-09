import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Bookmark, 
  Share2, 
  Star, 
  Clock, 
  Globe, 
  Film, 
  Sparkles, 
  Check, 
  UserCheck, 
  FileText,
  Clapperboard,
  Heart,
  MessageSquare,
  Award
} from 'lucide-react';
import { ShortFilm, Review, Comment, User } from '../types';

interface FilmDetailModalProps {
  film: ShortFilm | null;
  isOpen?: boolean;
  onClose: () => void;
  onPlay?: (film: ShortFilm) => void;
  onWatchNow?: (film: ShortFilm) => void;
  onToggleSave?: (filmId: string) => void;
  onSaveFilm?: (filmId: string) => void;
  currentUser?: User | null;
  reviews?: Review[];
  comments?: Comment[];
  onAddReview?: (filmId: string, rating: number, headline: string, comment: string) => void;
  onAddComment?: (filmId: string, text: string) => void;
  onSelectCreator?: (creatorId: string) => void;
}

export const FilmDetailModal: React.FC<FilmDetailModalProps> = ({
  film,
  isOpen = true,
  onClose,
  onPlay,
  onWatchNow,
  onToggleSave,
  onSaveFilm,
  currentUser,
  reviews = [],
  comments = [],
  onAddReview,
  onAddComment,
  onSelectCreator
}) => {
  const [copiedToast, setCopiedToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'cast' | 'crew' | 'reviews'>('about');
  
  // Review form state
  const [newRating, setNewRating] = useState(9);
  const [newHeadline, setNewHeadline] = useState('');
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!isOpen || !film) return null;

  const handlePlayAction = () => {
    onClose();
    if (onPlay) onPlay(film);
    else if (onWatchNow) onWatchNow(film);
  };

  const handleSaveAction = () => {
    if (onSaveFilm) onSaveFilm(film.id);
    else if (onToggleSave) onToggleSave(film.id);
  };

  const isSaved = currentUser?.savedFilmIds?.includes(film.id);
  const filmReviews = reviews.filter(r => r.filmId === film.id);
  const votesCount = Math.max(12, Math.round(((film.likesCount || 8) * 1.5) + ((film.viewsCount || 50) / 40)));

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddReview || !currentUser || !newComment.trim()) return;
    onAddReview(film.id, newRating, newHeadline.trim() || 'Audience Review', newComment.trim());
    setReviewSubmitted(true);
    setShowReviewForm(false);
    setNewComment('');
    setNewHeadline('');
  };

  return (
    <div 
      id="film-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-2 sm:p-4 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl rounded-2xl bg-white text-[#222222] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black transition-all active:scale-95"
          title="Close details"
        >
          <X className="h-4 w-4" />
        </button>

        {/* BookMyShow Style Header with Backdrop and Left Poster */}
        <div className="relative bg-[#1f2533] text-white p-5 sm:p-8 shrink-0 overflow-hidden">
          {/* Subtle background art */}
          <div className="absolute inset-0 z-0 opacity-25">
            <img
              src={film.backdropUrl || film.posterUrl}
              alt={film.title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1f2533] via-[#1f2533]/90 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
            {/* Poster Card */}
            <div className="w-28 sm:w-44 shrink-0 rounded-lg overflow-hidden shadow-xl border border-gray-700 aspect-[2/3] bg-gray-900 mx-auto sm:mx-0">
              <img
                src={film.posterUrl}
                alt={film.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Title & Metadata Details */}
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                {film.title}
              </h1>

              {/* BookMyShow Rating Strip */}
              <div className="inline-flex items-center gap-3 bg-[#2b3148] px-3.5 py-2 rounded-lg border border-gray-700">
                <div className="flex items-center gap-1 text-sm font-bold text-white">
                  <Star className="h-4 w-4 fill-[#f84464] text-[#f84464]" />
                  <span>{film.rating > 0 ? film.rating.toFixed(1) : '8.5'}/10</span>
                  <span className="text-xs text-gray-400 font-normal">({votesCount}K Votes)</span>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('reviews');
                    setShowReviewForm(true);
                  }}
                  className="rounded bg-white/10 hover:bg-white/20 px-2.5 py-1 text-xs font-semibold text-white transition-colors"
                >
                  Rate now
                </button>
              </div>

              {/* Tags Strip */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-gray-300">
                <span className="rounded bg-white/10 px-2 py-0.5 font-semibold text-white">2D, HD</span>
                <span className="rounded bg-white/10 px-2 py-0.5 font-semibold text-white">{film.language}</span>
                <span>•</span>
                <span>{film.duration}</span>
                <span>•</span>
                <span>{film.genre}</span>
                <span>•</span>
                <span>{film.releaseYear || 2025}</span>
              </div>

              {film.logline && (
                <p className="text-xs sm:text-sm text-gray-300 italic line-clamp-2">
                  "{film.logline}"
                </p>
              )}

              {/* Action Buttons in signature BookMyShow Red */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                <button
                  id="modal-watch-now-btn"
                  onClick={handlePlayAction}
                  className="flex items-center gap-2 rounded-lg bg-[#f84464] hover:bg-[#e03352] px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-md transition-all active:scale-95"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>Watch Now</span>
                </button>

                {(onSaveFilm || onToggleSave) && (
                  <button
                    id="modal-watchlist-btn"
                    onClick={handleSaveAction}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                      isSaved
                        ? 'border-[#f84464] bg-[#f84464]/20 text-[#f84464]'
                        : 'border-gray-600 bg-white/10 text-white hover:border-white'
                    }`}
                  >
                    {isSaved ? <Check className="h-4 w-4 text-[#f84464]" /> : <Bookmark className="h-4 w-4" />}
                    <span>{isSaved ? 'In Watchlist' : 'Add to Watchlist'}</span>
                  </button>
                )}

                <button
                  id="modal-share-btn"
                  onClick={handleShare}
                  className="flex items-center gap-2 rounded-lg border border-gray-600 bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:border-white transition-all"
                >
                  <Share2 className="h-4 w-4" />
                  <span>{copiedToast ? 'Link Copied!' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Header Navigation */}
        <div className="flex items-center gap-6 px-6 pt-3 border-b border-gray-200 bg-white text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-2.5 font-bold border-b-2 transition-all ${
              activeTab === 'about'
                ? 'border-[#f84464] text-[#f84464]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            About the Movie
          </button>
          <button
            onClick={() => setActiveTab('cast')}
            className={`pb-2.5 font-bold border-b-2 transition-all ${
              activeTab === 'cast'
                ? 'border-[#f84464] text-[#f84464]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Cast
          </button>
          <button
            onClick={() => setActiveTab('crew')}
            className={`pb-2.5 font-bold border-b-2 transition-all ${
              activeTab === 'crew'
                ? 'border-[#f84464] text-[#f84464]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Crew
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2.5 font-bold border-b-2 transition-all ${
              activeTab === 'reviews'
                ? 'border-[#f84464] text-[#f84464]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Reviews & Ratings ({filmReviews.length})
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-white">
          
          {/* TAB 1: ABOUT */}
          {activeTab === 'about' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-[#222222] mb-2">Synopsis</h3>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {film.description || film.synopsis || 'No synopsis provided for this title.'}
                </p>
              </div>

              {film.director && (
                <div className="pt-3 border-t border-gray-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Director & Creator</h4>
                  <div 
                    onClick={() => {
                      if (onSelectCreator && film.creatorId) {
                        onClose();
                        onSelectCreator(film.creatorId);
                      }
                    }}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50/80 w-fit cursor-pointer hover:border-[#f84464] transition-all"
                  >
                    <div className="h-10 w-10 rounded-full bg-[#f84464]/10 text-[#f84464] flex items-center justify-center font-bold">
                      {film.director.charAt(0)}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-[#222222]">{film.director}</h5>
                      <p className="text-xs text-gray-500">Director • Indian Short Movie</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CAST */}
          {activeTab === 'cast' && (
            <div>
              <h3 className="text-base font-bold text-[#222222] mb-4">Cast Members</h3>
              {film.cast && film.cast.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {film.cast.map((actor, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <div className="h-10 w-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {actor.charAt(0)}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-[#222222]">{actor}</h5>
                        <p className="text-[11px] text-gray-500">Actor</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">Cast details will be updated soon.</p>
              )}
            </div>
          )}

          {/* TAB 3: CREW */}
          {activeTab === 'crew' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#222222] mb-2">Crew Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {film.director && (
                  <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                    <span className="text-xs text-gray-500">Director</span>
                    <h5 className="text-sm font-bold text-[#222222]">{film.director}</h5>
                  </div>
                )}
                {film.producer && (
                  <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                    <span className="text-xs text-gray-500">Producer</span>
                    <h5 className="text-sm font-bold text-[#222222]">{film.producer}</h5>
                  </div>
                )}
                <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                  <span className="text-xs text-gray-500">Production Studio</span>
                  <h5 className="text-sm font-bold text-[#222222]">Indian Global Films</h5>
                </div>
                <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                  <span className="text-xs text-gray-500">Audio / Format</span>
                  <h5 className="text-sm font-bold text-[#222222]">Dolby Atmos 5.1 & 4K Ultra HD</h5>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#222222]">Audience Reviews</h3>
                  <p className="text-xs text-gray-500">{filmReviews.length} reviews for this film</p>
                </div>

                {!showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="rounded-lg bg-[#f84464] hover:bg-[#e03352] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-all"
                  >
                    Write a Review
                  </button>
                )}
              </div>

              {/* Review submission form */}
              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Write Your Review</h4>
                  
                  {/* Rating Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600">Your Rating:</span>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      className="rounded border border-gray-300 bg-white px-2 py-1 text-xs font-bold text-[#222222] focus:outline-none focus:border-[#f84464]"
                    >
                      {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(num => (
                        <option key={num} value={num}>{num} / 10</option>
                      ))}
                    </select>
                  </div>

                  <input
                    type="text"
                    value={newHeadline}
                    onChange={(e) => setNewHeadline(e.target.value)}
                    placeholder="Short Headline (e.g. Masterpiece, Touching story...)"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#f84464]"
                  />

                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    placeholder="Share your review of the film, performances, and cinematography..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#f84464]"
                    required
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-[#f84464] hover:bg-[#e03352] px-4 py-1.5 text-xs font-bold text-white shadow-sm"
                    >
                      Post Review
                    </button>
                  </div>
                </form>
              )}

              {/* Review list */}
              {filmReviews.length > 0 ? (
                <div className="space-y-3">
                  {filmReviews.map(r => (
                    <div key={r.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#222222]">{r.userName}</span>
                          <span className="text-[10px] text-gray-400">{r.createdAt?.slice(0, 10) || 'Recent'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-[#f84464]">
                          <Star className="h-3 w-3 fill-current" />
                          <span>{r.rating}/10</span>
                        </div>
                      </div>
                      <h5 className="text-xs font-bold text-[#222222]">{r.headline}</h5>
                      <p className="text-xs text-gray-600 leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 py-3">No reviews yet. Be the first to share your thoughts!</p>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
