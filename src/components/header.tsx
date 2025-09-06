import Link from 'next/link';
import { Film } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Film className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-white">StreamFlow</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Movies</Link>
            <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">TV Shows</Link>
            <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">New & Popular</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
