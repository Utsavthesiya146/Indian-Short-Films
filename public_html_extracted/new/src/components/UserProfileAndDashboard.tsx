import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Bookmark, 
  Heart, 
  Film, 
  PlaySquare, 
  Trash2, 
  PlusCircle, 
  ShieldCheck, 
  Check, 
  X, 
  Sparkles, 
  BarChart3,
  Clock,
  Eye,
  Star,
  LogIn,
  Award,
  Video,
  Grid,
  Edit3,
  Share2,
  Globe,
  MapPin,
  Briefcase,
  Building2,
  Camera,
  Play,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { User, ShortFilm, ReelVideo, Review } from '../types';
import { PlatformStore } from '../services/platformStore';

interface UserProfileAndDashboardProps {
  currentUser: User | null;
  allFilms: ShortFilm[];
  allReels: ReelVideo[];
  reviews?: Review[];
  onSelectFilm: (film: ShortFilm) => void;
  onSelectReel: (reel: ReelVideo) => void;
  onOpenUpload: () => void;
  onOpenAuth: () => void;
  onDeleteFilm: (filmId: string) => void;
  onDeleteReel?: (reelId: string) => void;
  onToggleFilmFeature: (filmId: string) => void;
  onOpenAdminConsole?: () => void;
  onUpdateUser?: (updated: User) => void;
}

