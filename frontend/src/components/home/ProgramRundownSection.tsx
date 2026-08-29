import { useState } from 'react';
import type { EventDay } from '../../types/event';
import { SectionHeader } from '../shared/SectionHeader';
import { cn } from '../../lib/utils';
import { Clock, MapPin, ExternalLink } from 'lucide-react';

export interface ProgramRundownSectionProps {
  days: EventDay[];
  location?: string;
}

export function ProgramRundownSection({ days, location }: ProgramRundownSectionProps) {
  const [activeDayId, setActiveDayId] = useState<number>(days?.[0]?.id || 0);

  if (!days || days.length === 0) return null;

  const activeDay = days.find((d) => d.id === activeDayId) || days[0];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  const getDayTimeRange = (day: EventDay) => {
    if (!day.rundownItems || day.rundownItems.length === 0) return '';
    const firstTime = day.rundownItems[0].time.split('-')[0].trim();
    const lastItemTime = day.rundownItems[day.rundownItems.length - 1].time;
    const lastTime = lastItemTime.includes('-') ? lastItemTime.split('-')[1].trim() : lastItemTime.trim();
    return `${firstTime} - ${lastTime}`;
  };

  return (
    <section className="w-full bg-[#FAFAFA] py-12 md:py-16 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          label="For This Event"
          title="RUNDOWN"
          description="Simak jadwal acara yang telah kami susun khusus untuk pengalaman event terbaik Anda."
          align="center"
          theme="light"
        />

        {/* Global Location (Interactive Google Maps Link) */}
        {location && (
          <div className="flex justify-center mt-6 lg:mt-8 px-4">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
              target="_blank"
              rel="noopener noreferrer"
              title={`Buka peta lokasi ${location} di Google Maps`}
              className="group inline-flex items-center gap-2.5 sm:gap-3.5 px-4 sm:px-5 py-2 bg-white hover:bg-sougen-blue/[0.04] border border-rpo-black/10 hover:border-sougen-blue/40 rounded-full shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer max-w-full"
            >
              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sougen-blue/10 text-sougen-blue group-hover:bg-sougen-blue group-hover:text-white transition-colors duration-300 shrink-0">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-[9px] sm:text-[10px] font-mono font-bold text-rpo-black/40 uppercase tracking-widest leading-none">
                  VENUE LOKASI
                </span>
                <span className="text-rpo-black/90 group-hover:text-sougen-blue font-inter font-bold text-xs sm:text-sm tracking-wide mt-0.5 sm:mt-1 transition-colors truncate">
                  {location}
                </span>
              </div>
              <div className="ml-1 pl-2.5 sm:pl-3.5 border-l border-rpo-black/10 flex items-center gap-1 text-sougen-blue text-[11px] sm:text-xs font-bold shrink-0">
                <span>Maps</span>
                <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          </div>
        )}

        {/* Mobile View: Tab Navigation (Point 31) */}
        {days.length > 1 && (
          <div className="mt-8 flex lg:hidden bg-white/50 rounded-xl p-1.5 border border-rpo-black/5 mx-auto max-w-[90%] shadow-sm overflow-hidden">
            {days.map((day) => {
              const isActive = activeDayId === day.id;
              return (
                <button
                  key={day.id}
                  onClick={() => setActiveDayId(day.id)}
                  className={cn(
                    "relative flex-1 py-2.5 text-center transition-all duration-300 font-inter font-bold uppercase text-xs tracking-wider rounded-lg",
                    isActive 
                      ? "bg-sougen-blue text-white shadow-sm z-10" 
                      : "text-rpo-black/40 hover:text-rpo-black/70"
                  )}
                >
                  Day {day.dayNumber}
                  
                  {/* Triangle Indicator for Active Tab */}
                  {isActive && (
                    <div className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-sougen-blue drop-shadow-sm z-20" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Mobile View: Active Day Timeline (Desktop Unified Style) */}
        <div className="mt-6 lg:hidden max-w-[90%] mx-auto">
          <DayTimeline 
            day={activeDay} 
            formatDate={formatDate} 
            getDayTimeRange={getDayTimeRange} 
          />
        </div>

        {/* Desktop View: Constrained to match divider width */}
        <div className="hidden lg:block mx-auto max-w-[75%]">
          {/* Side-by-side grid of all days */}
          <div 
            className="grid mt-12 gap-8 items-start"
            style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}
          >
            {days.map((day) => (
              <DayTimeline 
                key={day.id} 
                day={day} 
                formatDate={formatDate} 
                getDayTimeRange={getDayTimeRange} 
              />
            ))}
          </div>

          {/* Desktop Section Divider */}
          <div className="mt-12 w-full h-2 bg-sougen-blue rounded-full" />
        </div>

        {/* Mobile Divider (outside desktop wrapper) */}
        <div className="lg:hidden mt-10 w-full h-1.5 bg-sougen-blue rounded-full mx-auto max-w-[85%]" />

      </div>
    </section>
  );
}

function DayTimeline({ 
  day, 
  formatDate, 
  getDayTimeRange,
}: { 
  day: EventDay; 
  formatDate: (dateStr?: string) => string; 
  getDayTimeRange?: (day: EventDay) => string;
}) {
  return (
    <div className="bg-[#FAFAFA] p-4 sm:p-5 lg:p-6 rounded-2xl border border-rpo-black/5 h-full relative">
      {/* Sticky Column Header ("Nama Day yang Melayang") */}
      <div className="sticky top-16 md:top-20 z-10 bg-[#FAFAFA]/95 backdrop-blur-md pb-3 pt-1 -mx-2 px-2 border-b border-rpo-black/5 mb-4">
        <div className="flex items-center justify-between gap-2">
          <span className="bg-sougen-blue text-white font-poppins font-bold text-xs uppercase px-3 py-1 rounded-md tracking-wider shadow-sm">
            Day {day.dayNumber}
          </span>
          {getDayTimeRange && getDayTimeRange(day) && (
            <div className="flex items-center gap-1 text-sougen-blue font-mono text-[11px] font-bold bg-sougen-blue/10 px-2 py-0.5 rounded">
              <Clock className="w-3 h-3" />
              <span>{getDayTimeRange(day)}</span>
            </div>
          )}
        </div>
        <p className="text-rpo-black/70 font-inter font-semibold text-xs mt-2 tracking-wide">
          {formatDate(day.date)}
        </p>
      </div>
      
      {/* Timeline with left accent line & tighter gap */}
      <div className="relative pl-6 space-y-2.5">
        {/* Vertical accent line */}
        <div className="absolute left-2 top-2 bottom-2 w-[1.5px] bg-sougen-blue/25" />

        {day.rundownItems.map((item) => (
          <div key={item.id} className="relative group">
            {/* Dot on the timeline */}
            <div className="absolute -left-[18.5px] top-3.5 w-2.5 h-2.5 rounded-full bg-sougen-blue border-2 border-white shadow-sm group-hover:scale-125 transition-transform" />
            
            <div className="bg-white p-3 px-3.5 rounded-xl border border-rpo-black/5 hover:border-sougen-blue/40 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-1.5 text-sougen-blue font-poppins font-black text-sm lg:text-[14px] tracking-wide mb-1">
                <Clock className="w-4 h-4 stroke-[3]" />
                <span>{item.time.split('-')[0].trim()}</span>
              </div>
              <h4 className="font-poppins font-bold text-rpo-black text-[14px] lg:text-[15px] leading-snug">{item.activityName}</h4>
              
              {item.location && (
                <div className="flex items-center gap-1 text-rpo-black/50 font-inter text-xs mt-1">
                  <MapPin className="w-3 h-3 text-sougen-blue/70 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {day.rundownItems.length === 0 && (
          <p className="text-rpo-black/40 font-inter text-xs text-center italic py-6">Jadwal belum tersedia.</p>
        )}
      </div>
    </div>
  );
}
