import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Check, 
  X,
  Filter,
  RefreshCw,
  Plus
} from 'lucide-react';

interface ReportItem {
  id: string;
  targetType: 'review' | 'comment' | 'film';
  targetTitle: string;
  reporterName: string;
  reason: string;
  details: string;
  date: string;
}

interface AdminContentModerationProps {
  onToast: (msg: string) => void;
  onUpdatePendingCount?: (count: number) => void;
}

const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep-1',
    targetType: 'review',
    targetTitle: 'Review on Chai & Stories',
    reporterName: 'Vikram Joshi',
    reason: 'Spam / Self Promotion',
    details: 'Contains external suspicious promotional links and repeated advertisement texts.',
    date: '5 hours ago'
  },
  {
    id: 'rep-2',
    targetType: 'comment',
    targetTitle: 'Comment on Midnight Express',
    reporterName: 'Divya Nambiar',
    reason: 'Abusive language',
    details: 'Violates community guidelines with uncivil speech towards the cast members.',
    date: '1 day ago'
  },
  {
    id: 'rep-3',
    targetType: 'film',
    targetTitle: 'Shadows of Old Delhi',
    reporterName: 'Kunal Verma (Copyright Owner)',
    reason: 'Copyright Infringement',
    details: 'Background score contains unlicensed copyrighted track without commercial synch license.',
    date: '2 days ago'
  }
];

export const AdminContentModeration: React.FC<AdminContentModerationProps> = ({
  onToast,
  onUpdatePendingCount
}) => {
  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem('ism_admin_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const handleResolve = (id: string, action: 'Content Removed' | 'Report Dismissed') => {
    const updated = reports.filter(r => r.id !== id);
    setReports(updated);
    localStorage.setItem('ism_admin_reports', JSON.stringify(updated));
    if (onUpdatePendingCount) onUpdatePendingCount(updated.length);
    onToast(`Report ${id} resolved with action: ${action}`);
  };

  const handleResetSampleReports = () => {
    setReports(INITIAL_REPORTS);
    localStorage.setItem('ism_admin_reports', JSON.stringify(INITIAL_REPORTS));
    if (onUpdatePendingCount) onUpdatePendingCount(INITIAL_REPORTS.length);
    onToast('Sample moderation queue reloaded');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Content Moderation Queue
          </h1>
          <p className="text-xs text-cinema-muted mt-1">
            Review community reports for copyright, spam, or inappropriate content
          </p>
        </div>
        {reports.length === 0 && (
          <button
            onClick={handleResetSampleReports}
            className="px-3.5 py-2 rounded-xl bg-cinema-surface hover:bg-cinema-card border border-cinema-border text-xs text-cinema-muted hover:text-white flex items-center gap-2 self-start sm:self-auto transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Reports</span>
          </button>
        )}
      </div>

      {/* Reports List matching Reference exactly */}
      {reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-cinema-card rounded-2xl p-5 border border-cinema-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-cinema-border/80 transition-all shadow-xl"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cinema-accent/20 text-cinema-accent border border-cinema-accent/30 tracking-wider">
                    {report.targetType}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {report.targetTitle}
                  </span>
                </div>

                <p className="text-xs text-cinema-muted leading-relaxed">
                  Reason:{' '}
                  <strong className="text-cinema-gold font-semibold">
                    {report.reason}
                  </strong>{' '}
                  — {report.details}
                </p>

                <span className="text-[10px] text-cinema-muted block">
                  Reported by {report.reporterName} • {report.date}
                </span>
              </div>

              {/* Action Buttons matching reference */}
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  onClick={() => handleResolve(report.id, 'Content Removed')}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/20 transition-all active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Content</span>
                </button>
                <button
                  onClick={() => handleResolve(report.id, 'Report Dismissed')}
                  className="px-3.5 py-2 rounded-xl bg-cinema-surface hover:bg-cinema-border text-cinema-muted hover:text-white text-xs font-semibold border border-cinema-border transition-all active:scale-95"
                >
                  <span>Dismiss Report</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-cinema-card rounded-3xl p-12 text-center border border-cinema-border space-y-3 shadow-xl">
          <ShieldAlert className="w-12 h-12 text-emerald-400 mx-auto opacity-70" />
          <h3 className="font-bold text-white text-base">All Clean! No Pending Reports</h3>
          <p className="text-xs text-cinema-muted max-w-sm mx-auto">
            Community reports will appear here when users flag reviews, comments, or short films.
          </p>
        </div>
      )}
    </div>
  );
};
