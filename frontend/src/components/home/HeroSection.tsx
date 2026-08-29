import { useState, useEffect } from 'react';
import type { ActiveEvent } from '../../types/event';
import { Button } from '../ui/Button';
import { AnimationText } from './AnimationText';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, ExternalLink } from 'lucide-react';
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton';
import type { SiteSettings } from '../../hooks/useSiteSettings';
import { getImageUrl } from '../../utils/getImageUrl';
import { RunningTextBanner } from './RunningTextBanner';

function extractDominantColor(imgSrc: string, callback: (color: string) => void) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = imgSrc;
  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = 40;
      canvas.height = 40;
      ctx.drawImage(img, 0, 0, 40, 40);
      const data = ctx.getImageData(0, 0, 40, 40).data;
      
      let maxScore = -1;
      let bestR = 0, bestG = 148, bestB = 222; // default sougen blue

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a < 128) continue; // skip transparent

        // Cari warna dengan saturasi dan kecerahan hidup
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;
        const saturation = max === 0 ? 0 : delta / max;
        const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

        if (saturation > 0.25 && brightness > 0.3 && brightness < 0.95) {
          const score = saturation * 2 + (1 - Math.abs(brightness - 0.6));
          if (score > maxScore) {
            maxScore = score;
            bestR = r;
            bestG = g;
            bestB = b;
          }
        }
      }

      if (maxScore > -1) {
        callback(`rgb(${bestR}, ${bestG}, ${bestB})`);
      }
    } catch {
      callback('#0094DE');
    }
  };
  img.onerror = () => callback('#0094DE');
}

export interface HeroSectionProps {
  event: ActiveEvent | null;
  settings?: SiteSettings | null;
}

