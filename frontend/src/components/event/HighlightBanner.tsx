import { Link } from 'react-router-dom';
import type { ActiveEvent } from '../../types/event';
import { Button } from '../ui/Button';
import { Calendar, MapPin, ArrowRight, Sparkles } from 'lucide-react';
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
    <div className="w-full relative min-h-[480px] md:min-h-[540px] lg:h-[68vh] max-h-[680px] bg-[#050B14] flex flex-col justify-end overflow-hidden border-b border-black/10">
      
      {/* 1. Immersive Background Poster Art with Subtle Cinematic Blur */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {bannerImage ? (
          <img
            src={getImageUrl(bannerImage)}
            alt={event.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center blur-[3px] scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/40 text-sm font-inter bg-slate-900">
            Poster Event Belum Tersedia
          </div>
        )}
      </div>

      {/* 2. Top Navbar Canopy (Soft Natural Fade for Clear Navbar) */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 via-black/25 to-transparent pointer-events-none z-10" />

      {/* 3. Dark Cinematic Overlays (Efek Gelap Halus & Elegan) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/45 via-50% to-transparent pointer-events-none" />
      <div className="hidden md:block absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/35 via-55% to-transparent pointer-events-none" />

      {/* 4. Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8 md:pb-12 pt-28">
        <div className="max-w-3xl">
          
          {/* Status Badge in Soft Dark/White Glass */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-sougen-blue animate-pulse" />
            <Sparkles className="w-3 h-3 text-white" />
            <span>Sedang Berlangsung</span>
          </div>

          {/* Event Title */}
          <h1 className="font-poppins text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] mb-1.5">
            {event.name}
          </h1>

          {/* Event Theme */}
          {event.theme && (
            <p className="text-sm sm:text-base md:text-lg text-sougen-blue font-inter font-bold drop-shadow mb-2.5">
              #{event.theme}
            </p>
          )}

          {/* Date & Venue: Clean transparent layout without container background, with soft text weight */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 py-2.5 my-3 border-y border-white/15 max-w-xl">
            {/* Tanggal */}
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-sougen-blue shrink-0" />
              <div className="flex flex-col text-left">
                <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest leading-none">
                  DATE
                </span>
                <span className="font-inter font-medium text-xs sm:text-sm text-white/90 mt-0.5">
                  {formatDate(event.startDate, event.endDate)}
                </span>
              </div>
            </div>

            {/* Divider Vertikal */}
            <div className="hidden sm:block h-6 w-[1px] bg-white/20" />

            {/* Lokasi */}
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-sougen-blue shrink-0" />
              <div className="flex flex-col text-left">
                <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest leading-none">
                  VENUE
                </span>
                <span className="font-inter font-medium text-xs sm:text-sm text-white/90 mt-0.5 line-clamp-1">
                  {event.location}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA Buttons (Clean, without neon glow shadow) */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <Button asChild size="lg" variant="primary" className="font-bold font-inter text-xs sm:text-sm px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl gap-2 shadow-md transition-colors">
              <Link to={`/event/${event.slug}`}>
                <span>Lihat Detail Acara</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
            {event.registrationUrl && (
              <Button asChild size="lg" variant="outlined-on-dark" className="bg-white/10 hover:bg-white/20 border-white/25 text-white hover:text-white font-bold font-inter text-xs sm:text-sm px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl transition-colors">
                <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">Beli Tiket</a>
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
