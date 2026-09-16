import React from 'react';
import Image from 'next/image';
import { Clapperboard, MapPin, Eye, Users, ShieldCheck } from 'lucide-react';

const mockFilmmakerDirectory = [
  {
    id: 'fm-1',
    name: 'Aarav Sharma',
    location: 'Mumbai, Maharashtra',
    bio: 'Independent director focusing on urban human connections and slice-of-life drama.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    filmsCount: 6,
    totalViews: 42500,
    followers: 1280,
  },
  {
    id: 'fm-2',
    name: 'Devang Patel',
    location: 'Ahmedabad, Gujarat',
    bio: 'Nostalgic Gujarati storyteller bringing vintage heritage tales to modern streaming screens.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    filmsCount: 4,
    totalViews: 28900,
    followers: 940,
  },
  {
    id: 'fm-3',
    name: 'Karthik Raja',
    location: 'Chennai, Tamil Nadu',
    bio: 'Pioneer of Tamil psychological horror & edge-of-the-seat urban thrillers.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    filmsCount: 8,
    totalViews: 68100,
    followers: 2450,
  },
];

export default function FilmmakersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-2">
          Independent Filmmakers
        </h1>
        <p className="text-xs sm:text-sm text-cinema-muted">
          Connect with visionary creators crafting original short cinema across India.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockFilmmakerDirectory.map((fm) => (
          <div key={fm.id} className="bg-cinema-card rounded-3xl p-6 border border-cinema-border space-y-4 hover:border-cinema-gold/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-cinema-border flex-shrink-0">
                <Image src={fm.avatar} alt={fm.name} fill className="object-cover" sizes="64px" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-base text-white">{fm.name}</h3>
                  <ShieldCheck className="w-4 h-4 text-cinema-teal" />
                </div>
                <span className="text-xs text-cinema-muted flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-cinema-gold" /> {fm.location}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">{fm.bio}</p>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-cinema-border/50 text-center text-xs">
              <div>
                <span className="text-cinema-muted block text-[10px]">Films</span>
                <span className="font-bold text-white">{fm.filmsCount}</span>
              </div>
              <div>
                <span className="text-cinema-muted block text-[10px]">Total Views</span>
                <span className="font-bold text-cinema-gold">{fm.totalViews.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-cinema-muted block text-[10px]">Followers</span>
                <span className="font-bold text-cinema-teal">{fm.followers}</span>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-cinema-surface hover:bg-cinema-border text-xs font-bold text-white border border-cinema-border transition-all">
              View Profile & Films
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
