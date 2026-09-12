import { useState } from 'react';
import type { Program } from '../../types/program';
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton';

import { RulesModal } from './RulesModal';
import { LayoutGrid, ScrollText, Ticket, ImageIcon } from 'lucide-react';
import { getImageUrl } from '../../utils/getImageUrl';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import Download from 'yet-another-react-lightbox/plugins/download';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';

export interface ProgramCardProps {
  program: Program;
  registrationUrl?: string | null;
}

export function ProgramCard({ program, registrationUrl }: ProgramCardProps) {
  const [rulesOpen, setRulesOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div 
        className="bg-white border border-rpo-black/5 rounded-xl overflow-hidden flex flex-col hover:border-sougen-blue/30 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-sm cursor-pointer"
        onClick={() => handleOpenLightbox(0)}
      >
        
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
          {program.category && (
            <span className="text-xs font-inter font-bold uppercase tracking-wider text-sougen-blue-dark mb-2">
              {program.category}
            </span>
          )}
          {/* Crimson underline on title */}
          <h3 className="font-poppins text-2xl font-bold text-rpo-black mb-4 border-b-4 border-sougen-blue pb-2 inline-block self-start">
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setRulesOpen(true);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FAFAFA] hover:bg-sougen-blue text-rpo-black hover:text-white border border-rpo-black/10 hover:border-sougen-blue rounded-md transition-all duration-300 font-inter text-sm font-semibold group"
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
                <h4 className="text-xs font-inter font-semibold text-rpo-black/70 uppercase tracking-wider mb-3">
                  Pendaftaran
                </h4>
                
                <a 
                  href={registrationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-sougen-blue hover:bg-sougen-green-dark text-white rounded-md transition-all duration-300 font-inter text-sm font-semibold shadow-sm hover:shadow-md"
                >
                  <Ticket className="w-4 h-4" />
                  Daftar Sekarang
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Photo Strip Section */}
        {program.photos && program.photos.length > 0 && (
          <div className="mt-auto p-4 md:p-6 pt-0">
            <div className="h-[1px] w-full bg-rpo-black/10 mb-4" />
            <h4 className="text-xs font-inter font-semibold text-rpo-black/70 uppercase tracking-wider mb-3">
              Galeri Kegiatan
            </h4>
            
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar snap-x">
              {program.photos.slice(0, 3).map((photo, index) => {
                const isLastAndMore = index === 2 && program.photos.length > 3;
                const remaining = program.photos.length - 3;
                
                return (
                  <button
                    key={photo.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenLightbox(index);
                    }}
                    className="relative shrink-0 snap-start h-20 w-24 sm:w-28 rounded-lg overflow-hidden border border-black/5 group/thumb focus:outline-none focus:ring-2 focus:ring-sougen-blue/50"
                  >
                    <ImageWithSkeleton 
                      src={photo.imageUrlThumb} 
                      alt={`Dokumentasi ${program.name}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-110"
                    />
                    
                    {isLastAndMore && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                        <ImageIcon className="w-4 h-4 mb-1 opacity-80" />
                        <span className="text-xs font-inter font-bold">+{remaining}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
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

      {/* Lightbox for Gallery */}
      {program.photos && program.photos.length > 0 && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={program.photos.map((p, idx) => ({ 
            src: getImageUrl(p.imageUrlFull),
            alt: p.caption || `Dokumentasi ${program.name}`,
            download: {
              url: getImageUrl(p.imageUrlFull),
              filename: `${program.slug || 'program'}-dokumentasi-${idx + 1}.webp`,
            },
          }))}
          plugins={[Zoom, Thumbnails, Download, Fullscreen]}
          carousel={{ padding: 0, spacing: 0, imageFit: 'contain' }}
          animation={{ fade: 250, swipe: 250 }}
          styles={{
            container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
            thumbnail: { borderColor: 'rgba(255, 255, 255, 0.2)' }
          }}
        />
      )}
    </>
  );
}
