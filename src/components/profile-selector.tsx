
'use client';

import type { UserProfile } from '@/lib/data';
import { Button } from './ui/button';
import { ProfileCard } from './profile-card';
import { cn } from '@/lib/utils';
import { Pencil } from 'lucide-react';

type ProfileSelectorProps = {
  profiles: UserProfile[];
  onProfileSelect: (profile: UserProfile) => void;
  show: boolean;
};

export function ProfileSelector({ profiles, onProfileSelect, show }: ProfileSelectorProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500',
        show ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8">Who's Watching?</h1>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-12">
          {profiles.map(profile => (
            <ProfileCard key={profile.id} profile={profile} onClick={() => onProfileSelect(profile)} />
          ))}
        </div>
        <Button variant="outline" size="lg" className="bg-transparent border-gray-500 text-gray-400 hover:bg-white hover:text-black">
          <Pencil className="mr-2 h-5 w-5" /> Manage Profiles
        </Button>
      </div>
    </div>
  );
}
