import { useState, useEffect } from 'react';
import type { EventDetailData } from '../../types/event';
import { Button } from '../ui/Button';
import { Calendar, MapPin, Image as ImageIcon, FolderArchive, CalendarDays, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimationText } from '../home/AnimationText';
import { getImageUrl } from '../../utils/getImageUrl';
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton';
import { cn } from '../../lib/utils';

export interface EventHeroProps {
  event: EventDetailData;
  onSelectDay?: (dayId: number) => void;
}

export function EventHero({ event, onSelectDay }: EventHeroProps) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    // If initially scrolled past top, disable bounce
    if (window.scrollY > 30) {
      setHasScrolled(true);
      return;
    }

    // Trigger one-time bounce shortly after page entrance animation
    const startTimer = setTimeout(() => {
      setIsBouncing(true);
    }, 1000);

    // Stop bounce after 3 gentle cycles (~3.5 seconds)
    const stopTimer = setTimeout(() => {
      setIsBouncing(false);
    }, 4500);

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 30) {
            setHasScrolled(true);
            setIsBouncing(false);
            window.removeEventListener('scroll', handleScroll);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(startTimer);
      clearTimeout(stopTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleDayClick = (dayId: number) => {
    if (onSelectDay) {
      onSelectDay(dayId);
    } else {
      const el = document.getElementById('rundown');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const formatNumericDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day} ${month} ${year}`;
    } catch {
      return dateStr;
    }
  };

  const days = event.eventDays && event.eventDays.length > 0 ? event.eventDays : [];
  const overrideDays = days.filter(d => d.locationOverride && d.locationOverride.trim() !== '' && d.locationOverride !== event.location);
  let locationSummary = event.location;
  if (overrideDays.length > 0) {
    const overrideText = overrideDays.map(d => `Day ${d.dayNumber}: ${d.locationOverride}`).join(' | ');
    locationSummary = `${event.location} (${overrideText})`;
  }

  const bgImage = event.heroImageUrl || event.posterImageUrl;

  if (event.heroMode === 'POSTER' && bgImage) {
    return (
      <section className="relative w-full min-h-[500px] md:min-h-[560px] lg:h-[72vh] max-h-[720px] bg-[#050B14] flex flex-col justify-end overflow-hidden border-b border-black/10">
        {/* Background Poster Art with Subtle Cinematic Blur */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src={getImageUrl(bgImage)}
            alt={event.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center blur-[3px] scale-105 transition-transform duration-700"
          />
        </div>

        {/* Top Navbar Canopy */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 via-black/25 to-transparent pointer-events-none z-10" />

        {/* Dark Cinematic Overlays */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/55 via-50% to-transparent pointer-events-none" />
        <div className="hidden md:block absolute inset-0 z-10 bg-gradient-to-r from-black/85 via-black/40 via-55% to-transparent pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8 md:pb-12 pt-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-sougen-blue animate-pulse" />
              <span>{event.isActive ? 'Sedang Berlangsung' : 'Event Selesai'}</span>
            </div>

            <h1 className="font-poppins text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] mb-2">
              {event.name}
            </h1>

            {event.theme && (
              <p className="text-sm sm:text-base md:text-lg text-sougen-blue font-inter font-bold drop-shadow mb-4">
                #{event.theme}
              </p>
            )}

            {/* Location & Day Breakdown Bar */}
            <div className="flex flex-col gap-2.5 py-3 my-3 border-y border-white/15 max-w-2xl">
              {/* Location Line First */}
              <div className="flex items-center gap-2 text-white/90 text-xs sm:text-sm font-inter">
                <MapPin className="w-4 h-4 text-sougen-blue shrink-0" />
                <span className="text-white/80 font-medium line-clamp-1">{locationSummary}</span>
              </div>

              {/* Day Breakdown Chips Under Location */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                {days.length > 0 ? (
                  days.map(day => (
                    <button 
                      key={day.id} 
                      type="button"
                      onClick={() => handleDayClick(day.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-sougen-blue hover:text-white hover:border-sougen-blue active:scale-95 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-inter transition-all duration-200 cursor-pointer shadow-sm group"
                      title={`Lihat jadwal rundown Day ${day.dayNumber}`}
                    >
                      <CalendarDays className="w-3.5 h-3.5 text-sougen-blue group-hover:text-white shrink-0" />
                      <span className="font-bold text-sougen-blue group-hover:text-white">Day {day.dayNumber}:</span>
                      <span className="text-white/90 font-medium">{formatNumericDate(day.date)}</span>
                    </button>
                  ))
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-inter">
                    <Calendar className="w-3.5 h-3.5 text-sougen-blue shrink-0" />
                    <span className="text-white/90 font-medium">{formatNumericDate(event.startDate)} - {formatNumericDate(event.endDate)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <Button asChild size="lg" variant="primary" className="font-bold font-inter text-xs sm:text-sm px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl gap-2 shadow-md transition-colors">
                <Link to={`/gallery/${event.slug}`}>
                  <ImageIcon className="w-4 h-4" />
                  <span>Lihat Galeri</span>
                </Link>
              </Button>

              {event.googleDriveUrl && (
                <Button asChild size="lg" variant="outlined-on-dark" className="bg-white/10 hover:bg-white/20 border-white/25 text-white hover:text-white font-bold font-inter text-xs sm:text-sm px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl transition-colors">
                  <a href={event.googleDriveUrl} target="_blank" rel="noopener noreferrer">
                    <FolderArchive className="w-4 h-4" />
                    <span>Arsip GDrive</span>
                  </a>
                </Button>
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
        <div className={cn(
          "md:hidden w-full max-w-[88%] mx-auto animate-in fade-in slide-in-from-bottom-3 duration-1000 mt-2 relative z-10 transition-transform duration-500",
          isBouncing && !hasScrolled && "animate-ticket-bounce"
        )}>
          <div className="relative flex flex-col bg-white rounded-[20px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]">

            {/* ── Bagian 1: Header — Nama Brand Resmi ── */}
            <div className="relative px-6 pt-5 pb-4 text-center">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-sougen-blue" />
              <div className="font-poppins font-black text-sougen-blue text-[1.15rem] tracking-[0.18em] uppercase leading-none">
                Sougen Creative
              </div>
              <div className="font-inter font-bold text-gray-500 text-[0.55rem] tracking-[0.35em] uppercase mt-1.5">
                Management
              </div>
            </div>

            {/* ── Perforated tear line + notch cutouts ── */}
            <div className="relative h-[1px] mx-0">
              <div className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black/60 shadow-[inset_-2px_0_4px_rgba(0,0,0,0.3)] backdrop-blur-sm" />
              <div className="absolute -right-[10px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black/60 shadow-[inset_2px_0_4px_rgba(0,0,0,0.3)] backdrop-blur-sm" />
              <div className="mx-6 border-t border-dashed border-gray-300" />
            </div>

            {/* ── Bagian 2: Body — Info Event ── */}
            <div className="px-4 sm:px-5 pt-5 pb-4 flex flex-col items-center text-center">
              <h2 className="font-poppins font-black text-sougen-blue text-[1.4rem] leading-[1.05] uppercase tracking-tight mb-1">
                {event.name}
              </h2>
              {event.theme && (
                <div className="font-inter font-semibold text-rpo-black text-[0.65rem] uppercase tracking-[0.12em] mt-0.5 mb-1.5">
                  #{event.theme}
                </div>
              )}

              {/* Location Row */}
              <div className="flex items-center gap-1.5 text-gray-500 text-[0.65rem] mt-1 mb-3 w-full justify-center">
                <MapPin className="w-3.5 h-3.5 text-sougen-blue shrink-0" />
                <span className="font-inter truncate max-w-[220px]">{locationSummary}</span>
              </div>

              {/* Day Breakdown Chips in Mobile Ticket (Under Location - Side-by-Side Kiri & Kanan) */}
              <div className="flex items-center justify-center gap-2 w-full max-w-[290px] mx-auto">
                {days.length > 0 ? (
                  days.map(day => (
                    <button 
                      key={day.id} 
                      type="button"
                      onClick={() => handleDayClick(day.id)}
                      className="flex-1 min-w-0 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl bg-sougen-blue-dark/10 hover:bg-sougen-blue-dark hover:text-white border border-sougen-blue-dark/20 font-inter font-bold text-sougen-blue-dark text-[0.68rem] tracking-tight uppercase transition-all duration-200 active:scale-95 group cursor-pointer shadow-sm"
                      title={`Lihat jadwal rundown Day ${day.dayNumber}`}
                    >
                      <CalendarDays className="w-3 h-3 text-sougen-blue-dark group-hover:text-white shrink-0" />
                      <span className="truncate">Day {day.dayNumber}: {formatNumericDate(day.date)}</span>
                    </button>
                  ))
                ) : (
                  <span className="inline-flex items-center gap-1 font-inter font-bold text-gray-600 text-[0.65rem] tracking-[0.15em] uppercase">
                    <Calendar className="w-3.5 h-3.5 text-sougen-blue-dark" />
                    {formatNumericDate(event.startDate)} - {formatNumericDate(event.endDate)}
                  </span>
                )}
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
              <Button asChild variant="outlined" className="w-full h-11 text-[0.75rem] font-bold uppercase tracking-[0.15em] gap-2">
                <Link to={`/gallery/${event.slug}`}>
                  <ImageIcon className="w-4 h-4" />
                  <span>Lihat Galeri</span>
                </Link>
              </Button>

              {event.googleDriveUrl && (
                <Button asChild variant="outlined" className="w-full h-11 text-[0.75rem] font-bold uppercase tracking-[0.15em] gap-2">
                  <a href={event.googleDriveUrl} target="_blank" rel="noopener noreferrer">
                    <FolderArchive className="w-4 h-4" />
                    <span>Arsip GDrive</span>
                  </a>
                </Button>
              )}
            </div>

          </div>

          {/* Mobile One-Time Scroll Prompt Cue */}
          {!hasScrolled && (
            <div className="mt-3.5 flex items-center justify-center gap-1.5 text-white/80 transition-opacity duration-500 animate-pulse">
              <span className="text-[11px] font-inter font-medium tracking-wider uppercase">
                Scroll ke bawah
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-sougen-blue animate-bounce" />
            </div>
          )}
        </div>

        {/* DESKTOP LAYOUT */}
        <div className="hidden md:flex w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 items-center justify-center mt-6">
          <div className="p-8 lg:p-12 flex flex-col items-center text-center max-w-5xl w-full">

            {/* Sougen presenter line */}
            <div className="flex items-center gap-3 mb-5 lg:mb-4 opacity-90">
              <img 
                src="/images/main-logo.png" 
                alt="Logo Sougen Creative Management" 
                width={320}
                height={240}
                className="h-8 lg:h-6 w-auto object-contain" 
              />
              <span className="font-inter font-semibold text-white/80 text-xs lg:text-[10px] tracking-[0.25em] uppercase">Sougen Creative Management</span>
            </div>

            {/* Event Name & Theme */}
            {event.theme && (
              <p className="font-inter font-bold text-sougen-blue text-sm lg:text-[13px] uppercase tracking-[0.25em] mb-3">
                #{event.theme}
              </p>
            )}
            <h2 className="font-poppins text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] uppercase mb-8">
              {event.name}
            </h2>

            {/* Unified metadata breakdown */}
            <div className="flex flex-col items-center gap-4 mb-8 pb-8 border-b border-white/10 w-full max-w-3xl">
              {/* Location Row First */}
              <div className="flex items-center justify-center gap-2 text-white/90">
                <MapPin className="w-4 h-4 text-sougen-blue shrink-0" />
                <span className="font-inter font-medium text-xs lg:text-[13px] tracking-wide text-white/80">{locationSummary}</span>
              </div>

              {/* Day Breakdown Pills Under Location */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                {days.length > 0 ? (
                  days.map(day => (
                    <button 
                      key={day.id} 
                      type="button"
                      onClick={() => handleDayClick(day.id)}
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-sougen-blue hover:text-white active:scale-95 backdrop-blur-md border border-white/20 text-white shadow-sm transition-all duration-200 cursor-pointer group"
                      title={`Lihat jadwal rundown Day ${day.dayNumber}`}
                    >
                      <CalendarDays className="w-4 h-4 text-sougen-blue group-hover:text-white shrink-0" />
                      <span className="font-poppins font-bold text-xs uppercase text-sougen-blue group-hover:text-white tracking-wider">Day {day.dayNumber}:</span>
                      <span className="font-inter font-medium text-xs lg:text-[13px] text-white/90 group-hover:text-white">{formatNumericDate(day.date)}</span>
                    </button>
                  ))
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-sm">
                    <Calendar className="w-4 h-4 text-sougen-blue shrink-0" />
                    <span className="font-inter font-medium text-xs lg:text-[13px] text-white/90">
                      {formatNumericDate(event.startDate)} - {formatNumericDate(event.endDate)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-5 lg:gap-4 justify-center w-full">
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
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
