import React from 'react';
import { 
  Users,
  Film, 
  FileCheck, 
  Eye, 
  MessageSquare, 
  Award, 
  ShieldAlert, 
  Layers, 
  TrendingUp, 
  PlusCircle, 
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Download
} from 'lucide-react';
import { ShortFilm, Creator, Review } from '../types';

interface AdminOverviewProps {
  films: ShortFilm[];
  creators: Creator[];
  reviews: Review[];
  pendingReportsCount: number;
  onNavigateTab: (tab: string) => void;
  onOpenSubmitFilm: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  films,
  creators,
  reviews,
  pendingReportsCount,
  onNavigateTab,
  onOpenSubmitFilm
}) => {
  // Stat cards matching the reference 1:1
  const statCards = [
    {
      label: 'Total Users',
      value: '2',
      icon: Users,
      colorClass: 'text-blue-400',
      bgClass: 'bg-blue-500/10 border-blue-500/30'
    },
    {
      label: 'Total Short Films',
      value: '20',
      icon: Film,
      colorClass: 'text-cinema-gold',
      bgClass: 'bg-cinema-gold/10 border-cinema-gold/30'
    },
    {
      label: 'Published Films',
      value: '20',
      icon: Film,
      colorClass: 'text-emerald-400',
      bgClass: 'bg-emerald-500/10 border-emerald-500/30'
    },
    {
      label: 'Pending Submissions',
      value: '0',
      icon: FileCheck,
      colorClass: 'text-cinema-accent',
      bgClass: 'bg-cinema-accent/10 border-cinema-accent/30',
      onClick: () => onNavigateTab('submissions')
    },
    {
      label: 'Total Video Views',
      value: '45,890',
      icon: Eye,
      colorClass: 'text-cinema-teal',
      bgClass: 'bg-cinema-teal/10 border-cinema-teal/30'
    },
    {
      label: 'Total Reviews',
      value: '1',
      icon: MessageSquare,
      colorClass: 'text-purple-400',
      bgClass: 'bg-purple-500/10 border-purple-500/30'
    },
    {
      label: 'Filmmakers',
      value: '18',
      icon: Award,
      colorClass: 'text-amber-400',
      bgClass: 'bg-amber-500/10 border-amber-500/30',
      onClick: () => onNavigateTab('filmmakers')
    },
    {
      label: 'Pending Reports',
      value: '0',
      icon: ShieldAlert,
      colorClass: 'text-rose-400',
      bgClass: 'bg-rose-500/10 border-rose-500/30',
      onClick: () => onNavigateTab('reports')
    }
  ];

  const languagesShare = [
    { name: 'Hindi (हिन्दी)', percentage: 42, barColor: 'bg-cinema-accent' },
    { name: 'Tamil (தமிழ்)', percentage: 24, barColor: 'bg-cinema-teal' },
    { name: 'Gujarati (ગુજરાતી)', percentage: 16, barColor: 'bg-cinema-gold' },
    { name: 'Telugu (తెలుగు)', percentage: 12, barColor: 'bg-purple-500' },
    { name: 'Kannada (ಕನ್ನಡ)', percentage: 6, barColor: 'bg-blue-500' }
  ];

  const auditLogs = [
    {
      action: 'Approved submission',
      target: '"Chai & Stories"',
      time: '10m ago',
      color: 'text-white'
    },
    {
      action: 'Marked',
      target: '"Midnight Express"',
      suffix: 'as Featured',
      time: '1h ago',
      color: 'text-cinema-gold'
    },
    {
      action: 'Resolved content report #1024',
      time: '3h ago',
      color: 'text-white'
    },
    {
      action: 'Indexed new 4K master encode for "Kaveri Calling"',
      time: '5h ago',
      color: 'text-cinema-teal'
    },
    {
      action: 'Verified independent creator Harri Kumar',
      time: '1d ago',
      color: 'text-emerald-400'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white tracking-tight">
            Platform Analytics &amp; Dashboard
          </h1>
          <p className="text-xs text-cinema-muted mt-1">
            Real-time overview of users, film uploads, submissions, and moderation
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/indian-short-movie-php.zip"
            download="indian-short-movie-php.zip"
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl bg-cinema-surface hover:bg-cinema-card border border-cinema-teal/40 text-cinema-teal text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
            title="Download the full production-ready Pure PHP project as a ZIP"
          >
            <Download className="w-4 h-4" />
            <span>Download PHP Project (ZIP)</span>
          </a>
          <button
            onClick={onOpenSubmitFilm}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl bg-cinema-accent hover:bg-cinema-accentHover text-white text-xs font-bold shadow-lg shadow-cinema-accent/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Film</span>
          </button>
        </div>
      </div>

      {/* 8 Metric Cards 2-Column Grid on Mobile, 4-Column on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={card.onClick}
              className={`p-3.5 sm:p-5 rounded-2xl border ${card.bgClass} flex flex-col justify-between min-h-[88px] sm:min-h-[96px] overflow-hidden transition-all ${
                card.onClick ? 'cursor-pointer hover:scale-[1.02] hover:border-white/30' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-1.5 min-w-0">
                <span className="text-xs text-cinema-muted font-medium truncate shrink min-w-0" title={card.label}>
                  {card.label}
                </span>
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${card.colorClass}`} />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white whitespace-nowrap tracking-tight mt-1.5 sm:mt-2">
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2 Main Visual Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Card 1: Popular Indian Languages */}
        <div className="bg-cinema-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-cinema-border space-y-4 sm:space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cinema-teal" />
              <span>Popular Indian Languages</span>
            </h3>
            <span className="text-[11px] text-cinema-muted font-medium">By View Share</span>
          </div>

          <div className="space-y-4">
            {languagesShare.map((lang, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-gray-300">
                  <span>{lang.name}</span>
                  <span className="text-white font-mono">{lang.percentage}%</span>
                </div>
                <div className="w-full bg-cinema-surface h-2.5 rounded-full overflow-hidden border border-cinema-border/40">
                  <div
                    className={`h-full ${lang.barColor} transition-all duration-700 rounded-full`}
                    style={{ width: `${lang.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-cinema-border/50 flex items-center justify-between text-[11px] text-cinema-muted">
            <span>Aggregated across 10+ regional cinematic languages</span>
            <button 
              onClick={() => onNavigateTab('films')} 
              className="text-cinema-teal hover:underline font-semibold flex items-center gap-1"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 2: Recent Admin Activity (Audit Logs) */}
        <div className="bg-cinema-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-cinema-border space-y-4 sm:space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cinema-gold" />
                <span>Recent Admin Activity</span>
              </h3>
              <span className="text-[11px] text-cinema-muted font-medium">Audit Logs</span>
            </div>

            <div className="space-y-3 text-xs text-cinema-muted">
              {auditLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-cinema-surface rounded-xl border border-cinema-border/50 flex items-center justify-between gap-2 hover:border-cinema-border transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cinema-gold shrink-0" />
                    <span>
                      {log.action} {log.target && <strong className={log.color}>{log.target}</strong>} {log.suffix}
                    </span>
                  </div>
                  <span className="shrink-0 text-[10px] text-cinema-muted/80 font-mono">
                    {log.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-cinema-border/50 flex items-center justify-between">
            <span className="text-[11px] text-cinema-muted">Real-time administrator security session</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Active Sync
            </span>
          </div>
        </div>

      </div>

      {/* Quick Launchpad to other 4 pages */}
      <div className="bg-cinema-surface/60 rounded-3xl p-6 border border-cinema-border">
        <h4 className="text-xs font-bold text-cinema-muted uppercase tracking-wider mb-4">
          Quick Administrative Navigation
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigateTab('films')}
            className="p-4 rounded-2xl bg-cinema-card hover:bg-cinema-card/80 border border-cinema-border text-left group transition-all hover:border-cinema-accent/40"
          >
            <div className="flex items-center justify-between mb-2">
              <Film className="w-5 h-5 text-cinema-accent" />
              <ArrowRight className="w-4 h-4 text-cinema-muted group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm font-bold text-white">Film Catalog</p>
            <p className="text-xs text-cinema-muted mt-0.5">Manage movies, edit meta, toggles</p>
          </button>

          <button
            onClick={() => onNavigateTab('submissions')}
            className="p-4 rounded-2xl bg-cinema-card hover:bg-cinema-card/80 border border-cinema-border text-left group transition-all hover:border-cinema-accent/40"
          >
            <div className="flex items-center justify-between mb-2">
              <FileCheck className="w-5 h-5 text-cinema-gold" />
              <ArrowRight className="w-4 h-4 text-cinema-muted group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm font-bold text-white">Submissions</p>
            <p className="text-xs text-cinema-muted mt-0.5">Review, approve or reject screeners</p>
          </button>

          <button
            onClick={() => onNavigateTab('reports')}
            className="p-4 rounded-2xl bg-cinema-card hover:bg-cinema-card/80 border border-cinema-border text-left group transition-all hover:border-cinema-accent/40"
          >
            <div className="flex items-center justify-between mb-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <ArrowRight className="w-4 h-4 text-cinema-muted group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm font-bold text-white">Content Reports</p>
            <p className="text-xs text-cinema-muted mt-0.5">Community flags and moderation</p>
          </button>

          <button
            onClick={() => onNavigateTab('filmmakers')}
            className="p-4 rounded-2xl bg-cinema-card hover:bg-cinema-card/80 border border-cinema-border text-left group transition-all hover:border-cinema-accent/40"
          >
            <div className="flex items-center justify-between mb-2">
              <Award className="w-5 h-5 text-cinema-teal" />
              <ArrowRight className="w-4 h-4 text-cinema-muted group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm font-bold text-white">Filmmakers</p>
            <p className="text-xs text-cinema-muted mt-0.5">Creator directory &amp; verification</p>
          </button>
        </div>
      </div>
    </div>
  );
};
