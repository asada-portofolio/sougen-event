import { useRef } from 'react';
import type { Talent } from '../../types/event';
import { TalentCard } from '../shared/TalentCard';
import { SectionHeader } from '../shared/SectionHeader';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export interface LineUpSectionProps {
  performers: Talent[];
}

export function LineUpSection({ performers }: LineUpSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -231 : 231;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    isDragging.current = true;
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
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.6;
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

  if (!performers || performers.length === 0) return null;

  return (
    <section className="relative w-full bg-[#FAFAFA] pt-12 md:pt-16 pb-6 md:pb-8 px-4 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader 
          label="Let's Get To Know"
          title="Our Line-Up" 
          description="Saksikan penampilan spektakuler dari cosplayer, grup idol, hingga musisi lokal yang biasa bekerja sama dengan kami."
          align="center"
          theme="light"
          className="mb-12"
        />
        
        {/* Mobile View: Grid 2x2 */}
        <div className="lg:hidden mt-8 mx-auto max-w-[85%]">
          <div className="grid grid-cols-2 gap-4">
            {performers.slice(0, 4).map((talent) => (
              <div key={talent.id}>
                <TalentCard
                  name={talent.stageName}
                  role="PERFORMER"
                  imageUrl={talent.profileImageUrl || ''}
                  instagramUrl={talent.instagramUrl || ''}
                  followerCount={talent.followerCount}
                  postCount={talent.postCount}
                />
              </div>
            ))}
          </div>
          
          {/* Tombol "lihat selengkapnya" di sudut kanan bawah jika lebih dari 4 */}
          {performers.length > 4 && (
            <div className="flex justify-end mt-6">
              <Link 
                to="/talents" 
                className="inline-flex items-center gap-1.5 text-xs font-inter font-bold text-sougen-blue hover:text-sougen-green-dark transition-colors duration-300"
              >
                <span>Lihat selengkapnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Desktop View: Constrained to match divider width */}
        <div className="hidden lg:block mx-auto max-w-[75%]">
          {/* Horizontal scroll for performers */}
          <div 
            ref={scrollContainerRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUpOrCancel}
            onPointerCancel={onPointerUpOrCancel}
            className="flex mt-8 overflow-x-auto snap-x snap-mandatory pb-2 gap-4 no-scrollbar scroll-smooth cursor-grab select-none touch-pan-x"
          >
            {performers.map((talent) => (
              <div key={talent.id} className="snap-start shrink-0 w-[215px]">
                <TalentCard
                  name={talent.stageName}
                  role="PERFORMER"
                  imageUrl={talent.profileImageUrl || ''}
                  instagramUrl={talent.instagramUrl || ''}
                  followerCount={talent.followerCount}
                  postCount={talent.postCount}
                />
              </div>
            ))}
          </div>

          {/* Footer (Arrows & Link) */}
          <div className="flex items-center justify-end gap-6 mt-4 pr-1">
            {/* "Lihat semua" link */}
            <Link 
              to="/talents" 
              className="inline-flex items-center gap-2 text-sm font-inter font-semibold text-rpo-black/60 hover:text-sougen-blue transition-colors duration-300"
            >
              <span>Lihat semua</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Arrow Buttons */}
            {performers.length > 4 && (
              <div className="flex items-center gap-2.5">
                <button 
                  onClick={() => scroll('left')}
                  className="p-2 rounded-full border border-rpo-black/10 bg-white hover:bg-sougen-blue hover:text-white hover:border-sougen-blue text-rpo-black/60 shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-sougen-blue/20"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => scroll('right')}
                  className="p-2 rounded-full border border-rpo-black/10 bg-white hover:bg-sougen-blue hover:text-white hover:border-sougen-blue text-rpo-black/60 shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-sougen-blue/20"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 w-full h-2 bg-sougen-blue rounded-full" />
        </div>

        <div className="lg:hidden mt-10 w-full h-1.5 bg-sougen-blue rounded-full mx-auto max-w-[85%]" />
      </div>
    </section>
  );
}
