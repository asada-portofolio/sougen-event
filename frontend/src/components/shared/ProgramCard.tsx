import { cn } from '../../lib/utils';
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton';

export interface ProgramCardProps {
  id: number;
  imageUrl: string;
  title: string;
  className?: string;
}

export function ProgramCard({ imageUrl, title, className }: ProgramCardProps) {
  return (
    <div
      className={cn(
        'group relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#f0f0f0] border-2 border-sougen-blue/60 hover:border-sougen-blue shadow-md transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_12px_36px_rgba(0,148,222,0.25)] will-change-[shadow] flex-shrink-0 cursor-grab active:cursor-grabbing select-none',
        className
      )}
      draggable={false}
    >
      {/* Background Image */}
      <ImageWithSkeleton
        src={imageUrl}
        alt={title}
        containerClassName="absolute inset-0 h-full w-full"
        className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
      />
      
      {/* Feather overlay — multi-stop gradient (same as TalentCard) */}
      <div 
        className="absolute inset-x-0 bottom-0 h-[60%] pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.35) 55%, rgba(255,255,255,0.1) 75%, transparent 100%)'
        }}
      />
      
      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-4 pb-10 z-10 text-center">
        <h3 className="font-poppins text-xl md:text-2xl font-bold text-gray-900 group-hover:text-sougen-blue transition-colors duration-300 leading-tight line-clamp-2">
          {title}
        </h3>
      </div>
    </div>
  );
}
