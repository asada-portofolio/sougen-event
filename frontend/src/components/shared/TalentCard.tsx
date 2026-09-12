import { ImageWithSkeleton } from '../ui/ImageWithSkeleton';
import { cn } from '../../lib/utils';

import { BadgeCheck, Image as ImageIcon, Users, User } from 'lucide-react';

export interface TalentCardProps {
  name: string;
  role: string;
  imageUrl?: string | null;
  instagramUrl?: string | null;
  followerCount?: number | null;
  postCount?: number | null;
  showStats?: boolean;
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
  showStats = true,
  className,
}: TalentCardProps) {
  return (
    <div
      className={cn(
        'group relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#f0f0f0] border-2 border-sougen-blue/60 hover:border-sougen-blue shadow-md transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_12px_36px_rgba(0,148,222,0.25)] will-change-[shadow]',
        className
      )}
    >
      {/* Background Image / Alt Placeholder */}
      {imageUrl ? (
        <ImageWithSkeleton
          src={imageUrl}
          alt={name}
          containerClassName="absolute inset-0 h-full w-full"
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-[#e8edf2] to-[#d2dce6] flex flex-col items-center justify-center text-gray-400 pb-16 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/70 border border-white/80 flex items-center justify-center mb-2 shadow-sm text-sougen-blue/70">
            <User className="w-9 h-9 md:w-11 md:h-11" />
          </div>
          <span className="text-xs font-inter font-bold uppercase tracking-wider text-gray-700 bg-white/80 px-2.5 py-0.5 rounded-full border border-white/60">
            Talent
          </span>
        </div>
      )}
      
      {/* Feather overlay — multi-stop gradient */}
      <div 
        className="absolute inset-x-0 bottom-0 h-[60%] pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.35) 55%, rgba(255,255,255,0.1) 75%, transparent 100%)'
        }}
      />
      
      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-3 z-10 gap-0.5">
        {/* Name + Verified badge */}
        <div className="flex items-center gap-1">
          <h3 className="font-poppins text-sm font-bold text-gray-900 leading-tight truncate">
            {name}
          </h3>
          <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-sougen-blue" />
        </div>

        {/* Bio */}
        <p className="text-[11px] font-medium text-gray-900 leading-snug line-clamp-2 pr-1">
          {role === 'GUEST' ? 'Professional Photographer | Telling your story, one frame at a time' : role}
        </p>

        {/* Stats row & Follow Button */}
        {showStats && (
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-900 text-xs font-semibold font-inter">
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{formatCount(followerCount)}</span>
              </div>
              <div className="flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{formatCount(postCount)}</span>
              </div>
            </div>

            {/* Follow button */}
            {instagramUrl ? (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-white px-3 py-1 text-xs font-poppins font-bold text-gray-900 shadow-md transition-all duration-300 hover:scale-105 hover:bg-sougen-blue hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sougen-blue"
                aria-label={`Follow ${name} on Instagram`}
              >
                Follow +
              </a>
            ) : (
              <button 
                className="inline-flex items-center justify-center rounded-full bg-white px-3 py-1 text-xs font-poppins font-bold text-gray-900 shadow-md transition-transform duration-300 hover:scale-105 focus:outline-none opacity-50 cursor-not-allowed"
                disabled
              >
                Follow +
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
