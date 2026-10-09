import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Heart, 
  Bookmark, 
  Share2, 
  Star, 
  Clock, 
  Globe, 
  Award, 
  Send, 
  Check, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { ShortFilm, Review, Comment, User, Creator } from '../types';
import { PlatformStore } from '../services/platformStore';

interface FilmPlayerModalProps {
  film: ShortFilm;
  onClose: () => void;
  currentUser: User | null;
  onLikeFilm: (filmId: string) => void;
  onSaveFilm: (filmId: string) => void;
  onAddReview: (filmId: string, rating: number, headline: string, comment: string) => void;
  onAddComment: (targetId: string, text: string) => void;
  reviews: Review[];
  comments: Comment[];
  onSelectCreator: (creatorId: string) => void;
}

export const FilmPlayerModal: React.FC<FilmPlayerModalProps> = ({
  film,
  onClose,
  currentUser,
  onLikeFilm,
  onSaveFilm,
  onAddReview,
  onAddComment,
  reviews,
  comments,
  onSelectCreator
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [durationStr, setDurationStr] = useState(film.duration);
  const [activeTab, setActiveTab] = useState<'synopsis' | 'reviews' | 'discussion'>('synopsis');
  const [copiedToast, setCopiedToast] = useState(false);

  // Review Form state
  const [userRating, setUserRating] = useState(5);
  const [reviewHeadline, setReviewHeadline] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Discussion state
  const [discussionText, setDiscussionText] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (film?.id) {
      PlatformStore.incrementView(film.id, 'film');
    }
  }, [film?.id]);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 1;
      setProgress((cur / dur) * 100);
      setCurrentTime(formatSeconds(cur));
      if (videoRef.current.duration) {
        setDurationStr(formatSeconds(videoRef.current.duration));
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current && videoRef.current.duration) {
      const seekVal = parseFloat(e.target.value);
      videoRef.current.currentTime = (seekVal / 100) * videoRef.current.duration;
      setProgress(seekVal);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewHeadline.trim() || !reviewComment.trim()) return;
    onAddReview(film.id, userRating, reviewHeadline.trim(), reviewComment.trim());
    setReviewHeadline('');
    setReviewComment('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  const submitDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionText.trim()) return;
    onAddComment(film.id, discussionText.trim());
    setDiscussionText('');
  };

  const filmReviews = reviews.filter(r => r.filmId === film.id);
  const filmComments = comments.filter(c => c.targetId === film.id);

  return (
    <div 
      id="film-player-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4 backdrop-blur-md overflow-y-auto"
    >
      <div 
        className="relative my-auto flex max-h-[96vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toast */}
        {copiedToast && (
          <div className="absolute top-4 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black shadow-xl">
            <Check className="h-4 w-4" />
            <span>Film link copied to clipboard!</span>
          </div>
        )}

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-400">
              {film.category}
            </span>
            <span className="text-xs text-slate-400">• {film.language} • {film.genre}</span>
          </div>
          <button
            id="close-film-player-btn"
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-800 p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Video Player Box */}
        <div className="relative aspect-video w-full bg-black">
          <video
            ref={videoRef}
            src={film.videoUrl}
            poster={film.posterUrl}
            playsInline
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onClick={togglePlay}
            className="h-full w-full object-contain cursor-pointer"
          />

          {/* Big Play Overlay */}
          {!isPlaying && (
            <div 
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-black shadow-xl transition-transform hover:scale-110">
                <Play className="h-8 w-8 translate-x-0.5 fill-current" />
              </div>
            </div>
          )}

          {/* Controls Bar */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 sm:p-4">
            {/* Seeker */}
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500 mb-2"
            />

            <div className="flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-3">
                <button 
                  onClick={togglePlay} 
                  className="rounded-lg bg-white/10 p-1.5 hover:bg-white/20"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                </button>
                <button 
                  onClick={toggleMute} 
                  className="rounded-lg bg-white/10 p-1.5 hover:bg-white/20"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4 text-amber-400" />}
                </button>
                <span className="font-mono text-slate-300">
                  {currentTime} / {durationStr}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-amber-400 font-semibold">{film.title}</span>
                <button 
                  onClick={toggleFullscreen}
                  className="rounded-lg bg-white/10 p-1.5 hover:bg-white/20"
                  aria-label="Fullscreen"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Film Information & Interactive Tabs */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Header Row: Title, Creator, Actions */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{film.title}</h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {film.rating} ({film.reviewsCount} reviews)
                </span>
                <span>• {film.viewsCount.toLocaleString()} views</span>
                <span>• Released {film.releaseYear}</span>
                <span>• Directed by <strong className="text-slate-200">{film.director}</strong></span>
              </div>
            </div>

            {/* Action Buttons: Like, Save, Share */}
            <div className="flex items-center gap-2">
              <button
                id="film-like-action"
                onClick={() => onLikeFilm(film.id)}
                className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                  currentUser?.likedFilmIds.includes(film.id)
                    ? 'border-red-600 bg-red-600/20 text-red-400'
                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                }`}
              >
                <Heart className={`h-4 w-4 ${currentUser?.likedFilmIds.includes(film.id) ? 'fill-current' : ''}`} />
                <span>{(film.likesCount + (currentUser?.likedFilmIds.includes(film.id) ? 1 : 0)).toLocaleString()}</span>
              </button>

              <button
                id="film-save-action"
                onClick={() => onSaveFilm(film.id)}
                className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                  currentUser?.savedFilmIds.includes(film.id)
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${currentUser?.savedFilmIds.includes(film.id) ? 'fill-current' : ''}`} />
                <span>{currentUser?.savedFilmIds.includes(film.id) ? 'Saved' : 'Save'}</span>
              </button>

              <button
                id="film-share-action"
                onClick={handleShare}
                className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:border-slate-700"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Creator Spotlight Box */}
          <div 
            onClick={() => {
              onClose();
              onSelectCreator(film.creatorId);
            }}
            className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 transition-all hover:border-amber-500/40 hover:bg-slate-900"
          >
            <div className="flex items-center gap-3">
              <img
                src={film.creatorAvatar}
                alt={film.creatorName}
                referrerPolicy="no-referrer"
                className="h-12 w-12 rounded-xl object-cover border border-amber-400"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{film.creatorName}</span>
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                    Verified Creator
                  </span>
                </div>
                <p className="text-xs text-slate-400">Click to explore filmography, bio & productions</p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400">View Profile →</span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800">
            <button
              onClick={() => setActiveTab('synopsis')}
              className={`border-b-2 px-4 py-2.5 text-xs font-bold transition-colors ${
                activeTab === 'synopsis'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Overview & Cast
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`border-b-2 px-4 py-2.5 text-xs font-bold transition-colors ${
                activeTab === 'reviews'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Ratings & Reviews ({filmReviews.length})
            </button>
            <button
              onClick={() => setActiveTab('discussion')}
              className={`border-b-2 px-4 py-2.5 text-xs font-bold transition-colors ${
                activeTab === 'discussion'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Live Discussion ({filmComments.length})
            </button>
          </div>

          {/* Tab 1: Overview & Cast */}
          {activeTab === 'synopsis' && (
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-300">
              <div>
                <h4 className="font-bold text-white text-sm mb-1">Synopsis</h4>
                <p>{film.synopsis || film.description}</p>
              </div>

              {film.cast && film.cast.length > 0 && (
                <div>
                  <h4 className="font-bold text-white text-sm mb-1.5">Key Cast</h4>
                  <div className="flex flex-wrap gap-2">
                    {film.cast.map((actor, idx) => (
                      <span key={idx} className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-200">
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {film.awards && film.awards.length > 0 && (
                <div>
                  <h4 className="font-bold text-amber-400 text-sm mb-1.5 flex items-center gap-1.5">
                    <Award className="h-4 w-4" />
                    Festival Honors & Awards
                  </h4>
                  <ul className="space-y-1">
                    {film.awards.map((award, i) => (
                      <li key={i} className="text-slate-300 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        {award}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {film.tags && film.tags.length > 0 && (
                <div className="pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {film.tags.map((t, i) => (
                      <span key={i} className="rounded-full border border-slate-800 bg-slate-900 px-2.5 py-0.5 text-[11px] text-slate-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Ratings & Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Write Review Form */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-amber-400" />
                  Rate & Review this Short Film
                </h4>

                {reviewSuccess && (
                  <div className="mb-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-2.5 text-xs font-semibold text-emerald-300">
                    Thank you! Your verified review has been posted.
                  </div>
                )}

                <form onSubmit={submitReview} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Your Rating:</label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className="p-1 transition-transform hover:scale-125 focus:outline-none"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              star <= userRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-xs font-bold text-amber-400">{userRating} / 5 Stars</span>
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Headline (e.g. Masterclass in storytelling and sound)"
                      value={reviewHeadline}
                      onChange={(e) => setReviewHeadline(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <textarea
                      required
                      rows={3}
                      placeholder="Write your constructive review for the filmmaker and community..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black transition-transform active:scale-95"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Review</span>
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                {filmReviews.length === 0 ? (
                  <p className="py-4 text-center text-xs text-slate-400">
                    No reviews yet. Be the first to share your rating!
                  </p>
                ) : (
                  filmReviews.map((rev) => (
                    <div key={rev.id} className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.userAvatar}
                            alt={rev.userName}
                            referrerPolicy="no-referrer"
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <div>
                            <span className="font-bold text-xs text-white">{rev.userName}</span>
                            <span className="text-[10px] text-slate-400 block">{rev.createdAt}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${i < rev.rating ? 'fill-current' : 'text-slate-700'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <h5 className="text-xs font-bold text-slate-100">{rev.headline}</h5>
                      <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Live Discussion */}
          {activeTab === 'discussion' && (
            <div className="space-y-4">
              <form onSubmit={submitDiscussion} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Share your thoughts on the cinematography or story..."
                  value={discussionText}
                  onChange={(e) => setDiscussionText(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!discussionText.trim()}
                  className="rounded-xl bg-amber-500 px-4 text-xs font-bold text-black disabled:opacity-40"
                >
                  Post
                </button>
              </form>

              <div className="space-y-2.5">
                {filmComments.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">
                    No comments yet. Start the conversation!
                  </p>
                ) : (
                  filmComments.map((c) => (
                    <div key={c.id} className="flex gap-2.5 rounded-xl bg-slate-900/60 p-3 text-xs">
                      <img
                        src={c.userAvatar}
                        alt={c.userName}
                        referrerPolicy="no-referrer"
                        className="h-7 w-7 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-amber-400">{c.userName}</span>
                          <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                        </div>
                        <p className="text-slate-200">{c.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
