
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X } from 'lucide-react';
import type { Content, Episode, Season } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils';

type EpisodeSelectorProps = {
  content: Content;
  currentEpisodeId: string;
  onClose: () => void;
};

export function EpisodeSelector({ content, currentEpisodeId, onClose }: EpisodeSelectorProps) {
  const router = useRouter();
  const [selectedSeason, setSelectedSeason] = useState<Season>(() => {
    return content.seasons?.find(s => s.episodes.some(e => e.id === currentEpisodeId)) || content.seasons?.[0] || { season: 1, episodes: [] };
  });

  const handleEpisodeSelect = (episode: Episode) => {
    router.push(`/watch/${content.id}?episode=${episode.id}`);
    onClose();
  };

  const handleSeasonChange = (seasonNumber: string) => {
    const season = content.seasons?.find(s => s.season === parseInt(seasonNumber));
    if (season) {
      setSelectedSeason(season);
    }
  }

  return (
    <div className="absolute inset-0 bg-black/90 z-40 flex flex-col p-4 sm:p-8" onClick={(e) => e.stopPropagation()}>
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold">{content.title}</h2>
        <div className="flex items-center gap-4">
          {content.seasons && content.seasons.length > 1 && (
              <Select value={String(selectedSeason.season)} onValueChange={handleSeasonChange}>
                <SelectTrigger className="w-full sm:w-[180px] bg-neutral-800 border-neutral-700">
                    <SelectValue placeholder="Season" />
                </SelectTrigger>
                <SelectContent>
                    {content.seasons.map(season => (
                        <SelectItem key={season.season} value={String(season.season)}>
                            Season {season.season}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          )}
          <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10 sm:h-12 sm:w-12 ml-auto sm:ml-0">
            <X className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {selectedSeason.episodes.map((episode, index) => (
            <div
              key={episode.id}
              className={cn(
                "rounded-lg overflow-hidden cursor-pointer group transition-all duration-200",
                episode.id === currentEpisodeId ? 'ring-2 ring-primary scale-105 bg-neutral-800' : 'bg-neutral-900 hover:bg-neutral-800'
              )}
              onClick={() => handleEpisodeSelect(episode)}
            >
              <div className="relative aspect-video">
                <Image
                  src={episode.thumbnailUrl}
                  alt={episode.title}
                  fill
                  className="object-cover"
                  data-ai-hint="tv episode thumbnail"
                />
                 {episode.id === currentEpisodeId && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/80 flex items-center justify-center">
                            <PlayIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                    </div>
                )}
              </div>
              <div className="p-2 sm:p-3">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-xs sm:text-sm mb-1 line-clamp-1">
                        {index + 1}. {episode.title}
                    </h3>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 sm:line-clamp-3">{episode.description}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    )
  }
