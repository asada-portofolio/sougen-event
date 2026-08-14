import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEO } from '../components/ui/SEO';
import { ChevronLeft, Loader2 } from 'lucide-react';
import PhotoAlbum from 'react-photo-album';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

import { useGalleryDetail } from '../hooks/useGalleryDetail';
import { ImageWithSkeleton } from '../components/ui/ImageWithSkeleton';

export default function GalleryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { eventData, photos, loading, loadingMore, error, hasMore, loadMore } = useGalleryDetail(slug);
  const [index, setIndex] = useState(-1);

  const renderImage = useCallback(
    (props: React.ComponentPropsWithoutRef<'img'>) => (
      <ImageWithSkeleton
        {...props}
        className={`${props.className || ''} cursor-pointer hover:opacity-90 transition-opacity`}
      />
    ),
    []
  );

  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center pt-24 text-center px-4">
        <p className="text-rpo-red font-inter text-lg mb-4">Gagal memuat detail galeri.</p>
        <Link to="/gallery" className="text-rpo-black/60 hover:text-rpo-black underline font-inter">
          Kembali ke Galeri
        </Link>
      </div>
    );
  }

  // Format photos for react-photo-album and Lightbox
  const formattedPhotos = photos.map(p => ({
    src: p.imageUrlFull,
    width: p.width,
    height: p.height,
    alt: p.caption || `Foto dari event ${eventData?.name || ''}`,
    title: p.caption || undefined,
  }));
  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] pt-24 md:pt-32 pb-16">
      <SEO 
        title={eventData ? `${eventData.name} - Galeri | RPO` : 'Memuat Galeri... | RPO'}
        description={eventData ? `Koleksi foto dan dokumentasi eksklusif dari event ${eventData.name}.` : 'Memuat Galeri...'}
        canonicalUrl={eventData ? `/gallery/${eventData.slug}` : undefined}
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-8 border-b-4 border-rpo-red pb-6">
          <Link 
            to="/gallery" 
            className="inline-flex items-center gap-2 text-rpo-black/50 hover:text-rpo-black font-inter text-sm mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Album List
          </Link>
          
          {loading ? (
            <div className="h-10 w-2/3 bg-black/5 animate-pulse rounded-sm" />
          ) : (
            <h1 className="font-poppins text-3xl md:text-4xl font-black text-rpo-black">
              {eventData?.name}
            </h1>
          )}
        </div>

        {/* Loading Initial */}
        {loading && photos.length === 0 ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-8 h-8 text-rpo-red animate-spin" />
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20 bg-white border border-black/10 rounded-xl shadow-sm">
            <p className="text-rpo-black/50 font-inter text-lg">Album ini masih kosong.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <PhotoAlbum
              layout="masonry"
              photos={formattedPhotos}
              render={{ image: renderImage }}
              onClick={({ index }) => setIndex(index)}
              columns={(containerWidth) => {
                if (containerWidth < 640) return 2;
                if (containerWidth < 1024) return 3;
                return 4;
              }}
              spacing={16}
            />

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-8">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-white border-2 border-rpo-red text-rpo-red hover:bg-rpo-red hover:text-white px-8 py-3 rounded-sm font-inter font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Memuat...
                    </>
                  ) : (
                    'Muat Lebih Banyak'
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={formattedPhotos}
        plugins={[Zoom]}
        styles={{
          container: { backgroundColor: 'rgba(26, 26, 26, 0.98)' }
        }}
        render={{
          iconClose: () => <span className="text-white text-3xl">&times;</span>,
        }}
      />
    </div>
  );
}