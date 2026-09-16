'use client';

import React, { useState } from 'react';
import { PlusCircle, Upload, CheckCircle2, Film, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';
import { createSubmission, uploadFilmMedia } from '@/lib/supabase';

export default function SubmitFilmPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    posterUrl: '',
    bannerUrl: '',
    videoUrl: '',
    trailerUrl: '',
    language: 'hi',
    genre: 'drama',
    durationMinutes: '12',
    releaseYear: '2024',
    director: '',
    producer: '',
    cast: '',
    productionHouse: '',
    certificate: 'U',
    contentWarning: '',
  });

  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, bucket: 'film-posters' | 'film-videos', field: 'posterUrl' | 'videoUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (bucket === 'film-posters') setUploadingPoster(true);
    if (bucket === 'film-videos') setUploadingVideo(true);
    setErrorMsg('');

    try {
      const publicUrl = await uploadFilmMedia(bucket, file);
      setFormData(prev => ({ ...prev, [field]: publicUrl }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'File upload failed. Please try again.';
      setErrorMsg(msg);
    } finally {
      if (bucket === 'film-posters') setUploadingPoster(false);
      if (bucket === 'film-videos') setUploadingVideo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await createSubmission({
        title: formData.title,
        description: formData.description,
        poster_url: formData.posterUrl,
        banner_url: formData.bannerUrl || undefined,
        video_url: formData.videoUrl,
        trailer_url: formData.trailerUrl || undefined,
        duration_seconds: parseInt(formData.durationMinutes, 10) * 60,
        release_year: parseInt(formData.releaseYear, 10) || 2024,
        director: formData.director,
        producer: formData.producer || undefined,
        cast_members: formData.cast ? formData.cast.split(',').map(s => ({ name: s.trim(), role: 'Actor' })) : [],
        production_house: formData.productionHouse || undefined,
        certificate: formData.certificate,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit film. Please make sure you are signed in.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 text-cinema-gold bg-cinema-gold/10 border border-cinema-gold/30 px-3 py-1 rounded-full text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FILMMAKER PORTAL</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
          Submit Your Short Film
        </h1>
        <p className="text-xs sm:text-sm text-cinema-muted mt-1">
          Showcase your independent short film to cinema lovers and critics across India.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {submitted ? (
        <div className="bg-cinema-card rounded-3xl p-10 border border-cinema-border text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-white">Submission Received!</h2>
          <p className="text-xs text-cinema-muted max-w-md mx-auto leading-relaxed">
            Your short film <span className="text-white font-semibold">&quot;{formData.title || 'Untitled'}&quot;</span> has been submitted to our moderation panel. You will receive review feedback within 48 hours.
          </p>
          <div className="pt-4">
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  title: '',
                  description: '',
                  posterUrl: '',
                  bannerUrl: '',
                  videoUrl: '',
                  trailerUrl: '',
                  language: 'hi',
                  genre: 'drama',
                  durationMinutes: '12',
                  releaseYear: '2024',
                  director: '',
                  producer: '',
                  cast: '',
                  productionHouse: '',
                  certificate: 'U',
                  contentWarning: '',
                });
              }}
              className="px-6 py-2.5 rounded-xl bg-cinema-surface hover:bg-cinema-border text-white text-xs font-bold border border-cinema-border"
            >
              Submit Another Film
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-cinema-card rounded-3xl p-6 sm:p-8 border border-cinema-border space-y-6">
          
          {/* Section 1: Film Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-cinema-border/60 pb-2">
              1. Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-cinema-muted font-medium block mb-1">Film Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Chai & Stories"
                  className="w-full bg-cinema-surface border border-cinema-border rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cinema-gold"
                />
              </div>

              <div>
                <label className="text-xs text-cinema-muted font-medium block mb-1">Director Name *</label>
                <input
                  type="text"
                  required
                  value={formData.director}
                  onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full bg-cinema-surface border border-cinema-border rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cinema-gold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-cinema-muted font-medium block mb-1">Logline & Description *</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="A brief overview of the plot and themes..."
                className="w-full bg-cinema-surface border border-cinema-border rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-cinema-gold"
              />
            </div>
          </div>

          {/* Section 2: Media URLs */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-cinema-border/60 pb-2">
              2. Media & Video Streaming
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-cinema-muted font-medium block mb-1">Video Stream URL (MP4 / HLS) *</label>
                <div className="space-y-2">
                  <input
                    type="url"
                    required
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://... or upload below"
                    className="w-full bg-cinema-surface border border-cinema-border rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cinema-accent"
                  />
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer text-[11px] font-semibold text-cinema-accent hover:underline flex items-center gap-1">
                      {uploadingVideo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <span>{uploadingVideo ? 'Uploading video...' : 'Upload Video File to Storage'}</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileUpload(e, 'film-videos', 'videoUrl')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-cinema-muted font-medium block mb-1">Poster Image URL *</label>
                <div className="space-y-2">
                  <input
                    type="url"
                    required
                    value={formData.posterUrl}
                    onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                    placeholder="https://... or upload below"
                    className="w-full bg-cinema-surface border border-cinema-border rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cinema-accent"
                  />
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer text-[11px] font-semibold text-cinema-accent hover:underline flex items-center gap-1">
                      {uploadingPoster ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <span>{uploadingPoster ? 'Uploading poster...' : 'Upload Poster Image to Storage'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'film-posters', 'posterUrl')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Metadata */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-cinema-border/60 pb-2">
              3. Language & Certificate
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-cinema-muted font-medium block mb-1">Language</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full bg-cinema-surface border border-cinema-border rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="hi">Hindi</option>
                  <option value="gu">Gujarati</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                  <option value="ml">Malayalam</option>
                  <option value="kn">Kannada</option>
                  <option value="mr">Marathi</option>
                  <option value="bn">Bengali</option>
                  <option value="pa">Punjabi</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-cinema-muted font-medium block mb-1">Genre</label>
                <select
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="w-full bg-cinema-surface border border-cinema-border rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="drama">Drama</option>
                  <option value="thriller">Thriller</option>
                  <option value="comedy">Comedy</option>
                  <option value="romance">Romance</option>
                  <option value="horror">Horror</option>
                  <option value="documentary">Documentary</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-cinema-muted font-medium block mb-1">Duration (Mins)</label>
                <input
                  type="number"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                  className="w-full bg-cinema-surface border border-cinema-border rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-cinema-muted font-medium block mb-1">Certificate</label>
                <select
                  value={formData.certificate}
                  onChange={(e) => setFormData({ ...formData, certificate: e.target.value })}
                  className="w-full bg-cinema-surface border border-cinema-border rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="U">U (Universal)</option>
                  <option value="UA 7+">UA 7+</option>
                  <option value="UA 13+">UA 13+</option>
                  <option value="A">A (Adults)</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || uploadingPoster || uploadingVideo}
            className="w-full py-3.5 rounded-2xl bg-cinema-accent hover:bg-cinema-accentHover text-white text-sm font-bold shadow-lg shadow-cinema-accent/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>{loading ? 'Submitting Film...' : 'Submit Short Film for Review'}</span>
          </button>
        </form>
      )}

    </div>
  );
}

