import type { EventProgram } from '../../types/event';
import { ProgramCard } from '../program/ProgramCard';
import { SectionHeader } from '../shared/SectionHeader';

export interface EventProgramSectionProps {
  eventPrograms: EventProgram[];
}

export function EventProgramSection({ eventPrograms }: EventProgramSectionProps) {
  if (!eventPrograms || eventPrograms.length === 0) return null;

  return (
    <section className="relative w-full bg-white pt-12 md:pt-16 pb-6 md:pb-8 px-4 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader 
          label="Activity & Experience"
          title="Program Acara"
          description="Eksplorasi lini program reguler, kompetisi cosplay, hingga kegiatan seru komunitas yang hadir spesifik di event ini."
          align="center"
          theme="light"
          className="mb-12"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto w-full max-w-[85%] lg:max-w-[75%]">
          {eventPrograms.map((ep) => (
            <div key={ep.id} className="w-full">
              <ProgramCard program={ep.program} registrationUrl={ep.registrationUrl} />
            </div>
          ))}
        </div>
        
        <div className="mt-12 lg:mt-16 w-full h-1.5 md:h-2 bg-rpo-red rounded-full mx-auto max-w-[85%] lg:max-w-[75%]" />
      </div>
    </section>
  );
}
