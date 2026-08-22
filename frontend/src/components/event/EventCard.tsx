import { Link } from 'react-router-dom';
import type { EventSummary } from '../../types/event';
import { Calendar, MapPin } from 'lucide-react';
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton';
import { cn } from '../../lib/utils';

export interface EventCardProps {
  event: EventSummary;
}

export function EventCard({ event }: EventCardProps) {
  const formatDate = (start: string, end: string) => {
    const startD = new Date(start);
    const endD = new Date(end);
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    if (startD.getTime() === endD.getTime()) {
      return startD.toLocaleDateString('id-ID', opts);
    }
    return `${startD.toLocaleDateString('id-ID', opts)} - ${endD.toLocaleDateString('id-ID', opts)}`;
  };

  // Determine which image to show
  const coverImage = event.posterImageUrl || event.galleryPhotos?.[0]?.imageUrlThumb || null;

  return (
    <Link 
      to={`/event/${event.slug}`} 
      className="group flex flex-col bg-white border-2 border-sougen-blue rounded-xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,148,222,0.15)]"
    >
      <div className="w-full aspect-[3/4] relative bg-[#f0f0f0] overflow-hidden">
        {coverImage ? (
          <ImageWithSkeleton
            src={coverImage}
            alt={event.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-rpo-black/40 text-xs font-inter uppercase tracking-widest bg-black/5">
            Sougen Archive
          </div>
        )}
        
        {/* Status Badge */}
        {event.isActive ? (
          <div className="absolute top-3 right-3 bg-sougen-blue text-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-md z-10 shadow-sm">
            Active
          </div>
        ) : (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-rpo-black border border-black/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md z-10 shadow-sm">
            Selesai
          </div>
        )}
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-poppins text-xl font-bold text-rpo-black mb-2 line-clamp-2 group-hover:text-sougen-blue transition-colors">
          {event.name}
        </h3>
        
        {event.theme && (
          <p className="text-sm font-inter text-rpo-black/60 line-clamp-2 mb-4 flex-1">
            {event.theme}
          </p>
        )}
        
        <div className={cn("space-y-2 mt-auto pt-4 border-t border-black/5", !event.theme && "mt-4")}>
          <div className="flex items-start gap-2 text-rpo-black/50 font-inter text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 mt-0.5 shrink-0 text-sougen-blue" />
            <span>{formatDate(event.startDate, event.endDate)}</span>
          </div>
          <div className="flex items-start gap-2 text-rpo-black/50 font-inter text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-sougen-blue" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
