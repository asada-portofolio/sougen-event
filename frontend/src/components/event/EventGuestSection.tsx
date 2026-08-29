import type { EventTalent } from '../../types/event';
import { TalentCard } from '../shared/TalentCard';
import { SectionHeader } from '../shared/SectionHeader';

export interface EventGuestSectionProps {
  guests: EventTalent[];
}

export function EventGuestSection({ guests }: EventGuestSectionProps) {
  if (!guests || guests.length === 0) return null;

  return (
    <section id="guests" className="relative w-full bg-[#FAFAFA] py-7 sm:py-8 md:py-10 lg:py-12 px-4 lg:px-8 overflow-hidden scroll-mt-16 md:scroll-mt-20">
      {/* Creative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0094DE 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-white/80 blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#E0F2FE]/80 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader 
          label="Special Appearance"
          title="Guest Stars"
          description="Bintang tamu spesial yang akan memeriahkan acara ini."
          align="center"
          className="mb-5 sm:mb-6 md:mb-9 lg:mb-10"
        />
        
        {/* Responsive Grid for all guests without horizontal scrolling */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mx-auto max-w-[92%] sm:max-w-[90%] lg:max-w-[85%]">
          {guests.map((et) => (
            <div key={et.id} className="w-full">
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
        
        <div className="mt-6 sm:mt-7 md:mt-8 lg:mt-10 w-full h-1.5 md:h-2 bg-sougen-blue rounded-full mx-auto max-w-[85%] lg:max-w-[75%]" />
      </div>
    </section>
  );
}
