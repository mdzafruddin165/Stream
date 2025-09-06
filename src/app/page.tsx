
'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { ContentRow } from '@/components/content-row';
import { contentData, userProfiles, type Content, type UserProfile } from '@/lib/data';
import { AISuggester } from '@/components/ai-suggester';
import { ProfileSelector } from '@/components/profile-selector';
import { cn } from '@/lib/utils';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  const featuredContent = contentData.find(c => c.id === 'the-avengers') || contentData[0];

  const filteredContent = contentData.filter(content =>
    content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = filteredContent.reduce((acc, content) => {
    const category = content.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(content);
    return acc;
  }, {} as Record<string, Content[]>);

  const watchHistory = ['The Avengers', 'Mirror'];
  
  const handleProfileSelect = (profile: UserProfile) => {
    setSelectedProfile(profile);
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <ProfileSelector profiles={userProfiles} onProfileSelect={handleProfileSelect} show={!selectedProfile} />
      
      <div className={cn("transition-opacity duration-500", selectedProfile ? 'opacity-100' : 'opacity-0 invisible')}>
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <main className="flex-1">
          <HeroSection content={featuredContent} />
          <div className="py-8 sm:py-12 space-y-8 sm:space-y-12">
            {searchQuery && Object.keys(categories).length === 0 && (
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-xl text-muted-foreground">No results found for "{searchQuery}"</p>
              </div>
            )}
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
    </div>
  );
}
