
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

      if (currentTime > 5 && currentTime < 20) {
        setShowSkipIntro(true);
      } else {
        setShowSkipIntro(false);
      }

      if (duration - currentTime < 11 && duration > 11) {
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
          videoRef.current.muted = true; // Start muted
          videoRef.current.play().catch(() => {
            // Autoplay was prevented, user will have to click to play.
            setIsPlaying(false);
          });
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
  }, [showUpNext, nextContent.id, isPlaying, router]);

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
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={content.videoUrl}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        autoPlay
        muted
      />

      <div className={`absolute inset-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

        <Link href="/" className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20 flex items-center gap-2 text-white hover:text-primary transition-colors bg-black/30 p-2 rounded-md">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10" onClick={e => e.stopPropagation()}>
          <div className="max-w-3xl">
              <h1 className="text-2xl sm:text-4xl font-bold text-white drop-shadow-lg">{content.title}</h1>
          </div>
          <div className="w-full mt-4">
            <div className="w-full cursor-pointer group" onClick={handleSeek}>
              <Progress value={progress} className="h-1 group-hover:h-1.5 transition-all" />
            </div>
            <div className="flex items-center justify-between mt-2 text-white">
              <div className="flex items-center gap-2 sm:gap-4">
                <Button variant="ghost" size="icon" onClick={togglePlay}>
                  {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showSkipIntro && (
        <div className="absolute bottom-28 right-8 z-30">
          <Button onClick={e => {e.stopPropagation(); skipIntro()}} className="bg-white/90 text-black hover:bg-white">Skip Intro</Button>
        </div>
      )}
      
      {showUpNext && (
        <div 
          className="absolute inset-0 bg-black/80 z-40 flex items-center justify-end"
          onClick={e => e.stopPropagation()}
        >
          <div className="w-full md:w-1/2 lg:w-2/5 p-8 text-white space-y-4">
              <div>
                <p className="text-lg text-muted-foreground">Up Next</p>
                <h2 className="text-3xl font-bold mt-1">{nextContent.title}</h2>
              </div>
              <div className="flex items-center gap-4">
                <Button onClick={() => router.push(`/watch/${nextContent.id}`)} className="bg-primary/90 hover:bg-primary">
                  <Play className="mr-2 h-5 w-5" /> Play Now
                </Button>
                <p className="text-muted-foreground">Next episode in {upNextCountdown}s</p>
              </div>
          </div>
           <div className="w-full md:w-1/2 lg:w-3/5 h-full relative hidden md:block">
                <Image
                    src={nextContent.thumbnailUrl.replace('600/400', '1280/720')}
                    alt={nextContent.title}
                    fill
                    className="object-cover"
                    data-ai-hint="movie cinematic"
                />
                 <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-black/80 to-black" />
            </div>
        </div>
      )}
    </div>
  );
}
