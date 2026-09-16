import React from 'react';
import { getAdminStats } from '@/lib/supabase';
import { Users, Film, FileCheck, Eye, MessageSquare, ShieldAlert, TrendingUp, Award, Layers } from 'lucide-react';

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
    { label: 'Total Short Films', value: stats.totalFilms, icon: Film, color: 'text-cinema-gold', bg: 'bg-cinema-gold/10 border-cinema-gold/30' },
    { label: 'Published Films', value: stats.publishedFilms, icon: Film, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    { label: 'Pending Submissions', value: stats.pendingSubmissions, icon: FileCheck, color: 'text-cinema-accent', bg: 'bg-cinema-accent/10 border-cinema-accent/30' },
    { label: 'Total Video Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'text-cinema-teal', bg: 'bg-cinema-teal/10 border-cinema-teal/30' },
    { label: 'Total Reviews', value: stats.totalReviews.toLocaleString(), icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
    { label: 'Filmmakers', value: stats.totalFilmmakers, icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
    { label: 'Pending Reports', value: stats.totalReports, icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Page Title */}
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-white">Platform Analytics & Dashboard</h1>
        <p className="text-xs text-cinema-muted mt-1">Real-time overview of users, film uploads, submissions, and moderation</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`p-5 rounded-2xl border ${card.bg} space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-cinema-muted font-medium">{card.label}</span>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className="text-2xl font-black text-white">{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Popular Languages Distribution */}
        <div className="bg-cinema-card rounded-3xl p-6 border border-cinema-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cinema-teal" /> Popular Indian Languages
            </h3>
            <span className="text-[11px] text-cinema-muted">By View Share</span>
          </div>

          <div className="space-y-3">
            {[
              { lang: 'Hindi (हिन्दी)', pct: 42, color: 'bg-cinema-accent' },
              { lang: 'Tamil (தமிழ்)', pct: 24, color: 'bg-cinema-teal' },
              { lang: 'Gujarati (ગુજરાતી)', pct: 16, color: 'bg-cinema-gold' },
              { lang: 'Telugu (తెలుగు)', pct: 12, color: 'bg-purple-500' },
              { lang: 'Kannada (ಕನ್ನಡ)', pct: 6, color: 'bg-blue-500' },
            ].map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-gray-300">
                  <span>{item.lang}</span>
                  <span>{item.pct}%</span>
                </div>
                <div className="w-full bg-cinema-surface h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Activity Log */}
        <div className="bg-cinema-card rounded-3xl p-6 border border-cinema-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cinema-gold" /> Recent Admin Activity
            </h3>
            <span className="text-[11px] text-cinema-muted">Audit Logs</span>
          </div>

          <div className="space-y-3 text-xs text-cinema-muted">
            <div className="p-3 bg-cinema-surface rounded-xl border border-cinema-border/50 flex justify-between">
              <span>Approved submission <strong className="text-white">&quot;Chai &amp; Stories&quot;</strong></span>
              <span>10m ago</span>
            </div>
            <div className="p-3 bg-cinema-surface rounded-xl border border-cinema-border/50 flex justify-between">
              <span>Marked <strong className="text-cinema-gold">&quot;Midnight Express&quot;</strong> as Featured</span>
              <span>1h ago</span>
            </div>
            <div className="p-3 bg-cinema-surface rounded-xl border border-cinema-border/50 flex justify-between">
              <span>Resolved content report #1024</span>
              <span>3h ago</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
