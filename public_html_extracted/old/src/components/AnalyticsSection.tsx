import React, { useEffect, useState } from 'react';
import { Film, Eye, Users, Heart, Sparkles, TrendingUp, Award, Globe, ArrowUpRight, BarChart2, Activity } from 'lucide-react';
import { ShortFilm, ReelVideo, Creator } from '../types';

interface AnalyticsSectionProps {
  films: ShortFilm[];
  reels: ReelVideo[];
  creators: Creator[];
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  films,
  reels,
  creators
}) => {
  const approvedFilms = films.filter(f => f.status === 'approved' || f.status === 'published' || !f.status);
  const totalViews = films.reduce((acc, f) => acc + (f.viewsCount || 0), 0) + reels.reduce((acc, r) => acc + (r.viewsCount || 0), 0);
  const totalLikes = films.reduce((acc, f) => acc + (f.likesCount || 0), 0) + reels.reduce((acc, r) => acc + (r.likesCount || 0), 0);
  const uniqueLanguagesCount = Array.from(new Set(films.map(f => f.language))).length || 9;

  // Animated counters state
  const [animatedViews, setAnimatedViews] = useState(0);
  const [animatedLikes, setAnimatedLikes] = useState(0);
  const [animatedFilms, setAnimatedFilms] = useState(0);

  useEffect(() => {
    let startViews = 0;
    const endViews = totalViews;
    const duration = 1400;
    const stepTime = 30;
    const incrementViews = Math.ceil(endViews / (duration / stepTime)) || 1;

    const timerViews = setInterval(() => {
      startViews += incrementViews;
      if (startViews >= endViews) {
        setAnimatedViews(endViews);
        clearInterval(timerViews);
      } else {
        setAnimatedViews(startViews);
      }
    }, stepTime);

    let startLikes = 0;
    const endLikes = totalLikes;
    const incrementLikes = Math.ceil(endLikes / (duration / stepTime)) || 1;
    const timerLikes = setInterval(() => {
      startLikes += incrementLikes;
      if (startLikes >= endLikes) {
        setAnimatedLikes(endLikes);
        clearInterval(timerLikes);
      } else {
        setAnimatedLikes(startLikes);
      }
    }, stepTime);

    let startFilms = 0;
    const endFilms = approvedFilms.length;
    const timerFilms = setInterval(() => {
      startFilms += 1;
      if (startFilms >= endFilms) {
        setAnimatedFilms(endFilms);
        clearInterval(timerFilms);
      } else {
        setAnimatedFilms(startFilms);
      }
    }, 60);

    return () => {
      clearInterval(timerViews);
      clearInterval(timerLikes);
      clearInterval(timerFilms);
    };
  }, [totalViews, totalLikes, approvedFilms.length]);

  return (
    <section id="analytics-section" className="relative py-16 bg-[#050505] overflow-hidden border-b border-white/10">
      {/* Background glow orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-xs font-semibold text-purple-300">
              <Activity className="h-3.5 w-3.5 text-purple-400" />
              <span>Platform Analytics & Audience Reach</span>
            </div>
            <h2 className="cinematic-title text-3xl sm:text-4xl lg:text-5xl font-black text-white">
              India's Fastest Growing <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">Cinema Network</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl">
              Real-time streaming metrics, filmmaker catalog expansion, and pan-Indian audience engagement.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Live Metrics Stream</span>
          </div>
        </div>

        {/* 6 Luxury Glass Stat Cards with Animated Counters & Graph Placeholders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Stat 1: Total Catalog Films */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-500/40 hover:shadow-[0_0_35px_rgba(139,92,246,0.18)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 group-hover:scale-110 transition-transform">
                  <Film className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> +18% MoM
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums">
                {animatedFilms}+
              </p>
              <h3 className="text-sm font-bold text-gray-200 mt-1">Short Films & Featurettes</h3>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Hand-curated Kannada, Hindi, Tamil, Telugu, and indie titles.
              </p>
            </div>

            {/* Sparkline Graph Placeholder */}
            <div className="mt-4 pt-3 border-t border-white/5">
              <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                <span>Monthly Catalog Growth</span>
                <span className="text-purple-400 font-bold">Live</span>
              </div>
              <svg className="w-full h-10 overflow-visible" viewBox="0 0 200 40">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,35 Q30,30 60,25 T120,15 T160,18 T200,5 L200,40 L0,40 Z" fill="url(#grad1)" />
                <path d="M0,35 Q30,30 60,25 T120,15 T160,18 T200,5" fill="none" stroke="#8b5cf6" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

          {/* Stat 2: Total Cinema Streams / Views */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/40 hover:shadow-[0_0_35px_rgba(59,130,246,0.18)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 group-hover:scale-110 transition-transform">
                  <Eye className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Real-time
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums">
                {animatedViews.toLocaleString()}+
              </p>
              <h3 className="text-sm font-bold text-gray-200 mt-1">Cinema Streams & Reels Views</h3>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Streamed on mobile, tablet, and smart TVs nationwide.
              </p>
            </div>

            {/* Sparkline Graph Placeholder */}
            <div className="mt-4 pt-3 border-t border-white/5">
              <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                <span>Viewership Volume</span>
                <span className="text-blue-400 font-bold">+24.8K today</span>
              </div>
              <svg className="w-full h-10 overflow-visible" viewBox="0 0 200 40">
                <defs>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,32 Q40,35 80,18 T130,22 T170,8 T200,4 L200,40 L0,40 Z" fill="url(#grad2)" />
                <path d="M0,32 Q40,35 80,18 T130,22 T170,8 T200,4" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

          {/* Stat 3: Pan-Indian Languages */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-500/40 hover:shadow-[0_0_35px_rgba(139,92,246,0.18)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 group-hover:scale-110 transition-transform">
                  <Globe className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Multilingual
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums">
                {uniqueLanguagesCount}
              </p>
              <h3 className="text-sm font-bold text-gray-200 mt-1">Regional Indian Languages</h3>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Kannada, Hindi, Tamil, Telugu, Malayalam, Bengali & more.
              </p>
            </div>

            {/* Sparkline Graph Placeholder */}
            <div className="mt-4 pt-3 border-t border-white/5">
              <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                <span>Pan-India Coverage</span>
                <span className="text-indigo-400 font-bold">100% Subtitled</span>
              </div>
              <svg className="w-full h-10 overflow-visible" viewBox="0 0 200 40">
                <defs>
                  <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,28 Q50,15 100,22 T150,10 T200,6 L200,40 L0,40 Z" fill="url(#grad3)" />
                <path d="M0,28 Q50,15 100,22 T150,10 T200,6" fill="none" stroke="#6366f1" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

          {/* Stat 4: Filmmakers & Storytellers */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-500/40 hover:shadow-[0_0_35px_rgba(139,92,246,0.18)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Filmmaker Hub
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums">
                {creators.length}+
              </p>
              <h3 className="text-sm font-bold text-gray-200 mt-1">Independent Filmmakers & Crews</h3>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Directors, writers, cinematographers & production houses.
              </p>
            </div>

            {/* Sparkline Graph Placeholder */}
            <div className="mt-4 pt-3 border-t border-white/5">
              <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                <span>Directorial Onboarding</span>
                <span className="text-amber-400 font-bold">Active Submissions</span>
              </div>
              <svg className="w-full h-10 overflow-visible" viewBox="0 0 200 40">
                <defs>
                  <linearGradient id="grad4" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,30 Q40,26 90,19 T140,24 T200,8 L200,40 L0,40 Z" fill="url(#grad4)" />
                <path d="M0,30 Q40,26 90,19 T140,24 T200,8" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

          {/* Stat 5: Audience Engagement & Likes */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-pink-500/40 hover:shadow-[0_0_35px_rgba(236,72,153,0.18)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/15 border border-pink-500/30 text-pink-400 group-hover:scale-110 transition-transform">
                  <Heart className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20">
                  Engagement
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums">
                {animatedLikes.toLocaleString()}+
              </p>
              <h3 className="text-sm font-bold text-gray-200 mt-1">Likes, Shares & Community Votes</h3>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Viewer reactions, watchlist additions, and festival praise.
              </p>
            </div>

            {/* Sparkline Graph Placeholder */}
            <div className="mt-4 pt-3 border-t border-white/5">
              <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                <span>Interaction Velocity</span>
                <span className="text-pink-400 font-bold">98.4% Positive</span>
              </div>
              <svg className="w-full h-10 overflow-visible" viewBox="0 0 200 40">
                <defs>
                  <linearGradient id="grad5" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,35 Q60,18 100,28 T160,12 T200,5 L200,40 L0,40 Z" fill="url(#grad5)" />
                <path d="M0,35 Q60,18 100,28 T160,12 T200,5" fill="none" stroke="#ec4899" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

          {/* Stat 6: Quality Standard / Rating */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/40 hover:shadow-[0_0_35px_rgba(16,185,129,0.18)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Award className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Festival Grade
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums">
                8.9 / 10
              </p>
              <h3 className="text-sm font-bold text-gray-200 mt-1">Average Screener Score</h3>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Reviewed by filmmakers, cinema critics, and juries.
              </p>
            </div>

            {/* Sparkline Graph Placeholder */}
            <div className="mt-4 pt-3 border-t border-white/5">
              <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                <span>Audience Satisfaction</span>
                <span className="text-emerald-400 font-bold">Top 5% OTT</span>
              </div>
              <svg className="w-full h-10 overflow-visible" viewBox="0 0 200 40">
                <defs>
                  <linearGradient id="grad6" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,25 Q50,30 100,16 T160,18 T200,8 L200,40 L0,40 Z" fill="url(#grad6)" />
                <path d="M0,25 Q50,30 100,16 T160,18 T200,8" fill="none" stroke="#10b981" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
