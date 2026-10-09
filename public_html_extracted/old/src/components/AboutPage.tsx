import React from 'react';
import { InteractiveFloorPlan } from './InteractiveFloorPlan';
import { 
  Sparkles, 
  Film, 
  ShieldCheck, 
  Award, 
  Globe, 
  Server, 
  Video, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Tv,
  CheckCircle2
} from 'lucide-react';

interface AboutPageProps {
  onExploreProjects: () => void;
  onContact: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onExploreProjects,
  onContact
}) => {
  return (
    <div id="about-page" className="py-8 sm:py-12 space-y-16 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-200">
      
      {/* 1. Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-xs font-semibold text-purple-300">
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          <span>Independent Cinema & Digital Stage</span>
        </div>
        <h1 className="cinematic-title text-3xl sm:text-4xl lg:text-5xl font-black text-white">
          About <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">Indian Short Movie</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
          India's dedicated OTT streaming ecosystem empowering independent directors, screenwriters, festival filmmakers, and cinematographers across all regional Indian languages.
        </p>
      </div>

      {/* 2. Mission & Core Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 space-y-4 hover:border-purple-500/30 transition-all">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Film className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Curated Regional Cinema</h3>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            From Kannada folklore to Malayalam neo-noir, Hindi realism, Tamil drama, and Telugu mystery, we champion cinema from every Indian soil.
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-purple-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Pan-Indian Language Support</span>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 space-y-4 hover:border-purple-500/30 transition-all">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white">100% Filmmaker Rights</h3>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            Filmmakers maintain complete copyright, intellectual property, and festival submission privileges. We provide non-exclusive digital distribution.
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-indigo-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Zero IP Transfer</span>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 space-y-4 hover:border-purple-500/30 transition-all">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Server className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Ultra-Fast Streaming</h3>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            Powered by high-performance cloud hosting from Web Hosting Baba, providing seamless 4K video screeners with zero buffering across mobile and desktop.
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-blue-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>4K Ultra HD & Dolby Atmos</span>
          </div>
        </div>
      </div>

      {/* 3. Associated Digital Ecosystem & Technology Ventures */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
              Digital Infrastructure
            </span>
            <h2 className="cinematic-title text-xl sm:text-2xl font-black text-white mt-1">
              Connected Platforms & Technology Ecosystem
            </h2>
          </div>
          <button
            onClick={onContact}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 cursor-pointer"
          >
            <span>Partner With Us</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="https://webhostingbaba.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-white/5 bg-white/[0.02] p-4 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all flex items-center justify-between"
          >
            <div>
              <h4 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                Web Hosting Baba
              </h4>
              <p className="text-xs text-gray-400">Cloud hosting, CDN & servers</p>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-purple-400" />
          </a>

          <a
            href="https://jobhunterr.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-white/5 bg-white/[0.02] p-4 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all flex items-center justify-between"
          >
            <div>
              <h4 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                JobHunterr.com
              </h4>
              <p className="text-xs text-gray-400">Creative & tech career portal</p>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-purple-400" />
          </a>

          <a
            href="https://jobbeku.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-white/5 bg-white/[0.02] p-4 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all flex items-center justify-between"
          >
            <div>
              <h4 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                JobBeku.com
              </h4>
              <p className="text-xs text-gray-400">Karnataka recruitment network</p>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-purple-400" />
          </a>

          <a
            href="https://herjobs.in"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-white/5 bg-white/[0.02] p-4 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all flex items-center justify-between"
          >
            <div>
              <h4 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                HerJobs.in
              </h4>
              <p className="text-xs text-gray-400">Women professional network</p>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-purple-400" />
          </a>

          <a
            href="https://brainmap.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-white/5 bg-white/[0.02] p-4 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all flex items-center justify-between"
          >
            <div>
              <h4 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                BrainMap.com
              </h4>
              <p className="text-xs text-gray-400">Digital intelligence & analytics</p>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-purple-400" />
          </a>

          <div
            onClick={onExploreProjects}
            className="group rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 hover:bg-purple-500/10 transition-all flex items-center justify-between cursor-pointer"
          >
            <div>
              <h4 className="font-bold text-sm text-purple-300">
                Explore Projects Gallery
              </h4>
              <p className="text-xs text-gray-400">Watch short films & trailers</p>
            </div>
            <Film className="h-4 w-4 text-purple-400" />
          </div>
        </div>
      </div>

      {/* 4. Interactive Studio Screening Floor Plan */}
      <div className="pt-8 border-t border-white/10 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
            Production & Premiere Studio
          </span>
          <h2 className="cinematic-title text-2xl sm:text-3xl font-black text-white">
            Interactive Screening Floor Plan
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Explore our state-of-the-art 4K laser auditoriums, Dolby Atmos suites, post-production color grading labs, and filmmakers lounge.
          </p>
        </div>

        <InteractiveFloorPlan />
      </div>

    </div>
  );
};
