'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Submission } from '@/types';
import { getAllSubmissions, updateSubmissionStatus } from '@/lib/supabase';
import { CheckCircle2, XCircle, AlertCircle, Play, Eye, Loader2 } from 'lucide-react';

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getAllSubmissions();
        setSubmissions(data);
      } catch (err) {
        console.error('Failed to load submissions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleApprove = async (sub: Submission) => {
    setActionLoading(true);
    try {
      await updateSubmissionStatus(sub.id, 'approved');
      setSubmissions(submissions.map(s => s.id === sub.id ? { ...s, status: 'approved' } : s));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Action failed';
      alert(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedSubmission || !rejectionReason.trim()) return;
    setActionLoading(true);
    try {
      await updateSubmissionStatus(selectedSubmission.id, 'rejected', rejectionReason);
      setSubmissions(submissions.map(s => s.id === selectedSubmission.id ? { ...s, status: 'rejected', rejection_reason: rejectionReason } : s));
      setIsRejectModalOpen(false);
      setSelectedSubmission(null);
      setRejectionReason('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Action failed';
      alert(msg);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="font-display font-black text-2xl text-white">Film Submissions Queue</h1>
        <p className="text-xs text-cinema-muted">Review submitted short films, verify credentials, and approve for publishing</p>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-cinema-gold" />
          <p className="text-xs text-cinema-muted font-medium">Loading film submissions from database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {submissions.map((sub) => (
            <div key={sub.id} className="bg-cinema-card rounded-3xl p-6 border border-cinema-border space-y-4">
              <div className="flex gap-4">
                <div className="relative w-20 aspect-[2/3] rounded-xl overflow-hidden border border-cinema-border flex-shrink-0 bg-cinema-surface">
                  <Image src={sub.poster_url || '/placeholder-poster.jpg'} alt={sub.title} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base text-white">{sub.title}</h3>
                  <span className="text-xs text-cinema-muted block">Dir. {sub.director}</span>
                  <span className="text-[11px] text-cinema-teal font-medium mt-1 block">Duration: {Math.round(sub.duration_seconds / 60)} mins</span>
                  <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    sub.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    sub.status === 'rejected' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    'bg-cinema-accent/20 text-cinema-accent border-cinema-accent/30'
                  }`}>
                    {sub.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-300 line-clamp-2">{sub.description}</p>

              {sub.status === 'submitted' && (
                <div className="flex items-center gap-2 pt-2 border-t border-cinema-border/50">
                  <button
                    onClick={() => handleApprove(sub)}
                    disabled={actionLoading}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve & Publish
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSubmission(sub);
                      setIsRejectModalOpen(true);
                    }}
                    disabled={actionLoading}
                    className="flex-1 py-2 rounded-xl bg-cinema-surface hover:bg-red-500/20 text-red-400 border border-cinema-border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Rejection Reason Modal */}
      {isRejectModalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cinema-card border border-cinema-border rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-lg text-white">Reject Submission</h3>
            <p className="text-xs text-cinema-muted">Please provide a clear reason for rejecting &quot;{selectedSubmission.title}&quot;.</p>
            <textarea
              required
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Audio sync issue, copyrighted background music track..."
              className="w-full bg-cinema-surface border border-cinema-border rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cinema-accent"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-cinema-surface text-xs font-semibold text-cinema-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectionReason.trim() || actionLoading}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold disabled:opacity-50 flex items-center gap-1"
              >
                {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

