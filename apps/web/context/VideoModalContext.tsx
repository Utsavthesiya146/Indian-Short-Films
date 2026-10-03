'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Film } from '@/types';
import { X } from 'lucide-react';

interface VideoModalContextType {
  openVideoModal: (film: Film) => void;
  closeVideoModal: () => void;
}

const VideoModalContext = createContext<VideoModalContextType | undefined>(undefined);

export const VideoModalProvider = ({ children }: { children: ReactNode }) => {
  const [activeFilm, setActiveFilm] = useState<Film | null>(null);

  const openVideoModal = (film: Film) => setActiveFilm(film);
  const closeVideoModal = () => setActiveFilm(null);

  return (
    <VideoModalContext.Provider value={{ openVideoModal, closeVideoModal }}>
      {children}
      
      {activeFilm && (
        <div 
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-6"
          onClick={closeVideoModal}
        >
          <div 
            className="bg-cinema-surface border border-cinema-border rounded-3xl max-w-4xl w-full overflow-hidden relative shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeVideoModal}
              className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-cinema-accent border border-cinema-border text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="relative aspect-video bg-black w-full">
              <video 
                controls 
                src={activeFilm.video_url} 
                poster={activeFilm.banner_url || activeFilm.poster_url}
                className="w-full h-full object-contain"
                autoPlay
              />
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-black text-white">
                {activeFilm.title} {activeFilm.languages?.[0]?.name ? `(${activeFilm.languages[0].name} • ${Math.round((activeFilm.duration_seconds || 0) / 60)} mins)` : ''}
              </h3>
              <p className="text-sm text-cinema-muted mt-2 leading-relaxed line-clamp-2">
                {activeFilm.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </VideoModalContext.Provider>
  );
};

export const useVideoModal = () => {
  const context = useContext(VideoModalContext);
  if (context === undefined) {
    throw new Error('useVideoModal must be used within a VideoModalProvider');
  }
  return context;
};
