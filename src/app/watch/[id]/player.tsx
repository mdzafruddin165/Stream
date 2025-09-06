
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Minimize, Info } from 'lucide-react';
import type { Content } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type PlayerProps = {
  content: Content;
  nextContent: Content;
};

export function Player({ content, nextContent }: PlayerProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const upNextCountdownRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showUpNext, setShowUpNext] = useState(false);
  const [upNextCountdown, setUpNextCountdown] = useState(10);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [hasUpNextBeenCancelled, setHasUpNextBeenCancelled] = useState(false);

  const scheduleHideControls = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  }, [isPlaying]);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
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
    setShowUpNext(false);
    setHasUpNextBeenCancelled(true);
    if (upNextCountdownRef.current) {
      clearInterval(upNextCountdownRef.current);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset state when content changes
    setIsPlaying(false);
    setProgress(0);
    setShowUpNext(false);
    setHasUpNextBeenCancelled(false);
    setShowSkipIntro(false);
    setShowControls(true);
    if (upNextCountdownRef.current) clearInterval(upNextCountdownRef.current);

    const attemptAutoplay = async () => {
      try {
        video.muted = true;
        setIsMuted(true);
        await video.play();
      } catch (error) {
        console.error("Autoplay was prevented:", error);
        setIsPlaying(false);
        setShowControls(true);
      }
    };
    attemptAutoplay();

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleTimeUpdate = () => {
      const { currentTime, duration } = video;
      if (isNaN(duration)) return;

      setProgress((currentTime / duration) * 100);

      // Skip Intro logic
      const shouldShowSkipIntro = currentTime > 10 && currentTime < 30;
      setShowSkipIntro(shouldShowSkipIntro);

      // Up Next logic
      const remainingTime = duration - currentTime;
      if (remainingTime <= 10 && !hasUpNextBeenCancelled && duration > 10) {
        setShowUpNext(true);
      }
    };

    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    
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
  }, [content.id, hasUpNextBeenCancelled]);


  // Effect for "Up Next" countdown
  useEffect(() => {
    if (showUpNext && isPlaying) {
      if (upNextCountdownRef.current) clearInterval(upNextCountdownRef.current);
      
      let count = 10;
      setUpNextCountdown(count);

      upNextCountdownRef.current = setInterval(() => {
        count--;
        if (count <= 0) {
          clearInterval(upNextCountdownRef.current!);
          router.push(`/watch/${nextContent.id}`);
        } else {
          setUpNextCountdown(count);
        }
      }, 1000);

      return () => {
        if (upNextCountdownRef.current) {
          clearInterval(upNextCountdownRef.current);
        }
      };
    }
  }, [showUpNext, isPlaying, router, nextContent.id]);


  // Effect for controls visibility
  useEffect(() => {
    const playerEl = playerRef.current;
    if (!playerEl) return;
    
    playerEl.addEventListener('mousemove', handleMouseMove);
    playerEl.addEventListener('mouseleave', () => {
       if (isPlaying) setShowControls(false);
    });

    scheduleHideControls();

    return () => {
      playerEl.removeEventListener('mousemove', handleMouseMove);
      playerEl.removeEventListener('mouseleave', () => {
        if (isPlaying) setShowControls(false);
      });
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [handleMouseMove, isPlaying, scheduleHideControls]);


  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - left;
    const seekTime = (clickX / width) * video.duration;
    video.currentTime = seekTime;
  };
  
  const skipIntro = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime = 30;
      setShowSkipIntro(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };
  
  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const playerEl = playerRef.current;
    if (!playerEl) return;

    if (!document.fullscreenElement) {
      playerEl.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };


  return (
    <TooltipProvider>
      <div
        ref={playerRef}
        className="relative w-full h-screen bg-black overflow-hidden cursor-pointer"
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          src={content.videoUrl}
          className="w-full h-full object-contain"
          playsInline
        />

        {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                <Play className="h-24 w-24 text-white/70" />
            </div>
        )}

        <div className={cn(
          "absolute inset-0 transition-opacity duration-300 pointer-events-none",
          showControls ? 'opacity-100' : 'opacity-0'
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
                <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{content.title}</h1>
                <p 
                  className={cn("text-sm text-gray-300 drop-shadow-md max-w-2xl transition-all duration-300 ease-in-out",
                    showDescription ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
                  )}
                  style={{ transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, margin-top 0.3s ease-in-out' }}
                >
                  {content.description}
                </p>
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-12 w-12 text-white hover:bg-white/10 hover:text-white" onClick={(e) => { e.stopPropagation(); setShowDescription(!showDescription); }}>
                    <Info className="h-6 w-6 sm:h-7 sm:w-7" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{showDescription ? 'Hide' : 'Show'} Description</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 space-y-3 pointer-events-auto" onClick={e => e.stopPropagation()}>
            <div className="w-full cursor-pointer group" onClick={handleSeek}>
              <Progress value={progress} className="h-1.5 bg-white/30 group-hover:h-2 transition-all duration-200" />
            </div>
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2 sm:gap-4">
                <Button variant="ghost" size="icon" className="h-11 w-11" onClick={togglePlay}>
                  {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-11 w-11" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                </Button>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <Button variant="ghost" size="icon" className="h-11 w-11" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {showSkipIntro && (
          <div className="absolute bottom-24 sm:bottom-28 right-4 sm:right-8 z-20 pointer-events-auto">
            <Button onClick={skipIntro} className="bg-white/20 backdrop-blur-md text-white hover:bg-white/30 border border-white/30">
              Skip Intro
            </Button>
          </div>
        )}
        
        {showUpNext && (
          <div 
            className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-30 flex items-center justify-start pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full md:w-2/5 lg:w-1/3 p-8 text-white space-y-4">
                <div>
                  <p className="text-lg text-muted-foreground font-semibold">Up Next</p>
                  <h2 className="text-3xl font-bold mt-1 line-clamp-2">{nextContent.title}</h2>
                </div>
                 <div className="relative h-40 w-full rounded-lg overflow-hidden my-4 shadow-lg">
                   <Image
                      src={nextContent.thumbnailUrl.replace('600/400', '800/450')}
                      alt={nextContent.title}
                      fill
                      className="object-cover"
                      data-ai-hint="movie cinematic"
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                   <div className="absolute bottom-2 right-2 text-sm bg-black/50 px-2 py-1 rounded">
                     Next episode in {upNextCountdown}s
                   </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button onClick={() => router.push(`/watch/${nextContent.id}`)} size="lg" className="bg-primary/90 hover:bg-primary flex-1">
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
