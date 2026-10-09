import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  ChevronUp, 
  ChevronDown, 
  Music2, 
  Check, 
  Send, 
  X,
  Maximize2,
  Sparkles,
  Clapperboard,
  Upload
} from 'lucide-react';
import { ReelVideo, Comment, User } from '../types';
import { PlatformStore } from '../services/platformStore';

interface ReelsFeedProps {
  reels: ReelVideo[];
  comments: Comment[];
  currentUser: User | null;
  onLikeReel: (reelId: string) => void;
  onSaveReel: (reelId: string) => void;
  onAddComment: (targetId: string, text: string) => void;
  onSelectCreator: (creatorId: string) => void;
  onOpenUpload?: () => void;
}

export const ReelsFeed: React.FC<ReelsFeedProps> = ({
  reels,
  comments,
  currentUser,
  onLikeReel,
  onSaveReel,
  onAddComment,
  onSelectCreator,
  onOpenUpload
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);
  const [progress, setProgress] = useState(0);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeReel = reels[currentIndex] || reels[0];

  // Play active video when index changes and increment real view
  useEffect(() => {
    if (activeReel?.id) {
      PlatformStore.incrementView(activeReel.id, 'reel');
    }
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay with sound restricted by browser; mute and retry
            setIsMuted(true);
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {});
            }
          });
      }
    }
  }, [currentIndex, activeReel?.id]);

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

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    const newMutedState = !videoRef.current.muted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    if (currentIndex < reels.length - 1) {
      setIsTransitioning(true);
      setCurrentIndex(prev => prev + 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [currentIndex, reels.length, isTransitioning]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    if (currentIndex > 0) {
      setIsTransitioning(true);
      setCurrentIndex(prev => prev - 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [currentIndex, isTransitioning]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;

    // Swipe threshold 50px
    if (diff > 50) {
      // Swiped UP -> Next
      handleNext();
    } else if (diff < -50) {
      // Swiped DOWN -> Prev
      handlePrev();
    }
    setTouchStartY(null);
  };

  // Keyboard navigation (ArrowUp/ArrowDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showCommentModal) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, showCommentModal]);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: activeReel.title,
      text: `Watch ${activeReel.title} on Indian Short Movie`,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        copyFallback();
      }
    } else {
      copyFallback();
    }
  };

  const copyFallback = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  if (!activeReel) {
    return (
      <div id="reels-empty-state" className="flex min-h-[calc(100dvh-10rem)] w-full items-center justify-center p-6 text-center">
        <div className="max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-10 space-y-4 shadow-2xl backdrop-blur-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400">
            <Clapperboard className="h-8 w-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-white">No reels uploaded yet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Be the first creator to upload vertical reels, trailers, teasers, and cinematic moments to Indian Short Movie.
            </p>
          </div>
          {onOpenUpload && (
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 px-6 py-3 text-xs font-bold text-white shadow-xl shadow-red-500/20 active:scale-95 transition-all"
            >
              <Upload className="h-4 w-4" />
              <span>Upload the First Reel</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(activeReel.id, commentText.trim());
    setCommentText('');
  };

  const reelComments = comments.filter(c => c.targetId === activeReel.id);
  const isLiked = currentUser?.likedReelIds.includes(activeReel.id) || activeReel.isLiked;
  const isSaved = currentUser?.savedReelIds.includes(activeReel.id) || activeReel.isSaved;

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      videoRef.current.requestFullscreen?.();
    }
  };

  return (
    <div 
      id="reels-feed-container" 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative flex min-h-[calc(100dvh-5rem)] w-full items-center justify-center bg-black py-1 sm:py-4 select-none"
    >
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed top-20 z-50 flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-xs font-bold text-black shadow-2xl animate-in fade-in duration-200">
          <Check className="h-4 w-4" />
          <span>Reel link copied to clipboard!</span>
        </div>
      )}

      {/* Main Vertical Video Frame (9:16 aspect ratio, mobile-first app layout) */}
      <div className="relative flex h-[calc(100dvh-7.5rem)] max-h-[840px] w-full max-w-[420px] sm:rounded-3xl overflow-hidden border-0 sm:border border-slate-800 bg-slate-950 shadow-2xl shadow-red-600/10">
        
        {/* Video Element Container */}
        <div 
          className="relative h-full w-full cursor-pointer bg-slate-950 overflow-hidden"
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            key={activeReel.id}
            src={activeReel.videoUrl}
            poster={activeReel.posterUrl}
            playsInline
            loop
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            className="h-full w-full object-cover"
          />

          {/* Pause overlay indicator */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
              <div className="flex h-18 w-18 items-center justify-center rounded-full bg-amber-500/90 text-black shadow-2xl">
                <Play className="h-9 w-9 translate-x-0.5 fill-current" />
              </div>
            </div>
          )}

          {/* Top Bar Header Overlay */}
          <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/40 to-transparent p-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-gradient-to-r from-red-600 to-amber-500 px-3 py-0.5 text-[10px] font-black tracking-wider text-white uppercase shadow-sm">
                REELS
              </span>
              <span className="text-xs font-semibold text-slate-200">
                {activeReel.language} • {activeReel.category}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Working Sound Toggle Button */}
              <button
                id="reel-mute-toggle"
                onClick={toggleMute}
                className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90 ${
                  isMuted ? 'bg-black/70 text-red-400' : 'bg-amber-500/90 text-black font-bold'
                }`}
                aria-label={isMuted ? "Unmute sound" : "Mute sound"}
                title={isMuted ? "Click to unmute" : "Sound is ON"}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 animate-pulse" />}
              </button>

              <button
                id="reel-fullscreen-toggle"
                onClick={toggleFullscreen}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md transition-transform active:scale-90"
                aria-label="Fullscreen"
              >
                <Maximize2 className="h-4 w-4 text-slate-200" />
              </button>
            </div>
          </div>

          {/* Tap-to-unmute alert banner if audio is muted */}
          {isMuted && isPlaying && (
            <div 
              onClick={toggleMute}
              className="absolute top-16 left-1/2 -translate-x-1/2 z-20 flex cursor-pointer items-center gap-2 rounded-full bg-black/85 px-4 py-1.5 text-xs font-bold text-amber-300 backdrop-blur-md border border-amber-500/40 shadow-lg animate-pulse"
            >
              <VolumeX className="h-3.5 w-3.5 text-red-400" />
              <span>Tap to unmute sound 🔊</span>
            </div>
          )}

          {/* Bottom Gradient Metadata & Info Overlay */}
          <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent p-4 pb-4">
            {/* Creator info */}
            <div className="flex items-center gap-3 mb-2">
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCreator(activeReel.creatorId);
                }}
                className="group relative cursor-pointer"
              >
                <img
                  src={activeReel.creatorAvatar}
                  alt={activeReel.creatorName}
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 rounded-full border-2 border-amber-400 object-cover object-top transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCreator(activeReel.creatorId);
                    }}
                    className="cursor-pointer text-sm font-bold text-white hover:text-amber-400 transition-colors"
                  >
                    {activeReel.creatorName}
                  </span>
                  <span className="text-[11px] text-slate-400">{activeReel.creatorHandle}</span>
                </div>
                <span className="text-[10px] text-amber-400/90 font-medium">{activeReel.createdAt}</span>
              </div>
            </div>

            {/* Title & Caption */}
            <p className="line-clamp-2 text-xs font-semibold text-slate-100 mb-1.5 leading-snug">
              {activeReel.title}
            </p>
            <p className="line-clamp-2 text-[11px] text-slate-300 mb-2 leading-relaxed">
              {activeReel.description}
            </p>

            {/* Audio track tag */}
            <div className="flex items-center gap-1.5 overflow-hidden text-[11px] text-amber-400/90 font-medium">
              <Music2 className="h-3 w-3 shrink-0 animate-pulse" />
              <span className="truncate">{activeReel.musicTitle}</span>
            </div>

            {/* Progress bar */}
            <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-white/20">
              <div 
                className="h-full bg-amber-400 transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Right Action Buttons Column (Like, Comment, Share, Save) */}
          <div className="absolute bottom-20 right-3 z-20 flex flex-col items-center gap-4">
            {/* Creator avatar with plus badge */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                onSelectCreator(activeReel.creatorId);
              }}
              className="relative cursor-pointer group"
            >
              <img
                src={activeReel.creatorAvatar}
                alt={activeReel.creatorName}
                referrerPolicy="no-referrer"
                className="h-11 w-11 rounded-full border-2 border-amber-400 object-cover object-top shadow-xl transition-transform group-hover:scale-105"
              />
            </div>

            {/* 1. LIKE BUTTON */}
            <div className="flex flex-col items-center gap-1">
              <button
                id="reel-like-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onLikeReel(activeReel.id);
                }}
                className={`flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-75 ${
                  isLiked
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/50'
                    : 'bg-black/60 text-white hover:bg-black/80'
                }`}
                aria-label="Like reel"
              >
                <Heart 
                  className={`h-6 w-6 transition-transform ${
                    isLiked ? 'fill-current text-white scale-110' : 'text-white'
                  }`} 
                />
              </button>
              <span className={`text-[11px] font-bold ${isLiked ? 'text-red-400' : 'text-white'} shadow-sm`}>
                {(activeReel.likesCount + (isLiked ? 1 : 0)).toLocaleString()}
              </span>
            </div>

            {/* 2. COMMENT BUTTON */}
            <div className="flex flex-col items-center gap-1">
              <button
                id="reel-comment-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCommentModal(true);
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-transform active:scale-90 hover:bg-black/80"
                aria-label="View comments"
              >
                <MessageCircle className="h-6 w-6 text-white" />
              </button>
              <span className="text-[11px] font-bold text-white shadow-sm">
                {reelComments.length || activeReel.commentsCount || 0}
              </span>
            </div>

            {/* 3. SAVE / BOOKMARK BUTTON */}
            <div className="flex flex-col items-center gap-1">
              <button
                id="reel-save-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onSaveReel(activeReel.id);
                }}
                className={`flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-75 ${
                  isSaved
                    ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/50'
                    : 'bg-black/60 text-white hover:bg-black/80'
                }`}
                aria-label="Save reel"
              >
                <Bookmark 
                  className={`h-5 w-5 ${
                    isSaved ? 'fill-current' : ''
                  }`} 
                />
              </button>
              <span className="text-[11px] font-bold text-white shadow-sm">
                {isSaved ? 'Saved' : 'Save'}
              </span>
            </div>

            {/* 4. SHARE BUTTON */}
            <div className="flex flex-col items-center gap-1">
              <button
                id="reel-share-btn"
                onClick={handleShare}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-transform active:scale-90 hover:bg-black/80"
                aria-label="Share reel"
              >
                <Share2 className="h-5 w-5 text-white" />
              </button>
              <span className="text-[11px] font-bold text-white shadow-sm">
                Share
              </span>
            </div>
          </div>
        </div>

        {/* Slide-up Comments Bottom Sheet */}
        {showCommentModal && (
          <div 
            id="reel-comments-sheet"
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 z-30 flex max-h-[75%] flex-col rounded-t-3xl border-t border-slate-700 bg-slate-900/98 p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Comments</span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-amber-400 font-bold">
                  {reelComments.length}
                </span>
              </div>
              <button
                id="reel-close-comments-btn"
                onClick={() => setShowCommentModal(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 min-h-[140px]">
              {reelComments.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No comments yet. Be the first to share your thoughts on this reel!
                </div>
              ) : (
                reelComments.map((c) => (
                  <div key={c.id} className="flex gap-2.5 text-xs">
                    <img
                      src={c.userAvatar}
                      alt={c.userName}
                      referrerPolicy="no-referrer"
                      className="h-7 w-7 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 rounded-2xl bg-slate-800/80 p-2.5">
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

            {/* Add Comment Input */}
            <form onSubmit={handleCommentSubmit} className="mt-2 flex items-center gap-2 border-t border-slate-800 pt-3">
              <input
                id="reel-comment-input"
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={currentUser ? "Add a cinematic comment..." : "Login to comment..."}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none"
              />
              <button
                id="reel-comment-submit-btn"
                type="submit"
                disabled={!commentText.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-black disabled:opacity-40 transition-transform active:scale-95 shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Desktop/Tablet Up/Down Navigation Chevrons */}
      <div className="hidden lg:flex flex-col gap-3 ml-6">
        <button
          id="reel-prev-nav-btn"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-white shadow-lg disabled:opacity-30 hover:border-amber-500/50 hover:bg-slate-800 active:scale-95 transition-all"
          aria-label="Previous Reel"
          title="Previous Reel (Arrow Up)"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
        <div className="flex flex-col items-center justify-center py-1 text-xs font-bold text-amber-400">
          <span>{currentIndex + 1}</span>
          <span className="text-slate-500 text-[10px]">/ {reels.length}</span>
        </div>
        <button
          id="reel-next-nav-btn"
          onClick={handleNext}
          disabled={currentIndex === reels.length - 1}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-white shadow-lg disabled:opacity-30 hover:border-amber-500/50 hover:bg-slate-800 active:scale-95 transition-all"
          aria-label="Next Reel"
          title="Next Reel (Arrow Down)"
        >
          <ChevronDown className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};
