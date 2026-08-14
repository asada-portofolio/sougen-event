import { cn } from '../../lib/utils';
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton';

export interface MobileLineUpCardProps {
  name: string;
  role: string;
  imageUrl?: string | null;
  className?: string;
}

export function MobileLineUpCard({ name, role, imageUrl, className }: MobileLineUpCardProps) {
  return (
    <div className={cn("relative w-full h-[90px] bg-white rounded-md border border-[#7A1B1B] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300", className)}>
      {/* Background Image on Right */}
      <div className="absolute top-0 right-0 bottom-0 w-[65%]">
        <ImageWithSkeleton
          src={imageUrl || ''}
          alt={name}
          containerClassName="w-full h-full"
          className="w-full h-full object-cover object-top"
        />
        {/* Gradient Fade to White on Left */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full pl-5 w-[80%] pointer-events-none">
        <h3 className="font-poppins font-black text-black text-[16px] uppercase leading-none truncate tracking-wide drop-shadow-sm">
          {name}
        </h3>
        <div className="h-[2px] bg-[#7A1B1B] w-3/5 mt-1 mb-1.5 rounded-full" />
        <p className="font-inter font-semibold text-black/90 text-[11px] capitalize drop-shadow-sm">
          {role}
        </p>
      </div>
    </div>
  );
}
