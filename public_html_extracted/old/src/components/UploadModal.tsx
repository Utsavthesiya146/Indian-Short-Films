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
  Camera,
  Layers,
  FileVideo,
  UserCheck,
  Briefcase,
  Globe,
  Building2
} from 'lucide-react';
import { ShortFilm, ReelVideo, FilmGenre, IndianLanguage, User } from '../types';
import { storeMediaBlob, PlatformStore } from '../services/platformStore';

interface UploadModalProps {
  onClose: () => void;
  currentUser: User | null;
  onFilmUploaded: (film: ShortFilm) => void;
  onReelUploaded: (reel: ReelVideo) => void;
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

const CATEGORIES: Array<'Short Film' | 'Documentary' | 'Animation' | 'Indie Spotlight' | 'Festival Winner'> = [
  'Short Film',
  'Documentary',
  'Animation',
  'Indie Spotlight',
  'Festival Winner'
];

export const UploadModal: React.FC<UploadModalProps> = ({
  onClose,
  currentUser,
  onFilmUploaded,
  onReelUploaded,
  onRequireAuth
}) => {
  const isUserBrand = currentUser?.role === 'brand';
  const [uploadType, setUploadType] = useState<'reel' | 'video' | 'film' | 'trailer'>(isUserBrand ? 'video' : 'film');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState<FilmGenre>('Drama');
  const [language, setLanguage] = useState<IndianLanguage>('Hindi');
  const [category, setCategory] = useState<'Short Film' | 'Documentary' | 'Animation' | 'Indie Spotlight' | 'Festival Winner'>('Short Film');
  const [creatorName, setCreatorName] = useState(currentUser?.brandName || currentUser?.name || '');
  const [director, setDirector] = useState(currentUser?.name || '');
  const [castStr, setCastStr] = useState('');
  const [tagsStr, setTagsStr] = useState('IndianCinema, IndieShorts');
  const [musicTitle, setMusicTitle] = useState('Original Score');
  const [durationStr, setDurationStr] = useState('5 mins');
  const [durationSecs, setDurationSecs] = useState(300);

  // Brand Video attributes
  const [isBrandContent, setIsBrandContent] = useState(isUserBrand);
  const [brandName, setBrandName] = useState(currentUser?.brandName || (isUserBrand ? currentUser.name : ''));
  const [brandWebsite, setBrandWebsite] = useState(currentUser?.website || '');
  const [brandCtaText, setBrandCtaText] = useState('Visit Official Site');
  const [brandCategory, setBrandCategory] = useState(currentUser?.industry || currentUser?.brandCategory || 'Media & OTT');

  // Files & URLs
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoSourceMode, setVideoSourceMode] = useState<'file' | 'url'>('file');
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterUrl, setPosterUrl] = useState<string>('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const hiddenVideoRef = useRef<HTMLVideoElement | null>(null);

  // Handle Video File selection & Auto Duration detection
  const handleVideoFileChange = (file: File) => {
    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-matroska'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov|mkv|ogg)$/i)) {
      setErrorMessage('Please select a valid video file (MP4, WebM, or MOV format).');
      return;
    }
    
    // Max size check: 350MB
    if (file.size > 350 * 1024 * 1024) {
      setErrorMessage('Video file size exceeds maximum browser limit of 350MB.');
      return;
    }

    setErrorMessage(null);
    setVideoFile(file);
    const tempUrl = URL.createObjectURL(file);
    setVideoUrl(tempUrl);

    // Detect duration and capture auto-frame
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = tempUrl;
    tempVideo.onloadedmetadata = () => {
      const dur = Math.round(tempVideo.duration);
      setDurationSecs(dur);
      if (dur < 60) {
        setDurationStr(`${dur} secs`);
      } else {
        const mins = Math.floor(dur / 60);
        const secs = dur % 60;
        setDurationStr(secs > 0 ? `${mins}m ${secs}s` : `${mins} mins`);
      }

      // Auto capture thumbnail at 1 second if no poster uploaded yet
      tempVideo.currentTime = Math.min(1.0, dur / 2);
      tempVideo.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = tempVideo.videoWidth || 640;
          canvas.height = tempVideo.videoHeight || 360;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            if (!posterUrl) {
              setPosterUrl(dataUrl);
            }
          }
        } catch (e) {
          console.error(e);
        }
      };
    };
  };

  // Handle Poster Image selection
  const handlePosterFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file for the poster (PNG, JPG, WebP).');
      return;
    }
    setErrorMessage(null);
    setPosterFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPosterUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Capture current frame from preview as poster
  const handleCaptureFrame = () => {
    if (hiddenVideoRef.current) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = hiddenVideoRef.current.videoWidth || 640;
        canvas.height = hiddenVideoRef.current.videoHeight || 360;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(hiddenVideoRef.current, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          setPosterUrl(dataUrl);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Real Upload Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!currentUser) {
      onRequireAuth();
      return;
    }

    if (!title.trim()) {
      setErrorMessage('Please enter a video title.');
      return;
    }

    const finalVideoSrc = videoFile ? videoUrl : videoUrl.trim();
    if (!finalVideoSrc) {
      setErrorMessage('Please provide a video file or direct video URL.');
      return;
    }

    const finalPosterSrc = posterUrl || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80';

    setIsProcessing(true);
    setProcessingStatus('Securing media assets in IndexedDB storage...');

    try {
      let persistentVideoUrl = finalVideoSrc;
      if (videoFile) {
        const mediaId = `vid-${Date.now()}`;
        persistentVideoUrl = await storeMediaBlob(mediaId, videoFile);
      }

      setProcessingStatus('Indexing video metadata into platform database...');

      const creatorId = currentUser.id;
      const creatorAvatar = currentUser.avatar || '/harri-kumar.jpg';
      const cleanTags = tagsStr.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);
      const cleanCast = castStr.split(',').map(c => c.trim()).filter(Boolean);

      if (uploadType === 'film' || uploadType === 'trailer' || uploadType === 'video') {
        const isBranded = isBrandContent || uploadType === 'video' || currentUser.role === 'brand';
        const finalBrandName = isBranded ? (brandName.trim() || currentUser.brandName || currentUser.name) : undefined;
        const filmCategory = uploadType === 'trailer' 
          ? 'Trailer' 
          : uploadType === 'video' 
          ? 'Indie Spotlight' 
          : category;

        const newFilm: ShortFilm = {
          id: `film-${Date.now()}`,
          title: title.trim(),
          description: description.trim() || 'Independent Indian cinema production.',
          synopsis: description.trim() || title.trim(),
          videoUrl: persistentVideoUrl,
          posterUrl: finalPosterSrc,
          duration: durationStr,
          durationSeconds: durationSecs,
          genre,
          language,
          category: filmCategory as any,
          director: director.trim() || currentUser.name,
          cast: cleanCast.length > 0 ? cleanCast : ['Lead Cast'],
          creatorId,
          creatorName: (isBranded && finalBrandName) ? finalBrandName : (creatorName.trim() || currentUser.name),
          creatorAvatar,
          releaseYear: new Date().getFullYear(),
          viewsCount: 0,
          likesCount: 0,
          rating: 0,
          reviewsCount: 0,
          isFeatured: false,
          isTrending: false,
          isNewRelease: true,
          status: 'approved',
          tags: cleanTags.length > 0 ? cleanTags : ['IndianCinema', 'ShortFilm'],
          isBrandContent: isBranded,
          brandName: finalBrandName,
          brandWebsite: isBranded ? brandWebsite.trim() : undefined,
          brandCtaText: isBranded ? (brandCtaText.trim() || 'Visit Official Site') : undefined,
          brandCategory: isBranded ? (brandCategory.trim() || 'Media & OTT') : undefined
        };

        // Save to persistent storage
        const allFilms = PlatformStore.getFilms();
        const updatedFilms = [newFilm, ...allFilms];
        PlatformStore.saveFilms(updatedFilms);

        // Add user notification
        PlatformStore.addNotification({
          userId: currentUser.id,
          title: isBranded ? 'Brand Video Published Live!' : 'Video Published Live!',
          message: `Your ${isBranded ? 'brand video' : uploadType === 'trailer' ? 'trailer' : 'short film'} "${title.trim()}" is now live on Indian Short Movie.`,
          type: 'upload',
          thumbnail: finalPosterSrc,
          linkId: newFilm.id
        });

        setIsProcessing(false);
        setIsSuccess(true);
        onFilmUploaded(newFilm);

        setTimeout(() => {
          onClose();
        }, 1200);

      } else {
        const isBranded = isBrandContent || currentUser.role === 'brand';
        const finalBrandName = isBranded ? (brandName.trim() || currentUser.brandName || currentUser.name) : undefined;

        const newReel: ReelVideo = {
          id: `reel-${Date.now()}`,
          title: title.trim(),
          description: description.trim() || title.trim(),
          videoUrl: persistentVideoUrl,
          posterUrl: finalPosterSrc,
          creatorId,
          creatorName: (isBranded && finalBrandName) ? finalBrandName : (creatorName.trim() || currentUser.name),
          creatorAvatar,
          creatorHandle: `@${currentUser.username}`,
          duration: durationStr,
          musicTitle: musicTitle.trim() || 'Original Audio',
          likesCount: 0,
          commentsCount: 0,
          sharesCount: 0,
          savesCount: 0,
          viewsCount: 0,
          tags: cleanTags.length > 0 ? cleanTags : ['Reels', 'IndianShortMovie'],
          createdAt: 'Just now',
          category,
          language,
          isBrandContent: isBranded,
          brandName: finalBrandName,
          brandWebsite: isBranded ? brandWebsite.trim() : undefined,
          brandCtaText: isBranded ? (brandCtaText.trim() || 'Visit Official Site') : undefined,
          brandCategory: isBranded ? (brandCategory.trim() || 'Media & OTT') : undefined
        };

        // Save to persistent storage
        const allReels = PlatformStore.getReels();
        const updatedReels = [newReel, ...allReels];
        PlatformStore.saveReels(updatedReels);

        // Add user notification
        PlatformStore.addNotification({
          userId: currentUser.id,
          title: isBranded ? 'Brand Reel Published Live!' : 'Reel Published Live!',
          message: `Your ${isBranded ? 'branded ' : ''}vertical reel "${title.trim()}" is now live in the Reels feed.`,
          type: 'upload',
          thumbnail: finalPosterSrc,
          linkId: newReel.id
        });

        setIsProcessing(false);
        setIsSuccess(true);
        onReelUploaded(newReel);

        setTimeout(() => {
          onClose();
        }, 1200);
      }

    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err?.message || 'Failed to save uploaded video. Please retry.');
    }
  };

  // If user is not logged in, show prompt
  if (!currentUser) {
    return (
      <div 
        id="upload-modal-unauthenticated"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center space-y-6 shadow-2xl text-[#222222]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full border border-gray-200 bg-gray-100 p-1.5 text-gray-500 hover:text-black hover:bg-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f84464]/10 text-[#f84464] border border-[#f84464]/20">
            <Upload className="h-7 w-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-[#222222]">Creator & Brand Sign In Required</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Please sign in or register an account to publish short films, vertical reels, and manage your creator profile.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => {
                onClose();
                onRequireAuth();
              }}
              className="w-full rounded-lg bg-[#f84464] hover:bg-[#e03352] py-2.5 text-xs font-bold text-white shadow-md active:scale-98 transition-all"
            >
              Sign In / Register Now
            </button>
            <button
              onClick={onClose}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="upload-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative my-8 w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6 text-[#222222]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full border border-gray-200 bg-gray-100 p-1.5 text-gray-500 hover:text-black hover:bg-gray-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f84464] text-white shadow-sm">
              <Upload className="h-5 w-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#222222]">
              Publish Video to Indian Short Movie
            </h3>
          </div>
          <p className="text-xs text-gray-500">
            Publish your short films or vertical reels to real viewers across India with persistent storage.
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Screen */}
        {isSuccess ? (
          <div className="py-12 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-bounce">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h4 className="text-lg font-black text-white">Video Published Successfully!</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your video is now live on the platform feed, discover catalog, and your profile dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Video Format Selection (4 Options) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setUploadType('film');
                  setCategory('Short Film');
                }}
                className={`flex flex-col items-center p-3 rounded-xl border transition-all text-center ${
                  uploadType === 'film'
                    ? 'border-[#f84464] bg-[#f84464]/10 text-[#f84464] ring-1 ring-[#f84464]'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:text-black'
                }`}
              >
                <div className={`p-2 rounded-lg mb-1.5 ${uploadType === 'film' ? 'bg-[#f84464] text-white' : 'bg-gray-200 text-gray-700'}`}>
                  <Film className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold">Short Film</span>
                <span className="text-[10px] text-gray-400">16:9 Cinema</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUploadType('reel');
                  setCategory('Short Film');
                }}
                className={`flex flex-col items-center p-3 rounded-xl border transition-all text-center ${
                  uploadType === 'reel'
                    ? 'border-[#f84464] bg-[#f84464]/10 text-[#f84464] ring-1 ring-[#f84464]'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:text-black'
                }`}
              >
                <div className={`p-2 rounded-lg mb-1.5 ${uploadType === 'reel' ? 'bg-[#f84464] text-white' : 'bg-gray-200 text-gray-700'}`}>
                  <Clapperboard className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold">Upload Reel</span>
                <span className="text-[10px] text-gray-400">9:16 Vertical</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUploadType('video');
                  setIsBrandContent(true);
                  setCategory('Indie Spotlight');
                }}
                className={`flex flex-col items-center p-3 rounded-xl border transition-all text-center ${
                  uploadType === 'video'
                    ? 'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-600'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:text-black'
                }`}
              >
                <div className={`p-2 rounded-lg mb-1.5 ${uploadType === 'video' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                  <Briefcase className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold">Brand Video</span>
                <span className="text-[10px] text-gray-400">Commercial / Studio</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUploadType('trailer');
                  setCategory('Indie Spotlight');
                }}
                className={`flex flex-col items-center p-3 rounded-xl border transition-all text-center ${
                  uploadType === 'trailer'
                    ? 'border-orange-500 bg-orange-50 text-orange-700 ring-1 ring-orange-500'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:text-black'
                }`}
              >
                <div className={`p-2 rounded-lg mb-1.5 ${uploadType === 'trailer' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold">Upload Trailer</span>
                <span className="text-[10px] text-gray-400">Teaser / Preview</span>
              </button>
            </div>

            {/* 2. Video File / Source */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <FileVideo className="h-4 w-4 text-[#f84464]" />
                  <span>Video File or Source URL *</span>
                </label>
                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setVideoSourceMode('file')}
                    className={`font-semibold ${videoSourceMode === 'file' ? 'text-[#f84464] underline' : 'text-gray-500'}`}
                  >
                    Select File
                  </button>
                  <span className="text-gray-300">•</span>
                  <button
                    type="button"
                    onClick={() => setVideoSourceMode('url')}
                    className={`font-semibold ${videoSourceMode === 'url' ? 'text-[#f84464] underline' : 'text-gray-500'}`}
                  >
                    Direct URL
                  </button>
                </div>
              </div>

              {videoSourceMode === 'file' ? (
                <div className="relative rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-5 text-center hover:border-[#f84464] transition-colors">
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleVideoFileChange(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="space-y-2 pointer-events-none">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gray-200 text-[#f84464]">
                      <Upload className="h-5 w-5" />
                    </div>
                    {videoFile ? (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
                          <Check className="h-3.5 w-3.5" />
                          <span>{videoFile.name}</span>
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {(videoFile.size / (1024 * 1024)).toFixed(1)} MB • Detected Duration: {durationStr}
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs font-bold text-[#222222]">
                          Click or drag and drop your video file here
                        </p>
                        <p className="text-[11px] text-gray-400">
                          MP4, WebM or MOV
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://commondatastorage.googleapis.com/.../video.mp4"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-xs text-[#222222] placeholder-gray-400 focus:bg-white focus:border-[#f84464] focus:outline-none"
                  />
                  <p className="text-[11px] text-gray-400">
                    Paste any direct MP4 or WebM video link.
                  </p>
                </div>
              )}
            </div>

            {videoUrl && (
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#222222]">Video Preview</span>
                  <button
                    type="button"
                    onClick={handleCaptureFrame}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#f84464] hover:underline"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <span>Snapshot as Poster</span>
                  </button>
                </div>
                <div className="relative aspect-video max-h-40 rounded-lg overflow-hidden bg-black flex items-center justify-center">
                  <video
                    ref={hiddenVideoRef}
                    src={videoUrl}
                    controls
                    playsInline
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* 3. Title & Description */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Video Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Echoes of Kaveri"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-xs text-[#222222] placeholder-gray-400 focus:bg-white focus:border-[#f84464] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Description & Synopsis</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your film's story, vision, themes, and background..."
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs text-[#222222] placeholder-gray-400 focus:bg-white focus:border-[#f84464] focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* 4. Poster / Thumbnail */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-[#f84464]" />
                <span>Thumbnail / Poster Image</span>
              </label>
              <div className="flex items-center gap-3">
                {posterUrl ? (
                  <div className="h-14 w-24 rounded-lg overflow-hidden border border-[#f84464]/40 bg-gray-100 shrink-0">
                    <img src={posterUrl} alt="Thumbnail preview" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="h-14 w-24 rounded-lg border border-dashed border-gray-300 bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 text-[10px]">
                    No Poster
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handlePosterFileChange(e.target.files[0]);
                      }
                    }}
                    className="text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-800 hover:file:bg-gray-200 cursor-pointer"
                  />
                  <p className="text-[10px] text-gray-400">Auto-captured from video if left blank.</p>
                </div>
              </div>
            </div>

            {/* 5. Metadata: Genre, Language, Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value as FilmGenre)}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] focus:bg-white focus:border-[#f84464] focus:outline-none"
                >
                  {GENRES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as IndianLanguage)}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] focus:bg-white focus:border-[#f84464] focus:outline-none"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] focus:bg-white focus:border-[#f84464] focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 6. Creator Name, Director, Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Creator / Brand Name</label>
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] focus:bg-white focus:border-[#f84464] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Director / Host</label>
                <input
                  type="text"
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] focus:bg-white focus:border-[#f84464] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Duration Display</label>
                <input
                  type="text"
                  value={durationStr}
                  onChange={(e) => setDurationStr(e.target.value)}
                  placeholder="e.g. 14 mins"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] focus:bg-white focus:border-[#f84464] focus:outline-none"
                />
              </div>
            </div>

            {/* Brand Campaign & Partner Details */}
            {(uploadType === 'video' || isBrandContent || currentUser?.role === 'brand') && (
              <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-purple-700" />
                    <span className="text-xs font-bold text-purple-900">Brand / Studio Information</span>
                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                      Verified Partner
                    </span>
                  </div>
                  {currentUser?.role !== 'brand' && uploadType !== 'video' && (
                    <label className="flex items-center gap-1.5 text-[11px] text-purple-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isBrandContent}
                        onChange={(e) => setIsBrandContent(e.target.checked)}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span>Enable Brand Partner Features</span>
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">Brand or Studio Name *</label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => {
                        setBrandName(e.target.value);
                        if (!creatorName) setCreatorName(e.target.value);
                      }}
                      placeholder="e.g. Netflix India, Red Chillies, Nykaa"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-[#222222] focus:border-purple-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">Brand Category / Industry</label>
                    <select
                      value={brandCategory}
                      onChange={(e) => setBrandCategory(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-[#222222] focus:border-purple-600 focus:outline-none"
                    >
                      <option value="Media & OTT">Media & OTT Streaming</option>
                      <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                      <option value="Tech & Innovation">Tech & Consumer Tech</option>
                      <option value="Automotive">Automotive</option>
                      <option value="Hospitality & Travel">Hospitality & Travel</option>
                      <option value="Food & Beverage">Food & Beverage</option>
                      <option value="Finance & Fintech">Finance & Fintech</option>
                      <option value="Production Studio">Film Production Studio</option>
                      <option value="Agency & Creative">Creative Agency</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                      <Globe className="h-3 w-3 text-purple-600" />
                      <span>Official Website / Campaign URL</span>
                    </label>
                    <input
                      type="url"
                      value={brandWebsite}
                      onChange={(e) => setBrandWebsite(e.target.value)}
                      placeholder="https://yourbrand.com/campaign"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-[#222222] focus:border-purple-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">Call-to-Action (CTA) Button</label>
                    <select
                      value={brandCtaText}
                      onChange={(e) => setBrandCtaText(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-[#222222] focus:border-purple-600 focus:outline-none"
                    >
                      <option value="Visit Official Site">Visit Official Site</option>
                      <option value="Explore Collection">Explore Collection</option>
                      <option value="Shop Now">Shop Now</option>
                      <option value="Watch Full Campaign">Watch Full Campaign</option>
                      <option value="Learn More">Learn More</option>
                      <option value="Book Now">Book Now</option>
                      <option value="Partner With Us">Partner With Us</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Cast & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Cast / Crew (comma separated)</label>
                <input
                  type="text"
                  value={castStr}
                  onChange={(e) => setCastStr(e.target.value)}
                  placeholder="e.g. Actor Name, Cinematographer"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] focus:bg-white focus:border-[#f84464] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Tags / Keywords</label>
                <input
                  type="text"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  placeholder="e.g. IndieCinema, ShortFilm, Drama"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] focus:bg-white focus:border-[#f84464] focus:outline-none"
                />
              </div>
            </div>

            {/* Processing indicator */}
            {isProcessing && (
              <div className="flex items-center gap-3 rounded-lg bg-red-50 border border-red-200 p-3.5 text-xs text-red-600">
                <div className="h-4 w-4 rounded-full border-2 border-[#f84464] border-t-transparent animate-spin shrink-0" />
                <span>{processingStatus}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                className="rounded-lg bg-[#f84464] hover:bg-[#e03352] px-7 py-2.5 text-xs font-bold text-white shadow-md active:scale-95 transition-all disabled:opacity-50"
              >
                {isProcessing ? "Storing & Publishing..." : "Publish Video Now"}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
