import { MapPin, Navigation, ExternalLink, CalendarDays } from 'lucide-react';
import { SectionHeader } from '../shared/SectionHeader';
import { Button } from '../ui/Button';
import type { EventDay } from '../../types/event';

export interface EventLocationSectionProps {
  location: string;
  days?: EventDay[];
}

export function EventLocationSection({ location, days = [] }: EventLocationSectionProps) {
  if (!location) return null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  const embedMapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const overrideDays = days.filter(
    d => d.locationOverride && d.locationOverride.trim() !== '' && d.locationOverride !== location
  );

  return (
    <section id="location" className="relative w-full bg-[#FAFAFA] py-7 sm:py-8 md:py-10 lg:py-12 px-4 lg:px-8 border-b border-rpo-black/5 overflow-hidden scroll-mt-16 md:scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          label="Venue & Access"
          title="LOKASI ACARA"
          description="Panduan rute dan titik temu penyelenggaraan event. Anda dapat melihat peta interaktif atau klik tombol navigasi untuk membuka Google Maps."
          align="center"
          theme="light"
          className="mb-5 sm:mb-6 md:mb-9 lg:mb-10"
        />

        {/* ── MOBILE VIEW: KARTU TERPADU (UNIFIED ALL-IN-ONE CARD) ── */}
        <div className="md:hidden mx-auto w-full max-w-[94%] bg-white border border-rpo-black/10 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5">
          {/* Bagian Atas: Info Venue */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sougen-blue/10 text-sougen-blue font-inter font-bold text-[11px] uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>Venue Utama</span>
            </div>

            <h3 className="font-poppins font-bold text-lg text-rpo-black leading-snug">
              {location}
            </h3>

            {/* Lokasi Spesifik per Hari jika ada override */}
            {overrideDays.length > 0 && (
              <div className="pt-2 space-y-1.5">
                <span className="font-poppins font-bold text-[11px] text-sougen-blue uppercase tracking-wider block">
                  Penyesuaian Lokasi Khusus:
                </span>
                {overrideDays.map(d => (
                  <div key={d.id} className="flex items-start gap-2 text-[11px] font-inter text-rpo-black/80 bg-gray-50 p-2 rounded-lg border border-black/5">
                    <CalendarDays className="w-3.5 h-3.5 text-sougen-blue shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-sougen-blue">Day {d.dayNumber}:</strong> {d.locationOverride}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bagian Tengah: Preview Peta Google Maps Terpadu */}
          <div className="relative w-full h-[190px] rounded-xl overflow-hidden border border-rpo-black/10 bg-gray-100 shadow-inner">
            <iframe
              title={`Peta Lokasi Mobile ${location}`}
              src={embedMapsUrl}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Bagian Bawah: Tombol Navigasi Utama */}
          <Button asChild size="lg" className="w-full font-inter font-bold text-xs uppercase tracking-wider gap-2 py-3 rounded-xl shadow-sm">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation className="w-4 h-4" />
              <span>Petunjuk Arah Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </Button>
        </div>

        {/* ── DESKTOP VIEW: 2-KOLOM BERDAMPINGAN ── */}
        <div className="hidden md:grid mx-auto w-full max-w-[90%] lg:max-w-[75%] grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Kolom Kiri: Detail Teks Venue */}
          <div className="col-span-5 bg-white border border-rpo-black/10 rounded-2xl p-6 lg:p-8 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-sougen-blue/10 text-sougen-blue font-inter font-bold text-xs uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Venue Utama</span>
              </div>

              <h3 className="font-poppins font-bold text-xl lg:text-2xl text-rpo-black leading-snug">
                {location}
              </h3>

              <p className="font-inter text-rpo-black/70 text-sm leading-relaxed">
                Pastikan Anda tiba lebih awal sebelum gerbang dibuka untuk menikmati seluruh rangkaian acara, stan komunitas, dan penampilan bintang tamu.
              </p>

              {/* Lokasi Spesifik per Hari jika ada override */}
              {overrideDays.length > 0 && (
                <div className="mt-4 pt-4 border-t border-black/5 space-y-2">
                  <span className="font-poppins font-bold text-xs text-sougen-blue uppercase tracking-wider block">
                    Penyesuaian Lokasi Khusus:
                  </span>
                  {overrideDays.map(d => (
                    <div key={d.id} className="flex items-start gap-2 text-xs font-inter text-rpo-black/80 bg-gray-50 p-2.5 rounded-lg border border-black/5">
                      <CalendarDays className="w-3.5 h-3.5 text-sougen-blue shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-sougen-blue">Day {d.dayNumber}:</strong> {d.locationOverride}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 mt-6 border-t border-black/5 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto font-inter font-bold text-xs uppercase tracking-wider gap-2 shadow-sm">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                  <Navigation className="w-4 h-4" />
                  <span>Petunjuk Arah Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </Button>
            </div>
          </div>

          {/* Kolom Kanan: Live Interactive Google Maps Preview Card */}
          <div className="col-span-7 relative min-h-[300px] md:min-h-[360px] rounded-2xl overflow-hidden border border-rpo-black/10 shadow-sm bg-gray-100 flex flex-col justify-between group">
            {/* Embedded Live Google Maps */}
            <div className="absolute inset-0 w-full h-full">
              <iframe
                title={`Peta Lokasi Desktop ${location}`}
                src={embedMapsUrl}
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Top Venue Floating Pill */}
            <div className="relative z-10 p-3 pointer-events-none flex justify-start">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-black/10 text-rpo-black text-xs font-poppins font-bold shadow-md">
                <MapPin className="w-3.5 h-3.5 text-sougen-blue shrink-0" />
                <span className="truncate max-w-[200px] sm:max-w-[260px]">{location}</span>
              </div>
            </div>

            {/* Bottom Overlay CTA to Google Maps */}
            <div className="relative z-10 p-3 flex justify-end">
              <a 
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/95 hover:bg-white backdrop-blur-md border border-black/10 rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 group-hover:border-sougen-blue/50 text-xs font-poppins font-bold text-rpo-black"
              >
                <Navigation className="w-4 h-4 text-sougen-blue" />
                <span>Buka di Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-sougen-blue opacity-80" />
              </a>
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className="mt-6 sm:mt-7 md:mt-8 lg:mt-10 w-full h-1.5 md:h-2 bg-sougen-blue rounded-full mx-auto max-w-[85%] lg:max-w-[75%]" />
      </div>
    </section>
  );
}
