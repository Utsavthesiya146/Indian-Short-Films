import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Film, 
  Mail, 
  LogOut, 
  Search, 
  Trash2, 
  Plus, 
  CheckCircle, 
  Clock, 
  Star, 
  Eye, 
  Heart, 
  ExternalLink, 
  Play, 
  ArrowUpRight, 
  Filter, 
  Sparkles, 
  ChevronRight,
  Menu,
  X,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { ShortFilm, ContactMessage, IndianLanguage, FilmGenre } from '../types';
import { PlatformStore } from '../services/platformStore';
import { IndianShortMovieLogo } from './Navbar';

interface AdminPortalProps {
  films: ShortFilm[];
  onUpdateFilms: (films: ShortFilm[]) => void;
  onSelectFilm: (film: ShortFilm) => void;
  onLogout: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  films,
  onUpdateFilms,
  onSelectFilm,
  onLogout
}) => {
  // Only 5 sections: dashboard | upload | projects | messages | logout
  const [activeSection, setActiveSection] = useState<'dashboard' | 'upload' | 'projects' | 'messages'>('dashboard');
  const [messages, setMessages] = useState<ContactMessage[]>(() => PlatformStore.getMessages());
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Upload Media Form State
  const [uploadForm, setUploadForm] = useState({
    title: '',
    director: '',
    language: 'Kannada' as IndianLanguage,
    genre: 'Drama' as FilmGenre,
    duration: '15 mins',
    videoUrl: '/videos/sample-film-2.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    synopsis: '',
    isFeatured: false
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleFeature = (filmId: string) => {
    const updated = films.map(f => f.id === filmId ? { ...f, isFeatured: !f.isFeatured } : f);
    onUpdateFilms(updated);
    PlatformStore.saveFilms(updated);
    showToast('Featured status updated successfully');
  };

  const handleToggleStatus = (filmId: string) => {
    const updated = films.map(f => {
      if (f.id === filmId) {
        const nextStatus = f.status === 'approved' ? 'pending' : 'approved';
        return { ...f, status: nextStatus };
      }
      return f;
    });
    onUpdateFilms(updated);
    PlatformStore.saveFilms(updated);
    showToast('Project status updated');
  };

  const handleDeleteFilm = (filmId: string) => {
    if (confirm('Are you sure you want to remove this project?')) {
      PlatformStore.deleteFilm(filmId);
      const updated = films.filter(f => f.id !== filmId);
      onUpdateFilms(updated);
      showToast('Project removed');
    }
  };

  const handleMarkMessageRead = (id: string) => {
    PlatformStore.markMessageRead(id);
    setMessages(PlatformStore.getMessages());
  };

  const handleDeleteMessage = (id: string) => {
    PlatformStore.deleteMessage(id);
    setMessages(PlatformStore.getMessages());
    showToast('Message removed');
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title || !uploadForm.director) {
      showToast('Please provide Title and Director');
      return;
    }

    const newFilm: ShortFilm = {
      id: `film-${Date.now()}`,
      title: uploadForm.title,
      director: uploadForm.director,
      language: uploadForm.language,
      genre: uploadForm.genre,
      duration: uploadForm.duration,
      durationSeconds: parseInt(uploadForm.duration, 10) * 60 || 900,
      videoUrl: uploadForm.videoUrl || '/videos/sample-film-2.mp4',
      posterUrl: uploadForm.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
      backdropUrl: uploadForm.posterUrl,
      description: uploadForm.synopsis.slice(0, 80) || 'Independent short film screener.',
      synopsis: uploadForm.synopsis || 'An independent Indian short cinema project exploring modern relationships, traditions, and human connections.',
      category: 'Short Film',
      cast: [uploadForm.director],
      creatorId: 'creator-harri-kumar',
      creatorName: 'Harri Kumar Productions',
      creatorAvatar: '/harri-kumar.jpg',
      releaseYear: 2026,
      viewsCount: 0,
      likesCount: 0,
      rating: 4.9,
      reviewsCount: 0,
      isFeatured: uploadForm.isFeatured,
      isNewRelease: true,
      status: 'approved',
      tags: ['Short Film', uploadForm.genre, uploadForm.language],
      submittedAt: new Date().toISOString()
    };

    const updated = [newFilm, ...films];
    onUpdateFilms(updated);
    PlatformStore.saveFilms(updated);
    showToast('New project published successfully!');
    // Reset form & navigate to manage
    setUploadForm({
      title: '',
      director: '',
      language: 'Kannada',
      genre: 'Drama',
      duration: '15 mins',
      videoUrl: '/videos/sample-film-2.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
      synopsis: '',
      isFeatured: false
    });
    setActiveSection('projects');
  };

  // Filtered films for Manage Projects
  const filteredFilms = films.filter(f => {
    const matchesSearch = searchQuery === '' || 
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.language.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = genreFilter === 'All' || f.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  const totalViews = films.reduce((acc, f) => acc + (f.viewsCount || 0), 0);
  const pendingCount = films.filter(f => f.status === 'pending').length;
  const unreadMessagesCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row antialiased">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 rounded-2xl bg-purple-600 border border-purple-400 px-5 py-3 text-sm font-bold text-white shadow-2xl animate-fade-in flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0a0a0f] border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 border border-white/10"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <IndianShortMovieLogo isMobile />
        </div>
        <button
          onClick={onLogout}
          className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Exit</span>
        </button>
      </header>

      {/* Left Navigation Sidebar (Only 5 options: Dashboard, Upload Media, Manage Projects, Contact Messages, Logout) */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#08080e] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand & Admin Label */}
        <div className="p-6 border-b border-white/5">
          <div className="cursor-pointer" onClick={() => setActiveSection('dashboard')}>
            <IndianShortMovieLogo isMobile={false} />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-black text-purple-400 px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20">
              Admin Portal
            </span>
            <span className="text-[11px] text-gray-400">Minimal Console</span>
          </div>
        </div>

        {/* 4 Main Section Tabs */}
        <nav className="p-4 space-y-1.5 flex-1">
          <button
            onClick={() => { setActiveSection('dashboard'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'dashboard'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </div>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-black font-extrabold">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveSection('upload'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'upload'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <UploadCloud className="h-4 w-4" />
              <span>Upload Media</span>
            </div>
            <Plus className="h-3.5 w-3.5 opacity-60" />
          </button>

          <button
            onClick={() => { setActiveSection('projects'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'projects'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <Film className="h-4 w-4" />
              <span>Manage Projects</span>
            </div>
            <span className="text-[11px] opacity-70 font-normal">{films.length}</span>
          </button>

          <button
            onClick={() => { setActiveSection('messages'); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'messages'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4" />
              <span>Contact Messages</span>
            </div>
            {unreadMessagesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-extrabold">
                {unreadMessagesCount}
              </span>
            )}
          </button>
        </nav>

        {/* 5. Logout Option (Clean, minimal) */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout to Website</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 max-w-7xl">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            <h1 className="cinematic-title text-2xl sm:text-3xl font-black text-white capitalize">
              {activeSection === 'dashboard' && 'Dashboard Overview'}
              {activeSection === 'upload' && 'Upload New Project Media'}
              {activeSection === 'projects' && 'Manage Films & Projects'}
              {activeSection === 'messages' && 'Contact Inquiries & Pitches'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Indian Short Movie • Streamlined Control Panel
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeSection !== 'upload' && (
              <button
                onClick={() => setActiveSection('upload')}
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-purple-500 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>+ Upload Media</span>
              </button>
            )}
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span>Back to Home</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* SECTION 1: DASHBOARD */}
        {activeSection === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* 4 Minimal Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 space-y-2">
                <div className="flex items-center justify-between text-purple-400">
                  <Film className="h-5 w-5" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Live Catalog</span>
                </div>
                <p className="text-3xl font-black text-white tabular-nums">{films.length}</p>
                <p className="text-xs text-gray-400">Total Curated Projects</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 space-y-2">
                <div className="flex items-center justify-between text-blue-400">
                  <Eye className="h-5 w-5" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Total Streams</span>
                </div>
                <p className="text-3xl font-black text-white tabular-nums">{totalViews.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Aggregated Views</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 space-y-2">
                <div className="flex items-center justify-between text-amber-400">
                  <Clock className="h-5 w-5" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Review Queue</span>
                </div>
                <p className="text-3xl font-black text-white tabular-nums">{pendingCount}</p>
                <p className="text-xs text-gray-400">Pending Review</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 space-y-2">
                <div className="flex items-center justify-between text-rose-400">
                  <Mail className="h-5 w-5" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Inbound</span>
                </div>
                <p className="text-3xl font-black text-white tabular-nums">{messages.length}</p>
                <p className="text-xs text-gray-400">{unreadMessagesCount} Unread Inquiries</p>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="rounded-3xl border border-purple-500/20 bg-purple-950/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-bold text-base text-white">Have a new screener or filmmaker cut?</h3>
                <p className="text-xs text-gray-400">Publish high-definition short films directly into the streaming catalog.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveSection('upload')}
                  className="rounded-2xl bg-purple-600 px-6 py-3 text-xs font-bold text-white shadow-lg hover:bg-purple-500 transition-all cursor-pointer"
                >
                  Upload Film Now
                </button>
                <button
                  onClick={() => setActiveSection('projects')}
                  className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-xs font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  Manage All
                </button>
              </div>
            </div>

            {/* Recent Projects Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Recent Cinema Catalog</h3>
                <button 
                  onClick={() => setActiveSection('projects')}
                  className="text-xs text-purple-400 font-bold hover:underline flex items-center gap-1"
                >
                  View all ({films.length}) <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-4">Project</th>
                        <th className="p-4">Director</th>
                        <th className="p-4">Language / Genre</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                      {films.slice(0, 6).map((film) => (
                        <tr key={film.id} className="hover:bg-white/[0.03] transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={film.posterUrl}
                              alt={film.title}
                              className="h-10 w-8 rounded-lg object-cover bg-neutral-900 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-white line-clamp-1">{film.title}</p>
                              <span className="text-[10px] text-gray-400">{film.duration}</span>
                            </div>
                          </td>
                          <td className="p-4">{film.director}</td>
                          <td className="p-4">
                            <span className="font-semibold text-purple-400">{film.language}</span>
                            <span className="text-gray-500 text-[11px] block">{film.genre}</span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleStatus(film.id)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                                film.status === 'approved'
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {film.status || 'Approved'}
                            </button>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleToggleFeature(film.id)}
                              title="Toggle Spotlight Feature"
                              className={`p-1.5 rounded-lg border transition-colors ${
                                film.isFeatured
                                  ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400'
                                  : 'border-white/10 text-gray-400 hover:text-white'
                              }`}
                            >
                              <Star className="h-3.5 w-3.5 fill-current" />
                            </button>
                            <button
                              onClick={() => onSelectFilm(film)}
                              title="Watch / Preview"
                              className="p-1.5 rounded-lg border border-white/10 text-gray-300 hover:text-purple-400 hover:border-purple-500/30"
                            >
                              <Play className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteFilm(film.id)}
                              title="Delete Film"
                              className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/30"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: UPLOAD MEDIA */}
        {activeSection === 'upload' && (
          <div className="max-w-4xl space-y-6 animate-fade-in">
            <form 
              onSubmit={handleUploadSubmit}
              className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl p-6 sm:p-8 space-y-6"
            >
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xl font-black text-white">Publish New Film or Media Cut</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Add project details, HD video stream URL, poster artwork, and publish directly to the live catalog.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    placeholder="e.g. The Midnight Chai"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs sm:text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Director / Creator Name *</label>
                  <input
                    type="text"
                    required
                    value={uploadForm.director}
                    onChange={(e) => setUploadForm({ ...uploadForm, director: e.target.value })}
                    placeholder="e.g. Harri Kumar & Raghavendra"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs sm:text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Language</label>
                  <select
                    value={uploadForm.language}
                    onChange={(e) => setUploadForm({ ...uploadForm, language: e.target.value as IndianLanguage })}
                    className="w-full rounded-2xl border border-white/10 bg-[#0c0c16] px-4 py-3 text-xs sm:text-sm text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Kannada">Kannada</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Malayalam">Malayalam</option>
                    <option value="Bengali">Bengali</option>
                    <option value="Marathi">Marathi</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Genre</label>
                  <select
                    value={uploadForm.genre}
                    onChange={(e) => setUploadForm({ ...uploadForm, genre: e.target.value as FilmGenre })}
                    className="w-full rounded-2xl border border-white/10 bg-[#0c0c16] px-4 py-3 text-xs sm:text-sm text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Drama">Drama</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Folk Folklore">Folk Folklore</option>
                    <option value="Documentary">Documentary</option>
                    <option value="Indie Experimental">Indie Experimental</option>
                    <option value="Romance">Romance</option>
                    <option value="Action">Action</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Duration (e.g. 15 mins)</label>
                  <input
                    type="text"
                    value={uploadForm.duration}
                    onChange={(e) => setUploadForm({ ...uploadForm, duration: e.target.value })}
                    placeholder="e.g. 14 mins"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs sm:text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Video Link / File URL</label>
                  <input
                    type="text"
                    value={uploadForm.videoUrl}
                    onChange={(e) => setUploadForm({ ...uploadForm, videoUrl: e.target.value })}
                    placeholder="/videos/sample-film-2.mp4"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs sm:text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Poster / Thumbnail Artwork URL</label>
                <input
                  type="text"
                  value={uploadForm.posterUrl}
                  onChange={(e) => setUploadForm({ ...uploadForm, posterUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs sm:text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Synopsis / Story Summary</label>
                <textarea
                  rows={4}
                  value={uploadForm.synopsis}
                  onChange={(e) => setUploadForm({ ...uploadForm, synopsis: e.target.value })}
                  placeholder="Describe the story, premise, and characters..."
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs sm:text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={uploadForm.isFeatured}
                  onChange={(e) => setUploadForm({ ...uploadForm, isFeatured: e.target.checked })}
                  className="h-4 w-4 rounded accent-purple-600"
                />
                <label htmlFor="featuredToggle" className="text-xs font-semibold text-gray-300 cursor-pointer">
                  Feature in Spotlight / Home Carousel
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveSection('projects')}
                  className="rounded-2xl border border-white/10 px-5 py-3 text-xs font-bold text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-7 py-3 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:scale-105 transition-all cursor-pointer"
                >
                  Publish Film to Catalog
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SECTION 3: MANAGE PROJECTS */}
        {activeSection === 'projects' && (
          <div className="space-y-6 animate-fade-in">
            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search project title, director, language..."
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-11 pr-4 py-2.5 text-xs sm:text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="rounded-2xl border border-white/10 bg-[#0c0c16] px-4 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none shrink-0"
              >
                <option value="All">All Genres</option>
                <option value="Drama">Drama</option>
                <option value="Thriller">Thriller</option>
                <option value="Comedy">Comedy</option>
                <option value="Folk Folklore">Folk Folklore</option>
                <option value="Documentary">Documentary</option>
              </select>
            </div>

            {/* Projects Table / Card Grid */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                    <tr>
                      <th className="p-4">Film & Poster</th>
                      <th className="p-4">Director</th>
                      <th className="p-4">Language / Genre</th>
                      <th className="p-4">Streams</th>
                      <th className="p-4">Spotlight</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    {filteredFilms.map((film) => (
                      <tr key={film.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={film.posterUrl}
                            alt={film.title}
                            className="h-12 w-9 rounded-lg object-cover bg-neutral-900 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-white text-sm line-clamp-1">{film.title}</p>
                            <p className="text-[11px] text-gray-400">{film.duration}</p>
                          </div>
                        </td>
                        <td className="p-4 font-medium">{film.director}</td>
                        <td className="p-4">
                          <span className="text-purple-400 font-bold">{film.language}</span>
                          <span className="text-gray-500 text-[11px] block">{film.genre}</span>
                        </td>
                        <td className="p-4 tabular-nums">{(film.viewsCount || 0).toLocaleString()}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleFeature(film.id)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              film.isFeatured
                                ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400'
                                : 'border-white/10 bg-white/5 text-gray-400'
                            }`}
                          >
                            <Star className="h-3 w-3 fill-current" />
                            <span>{film.isFeatured ? 'Featured' : 'Standard'}</span>
                          </button>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleStatus(film.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                              film.status === 'approved'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {film.status || 'Approved'}
                          </button>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => onSelectFilm(film)}
                            title="Watch Film"
                            className="p-2 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-purple-500/50"
                          >
                            <Play className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteFilm(film.id)}
                            title="Remove Film"
                            className="p-2 rounded-xl border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: CONTACT MESSAGES */}
        {activeSection === 'messages' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Inbound Messages & Project Pitches</h3>
                <p className="text-xs text-gray-400">Direct inquiries received from the Contact page and filmmakers.</p>
              </div>
              <span className="text-xs font-bold text-purple-400 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                {messages.length} Total Messages
              </span>
            </div>

            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-3xl border p-6 transition-all space-y-3 ${
                    msg.status === 'unread'
                      ? 'border-purple-500/40 bg-purple-950/10 shadow-lg shadow-purple-500/5'
                      : 'border-white/10 bg-white/[0.02]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 font-bold">
                        {msg.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{msg.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>{msg.email}</span>
                          {msg.phone && <span>• {msg.phone}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-400">{msg.createdAt}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-purple-300">
                        {msg.category}
                      </span>
                    </div>
                  </div>

                  {msg.projectTitle && (
                    <p className="text-xs font-bold text-purple-300">
                      Project Pitch: <span className="text-white font-normal">{msg.projectTitle}</span>
                    </p>
                  )}

                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    {msg.message}
                  </p>

                  {msg.screenerUrl && (
                    <div className="pt-2">
                      <a 
                        href={msg.screenerUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-purple-400 font-bold hover:underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>View Provided Screener Link</span>
                      </a>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                    {msg.status === 'unread' && (
                      <button
                        onClick={() => handleMarkMessageRead(msg.id)}
                        className="text-xs text-purple-400 hover:text-purple-300 font-bold cursor-pointer"
                      >
                        Mark as Read
                      </button>
                    )}
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.projectTitle || 'Indian Short Movie Collaboration')}`}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors"
                    >
                      Reply via Email
                    </a>
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {messages.length === 0 && (
                <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center text-gray-400">
                  <Mail className="h-10 w-10 text-gray-600 mx-auto mb-2" />
                  <p className="text-white font-bold">No messages found</p>
                  <p className="text-xs">Incoming submissions from the Contact form will appear here.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
