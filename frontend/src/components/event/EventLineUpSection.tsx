import { useState, useRef } from 'react';
import type { EventTalent } from '../../types/event';
import { TalentCard } from '../shared/TalentCard';
import { MobileLineUpCard } from '../shared/MobileLineUpCard';
import { SectionHeader } from '../shared/SectionHeader';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface EventLineUpSectionProps {
  lineup: EventTalent[];
}

const INITIAL_MOBILE_COUNT = 4;

export function EventLineUpSection({ lineup }: EventLineUpSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  if (!lineup || lineup.length === 0) return null;

  // Sort by performOrder, then performTime
  const sortedLineup = [...lineup].sort((a, b) => {
    // 1. Sort by performOrder (nulls at the end)
    if (a.performOrder !== null && b.performOrder !== null) {
      if (a.performOrder !== b.performOrder) {
        return a.performOrder - b.performOrder;
      }
    } else if (a.performOrder !== null) {
      return -1; // a comes first
    } else if (b.performOrder !== null) {
      return 1; // b comes first
    }

    // 2. If performOrder is same or both null, check performTime
    if (a.performTime && b.performTime) {
      return a.performTime.localeCompare(b.performTime);
    } else if (a.performTime) {
      return -1;
    } else if (b.performTime) {
      return 1;
    }

    return 0;
  });

  const handleToggle = () => {
    if (isExpanded && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <section ref={sectionRef} className="relative w-full bg-[#FAFAFA] pt-12 md:pt-16 pb-6 md:pb-8 px-4 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader 
          label="Let's Get To Know"
          title="Our Line-Up" 
          description="Saksikan penampilan spektakuler dari cosplayer, grup idol, hingga musisi lokal di acara ini."
          align="center"
          theme="light"
          className="mb-12"
        />
        
        {/* Responsive Grid for performers: Initial 4 on mobile with view-more toggle; all on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mx-auto w-full max-w-[85%] lg:max-w-[75%]">
          {sortedLineup.map((et, idx) => (
            <div 
              key={et.id} 
              className={cn(
                "w-full",
                idx >= INITIAL_MOBILE_COUNT && !isExpanded && "hidden md:block"
              )}
            >
              {/* Mobile Card */}
              <div className="md:hidden">
                <MobileLineUpCard
                  name={et.talent.stageName}
                  role="PERFORMER"
                  imageUrl={et.talent.profileImageUrl || ''}
                />
              </div>
              
              {/* Desktop Card */}
              <div className="hidden md:block">
                <TalentCard
                  name={et.talent.stageName}
                  role="PERFORMER"
                  imageUrl={et.talent.profileImageUrl || ''}
                  instagramUrl={et.talent.instagramUrl || ''}
                  followerCount={et.talent.followerCount}
                  postCount={et.talent.postCount}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View More / Collapse Button */}
        {sortedLineup.length > INITIAL_MOBILE_COUNT && (
          <div className="mt-6 flex justify-center md:hidden">
            <button
              type="button"
              onClick={handleToggle}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-sougen-blue text-rpo-black hover:text-white border border-rpo-black/10 hover:border-sougen-blue rounded-full shadow-sm transition-all duration-300 font-inter text-xs font-semibold active:scale-95 group"
            >
              <span>
                {isExpanded
                  ? 'Tampilkan Lebih Sedikit'
                  : `Lihat Selengkapnya (${sortedLineup.length - INITIAL_MOBILE_COUNT} lainnya)`}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
              )}
            </button>
          </div>
        )}
        
        <div className="mt-12 lg:mt-16 w-full h-1.5 md:h-2 bg-sougen-blue rounded-full mx-auto max-w-[85%] lg:max-w-[75%]" />
      </div>
    </section>
  );
}
