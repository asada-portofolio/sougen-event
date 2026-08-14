import { Link } from 'react-router-dom';
import { ImageIcon, Calendar, Image as ImagePlaceholder } from 'lucide-react';
import type { GalleryAlbum } from '../../types/gallery';
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton';

export interface AlbumCardProps {
  album: GalleryAlbum;
}

export function AlbumCard({ album }: AlbumCardProps) {
  const formatEventDate = (startIso: string, endIso: string) => {
    const start = new Date(startIso);
    const end = new Date(endIso);
    
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const startStr = start.toLocaleDateString('id-ID', options);
    const endStr = end.toLocaleDateString('id-ID', options);

    if (startStr === endStr) {
      return startStr;
    }

    // If same month and year, just show "DD - DD Month YYYY"
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${start.getDate()} - ${end.getDate()} ${start.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`;
    }

    return `${startStr} - ${endStr}`;
  };

  const coverUrl = album.galleryPhotos?.[0]?.imageUrlThumb;
  const photoCount = album._count?.galleryPhotos || 0;

  return (
    <Link 
      to={`/gallery/${album.slug}`}
      className="group flex flex-col bg-white border border-rpo-black/5 rounded-xl overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
    >
      {/* Cover Image */}
      <div className="w-full aspect-[4/3] bg-black/5 relative overflow-hidden">
        {coverUrl ? (
          <ImageWithSkeleton 
            src={coverUrl} 
            alt={`Kover ${album.name}`} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/5">
            <ImagePlaceholder className="w-12 h-12 text-rpo-black/20" />
          </div>
        )}
        
        {/* Photo Count Badge */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md border border-rpo-black/10 px-3 py-1.5 rounded-sm flex items-center gap-2 shadow-sm">
          <ImageIcon className="w-4 h-4 text-rpo-red" />
          <span className="text-xs font-inter font-bold text-rpo-black">
            {photoCount} Foto
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-poppins text-lg font-bold text-rpo-black mb-2 group-hover:text-rpo-red transition-colors line-clamp-2">
          {album.name}
        </h3>
        
        <div className="flex items-center gap-2 text-sm font-inter text-rpo-black/50 mt-auto">
          <Calendar className="w-4 h-4 shrink-0 text-rpo-red" />
          <span className="truncate">
            {formatEventDate(album.startDate, album.endDate)}
          </span>
        </div>
      </div>
    </Link>
  );
}
