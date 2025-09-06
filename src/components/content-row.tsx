
import type { Content } from '@/lib/data';
import { ContentCard } from './content-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type ContentRowProps = {
  title: string;
  items: Content[];
};

export function ContentRow({ title, items }: ContentRowProps) {
  if (items.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold px-4 sm:px-6 lg:px-8">{title}</h2>
      <Carousel
        opts={{
          align: "start",
          dragFree: true,
          loop: items.length > 5,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {items.map((item, index) => (
            <CarouselItem key={index} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
              <ContentCard content={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="block">
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 border-none text-white disabled:hidden" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 border-none text-white disabled:hidden" />
        </div>
      </Carousel>
    </div>
  );
}
