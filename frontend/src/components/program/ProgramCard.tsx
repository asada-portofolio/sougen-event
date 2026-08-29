import { useState } from 'react';
import type { Program } from '../../types/program';
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton';

import { RulesModal } from './RulesModal';
import { ProgramDetailModal } from './ProgramDetailModal';
import { LayoutGrid, ScrollText, Ticket, ImageIcon } from 'lucide-react';
import { getImageUrl } from '../../utils/getImageUrl';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

export interface ProgramCardProps {
  program: Program;
  registrationUrl?: string | null;
}

export function ProgramCard({ program, registrationUrl }: ProgramCardProps) {
  const [rulesOpen, setRulesOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div 
        className="group relative rounded-2xl overflow-hidden aspect-[4/5] max-w-[260px] sm:max-w-[280px] md:max-w-[320px] w-full flex flex-col justify-between p-3.5 sm:p-4 md:p-5 bg-[#f0f0f0] shadow-md hover:shadow-[0_12px_36px_rgba(0,148,222,0.25)] transition-all duration-500 cursor-pointer mx-auto select-none"
        onClick={() => setDetailOpen(true)}
      >
        {/* Background Image */}
        {program.coverImageUrl ? (
          <ImageWithSkeleton 
            src={program.coverImageUrl} 
            alt={`Cover ${program.name}`} 
            containerClassName="absolute inset-0 w-full h-full"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/5">
            <LayoutGrid className="w-14 h-14 text-rpo-black/20" />
          </div>
        )}

        {/* Feather Overlay — Multi-stop Light Gradient */}
        <div 
          className="absolute inset-x-0 bottom-0 h-[65%] pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,0.45) 75%, rgba(255,255,255,0.1) 90%, transparent 100%)'
          }}
        />

        {/* Top Badges (Category & Gallery Count) */}
        <div className="relative z-10 flex items-center justify-between w-full">
          {program.category ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-sougen-blue/30 text-sougen-blue font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-sm">
              <span className="text-sougen-blue font-black">#</span> {program.category}
            </span>
          ) : <span />}

          {program.photos && program.photos.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenLightbox(0);
              }}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-rpo-black/10 text-rpo-black/70 hover:text-sougen-blue font-inter text-[9px] sm:text-[10px] font-semibold shadow-sm transition-colors"
            >
              <ImageIcon className="w-3 h-3 text-sougen-blue" />
              {program.photos.length} Foto
            </button>
          )}
        </div>

        {/* Bottom Content Overlay (Bright Text) */}
        <div className="relative z-10 flex flex-col justify-end w-full pt-8 sm:pt-10">
          {/* Title */}
          <h3 className="font-poppins text-base sm:text-lg md:text-xl font-bold text-rpo-black group-hover:text-sougen-blue transition-colors leading-tight line-clamp-1">
            {program.name}
          </h3>

          {/* Truncated Description with Read More */}
          {program.description && (
            <div className="mt-0.5 sm:mt-1">
              <p className="text-[11px] sm:text-xs font-inter text-rpo-black/75 line-clamp-2 leading-relaxed">
                {program.description}
              </p>
              {program.description.length > 60 && (
                <span className="text-[10px] sm:text-[11px] font-inter font-bold text-sougen-blue group-hover:underline inline-flex items-center gap-0.5 mt-0.5">
                  Baca selengkapnya ↗
                </span>
              )}
            </div>
          )}

          {/* Action Buttons Row */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-2.5 sm:mt-3.5 pt-2.5 sm:pt-3 border-t border-rpo-black/10">
            {program.rulesHtml && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setRulesOpen(true);
                }}
                className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-white hover:bg-sougen-blue text-rpo-black hover:text-white border border-rpo-black/15 hover:border-sougen-blue rounded-xl transition-all duration-300 font-inter text-[11px] sm:text-xs font-bold shadow-sm"
              >
                <ScrollText className="w-3.5 h-3.5 text-rpo-black/60 group-hover:text-white transition-colors" />
                Aturan
              </button>
            )}

            {registrationUrl && (
              <a 
                href={registrationUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-sougen-blue hover:bg-[#0082c4] text-white rounded-xl transition-all duration-300 font-inter text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-md hover:shadow-lg"
              >
                <Ticket className="w-3.5 h-3.5" />
                Daftar
              </a>
            )}
          </div>
        </div>

        {/* Signature Sougen Blue Outline Ring */}
        <div className="pointer-events-none absolute inset-0 z-20 rounded-2xl border-2 border-sougen-blue/60 group-hover:border-sougen-blue transition-colors duration-300" />
      </div>

      {/* Program Detail Modal */}
      <ProgramDetailModal
        program={program}
        registrationUrl={registrationUrl}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        onOpenRules={() => setRulesOpen(true)}
        onOpenGallery={() => handleOpenLightbox(0)}
      />

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
          slides={program.photos.map(p => ({ 
            src: getImageUrl(p.imageUrlFull),
            alt: p.caption || `Dokumentasi ${program.name}`
          }))}
          plugins={[Zoom, Thumbnails]}
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
