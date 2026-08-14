import { ImageWithSkeleton } from '../ui/ImageWithSkeleton';
import { cn } from '../../lib/utils';

import { BadgeCheck, Image as ImageIcon, Users } from 'lucide-react';

export interface TalentCardProps {
  name: string;
  role: string;
  imageUrl?: string | null;
  instagramUrl?: string | null;
  followerCount?: number | null;
  postCount?: number | null;
  className?: string;
}

function formatCount(count: number | null | undefined): string {
  if (!count) return '0';
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

export function TalentCard({
  name,
  role,
  imageUrl,
  instagramUrl,
  followerCount,
  postCount,
  className,
}: TalentCardProps) {
  return (
    <div
      className={cn(
        'group relative aspect-[3/4] rounded-2xl bg-[#f0f0f0] shadow-md transition-shadow duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_12px_36px_rgba(122,27,27,0.3)] will-change-[shadow]',
        className
      )}
    >
      {/* Everything clipped inside rounded corners */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        
        {/* Background Image */}
        <ImageWithSkeleton
          src={imageUrl || ''}
          alt={name}
          containerClassName="absolute inset-0 h-full w-full"
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
        />
        
        {/* Feather overlay — multi-stop gradient (no backdrop-blur to avoid hard edge) */}
        <div 
          className="absolute inset-x-0 bottom-0 h-[60%] pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.35) 55%, rgba(255,255,255,0.1) 75%, transparent 100%)'
          }}
        />
        
        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-3 z-10">
          <div className="flex flex-col gap-0.5">
            {/* Name + Verified badge */}
            <div className="flex items-center gap-1">
              <h4 className="font-poppins text-sm font-bold text-gray-900 leading-tight truncate">
                {name}
              </h4>
              <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-green-500" />
            </div>

            {/* Bio */}
            <p className="text-[9px] font-medium text-gray-800 leading-snug line-clamp-2 pr-1">
              {role === 'GUEST' ? 'Professional Photographer | Telling your story, one frame at a time' : role}
            </p>

            {/* Stats row & Follow Button */}
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-800 text-[10px] font-semibold font-inter">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{formatCount(followerCount)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  <span>{formatCount(postCount)}</span>
                </div>
              </div>

              {/* Follow button */}
              {instagramUrl ? (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-white px-3 py-1 text-[10px] font-poppins font-bold text-gray-900 shadow-md transition-transform duration-300 hover:scale-105 focus:outline-none"
                  aria-label={`Follow ${name} on Instagram`}
                >
                  Follow +
                </a>
              ) : (
                <button 
                  className="inline-flex items-center justify-center rounded-full bg-white px-3 py-1 text-[10px] font-poppins font-bold text-gray-900 shadow-md transition-transform duration-300 hover:scale-105 focus:outline-none opacity-50 cursor-not-allowed"
                  disabled
                >
                  Follow +
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Border ring on top — always renders cleanly */}
      <div className="pointer-events-none absolute inset-0 z-20 rounded-2xl border-2 border-[#7a1b1b]" />
    </div>
  );
}
