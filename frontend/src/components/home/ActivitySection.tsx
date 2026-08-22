import { useState, useEffect, useRef } from 'react';
import { SectionHeader } from '../shared/SectionHeader';
import { ProgramCard } from '../shared/ProgramCard';
import type { ProgramCardProps } from '../shared/ProgramCard';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';

export function ActivitySection() {
  const [items, setItems] = useState<ProgramCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await api.get('/api/programs');
        const programs = response.data || [];
        
        const programItems = programs
          .map((p: any) => ({
            id: p.id,
            imageUrl: p.coverImageUrl || '/placeholder-image.jpg', // Add fallback image
            title: p.name,
          }));
        
        setItems(programItems);
      } catch (err) {
        console.error('Failed to fetch programs for activity section', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -304 : 304; // 280px card + 24px gap
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

  if (loading) return null;

  return (
    <section className="relative w-full bg-white pt-6 md:pt-10 pb-12 md:pb-16 px-4 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          label="What We Do"
          title="Our Activity" 
          description="Jelajahi kegiatan seru kami, mulai dari kompetisi cosplay yang kompetitif hingga penampilan panggung idol."
          align="center"
          theme="light"
        />
        
        {/* Mobile View: Horizontal scroll for programs */}
        <div className="lg:hidden mt-12 mx-auto max-w-[85%] overflow-hidden">
          {items.length === 0 ? (
            <div className="text-center py-10 text-rpo-black/50 font-inter italic border border-rpo-black/5 bg-[#FAFAFA] rounded-xl mx-4">Belum ada program/activity.</div>
          ) : (
            <div 
              className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 hide-scrollbar cursor-grab active:cursor-grabbing"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {items.map((item) => (
                <div key={item.id} className="snap-center shrink-0 w-[260px] md:w-[300px]">
                  <ProgramCard {...item} />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pr-4 md:pr-8 mt-2">
            <Link 
              to="/programs" 
              className="inline-flex items-center gap-2 text-sm font-inter font-semibold text-rpo-black/60 hover:text-sougen-blue transition-colors duration-300"
            >
              <span>Lihat semua</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
        </div>

        {/* Mobile Divider (outside mobile wrapper) */}
        <div className="lg:hidden mt-10 w-full h-1.5 bg-sougen-blue rounded-full mx-auto max-w-[85%]" />

        {/* Desktop View: Constrained to match divider width */}
        <div className="hidden lg:block mx-auto max-w-[75%] mt-16 relative group">
          {items.length === 0 ? (
            <div className="text-center py-12 text-rpo-black/50 font-inter italic border border-rpo-black/5 bg-[#FAFAFA] rounded-xl">
              Belum ada program/activity.
            </div>
          ) : (
            <div 
              ref={scrollContainerRef}
              onMouseDown={onMouseDown}
              onMouseLeave={onMouseLeaveOrUp}
              onMouseUp={onMouseLeaveOrUp}
              onMouseMove={onMouseMove}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 hide-scrollbar cursor-grab select-none"
            >
              {items.map((item) => (
                <div key={item.id} className="snap-start shrink-0 w-[280px]">
                  <ProgramCard {...item} />
                </div>
              ))}
            </div>
          )}

          {/* Navigation Controls (Desktop only) */}
          <div className="flex items-center justify-end gap-8 mt-6 pr-2">
            <Link 
              to="/programs" 
              className="inline-flex items-center gap-2 text-sm font-inter font-semibold text-rpo-black/60 hover:text-sougen-blue transition-colors duration-300"
            >
              <span>Lihat semua</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {items.length > 3 && (
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

          {/* Desktop Section Divider */}
          <div className="mt-12 w-full h-2 bg-sougen-blue rounded-full" />
        </div>

      </div>
    </section>
  );
}
