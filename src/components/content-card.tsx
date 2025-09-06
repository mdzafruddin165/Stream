import Image from 'next/image';
import Link from 'next/link';
import type { Content } from '@/lib/data';
import { PlayCircle } from 'lucide-react';

type ContentCardProps = {
  content: Content;
};

export function ContentCard({ content }: ContentCardProps) {
  return (
    <Link href={`/watch/${content.id}`} className="block group">
      <div className="relative aspect-video overflow-hidden rounded-md shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:z-10">
        <Image
          src={content.thumbnailUrl}
          alt={content.title}
          width={600}
          height={400}
          className="object-cover w-full h-full"
          data-ai-hint="movie poster"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <PlayCircle className="h-12 w-12 text-white/80" />
        </div>
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-300 group-hover:text-white transition-colors truncate">{content.title}</h3>
    </Link>
  );
}
