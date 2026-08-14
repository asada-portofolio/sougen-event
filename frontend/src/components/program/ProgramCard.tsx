import { useState } from 'react';
import type { Program } from '../../types/program';
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton';

import { RulesModal } from './RulesModal';
import { LayoutGrid, ScrollText, Ticket } from 'lucide-react';

export interface ProgramCardProps {
  program: Program;
  registrationUrl?: string | null;
}

export function ProgramCard({ program, registrationUrl }: ProgramCardProps) {
  const [rulesOpen, setRulesOpen] = useState(false);

  return (
    <>
      <div className="bg-white border border-rpo-black/5 rounded-xl overflow-hidden flex flex-col hover:border-rpo-red/30 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-sm">
        
        {/* Cover Image */}
        <div className="w-full aspect-[21/9] bg-[#e8e8e8] relative overflow-hidden group">
          {program.coverImageUrl ? (
            <ImageWithSkeleton 
              src={program.coverImageUrl} 
              alt={`Cover ${program.name}`} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black/5">
              <LayoutGrid className="w-12 h-12 text-rpo-black/20" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-1">
          {/* Crimson underline on title */}
          <h3 className="font-poppins text-2xl font-bold text-rpo-black mb-4 border-b-4 border-rpo-red pb-2 inline-block self-start">
            {program.name}
          </h3>
          
          {program.description && (
            <p className="text-sm font-inter text-rpo-black/70 mb-6 flex-1 leading-relaxed">
              {program.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="mt-auto">
            <div className="flex flex-col gap-2 mb-6">
              {program.rulesHtml && (
                <button 
                  onClick={() => setRulesOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FAFAFA] hover:bg-rpo-red text-rpo-black hover:text-white border border-rpo-black/10 hover:border-rpo-red rounded-sm transition-all duration-300 font-inter text-sm font-semibold group"
                >
                  <ScrollText className="w-4 h-4 text-rpo-black/60 group-hover:text-white transition-colors" />
                  Baca Aturan Main
                </button>
              )}
            </div>

            {/* Registration Section */}
            {registrationUrl && (
              <div>
                <div className="h-[1px] w-full bg-rpo-black/5 mb-4" />
                <h4 className="text-xs font-inter font-semibold text-rpo-black/40 uppercase tracking-wider mb-3">
                  Pendaftaran
                </h4>
                
                <a 
                  href={registrationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-rpo-red hover:bg-[#c90000] text-white rounded-sm transition-all duration-300 font-inter text-sm font-semibold shadow-sm hover:shadow-md"
                >
                  <Ticket className="w-4 h-4" />
                  Daftar Sekarang
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rules Modal for Aturan Main */}
      {program.rulesHtml && (
        <RulesModal 
          title={program.name}
          rulesHtml={program.rulesHtml}
          isOpen={rulesOpen}
          onClose={() => setRulesOpen(false)}
        />
      )}
    </>
  );
}