export function HeroSection({ event, settings }: HeroSectionProps) {
  const mode = event?.heroMode || 'TEMPLATE';
  const hasEvent = !!event;
  const [accentColor, setAccentColor] = useState<string>('#0094DE');

  useEffect(() => {
    const rawTargetImage = mode === 'POSTER' ? event?.heroImageUrl : (settings?.heroImageUrl || event?.heroImageUrl);
    if (rawTargetImage) {
      const fullUrl = getImageUrl(rawTargetImage);
      extractDominantColor(fullUrl, (color) => {
        setAccentColor(color);
      });
    }
  }, [mode, event?.heroImageUrl, settings?.heroImageUrl]);

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
          {/* Cinematic gradient overlay with ultra-subtle backdrop blur */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/75 backdrop-blur-[2px]" />
          
          {/* MOBILE: Modern Holographic Festival Pass (Concept A Refined) */}
          <div className="md:hidden w-full max-w-[325px] mx-auto px-4 relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="relative flex flex-col bg-white rounded-[22px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.15)]">
              
              {/* Top Accent Gradient Stripe with Dynamic Color */}
              <div 
                style={{ background: `linear-gradient(to right, ${accentColor}, #00D2FF, ${accentColor})` }} 
                className="absolute top-0 left-0 right-0 h-[3.5px] transition-all duration-500" 
              />

              {/* ── Header: Lanyard Slot & Official Header ── */}
              <div className="pt-3.5 pb-2.5 px-5 text-center flex flex-col items-center">
                {/* Lanyard Hole Cutout */}
                <div className="w-10 h-1.5 rounded-full bg-gray-200/80 mb-2 border border-black/5" />
                
                <div className="font-poppins font-black text-rpo-black text-[1.1rem] tracking-[0.15em] uppercase leading-none">
                  Sougen Creative
                </div>
                
                <div 
                  style={{ color: accentColor, backgroundColor: `${accentColor}15` }} 
                  className="inline-flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-widest mt-1.5 px-2.5 py-0.5 rounded-full transition-colors duration-500"
                >
                  <span style={{ backgroundColor: accentColor }} className="w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-500" />
                  OFFICIAL EVENT PASS
                </div>
              </div>

              {/* ── Perforated Tear Line with Notch Cutouts ── */}
              <div className="relative h-[1px] my-1">
                <div className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-rpo-black shadow-[inset_-2px_0_4px_rgba(0,0,0,0.6)]" />
                <div className="absolute -right-[10px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-rpo-black shadow-[inset_2px_0_4px_rgba(0,0,0,0.6)]" />
                <div className="mx-6 border-t-2 border-dashed border-gray-200" />
              </div>

              {/* ── Body: Event Details & Metadata Specs ── */}
              <div className="p-5 pt-3 text-center flex flex-col items-center">
                {/* Theme Tag */}
                {event.theme && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-gray-100 text-rpo-black/80 font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
                    <span style={{ color: accentColor }} className="font-black transition-colors duration-500">#</span> {event.theme}
                  </span>
                )}

                {/* Event Name with Dynamic Accent Color */}
                <h2 
                  style={{ color: accentColor }} 
                  className="font-poppins font-black text-xl leading-tight uppercase tracking-tight mb-3 transition-colors duration-500"
                >
                  {event.name}
                </h2>

                {/* Metadata Box */}
                <div className="w-full bg-[#FAFAFA] rounded-xl p-3 border border-black/5 space-y-2 text-left">
                  {/* Tanggal */}
                  <div className="flex items-center gap-2.5">
                    <div 
                      style={{ backgroundColor: `${accentColor}15`, color: accentColor }} 
                      className="p-1.5 rounded-lg shrink-0 transition-colors duration-500"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-mono text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                        TANGGAL
                      </span>
                      <span className="font-inter font-bold text-[11px] text-rpo-black mt-0.5 truncate">
                        {formatDate(event.startDate, event.endDate)}
                      </span>
                    </div>
                  </div>

                  <div className="h-[1px] w-full bg-black/5" />

                  {/* Lokasi (Interactive Google Maps Link) */}
                  {event.location ? (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/loc flex items-center gap-2.5 hover:bg-black/5 p-1 -m-1 rounded-lg transition-colors duration-200"
                    >
                      <div 
                        style={{ backgroundColor: `${accentColor}15`, color: accentColor }} 
                        className="p-1.5 rounded-lg shrink-0 transition-colors duration-500"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-mono text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none flex items-center gap-1">
                          LOKASI <ExternalLink className="w-2.5 h-2.5 opacity-50 group-hover/loc:opacity-100 transition-opacity" />
                        </span>
                        <span className="font-inter font-bold text-[11px] text-rpo-black mt-0.5 truncate group-hover/loc:text-sougen-blue group-hover/loc:underline transition-colors">
                          {event.location}
                        </span>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <div 
                        style={{ backgroundColor: `${accentColor}15`, color: accentColor }} 
                        className="p-1.5 rounded-lg shrink-0 transition-colors duration-500"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-mono text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                          LOKASI
                        </span>
                        <span className="font-inter font-bold text-[11px] text-rpo-black mt-0.5 truncate">
                          Belum ditentukan
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Perforated Tear Line with Notch Cutouts ── */}
              <div className="relative h-[1px] my-0">
                <div className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-rpo-black shadow-[inset_-2px_0_4px_rgba(0,0,0,0.6)]" />
                <div className="absolute -right-[10px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-rpo-black shadow-[inset_2px_0_4px_rgba(0,0,0,0.6)]" />
                <div className="mx-6 border-t-2 border-dashed border-gray-200" />
              </div>

              {/* ── Footer Stub: Actions ── */}
              <div className="p-4 bg-gray-50/80 flex flex-col gap-2">
                <Button asChild className="w-full h-10 text-xs font-bold uppercase tracking-wider shadow-sm" variant="primary">
                  <Link to={`/event/${event.slug}`}>Lihat Detail Event</Link>
                </Button>

                {event.registrationUrl && (
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-9 inline-flex items-center justify-center gap-1.5 px-4 bg-white hover:bg-sougen-blue hover:text-white text-rpo-black border border-black/10 rounded-xl transition-all duration-300 font-inter text-xs font-bold shadow-sm"
                  >
                    <Ticket style={{ color: accentColor }} className="w-3.5 h-3.5 transition-colors duration-500" />
                    Beli Tiket Sekarang
                  </a>
                )}
              </div>

            </div>
          </div>

          {/* DESKTOP: Centered glass card layout */}
          <div className="hidden md:flex absolute inset-0 z-10 flex-col items-center justify-center px-6">
            <div className="p-10 lg:p-14 flex flex-col items-center text-center max-w-5xl w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 -translate-y-8 lg:-translate-y-12">
              
              {/* RPO presenter line - Option 2 */}
              <div className="flex items-center justify-center gap-3 mb-5 lg:mb-4">
                <span className="w-5 lg:w-7 h-[2px] bg-sougen-blue shadow-[0_0_8px_#0094DE]" />
                <span className="font-inter font-black text-white text-xs lg:text-sm tracking-[0.25em] uppercase [text-shadow:0_2px_12px_rgba(0,0,0,0.95),0_0_20px_rgba(0,0,0,0.8)]">
                  Sougen Creative Management
                </span>
                <span className="w-5 lg:w-7 h-[2px] bg-sougen-blue shadow-[0_0_8px_#0094DE]" />
              </div>

              {/* Event Theme - Option 1 */}
              {event.theme && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white font-inter text-xs lg:text-[12px] uppercase tracking-[0.18em] mb-4 lg:mb-3 shadow-[0_2px_10px_rgba(0,0,0,0.25)]">
                  <span style={{ color: accentColor }} className="font-mono font-black text-[11px] transition-colors duration-500">#THEME</span>
                  <span className="font-bold text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">{event.theme}</span>
                </div>
              )}
              <h1 
                style={{ WebkitTextStroke: `1px ${accentColor}` }}
                className="font-poppins text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-[#BBE7FF] tracking-tight leading-[1.08] uppercase mb-8 lg:mb-6 [filter:drop-shadow(0_3px_12px_rgba(0,0,0,0.5))] transition-all duration-700"
              >
                {event.name}
              </h1>

              {/* Unified metadata row - Concept B (Japanese Festival Dual-Border Strip) */}
              <div className="w-full max-w-2xl flex flex-wrap items-center justify-around py-3 px-6 border-y border-white/20 backdrop-blur-[2px] mb-8 lg:mb-6">
                {/* Tanggal */}
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <Calendar style={{ color: accentColor }} className="w-4 h-4 transition-colors duration-700" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-mono text-[10px] font-bold text-white/50 uppercase tracking-[0.25em] leading-none">
                      DATE
                    </span>
                    <span className="font-inter font-bold text-xs lg:text-[13px] text-white uppercase tracking-wider mt-1 [text-shadow:0_1px_5px_rgba(0,0,0,0.5)]">
                      {formatDate(event.startDate, event.endDate)}
                    </span>
                  </div>
                </div>

                {/* Divider Vertikal */}
                <div className="hidden sm:block h-7 w-[1px] bg-white/20" />

                {/* Lokasi */}
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <MapPin style={{ color: accentColor }} className="w-4 h-4 transition-colors duration-700" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-mono text-[10px] font-bold text-white/50 uppercase tracking-[0.25em] leading-none">
                      VENUE
                    </span>
                    <span className="font-inter font-bold text-xs lg:text-[13px] text-white uppercase tracking-wider mt-1 [text-shadow:0_1px_5px_rgba(0,0,0,0.5)]">
                      {event.location}
                    </span>
                  </div>
                </div>

                {event.registrationUrl && (
                  <>
                    <div className="hidden md:block h-7 w-[1px] bg-white/20" />
                    <div className="flex flex-col text-left">
                      <span style={{ color: accentColor }} className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] leading-none transition-colors duration-700">
                        STATUS
                      </span>
                      <span className="font-mono font-bold text-xs text-white uppercase tracking-wider mt-1 flex items-center gap-1.5">
                        <span style={{ backgroundColor: accentColor }} className="w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-700" />
                        AVAILABLE
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-5 lg:gap-4 justify-center w-full">
                {event.isActive && event.registrationUrl && (
                  <Button asChild size="lg" variant="primary-on-dark" className="px-12 h-14 lg:px-10 lg:h-11 text-sm lg:text-xs tracking-widest shadow-[0_4px_24px_rgba(0,148,222,0.3)]">
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
            {/* Cinematic gradient overlay for better text contrast with ultra-subtle backdrop blur */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 backdrop-blur-[2px] pointer-events-none" />
          </>
        )}

        <div className="relative z-10 max-w-5xl w-full mx-auto text-center flex flex-col items-center md:mt-16">
          {hasEvent ? (
            <>
              {/* MOBILE: Modern Holographic Festival Pass (Concept A Refined) */}
              <div className="md:hidden w-full max-w-[325px] mx-auto px-4 relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700 mt-2">
                <div className="relative flex flex-col bg-white rounded-[22px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.15)]">
                  
                  {/* Top Accent Gradient Stripe with Dynamic Color */}
                  <div 
                    style={{ background: `linear-gradient(to right, ${accentColor}, #00D2FF, ${accentColor})` }} 
                    className="absolute top-0 left-0 right-0 h-[3.5px] transition-all duration-500" 
                  />

                  {/* ── Header: Lanyard Slot & Official Header ── */}
                  <div className="pt-3.5 pb-2.5 px-5 text-center flex flex-col items-center">
                    {/* Lanyard Hole Cutout */}
                    <div className="w-10 h-1.5 rounded-full bg-gray-200/80 mb-2 border border-black/5" />
                    
                    <div className="font-poppins font-black text-rpo-black text-[1.1rem] tracking-[0.15em] uppercase leading-none">
                      Sougen Creative
                    </div>
                    
                    <div 
                      style={{ color: accentColor, backgroundColor: `${accentColor}15` }} 
                      className="inline-flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-widest mt-1.5 px-2.5 py-0.5 rounded-full transition-colors duration-500"
                    >
                      <span style={{ backgroundColor: accentColor }} className="w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-500" />
                      OFFICIAL EVENT PASS
                    </div>
                  </div>

                  {/* ── Perforated Tear Line with Notch Cutouts ── */}
                  <div className="relative h-[1px] my-1">
                    <div className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-rpo-black shadow-[inset_-2px_0_4px_rgba(0,0,0,0.6)]" />
                    <div className="absolute -right-[10px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-rpo-black shadow-[inset_2px_0_4px_rgba(0,0,0,0.6)]" />
                    <div className="mx-6 border-t-2 border-dashed border-gray-200" />
                  </div>

                  {/* ── Body: Event Details & Metadata Specs ── */}
                  <div className="p-5 pt-3 text-center flex flex-col items-center">
                    {/* Theme Tag */}
                    {event.theme && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-gray-100 text-rpo-black/80 font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
                        <span style={{ color: accentColor }} className="font-black transition-colors duration-500">#</span> {event.theme}
                      </span>
                    )}

                    {/* Event Name with Dynamic Accent Color */}
                    <h2 
                      style={{ color: accentColor }} 
                      className="font-poppins font-black text-xl leading-tight uppercase tracking-tight mb-3 transition-colors duration-500"
                    >
                      {event.name}
                    </h2>

                    {/* Metadata Box */}
                    <div className="w-full bg-[#FAFAFA] rounded-xl p-3 border border-black/5 space-y-2 text-left">
                      {/* Tanggal */}
                      <div className="flex items-center gap-2.5">
                        <div 
                          style={{ backgroundColor: `${accentColor}15`, color: accentColor }} 
                          className="p-1.5 rounded-lg shrink-0 transition-colors duration-500"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-mono text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                            TANGGAL
                          </span>
                          <span className="font-inter font-bold text-[11px] text-rpo-black mt-0.5 truncate">
                            {formatDate(event.startDate, event.endDate)}
                          </span>
                        </div>
                      </div>

                      <div className="h-[1px] w-full bg-black/5" />

                      {/* Lokasi (Interactive Google Maps Link) */}
                      {event.location ? (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/loc flex items-center gap-2.5 hover:bg-black/5 p-1 -m-1 rounded-lg transition-colors duration-200"
                        >
                          <div 
                            style={{ backgroundColor: `${accentColor}15`, color: accentColor }} 
                            className="p-1.5 rounded-lg shrink-0 transition-colors duration-500"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="font-mono text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none flex items-center gap-1">
                              LOKASI <ExternalLink className="w-2.5 h-2.5 opacity-50 group-hover/loc:opacity-100 transition-opacity" />
                            </span>
                            <span className="font-inter font-bold text-[11px] text-rpo-black mt-0.5 truncate group-hover/loc:text-sougen-blue group-hover/loc:underline transition-colors">
                              {event.location}
                            </span>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <div 
                            style={{ backgroundColor: `${accentColor}15`, color: accentColor }} 
                            className="p-1.5 rounded-lg shrink-0 transition-colors duration-500"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-mono text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                              LOKASI
                            </span>
                            <span className="font-inter font-bold text-[11px] text-rpo-black mt-0.5 truncate">
                              Belum ditentukan
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Perforated Tear Line with Notch Cutouts ── */}
                  <div className="relative h-[1px] my-0">
                    <div className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-rpo-black shadow-[inset_-2px_0_4px_rgba(0,0,0,0.6)]" />
                    <div className="absolute -right-[10px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-rpo-black shadow-[inset_2px_0_4px_rgba(0,0,0,0.6)]" />
                    <div className="mx-6 border-t-2 border-dashed border-gray-200" />
                  </div>

                  {/* ── Footer Stub: Actions ── */}
                  <div className="p-4 bg-gray-50/80 flex flex-col gap-2">
                    <Button asChild className="w-full h-10 text-xs font-bold uppercase tracking-wider shadow-sm" variant="primary">
                      <Link to={`/event/${event.slug}`}>Lihat Detail Event</Link>
                    </Button>

                    {event.registrationUrl && (
                      <a
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-9 inline-flex items-center justify-center gap-1.5 px-4 bg-white hover:bg-sougen-blue hover:text-white text-rpo-black border border-black/10 rounded-xl transition-all duration-300 font-inter text-xs font-bold shadow-sm"
                      >
                        <Ticket style={{ color: accentColor }} className="w-3.5 h-3.5 transition-colors duration-500" />
                        Beli Tiket Sekarang
                      </a>
                    )}
                  </div>

                </div>
              </div>

              {/* DESKTOP LAYOUT (Point 11) */}
              <div className="hidden md:flex w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 items-center justify-center mt-10">
                <div className="p-10 lg:p-14 flex flex-col items-center text-center max-w-5xl w-full -translate-y-8 lg:-translate-y-12">
                  
                  {/* RPO presenter line - Option 2 */}
                  <div className="flex items-center justify-center gap-3 mb-5 lg:mb-4">
                    <span className="w-5 lg:w-7 h-[2px] bg-sougen-blue shadow-[0_0_8px_#0094DE]" />
                    <span className="font-inter font-black text-white text-xs lg:text-sm tracking-[0.25em] uppercase [text-shadow:0_2px_12px_rgba(0,0,0,0.95),0_0_20px_rgba(0,0,0,0.8)]">
                      Sougen Creative Management
                    </span>
                    <span className="w-5 lg:w-7 h-[2px] bg-sougen-blue shadow-[0_0_8px_#0094DE]" />
                  </div>

                  {/* Event Theme - Option 1 */}
                  {event.theme && (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white font-inter text-xs lg:text-[12px] uppercase tracking-[0.18em] mb-4 lg:mb-3 shadow-[0_2px_10px_rgba(0,0,0,0.25)]">
                      <span style={{ color: accentColor }} className="font-mono font-black text-[11px] transition-colors duration-500">#THEME</span>
                      <span className="font-bold text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">{event.theme}</span>
                    </div>
                  )}
                  <h1 
                    style={{ WebkitTextStroke: `1px ${accentColor}` }}
                    className="font-poppins text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-[#BBE7FF] tracking-tight leading-[1.08] uppercase mb-8 lg:mb-6 [filter:drop-shadow(0_3px_12px_rgba(0,0,0,0.5))] transition-all duration-700"
                  >
                    {event.name}
                  </h1>

                  {/* Unified metadata row - Concept B (Japanese Festival Dual-Border Strip) */}
                  <div className="w-full max-w-2xl flex flex-wrap items-center justify-around py-3 px-6 border-y border-white/20 backdrop-blur-[2px] mb-8 lg:mb-6">
                    {/* Tanggal */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        <Calendar style={{ color: accentColor }} className="w-4 h-4 transition-colors duration-700" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[10px] font-bold text-white/50 uppercase tracking-[0.25em] leading-none">
                          DATE
                        </span>
                        <span className="font-inter font-bold text-xs lg:text-[13px] text-white uppercase tracking-wider mt-1 [text-shadow:0_1px_5px_rgba(0,0,0,0.5)]">
                          {formatDate(event.startDate, event.endDate)}
                        </span>
                      </div>
                    </div>

                    {/* Divider Vertikal */}
                    <div className="hidden sm:block h-7 w-[1px] bg-white/20" />

                    {/* Lokasi */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        <MapPin style={{ color: accentColor }} className="w-4 h-4 transition-colors duration-700" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[10px] font-bold text-white/50 uppercase tracking-[0.25em] leading-none">
                          VENUE
                        </span>
                        <span className="font-inter font-bold text-xs lg:text-[13px] text-white uppercase tracking-wider mt-1 [text-shadow:0_1px_5px_rgba(0,0,0,0.5)]">
                          {event.location}
                        </span>
                      </div>
                    </div>

                    {event.registrationUrl && (
                      <>
                        <div className="hidden md:block h-7 w-[1px] bg-white/20" />
                        <div className="flex flex-col text-left">
                          <span style={{ color: accentColor }} className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] leading-none transition-colors duration-700">
                            STATUS
                          </span>
                          <span className="font-mono font-bold text-xs text-white uppercase tracking-wider mt-1 flex items-center gap-1.5">
                            <span style={{ backgroundColor: accentColor }} className="w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-700" />
                            AVAILABLE
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* CTA buttons */}
                  <div className="flex flex-wrap gap-5 lg:gap-4 justify-center w-full">
                    {event.isActive && event.registrationUrl && (
                      <Button asChild size="lg" variant="primary-on-dark" className="px-12 h-14 lg:px-10 lg:h-11 text-sm lg:text-xs tracking-widest shadow-[0_4px_24px_rgba(0,148,222,0.3)]">
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
              <div className="mb-5 lg:mb-3 relative z-10 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-3 duration-1000 w-full">
                {/* Logo Utama */}
                <div className="relative flex items-center justify-center w-48 md:w-64 lg:w-56 mb-2">
                  {settings?.logoUrl ? (
                    <img src={getImageUrl(settings.logoUrl)} alt="Logo Sougen Creative Management" className="w-full h-auto object-contain z-10" />
                  ) : (
                    <img src="/images/main-logo.png" alt="Logo Resmi Sougen Creative Management" className="w-full h-auto object-contain z-10" />
                  )}
                </div>

                {/* Nama Brand */}
                <div className="flex flex-col justify-center">
                  <h1 className="font-poppins font-black text-[#ffffff] text-[1.5rem] md:text-[1.8rem] lg:text-[1.6rem] leading-none tracking-tight [text-shadow:0_4px_10px_rgba(0,0,0,0.4)] uppercase text-center w-full">
                    Sougen Creative Management
                  </h1>
                </div>
              </div>

              <p className="max-w-2xl text-sm lg:text-[13px] text-white/70 mb-5 lg:mb-4 leading-relaxed font-inter mx-auto text-center">
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
