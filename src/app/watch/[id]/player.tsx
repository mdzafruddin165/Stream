'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Play, Pause, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import type { Content } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

type PlayerProps = {
  content: Content;
  nextContent: Content;
};

export function Player({ content, nextContent }: PlayerProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showUpNext, setShowUpNext] = useState(false);
  const [upNextCountdown, setUpNextCountdown] = useState(10);
  
  let controlsTimeout: NodeJS.Timeout;

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      const { currentTime, duration } = video;
      setProgress((currentTime / duration) * 100);

      // Show Skip Intro logic
      if (currentTime > 5 && currentTime < 20) {
        setShowSkipIntro(true);
      } else {
        setShowSkipIntro(false);
      }

      // Show Up Next logic
      if (duration - currentTime < 10) {
        if (!showUpNext) {
          setShowUpNext(true);
          setUpNextCountdown(10);
        }
      } else {
        setShowUpNext(false);
      }
    };
    const handleLoadedMetadata = () => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
    };
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [showUpNext]);
  
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;
    if (showUpNext && isPlaying) {
      countdownInterval = setInterval(() => {
        setUpNextCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            router.push(`/watch/${nextContent.id}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdownInterval);
  }, [showUpNext, nextContent, isPlaying, router]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - left;
    const seekTime = (clickX / width) * video.duration;
    video.currentTime = seekTime;
  };
  
  const skipIntro = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 20;
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

  return (
    <div
      ref={playerRef}
      className="relative w-full h-screen bg-black"
      onMouseMove={handleMouseMove}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={content.videoUrl}
        className="w-full h-full object-contain"
        muted
        autoPlay
      />

      <div className={`absolute inset-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Back Button */}
        <Link href="/" className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20 flex items-center gap-2 text-white hover:text-primary transition-colors bg-black/50 p-2 rounded-md">
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
          <h1 className="text-2xl sm:text-4xl font-bold">{content.title}</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base line-clamp-2">{content.description}</p>
        </div>

        {/* Controls */}
        <div className="absolute bottom-20 left-4 right-4 sm:left-8 sm:right-8 z-20">
          <div className="w-full cursor-pointer" onClick={e => {e.stopPropagation(); handleSeek(e)}}>
            <Progress value={progress} className="h-1.5" />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={e => {e.stopPropagation(); togglePlay()}}>
                {isPlaying ? <Pause className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 text-white" />}
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted ? <VolumeX className="h-6 w-6 text-white" /> : <Volume2 className="h-6 w-6 text-white" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Skip Intro Button */}
      {showSkipIntro && (
        <div className="absolute bottom-24 right-8 z-30">
          <Button onClick={e => {e.stopPropagation(); skipIntro()}}>Skip Intro</Button>
        </div>
      )}

      {/* Up Next Overlay */}
      {showUpNext && (
        <div 
          className="absolute inset-0 bg-black/70 z-40 flex items-center justify-end"
          onClick={e => e.stopPropagation()}
        >
          <div className="w-1/3 p-8 text-white">
            <p className="text-lg text-muted-foreground">Up Next</p>
            <h2 className="text-3xl font-bold mt-2">{nextContent.title}</h2>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{nextContent.description}</p>
            <div className="flex items-center gap-4 mt-6">
              <Button onClick={() => router.push(`/watch/${nextContent.id}`)} className="bg-primary/80">
                Play Now
              </Button>
              <p>Next video in {upNextCountdown}s</p>
            </div>
          </div>
           <div className="w-1/3 h-full relative">
                <Image
                    src={nextContent.thumbnailUrl.replace('600/400', '1280/720')}
                    alt={nextContent.title}
                    fill
                    className="object-cover"
                    data-ai-hint="movie cinematic"
                />
                 <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/80 to-black/90" />
            </div>
        </div>
      )}
    </div>
  );
}
