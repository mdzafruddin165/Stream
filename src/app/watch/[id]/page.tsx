
import { contentData, type Content } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Player } from './player';
import { MoreLikeThis } from './more-like-this';

type WatchPageProps = {
  params: {
    id: string;
  };
};

export default function WatchPage({ params }: WatchPageProps) {
  const content = contentData.find(c => c.id === params.id);

  if (!content) {
    notFound();
  }

  const relatedContent = contentData.filter(
    item => item.category === content.category && item.id !== content.id
  );
  
  const allContentInCategory = contentData.filter(
    (item) => item.category === content.category && item.id !== content.id
  );
  
  const nextContent = allContentInCategory.length > 0 ? allContentInCategory[0] : contentData.find(c => c.id !== content.id)!;


  return (
    <div className="bg-black min-h-screen flex flex-col text-white">
      <Player content={content} nextContent={nextContent} />
      <MoreLikeThis items={relatedContent} />
    </div>
  );
}

export async function generateStaticParams() {
  return contentData.map(content => ({
    id: content.id,
  }));
}
