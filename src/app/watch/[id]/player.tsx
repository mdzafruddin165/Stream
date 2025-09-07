
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Minimize, Info, ListVideo } from 'lucide-react';
import type { Content, Episode } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { EpisodeSelector } from './episode-selector';

type PlayerProps = {
  content: Content;
  currentEpisode?: Episode;
  nextEpisode?: Episode;
};

export function Player({ content, currentEpisode, nextEpisode }: PlayerProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    progress: 0,
    isMuted: true,
    showControls: true,
    isFullscreen: false,
    showDescription: false,
    showSkipIntro: false,
    showUpNext: false,
    upNextCountdown: 10,
    isEpisodeSelectorOpen: false,
  });

  const upNextCountdownRef = useRef<NodeJS.Timeout | null>(null);
  const [upNextCancelled, setUpNextCancelled] = useState(false);

  const videoUrl = content.type === 'tv' ? currentEpisode?.videoUrl : content.videoUrl;
  const title = content.type === 'tv' ? `${content.title}: ${currentEpisode?.title}` : content.title;
  const description = content.type === 'tv' ? currentEpisode?.description : content.description;


  const scheduleHideControls = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setPlayerState(prev => ({...prev, showControls: !prev.isEpisodeSelectorOpen && prev.isPlaying}));
    }, 3000);
  }, []);

  const handleMouseMove = useCallback(() => {
    setPlayerState(prev => ({...prev, showControls: true}));
    scheduleHideControls();
  }, [scheduleHideControls]);

  const togglePlay = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(error => console.error("Playback failed:", error));
    } else {
      video.pause();
    }
  }, []);

  const handleCancelUpNext = useCallback(() => {
    setUpNextCancelled(true);
    setPlayerState(prev => ({...prev, showUpNext: false}));
    if (upNextCountdownRef.current) {
      clearInterval(upNextCountdownRef.current);
    }
  }, []);
  
  const handleNextEpisode = useCallback(() => {
    if (nextEpisode) {
        if (content.type === 'tv' && nextEpisode.id.startsWith('ep')) { // It's an episode in the same series
            router.push(`/watch/${content.id}?episode=${nextEpisode.id}`);
        } else { // It's a different piece of content
            router.push(`/watch/${nextEpisode.id}`);
        }
    }
  }, [router, content.id, content.type, nextEpisode]);


  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptAutoplay = async () => {
      try {
        video.muted = true;
        await video.play();
        setPlayerState(prev => ({...prev, isMuted: true}));
      } catch (error) {
        console.error("Autoplay was prevented:", error);
        setPlayerState(prev => ({...prev, isPlaying: false, showControls: true}));
      }
    };
    attemptAutoplay();

    const handlePlay = () => setPlayerState(prev => ({...prev, isPlaying: true}));
    const handlePause = () => setPlayerState(prev => ({...prev, isPlaying: false}));
    const handleTimeUpdate = () => {
      const videoEl = videoRef.current;
      if (!videoEl) return;

      const { currentTime, duration } = videoEl;
      if (isNaN(duration)) return;
      
      const newProgress = (currentTime / duration) * 100;
      const shouldShowSkipIntro = currentTime > 10 && currentTime < 30;
      const shouldShowUpNext = (duration - currentTime) <= 10 && !upNextCancelled && duration > 10 && nextEpisode;

      setPlayerState(prev => ({
        ...prev, 
        progress: newProgress,
        showSkipIntro: shouldShowSkipIntro,
        showUpNext: shouldShowUpNext,
      }));
    };

    const handleFullscreenChange = () => setPlayerState(prev => ({...prev, isFullscreen: !!document.fullscreenElement}));
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      if (upNextCountdownRef.current) clearInterval(upNextCountdownRef.current);
    };
  }, [upNextCancelled, nextEpisode]);

  useEffect(() => {
    if (playerState.showUpNext && playerState.isPlaying && !upNextCountdownRef.current) {
      let count = 10;
      setPlayerState(prev => ({...prev, upNextCountdown: count}));
      upNextCountdownRef.current = setInterval(() => {
        count--;
        if (count <= 0) {
          clearInterval(upNextCountdownRef.current!);
          upNextCountdownRef.current = null;
          handleNextEpisode();
        } else {
          setPlayerState(prev => ({...prev, upNextCountdown: count}));
        }
      }, 1000);
    } else if (!playerState.showUpNext && upNextCountdownRef.current) {
        clearInterval(upNextCountdownRef.current);
        upNextCountdownRef.current = null;
    }
  }, [playerState.showUpNext, playerState.isPlaying, handleNextEpisode]);

  useEffect(() => {
    const playerEl = playerRef.current;
    if (!playerEl) return;
    playerEl.addEventListener('mousemove', handleMouseMove);
    playerEl.addEventListener('mouseleave', () => { if (playerState.isPlaying) setPlayerState(prev => ({...prev, showControls: false})) });
    scheduleHideControls();
    return () => {
      playerEl.removeEventListener('mousemove', handleMouseMove);
      playerEl.removeEventListener('mouseleave', () => { if (playerState.isPlaying) setPlayerState(prev => ({...prev, showControls: false})) });
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [handleMouseMove, playerState.isPlaying, scheduleHideControls]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - left;
    video.currentTime = (clickX / width) * video.duration;
  };
  
  const skipIntro = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) videoRef.current.currentTime = 30;
    setPlayerState(p => ({...p, showSkipIntro: false}));
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setPlayerState(prev => ({...prev, isMuted: video.muted}));
  };
  
  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const playerEl = playerRef.current;
    if (!playerEl) return;
    if (!document.fullscreenElement) {
      playerEl.requestFullscreen().catch(err => console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`));
    } else {
      document.exitFullscreen();
    }
  };

  const toggleEpisodeSelector = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayerState(prev => {
      const newIsEpisodeSelectorOpen = !prev.isEpisodeSelectorOpen;
      if (newIsEpisodeSelectorOpen) {
        videoRef.current?.pause();
      }
      return { ...prev, isEpisodeSelectorOpen: newIsEpisodeSelectorOpen };
    });
  };

  return (
    <TooltipProvider>
      <div
        ref={playerRef}
        className="relative w-full h-screen bg-black overflow-hidden cursor-pointer"
        onClick={togglePlay}
      >
        <video
          key={videoUrl}
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          playsInline
        />

        {playerState.isEpisodeSelectorOpen && content.type === 'tv' && currentEpisode && (
          <EpisodeSelector
            content={content}
            currentEpisodeId={currentEpisode.id}
            onClose={() => setPlayerState(prev => ({ ...prev, isEpisodeSelectorOpen: false }))}
          />
        )}


        {!playerState.isPlaying && !playerState.isEpisodeSelectorOpen && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                <Play className="h-24 w-24 text-white/70" />
            </div>
        )}

        <div className={cn(
          "absolute inset-0 transition-opacity duration-300 pointer-events-none",
          playerState.showControls && !playerState.isEpisodeSelectorOpen ? 'opacity-100' : 'opacity-0'
        )}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />
          
          <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 lg:p-8 flex items-start justify-between pointer-events-auto">
            <div className="flex items-center gap-4">
              <Link href="/" passHref>
                <Button variant="ghost" size="icon" className="h-12 w-12 text-white hover:bg-white/10 hover:text-white" onClick={(e) => e.stopPropagation()}>
                    <ArrowLeft className="h-6 w-6 sm:h-7 sm:w-7" />
                </Button>
              </Link>
              <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg line-clamp-2">{title}</h1>
                <p 
                  className={cn("text-sm text-gray-300 drop-shadow-md max-w-2xl transition-all duration-300 ease-in-out",
                    playerState.showDescription ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
                  )}
                  style={{ transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, margin-top 0.3s ease-in-out' }}
                >
                  {description}
                </p>
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-12 w-12 text-white hover:bg-white/10 hover:text-white" onClick={(e) => { e.stopPropagation(); setPlayerState(p => ({...p, showDescription: !p.showDescription})) }}>
                    <Info className="h-6 w-6 sm:h-7 sm:w-7" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{playerState.showDescription ? 'Hide' : 'Show'} Description</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 space-y-3 pointer-events-auto" onClick={e => e.stopPropagation()}>
            <div className="w-full cursor-pointer group" onClick={handleSeek}>
              <Progress value={playerState.progress} className="h-1.5 bg-white/30 group-hover:h-2 transition-all duration-200" />
            </div>
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2 sm:gap-4">
                <Button variant="ghost" size="icon" className="h-11 w-11" onClick={togglePlay}>
                  {playerState.isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-11 w-11" onClick={toggleMute}>
                  {playerState.isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                </Button>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                {content.type === 'tv' && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-11 w-11" onClick={toggleEpisodeSelector}>
                        <ListVideo className="h-6 w-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Episodes</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                <Button variant="ghost" size="icon" className="h-11 w-11" onClick={toggleFullscreen}>
                  {playerState.isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {playerState.showSkipIntro && (
          <div className="absolute bottom-24 sm:bottom-28 right-4 sm:right-8 z-20 pointer-events-auto">
            <Button onClick={skipIntro} className="bg-white/20 backdrop-blur-md text-white hover:bg-white/30 border border-white/30">
              Skip Intro
            </Button>
          </div>
        )}
        
        {playerState.showUpNext && nextEpisode && (
          <div 
            className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-30 flex items-center justify-start pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full md:w-2/5 lg:w-1/3 p-8 text-white space-y-4">
                <div>
                  <p className="text-lg text-muted-foreground font-semibold">Up Next</p>
                  <h2 className="text-3xl font-bold mt-1 line-clamp-2">{nextEpisode.title}</h2>
                </div>
                 <div className="relative h-40 w-full rounded-lg overflow-hidden my-4 shadow-lg">
                   <Image
                      src={nextEpisode.thumbnailUrl.replace('600/400', '800/450')}
                      alt={nextEpisode.title}
                      fill
                      className="object-cover"
                      data-ai-hint="movie cinematic"
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                   <div className="absolute bottom-2 right-2 text-sm bg-black/50 px-2 py-1 rounded">
                     Next episode in {playerState.upNextCountdown}s
                   </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button onClick={handleNextEpisode} size="lg" className="bg-primary/90 hover:bg-primary flex-1">
                    <Play className="mr-2 h-5 w-5" /> Play Now
                  </Button>
                  <Button onClick={handleCancelUpNext} size="lg" variant="secondary" className="bg-white/20 hover:bg-white/30">
                    Cancel
                  </Button>
                </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
