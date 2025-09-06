import type { Content } from '@/lib/data';
import { ContentCard } from '@/components/content-card';

type MoreLikeThisProps = {
  items: Content[];
};

export function MoreLikeThis({ items }: MoreLikeThisProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-black py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">More Like This</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map(item => (
            <ContentCard key={item.id} content={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
