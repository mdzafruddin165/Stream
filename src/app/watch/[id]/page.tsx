
import { contentData, type Content, type Episode } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Player } from './player';
import { MoreLikeThis } from './more-like-this';

type WatchPageProps = {
  params: {
    id: string;
  };
  searchParams: {
    episode?: string;
  }
};

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  const content = contentData.find(c => c.id === params.id);

  if (!content) {
    notFound();
  }

  const relatedContent = contentData.filter(
    item => item.category === content.category && item.id !== content.id
  );
  
  let currentEpisode: Episode | undefined;
  let nextEpisode: Episode | undefined;

  if (content.type === 'tv') {
    const episodeId = searchParams.episode || content.seasons?.[0]?.episodes?.[0]?.id;
    let found = false;

    for (const season of content.seasons || []) {
      for (const episode of season.episodes) {
        if (found && !nextEpisode) {
          nextEpisode = episode;
          break;
        }
        if (episode.id === episodeId) {
          currentEpisode = episode;
          found = true;
        }
      }
      if (nextEpisode) break;
    }
     if (!nextEpisode && currentEpisode) { // End of series, suggest something else
        const nextContentFromAnotherSeries = contentData.find(c => c.id !== content.id);
        if (nextContentFromAnotherSeries) {
            const fallbackEpisode = nextContentFromAnotherSeries.type === 'movie' ? 
              {...nextContentFromAnotherSeries, videoUrl: nextContentFromAnotherSeries.videoUrl || ''} : 
              nextContentFromAnotherSeries.seasons?.[0].episodes[0];
            
            if (fallbackEpisode) {
                nextEpisode = {
                    ...fallbackEpisode,
                    id: nextContentFromAnotherSeries.id,
                }
            }
        }
    }
  }

  return (
    <div className="bg-black min-h-screen flex flex-col text-white">
      <Player 
        key={params.id + (searchParams.episode || '')}
        content={content} 
        currentEpisode={currentEpisode} 
        nextEpisode={nextEpisode}
      />
      <MoreLikeThis items={relatedContent} />
    </div>
  );
}

export async function generateStaticParams() {
  return contentData.map(content => ({
    id: content.id,
  }));
}
