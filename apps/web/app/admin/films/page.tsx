'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { mockFilms } from '@/lib/mockData';
import { Film } from '@/types';
import { Star, Flame, Sparkles, Check, Trash2, Eye, Edit3, ShieldAlert } from 'lucide-react';

export default function AdminFilmsPage() {
  const [films, setFilms] = useState<Film[]>(mockFilms);

  const toggleFeatured = (id: string) => {
    alert('Toggled Featured status for film ' + id);
  };

  const toggleTrending = (id: string) => {
    alert('Toggled Trending status for film ' + id);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl text-white">Film Catalog Management</h1>
          <p className="text-xs text-cinema-muted">Publish, feature, mark trending, or archive short films</p>
        </div>
      </div>

      <div className="bg-cinema-card rounded-3xl border border-cinema-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cinema-surface border-b border-cinema-border text-cinema-muted uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4">Film</th>
                <th className="p-4">Director</th>
                <th className="p-4">Language</th>
                <th className="p-4">Views / Rating</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cinema-border/50">
              {films.map((film) => (
                <tr key={film.id} className="hover:bg-cinema-surface/50">
                  <td className="p-4 flex items-center gap-3">
                    <div className="relative w-10 h-14 rounded-lg overflow-hidden border border-cinema-border flex-shrink-0">
                      <Image src={film.poster_url} alt={film.title} fill className="object-cover" sizes="40px" />
                    </div>
                    <div>
                      <span className="font-bold text-white block text-sm">{film.title}</span>
                      <span className="text-[11px] text-cinema-muted">{film.release_year} • {film.certificate}</span>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-gray-200">{film.director}</td>
                  <td className="p-4 text-cinema-teal font-semibold">
                    {film.languages?.[0]?.name || 'Hindi'}
                  </td>
                  <td className="p-4">
                    <div className="text-white font-bold">{film.views_count.toLocaleString()} views</div>
                    <div className="text-cinema-gold">★ {film.rating_average.toFixed(1)} ({film.rating_count})</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {film.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleFeatured(film.id)}
                        className="p-2 rounded-lg bg-cinema-surface hover:bg-cinema-gold/20 text-cinema-muted hover:text-cinema-gold border border-cinema-border"
                        title="Toggle Featured"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleTrending(film.id)}
                        className="p-2 rounded-lg bg-cinema-surface hover:bg-cinema-accent/20 text-cinema-muted hover:text-cinema-accent border border-cinema-border"
                        title="Toggle Trending"
                      >
                        <Flame className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
