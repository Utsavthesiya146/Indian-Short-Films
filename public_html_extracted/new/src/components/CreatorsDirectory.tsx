import React, { useState } from 'react';
import { Users, Sparkles, Film, Heart, ArrowRight, UserCheck } from 'lucide-react';
import { Creator } from '../types';

interface CreatorsDirectoryProps {
  creators: Creator[];
  onSelectCreator: (creator: Creator) => void;
  onOpenAuth?: () => void;
}

export const CreatorsDirectory: React.FC<CreatorsDirectoryProps> = ({
  creators,
  onSelectCreator,
  onOpenAuth
}) => {
  const [filterRole, setFilterRole] = useState('All');

  const ROLES = ['All', 'Executive Producers', 'Directors', 'Digital Leaders', 'Cinematographers'];

  const filtered = creators.filter((c) => {
    if (c.id === 'creator-harri-kumar' || c.name.toLowerCase().includes('harri')) return false;
    if (filterRole === 'All') return true;
    const roleLower = filterRole.toLowerCase();
    return (
      c.designation?.toLowerCase().includes(roleLower) ||
      c.specialties?.some(s => s.toLowerCase().includes(roleLower)) ||
      c.bio?.toLowerCase().includes(roleLower)
    );
  });

  return (
    <div id="creators-directory-section" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300 mb-2">
            <Users className="h-3.5 w-3.5" />
            <span>Filmmaker Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Indian Filmmakers & Digital Creators
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Meet the visionary directors, producers, cinematographers, and screenwriters shaping the future of Indian independent short movies.
          </p>
        </div>

        {/* Role filter */}
        <div className="flex flex-wrap gap-1.5">
          {ROLES.map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                filterRole === role
                  ? 'bg-[#f84464] text-white font-bold shadow-md'
                  : 'border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Creators or Empty State */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Users className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No creators found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No registered creators match the selected filter. Register as a creator or brand to be listed in the Indian Short Movie creator network.
          </p>
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-black hover:bg-amber-400"
            >
              <UserCheck className="h-4 w-4" />
              <span>Register as Creator</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((creator) => {
            return (
              <div
                key={creator.id}
                id={`creator-card-${creator.id}`}
                onClick={() => onSelectCreator(creator)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-5 cursor-pointer transition-all hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl"
              >
                <div>
                  {/* Header row */}
                  <div className="flex items-start gap-4">
                    <div className="relative h-16 w-16 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0">
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-white truncate group-hover:text-amber-400">
                          {creator.name}
                        </h3>
                        {creator.isVerified && (
                          <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-amber-300/90 font-medium truncate">{creator.designation}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                        {creator.experienceYears}+ Years Industry Experience
                      </p>
                    </div>
                  </div>

                  {/* Bio snippet */}
                  <p className="mt-3.5 text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {creator.bio}
                  </p>

                  {/* Specialties chips */}
                  {creator.specialties && creator.specialties.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {creator.specialties.slice(0, 3).map((spec, i) => (
                        <span key={i} className="rounded-lg bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-300">
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom stats row */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Film className="h-3 w-3 text-amber-400" />
                      {creator.filmographyCount || 0} Films
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-red-500" />
                      {(creator.totalLikes || 0).toLocaleString()}
                    </span>
                  </div>

                  <span className="font-bold text-amber-400 text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Profile <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
