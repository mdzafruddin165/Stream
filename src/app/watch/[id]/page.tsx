import { contentData } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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

  return (
    <div className="bg-black min-h-screen flex flex-col text-white">
       <Link href="/" className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2 text-white hover:text-primary transition-colors bg-black/30 p-2 rounded-md">
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      <div className="w-full h-screen">
          <video
            src={content.videoUrl}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/70 to-transparent">
        <h1 className="text-2xl sm:text-4xl font-bold">{content.title}</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">{content.description}</p>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return contentData.map(content => ({
    id: content.id,
  }));
}
