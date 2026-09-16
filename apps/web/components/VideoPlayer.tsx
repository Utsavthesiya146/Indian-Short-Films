'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, AlertTriangle, Loader2 } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  title: string;
  initialPosition?: number;
  onProgressSave?: (positionSeconds: number, durationSeconds: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  posterUrl,
  title,
  initialPosition = 0,
  onProgressSave,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Resume last watched position
  useEffect(() => {
    if (videoRef.current && initialPosition > 0) {
      videoRef.current.currentTime = initialPosition;
    }
  }, [initialPosition]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch((_err: unknown) => setHasError(true));
    }
    setIsPlaying(!isPlaying);
  };

  // Time Update Handler
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    if (onProgressSave && videoRef.current.duration) {
      onProgressSave(videoRef.current.currentTime, videoRef.current.duration);
    }
  };

  // Seek Handler
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Volume Handler
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch((err: unknown) => console.error(err));
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err: unknown) => console.error(err));
      }
    }
  };

  // Format Seconds to MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black border border-cinema-border shadow-2xl group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
          setIsLoading(false);
        }}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
          <Loader2 className="w-12 h-12 text-cinema-accent animate-spin" />
        </div>
      )}

      {/* Error Overlay */}
      {hasError && (
        <div className="absolute inset-0 bg-cinema-bg/90 flex flex-col items-center justify-center p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-cinema-accent mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Playback Error - {title}</h3>
          <p className="text-xs text-cinema-muted max-w-md mb-4">
            Failed to stream video. Please check your internet connection or try again later.
          </p>
          <button
            onClick={() => {
              setHasError(false);
              setIsLoading(true);
              videoRef.current?.load();
            }}
            className="px-4 py-2 rounded-xl bg-cinema-card hover:bg-cinema-surface border border-cinema-border text-xs font-bold text-white flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Retry Playback
          </button>
        </div>
      )}

      {/* Custom Control Bar Overlay */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        
        {/* Progress Bar */}
        <div className="mb-3 flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Video seek slider"
            className="w-full h-1.5 bg-gray-700 accent-cinema-accent rounded-lg cursor-pointer"
          />
        </div>

        {/* Controls Grid */}
        <div className="flex items-center justify-between text-white text-xs">
          
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'} className="p-2 hover:text-cinema-accent transition-colors">
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white" />}
            </button>

            <span className="font-mono text-cinema-muted">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Volume */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (videoRef.current) videoRef.current.muted = !isMuted;
                }}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="hover:text-cinema-accent"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volume slider"
                className="w-16 h-1 bg-gray-700 accent-cinema-accent rounded-lg"
              />
            </div>

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} aria-label="Toggle Fullscreen" className="p-2 hover:text-cinema-accent transition-colors">
              <Maximize className="w-5 h-5" />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
