'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toggleFollowFilmmaker, checkUserFollowsFilmmaker } from '@/lib/supabase';

interface FollowButtonProps {
  directorName: string;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ directorName }) => {
  const router = useRouter();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadFollowState() {
      const isFollowing = await checkUserFollowsFilmmaker(directorName);
      setFollowing(isFollowing);
    }
    loadFollowState();
  }, [directorName]);

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      const isNowFollowing = await toggleFollowFilmmaker(directorName);
      setFollowing(isNowFollowing);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Please sign in to follow filmmakers.');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      className={`w-full py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
        following
          ? 'bg-cinema-teal/10 border-cinema-teal/40 text-cinema-teal'
          : 'bg-cinema-surface hover:bg-cinema-border text-white border-cinema-border'
      }`}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : following ? (
        <>
          <UserCheck className="w-3.5 h-3.5 text-cinema-teal" /> Following Filmmaker
        </>
      ) : (
        <>
          <UserPlus className="w-3.5 h-3.5" /> Follow Filmmaker
        </>
      )}
    </button>
  );
};
