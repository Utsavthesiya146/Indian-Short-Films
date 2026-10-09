import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Film, 
  Clapperboard, 
  Image as ImageIcon, 
  Check, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  FileText,
  Building,
  Users,
  Video,
  Info
} from 'lucide-react';
import { ShortFilm, FilmGenre, IndianLanguage, User } from '../types';
import { storeMediaBlob, PlatformStore } from '../services/platformStore';

interface SubmitFilmModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onFilmSubmitted: (film: ShortFilm) => void;
  onRequireAuth: () => void;
}

const GENRES: FilmGenre[] = [
  'Drama',
  'Thriller',
  'Mystery',
  'Comedy',
  'Romance',
  'Action',
  'Sci-Fi',
  'Folk Folklore',
  'Documentary',
  'Indie Experimental'
];

const LANGUAGES: IndianLanguage[] = [
  'Hindi',
  'Kannada',
  'Tamil',
  'Telugu',
  'Malayalam',
  'Bengali',
  'Marathi',
  'Punjabi',
  'English'
];

export const SubmitFilmModal: React.FC<SubmitFilmModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onFilmSubmitted,
  onRequireAuth
}) => {
  // Required submission fields
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [logline, setLogline] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [script, setScript] = useState('');
  const [genre, setGenre] = useState<FilmGenre>('Drama');
  const [language, setLanguage] = useState<IndianLanguage>('Hindi');
  const [durationStr, setDurationStr] = useState('12 mins');
  const [durationSecs, setDurationSecs] = useState(720);
  const [director, setDirector] = useState(currentUser?.name || '');
  const [producer, setProducer] = useState(currentUser?.brandName || '');
  const [castStr, setCastStr] = useState('');
  const [crew, setCrew] = useState('');
  const [productionHouse, setProductionHouse] = useState(currentUser?.brandName || '');
  const [releaseYear, setReleaseYear] = useState<number>(new Date().getFullYear());
  const [tagsStr, setTagsStr] = useState('IndianCinema, IndieShorts');
  const [contentType, setContentType] = useState<'short_film' | 'movie'>('short_film');

  // Media state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoSourceMode, setVideoSourceMode] = useState<'file' | 'url'>('file');
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterUrl, setPosterUrl] = useState<string>('');
  const [posterSourceMode, setPosterSourceMode] = useState<'file' | 'url'>('file');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const hiddenVideoRef = useRef<HTMLVideoElement | null>(null);

  if (!isOpen) return null;

  // Handle Video file
  const handleVideoFileChange = (file: File) => {
    if (!file.type.startsWith('video/')) {
      setErrorMessage('Please select a valid video file (MP4, WebM, MOV).');
      return;
    }
    setVideoFile(file);
    setErrorMessage(null);

    // Auto calculate duration
    try {
      const tempUrl = URL.createObjectURL(file);
      const tempVid = document.createElement('video');
      tempVid.preload = 'metadata';
      tempVid.src = tempUrl;
      tempVid.onloadedmetadata = () => {
        const sec = Math.round(tempVid.duration);
        setDurationSecs(sec);
        const mins = Math.floor(sec / 60);
        const remainingSec = sec % 60;
        setDurationStr(`${mins}m ${remainingSec}s`);
        URL.revokeObjectURL(tempUrl);
      };
    } catch {
      // ignore
    }
  };

  // Handle Poster file
  const handlePosterFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }
    setPosterFile(file);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Film title is required.');
      return;
    }

    if (videoSourceMode === 'file' && !videoFile) {
      setErrorMessage('Please select a video file or provide a video URL.');
      return;
    }
    if (videoSourceMode === 'url' && !videoUrl.trim()) {
      setErrorMessage('Please enter a valid video streaming URL.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setProcessingStatus('Securing media files into local database...');

    try {
      const submissionId = `film-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

      // 1. Process Video
      let finalVideoUrl = videoUrl.trim();
      if (videoSourceMode === 'file' && videoFile) {
        setProcessingStatus('Storing master video in IndexedDB storage...');
        finalVideoUrl = await storeMediaBlob(`vid-${submissionId}`, videoFile);
      }

      // 2. Process Poster
      let finalPosterUrl = posterUrl.trim();
      if (posterSourceMode === 'file' && posterFile) {
        setProcessingStatus('Storing promotional poster...');
        finalPosterUrl = await storeMediaBlob(`poster-${submissionId}`, posterFile);
      } else if (!finalPosterUrl) {
        finalPosterUrl = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80';
      }

      // 3. Prepare cast array
      const castArray = castStr
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      // 4. Prepare tags
      const tagsArray = tagsStr
        .split(',')
        .map(t => t.trim().replace(/^#/, ''))
        .filter(t => t.length > 0);

      // 5. Construct ShortFilm submission
      // Strict rule: Status is ALWAYS 'pending' for clients!
      const newSubmission: ShortFilm = {
        id: submissionId,
        title: title.trim(),
        description: caption.trim() || synopsis.trim(),
        synopsis: synopsis.trim(),
        logline: logline.trim(),
        script: script.trim(),
        videoUrl: finalVideoUrl,
        posterUrl: finalPosterUrl,
        backdropUrl: finalPosterUrl,
        duration: durationStr,
        durationSeconds: durationSecs,
        genre,
        language,
        category: 'Short Film',
        contentType,
        director: director.trim() || currentUser?.name || 'Independent Filmmaker',
        producer: producer.trim(),
        cast: castArray,
        crew: crew.trim(),
        productionHouse: productionHouse.trim(),
        creatorId: currentUser?.id || 'guest-filmmaker',
        creatorName: currentUser?.name || 'Independent Filmmaker',
        creatorAvatar: currentUser?.avatar || '/harri-kumar.jpg',
        releaseYear: releaseYear || new Date().getFullYear(),
        viewsCount: 0,
        likesCount: 0,
        rating: 0,
        reviewsCount: 0,
        status: 'pending', // Awaiting Admin Approval
        tags: tagsArray,
        submittedAt: new Date().toISOString()
      };

      // Save into platform store
      const allFilms = PlatformStore.getFilms();
      allFilms.unshift(newSubmission);
      PlatformStore.saveFilms(allFilms);

      // Create Admin Notification
      PlatformStore.addNotification({
        userId: 'user-admin-ism',
        type: 'status_update',
        title: 'New Film Submission',
        message: `"${title}" was submitted by ${currentUser?.name || 'a filmmaker'} for review.`,
        targetId: submissionId
      });

      onFilmSubmitted(newSubmission);
      setIsProcessing(false);
      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setIsProcessing(false);
      setErrorMessage(err.message || 'Failed to submit film. Please try again.');
    }
  };

  return (
    <div 
      id="submit-film-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-2 sm:p-4 md:p-6 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col text-[#222222]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f84464] shadow-sm">
              <Clapperboard className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#222222] flex items-center gap-2">
                <span>SUBMIT SHORT FILM / MOVIE</span>
                <span className="rounded-full bg-[#f84464]/10 px-2 py-0.5 text-[10px] font-bold text-[#f84464] border border-[#f84464]/20">
                  Curator Review
                </span>
              </h2>
              <p className="text-xs text-gray-500">
                Official submission gateway for filmmakers, creators, and production houses
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:text-black hover:bg-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Success Banner */}
          {isSuccess ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#222222]">🎬 Submission Successfully Received!</h3>
                <p className="text-xs sm:text-sm text-gray-700 max-w-md mx-auto leading-relaxed">
                  Your film <span className="text-[#f84464] font-bold">"{title}"</span> has been submitted to the curation board with status <span className="font-bold text-[#f84464]">Pending Review</span>.
                </p>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Our platform administrators will review the poster, video master, synopsis, and metadata. You can monitor the approval status anytime in your filmmaker account.
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="rounded-lg bg-[#f84464] hover:bg-[#e03352] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-transform hover:scale-105"
                >
                  Done & Back to Platform
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Submission workflow advisory */}
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3.5 flex items-start gap-3 text-xs text-blue-900">
                <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-blue-950">Admin Approval Workflow:</strong> All submissions undergo review before public publication. Only approved films will appear on the OTT homepage and browsing catalogs.
                </p>
              </div>

              {errorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 flex items-center gap-3 text-xs text-red-600">
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Core Metadata: Title, Type, Year */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8 space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    Film Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Kaveri The Hidden Current"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-[#222222] placeholder-gray-400 focus:bg-white focus:border-[#f84464] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="text-xs font-bold text-gray-700">Format</label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value as any)}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-[#222222] focus:bg-white focus:border-[#f84464] focus:outline-none"
                  >
                    <option value="short_film">Short Film</option>
                    <option value="movie">Indie Feature / Movie</option>
                  </select>
                </div>
              </div>

              {/* 2. Media Upload: Master Video & Poster */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Video Upload */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#222222] flex items-center gap-1.5">
                      <Video className="h-3.5 w-3.5 text-[#f84464]" />
                      <span>Master Video <span className="text-red-500">*</span></span>
                    </label>
                    <div className="flex rounded-md bg-white border border-gray-200 p-0.5 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setVideoSourceMode('file')}
                        className={`rounded px-2 py-0.5 font-semibold ${videoSourceMode === 'file' ? 'bg-[#f84464] text-white' : 'text-gray-600'}`}
                      >
                        File Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoSourceMode('url')}
                        className={`rounded px-2 py-0.5 font-semibold ${videoSourceMode === 'url' ? 'bg-[#f84464] text-white' : 'text-gray-600'}`}
                      >
                        Web URL
                      </button>
                    </div>
                  </div>

                  {videoSourceMode === 'file' ? (
                    <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-4 text-center cursor-pointer hover:border-[#f84464] transition-colors">
                      <Upload className="h-6 w-6 text-[#f84464] mb-1" />
                      <span className="text-xs font-semibold text-gray-700">
                        {videoFile ? videoFile.name : 'Choose Video (MP4, MOV, WebM)'}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-1">Direct upload to local storage</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => e.target.files?.[0] && handleVideoFileChange(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://commondatastorage.googleapis.com/.../movie.mp4"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-[#222222] placeholder-gray-400 focus:border-[#f84464] focus:outline-none"
                    />
                  )}
                </div>

                {/* Poster Upload */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#222222] flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5 text-[#f84464]" />
                      <span>Promotional Poster</span>
                    </label>
                    <div className="flex rounded-md bg-white border border-gray-200 p-0.5 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setPosterSourceMode('file')}
                        className={`rounded px-2 py-0.5 font-semibold ${posterSourceMode === 'file' ? 'bg-[#f84464] text-white' : 'text-gray-600'}`}
                      >
                        File Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setPosterSourceMode('url')}
                        className={`rounded px-2 py-0.5 font-semibold ${posterSourceMode === 'url' ? 'bg-[#f84464] text-white' : 'text-gray-600'}`}
                      >
                        Web URL
                      </button>
                    </div>
                  </div>

                  {posterSourceMode === 'file' ? (
                    <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-4 text-center cursor-pointer hover:border-[#f84464] transition-colors">
                      <ImageIcon className="h-6 w-6 text-[#f84464] mb-1" />
                      <span className="text-xs font-semibold text-gray-700">
                        {posterFile ? posterFile.name : 'Choose Poster (JPG, PNG)'}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-1">2:3 vertical or 16:9 recommended</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handlePosterFileChange(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <input
                      type="url"
                      value={posterUrl}
                      onChange={(e) => setPosterUrl(e.target.value)}
                      placeholder="https://example.com/poster.jpg"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-[#222222] placeholder-gray-400 focus:border-[#f84464] focus:outline-none"
                    />
                  )}
                </div>
              </div>

              {/* 3. Logline & Caption */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    Logline / Catchy Hook
                  </label>
                  <input
                    type="text"
                    value={logline}
                    onChange={(e) => setLogline(e.target.value)}
                    placeholder="One-sentence hook summarizing the central conflict"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs text-[#222222] placeholder-gray-400 focus:bg-white focus:border-[#f84464] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    Short Caption
                  </label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Short social / catalog blurb"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs text-[#222222] placeholder-gray-400 focus:bg-white focus:border-[#f84464] focus:outline-none"
                  />
                </div>
              </div>

              {/* 4. Full Synopsis & Script */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">
                  Synopsis
                </label>
                <textarea
                  rows={3}
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  placeholder="Detailed plot synopsis and artistic vision..."
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs text-[#222222] placeholder-gray-400 focus:bg-white focus:border-[#f84464] focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-[#f84464]" />
                  <span>Script / Screenplay Text or Link</span>
                </label>
                <textarea
                  rows={2}
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder="Paste script excerpts, treatment, or Google Drive / PDF script link..."
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs font-mono text-[#222222] placeholder-gray-400 focus:bg-white focus:border-[#f84464] focus:outline-none resize-none"
                />
              </div>

              {/* 5. Classification: Genre, Language, Duration, Year */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Genre</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value as FilmGenre)}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] focus:bg-white focus:border-[#f84464] focus:outline-none"
                  >
                    {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as IndianLanguage)}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] focus:bg-white focus:border-[#f84464] focus:outline-none"
                  >
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Duration</label>
                  <input
                    type="text"
                    value={durationStr}
                    onChange={(e) => setDurationStr(e.target.value)}
                    placeholder="e.g. 14 mins"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] focus:bg-white focus:border-[#f84464] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Release Year</label>
                  <input
                    type="number"
                    value={releaseYear}
                    onChange={(e) => setReleaseYear(parseInt(e.target.value) || 2026)}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] focus:bg-white focus:border-[#f84464] focus:outline-none"
                  />
                </div>
              </div>

              {/* 6. Production Team: Director, Producer, Production House, Cast, Crew */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Director</label>
                  <input
                    type="text"
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    placeholder="Director Name"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] focus:bg-white focus:border-[#f84464] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Producer</label>
                  <input
                    type="text"
                    value={producer}
                    onChange={(e) => setProducer(e.target.value)}
                    placeholder="Producer Name"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] focus:bg-white focus:border-[#f84464] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Production House / Brand</label>
                  <input
                    type="text"
                    value={productionHouse}
                    onChange={(e) => setProductionHouse(e.target.value)}
                    placeholder="Studio or Brand Name"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] focus:bg-white focus:border-[#f84464] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Cast (comma separated)</label>
                  <input
                    type="text"
                    value={castStr}
                    onChange={(e) => setCastStr(e.target.value)}
                    placeholder="Actor 1, Actor 2, Actor 3"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] focus:bg-white focus:border-[#f84464] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tagsStr}
                    onChange={(e) => setTagsStr(e.target.value)}
                    placeholder="ShortFilm, Thriller, FestivalAward"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] focus:bg-white focus:border-[#f84464] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Crew Details</label>
                <input
                  type="text"
                  value={crew}
                  onChange={(e) => setCrew(e.target.value)}
                  placeholder="Cinematographer, Editor, Music Composer..."
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] focus:bg-white focus:border-[#f84464] focus:outline-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-xs text-gray-500">
                  Status will be: <span className="font-bold text-[#f84464]">Pending Review</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex items-center gap-2 rounded-lg bg-[#f84464] hover:bg-[#e03352] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Clock className="h-4 w-4 animate-spin" />
                        <span>{processingStatus || 'Submitting...'}</span>
                      </>
                    ) : (
                      <>
                        <Clapperboard className="h-4 w-4" />
                        <span>Submit for Curator Review</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
