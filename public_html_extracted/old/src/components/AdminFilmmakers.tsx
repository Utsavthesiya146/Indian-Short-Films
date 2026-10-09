import React, { useState, useMemo } from 'react';
import { 
  Award, 
  Search, 
  CheckCircle2, 
  ExternalLink, 
  Film, 
  MapPin, 
  Eye, 
  ShieldCheck, 
  PlusCircle, 
  Globe, 
  Phone, 
  Mail,
  UserCheck
} from 'lucide-react';
import { Creator, ShortFilm } from '../types';
import { PlatformStore } from '../services/platformStore';

interface AdminFilmmakersProps {
  creators: Creator[];
  films: ShortFilm[];
  onSelectCreator: (creator: Creator) => void;
  onUpdateCreators: (creators: Creator[]) => void;
  onToast: (msg: string) => void;
}

export const AdminFilmmakers: React.FC<AdminFilmmakersProps> = ({
  creators,
  films,
  onSelectCreator,
  onUpdateCreators,
  onToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all');

  const filteredCreators = useMemo(() => {
    return creators.filter((creator) => {
      const matchesSearch = 
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (creator.location && creator.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (creator.specialties && creator.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesVerified = 
        filterVerified === 'all' ? true :
        filterVerified === 'verified' ? !!creator.isVerified :
        !creator.isVerified;

      return matchesSearch && matchesVerified;
    });
  }, [creators, searchQuery, filterVerified]);

  const handleToggleVerification = (creatorId: string) => {
    const updated = creators.map(c => {
      if (c.id === creatorId) {
        const next = !c.isVerified;
        onToast(`${next ? 'Verified' : 'Unverified'} creator ${c.name}`);
        return { ...c, isVerified: next };
      }
      return c;
    });
    onUpdateCreators(updated);
    PlatformStore.saveCreators(updated);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Filmmaker Directory &amp; Roster
          </h1>
          <p className="text-xs text-cinema-muted mt-1">
            Manage verified Indian directors, digital storytellers, and indie creators
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-cinema-card rounded-2xl p-4 border border-cinema-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search filmmakers by name, handle, or location..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-cinema-surface border border-cinema-border text-xs text-white placeholder-cinema-muted focus:outline-none focus:border-cinema-accent transition-colors"
          />
          <Search className="w-4 h-4 text-cinema-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterVerified}
            onChange={(e) => setFilterVerified(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-cinema-surface border border-cinema-border text-xs text-cinema-muted focus:text-white focus:outline-none focus:border-cinema-accent cursor-pointer w-full sm:w-auto"
          >
            <option value="all">All Filmmakers ({creators.length})</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Pending Verification</option>
          </select>
        </div>
      </div>

      {/* Grid of Creators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCreators.map((creator) => {
          const creatorFilms = films.filter(f => f.creatorId === creator.id || f.director.toLowerCase().includes(creator.name.toLowerCase()));

          return (
            <div
              key={creator.id}
              className="bg-cinema-card rounded-3xl p-6 border border-cinema-border space-y-4 hover:border-cinema-border/80 transition-all flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-4">
                {/* Profile header */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={creator.avatar || '/harri-kumar.jpg'}
                      alt={creator.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-cinema-border bg-cinema-surface"
                    />
                    {creator.isVerified && (
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cinema-accent text-white flex items-center justify-center border-2 border-cinema-card shadow">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-base text-white truncate">
                        {creator.name}
                      </h3>
                    </div>
                    <p className="text-xs text-cinema-teal font-medium truncate">
                      {creator.handle}
                    </p>
                    {creator.location && (
                      <div className="flex items-center gap-1 text-[11px] text-cinema-muted mt-0.5">
                        <MapPin className="w-3 h-3 text-cinema-gold" />
                        <span>{creator.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio Excerpt */}
                <p className="text-xs text-cinema-muted line-clamp-3 leading-relaxed">
                  {creator.bio}
                </p>

                {/* Creator Stats */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-cinema-surface rounded-2xl border border-cinema-border/50 text-center">
                  <div>
                    <span className="text-[10px] text-cinema-muted uppercase tracking-wider block">
                      Catalog Films
                    </span>
                    <span className="text-base font-bold text-white font-mono">
                      {creatorFilms.length || creator.filmographyCount || 1}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-cinema-muted uppercase tracking-wider block">
                      Status
                    </span>
                    <span className={`text-xs font-bold ${creator.isVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {creator.isVerified ? 'Verified Pro' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-cinema-border/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectCreator(creator)}
                  className="px-3.5 py-1.5 rounded-xl bg-cinema-surface hover:bg-cinema-border text-cinema-muted hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-cinema-border"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Profile</span>
                </button>

                <button
                  onClick={() => handleToggleVerification(creator.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    creator.isVerified
                      ? 'bg-cinema-accent/20 text-cinema-accent hover:bg-cinema-accent/30 border border-cinema-accent/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                  }`}
                >
                  {creator.isVerified ? 'Revoke Badge' : 'Verify Director'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
