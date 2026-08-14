import type { ActiveEvent } from '../../types/event';
import { Button } from '../ui/Button';
import { AnimationText } from './AnimationText';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton';
import type { SiteSettings } from '../../hooks/useSiteSettings';
import { getImageUrl } from '../../utils/getImageUrl';
import { RunningTextBanner } from './RunningTextBanner';

export interface HeroSectionProps {
  event: ActiveEvent | null;
  settings?: SiteSettings | null;
}

export function HeroSection({ event, settings }: HeroSectionProps) {
  const mode = event?.heroMode || 'TEMPLATE';
  const hasEvent = !!event;

  const formatDate = (start?: string, end?: string) => {
    if (!start || !end) return '';
    try {
      const startD = new Date(start);
      const endD = new Date(end);
      if (isNaN(startD.getTime()) || isNaN(endD.getTime())) return '';
      const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
      if (startD.getTime() === endD.getTime()) {
        return startD.toLocaleDateString('id-ID', opts);
      }
      return `${startD.toLocaleDateString('id-ID', opts)} - ${endD.toLocaleDateString('id-ID', opts)}`;
    } catch {
      return '';
    }
  };

  // ── POSTER MODE ──────────────────────────────────────────────
  if (mode === 'POSTER' && event?.heroImageUrl) {
    return (
      <>
        <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-rpo-black flex items-center justify-center">
          <ImageWithSkeleton
            src={event.heroImageUrl}
            alt={event.name}
            containerClassName="absolute inset-0 w-full h-full"
            className="w-full h-full object-cover"
          />
          {/* Cinematic gradient overlay — darker at bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 md:backdrop-blur-sm" />
          
          {/* MOBILE: Ticket Card (Point 10) */}
          <div className="md:hidden w-full max-w-[320px] mx-auto px-4 relative z-10">
            <div className="relative flex flex-col bg-white rounded-[20px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]">

              {/* ── Bagian 1: Header — Nama RPO ── */}
              <div className="relative px-6 pt-6 pb-5 text-center">
                {/* Aksen garis merah tipis di paling atas */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-rpo-red" />
                <div className="font-poppins font-black text-rpo-red text-[1.1rem] tracking-[0.18em] uppercase leading-none">
                  Reality Project
                </div>
                <div className="font-inter font-medium text-gray-500 text-[0.55rem] tracking-[0.4em] uppercase mt-1.5">
                  Organizer
                </div>
              </div>

              {/* ── Perforated tear line + notch cutouts ── */}
              <div className="relative h-[1px] mx-0">
                {/* Semicircle notch kiri */}
                <div className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black/60 shadow-[inset_-2px_0_4px_rgba(0,0,0,0.3)] backdrop-blur-sm" />
                {/* Semicircle notch kanan */}
                <div className="absolute -right-[10px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black/60 shadow-[inset_2px_0_4px_rgba(0,0,0,0.3)] backdrop-blur-sm" />
                {/* Garis putus-putus di tengah */}
                <div className="mx-6 border-t border-dashed border-gray-300" />
              </div>

              {/* ── Bagian 2: Body — Info Event ── */}
              <div className="px-6 pt-6 pb-5 flex flex-col items-center text-center">
                {/* Tanggal */}
                <div className="flex items-center gap-1.5 mb-4">
                  <Calendar className="w-3.5 h-3.5 text-rpo-red" />
                  <span className="font-inter font-semibold text-gray-500 text-[0.65rem] tracking-[0.15em] uppercase">
                    {formatDate(event.startDate, event.endDate)}
                  </span>
                </div>

                {/* Nama Event */}
                <h2 className="font-poppins font-black text-rpo-red text-[1.6rem] leading-[1.05] uppercase tracking-tight mb-1">
                  {event.name}
                </h2>

                {/* Tema */}
                {event.theme && (
                  <div className="font-inter font-semibold text-rpo-black text-[0.7rem] uppercase tracking-[0.12em] mt-1 mb-3">
                    {event.theme}
                  </div>
                )}

                {/* Lokasi */}
                <div className="flex items-center gap-1.5 text-gray-500 text-[0.65rem] mt-3 w-full justify-center">
                  <MapPin className="w-3.5 h-3.5 text-rpo-red shrink-0" />
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
              <div className="px-6 pt-5 pb-6 flex items-center justify-center bg-gray-50/50">
                <Button asChild className="w-full h-11 text-[0.75rem] font-bold uppercase tracking-[0.15em]" variant="primary">
                  <Link to={`/event/${event.slug}`}>Lihat Detail Event</Link>
                </Button>
              </div>

            </div>
          </div>

          {/* DESKTOP: Centered glass card layout */}
          <div className="hidden md:flex absolute inset-0 z-10 flex-col items-center justify-center px-6">
            <div className="p-10 lg:p-14 flex flex-col items-center text-center max-w-5xl w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
              
              {/* RPO presenter line */}
              <div className="flex items-center gap-3 mb-6 lg:mb-4 opacity-90">
                {settings?.logoUrl ? (
                  <img src={getImageUrl(settings.logoUrl)} alt="RPO" className="h-8 lg:h-6 object-contain" />
                ) : (
                  <div className="flex h-8 w-8 lg:h-6 lg:w-6 items-center justify-center bg-rpo-red rounded-[6px]">
                    <span className="font-poppins text-xs lg:text-[10px] font-black text-white leading-none">RP</span>
                  </div>
                )}
                <span className="font-inter font-semibold text-white/80 text-xs lg:text-[10px] tracking-[0.25em] uppercase">Reality Project Organizer</span>
              </div>

              {/* Event Name & Theme */}
              {event.theme && (
                <p className="font-inter font-bold text-rpo-red text-sm lg:text-[13px] uppercase tracking-[0.25em] mb-4 lg:mb-3">
                  {event.theme}
                </p>
              )}
              <h1 className="font-poppins text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] uppercase mb-10 lg:mb-8">
                {event.name}
              </h1>

              {/* Unified metadata row */}
              <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-8 mb-10 pb-10 lg:mb-8 lg:pb-8 border-b border-white/10 w-full max-w-3xl">
                <div className="flex items-center gap-2.5 text-white/90">
                  <Calendar className="w-5 h-5 lg:w-4 lg:h-4 text-rpo-red" />
                  <span className="font-inter font-medium text-sm lg:text-[13px] tracking-wide">{formatDate(event.startDate, event.endDate)}</span>
                </div>
                <div className="flex items-center gap-2.5 text-white/90">
                  <MapPin className="w-5 h-5 lg:w-4 lg:h-4 text-rpo-red" />
                  <span className="font-inter font-medium text-sm lg:text-[13px] tracking-wide">{event.location}</span>
                </div>
                {event.registrationUrl && (
                  <div className="flex items-center gap-2.5">
                    <span className="bg-rpo-red/20 text-rpo-red border border-rpo-red/30 px-4 py-1.5 lg:px-3 lg:py-1 rounded-full font-bold uppercase tracking-[0.15em] text-xs lg:text-[11px]">
                      🎟️ Ticketed
                    </span>
                  </div>
                )}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-5 lg:gap-4 justify-center w-full">
                {event.isActive && event.registrationUrl && (
                  <Button asChild size="lg" variant="primary-on-dark" className="px-12 h-14 lg:px-10 lg:h-11 text-sm lg:text-xs tracking-widest shadow-[0_4px_24px_rgba(254,0,0,0.3)]">
                    <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">Beli Tiket Sekarang</a>
                  </Button>
                )}
                <Button asChild size="lg" variant="outlined-on-dark" className="px-12 h-14 lg:px-10 lg:h-11 text-sm lg:text-xs tracking-widest">
                  <Link to={`/event/${event.slug}`}>Detail Event</Link>
                </Button>
              </div>

            </div>
          </div>
        </section>

        {/* ── Crimson Banner ── */}
        <RunningTextBanner event={event} />
      </>
    );
  }

  // ── TEMPLATE MODE ────────────────────────────────────────────
  return (
    <>
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-rpo-black px-4 lg:px-8 py-24">
        {/* Decorative spinning text element */}
        <div className="absolute -bottom-32 -right-32 opacity-10 hidden md:block pointer-events-none">
          <AnimationText text="REALITY PROJECT ORGANIZER" className="w-[600px] h-[600px]" />
        </div>

        {/* Top gradient for navbar readability */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

        {settings?.heroImageUrl && (
          <>
            <ImageWithSkeleton
              src={settings.heroImageUrl}
              alt="Hero Background"
              containerClassName="absolute inset-0 w-full h-full"
              className="w-full h-full object-cover"
            />
            {/* Cinematic gradient overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 md:backdrop-blur-sm pointer-events-none" />
          </>
        )}

        <div className="relative z-10 max-w-5xl w-full mx-auto text-center flex flex-col items-center md:mt-16">
          {hasEvent ? (
            <>
              {/* MOBILE TICKET LAYOUT (Point 10) */}
              <div className="md:hidden w-full max-w-[320px] mx-auto animate-in fade-in slide-in-from-bottom-3 duration-1000 mt-2 relative z-10">
                <div className="relative flex flex-col bg-white rounded-[20px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]">

                  {/* ── Bagian 1: Header — Nama RPO ── */}
                  <div className="relative px-6 pt-6 pb-5 text-center">
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-rpo-red" />
                    <div className="font-poppins font-black text-rpo-red text-[1.1rem] tracking-[0.18em] uppercase leading-none">
                      Reality Project
                    </div>
                    <div className="font-inter font-medium text-gray-500 text-[0.55rem] tracking-[0.4em] uppercase mt-1.5">
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
                  <div className="px-6 pt-6 pb-5 flex flex-col items-center text-center">
                    <div className="flex items-center gap-1.5 mb-4">
                      <Calendar className="w-3.5 h-3.5 text-rpo-red" />
                      <span className="font-inter font-semibold text-gray-500 text-[0.65rem] tracking-[0.15em] uppercase">
                        {formatDate(event.startDate, event.endDate)}
                      </span>
                    </div>
                    <h2 className="font-poppins font-black text-rpo-red text-[1.6rem] leading-[1.05] uppercase tracking-tight mb-1">
                      {event.name}
                    </h2>
                    {event.theme && (
                      <div className="font-inter font-semibold text-rpo-black text-[0.7rem] uppercase tracking-[0.12em] mt-1 mb-3">
                        {event.theme}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-gray-500 text-[0.65rem] mt-3 w-full justify-center">
                      <MapPin className="w-3.5 h-3.5 text-rpo-red shrink-0" />
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
                  <div className="px-6 pt-5 pb-6 flex items-center justify-center bg-gray-50/50">
                    <Button asChild className="w-full h-11 text-[0.75rem] font-bold uppercase tracking-[0.15em]" variant="primary">
                      <Link to={`/event/${event.slug}`}>Lihat Detail Event</Link>
                    </Button>
                  </div>

                </div>
              </div>

              {/* DESKTOP LAYOUT (Point 11) */}
              <div className="hidden md:flex w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 items-center justify-center mt-10">
                <div className="p-10 lg:p-14 flex flex-col items-center text-center max-w-5xl w-full">
                  
                  {/* RPO presenter line */}
                  <div className="flex items-center gap-3 mb-6 lg:mb-4 opacity-90">
                    {settings?.logoUrl ? (
                      <img src={getImageUrl(settings.logoUrl)} alt="RPO" className="h-8 lg:h-6 object-contain" />
                    ) : (
                      <div className="flex h-8 w-8 lg:h-6 lg:w-6 items-center justify-center bg-rpo-red rounded-[6px]">
                        <span className="font-poppins text-xs lg:text-[10px] font-black text-white leading-none">RP</span>
                      </div>
                    )}
                    <span className="font-inter font-semibold text-white/80 text-xs lg:text-[10px] tracking-[0.25em] uppercase">Reality Project Organizer</span>
                  </div>

                  {/* Event Name & Theme */}
                  {event.theme && (
                    <p className="font-inter font-bold text-rpo-red text-sm lg:text-[13px] uppercase tracking-[0.25em] mb-4 lg:mb-3">
                      {event.theme}
                    </p>
                  )}
                  <h2 className="font-poppins text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] uppercase mb-10 lg:mb-8">
                    {event.name}
                  </h2>

                  {/* Unified metadata row */}
                  <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-8 mb-10 pb-10 lg:mb-8 lg:pb-8 border-b border-white/10 w-full max-w-3xl">
                    <div className="flex items-center gap-2.5 text-white/90">
                      <Calendar className="w-5 h-5 lg:w-4 lg:h-4 text-rpo-red" />
                      <span className="font-inter font-medium text-sm lg:text-[13px] tracking-wide">{formatDate(event.startDate, event.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-white/90">
                      <MapPin className="w-5 h-5 lg:w-4 lg:h-4 text-rpo-red" />
                      <span className="font-inter font-medium text-sm lg:text-[13px] tracking-wide">{event.location}</span>
                    </div>
                    {event.registrationUrl && (
                      <div className="flex items-center gap-2.5">
                        <span className="bg-rpo-red/20 text-rpo-red border border-rpo-red/30 px-4 py-1.5 lg:px-3 lg:py-1 rounded-full font-bold uppercase tracking-[0.15em] text-xs lg:text-[11px]">
                          🎟️ Ticketed
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CTA buttons */}
                  <div className="flex flex-wrap gap-5 lg:gap-4 justify-center w-full">
                    {event.isActive && event.registrationUrl && (
                      <Button asChild size="lg" variant="primary-on-dark" className="px-12 h-14 lg:px-10 lg:h-11 text-sm lg:text-xs tracking-widest shadow-[0_4px_24px_rgba(254,0,0,0.3)]">
                        <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">Beli Tiket Sekarang</a>
                      </Button>
                    )}
                    <Button asChild size="lg" variant="outlined-on-dark" className="px-12 h-14 lg:px-10 lg:h-11 text-sm lg:text-xs tracking-widest">
                      <Link to={`/event/${event.slug}`}>Detail Event</Link>
                    </Button>
                  </div>

                </div>
              </div>
            </>
          ) : (
            <>
              {/* RPO Logo / Branding Area — No Event */}
              <div className="mb-8 relative z-10 flex items-center justify-center gap-[12px] animate-in fade-in slide-in-from-bottom-3 duration-1000 max-[515px]:flex-col text-center w-full">
                {/* Logo ditumpuk 3 ukuran */}
                <div className="relative flex items-center justify-center shrink-0 w-[110px] h-[110px] max-[686px]:w-[75px] max-[686px]:h-[75px] max-[515px]:w-[85px] max-[515px]:h-[85px]">
                  {settings?.logoUrl ? (
                    <>
                      <img src={getImageUrl(settings.logoUrl)} alt="" className="absolute inset-0 w-full h-full object-contain rounded-[8px] rotate-12 opacity-30 transform scale-75" />
                      <img src={getImageUrl(settings.logoUrl)} alt="" className="absolute inset-0 w-full h-full object-contain rounded-[8px] -rotate-6 opacity-60 transform scale-90" />
                      <img src={getImageUrl(settings.logoUrl)} alt="RPO Logo" className="absolute inset-0 w-full h-full object-contain rounded-[8px] shadow-[0_7px_20px_rgba(0,0,0,0.3)] z-10" />
                    </>
                  ) : (
                    <>
                      {/* Tumpukan 1 */}
                      <div className="absolute inset-0 bg-[#ff0000] rounded-[8px] rotate-12 opacity-30 transform scale-75"></div>
                      {/* Tumpukan 2 */}
                      <div className="absolute inset-0 bg-[#ff0000] rounded-[8px] -rotate-6 opacity-60 transform scale-90"></div>
                      {/* Tumpukan 3 (Utama) */}
                      <div className="absolute inset-0 flex items-center justify-center bg-[#ff0000] rounded-[8px] shadow-[0_7px_20px_rgba(0,0,0,0.3)] z-10">
                        <span className="font-poppins font-black text-[#ffffff] text-[3rem] tracking-[-2px] max-[686px]:text-[2rem] max-[515px]:text-[2.2rem] leading-none">
                          RP
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Nama Reality Project Organizer */}
                <div className="flex flex-col justify-center">
                  <h1 className="font-poppins font-black text-[#ffffff] text-[2.75rem] leading-[0.95] tracking-[1px] [text-shadow:1.3px_2.7px_10px_rgba(0,0,0,0.4)] max-[686px]:text-[2rem] max-[515px]:text-[1.8rem] uppercase text-center">
                    Reality<br />Project<br />Organizer
                  </h1>
                </div>
              </div>

              <p className="max-w-2xl text-sm md:text-base text-white/70 mb-8 leading-relaxed font-inter mx-auto text-center">
                Komunitas dan event organizer yang berdedikasi menghidupkan budaya pop Jepang melalui panggung kreatif dan inovatif di Makassar.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="sm" variant="primary-on-dark">
                  <Link to="/event">Jelajahi Event</Link>
                </Button>
                <Button asChild size="sm" variant="outlined-on-dark">
                  <Link to="/about">Tentang Kami</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Crimson Banner ── */}
      <RunningTextBanner event={event} />
    </>
  );
}
