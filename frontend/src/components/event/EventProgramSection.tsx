import type { EventProgram } from '../../types/event';
import { ProgramCard } from '../program/ProgramCard';
import { SectionHeader } from '../shared/SectionHeader';

export interface EventProgramSectionProps {
  eventPrograms: EventProgram[];
}

export function EventProgramSection({ eventPrograms }: EventProgramSectionProps) {
  if (!eventPrograms || eventPrograms.length === 0) return null;

  return (
    <section className="relative w-full bg-white pt-7 sm:pt-8 md:pt-10 lg:pt-12 pb-4 sm:pb-6 md:pb-6 lg:pb-8 px-4 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader 
          label="Activity & Experience"
          title="Program Acara"
          description="Eksplorasi lini program reguler, kompetisi cosplay, hingga kegiatan seru komunitas yang hadir spesifik di event ini."
          align="center"
          theme="light"
          className="mb-5 sm:mb-6 md:mb-9 lg:mb-10"
        />
        
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 mx-auto w-full max-w-5xl">
          {eventPrograms.map((ep) => (
            <div key={ep.id} className="w-full max-w-[260px] sm:max-w-[280px] md:max-w-[320px]">
              <ProgramCard program={ep.program} registrationUrl={ep.registrationUrl} />
            </div>
          ))}
        </div>
        
        <div className="mt-6 sm:mt-7 md:mt-8 lg:mt-10 w-full h-1.5 md:h-2 bg-sougen-blue rounded-full mx-auto max-w-[85%] lg:max-w-[75%]" />
      </div>
    </section>
  );
}
