import React, { useState } from 'react';
import { 
  Inbox, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Trash2, 
  MessageSquare, 
  Clock, 
  User as UserIcon, 
  Mail, 
  ExternalLink,
  PlusCircle,
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';
import { ShortFilm, User } from '../types';
import { PlatformStore } from '../services/platformStore';

interface SubmissionQueuePageProps {
  films: ShortFilm[];
  onSelectFilm: (film: ShortFilm) => void;
  onUpdateFilms: (films: ShortFilm[]) => void;
  onOpenSubmitFilm: () => void;
  currentUser: User | null;
}

export const SubmissionQueuePage: React.FC<SubmissionQueuePageProps> = ({
  films,
  onSelectFilm,
  onUpdateFilms,
  onOpenSubmitFilm,
  currentUser
}) => {
  const [activeStatusTab, setActiveStatusTab] = useState<'all' | 'pending' | 'changes_requested' | 'approved' | 'rejected'>('pending');
  const [inspectingFilm, setInspectingFilm] = useState<ShortFilm | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const submissions = films.filter(f => f.submittedAt || f.status === 'pending' || f.status === 'changes_requested');

  const countAll = submissions.length;
  const countPending = submissions.filter(f => f.status === 'pending').length;
  const countChanges = submissions.filter(f => f.status === 'changes_requested').length;
  const countApproved = submissions.filter(f => f.status === 'approved' || f.status === 'published').length;
  const countRejected = submissions.filter(f => f.status === 'rejected').length;

  const displayedSubmissions = submissions.filter(f => {
    if (activeStatusTab === 'all') return true;
    if (activeStatusTab === 'pending') return f.status === 'pending';
    if (activeStatusTab === 'changes_requested') return f.status === 'changes_requested';
    if (activeStatusTab === 'approved') return f.status === 'approved' || f.status === 'published';
    if (activeStatusTab === 'rejected') return f.status === 'rejected';
    return true;
  });

  const handleUpdateStatus = (
    filmId: string, 
    newStatus: 'pending' | 'approved' | 'rejected' | 'changes_requested',
    notes?: string
  ) => {
    const updated = films.map(f => {
      if (f.id === filmId) {
        return {
          ...f,
          status: newStatus,
          adminNotes: notes !== undefined ? notes : f.adminNotes
        };
      }
      return f;
    });

    onUpdateFilms(updated);
    PlatformStore.saveFilms(updated);

    if (inspectingFilm && inspectingFilm.id === filmId) {
      setInspectingFilm({ ...inspectingFilm, status: newStatus, adminNotes: notes || inspectingFilm.adminNotes });
    }

    if (newStatus === 'approved') showToast('Film approved and published to live catalog!');
    if (newStatus === 'changes_requested') showToast('Feedback note sent to filmmaker');
    if (newStatus === 'rejected') showToast('Submission marked as rejected');
    if (newStatus === 'pending') showToast('Moved back to pending review');
  };

  const handleDeleteSubmission = (filmId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this submission record?')) {
      const updated = films.filter(f => f.id !== filmId);
      onUpdateFilms(updated);
      PlatformStore.saveFilms(updated);
      if (inspectingFilm?.id === filmId) setInspectingFilm(null);
      showToast('Submission deleted');
    }
  };

  return (
    <div id="submission-queue-page" className="space-y-8 pb-16 text-gray-200">
      
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
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Editorial Screening Room</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Submission Queue
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Review filmmaker screener submissions, watch preview trailers, request revisions, and publish approved indie films.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSubmitFilm}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:scale-105 transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ Submit Film</span>
          </button>
        </div>
      </div>

      {/* 2. Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveStatusTab('pending')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            activeStatusTab === 'pending'
              ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-gray-400 hover:text-white bg-white/[0.02]'
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Pending Review ({countPending})</span>
        </button>

        <button
          onClick={() => setActiveStatusTab('changes_requested')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            activeStatusTab === 'changes_requested'
              ? 'bg-gradient-to-r from-purple-500/30 to-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'text-gray-400 hover:text-white bg-white/[0.02]'
          }`}
        >
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Changes Requested ({countChanges})</span>
        </button>

        <button
          onClick={() => setActiveStatusTab('approved')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            activeStatusTab === 'approved'
              ? 'bg-gradient-to-r from-emerald-500/30 to-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-gray-400 hover:text-white bg-white/[0.02]'
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Approved ({countApproved})</span>
        </button>

        <button
          onClick={() => setActiveStatusTab('rejected')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            activeStatusTab === 'rejected'
              ? 'bg-gradient-to-r from-red-500/30 to-red-600/20 text-red-300 border border-red-500/40 shadow-sm'
              : 'text-gray-400 hover:text-white bg-white/[0.02]'
          }`}
        >
          <XCircle className="h-3.5 w-3.5" />
          <span>Rejected ({countRejected})</span>
        </button>

        <button
          onClick={() => setActiveStatusTab('all')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            activeStatusTab === 'all'
              ? 'bg-white/10 text-white border border-white/20'
              : 'text-gray-400 hover:text-white bg-white/[0.02]'
          }`}
        >
          <span>All Submissions ({countAll})</span>
        </button>
      </div>

      {/* 3. Submissions List & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Submissions List */}
        <div className={`${inspectingFilm ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
          {displayedSubmissions.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-12 text-center space-y-4">
              <Inbox className="h-12 w-12 text-gray-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Submissions In This Tab</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                There are no films under "{activeStatusTab}". Check back later or test by submitting a new short film.
              </p>
              <button
                onClick={onOpenSubmitFilm}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:scale-105 transition-all"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Test Film Submission</span>
              </button>
            </div>
          ) : (
            displayedSubmissions.map((film) => {
              const isSelected = inspectingFilm?.id === film.id;
              return (
                <div
                  key={film.id}
                  onClick={() => {
                    setInspectingFilm(film);
                    setAdminNoteInput(film.adminNotes || '');
                  }}
                  className={`group rounded-3xl border p-5 transition-all duration-300 cursor-pointer ${
                    isSelected 
                      ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_30px_rgba(139,92,246,0.2)]' 
                      : 'border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-purple-500/40 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    {/* Poster + Info */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-900 border border-white/10">
                        <img
                          src={film.posterUrl}
                          alt={film.title}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectFilm(film);
                          }}
                          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white"
                          title="Play Screener"
                        >
                          <Play className="h-5 w-5 fill-current ml-0.5" />
                        </button>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-white truncate group-hover:text-purple-300 transition-colors">
                            {film.title}
                          </h4>
                          <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-semibold text-gray-300 shrink-0">
                            {film.language}
                          </span>
                        </div>

                        <p className="text-xs text-gray-400 mt-0.5">
                          Directed by <strong className="text-gray-300">{film.director}</strong> • {film.genre} • {film.duration}
                        </p>

                        <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">
                          {film.description}
                        </p>

                        <div className="flex items-center gap-3 text-[10px] text-gray-500 mt-2">
                          <span>Creator: {film.creatorName}</span>
                          <span>•</span>
                          <span>Submitted: {film.submittedAt ? new Date(film.submittedAt).toLocaleDateString() : 'Recent'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Status Tag & Inspection trigger */}
                    <div className="flex items-center sm:flex-col items-end gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                      {film.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 text-xs font-bold">
                          <Clock className="h-3 w-3" />
                          Pending Review
                        </span>
                      )}
                      {film.status === 'changes_requested' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 px-3 py-1 text-xs font-bold">
                          <AlertCircle className="h-3 w-3" />
                          Revisions Asked
                        </span>
                      )}
                      {film.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-3 py-1 text-xs font-bold">
                          <CheckCircle2 className="h-3 w-3" />
                          Published
                        </span>
                      )}
                      {film.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/30 px-3 py-1 text-xs font-bold">
                          <XCircle className="h-3 w-3" />
                          Rejected
                        </span>
                      )}

                      <span className="text-[11px] font-semibold text-purple-400 group-hover:underline flex items-center">
                        Inspect Screener <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Detailed Review & Screener Inspector Panel */}
        {inspectingFilm && (
          <div className="lg:col-span-5 sticky top-24 rounded-3xl border border-white/15 bg-white/[0.03] backdrop-blur-2xl p-6 shadow-2xl space-y-6 animate-in fade-in slide-in-from-right-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                  Review & Decision Panel
                </span>
                <h3 className="text-lg font-black text-white">{inspectingFilm.title}</h3>
              </div>
              <button
                onClick={() => setInspectingFilm(null)}
                className="h-8 w-8 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Screener Preview Button */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-neutral-900 border border-white/10 group">
              <img
                src={inspectingFilm.posterUrl}
                alt={inspectingFilm.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2">
                <button
                  onClick={() => onSelectFilm(inspectingFilm)}
                  className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/50 hover:scale-110 active:scale-95 transition-all"
                >
                  <Play className="h-6 w-6 fill-current ml-0.5" />
                </button>
                <span className="text-xs font-bold text-white">Stream Full Screener</span>
              </div>
            </div>

            {/* Metadata breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Director:</span>
                <span className="font-semibold text-white">{inspectingFilm.director}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Language:</span>
                <span className="font-semibold text-white">{inspectingFilm.language}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Genre:</span>
                <span className="font-semibold text-white">{inspectingFilm.genre}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Duration:</span>
                <span className="font-semibold text-white">{inspectingFilm.duration}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Filmmaker:</span>
                <span className="font-semibold text-white">{inspectingFilm.creatorName}</span>
              </div>
            </div>

            {/* Admin Notes / Revision Feedback Box */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300">
                Editorial Review Notes / Revision Request:
              </label>
              <textarea
                rows={3}
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                placeholder="e.g., Audio mix levels need adjustment in minute 3, or trailer missing..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white placeholder-gray-500 focus:border-purple-500/60 focus:outline-none resize-none"
              />
            </div>

            {/* Review Decision Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleUpdateStatus(inspectingFilm.id, 'approved', adminNoteInput)}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 px-4 py-3 text-xs font-bold text-white shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Approve & Publish to OTT</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleUpdateStatus(inspectingFilm.id, 'changes_requested', adminNoteInput)}
                  className="flex items-center justify-center gap-1.5 rounded-2xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 px-3 py-2.5 text-xs font-semibold transition-all cursor-pointer"
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Request Revisions</span>
                </button>

                <button
                  onClick={() => handleUpdateStatus(inspectingFilm.id, 'rejected', adminNoteInput)}
                  className="flex items-center justify-center gap-1.5 rounded-2xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 px-3 py-2.5 text-xs font-semibold transition-all cursor-pointer"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  <span>Reject</span>
                </button>
              </div>

              <button
                onClick={() => handleDeleteSubmission(inspectingFilm.id)}
                className="w-full text-center text-xs text-red-400 hover:underline pt-2"
              >
                Delete submission completely
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
