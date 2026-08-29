import type { EventTalent } from '../../types/event';
import { TalentCard } from '../shared/TalentCard';
import { MobileLineUpCard } from '../shared/MobileLineUpCard';
import { SectionHeader } from '../shared/SectionHeader';

export interface EventLineUpSectionProps {
  lineup: EventTalent[];
}

export function EventLineUpSection({ lineup }: EventLineUpSectionProps) {
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

  return (
    <section id="lineup" className="relative w-full bg-[#FAFAFA] pt-7 sm:pt-8 md:pt-10 lg:pt-12 pb-4 sm:pb-6 md:pb-6 lg:pb-8 px-4 lg:px-8 overflow-hidden scroll-mt-16 md:scroll-mt-20">
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader 
          label="Let's Get To Know"
          title="Our Line-Up" 
          description="Saksikan penampilan spektakuler dari cosplayer, grup idol, hingga musisi lokal di acara ini."
          align="center"
          theme="light"
          className="mb-5 sm:mb-6 md:mb-9 lg:mb-10"
        />
        
        {/* Responsive Grid for all performers without horizontal scrolling */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-6 mx-auto w-full max-w-[92%] sm:max-w-[85%] lg:max-w-[75%]">
          {sortedLineup.map((et) => (
            <div key={et.id} className="w-full">
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
        
        <div className="mt-6 sm:mt-7 md:mt-8 lg:mt-10 w-full h-1.5 md:h-2 bg-sougen-blue rounded-full mx-auto max-w-[85%] lg:max-w-[75%]" />
      </div>
    </section>
  );
}
