import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  Star, 
  MessageSquare, 
  Users, 
  Trash2, 
  Check, 
  Play, 
  Heart, 
  Eye, 
  Search, 
  AlertCircle,
  Award,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { ShortFilm, ReelVideo, Creator, Comment, Review, User, UserRole } from '../types';
import { PlatformStore } from '../services/platformStore';

interface ContentModerationPageProps {
  allFilms: ShortFilm[];
  allReels: ReelVideo[];
  allCreators: Creator[];
  allComments: Comment[];
  allReviews: Review[];
  onSelectReel: (reel: ReelVideo) => void;
  onUpdateReels: (reels: ReelVideo[]) => void;
  onUpdateReviews: (reviews: Review[]) => void;
  onUpdateComments: (comments: Comment[]) => void;
  currentUser: User | null;
}

export const ContentModerationPage: React.FC<ContentModerationPageProps> = ({
  allFilms,
  allReels,
  allCreators,
  allComments,
  allReviews,
  onSelectReel,
  onUpdateReels,
  onUpdateReviews,
  onUpdateComments,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'reels' | 'reviews' | 'comments' | 'users'>('reels');
  const [usersList, setUsersList] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setUsersList(PlatformStore.getUsers());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // 1. Reel Moderation
  const handleDeleteReel = (reelId: string) => {
    if (window.confirm('Delete this vertical cinema reel?')) {
      const updated = allReels.filter(r => r.id !== reelId);
      PlatformStore.saveReels(updated);
      onUpdateReels(updated);
      showToast('Reel deleted from platform');
    }
  };

  // 2. Review Moderation
  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm('Delete this review?')) {
      const updated = allReviews.filter(r => r.id !== reviewId);
      PlatformStore.saveReviews(updated);
      onUpdateReviews(updated);
      showToast('Review removed');
    }
  };

  // 3. Comment Moderation
  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Delete this comment?')) {
      const updated = allComments.filter(c => c.id !== commentId);
      PlatformStore.saveComments(updated);
      onUpdateComments(updated);
      showToast('Comment removed');
    }
  };

  // 4. User Role change
  const handleChangeRole = (userId: string, newRole: UserRole) => {
    const updated = usersList.map(u => u.id === userId ? { ...u, role: newRole } : u);
    setUsersList(updated);
    PlatformStore.saveUsers(updated);
    showToast(`User role updated to ${newRole}`);
  };

  return (
    <div id="content-moderation-page" className="space-y-8 pb-16 text-gray-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 rounded-2xl bg-purple-600 px-5 py-3 text-xs font-bold text-white shadow-2xl animate-in fade-in slide-in-from-top-3">
          {toastMessage}
        </div>
      )}

      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Trust, Safety & Community</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Content Moderation
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Maintain community quality by reviewing social cinema reels, audience ratings, user comments, and member roles.
          </p>
        </div>
      </div>

      {/* 2. Sub-Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('reels')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'reels'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white bg-white/[0.02]'
          }`}
        >
          <Smartphone className="h-3.5 w-3.5" />
          <span>Vertical Reels ({allReels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'reviews'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white bg-white/[0.02]'
          }`}
        >
          <Star className="h-3.5 w-3.5" />
          <span>Audience Reviews ({allReviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'comments'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white bg-white/[0.02]'
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Comments ({allComments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white bg-white/[0.02]'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span>User Accounts & Roles ({usersList.length})</span>
        </button>
      </div>

      {/* 3. Tab Content */}
      <div className="space-y-4">
        
        {/* REELS TAB */}
        {activeTab === 'reels' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allReels.map((reel) => (
              <div key={reel.id} className="group rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden p-3.5 space-y-3 shadow-md hover:border-purple-500/40 transition-all">
                <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-neutral-900 group">
                  <img src={reel.thumbnailUrl} alt={reel.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  
                  <button
                    onClick={() => onSelectReel(reel)}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-lg">
                      <Play className="h-5 w-5 fill-current ml-0.5" />
                    </div>
                  </button>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <p className="text-xs font-bold line-clamp-1">{reel.title}</p>
                    <p className="text-[10px] text-gray-300">@{reel.creatorHandle}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-2 text-[11px] text-gray-400">
                    <span>{reel.viewsCount?.toLocaleString() || 0} views</span>
                    <span>•</span>
                    <span>{reel.likesCount || 0} likes</span>
                  </div>

                  <button
                    onClick={() => handleDeleteReel(reel.id)}
                    className="p-1.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Reel"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="space-y-3">
            {allReviews.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-12 text-center text-gray-400">
                <Star className="h-10 w-10 mx-auto text-gray-600 mb-2" />
                <p className="text-white font-bold">No user reviews yet</p>
                <p className="text-xs">New user reviews will appear here for editorial moderation.</p>
              </div>
            ) : (
              allReviews.map((rev) => (
                <div key={rev.id} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{rev.userName}</span>
                      <div className="flex items-center text-yellow-400 text-xs">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="ml-1 font-bold">{rev.rating}/10</span>
                      </div>
                      <span className="text-[10px] text-gray-500">• {new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-300 font-semibold">{rev.title}</p>
                    <p className="text-xs text-gray-400">{rev.content}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                    title="Remove Review"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* COMMENTS TAB */}
        {activeTab === 'comments' && (
          <div className="space-y-3">
            {allComments.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-12 text-center text-gray-400">
                <MessageSquare className="h-10 w-10 mx-auto text-gray-600 mb-2" />
                <p className="text-white font-bold">No comments logged</p>
                <p className="text-xs">Discussion comments will appear here for safety monitoring.</p>
              </div>
            ) : (
              allComments.map((com) => (
                <div key={com.id} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{com.userName}</span>
                      <span className="text-[10px] text-gray-500">• {new Date(com.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-300">{com.content}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteComment(com.id)}
                    className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                    title="Remove Comment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 uppercase font-semibold text-[10px] tracking-wider bg-white/[0.02]">
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Current Role</th>
                    <th className="py-3.5 px-4 text-right">Role Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {usersList.map((usr) => (
                    <tr key={usr.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-xs">
                          {usr.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{usr.name}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">{usr.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          usr.role === 'admin' 
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : usr.role === 'creator'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-white/5 text-gray-300 border border-white/10'
                        }`}>
                          {usr.role || 'viewer'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={usr.role || 'viewer'}
                          onChange={(e: any) => handleChangeRole(usr.id, e.target.value)}
                          className="rounded-xl border border-white/10 bg-[#0d0d18] px-2.5 py-1 text-xs text-white focus:outline-none"
                        >
                          <option value="viewer">Viewer</option>
                          <option value="creator">Creator</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
