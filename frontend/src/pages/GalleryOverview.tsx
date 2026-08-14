import { useState } from 'react';
import { SEO } from '../components/ui/SEO';
import { useGallery } from '../hooks/useGallery';
import { AlbumCard } from '../components/gallery/AlbumCard';
import { Pagination } from '../components/shared/Pagination';
import { Skeleton } from '../components/ui/Skeleton';
import { SectionHeader } from '../components/shared/SectionHeader';

const ITEMS_PER_PAGE = 12;

export default function GalleryOverview() {
  const { albums, loading, error } = useGallery();
  const [currentPage, setCurrentPage] = useState(1);

  if (error) {
    return (
      <div className="w-full min-h-[70vh] bg-[#FAFAFA] flex items-center justify-center pt-24">
        <p className="text-rpo-red font-inter text-lg">Gagal memuat galeri event. Silakan coba lagi nanti.</p>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(albums.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentAlbums = albums.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] pt-24 md:pt-32 pb-16">
      <SEO 
        title="Galeri & Dokumentasi | Reality Project Organizer" 
        description="Jelajahi album foto dan dokumentasi dari berbagai event pop-kultur yang pernah diselenggarakan oleh Reality Project Organizer." 
        canonicalUrl="/gallery"
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <SectionHeader 
          label="Mesin Waktu"
          title="Galeri & Dokumentasi"
          description="Koleksi memori visual dari berbagai perhelatan pop-kultur, kompetisi, dan momen komunitas di panggung kami."
          theme="light"
          align="left"
          className="mb-12"
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Skeleton key={i} className="w-full aspect-[4/3] bg-black/5 rounded-xl" />
            ))}
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-20 bg-white border border-rpo-black/5 rounded-xl">
            <p className="text-rpo-black/50 font-inter text-lg">Belum ada dokumentasi event saat ini.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentAlbums.map(album => (
                <AlbumCard 
                  key={album.id}
                  album={album}
                />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center">
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}