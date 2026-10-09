import React, { useState } from 'react';
import { 
  FileCheck, 
  Check, 
  X, 
  Play, 
  Clock, 
  MessageSquare, 
  AlertCircle, 
  CircleCheck, 
  CircleX,
  ExternalLink,
  PlusCircle,
  Filter
} from 'lucide-react';
import { ShortFilm } from '../types';
import { PlatformStore } from '../services/platformStore';

interface AdminSubmissionsQueueProps {
  films: ShortFilm[];
  onUpdateFilms: (films: ShortFilm[]) => void;
  onSelectFilm: (film: ShortFilm) => void;
  onOpenSubmitFilm: () => void;
  onToast: (msg: string) => void;
}

export const AdminSubmissionsQueue: React.FC<AdminSubmissionsQueueProps> = ({
  films,
  onUpdateFilms,
  onSelectFilm,
  onOpenSubmitFilm,
  onToast
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [rejectingFilm, setRejectingFilm] = useState<ShortFilm | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Collect submissions (films that have submittedAt or are pending or have status)
  const submissions = films.filter(f => f.submittedAt || f.status === 'pending' || f.status === 'rejected' || f.status === 'approved');

  const pendingCount = submissions.filter(f => f.status === 'pending' || f.status === 'changes_requested').length;
  const approvedCount = submissions.filter(f => f.status === 'approved' || f.status === 'published').length;
  const rejectedCount = submissions.filter(f => f.status === 'rejected').length;

  const displayedSubmissions = submissions.filter(f => {
    if (filterTab === 'all') return true;
    if (filterTab === 'pending') return f.status === 'pending' || f.status === 'changes_requested';
    if (filterTab === 'approved') return f.status === 'approved' || f.status === 'published';
    if (filterTab === 'rejected') return f.status === 'rejected';
    return true;
  });

  const handleApprove = (film: ShortFilm) => {
    const updated = films.map(f => {
      if (f.id === film.id) {
        return { ...f, status: 'approved' as const };
      }
      return f;
    });
    onUpdateFilms(updated);
    PlatformStore.saveFilms(updated);
    onToast(`Approved "${film.title}" for public cinema catalog!`);
  };

  const handleRejectConfirm = () => {
    if (!rejectingFilm) return;
    const updated = films.map(f => {
      if (f.id === rejectingFilm.id) {
        return { 
          ...f, 
          status: 'rejected' as const, 
          adminNotes: rejectionReason.trim() || 'Did not meet technical curation guidelines' 
        };
      }
      return f;
    });
    onUpdateFilms(updated);
    PlatformStore.saveFilms(updated);
    onToast(`Marked "${rejectingFilm.title}" as rejected`);
    setRejectingFilm(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Film Submissions Queue
          </h1>
          <p className="text-xs text-cinema-muted mt-1">
            Review submitted short films, verify credentials, and approve for publishing
          </p>
        </div>
        <button
          onClick={onOpenSubmitFilm}
          className="px-4 py-2.5 rounded-xl bg-cinema-accent hover:bg-cinema-accentHover text-white text-xs font-bold shadow-lg shadow-cinema-accent/25 transition-all flex items-center gap-2 self-start sm:self-auto hover:scale-[1.02]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Submission</span>
        </button>
      </div>

      {/* Filter Tabs matching Reference */}
      <div className="flex items-center gap-2 border-b border-cinema-border pb-3 overflow-x-auto">
        <button
          onClick={() => setFilterTab('pending')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            filterTab === 'pending'
              ? 'bg-cinema-accent text-white shadow-md shadow-cinema-accent/20'
              : 'text-cinema-muted hover:text-white hover:bg-cinema-card'
          }`}
        >
          <span>Pending</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => setFilterTab('approved')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            filterTab === 'approved'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-cinema-muted hover:text-white hover:bg-cinema-card'
          }`}
        >
          <span>Approved</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
            {approvedCount}
          </span>
        </button>

        <button
          onClick={() => setFilterTab('rejected')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            filterTab === 'rejected'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-cinema-muted hover:text-white hover:bg-cinema-card'
          }`}
        >
          <span>Rejected</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
            {rejectedCount}
          </span>
        </button>

        <button
          onClick={() => setFilterTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            filterTab === 'all'
              ? 'bg-cinema-surface border border-cinema-border text-white'
              : 'text-cinema-muted hover:text-white hover:bg-cinema-card'
          }`}
        >
          <span>All Submissions</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
            {submissions.length}
          </span>
        </button>
      </div>

      {/* Grid of Submissions matching Reference Layout */}
      {displayedSubmissions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedSubmissions.map((film) => {
            const isApproved = film.status === 'approved' || film.status === 'published';
            const isRejected = film.status === 'rejected';
            const isPending = !isApproved && !isRejected;

            return (
              <div
                key={film.id}
                className="bg-cinema-card rounded-3xl p-6 border border-cinema-border space-y-4 hover:border-cinema-border/80 transition-all flex flex-col justify-between shadow-xl"
              >
                <div className="space-y-4">
                  {/* Top: Poster & Details */}
                  <div className="flex gap-4">
                    <div 
                      onClick={() => onSelectFilm(film)}
                      className="relative w-20 aspect-[2/3] rounded-xl overflow-hidden border border-cinema-border flex-shrink-0 bg-cinema-surface cursor-pointer group"
                    >
                      <img
                        src={film.posterUrl || '/placeholder-poster.jpg'}
                        alt={film.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Play className="w-5 h-5 text-white fill-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 
                          onClick={() => onSelectFilm(film)}
                          className="font-bold text-base text-white hover:text-cinema-accent cursor-pointer transition-colors line-clamp-1"
                        >
                          {film.title}
                        </h3>
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                            isApproved
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : isRejected
                              ? 'bg-red-500/20 text-red-400 border-red-500/30'
                              : 'bg-cinema-accent/20 text-cinema-accent border-cinema-accent/30'
                          }`}
                        >
                          {isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Pending Review'}
                        </span>
                      </div>

                      <span className="text-xs text-cinema-muted block mt-0.5">
                        Dir. {film.director}
                      </span>
                      <span className="text-[11px] text-cinema-teal font-medium mt-1 block">
                        Language: {film.language} • {film.genre}
                      </span>
                      <span className="text-[11px] text-cinema-gold font-medium block">
                        Duration: {film.duration || '15 mins'}
                      </span>
                    </div>
                  </div>

                  {/* Synopsis Excerpt */}
                  <p className="text-xs text-cinema-muted line-clamp-3 leading-relaxed">
                    {film.synopsis || film.description}
                  </p>

                  {/* Submission metadata */}
                  <div className="p-3 bg-cinema-surface rounded-xl border border-cinema-border/50 text-[11px] space-y-1">
                    <div className="flex justify-between text-cinema-muted">
                      <span>Submitter / Production:</span>
                      <span className="text-white font-medium">{film.creatorName || film.director}</span>
                    </div>
                    {film.adminNotes && (
                      <div className="pt-1 border-t border-cinema-border/30 text-rose-300">
                        <span>Feedback Note: {film.adminNotes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="pt-4 border-t border-cinema-border/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectFilm(film)}
                    className="px-3 py-1.5 rounded-xl bg-cinema-surface hover:bg-cinema-border text-cinema-muted hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-cinema-border"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Watch Screener</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {!isApproved && (
                      <button
                        onClick={() => handleApprove(film)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-md transition-all active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}
                    {!isRejected && (
                      <button
                        onClick={() => setRejectingFilm(film)}
                        className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-cinema-card rounded-3xl p-12 text-center border border-cinema-border space-y-3">
          <CircleCheck className="w-12 h-12 text-emerald-400 mx-auto opacity-70" />
          <h3 className="font-bold text-white text-base">All Caught Up!</h3>
          <p className="text-xs text-cinema-muted max-w-sm mx-auto">
            No submissions in this filter queue. New submissions from creators will appear here automatically.
          </p>
        </div>
      )}

      {/* Reject Modal dialog */}
      {rejectingFilm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cinema-card border border-cinema-border rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <CircleX className="w-5 h-5 text-red-400" />
                <span>Reject Submission</span>
              </h3>
              <button 
                onClick={() => setRejectingFilm(null)}
                className="text-cinema-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-cinema-muted">
              Provide constructive feedback to the filmmaker for <strong>"{rejectingFilm.title}"</strong>:
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Audio mix levels exceed clipping thresholds; please re-upload normalized stereo master."
              rows={4}
              className="w-full p-3 rounded-xl bg-cinema-surface border border-cinema-border text-xs text-white placeholder-cinema-muted focus:outline-none focus:border-red-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingFilm(null)}
                className="px-4 py-2 rounded-xl bg-cinema-surface text-cinema-muted hover:text-white text-xs font-semibold border border-cinema-border"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
