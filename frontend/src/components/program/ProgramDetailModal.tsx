import { useEffect } from 'react';
import { X, Ticket, ScrollText, ImageIcon, Info } from 'lucide-react';
import type { Program } from '../../types/program';
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton';

export interface ProgramDetailModalProps {
  program: Program;
  registrationUrl?: string | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRules?: () => void;
  onOpenGallery?: () => void;
}

export function ProgramDetailModal({
  program,
  registrationUrl,
  isOpen,
  onClose,
  onOpenRules,
  onOpenGallery,
}: ProgramDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 pt-12 sm:pt-16 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white border border-rpo-black/10 rounded-2xl shadow-2xl max-h-[82vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 z-10 translate-y-2 sm:translate-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 px-5 border-b border-rpo-black/5 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-sougen-blue/10 flex items-center justify-center text-sougen-blue shrink-0">
              <Info className="w-3.5 h-3.5" />
            </div>
            <div>
              {program.category && (
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sougen-blue block leading-none mb-0.5">
                  #{program.category}
                </span>
              )}
              <h3 className="font-poppins text-base sm:text-lg font-bold text-rpo-black leading-tight">
                {program.name}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-rpo-black/50 hover:text-sougen-blue hover:bg-sougen-blue/10 rounded-xl transition-colors shrink-0"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 [scrollbar-width:thin]">
          {/* Cover Image banner - compact height */}
          {program.coverImageUrl && (
            <div className="w-full h-36 sm:h-44 rounded-xl overflow-hidden bg-black/5 relative border border-rpo-black/5 shrink-0">
              <ImageWithSkeleton 
                src={program.coverImageUrl} 
                alt={`Cover ${program.name}`} 
                containerClassName="w-full h-full"
                className="w-full h-full object-cover object-center"
              />
            </div>
          )}

          {/* Full Description */}
          <div>
            <p className="text-[11px] font-mono font-bold text-gray-600 uppercase tracking-wider mb-1.5">
              Deskripsi Program
            </p>
            <div className="text-xs sm:text-[13px] font-inter text-rpo-black/85 leading-relaxed whitespace-pre-line bg-[#FAFAFA] p-3 sm:p-3.5 rounded-xl border border-rpo-black/5 max-h-36 overflow-y-auto [scrollbar-width:thin]">
              {program.description || 'Tidak ada deskripsi rinci untuk program ini.'}
            </div>
          </div>

          {/* Gallery snippet if available */}
          {program.photos && program.photos.length > 0 && onOpenGallery && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11px] font-mono font-bold text-gray-600 uppercase tracking-wider">
                  Dokumentasi Foto ({program.photos.length})
                </p>
                <button
                  onClick={onOpenGallery}
                  className="text-xs font-inter font-bold text-sougen-blue-dark hover:underline inline-flex items-center gap-1"
                >
                  <ImageIcon className="w-3 h-3" /> Buka Galeri
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
                {program.photos.slice(0, 4).map((p, idx) => (
                  <button
                    key={p.id || idx}
                    onClick={onOpenGallery}
                    className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-black/5 hover:opacity-80 transition-opacity"
                  >
                    <ImageWithSkeleton 
                      src={p.imageUrlThumb || p.imageUrlFull} 
                      alt={`Dokumentasi ${idx + 1}`}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 px-5 border-t border-rpo-black/5 bg-[#FAFAFA] flex flex-wrap items-center justify-end gap-2.5 rounded-b-2xl shrink-0">
          {program.rulesHtml && onOpenRules && (
            <button
              onClick={() => {
                onClose();
                onOpenRules();
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-sougen-blue text-rpo-black hover:text-white border border-rpo-black/15 hover:border-sougen-blue rounded-xl transition-all duration-300 font-inter text-xs font-bold shadow-sm"
            >
              <ScrollText className="w-3.5 h-3.5" />
              Baca Aturan Main
            </button>
          )}

          {registrationUrl && (
            <a
              href={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-sougen-blue hover:bg-[#0082c4] text-white rounded-xl transition-all duration-300 font-inter text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg"
            >
              <Ticket className="w-3.5 h-3.5" />
              Daftar Sekarang
            </a>
          )}
        </div>

      </div>
    </div>
  );
}
