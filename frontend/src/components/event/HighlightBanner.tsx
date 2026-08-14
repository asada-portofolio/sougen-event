import { Link } from 'react-router-dom';
import type { ActiveEvent } from '../../types/event';
import { Button } from '../ui/Button';
import { Calendar, MapPin } from 'lucide-react';
import { getImageUrl } from '../../utils/getImageUrl';


export interface HighlightBannerProps {
  event: ActiveEvent | null;
}

export function HighlightBanner({ event }: HighlightBannerProps) {
  if (!event || !event.isActive) return null;

  const formatDate = (start: string, end: string) => {
    const startD = new Date(start);
    const endD = new Date(end);
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    if (startD.getTime() === endD.getTime()) {
      return startD.toLocaleDateString('id-ID', opts);
    }
    return `${startD.toLocaleDateString('id-ID', opts)} - ${endD.toLocaleDateString('id-ID', opts)}`;
  };

  const bannerImage = event.heroImageUrl || event.posterImageUrl;

  return (
    <div className="w-full relative bg-rpo-black border-b border-rpo-red/30 overflow-hidden h-[70vh] min-h-[500px] flex flex-col justify-end">
      
      {/* Cinematic Full Background */}
      <div className="absolute inset-0 z-0">
        {bannerImage ? (
          <img
            src={getImageUrl(bannerImage)}
            alt={event.name}
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-sm font-inter bg-rpo-surface">
            Poster Event Belum Tersedia
          </div>
        )}
      </div>

      {/* Dark Gradient Overlay for Cinematic Effect */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 lg:px-8 pb-12 md:pb-16 pt-32 text-center md:text-left">
        <div className="inline-block bg-rpo-red text-rpo-white px-3 py-1 text-xs font-bold font-inter uppercase tracking-wider rounded-sm mb-4 md:mb-6 shadow-md">
          Sedang Berlangsung
        </div>
        
        <div className="space-y-3 md:w-2/3 lg:w-3/5 mx-auto md:mx-0">
          <h2 className="font-poppins text-4xl md:text-5xl lg:text-7xl font-extrabold text-rpo-white tracking-tight leading-tight drop-shadow-lg">
            {event.name}
          </h2>
          {event.theme && (
            <p className="text-lg md:text-xl lg:text-2xl text-white/80 font-inter drop-shadow-md">
              {event.theme}
            </p>
          )}
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-rpo-near-white font-medium py-3 md:py-5 drop-shadow">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-rpo-red" />
              <span className="text-sm md:text-base">{formatDate(event.startDate, event.endDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-rpo-red" />
              <span className="text-sm md:text-base line-clamp-1">{event.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 pt-2">
            <Button asChild size="lg" variant="primary-on-dark" className="shadow-lg shadow-rpo-red/20 font-bold">
              <Link to={`/event/${event.slug}`}>Lihat Detail Acara</Link>
            </Button>
            {event.registrationUrl && (
              <Button asChild size="lg" variant="outlined" className="bg-black/30 backdrop-blur-md hover:bg-black/50 border-white/20 text-white hover:text-white transition-all font-bold">
                <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">Beli Tiket</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
