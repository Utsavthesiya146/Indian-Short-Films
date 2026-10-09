import React, { useState } from 'react';
import { 
  X, 
  Briefcase, 
  ExternalLink, 
  Film, 
  PlaySquare, 
  Heart, 
  Eye, 
  Award, 
  Sparkles, 
  MessageCircle, 
  Globe, 
  Share2,
  Check
} from 'lucide-react';
import { Creator, ShortFilm, ReelVideo } from '../types';

interface CreatorProfileModalProps {
  creator: Creator;
  onClose: () => void;
  films: ShortFilm[];
  reels: ReelVideo[];
  onSelectFilm: (film: ShortFilm) => void;
  onSelectReel: (reel: ReelVideo) => void;
}

export const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({
  creator,
  onClose,
  films,
  reels,
  onSelectFilm,
  onSelectReel
}) => {
  const [activeTab, setActiveTab] = useState<'films' | 'reels' | 'ventures'>('films');
  const [isFollowing, setIsFollowing] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  const creatorFilms = films.filter(f => f.creatorId === creator.id || f.director.toLowerCase().includes(creator.name.toLowerCase()));
  const creatorReels = reels.filter(r => r.creatorId === creator.id || r.creatorName.toLowerCase().includes(creator.name.toLowerCase()));

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  return (
    <div 
      id="creator-profile-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md overflow-y-auto"
    >
      <div 
        className="relative my-auto flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toast */}
        {copiedToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black shadow-xl">
            Profile link copied to clipboard!
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-full border border-slate-700 bg-slate-900/90 p-2 text-white hover:bg-slate-800"
          aria-label="Close Profile"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Cover Banner */}
        <div className="relative h-44 sm:h-56 w-full bg-slate-900 overflow-hidden">
          <img
            src={creator.coverImage || '/assets/harri-suit.jpg'}
            alt={creator.name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        {/* Creator Info Header */}
        <div className="relative px-6 pb-4 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-16 sm:-mt-20">
            {/* Avatar & Badges */}
            <div className="flex items-end gap-4">
              <div className="relative h-24 w-24 sm:h-32 sm:w-32 overflow-hidden rounded-2xl border-4 border-slate-950 bg-slate-900 shadow-2xl shrink-0">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-top"
                />
              </div>

              <div className="space-y-1 mb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white">{creator.name}</h2>
                  {creator.isVerified && (
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-amber-400">{creator.designation}</p>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  {creator.experienceYears}+ Years Industry Experience
                </p>
              </div>
            </div>

            {/* Actions: Follow, Share, Message */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`rounded-xl px-5 py-2 text-xs font-bold transition-all ${
                  isFollowing
                    ? 'border border-slate-700 bg-slate-800 text-slate-300'
                    : 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md'
                }`}
              >
                {isFollowing ? 'Following' : '+ Follow Creator'}
              </button>

              <button
                onClick={handleShare}
                className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:text-white"
                title="Share Profile"
              >
                <Share2 className="h-4 w-4" />
              </button>

              {creator.phone && (
                <a
                  href={`https://wa.me/${creator.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/25"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Real Dynamic Stats Bar */}
          <div className="mt-5 grid grid-cols-4 gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-center">
            <div>
              <p className="text-sm sm:text-base font-black text-white">{creatorFilms.length + creatorReels.length}</p>
              <p className="text-[10px] text-slate-400">Total Uploads</p>
            </div>
            <div>
              <p className="text-sm sm:text-base font-black text-amber-400">
                {(creatorFilms.reduce((acc, f) => acc + (f.viewsCount || 0), 0) + creatorReels.reduce((acc, r) => acc + (r.viewsCount || 0), 0)).toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-400">Total Views</p>
            </div>
            <div>
              <p className="text-sm sm:text-base font-black text-red-400">
                {(creatorFilms.reduce((acc, f) => acc + (f.likesCount || 0), 0) + creatorReels.reduce((acc, r) => acc + (r.likesCount || 0), 0)).toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-400">Total Likes</p>
            </div>
            <div>
              <p className="text-sm sm:text-base font-black text-white">
                {((creator.followersCount || 0) + (isFollowing ? 1 : 0)).toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-400">Followers</p>
            </div>
          </div>

          {/* Bio text */}
          <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {creator.bio}
          </p>

          {/* Specialties */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {creator.specialties.map((s, idx) => (
              <span key={idx} className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300 font-medium">
                {s}
              </span>
            ))}
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 flex items-center gap-4 border-b border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('films')}
              className={`border-b-2 pb-2.5 transition-colors ${
                activeTab === 'films' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Short Films ({creatorFilms.length})
            </button>
            <button
              onClick={() => setActiveTab('reels')}
              className={`border-b-2 pb-2.5 transition-colors ${
                activeTab === 'reels' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Reels / Shorts ({creatorReels.length})
            </button>
            {creator.ventures && (
              <button
                onClick={() => setActiveTab('ventures')}
                className={`border-b-2 pb-2.5 transition-colors ${
                  activeTab === 'ventures' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Ventures & Ecosystem ({creator.ventures.length})
              </button>
            )}
          </div>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {activeTab === 'films' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {creatorFilms.length === 0 ? (
                <p className="col-span-2 py-8 text-center text-xs text-slate-400">
                  No short films uploaded yet.
                </p>
              ) : (
                creatorFilms.map((film) => (
                  <div
                    key={film.id}
                    onClick={() => {
                      onClose();
                      onSelectFilm(film);
                    }}
                    className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/60 p-3 hover:border-amber-500/40"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-2">
                      <img
                        src={film.posterUrl}
                        alt={film.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[10px] text-white font-mono">
                        {film.duration}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-400 line-clamp-1">
                      {film.title}
                    </h4>
                    <p className="text-[11px] text-slate-400">{film.language} • {film.genre}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'reels' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {creatorReels.length === 0 ? (
                <p className="col-span-3 py-8 text-center text-xs text-slate-400">
                  No vertical reels uploaded yet.
                </p>
              ) : (
                creatorReels.map((reel) => (
                  <div
                    key={reel.id}
                    onClick={() => {
                      onClose();
                      onSelectReel(reel);
                    }}
                    className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/60 p-2 hover:border-red-500/40"
                  >
                    <div className="relative aspect-[9/14] rounded-xl overflow-hidden mb-1.5">
                      <img
                        src={reel.posterUrl}
                        alt={reel.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[10px] text-white font-bold drop-shadow">
                        <Heart className="h-3 w-3 fill-red-500 text-red-500" />
                        {reel.likesCount.toLocaleString()}
                      </span>
                    </div>
                    <h5 className="text-[11px] font-medium text-slate-200 line-clamp-1">
                      {reel.title}
                    </h5>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'ventures' && creator.ventures && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {creator.ventures.map((v, i) => (
                <a
                  key={i}
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 hover:border-amber-400/50 block group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-white group-hover:text-amber-400">{v.name}</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{v.description}</p>
                </a>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
