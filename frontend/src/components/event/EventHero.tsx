import type { EventDetailData } from '../../types/event';
import { Button } from '../ui/Button';
import { Calendar, MapPin, Image as ImageIcon, FolderArchive } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimationText } from '../home/AnimationText';
import { getImageUrl } from '../../utils/getImageUrl';
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton';

export interface EventHeroProps {
  event: EventDetailData;
}

export function EventHero({ event }: EventHeroProps) {
  const formatDate = (start: string, end: string) => {
    const startD = new Date(start);
    const endD = new Date(end);
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    if (startD.getTime() === endD.getTime()) {
      return startD.toLocaleDateString('id-ID', opts);
    }
    return `${startD.toLocaleDateString('id-ID', opts)} - ${endD.toLocaleDateString('id-ID', opts)}`;
  };

  const bgImage = event.heroImageUrl || event.posterImageUrl;

  if (event.heroMode === 'POSTER' && bgImage) {
    return (
      <section className="relative w-full h-[70vh] md:h-[85vh] bg-rpo-black flex flex-col justify-end overflow-hidden border-b border-sougen-blue/30">
        {/* Background Image (Cinematic) */}
        <div className="absolute inset-0 z-0">
          <img 
            src={getImageUrl(bgImage)}
            alt={event.name}
            width="1920"
            height="1080"
            decoding="async"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        {/* Gradient Overlay for text legibility (Cinematic Effect) */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent pointer-events-none" />
        
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 lg:px-8 pb-12 md:pb-24">
          <div className="max-w-3xl space-y-4">
            <h1 className="font-poppins text-4xl md:text-6xl font-extrabold text-rpo-white drop-shadow-lg">
              {event.name}
            </h1>
            {event.theme && (
              <p className="text-xl md:text-2xl text-sougen-blue font-inter font-bold drop-shadow-md">
                {event.theme}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-6 text-rpo-near-white font-inter py-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sougen-blue" />
                <span>{formatDate(event.startDate, event.endDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sougen-blue" />
                <span>{event.location}</span>
              </div>
            </div>

            <div className="pt-6 flex flex-wrap gap-4">
              {!event.isActive && (
                <>
                  <Button asChild variant="outlined-on-dark" size="lg" className="gap-2">
                    <Link to={`/gallery/${event.slug}`}>
                      <ImageIcon className="w-5 h-5" />
                      <span>Lihat Galeri</span>
                    </Link>
                  </Button>

                  {event.googleDriveUrl && (
                    <Button asChild variant="outlined-on-dark" size="lg" className="gap-2">
                      <a href={event.googleDriveUrl} target="_blank" rel="noopener noreferrer">
                        <FolderArchive className="w-5 h-5" />
                        <span>Arsip GDrive</span>
                      </a>
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // TEMPLATE Mode
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-rpo-black px-4 lg:px-8 py-24 border-b border-sougen-blue/30">
      {/* Decorative spinning text element */}
      <div className="absolute -bottom-32 -right-32 opacity-10 hidden md:block pointer-events-none">
        <AnimationText text="REALITY PROJECT ORGANIZER" className="w-[600px] h-[600px]" />
      </div>

      {/* Top gradient for navbar readability */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-10" />

      {bgImage ? (
        <>
          <ImageWithSkeleton
            src={bgImage}
            alt="Hero Background"
            containerClassName="absolute inset-0 w-full h-full"
            className="w-full h-full object-cover"
          />
          {/* Cinematic gradient overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/90 md:backdrop-blur-md pointer-events-none" />
        </>
      ) : (
        <>
          {/* Decorative Grid Background */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          {/* Red Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-sougen-blue/20 blur-[120px] rounded-full pointer-events-none" />
        </>
      )}

      <div className="relative z-10 max-w-5xl w-full mx-auto text-center flex flex-col items-center md:mt-16">
        {/* MOBILE TICKET LAYOUT */}
        <div className="md:hidden w-full max-w-[85%] mx-auto animate-in fade-in slide-in-from-bottom-3 duration-1000 mt-2 relative z-10">
          <div className="relative flex flex-col bg-white rounded-[20px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]">

            {/* ── Bagian 1: Header — Nama RPO ── */}
            <div className="relative px-6 pt-5 pb-4 text-center">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-sougen-blue" />
              <div className="font-poppins font-black text-sougen-blue text-[1.1rem] tracking-[0.18em] uppercase leading-none">
                Reality Project
              </div>
              <div className="font-inter font-semibold text-gray-700 text-[11px] tracking-[0.3em] uppercase mt-1.5">
                Organizer
              </div>
            </div>

            {/* ── Perforated tear line + notch cutouts ── */}
            <div className="relative h-[1px] mx-0">
              <div className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black/60 shadow-[inset_-2px_0_4px_rgba(0,0,0,0.3)] backdrop-blur-sm" />
              <div className="absolute -right-[10px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black/60 shadow-[inset_2px_0_4px_rgba(0,0,0,0.3)] backdrop-blur-sm" />
              <div className="mx-6 border-t border-dashed border-gray-300" />
            </div>

            {/* ── Bagian 2: Body — Info Event ── */}
            <div className="px-5 pt-5 pb-4 flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 mb-2">
                <Calendar className="w-3.5 h-3.5 text-sougen-blue" />
                <span className="font-inter font-semibold text-gray-800 text-xs tracking-[0.1em] uppercase">
                  {formatDate(event.startDate, event.endDate)}
                </span>
              </div>
              <h2 className="font-poppins font-black text-sougen-blue text-[1.4rem] leading-[1.05] uppercase tracking-tight mb-1">
                {event.name}
              </h2>
              {event.theme && (
                <div className="font-inter font-semibold text-gray-900 text-xs uppercase tracking-[0.12em] mt-0.5 mb-1.5">
                  {event.theme}
                </div>
              )}
              <div className="flex items-center gap-1.5 text-gray-700 font-medium text-xs mt-1.5 w-full justify-center">
                <MapPin className="w-3.5 h-3.5 text-sougen-blue shrink-0" />
                <span className="font-inter truncate">{event.location}</span>
              </div>
            </div>

            {/* ── Perforated tear line + notch cutouts ── */}
            <div className="relative h-[1px] mx-0">
              <div className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black/60 shadow-[inset_-2px_0_4px_rgba(0,0,0,0.3)] backdrop-blur-sm" />
              <div className="absolute -right-[10px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black/60 shadow-[inset_2px_0_4px_rgba(0,0,0,0.3)] backdrop-blur-sm" />
              <div className="mx-6 border-t border-dashed border-gray-300" />
            </div>

            {/* ── Bagian 3: Footer — CTA ── */}
            <div className="px-6 pt-5 pb-6 flex flex-col gap-3 items-center justify-center bg-gray-50/50">
              {!event.isActive && (
                <>
                  <Button asChild variant="outlined" className="w-full h-11 text-xs font-bold uppercase tracking-[0.15em] gap-2">
                    <Link to={`/gallery/${event.slug}`}>
                      <ImageIcon className="w-4 h-4" />
                      <span>Lihat Galeri</span>
                    </Link>
                  </Button>

                  {event.googleDriveUrl && (
                    <Button asChild variant="outlined" className="w-full h-11 text-xs font-bold uppercase tracking-[0.15em] gap-2">
                      <a href={event.googleDriveUrl} target="_blank" rel="noopener noreferrer">
                        <FolderArchive className="w-4 h-4" />
                        <span>Arsip GDrive</span>
                      </a>
                    </Button>
                  )}
                </>
              )}
            </div>

          </div>
        </div>

        {/* DESKTOP LAYOUT */}
        <div className="hidden md:flex w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 items-center justify-center mt-10">
          <div className="p-10 lg:p-14 flex flex-col items-center text-center max-w-5xl w-full">
            
            {/* Sougen presenter line */}
            <div className="flex items-center gap-3 mb-6 lg:mb-4 opacity-90">
              <img 
                src="/images/main-logo.png" 
                alt="Logo Resmi Sougen Creative Management" 
                width="43"
                height="32"
                className="h-8 lg:h-6 w-auto object-contain" 
              />
              <span className="font-inter font-semibold text-white/80 text-xs lg:text-[10px] tracking-[0.25em] uppercase">Sougen Creative Management</span>
            </div>

            {/* Event Name & Theme */}
            {event.theme && (
              <p className="font-inter font-bold text-sougen-blue text-sm lg:text-[13px] uppercase tracking-[0.25em] mb-4 lg:mb-3">
                {event.theme}
              </p>
            )}
            <h2 className="font-poppins text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] uppercase mb-10 lg:mb-8">
              {event.name}
            </h2>

            {/* Unified metadata row */}
            <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-8 mb-10 pb-10 lg:mb-8 lg:pb-8 border-b border-white/10 w-full max-w-3xl">
              <div className="flex items-center gap-2.5 text-white/90">
                <Calendar className="w-5 h-5 lg:w-4 lg:h-4 text-sougen-blue" />
                <span className="font-inter font-medium text-sm lg:text-[13px] tracking-wide">{formatDate(event.startDate, event.endDate)}</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/90">
                <MapPin className="w-5 h-5 lg:w-4 lg:h-4 text-sougen-blue" />
                <span className="font-inter font-medium text-sm lg:text-[13px] tracking-wide">{event.location}</span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-5 lg:gap-4 justify-center w-full">
              {!event.isActive && (
                <>
                  <Button asChild variant="outlined-on-dark" size="lg" className="px-12 h-14 lg:px-10 lg:h-11 text-sm lg:text-xs tracking-widest gap-2">
                    <Link to={`/gallery/${event.slug}`}>
                      <ImageIcon className="w-5 h-5 lg:w-4 lg:h-4" />
                      <span>Lihat Galeri</span>
                    </Link>
                  </Button>

                  {event.googleDriveUrl && (
                    <Button asChild variant="outlined-on-dark" size="lg" className="px-12 h-14 lg:px-10 lg:h-11 text-sm lg:text-xs tracking-widest gap-2">
                      <a href={event.googleDriveUrl} target="_blank" rel="noopener noreferrer">
                        <FolderArchive className="w-5 h-5 lg:w-4 lg:h-4" />
                        <span>Arsip GDrive</span>
                      </a>
                    </Button>
                  )}
                </>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
