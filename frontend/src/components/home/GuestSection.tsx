import { useRef } from 'react';
import type { EventTalent } from '../../types/event';
import { TalentCard } from '../shared/TalentCard';
import { SectionHeader } from '../shared/SectionHeader';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export interface GuestSectionProps {
  guests: EventTalent[];
  eventSlug?: string;
}

export function GuestSection({ guests, eventSlug }: GuestSectionProps) {
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

  if (!guests || guests.length === 0) return null;

  return (
    <section className="relative w-full bg-[#FFF8F8] py-12 md:py-16 px-4 lg:px-8 overflow-hidden">
      {/* Creative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#8b0a1a 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-white/80 blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#FFEDED]/80 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader 
          label="Let's Get To Know"
          title="Our Lineup"
          description="Saksikan penampilan spektakuler dari cosplayer, grup idol, hingga musisi lokal yang siap memukau Anda."
          align="center"
          className="mb-12"
        />
        
        {/* Mobile View: Grid 2x2 */}
        <div className="lg:hidden mt-8">
          <div className="grid grid-cols-2 gap-4">
            {guests.slice(0, 4).map((et) => (
              <div key={et.id}>
                <TalentCard
                  name={et.talent.stageName}
                  role={et.role}
                  imageUrl={et.talent.profileImageUrl || ''}
                  instagramUrl={et.talent.instagramUrl || ''}
                  followerCount={et.talent.followerCount}
                  postCount={et.talent.postCount}
                />
              </div>
            ))}
          </div>
          
          {guests.length > 4 && eventSlug && (
            <div className="flex justify-end mt-6">
              <Link 
                to={`/event/${eventSlug}`} 
                className="inline-flex items-center gap-1.5 text-xs font-inter font-bold text-rpo-red hover:text-red-800 transition-colors duration-300"
              >
                <span>Lihat selengkapnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Desktop View: Constrained to match divider width */}
        <div className="hidden lg:block mx-auto max-w-[75%]">
          <div 
            ref={scrollContainerRef}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeaveOrUp}
            onMouseUp={onMouseLeaveOrUp}
            onMouseMove={onMouseMove}
            className="flex mt-12 overflow-x-auto snap-x snap-mandatory pb-6 gap-6 no-scrollbar scroll-smooth cursor-grab select-none"
          >
            {guests.map((et) => (
              <div key={et.id} className="snap-start shrink-0 w-[210px]">
                <TalentCard
                  name={et.talent.stageName}
                  role={et.role}
                  imageUrl={et.talent.profileImageUrl || ''}
                  instagramUrl={et.talent.instagramUrl || ''}
                  followerCount={et.talent.followerCount}
                  postCount={et.talent.postCount}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-8 mt-6 pr-2">
            {eventSlug && (
              <Link 
                to={`/event/${eventSlug}`} 
                className="inline-flex items-center gap-2 text-sm font-inter font-semibold text-rpo-black/60 hover:text-rpo-red transition-colors duration-300"
              >
                <span>Lihat semua</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            {guests.length > 4 && (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => scroll('left')}
                  className="p-2.5 rounded-full border border-rpo-black/10 bg-white hover:bg-rpo-red hover:text-white hover:border-rpo-red text-rpo-black/60 shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rpo-red/20"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => scroll('right')}
                  className="p-2.5 rounded-full border border-rpo-black/10 bg-white hover:bg-rpo-red hover:text-white hover:border-rpo-red text-rpo-black/60 shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rpo-red/20"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          <div className="mt-12 w-full h-2 bg-rpo-red rounded-full" />
        </div>

        <div className="lg:hidden mt-10 w-full h-1.5 bg-rpo-red rounded-full mx-auto max-w-[85%]" />
      </div>
    </section>
  );
}
