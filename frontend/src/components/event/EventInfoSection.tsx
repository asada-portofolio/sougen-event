import { MapPin, CalendarDays } from 'lucide-react';
import type { EventDay } from '../../types/event';

export interface EventInfoSectionProps {
  days: EventDay[];
  defaultLocation: string;
}

export function EventInfoSection({ days, defaultLocation }: EventInfoSectionProps) {
  if (!days || days.length === 0) return null;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Determine locations
  const overrideDays = days.filter(d => d.locationOverride && d.locationOverride.trim() !== '' && d.locationOverride !== defaultLocation);
  let locationText = defaultLocation;
  
  if (overrideDays.length > 0) {
    const overrideText = overrideDays.map(d => `Day ${d.dayNumber}: ${d.locationOverride}`).join(' | ');
    locationText = `Utama: ${defaultLocation} | Khusus ${overrideText}`;
  }

  return (
    <section className="w-full bg-[#FAFAFA] pt-8 pb-6 border-b border-rpo-black/5">
      <div className="w-full max-w-[85%] md:max-w-4xl mx-auto space-y-4">
        {/* Days Grid */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 justify-center">
          {days.map((day) => (
            <div 
              key={day.id} 
              className="bg-white border border-rpo-black/10 rounded-[12px] md:rounded-[16px] p-2.5 md:p-4 flex flex-col items-center justify-center gap-1 md:gap-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow duration-300 flex-1 min-w-[120px] md:min-w-[140px] max-w-[180px] md:max-w-[220px]"
            >
              <div className="flex items-center gap-1 md:gap-1.5 text-rpo-red mb-0.5">
                <CalendarDays className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="font-poppins font-black text-xs md:text-sm uppercase tracking-wider">
                  Day {day.dayNumber}
                </span>
              </div>
              <span className="font-inter font-bold text-rpo-black/80 text-xs md:text-sm">
                {formatDate(day.date)}
              </span>
            </div>
          ))}
        </div>

        {/* Location Card */}
        <div className="bg-white border border-rpo-black/10 rounded-[12px] md:rounded-[16px] p-3 md:p-5 flex items-start sm:items-center gap-3 md:gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow duration-300 w-full">
          <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-rpo-red/10 text-rpo-red shrink-0 mt-0.5 sm:mt-0">
            <MapPin className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="flex flex-col flex-1">
            <span className="font-poppins font-bold text-rpo-black text-[0.65rem] md:text-xs uppercase tracking-[0.15em] mb-0.5 md:mb-1">
              Lokasi Event
            </span>
            <span className="font-inter text-rpo-black/80 text-xs md:text-base font-semibold leading-relaxed">
              {locationText}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
