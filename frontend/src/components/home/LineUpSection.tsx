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
      const scrollAmount = direction === 'left' ? -234 : 234;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.classList.add('cursor-grabbing');
      scrollContainerRef.current.classList.remove('cursor-grab', 'snap-x', 'snap-mandatory', 'scroll-smooth');
      startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
      scrollLeft.current = scrollContainerRef.current.scrollLeft;
    }
  };

  const onMouseLeaveOrUp = () => {
    isDragging.current = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.classList.remove('cursor-grabbing');
      scrollContainerRef.current.classList.add('cursor-grab', 'snap-x', 'snap-mandatory', 'scroll-smooth');
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    if (scrollContainerRef.current) {
      const x = e.pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startX.current) * 2;
      scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
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
        
        {/* Unified Responsive Cards Container */}
        <div className="mx-auto max-w-[85%] lg:max-w-[75%]">
          {/* Horizontal scroll on desktop, 2x2 grid on mobile */}
          <div 
            ref={scrollContainerRef}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeaveOrUp}
            onMouseUp={onMouseLeaveOrUp}
            onMouseMove={onMouseMove}
            className="grid grid-cols-2 gap-4 lg:flex lg:overflow-x-auto lg:snap-x lg:snap-mandatory lg:pb-6 lg:gap-6 lg:no-scrollbar lg:scroll-smooth lg:cursor-grab lg:select-none"
          >
            {performers.map((talent, idx) => (
              <div 
                key={talent.id} 
                className={`shrink-0 w-full lg:w-[210px] lg:snap-start ${idx >= 4 ? 'hidden lg:block' : ''}`}
              >
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

          {/* Mobile Footer */}
          {performers.length > 4 && (
            <div className="flex justify-end mt-6 lg:hidden">
              <Link 
                to="/talents" 
                className="inline-flex items-center gap-1.5 text-xs font-inter font-bold text-sougen-blue-dark hover:text-sougen-blue transition-colors duration-300"
              >
                <span>Lihat selengkapnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Desktop Footer (Arrows & Link) */}
          <div className="hidden lg:flex items-center justify-end gap-8 mt-6 pr-2">
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
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => scroll('left')}
                  className="p-2.5 rounded-full border border-rpo-black/10 bg-white hover:bg-sougen-blue hover:text-white hover:border-sougen-blue text-rpo-black/60 shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sougen-blue/20"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => scroll('right')}
                  className="p-2.5 rounded-full border border-rpo-black/10 bg-white hover:bg-sougen-blue hover:text-white hover:border-sougen-blue text-rpo-black/60 shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sougen-blue/20"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Unified Section Divider */}
          <div className="mt-10 lg:mt-12 w-full h-1.5 lg:h-2 bg-sougen-blue rounded-full" />
        </div>
      </div>
    </section>
  );
}
