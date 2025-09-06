import Image from 'next/image';
import Link from 'next/link';
import { PlayCircle, Info } from 'lucide-react';
import type { Content } from '@/lib/data';
import { Button } from '@/components/ui/button';

type HeroSectionProps = {
  content: Content;
};

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <div className="relative h-[56.25vw] min-h-[400px] max-h-[800px] w-full">
      <Image
        src={content.thumbnailUrl.replace('600/400', '1280/720')}
        alt={content.title}
        fill
        className="object-cover"
        priority
        data-ai-hint="movie cinematic"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-transparent" />
      
      <div className="absolute bottom-0 left-0 w-full md:w-1/2 lg:w-2/5 p-4 sm:p-8 md:p-12 lg:p-16">
        <div className="flex flex-col items-start space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-lg">
            {content.title}
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-gray-200 drop-shadow-md max-w-2xl line-clamp-3">
            {content.description}
          </p>
          <div className="flex space-x-3">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
              <Link href={`/watch/${content.id}`}>
                <PlayCircle className="mr-2 h-6 w-6" />
                Play
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="font-bold bg-white/30 hover:bg-white/20 text-white">
              <Link href="#">
                <Info className="mr-2 h-6 w-6" />
                More Info
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
