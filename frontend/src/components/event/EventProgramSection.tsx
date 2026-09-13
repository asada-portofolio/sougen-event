import { useRef } from 'react';
import type { EventProgram } from '../../types/event';
import { ProgramCard } from '../program/ProgramCard';
import { SectionHeader } from '../shared/SectionHeader';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface EventProgramSectionProps {
  eventPrograms: EventProgram[];
}

export function EventProgramSection({ eventPrograms }: EventProgramSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasMoved = useRef(false);

  if (!eventPrograms || eventPrograms.length === 0) return null;

  const isMultiple = eventPrograms.length > 1;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      const scrollAmount = direction === 'left' ? -Math.min(containerWidth * 0.85, 320) : Math.min(containerWidth * 0.85, 320);
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // If touch event, allow native momentum scroll
    if (e.pointerType === 'touch') return;
    if (e.button !== 0) return;
    isDragging.current = true;
    hasMoved.current = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.classList.add('cursor-grabbing');
      scrollContainerRef.current.classList.remove('cursor-grab', 'snap-x', 'snap-mandatory', 'scroll-smooth');
      startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
      scrollLeft.current = scrollContainerRef.current.scrollLeft;
      try {
        scrollContainerRef.current.setPointerCapture(e.pointerId);
      } catch {}
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !scrollContainerRef.current) return;
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasMoved.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onPointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.classList.remove('cursor-grabbing');
      scrollContainerRef.current.classList.add('cursor-grab', 'snap-x', 'snap-mandatory', 'scroll-smooth');
      try {
        if (scrollContainerRef.current.hasPointerCapture(e.pointerId)) {
          scrollContainerRef.current.releasePointerCapture(e.pointerId);
        }
      } catch {}
    }
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (hasMoved.current) {
      e.stopPropagation();
      hasMoved.current = false;
    }
  };

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
        
        {/* Unified Responsive Container: Mobile horizontal slider (clipped strictly to section width) & Desktop grid */}
        <div className="mx-auto w-full max-w-[85%] lg:max-w-[75%]">
          <div 
            ref={scrollContainerRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUpOrCancel}
            onPointerCancel={onPointerUpOrCancel}
            onClickCapture={onClickCapture}
            className={cn(
              "no-scrollbar",
              // Mobile slider styles
              "flex overflow-x-auto snap-x snap-mandatory scroll-smooth cursor-grab select-none touch-pan-x gap-4 pb-2",
              // Desktop grid styles
              "md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:snap-none md:cursor-default md:select-auto md:touch-auto md:gap-6 md:pb-0"
            )}
          >
            {eventPrograms.map((ep) => (
              <div 
                key={ep.id} 
                className={cn(
                  isMultiple ? "w-[85%] sm:w-[320px] md:w-full" : "w-full",
                  "shrink-0 md:shrink snap-start h-full"
                )}
              >
                <ProgramCard program={ep.program} registrationUrl={ep.registrationUrl} />
              </div>
            ))}
          </div>

          {/* Mobile Navigation Controls & Hint */}
          {isMultiple && (
            <div className="flex md:hidden items-center justify-between mt-4 px-0.5">
              <span className="text-[11px] font-inter text-rpo-black/50 italic">
                Geser untuk melihat program lainnya
              </span>
              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={() => scroll('left')}
                  className="p-2 rounded-full border border-rpo-black/10 bg-white hover:bg-sougen-blue hover:text-white hover:border-sougen-blue text-rpo-black/60 shadow-sm transition-all duration-200 active:scale-95 focus:outline-none"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button 
                  type="button"
                  onClick={() => scroll('right')}
                  className="p-2 rounded-full border border-rpo-black/10 bg-white hover:bg-sougen-blue hover:text-white hover:border-sougen-blue text-rpo-black/60 shadow-sm transition-all duration-200 active:scale-95 focus:outline-none"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
          
          {/* Closing Section Divider */}
          <div className="mt-8 lg:mt-16 w-full h-1.5 md:h-2 bg-sougen-blue rounded-full mx-auto" />
        </div>
      </div>
    </section>
  );
}

