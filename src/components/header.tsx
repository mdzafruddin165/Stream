
'use client';

import Link from 'next/link';
import { Film, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

type HeaderProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export function Header({ searchQuery, setSearchQuery }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent transition-all">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Film className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-white hidden sm:block">StreamFlow</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-4">
              <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Movies</Link>
              <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">TV Shows</Link>
              <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">New & Popular</Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 transition-all duration-300 ${isSearchOpen ? 'w-48 md:w-64' : 'w-0'}`}>
              {isSearchOpen && (
                <div className="relative w-full">
                  <Input
                    type="text"
                    placeholder="Title, description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-black/50 border-gray-600 text-white placeholder:text-gray-400 focus:bg-black/70 focus:border-primary"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-white"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-white hover:bg-black/50 hover:text-primary"
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
