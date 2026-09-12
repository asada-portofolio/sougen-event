import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { getImageUrl } from '../../utils/getImageUrl';
import { downloadImage } from '../../utils/downloadImage';

export interface LightboxPhoto {
  imageUrlFull: string;
  imageUrlThumb?: string;
  caption?: string | null;
  width?: number;
  height?: number;
}

export interface LightboxModalProps {
  photos: LightboxPhoto[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export function LightboxModal({ photos, currentIndex, isOpen, onClose, onNavigate }: LightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate(currentIndex === 0 ? photos.length - 1 : currentIndex - 1);
      if (e.key === 'ArrowRight') onNavigate(currentIndex === photos.length - 1 ? 0 : currentIndex + 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, photos.length, onClose, onNavigate]);

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

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  const handlePrev = () => {
    onNavigate(currentIndex === 0 ? photos.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    onNavigate(currentIndex === photos.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-rpo-black/95 backdrop-blur-sm">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 bg-gradient-to-b from-rpo-black/80 to-transparent">
        <span className="text-white/70 font-inter text-sm font-medium px-4">
          {currentIndex + 1} / {photos.length}
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => downloadImage(getImageUrl(currentPhoto.imageUrlFull), `community-photo-${currentIndex + 1}.webp`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-sougen-blue text-white rounded-lg text-xs font-inter font-bold transition-all backdrop-blur-md"
            title="Unduh Foto Resolusi Penuh"
            aria-label="Unduh Foto"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Unduh</span>
          </button>
          <button 
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Tutup Galeri"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image Container */}
      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12" onClick={onClose}>
        <img 
          src={getImageUrl(currentPhoto.imageUrlFull)} 
          alt={currentPhoto.caption || 'Foto Komunitas'}
          width={currentPhoto.width || 1200}
          height={currentPhoto.height || 800}
          decoding="async"
          className="max-w-full max-h-full object-contain select-none drop-shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
        
        {/* Caption */}
        {currentPhoto.caption && (
          <div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-[90%] md:max-w-2xl bg-rpo-black/80 backdrop-blur-md px-6 py-3 rounded-sm border border-rpo-separator text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-rpo-white font-inter text-sm md:text-base">
              {currentPhoto.caption}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {photos.length > 1 && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors backdrop-blur-md"
            aria-label="Foto Sebelumnya"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors backdrop-blur-md"
            aria-label="Foto Selanjutnya"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}
    </div>
  );
}
