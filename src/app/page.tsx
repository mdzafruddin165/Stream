import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { ContentRow } from '@/components/content-row';
import { contentData, type Content } from '@/lib/data';
import { AISuggester } from '@/components/ai-suggester';

export default function Home() {
  const featuredContent = contentData.find(c => c.id === 'the-avengers') || contentData[0];

  const categories = contentData.reduce((acc, content) => {
    const category = content.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(content);
    return acc;
  }, {} as Record<string, Content[]>);

  const watchHistory = ['The Avengers', 'Inception', 'The Dark Knight'];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection content={featuredContent} />
        <div className="py-8 sm:py-12 space-y-8 sm:space-y-12">
          {Object.entries(categories).map(([category, items]) => (
            <ContentRow key={category} title={category} items={items} />
          ))}
        </div>
        <AISuggester watchHistory={watchHistory} />
      </main>
      <footer className="py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} StreamFlow Portfolio. All rights reserved.</p>
      </footer>
    </div>
  );
}
