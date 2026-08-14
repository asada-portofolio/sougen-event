import { useState } from 'react';
import type { EventDay } from '../../types/event';
import { SectionHeader } from '../shared/SectionHeader';
import { cn } from '../../lib/utils';
import { Clock, MapPin } from 'lucide-react';

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
    <section className="w-full bg-[#FFF8F8] py-12 md:py-16 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          label="For This Event"
          title="RUNDOWN"
          description="Simak jadwal acara yang telah kami susun khusus untuk pengalaman event terbaik Anda."
          align="center"
          theme="light"
        />

        {/* Global Location (Desktop only) */}
        {location && (
          <div className="hidden lg:flex justify-center mt-8">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white border border-rpo-black/10 rounded-full shadow-sm">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rpo-red/10 text-rpo-red shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-rpo-black/80 font-inter font-semibold text-sm md:text-base">
                {location}
              </span>
            </div>
          </div>
        )}

        {/* Mobile View: Tab Navigation (Point 31) */}
        <div className="mt-10 flex lg:hidden bg-white/50 rounded-xl p-1.5 border border-rpo-black/5 mx-auto max-w-[90%] shadow-sm overflow-hidden">
          {days.map((day) => {
            const isActive = activeDayId === day.id;
            return (
              <button
                key={day.id}
                onClick={() => setActiveDayId(day.id)}
                className={cn(
                  "relative flex-1 py-3 text-center transition-all duration-300 font-inter font-bold uppercase text-sm tracking-wider rounded-lg",
                  isActive 
                    ? "bg-white text-rpo-red shadow-sm z-10" 
                    : "text-rpo-black/40 hover:text-rpo-black/70"
                )}
              >
                Day {day.dayNumber}
                
                {/* Triangle Indicator for Active Tab */}
                {isActive && (
                  <div className="absolute -bottom-[22px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-white drop-shadow-sm z-20" />
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile View: Active Day Info Header (Date+Time Left, Location Right) */}
        <div className="mt-6 lg:hidden flex justify-between items-start mx-auto max-w-[90%] bg-white p-4 rounded-xl border border-rpo-black/5 shadow-sm relative z-0">
          {/* Left: Date & Time */}
          <div className="flex flex-col gap-1.5">
            <h4 className="font-poppins font-bold text-rpo-black text-sm">{formatDate(activeDay.date)}</h4>
            <div className="flex items-center gap-1.5 text-rpo-red font-inter text-xs font-semibold bg-rpo-red/10 w-fit px-2 py-0.5 rounded-md">
              <Clock className="w-3.5 h-3.5" />
              <span>{getDayTimeRange(activeDay)}</span>
            </div>
          </div>
          
          {/* Right: Location */}
          {location && (
            <div className="flex flex-col items-end text-right gap-1 max-w-[45%]">
              <div className="flex items-center gap-1 text-rpo-black/70 font-inter text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Lokasi</span>
              </div>
              <p className="font-poppins font-semibold text-rpo-black text-xs leading-tight">{location}</p>
            </div>
          )}
        </div>

        {/* Mobile View: Active Day Timeline */}
        <div className="mt-6 lg:hidden max-w-[90%] mx-auto">
          <DayTimeline day={activeDay} formatDate={formatDate} isMobile={true} />
        </div>

        {/* Desktop View: Constrained to match divider width */}
        <div className="hidden lg:block mx-auto max-w-[75%]">
          {/* Side-by-side grid of all days */}
          <div 
            className="grid mt-12 gap-8"
            style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}
          >
            {days.map((day) => (
              <DayTimeline key={day.id} day={day} formatDate={formatDate} isMobile={false} />
            ))}
          </div>

          {/* Desktop Section Divider */}
          <div className="mt-12 w-full h-2 bg-rpo-red rounded-full" />
        </div>

        {/* Mobile Divider (outside desktop wrapper) */}
        <div className="lg:hidden mt-10 w-full h-1.5 bg-rpo-red rounded-full mx-auto max-w-[85%]" />

      </div>
    </section>
  );
}

function DayTimeline({ day, formatDate, isMobile = false }: { day: EventDay, formatDate: (dateStr?: string) => string, isMobile?: boolean }) {
  return (
    <div className="bg-[#FAFAFA] p-6 md:p-8 rounded-xl border border-rpo-black/5 h-full">
      <div className="flex items-center gap-3 mb-2">
        <span className="bg-rpo-red text-white font-poppins font-bold text-sm px-3 py-1 rounded-md">
          Day {day.dayNumber}
        </span>
      </div>
      
      {/* Show date only on Desktop, Mobile already has it in the header */}
      {!isMobile && (
        <p className="text-rpo-black/50 font-inter mb-8">{formatDate(day.date)}</p>
      )}
      
      {/* Timeline with left red line */}
      <div className={cn("relative pl-8 space-y-6", isMobile ? "mt-6" : "")}>
        {/* Vertical red line */}
        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-rpo-red/20" />

        {day.rundownItems.map((item) => (
          <div key={item.id} className="relative">
            {/* Dot on the timeline */}
            <div className="absolute -left-5 top-1.5 w-3 h-3 rounded-full bg-rpo-red border-2 border-white shadow-sm" />
            
            <div className="bg-white p-4 rounded-lg border border-rpo-black/5 hover:border-rpo-red/30 transition-colors duration-300">
              <div className="flex items-center gap-2 text-rpo-red font-inter text-sm font-bold mb-1.5">
                <Clock className="w-4 h-4" />
                <span>{item.time.split('-')[0].trim()}</span>
              </div>
              <h4 className="font-poppins font-bold text-rpo-black text-lg">{item.activityName}</h4>
              
              {/* Show item location only on Desktop, Mobile has global location in header */}
              {!isMobile && item.location && (
                <p className="text-rpo-black/50 font-inter text-sm mt-1.5">{item.location}</p>
              )}
            </div>
          </div>
        ))}
        {day.rundownItems.length === 0 && (
          <p className="text-rpo-black/50 font-inter text-center italic py-4">Jadwal belum tersedia.</p>
        )}
      </div>
    </div>
  );
}
