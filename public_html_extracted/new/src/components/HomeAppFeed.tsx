import React, { useState, useRef } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Film, 
  Star, 
  Check, 
  Send, 
  X, 
  Maximize2, 
  Sparkles, 
  PlusCircle, 
  Flame, 
  Clapperboard, 
  Clock, 
  ChevronRight,
  Info
} from 'lucide-react';
import { ShortFilm, ReelVideo, Creator, Comment, User } from '../types';

interface HomeAppFeedProps {
  films: ShortFilm[];
  reels: ReelVideo[];
  creators: Creator[];
  comments: Comment[];
  currentUser: User | null;
  onLikeFilm: (filmId: string) => void;
  onSaveFilm: (filmId: string) => void;
  onLikeReel: (reelId: string) => void;
  onSaveReel: (reelId: string) => void;
  onAddComment: (targetId: string, text: string) => void;
  onSelectFilm: (film: ShortFilm) => void;
  onSelectCreator: (creatorId: string) => void;
  onGoToReels: () => void;
  onOpenUpload: () => void;
}

export const HomeAppFeed: React.FC<HomeAppFeedProps> = ({
  films,
  reels,
  creators,
  comments,
  currentUser,
  onLikeFilm,
  onSaveFilm,
  onLikeReel,
  onSaveReel,
  onAddComment,
  onSelectFilm,
  onSelectCreator,
  onGoToReels,
  onOpenUpload
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'films' | 'reels' | 'trending'>('all');
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(films[0]?.id || null);
  const [isMuted, setIsMuted] = useState(true);
  const [activeCommentTarget, setActiveCommentTarget] = useState<{ id: string; title: string } | null>(null);
  const [commentText, setCommentText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [expandedDescIds, setExpandedDescIds] = useState<Record<string, boolean>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleShare = async (title: string) => {
    const shareData = {
      title,
      text: `Watch ${title} on Indian Short Movie`,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        navigator.clipboard?.writeText(window.location.href);
        showToast('Link copied to clipboard!');
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Link copied to clipboard!');
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeCommentTarget) return;
    onAddComment(activeCommentTarget.id, commentText.trim());
    setCommentText('');
    showToast('Comment posted successfully!');
  };

  const toggleExpand = (id: string) => {
    setExpandedDescIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter items for the feed
  const displayItems = React.useMemo(() => {
    if (activeTab === 'films') return films.map(f => ({ type: 'film' as const, data: f }));
    if (activeTab === 'reels') return reels.map(r => ({ type: 'reel' as const, data: r }));
    if (activeTab === 'trending') return films.filter(f => f.isTrending || f.rating >= 4.8).map(f => ({ type: 'film' as const, data: f }));
    
    // 'all': Interleave films and reels nicely
    const combined: Array<{ type: 'film' | 'reel'; data: any }> = [];
    const maxLen = Math.max(films.length, reels.length);
    for (let i = 0; i < maxLen; i++) {
      if (films[i]) combined.push({ type: 'film', data: films[i] });
      if (reels[i]) combined.push({ type: 'reel', data: reels[i] });
    }
    return combined;
  }, [activeTab, films, reels]);

  return (
    <div id="home-app-feed-root" className="mx-auto max-w-3xl px-3 sm:px-4 py-4 space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-xs font-bold text-black shadow-2xl animate-in fade-in duration-200">
          <Check className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. App Stories / Creator Channels Bar */}
      <div className="overflow-x-auto no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-4 py-2 min-w-max">
          {/* Creator Upload Shortcut */}
          <div 
            id="story-upload-shortcut"
            onClick={onOpenUpload}
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="relative flex h-16 w-16 sm:h-18 sm:w-18 items-center justify-center rounded-full bg-slate-900 border-2 border-dashed border-amber-500/60 transition-transform group-hover:scale-105 active:scale-95">
              <PlusCircle className="h-7 w-7 text-amber-400 group-hover:rotate-90 transition-transform" />
            </div>
            <span className="text-[11px] font-bold text-slate-300">Create</span>
          </div>

          {/* Creators List */}
          {creators.map((c) => (
            <div
              key={c.id}
              id={`story-creator-${c.id}`}
              onClick={() => onSelectCreator(c.id)}
              className="flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div className="relative rounded-full p-[2.5px] bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 transition-transform group-hover:scale-105 active:scale-95">
                <div className="h-16 w-16 sm:h-18 sm:w-18 rounded-full overflow-hidden border-2 border-slate-950 bg-slate-900">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                {c.isVerified && (
                  <div className="absolute bottom-0 right-0 rounded-full bg-amber-500 p-0.5 text-black ring-2 ring-slate-950">
                    <Sparkles className="h-3 w-3 fill-black" />
                  </div>
                )}
              </div>
              <span className="text-[11px] font-medium text-slate-300 max-w-[70px] truncate text-center group-hover:text-amber-400">
                {c.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Feed Type Selector Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            id="feed-tab-all"
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span>All Cinema</span>
          </button>

          <button
            id="feed-tab-films"
            onClick={() => setActiveTab('films')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'films'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Film className="h-3.5 w-3.5" />
            <span>Short Films</span>
          </button>

          <button
            id="feed-tab-reels"
            onClick={() => setActiveTab('reels')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'reels'
                ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Clapperboard className="h-3.5 w-3.5" />
            <span>Reels</span>
          </button>

          <button
            id="feed-tab-trending"
            onClick={() => setActiveTab('trending')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'trending'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            <span>Trending</span>
          </button>
        </div>

        {/* Global Sound Toggle Pill */}
        <button
          id="feed-sound-toggle-pill"
          onClick={() => setIsMuted(prev => !prev)}
          className="flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-700/80 px-3 py-1 text-[11px] font-bold text-slate-300 hover:text-amber-400 transition-colors"
          title={isMuted ? "Click to turn sound ON" : "Click to mute sound"}
        >
          {isMuted ? (
            <>
              <VolumeX className="h-3.5 w-3.5 text-red-400" />
              <span>Muted</span>
            </>
          ) : (
            <>
              <Volume2 className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span className="text-emerald-400">Audio ON</span>
            </>
          )}
        </button>
      </div>

      {/* 3. In-Feed Video Cards (Instagram / TikTok App Style) */}
      <div className="space-y-8">
        {displayItems.length === 0 ? (
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-12 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Film className="h-8 w-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-white">No videos uploaded yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Be the first creator, filmmaker, or brand to upload and showcase your work on Indian Short Movie.
              </p>
            </div>
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 px-6 py-3 text-xs font-bold text-white shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Upload Video Now</span>
            </button>
          </div>
        ) : (
          displayItems.map((item) => {
            const isFilm = item.type === 'film';
            const post = item.data;
            const isPostPlaying = playingVideoId === post.id;
            const isLiked = isFilm
              ? (currentUser?.likedFilmIds.includes(post.id) || post.isLiked)
              : (currentUser?.likedReelIds.includes(post.id) || post.isLiked);
            const isSaved = isFilm
              ? currentUser?.savedFilmIds.includes(post.id)
              : currentUser?.savedReelIds.includes(post.id);

            const postComments = comments.filter(c => c.targetId === post.id);
            const isExpanded = !!expandedDescIds[post.id];

          return (
            <article
              key={`${item.type}-${post.id}`}
              id={`feed-post-${post.id}`}
              className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/70 shadow-xl backdrop-blur-md transition-all hover:border-slate-700"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between p-3.5 sm:p-4">
                <div 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => onSelectCreator(post.creatorId)}
                >
                  <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-full overflow-hidden border-2 border-amber-400 shrink-0">
                    <img
                      src={post.creatorAvatar}
                      alt={post.creatorName}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-top transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                        {post.creatorName}
                      </span>
                      {post.creatorId === 'creator-harri-kumar' && (
                        <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-bold text-amber-400">
                          PRODUCER
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{post.language}</span>
                      <span>•</span>
                      <span>{post.genre || post.category}</span>
                      {post.duration && (
                        <>
                          <span>•</span>
                          <span className="font-mono">{post.duration}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Badge & Quick Action */}
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                    isFilm ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {isFilm ? 'Short Film' : 'Reel'}
                  </span>
                </div>
              </div>

              {/* Video Player Box */}
              <div className="relative w-full overflow-hidden bg-black flex items-center justify-center">
                {/* Responsive Aspect Ratio: 16:9 for films, or 9:14 for reels */}
                <div className={`relative w-full ${isFilm ? 'aspect-video' : 'aspect-[9/13] max-h-[580px]'}`}>
                  <video
                    id={`video-${post.id}`}
                    src={post.videoUrl}
                    poster={post.posterUrl}
                    playsInline
                    loop
                    muted={isMuted}
                    className="h-full w-full object-cover"
                    ref={(el) => {
                      if (el) {
                        if (isPostPlaying) {
                          el.play().catch(() => {});
                        } else {
                          el.pause();
                        }
                      }
                    }}
                    onClick={() => {
                      if (isPostPlaying) {
                        setPlayingVideoId(null);
                      } else {
                        setPlayingVideoId(post.id);
                      }
                    }}
                  />

                  {/* Play Overlay if paused */}
                  {!isPostPlaying && (
                    <div 
                      onClick={() => setPlayingVideoId(post.id)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer"
                    >
                      <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-amber-500 text-black shadow-xl shadow-amber-500/40 hover:scale-110 active:scale-95 transition-all">
                        <Play className="h-7 w-7 translate-x-0.5 fill-current" />
                      </div>
                    </div>
                  )}

                  {/* Sound & Fullscreen controls overlay */}
                  <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMuted(prev => !prev);
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md hover:bg-black/90 active:scale-90 transition-all"
                      aria-label={isMuted ? "Unmute sound" : "Mute sound"}
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4 text-red-400" />
                      ) : (
                        <Volume2 className="h-4 w-4 text-amber-400" />
                      )}
                    </button>

                    {isFilm && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectFilm(post);
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md hover:bg-black/90 active:scale-90 transition-all"
                        aria-label="Theater Mode"
                        title="Watch in Cinema Theater"
                      >
                        <Maximize2 className="h-4 w-4 text-slate-200" />
                      </button>
                    )}
                  </div>

                  {/* Autoplay Sound Hint */}
                  {isPostPlaying && isMuted && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMuted(false);
                      }}
                      className="absolute bottom-3 left-3 z-10 flex cursor-pointer items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 text-[11px] font-bold text-amber-300 backdrop-blur-md border border-amber-500/30 animate-pulse hover:bg-black"
                    >
                      <VolumeX className="h-3.5 w-3.5 text-red-400" />
                      <span>Tap to unmute sound</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="p-3.5 sm:p-4 space-y-3">
                <div className="flex items-center justify-between">
                  {/* Left Action Buttons: Like, Comment, Share */}
                  <div className="flex items-center gap-4 sm:gap-6">
                    {/* LIKE */}
                    <button
                      id={`like-btn-${post.id}`}
                      onClick={() => {
                        if (isFilm) {
                          onLikeFilm(post.id);
                        } else {
                          onLikeReel(post.id);
                        }
                      }}
                      className="flex items-center gap-1.5 text-slate-300 hover:text-red-500 transition-colors active:scale-90"
                      aria-label="Like video"
                    >
                      <Heart 
                        className={`h-6 w-6 transition-all ${
                          isLiked 
                            ? 'fill-red-500 text-red-500 scale-110' 
                            : 'text-slate-300'
                        }`} 
                      />
                      <span className={`text-xs font-bold ${isLiked ? 'text-red-400' : 'text-slate-300'}`}>
                        {post.likesCount.toLocaleString()}
                      </span>
                    </button>

                    {/* COMMENT */}
                    <button
                      id={`comment-btn-${post.id}`}
                      onClick={() => setActiveCommentTarget({ id: post.id, title: post.title })}
                      className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors active:scale-90"
                      aria-label="View comments"
                    >
                      <MessageCircle className="h-6 w-6" />
                      <span className="text-xs font-bold">
                        {postComments.length || post.commentsCount || 0}
                      </span>
                    </button>

                    {/* SHARE */}
                    <button
                      id={`share-btn-${post.id}`}
                      onClick={() => handleShare(post.title)}
                      className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors active:scale-90"
                      aria-label="Share video"
                    >
                      <Share2 className="h-5 w-5" />
                      <span className="text-xs font-bold hidden sm:inline">Share</span>
                    </button>
                  </div>

                  {/* Right Action: SAVE & Details */}
                  <div className="flex items-center gap-3">
                    {isFilm && (
                      <button
                        id={`open-details-btn-${post.id}`}
                        onClick={() => onSelectFilm(post)}
                        className="flex items-center gap-1 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20 active:scale-95 transition-all"
                      >
                        <Film className="h-3.5 w-3.5" />
                        <span>Theater Details</span>
                      </button>
                    )}

                    {!isFilm && (
                      <button
                        id={`open-reels-btn-${post.id}`}
                        onClick={onGoToReels}
                        className="flex items-center gap-1 rounded-xl bg-red-500/10 border border-red-500/30 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/20 active:scale-95 transition-all"
                      >
                        <Clapperboard className="h-3.5 w-3.5" />
                        <span>Full Reels</span>
                      </button>
                    )}

                    {/* SAVE */}
                    <button
                      id={`save-btn-${post.id}`}
                      onClick={() => {
                        if (isFilm) {
                          onSaveFilm(post.id);
                        } else {
                          onSaveReel(post.id);
                        }
                        showToast(isSaved ? 'Removed from Watchlist' : 'Saved to Watchlist');
                      }}
                      className="p-1 text-slate-300 hover:text-amber-400 transition-colors active:scale-90"
                      aria-label="Save to Watchlist"
                    >
                      <Bookmark 
                        className={`h-6 w-6 ${
                          isSaved ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`} 
                      />
                    </button>
                  </div>
                </div>

                {/* Views & Rating */}
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="font-semibold text-slate-200">
                    {post.viewsCount.toLocaleString()} views
                  </span>
                  {isFilm && post.rating && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-bold text-amber-400">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        {post.rating} ({post.reviewsCount} reviews)
                      </span>
                    </>
                  )}
                </div>

                {/* Caption / Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-white mb-1">
                    {post.title}
                  </h3>
                  <p className={`text-xs text-slate-300 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {post.description}
                  </p>
                  {post.description.length > 100 && (
                    <button
                      onClick={() => toggleExpand(post.id)}
                      className="mt-1 text-[11px] font-bold text-amber-400 hover:underline"
                    >
                      {isExpanded ? 'Show less' : '...more'}
                    </button>
                  )}
                </div>

                {/* Cast or Music credits */}
                {isFilm && post.cast && post.cast.length > 0 && (
                  <div className="text-[11px] text-slate-400">
                    Cast: <strong className="text-slate-200">{post.cast.join(', ')}</strong>
                  </div>
                )}

                {/* Quick Add Comment Prompt */}
                <div 
                  onClick={() => setActiveCommentTarget({ id: post.id, title: post.title })}
                  className="flex items-center gap-2 pt-2 border-t border-slate-800/80 cursor-pointer text-xs text-slate-400 hover:text-slate-300"
                >
                  <div className="h-6 w-6 rounded-full overflow-hidden bg-slate-800 shrink-0">
                    <img
                      src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                      alt="Avatar"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span>Add a comment...</span>
                </div>
              </div>
            </article>
          );
        }))}
      </div>

      {/* Slide-Up Mobile-Friendly Comment Sheet / Modal */}
      {activeCommentTarget && (
        <div 
          id="feed-comment-sheet-backdrop"
          onClick={() => setActiveCommentTarget(null)}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-2xl flex flex-col max-h-[80vh] animate-in slide-in-from-bottom duration-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase">Comments</span>
                <h4 className="text-sm font-bold text-white line-clamp-1">{activeCommentTarget.title}</h4>
              </div>
              <button
                onClick={() => setActiveCommentTarget(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3.5 min-h-[160px]">
              {comments.filter(c => c.targetId === activeCommentTarget.id).length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400">
                  No comments yet. Be the first to share your thoughts on this production!
                </div>
              ) : (
                comments
                  .filter(c => c.targetId === activeCommentTarget.id)
                  .map((c) => (
                    <div key={c.id} className="flex gap-2.5 text-xs">
                      <img
                        src={c.userAvatar}
                        alt={c.userName}
                        referrerPolicy="no-referrer"
                        className="h-8 w-8 rounded-full object-cover shrink-0 mt-0.5 border border-slate-700"
                      />
                      <div className="flex-1 rounded-2xl bg-slate-800/80 p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-amber-400">{c.userName}</span>
                          <span className="text-[10px] text-slate-500">{c.createdAt}</span>
                        </div>
                        <p className="text-slate-200 leading-relaxed">{c.text}</p>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleCommentSubmit} className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={currentUser ? "Write a comment..." : "Login to comment..."}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-black disabled:opacity-40 transition-transform active:scale-95 shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
