import { Link } from 'react-router-dom';
import type { EventSummary } from '../../types/event';
import { Calendar, MapPin } from 'lucide-react';
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton';

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
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-rpo-black/10 hover:border-sougen-blue shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,148,222,0.14)] transition-all duration-300 hover:-translate-y-1"
    >
      {/* Top Short Landscape Cover Image (16:9) */}
      <div className="w-full aspect-[16/9] relative bg-[#f0f0f0] overflow-hidden shrink-0">
        {coverImage ? (
          <ImageWithSkeleton
            src={coverImage}
            alt={event.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-rpo-black/40 text-[10px] font-mono uppercase tracking-widest bg-black/5">
            Sougen Archive
          </div>
        )}

        {/* Status Badge */}
        {event.isActive ? (
          <div className="absolute top-2.5 right-2.5 bg-sougen-blue text-white px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded-md z-10 shadow-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Active
          </div>
        ) : (
          <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white border border-white/20 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded-md z-10">
            Selesai
          </div>
        )}
      </div>

      {/* Bottom Content Info */}
      <div className="p-3 sm:p-3.5 flex flex-col gap-2">
        <div>
          {/* Theme Tag / Hashtag */}
          {event.theme && (
            <span className="text-[10px] sm:text-[11px] font-mono font-bold text-sougen-blue-dark uppercase tracking-wider line-clamp-1 mb-0.5 block">
              #{event.theme}
            </span>
          )}

          {/* Event Name */}
          <h3 className="font-poppins text-xs sm:text-sm md:text-[15px] font-bold text-rpo-black group-hover:text-sougen-blue transition-colors line-clamp-1 leading-snug">
            {event.name}
          </h3>
        </div>

        {/* Date & Location Metadata */}
        <div className="pt-2 border-t border-black/5 space-y-1">
          <div className="flex items-center gap-1.5 text-gray-700 font-inter font-medium text-[11px] sm:text-xs">
            <Calendar className="w-3.5 h-3.5 text-sougen-blue shrink-0" />
            <span className="truncate">{formatDate(event.startDate, event.endDate)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-700 font-inter font-medium text-[11px] sm:text-xs">
            <MapPin className="w-3.5 h-3.5 text-sougen-blue shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
