import React from 'react';
import { Home, Film, Clapperboard, PlusCircle, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User | null;
  onOpenSubmit: () => void;
  onOpenAuth: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onOpenSubmit,
  onOpenAuth
}) => {
  return (
    <nav 
      id="mobile-bottom-navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 pb-[max(env(safe-area-inset-bottom),0.5rem)] backdrop-blur-md lg:hidden shadow-lg"
    >
      <div className="flex h-16 items-center justify-around px-1 max-w-lg mx-auto">
        {/* 1. HOME */}
        <button
          id="bottom-nav-home"
          onClick={() => {
            setCurrentTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex min-h-[48px] min-w-[54px] flex-col items-center justify-center transition-all active:scale-90 ${
            currentTab === 'home' ? 'text-[#f84464] font-bold' : 'text-gray-500 hover:text-gray-800'
          }`}
          aria-label="Home"
        >
          <Home className={`h-5 w-5 ${currentTab === 'home' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-1 font-medium tracking-tight">HOME</span>
        </button>

        {/* 2. MOVIES */}
        <button
          id="bottom-nav-movies"
          onClick={() => {
            setCurrentTab('movies');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex min-h-[48px] min-w-[54px] flex-col items-center justify-center transition-all active:scale-90 ${
            currentTab === 'movies' ? 'text-[#f84464] font-bold' : 'text-gray-500 hover:text-gray-800'
          }`}
          aria-label="Movies"
        >
          <Film className={`h-5 w-5 ${currentTab === 'movies' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-1 font-medium tracking-tight">MOVIES</span>
        </button>

        {/* 3. SHORT FILMS */}
        <button
          id="bottom-nav-short-films"
          onClick={() => {
            setCurrentTab('short-films');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex min-h-[48px] min-w-[54px] flex-col items-center justify-center transition-all active:scale-90 ${
            currentTab === 'short-films' ? 'text-[#f84464] font-bold' : 'text-gray-500 hover:text-gray-800'
          }`}
          aria-label="Short Films"
        >
          <Clapperboard className={`h-5 w-5 ${currentTab === 'short-films' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-1 font-medium tracking-tight whitespace-nowrap">SHORT FILMS</span>
        </button>

        {/* 4. SUBMIT FILM */}
        <button
          id="bottom-nav-submit"
          onClick={onOpenSubmit}
          className="flex min-h-[48px] min-w-[54px] flex-col items-center justify-center text-gray-700 transition-all active:scale-90"
          aria-label="Submit Short Film"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f84464] shadow-md shadow-[#f84464]/30">
            <PlusCircle className="h-5 w-5 text-white stroke-[2.5]" />
          </div>
          <span className="text-[10px] mt-0.5 font-bold text-[#f84464]">SUBMIT</span>
        </button>

        {/* 5. MY ACCOUNT */}
        <button
          id="bottom-nav-account"
          onClick={() => {
            if (currentUser) {
              setCurrentTab('profile');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              onOpenAuth();
            }
          }}
          className={`flex min-h-[48px] min-w-[54px] flex-col items-center justify-center transition-all active:scale-90 ${
            currentTab === 'profile' || currentTab === 'admin' ? 'text-[#f84464] font-bold' : 'text-gray-500 hover:text-gray-800'
          }`}
          aria-label="My Account"
        >
          <UserIcon className={`h-5 w-5 ${currentTab === 'profile' || currentTab === 'admin' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-1 font-medium tracking-tight whitespace-nowrap">ACCOUNT</span>
        </button>
      </div>
    </nav>
  );
};
