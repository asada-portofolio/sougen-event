import { useState } from 'react';
import type { Community } from '../../types/community';
import { InstagramIcon } from '../ui/icons';
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton';
import { LightboxModal } from './LightboxModal';
import { Users, Calendar } from 'lucide-react';
import { getImageUrl } from '../../utils/getImageUrl';

export interface CommunityCardProps {
  community: Community;
}

export function CommunityCard({ community }: CommunityCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const handleOpenLightbox = (index: number) => {
    setActivePhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="bg-white border border-rpo-black/10 rounded-xl overflow-hidden flex flex-col transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:border-rpo-red hover:shadow-[0_8px_30px_rgba(254,0,0,0.12)]">
        
        {/* Header Section (Logo + Info) */}
        <div className="p-6 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full overflow-hidden bg-black/5 border border-rpo-black/10 flex items-center justify-center p-2">
            {community.logoUrl ? (
              <img 
                src={getImageUrl(community.logoUrl)} 
                alt={`Logo ${community.name}`} 
                className="w-full h-full object-contain mix-blend-multiply"
              />
            ) : (
              <Users className="w-8 h-8 text-rpo-black/30" />
            )}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="font-poppins text-2xl font-bold text-rpo-black">
                {community.name}
              </h3>
              {community.instagramUrl && (
                <a 
                  href={community.instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-rpo-black/40 hover:text-rpo-red transition-colors mt-1 shrink-0"
                  title="Kunjungi Instagram"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-xs font-inter uppercase tracking-wider text-rpo-black/50">
              {community.category && (
                <span className="bg-[#FAFAFA] px-2 py-1 rounded-sm border border-rpo-black/10">
                  {community.category}
                </span>
              )}
              {community.establishedYear && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Est. {community.establishedYear}
                </span>
              )}
            </div>
            
            {community.description && (
              <p className="text-sm font-inter text-rpo-black/70 pt-2 line-clamp-3">
                {community.description}
              </p>
            )}
          </div>
        </div>

        {/* Photo Strip Section */}
        {community.photos && community.photos.length > 0 && (
          <div className="mt-auto p-4 md:p-6 pt-0">
            <div className="h-[1px] w-full bg-rpo-black/10 mb-4" />
            <h4 className="text-xs font-inter font-semibold text-rpo-black/50 uppercase tracking-wider mb-3">
              Galeri Kegiatan
            </h4>
            
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar snap-x">
              {community.photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => handleOpenLightbox(index)}
                  className="relative w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-sm overflow-hidden group snap-start bg-[#FAFAFA]"
                >
                  <ImageWithSkeleton 
                    src={photo.imageUrlThumb} 
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-rpo-red/0 group-hover:bg-rpo-red/20 transition-colors duration-300" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Portal/Modal */}
      <LightboxModal 
        photos={community.photos}
        currentIndex={activePhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setActivePhotoIndex}
      />
    </>
  );
}
