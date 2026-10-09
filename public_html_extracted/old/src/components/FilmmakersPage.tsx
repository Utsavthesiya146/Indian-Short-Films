import React from 'react';
import { ShieldCheck, MapPin } from 'lucide-react';
import { Creator, ShortFilm } from '../types';

interface FilmmakersPageProps {
  creators: Creator[];
  films: ShortFilm[];
  onSelectCreator: (creator: Creator) => void;
}

export const FilmmakersPage: React.FC<FilmmakersPageProps> = ({
  creators,
  films,
  onSelectCreator
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Header matching https://indian-short-films-lime.vercel.app/filmmakers */}
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-2">
          Independent Filmmakers
        </h1>
        <p className="text-xs sm:text-sm text-cinema-muted">
          Connect with visionary creators crafting original short cinema across India.
        </p>
      </div>

      {/* 3-Column Grid matching reference */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {creators.map((creator) => {
          const creatorFilms = films.filter(
            (f) =>
              f.creatorId === creator.id ||
              f.director.toLowerCase().includes(creator.name.toLowerCase())
          );
          const filmCount = creatorFilms.length || creator.filmographyCount || 1;
          const totalViews = creatorFilms.reduce((acc, f) => acc + (f.viewsCount || 0), 0) || creator.totalViews || 28900;
          const followersCount = creator.followersCount || 1280;

          return (
            <div
              key={creator.id}
              className="bg-cinema-card rounded-3xl p-6 border border-cinema-border space-y-4 hover:border-cinema-gold/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-cinema-border flex-shrink-0 bg-cinema-surface">
                    <img
                      src={creator.avatar || '/harri-kumar.jpg'}
                      alt={creator.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-base text-white">
                        {creator.name}
                      </h3>
                      <ShieldCheck className="w-4 h-4 text-cinema-teal" />
                    </div>
                    <span className="text-xs text-cinema-muted flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-cinema-gold" />
                      <span>{creator.location || 'Bengaluru, Karnataka'}</span>
                    </span>
                  </div>
                </div>

                {/* Bio Excerpt */}
                <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                  {creator.bio}
                </p>

                {/* 3-column stats bar matching reference */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-cinema-border/50 text-center text-xs">
                  <div>
                    <span className="text-cinema-muted block text-[10px]">Films</span>
                    <span className="font-bold text-white">{filmCount}</span>
                  </div>
                  <div>
                    <span className="text-cinema-muted block text-[10px]">Total Views</span>
                    <span className="font-bold text-cinema-gold font-mono">
                      {totalViews.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-cinema-muted block text-[10px]">Followers</span>
                    <span className="font-bold text-cinema-teal font-mono">
                      {followersCount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* View Profile & Films Action Button */}
              <button
                onClick={() => onSelectCreator(creator)}
                className="w-full py-2.5 rounded-xl bg-cinema-surface hover:bg-cinema-border text-xs font-bold text-white border border-cinema-border transition-all cursor-pointer"
              >
                View Profile &amp; Films
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
