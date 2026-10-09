import React from 'react';
import { 
  Upload, 
  Film, 
  Smartphone, 
  Heart, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Share2, 
  Play,
  ArrowRight,
  UserCheck,
  Clapperboard,
  Search,
  MessageSquare,
  BarChart3,
  Megaphone,
  Users
} from 'lucide-react';

interface LuxuryFeatureGridProps {
  onOpenUpload: () => void;
  onExploreGenres: () => void;
  onGoToReels: () => void;
  onOpenAdmin: () => void;
  onExploreFilms: () => void;
  onOpenAuth: () => void;
  onExploreCreators?: () => void;
  onOpenStorytellers?: () => void;
  onOpenAnalytics?: () => void;
}

export const LuxuryFeatureGrid: React.FC<LuxuryFeatureGridProps> = ({
  onOpenUpload,
  onExploreGenres,
  onGoToReels,
  onOpenAdmin,
  onExploreFilms,
  onOpenAuth,
  onExploreCreators,
  onOpenStorytellers,
  onOpenAnalytics
}) => {
  const features = [
    {
      id: 'upload-streaming',
      title: 'Upload & Streaming',
      subtitle: 'Creator Direct Upload & 4K OTT Playback',
      description: 'Stream short films and documentaries with adaptive bitrate, Dolby Audio, and instant creator self-publishing with screener and trailer uploads.',
      icon: Upload,
      accent: 'from-purple-500 to-indigo-500',
      tag: '4K Ultra HD',
      actionText: 'Submit / Upload Film →',
      onClick: onOpenUpload
    },
    {
      id: 'browse-genre',
      title: 'Browse by Genre & Language',
      subtitle: 'Multi-Lingual Smart Discovery',
      description: 'Filter through Kannada, Hindi, Tamil, Telugu, Malayalam, and regional stories across Drama, Thriller, Comedy, Folk Folklore, and Sci-Fi.',
      icon: Layers,
      accent: 'from-blue-500 to-cyan-500',
      tag: '9+ Languages',
      actionText: 'Browse Catalog →',
      onClick: onExploreGenres
    },
    {
      id: 'user-profiles',
      title: 'User Profiles & Watchlists',
      subtitle: 'Personalized Member Hub',
      description: 'Custom viewer accounts, personal watchlists, favorites collection, viewing history, and tailored film recommendations based on taste.',
      icon: UserCheck,
      accent: 'from-purple-500 to-pink-500',
      tag: 'Member Portal',
      actionText: 'Join Community →',
      onClick: onOpenAuth
    },
    {
      id: 'social-engagement',
      title: 'Like, Share & Comment',
      subtitle: 'Real-Time Audience Reactions',
      description: 'Engage with filmmakers through timestamps, comment threads, social sharing, and instant bookmarking for upcoming premieres.',
      icon: Heart,
      accent: 'from-rose-500 to-red-500',
      tag: 'Community',
      actionText: 'Join the Discussion →',
      onClick: onExploreFilms
    },
    {
      id: 'ratings-reviews',
      title: 'Ratings & Reviews',
      subtitle: 'Authentic Film Critiques',
      description: 'Read and submit verified viewer reviews, 10-point ratings, critical breakdowns, and festival jury evaluations.',
      icon: Star,
      accent: 'from-amber-500 to-yellow-500',
      tag: 'Audience Score',
      actionText: 'Read Reviews →',
      onClick: onExploreFilms
    },
    {
      id: 'filmmaker-profiles',
      title: 'Pan-Indian Storytellers & Directors',
      subtitle: 'Independent Creators Network',
      description: 'Connect with visionary cinematographers, screenwriters, and indie producers across Kannada, Hindi, Tamil, Telugu, and regional cinema.',
      icon: Users,
      accent: 'from-indigo-500 to-purple-600',
      tag: 'Creators Network',
      actionText: 'View Storytellers & Directors →',
      onClick: () => {
        if (onOpenStorytellers) onOpenStorytellers();
        else if (onExploreCreators) onExploreCreators();
        else onExploreFilms();
      }
    },
    {
      id: 'analytics-dashboard',
      title: "India's Fastest Growing Cinema Network",
      subtitle: 'Real-Time Streaming & Platform Analytics',
      description: 'Comprehensive platform statistics, 142K+ monthly streaming hours, 89+ festival laureates, and regional audience growth.',
      icon: BarChart3,
      accent: 'from-blue-600 to-indigo-600',
      tag: 'Live Analytics',
      actionText: 'View Network Analytics →',
      onClick: () => {
        if (onOpenAnalytics) onOpenAnalytics();
        else onExploreFilms();
      }
    },
    {
      id: 'admin-management',
      title: 'Admin Dashboard & Moderation',
      subtitle: 'Enterprise Platform Governance',
      description: 'Comprehensive editorial screener queue, content moderation, reviewer management, user role permissions, and catalog curation.',
      icon: ShieldCheck,
      accent: 'from-emerald-500 to-teal-500',
      tag: 'Admin Console',
      actionText: 'Open Admin Console →',
      onClick: onOpenAdmin
    },
    {
      id: 'promotional-options',
      title: 'Promotional Options & Spotlights',
      subtitle: 'Filmmaker Campaign Boost',
      description: 'Spotlight your movie banner, boost trending rank, premiere countdowns, festival press release syndication, and brand collaborations.',
      icon: Megaphone,
      accent: 'from-pink-500 to-rose-600',
      tag: 'Premiere Boost',
      actionText: 'Explore Promotions →',
      onClick: onOpenUpload
    }
  ];

  return (
    <section id="luxury-features-section" className="relative py-16 bg-[#050505] overflow-hidden border-b border-white/10">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-xs font-semibold text-purple-300">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span>Overview Options</span>
          </div>
          <h2 className="cinematic-title text-3xl sm:text-4xl lg:text-5xl font-black text-white">
            Platform <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">Overview Options</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Explore platform features, creator networks, live streaming analytics, and independent cinema tools.
          </p>
        </div>

        {/* 9 Feature Cards Grid (3x3 on Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={feat.onClick}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-7 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:border-purple-500/50 hover:shadow-[0_0_35px_rgba(139,92,246,0.22)] cursor-pointer"
              >
                {/* Subtle Card Glow Highlight */}
                <div className="absolute -top-16 -right-16 w-36 h-36 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl group-hover:from-purple-500/25 transition-all duration-500" />

                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br ${feat.accent} p-3 text-white shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6" />
                    </div>

                    <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] font-bold text-purple-300">
                      {feat.tag}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="cinematic-title text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs font-semibold text-purple-400/90 mt-1">
                    {feat.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mt-3">
                    {feat.description}
                  </p>
                </div>

                {/* Bottom Action Prompt */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:text-white transition-colors">
                  <span>{feat.actionText}</span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
