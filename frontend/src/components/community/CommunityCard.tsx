import { useState } from 'react';
import type { Community } from '../../types/community';
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
      <div 
        onClick={() => handleOpenLightbox(0)}
        className="bg-white border border-sougen-blue/25 rounded-xl overflow-hidden flex flex-col cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:border-sougen-blue hover:shadow-[0_8px_30px_rgba(0,148,222,0.15)] shadow-sm group/card"
      >
        
        {/* Header Section (Logo + Info) */}
        <div className="p-5 md:p-6 flex flex-col gap-4 items-start">
          <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full overflow-hidden bg-black/5 border border-rpo-black/10 flex items-center justify-center p-2 group-hover/card:border-sougen-blue/30 transition-colors">
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
            <div className="flex flex-col gap-1">
              <h3 className="font-poppins text-xl md:text-2xl font-bold text-rpo-black leading-tight group-hover/card:text-sougen-blue transition-colors">
                {community.name}
              </h3>
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
              <p className="text-xs md:text-sm font-inter text-rpo-black/70 pt-2 line-clamp-3">
                {community.description}
              </p>
            )}
            
            {/* Follow button aligned to TalentCard style */}
            <div className="pt-3 mt-auto flex">
                {community.instagramUrl ? (
                  <a
                    href={community.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center rounded-full bg-white px-4 py-1.5 text-[11px] font-poppins font-bold text-gray-900 shadow-md transition-all duration-300 hover:bg-sougen-blue hover:text-white hover:scale-105 focus:outline-none border border-black/5"
                    aria-label={`Follow ${community.name} on Instagram`}
                  >
                    Follow +
                  </a>
                ) : (
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center rounded-full bg-white px-4 py-1.5 text-[11px] font-poppins font-bold text-gray-900 shadow-md transition-transform duration-300 hover:scale-105 focus:outline-none opacity-50 cursor-not-allowed border border-black/5"
                    disabled
                  >
                    Follow +
                  </button>
                )}
            </div>
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
              {community.photos.slice(0, 3).map((photo, index) => {
                const isLastAndMore = index === 2 && community.photos.length > 3;
                const remaining = community.photos.length - 3;
                
                return (
                  <button
                    key={photo.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenLightbox(index);
                    }}
                    className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-sm overflow-hidden group snap-start bg-[#FAFAFA]"
                  >
                    <ImageWithSkeleton 
                      src={photo.imageUrlThumb} 
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {isLastAndMore ? (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="text-white font-poppins font-bold text-xs md:text-sm">
                          +{remaining}
                        </span>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-sougen-blue/0 group-hover:bg-sougen-blue/20 transition-colors duration-300" />
                    )}
                  </button>
                );
              })}
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
