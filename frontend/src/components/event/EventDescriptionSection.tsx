import { useState } from 'react';
import { Sparkles, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface EventDescriptionSectionProps {
  description?: string | null;
  eventName: string;
  theme?: string | null;
}

export function EventDescriptionSection({ description, eventName, theme }: EventDescriptionSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const content = description && description.trim() !== '' 
    ? description 
    : `Sougen Creative Management mempersembahkan ${eventName}${theme ? ` dengan tema ${theme}` : ''}. Sebuah perhelatan akbar pop-culture yang mempertemukan para kreator, komunitas cosplay, musisi anisong, dan penggiat industri kreatif dalam satu panggung spektakuler di Makassar. Saksikan berbagai kompetisi seru, penampilan bintang tamu spesial, dan nikmati atmosfer perayaan kreatif yang tak terlupakan!`;

  // Show toggle button if text is long or has multiple paragraphs
  const isLongText = content.length > 220 || content.split('\n').filter(l => l.trim() !== '').length > 2;

  return (
    <section className="relative w-full bg-white py-7 sm:py-8 md:py-10 lg:py-12 px-4 lg:px-8 border-b border-rpo-black/5 overflow-hidden">
      {/* Decorative subtle background accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-[#E0F2FE]/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-sougen-blue/5 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Section Subtitle / Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sougen-blue/10 text-sougen-blue font-inter font-bold text-xs uppercase tracking-widest mb-2.5 sm:mb-3 md:mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tentang Event</span>
          </div>

          {/* Section Headline */}
          <h2 className="font-poppins font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl text-rpo-black uppercase tracking-tight mb-3 sm:mb-4 md:mb-5 max-w-2xl">
            {theme ? `${eventName} — ${theme}` : eventName}
          </h2>

          {/* Decorative Divider */}
          <div className="w-16 h-1 bg-sougen-blue rounded-full mb-5 sm:mb-6 md:mb-7" />

          {/* Event Narrative Body */}
          <div className="bg-[#FAFAFA] border border-rpo-black/5 rounded-2xl p-4 sm:p-6 md:p-8 lg:p-9 shadow-[0_4px_20px_rgba(0,0,0,0.02)] text-left md:text-justify w-full relative transition-all duration-300">
            <div className={cn(
              "font-inter text-rpo-black/80 text-sm md:text-base leading-relaxed md:leading-loose whitespace-pre-line transition-all duration-300",
              !isExpanded && isLongText && "line-clamp-3 md:line-clamp-4"
            )}>
              {content}
            </div>

            {/* Read More / Read Less Toggle Button */}
            {isLongText && (
              <div className="mt-3.5 pt-2.5 sm:mt-4 sm:pt-3 border-t border-black/5 flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs md:text-sm font-poppins font-bold text-sougen-blue bg-sougen-blue/10 hover:bg-sougen-blue/20 transition-all duration-200 group"
                >
                  <span>{isExpanded ? 'Tutup Sebagian' : 'Lihat Selengkapnya'}</span>
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform duration-300 text-sougen-blue",
                    isExpanded && "rotate-180"
                  )} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section Closing Divider Line (Matches width of description card) */}
        <div className="mt-6 sm:mt-7 md:mt-8 lg:mt-10 w-full h-1.5 md:h-2 bg-sougen-blue rounded-full mx-auto" />
      </div>
    </section>
  );
}