export const UserProfileAndDashboard: React.FC<UserProfileAndDashboardProps> = ({
  currentUser,
  allFilms,
  allReels,
  reviews = [],
  onSelectFilm,
  onSelectReel,
  onOpenUpload,
  onOpenAuth,
  onDeleteFilm,
  onDeleteReel,
  onToggleFilmFeature,
  onOpenAdminConsole,
  onUpdateUser
}) => {
  const [activeTab, setActiveTab] = useState<'grid' | 'reels' | 'films' | 'saved' | 'liked' | 'reviews' | 'admin'>('grid');
  
  // Profile edit modal state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editProfession, setEditProfession] = useState(currentUser?.profession || '');
  const [editLocation, setEditLocation] = useState(currentUser?.location || '');
  const [editWebsite, setEditWebsite] = useState(currentUser?.website || '');
  const [editIndustry, setEditIndustry] = useState(currentUser?.industry || currentUser?.brandCategory || '');
  const [editAbout, setEditAbout] = useState(currentUser?.about || '');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || '');
  const [editPhone, setEditPhone] = useState(currentUser?.contactPhone || '');
  const [editSuccessToast, setEditSuccessToast] = useState<string | null>(null);

  // Video edit modal state
  const [editingItem, setEditingItem] = useState<{ type: 'film' | 'reel'; item: ShortFilm | ReelVideo } | null>(null);
  const [editItemTitle, setEditItemTitle] = useState('');
  const [editItemDescription, setEditItemDescription] = useState('');

  const showToast = (msg: string) => {
    setEditSuccessToast(msg);
    setTimeout(() => setEditSuccessToast(null), 2500);
  };

  // If user is not logged in, show an app-friendly sign in page
  if (!currentUser) {
    return (
      <div id="unauthenticated-profile" className="mx-auto max-w-xl px-4 py-16 text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <UserIcon className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Sign In to Your Account</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Log in to manage your creator profile, upload short films and reels, bookmark saved content, and track real viewer engagement.
          </p>
        </div>
        <button
          onClick={onOpenAuth}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
        >
          <LogIn className="h-4 w-4" />
          <span>Login / Register Now</span>
        </button>
      </div>
    );
  }

  const savedFilms = allFilms.filter(f => currentUser.savedFilmIds.includes(f.id));
  const savedReels = allReels.filter(r => currentUser.savedReelIds.includes(r.id));

  const likedFilms = allFilms.filter(f => currentUser.likedFilmIds.includes(f.id));
  const likedReels = allReels.filter(r => currentUser.likedReelIds.includes(r.id));

  const myUploads = allFilms.filter(f => 
    f.creatorId === currentUser.id || 
    f.creatorName === currentUser.name || 
    (currentUser.brandName && (f.creatorName === currentUser.brandName || f.brandName === currentUser.brandName)) ||
    (currentUser.role === 'brand' && f.isBrandContent)
  );
  const myUploadedReels = allReels.filter(r => 
    r.creatorId === currentUser.id || 
    r.creatorName === currentUser.name || 
    r.creatorHandle === `@${currentUser.username}` ||
    (currentUser.brandName && (r.creatorName === currentUser.brandName || r.brandName === currentUser.brandName)) ||
    (currentUser.role === 'brand' && r.isBrandContent)
  );
  const userReviews = reviews.filter(r => r.userId === currentUser.id || r.userName === currentUser.name);

  const totalVideos = myUploads.length + myUploadedReels.length;
  const totalViews = myUploads.reduce((a, b) => a + (b.viewsCount || 0), 0) + myUploadedReels.reduce((a, b) => a + (b.viewsCount || 0), 0);
  const totalLikes = myUploads.reduce((a, b) => a + (b.likesCount || 0), 0) + myUploadedReels.reduce((a, b) => a + (b.likesCount || 0), 0);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...currentUser,
      name: editName.trim() || currentUser.name,
      bio: editBio.trim(),
      profession: editProfession.trim(),
      location: editLocation.trim(),
      website: editWebsite.trim(),
      industry: editIndustry.trim(),
      brandCategory: editIndustry.trim(),
      about: editAbout.trim(),
      avatar: editAvatar.trim() || currentUser.avatar,
      contactPhone: editPhone.trim()
    };

    // Save to PlatformStore
    const allUsers = PlatformStore.getUsers();
    const idx = allUsers.findIndex(u => u.id === currentUser.id);
    if (idx !== -1) {
      allUsers[idx] = updated;
      PlatformStore.saveUsers(allUsers);
    }
    PlatformStore.setCurrentSession(updated);
    if (onUpdateUser) {
      onUpdateUser(updated);
    }
    setIsEditingProfile(false);
    showToast('Profile updated successfully!');
  };

  const handleShareProfile = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${currentUser.name} on Indian Short Movie`,
          text: `Check out ${currentUser.name}'s profile and films on Indian Short Movie`,
          url
        });
        return;
      } catch {}
    }
    navigator.clipboard?.writeText(url);
    showToast('Profile link copied to clipboard!');
  };

  const handleOpenEditItem = (type: 'film' | 'reel', item: ShortFilm | ReelVideo) => {
    setEditingItem({ type, item });
    setEditItemTitle(item.title);
    setEditItemDescription(item.description);
  };

  const handleSaveItemEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (editingItem.type === 'film') {
      const films = PlatformStore.getFilms();
      const updatedFilms = films.map(f => f.id === editingItem.item.id ? { ...f, title: editItemTitle, description: editItemDescription } : f);
      PlatformStore.saveFilms(updatedFilms);
    } else {
      const reels = PlatformStore.getReels();
      const updatedReels = reels.map(r => r.id === editingItem.item.id ? { ...r, title: editItemTitle, description: editItemDescription } : r);
      PlatformStore.saveReels(updatedReels);
    }

    setEditingItem(null);
    showToast('Video details updated successfully!');
    // Trigger window storage event or reload state
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div id="user-profile-and-dashboard" className="mx-auto max-w-5xl px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Toast */}
      {editSuccessToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-xs font-bold text-black shadow-2xl animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4" />
          <span>{editSuccessToast}</span>
        </div>
      )}

      {/* 1. INSTAGRAM-STYLE PROFILE HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 p-5 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar / Brand Logo */}
          <div className="relative group shrink-0">
            <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full overflow-hidden border-3 border-amber-400 p-1 bg-slate-950 shadow-2xl">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="h-full w-full rounded-full object-cover object-top"
              />
            </div>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-black shadow-lg hover:bg-amber-400 transition-colors"
              title="Change Profile Photo"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          {/* User & Brand Details */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {currentUser.brandName || currentUser.name}
                  </h1>
                  <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-400 font-mono">
                    @{currentUser.username}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider ${
                    currentUser.role === 'brand' 
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
                      : currentUser.role === 'filmmaker'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>

                {/* Subtitle / Profession / Industry */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-400 mt-1">
                  {currentUser.profession && (
                    <span className="flex items-center gap-1 text-slate-300">
                      <Briefcase className="h-3.5 w-3.5 text-amber-400" />
                      <span>{currentUser.profession}</span>
                    </span>
                  )}
                  {currentUser.industry && (
                    <span className="flex items-center gap-1 text-purple-300">
                      <Building2 className="h-3.5 w-3.5 text-purple-400" />
                      <span>{currentUser.industry}</span>
                    </span>
                  )}
                  {currentUser.website && (
                    <a 
                      href={currentUser.website.startsWith('http') ? currentUser.website : `https://${currentUser.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-amber-400 hover:underline"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      <span>{currentUser.website.replace(/^https?:\/\//, '')}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons: Edit Profile, Share, Upload */}
              <div className="flex items-center justify-center sm:justify-start gap-2 shrink-0">
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={handleShareProfile}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 p-2 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
                  title="Share Profile"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  onClick={onOpenUpload}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>+ Upload</span>
                </button>
              </div>
            </div>

            {/* Bio & About */}
            <div className="space-y-1 pt-1">
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed whitespace-pre-line">
                {currentUser.bio || 'Indian Short Movie creator & story enthusiast.'}
              </p>
              {currentUser.about && (
                <p className="text-xs text-slate-400 max-w-2xl italic">
                  "{currentUser.about}"
                </p>
              )}
            </div>

            {/* Numerical Engagement Stats: Videos, Followers, Following, Total Views */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <div>
                <strong className="text-white font-black text-sm">{totalVideos}</strong>{' '}
                <span>Videos</span>
              </div>
              <div>
                <strong className="text-white font-black text-sm">{currentUser.followersCount.toLocaleString()}</strong>{' '}
                <span>Followers</span>
              </div>
              <div>
                <strong className="text-white font-black text-sm">{currentUser.followingCount}</strong>{' '}
                <span>Following</span>
              </div>
              <div>
                <strong className="text-amber-400 font-black text-sm">{totalViews.toLocaleString()}</strong>{' '}
                <span>Total Views</span>
              </div>
              <div>
                <strong className="text-red-400 font-black text-sm">{totalLikes.toLocaleString()}</strong>{' '}
                <span>Total Likes</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. INSTAGRAM-STYLE NAVIGATION TABS */}
        <div className="mt-8 flex items-center justify-center sm:justify-start gap-2 border-t border-slate-800 pt-4 overflow-x-auto no-scrollbar">
          <button
            id="profile-tab-grid"
            onClick={() => setActiveTab('grid')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'grid'
                ? 'bg-amber-500 text-black shadow-md'
                : 'border border-slate-800 bg-slate-800/60 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Grid className="h-3.5 w-3.5" />
            <span>▦ All Videos ({totalVideos})</span>
          </button>

          <button
            id="profile-tab-reels"
            onClick={() => setActiveTab('reels')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'reels'
                ? 'bg-red-500 text-white shadow-md'
                : 'border border-slate-800 bg-slate-800/60 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <PlaySquare className="h-3.5 w-3.5" />
            <span>▶ Reels ({myUploadedReels.length})</span>
          </button>

          <button
            id="profile-tab-films"
            onClick={() => setActiveTab('films')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'films'
                ? 'bg-amber-500 text-black shadow-md'
                : 'border border-slate-800 bg-slate-800/60 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Film className="h-3.5 w-3.5" />
            <span>🎬 Films & Trailers ({myUploads.length})</span>
          </button>

          <button
            id="profile-tab-saved"
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'saved'
                ? 'bg-amber-500 text-black shadow-md'
                : 'border border-slate-800 bg-slate-800/60 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>🔖 Saved ({savedFilms.length + savedReels.length})</span>
          </button>

          <button
            id="profile-tab-liked"
            onClick={() => setActiveTab('liked')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'liked'
                ? 'bg-amber-500 text-black shadow-md'
                : 'border border-slate-800 bg-slate-800/60 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Heart className="h-3.5 w-3.5" />
            <span>❤️ Liked ({likedFilms.length + likedReels.length})</span>
          </button>

          {currentUser.role === 'admin' && (
            <button
              id="profile-tab-admin"
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'admin'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'border border-slate-800 bg-slate-800/60 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Admin Console</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. TAB CONTENT: INSTAGRAM 3-COLUMN VIDEO GRID */}
      {activeTab === 'grid' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Grid className="h-4 w-4 text-amber-400" />
              <span>Published Content ({totalVideos})</span>
            </h3>
            <button
              onClick={onOpenUpload}
              className="text-xs font-bold text-amber-400 hover:underline"
            >
              + Upload Video
            </button>
          </div>

          {totalVideos === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center space-y-3 bg-slate-900/40">
              <Film className="h-10 w-10 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">No videos published yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Upload your reels, trailers, commercial brand videos, or short films to showcase your creative work.
                </p>
              </div>
              <button
                onClick={onOpenUpload}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Upload First Video</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-4">
              {/* Combine reels and films in a 3-column Instagram-style grid */}
              {[
                ...myUploadedReels.map(r => ({ type: 'reel' as const, item: r })),
                ...myUploads.map(f => ({ type: 'film' as const, item: f }))
              ].map(({ type, item }) => (
                <div
                  key={`${type}-${item.id}`}
                  className="group relative aspect-square sm:aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 cursor-pointer shadow-lg"
                  onClick={() => {
                    if (type === 'film') {
                      onSelectFilm(item as ShortFilm);
                    } else {
                      onSelectReel(item as ReelVideo);
                    }
                  }}
                >
                  <img
                    src={item.posterUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Type Badge & Duration */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
                    <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase text-white ${
                      type === 'film' ? 'bg-amber-600/90' : 'bg-red-600/90'
                    }`}>
                      {type === 'film' ? 'Film' : 'Reel'}
                    </span>
                  </div>

                  <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-mono text-white z-10">
                    {item.duration || 'Video'}
                  </div>

                  {/* Hover Overlay with views, likes & quick management actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-3 text-white backdrop-blur-[2px]">
                    <div className="flex items-center gap-4 text-xs font-bold">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-amber-400" />
                        <span>{item.viewsCount.toLocaleString()}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        <span>{item.likesCount.toLocaleString()}</span>
                      </span>
                    </div>

                    <p className="text-xs font-bold text-center line-clamp-2 px-2">
                      {item.title}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditItem(type, item);
                        }}
                        className="rounded-lg bg-slate-800 p-2 text-slate-200 hover:bg-slate-700 hover:text-white"
                        title="Edit Details"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
                            if (type === 'film') {
                              onDeleteFilm(item.id);
                            } else if (onDeleteReel) {
                              onDeleteReel(item.id);
                            }
                            showToast('Video deleted');
                          }
                        }}
                        className="rounded-lg bg-red-950/80 border border-red-800 p-2 text-red-300 hover:bg-red-900"
                        title="Delete Video"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. TAB: REELS */}
      {activeTab === 'reels' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PlaySquare className="h-4 w-4 text-red-400" />
              <span>Vertical 9:16 Reels ({myUploadedReels.length})</span>
            </h3>
            <button onClick={onOpenUpload} className="text-xs font-bold text-amber-400 hover:underline">
              + Upload Reel
            </button>
          </div>

          {myUploadedReels.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-xs text-slate-400">
              No vertical reels uploaded yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {myUploadedReels.map(reel => (
                <div
                  key={reel.id}
                  className="group relative aspect-[9/15] rounded-2xl overflow-hidden bg-black border border-slate-800 cursor-pointer shadow-lg"
                  onClick={() => onSelectReel(reel)}
                >
                  <img src={reel.posterUrl} alt={reel.title} referrerPolicy="no-referrer" className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-3 flex flex-col justify-end">
                    <p className="text-xs font-bold text-white line-clamp-1">{reel.title}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-300">
                      <span>{reel.viewsCount.toLocaleString()} views</span>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete reel "${reel.title}"?`) && onDeleteReel) {
                          onDeleteReel(reel.id);
                        }
                      }}
                      className="h-7 w-7 rounded-full bg-black/70 flex items-center justify-center text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. TAB: FILMS & TRAILERS */}
      {activeTab === 'films' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Film className="h-4 w-4 text-amber-400" />
              <span>Short Films & Trailers ({myUploads.length})</span>
            </h3>
            <button onClick={onOpenUpload} className="text-xs font-bold text-amber-400 hover:underline">
              + Upload Short Film
            </button>
          </div>

          {myUploads.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-xs text-slate-400">
              No short films uploaded yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myUploads.map(film => (
                <div
                  key={film.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 space-y-2.5 hover:border-slate-700 transition-all"
                >
                  <div 
                    className="relative aspect-video rounded-xl overflow-hidden bg-black cursor-pointer group"
                    onClick={() => onSelectFilm(film)}
                  >
                    <img src={film.posterUrl} alt={film.title} referrerPolicy="no-referrer" className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] text-white font-mono">{film.duration}</span>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="h-10 w-10 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-lg">
                        <Play className="h-5 w-5 fill-current translate-x-0.5" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-white line-clamp-1">{film.title}</h4>
                    <p className="text-xs text-slate-400">{film.language} • {film.genre}</p>
                    <div className="flex items-center gap-2 text-[11px] text-amber-400 font-semibold mt-1">
                      <span>★ {film.rating}</span>
                      <span>• {film.viewsCount.toLocaleString()} views</span>
                      <span>• {film.likesCount.toLocaleString()} likes</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <button
                      onClick={() => onSelectFilm(film)}
                      className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                    >
                      View
                    </button>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditItem('film', film)}
                        className="rounded-lg bg-slate-800 p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white"
                        title="Edit Details"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${film.title}"?`)) {
                            onDeleteFilm(film.id);
                          }
                        }}
                        className="rounded-lg bg-red-950/80 border border-red-800 p-1.5 text-red-300 hover:bg-red-900"
                        title="Delete Film"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. TAB: SAVED WATCHLIST */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Film className="h-4 w-4 text-amber-400" />
              <span>Saved Short Films ({savedFilms.length})</span>
            </h3>
            {savedFilms.length === 0 ? (
              <p className="text-xs text-slate-400">No saved short films yet. Tap the bookmark icon on any film card to save it here.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedFilms.map(film => (
                  <div
                    key={film.id}
                    onClick={() => onSelectFilm(film)}
                    className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/60 p-3 hover:border-amber-400/40 transition-all hover:scale-[1.01]"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-2 bg-black">
                      <img src={film.posterUrl} alt={film.title} referrerPolicy="no-referrer" className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                      <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] text-white font-mono">{film.duration}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-400 line-clamp-1">{film.title}</h4>
                    <p className="text-xs text-slate-400">{film.language} • {film.genre}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <PlaySquare className="h-4 w-4 text-red-400" />
              <span>Saved Reels & Shorts ({savedReels.length})</span>
            </h3>
            {savedReels.length === 0 ? (
              <p className="text-xs text-slate-400">No saved reels yet. Tap the bookmark icon in the Reels feed.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {savedReels.map(reel => (
                  <div
                    key={reel.id}
                    onClick={() => onSelectReel(reel)}
                    className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/60 p-2 hover:border-red-500/40 transition-all hover:scale-[1.02]"
                  >
                    <div className="relative aspect-[9/14] rounded-xl overflow-hidden mb-2 bg-black">
                      <img src={reel.posterUrl} alt={reel.title} referrerPolicy="no-referrer" className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <h5 className="text-xs font-bold text-slate-200 line-clamp-1">{reel.title}</h5>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. TAB: LIKED CONTENT */}
      {activeTab === 'liked' && (
        <div className="space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-400 fill-red-400" />
            <span>Liked Content ({likedFilms.length + likedReels.length})</span>
          </h3>
          {likedFilms.length + likedReels.length === 0 ? (
            <p className="text-xs text-slate-400">No liked content yet. Like movies or reels to view them here.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {likedFilms.map(film => (
                <div
                  key={film.id}
                  onClick={() => onSelectFilm(film)}
                  className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/60 p-3 hover:border-amber-400/40 transition-all"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-2 bg-black">
                    <img src={film.posterUrl} alt={film.title} referrerPolicy="no-referrer" className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] text-white font-mono">{film.duration}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-400 line-clamp-1">{film.title}</h4>
                  <p className="text-xs text-slate-400">{film.language} • {film.genre}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 8. TAB: ADMIN CONSOLE */}
      {activeTab === 'admin' && currentUser.role === 'admin' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-red-900/40 bg-gradient-to-br from-red-950/20 via-slate-900 to-slate-950 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-red-500" />
                  <span>Indian Short Movie Moderation Console</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Manage publication statuses, approve festival entries, and configure spotlights.
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-mono font-bold text-emerald-300">
                Sync: ACTIVE
              </span>
            </div>

            {onOpenAdminConsole && (
              <div className="pt-2">
                <button
                  onClick={onOpenAdminConsole}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 transition-all"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Launch Full Administrator Management Suite</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto"
          onClick={() => setIsEditingProfile(false)}
        >
          <div 
            className="relative my-8 w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-amber-400" />
                <span>Edit {currentUser.role === 'brand' ? 'Brand' : 'Creator'} Profile</span>
              </h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {currentUser.role === 'brand' ? 'Brand / Company Name' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Avatar / Logo Image URL
                </label>
                <input
                  type="url"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {currentUser.role === 'brand' ? 'Industry / Sector' : 'Profession / Role'}
                </label>
                <input
                  type="text"
                  value={currentUser.role === 'brand' ? editIndustry : editProfession}
                  onChange={(e) => {
                    if (currentUser.role === 'brand') setEditIndustry(e.target.value);
                    else setEditProfession(e.target.value);
                  }}
                  placeholder={currentUser.role === 'brand' ? 'e.g. Media, Fashion, OTT' : 'e.g. Film Director, Cinematographer'}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Official Website
                  </label>
                  <input
                    type="text"
                    value={editWebsite}
                    onChange={(e) => setEditWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Bio / Tagline
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              {currentUser.role === 'brand' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    About the Brand & Mission
                  </label>
                  <textarea
                    value={editAbout}
                    onChange={(e) => setEditAbout(e.target.value)}
                    rows={2}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-6 py-2 text-xs font-bold text-black hover:bg-amber-400 shadow-md shadow-amber-500/20"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT VIDEO ITEM MODAL */}
      {editingItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setEditingItem(null)}
        >
          <div 
            className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">
                Edit Video Details
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItemEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={editItemTitle}
                  onChange={(e) => setEditItemTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description / Caption</label>
                <textarea
                  value={editItemDescription}
                  onChange={(e) => setEditItemDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-black"
                >
                  Update Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
