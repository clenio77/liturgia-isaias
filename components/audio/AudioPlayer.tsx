'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Download, ExternalLink } from 'lucide-react';

export interface AudioSource {
  type: 'local' | 'youtube' | 'spotify' | 'soundcloud';
  url: string;
  title?: string;
  duration?: number;
}

interface AudioPlayerProps {
  sources: AudioSource[];
  title: string;
  artist?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
  autoPlay?: boolean;
  showControls?: boolean;
  compact?: boolean;
}

export function AudioPlayer({
  sources,
  title,
  artist,
  onPlay,
  onPause,
  onEnd,
  autoPlay = false,
  showControls = true,
  compact = false
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSource = sources[currentSourceIndex];

  // Debug: Log das fontes recebidas
  console.log(`🎵 AudioPlayer para "${title}":`, { sources, currentSource });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnd?.();
    };

    const handleError = () => {
      setError('Erro ao carregar áudio');
      setIsLoading(false);
      // Tentar próxima fonte se disponível
      if (currentSourceIndex < sources.length - 1) {
        setCurrentSourceIndex(prev => prev + 1);
      }
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [currentSourceIndex, sources.length, onEnd]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        onPause?.();
      } else {
        await audio.play();
        setIsPlaying(true);
        onPlay?.();
      }
    } catch (error) {
      console.error('Erro ao reproduzir áudio:', error);
      setError('Erro ao reproduzir áudio');
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const openExternalSource = () => {
    if (currentSource.type === 'youtube') {
      window.open(currentSource.url, '_blank');
    } else if (currentSource.type === 'spotify') {
      window.open(currentSource.url, '_blank');
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={togglePlay}
          disabled={isLoading}
          className="h-8 w-8 p-0"
        >
          {isLoading ? (
            <div className="animate-spin h-3 w-3 border border-gray-400 border-t-transparent rounded-full" />
          ) : isPlaying ? (
            <Pause className="h-3 w-3" />
          ) : (
            <Play className="h-3 w-3" />
          )}
        </Button>
        
        {currentSource && (
          <audio
            ref={audioRef}
            src={currentSource.type === 'local' ? currentSource.url : undefined}
            preload="metadata"
          />
        )}
        
        {error && (
          <span className="text-xs text-red-500">Erro</span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-medium text-gray-900 text-sm">{title}</h4>
          {artist && <p className="text-xs text-gray-600">{artist}</p>}
        </div>
        
        <div className="flex items-center gap-1">
          {currentSource.type !== 'local' && (
            <Button
              size="sm"
              variant="outline"
              onClick={openExternalSource}
              className="h-7 px-2"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          )}
          
          {sources.length > 1 && (
            <select
              value={currentSourceIndex}
              onChange={(e) => setCurrentSourceIndex(parseInt(e.target.value))}
              className="text-xs border border-gray-300 rounded px-1 py-0.5"
            >
              {sources.map((source, index) => (
                <option key={index} value={index}>
                  {source.type.toUpperCase()}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span>{formatTime(duration)}</span>
          </div>

          {/* Play Controls */}
          <div className="flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentSourceIndex(Math.max(0, currentSourceIndex - 1))}
              disabled={currentSourceIndex === 0}
              className="h-8 w-8 p-0"
            >
              <SkipBack className="h-3 w-3" />
            </Button>

            <Button
              onClick={togglePlay}
              disabled={isLoading}
              className="h-10 w-10 p-0"
            >
              {isLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentSourceIndex(Math.min(sources.length - 1, currentSourceIndex + 1))}
              disabled={currentSourceIndex === sources.length - 1}
              className="h-8 w-8 p-0"
            >
              <SkipForward className="h-3 w-3" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={toggleMute}
              className="h-7 w-7 p-0"
            >
              {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
            </Button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Audio Element */}
      {currentSource && (
        <audio
          ref={audioRef}
          src={currentSource.type === 'local' ? currentSource.url : undefined}
          preload="metadata"
          autoPlay={autoPlay}
        />
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 text-xs text-red-500 text-center">
          {error}
        </div>
      )}
    </div>
  );
}
