
import Image from 'next/image';
import type { UserProfile } from '@/lib/data';

type ProfileCardProps = {
  profile: UserProfile;
  onClick: () => void;
};

export function ProfileCard({ profile, onClick }: ProfileCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center gap-2 cursor-pointer group"
    >
      <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-md overflow-hidden transition-all duration-200 border-2 border-transparent group-hover:border-white group-hover:scale-105">
        <Image
          src={profile.avatarUrl}
          alt={profile.name}
          fill
          className="object-cover"
          data-ai-hint="user avatar"
        />
      </div>
      <p className="text-gray-400 group-hover:text-white transition-colors">{profile.name}</p>
    </div>
  );
}
