'use client';

import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, Trash2, AlertTriangle } from 'lucide-react';

interface ReportItem {
  id: string;
  targetType: 'film' | 'review' | 'comment' | 'user';
  targetTitle: string;
  reporterName: string;
  reason: string;
  details: string;
  date: string;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([
    {
      id: 'rep-1',
      targetType: 'review',
      targetTitle: 'Review on Chai & Stories',
      reporterName: 'Vikram Joshi',
      reason: 'Spam / Self Promotion',
      details: 'Contains external suspicious promotional links.',
      date: '5 hours ago',
    },
    {
      id: 'rep-2',
      targetType: 'comment',
      targetTitle: 'Comment on Midnight Express',
      reporterName: 'Divya Nambiar',
      reason: 'Abusive language',
      details: 'Violates community guidelines with hateful speech.',
      date: '1 day ago',
    },
  ]);

  const handleResolve = (id: string, action: string) => {
    setReports(reports.filter(r => r.id !== id));
    alert(`Report ${id} resolved with action: ${action}`);
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="font-display font-black text-2xl text-white">Content Moderation Queue</h1>
        <p className="text-xs text-cinema-muted">Review community reports for copyright, spam, or inappropriate content</p>
      </div>

      {reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((rep) => (
            <div key={rep.id} className="bg-cinema-card rounded-2xl p-5 border border-cinema-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cinema-accent/20 text-cinema-accent border border-cinema-accent/30">
                    {rep.targetType}
                  </span>
                  <span className="text-xs font-bold text-white">{rep.targetTitle}</span>
                </div>
                <p className="text-xs text-cinema-muted">Reason: <strong className="text-cinema-gold">{rep.reason}</strong> — {rep.details}</p>
                <span className="text-[10px] text-cinema-muted block">Reported by {rep.reporterName} • {rep.date}</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleResolve(rep.id, 'Content Removed')}
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Content
                </button>
                <button
                  onClick={() => handleResolve(rep.id, 'Report Dismissed')}
                  className="px-3 py-1.5 rounded-xl bg-cinema-surface hover:bg-cinema-border text-cinema-muted text-xs font-semibold border border-cinema-border"
                >
                  Dismiss Report
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-cinema-card rounded-3xl p-10 text-center border border-cinema-border">
          <ShieldAlert className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-60" />
          <h3 className="font-bold text-white text-base">All Clean! No Pending Reports</h3>
          <p className="text-xs text-cinema-muted mt-1">Community reports will appear here for review.</p>
        </div>
      )}

    </div>
  );
}
