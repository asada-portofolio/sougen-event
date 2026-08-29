import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEO } from '../components/ui/SEO';
import { 
  ChevronLeft, 
  Loader2, 
  Calendar, 
  MapPin, 
  FolderArchive, 
  Sparkles, 
  Maximize2, 
  Images, 
  ExternalLink,
  Info
} from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Captions from 'yet-another-react-lightbox/plugins/captions';

import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import 'yet-another-react-lightbox/plugins/captions.css';

import { useGalleryDetail } from '../hooks/useGalleryDetail';
import { ImageWithSkeleton } from '../components/ui/ImageWithSkeleton';
import { getImageUrl } from '../utils/getImageUrl';
import { Button } from '../components/ui/Button';

export default function GalleryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { eventData, photos, loading, loadingMore, error, hasMore, loadMore } = useGalleryDetail(slug);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const formatNumericDate = (dateStr?: string | null) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day} ${month} ${year}`;
    } catch {
      return dateStr;
    }
  };

  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center pt-24 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-sougen-blue/10 flex items-center justify-center text-sougen-blue mb-4">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="font-poppins font-black text-2xl text-rpo-black mb-2">Album Galeri Tidak Ditemukan</h2>
        <p className="text-rpo-black/60 font-inter text-sm mb-6 max-w-md">
          Event ini belum memiliki album dokumentasi atau tautan yang Anda tuju telah dipindahkan.
        </p>
        <Button asChild variant="primary">
          <Link to="/gallery">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Kembali ke Semua Album
          </Link>
        </Button>
      </div>
    );
  }

  // Format slides for Lightbox
  const lightboxSlides = photos.map(p => ({
    src: getImageUrl(p.imageUrlFull),
    title: p.caption || (eventData?.name ? `Dokumentasi ${eventData.name}` : undefined),
    description: p.caption ? `Foto dokumentasi resmi ${eventData?.name || ''}` : undefined,
  }));

  const totalPhotosCount = eventData?._count?.galleryPhotos || photos.length;

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] text-rpo-black pt-20 sm:pt-24 md:pt-28 pb-20">
      <SEO 
        title={eventData ? `Galeri ${eventData.name} | Sougen Creative Management` : 'Memuat Galeri...'}
        description={eventData ? `Koleksi foto dan dokumentasi eksklusif dari event ${eventData.name}. Lihat keseruan momen panggung, bintang tamu, cosplayer, dan pengunjung Sougen.` : 'Memuat Galeri...'}
        ogImage={photos[0]?.imageUrlFull ? getImageUrl(photos[0].imageUrlFull) : undefined}
        canonicalUrl={eventData ? `/gallery/${eventData.slug}` : undefined}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── TOP BREADCRUMB & ACTION BAR ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-black/5">
          <Link 
            to="/gallery" 
            className="inline-flex items-center gap-1.5 text-rpo-black/60 hover:text-sougen-blue font-inter font-bold text-xs sm:text-sm transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-sougen-blue" />
            <span>Kembali ke Semua Album</span>
          </Link>

          {eventData?.slug && (
            <Link
              to={`/events/${eventData.slug}`}
              className="inline-flex items-center gap-1.5 text-sougen-blue hover:underline font-inter font-bold text-xs sm:text-sm"
            >
              <span>Lihat Detail Event</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* ── ALBUM HERO HEADER CARD ── */}
        <div className="relative bg-white border border-rpo-black/10 rounded-2xl md:rounded-3xl p-5 sm:p-7 md:p-9 shadow-sm overflow-hidden mb-8 md:mb-10">
          {/* Subtle Creative Background Accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-sougen-blue/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-0 h-1.5 w-full bg-sougen-blue" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              {/* Badge Total Foto & Status */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sougen-blue/10 text-sougen-blue font-inter font-bold text-xs uppercase tracking-wider">
                  <Images className="w-3.5 h-3.5" />
                  <span>{totalPhotosCount} Foto Dokumentasi</span>
                </span>
                
                {eventData?.theme && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/5 text-rpo-black/70 font-mono text-xs font-bold uppercase tracking-wider">
                    #{eventData.theme}
                  </span>
                )}
              </div>

              {/* Title */}
              {loading && !eventData ? (
                <div className="h-10 w-3/4 bg-black/5 animate-pulse rounded-lg" />
              ) : (
                <h1 className="font-poppins font-black text-2xl sm:text-3xl md:text-4xl text-rpo-black tracking-tight leading-tight">
                  {eventData?.name}
                </h1>
              )}

              {/* Event Metadata (Date & Venue) */}
              {eventData && (
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs sm:text-sm font-inter text-rpo-black/70">
                  {eventData.startDate && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-sougen-blue shrink-0" />
                      <span className="font-medium">
                        {formatNumericDate(eventData.startDate)}
                        {eventData.endDate && eventData.endDate !== eventData.startDate && ` - ${formatNumericDate(eventData.endDate)}`}
                      </span>
                    </div>
                  )}

                  {eventData.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-sougen-blue shrink-0" />
                      <span className="font-medium">{eventData.location}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CTA Buttons (GDrive Archive & Event Page) */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {eventData?.googleDriveUrl && (
                <Button asChild size="lg" variant="primary" className="w-full sm:w-auto font-inter font-bold text-xs uppercase tracking-wider gap-2 shadow-sm">
                  <a href={eventData.googleDriveUrl} target="_blank" rel="noopener noreferrer">
                    <FolderArchive className="w-4 h-4" />
                    <span>Arsip Lengkap GDrive</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ── STRUCTURED PHOTO GRID ── */}
        {loading && photos.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="w-full aspect-[4/3] rounded-2xl bg-black/5 animate-pulse border border-black/5" />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20 bg-white border border-rpo-black/10 rounded-2xl shadow-sm p-6 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-sougen-blue/10 flex items-center justify-center text-sougen-blue mx-auto mb-3">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-poppins font-bold text-lg text-rpo-black mb-1">Album Masih Kosong</h3>
            <p className="text-rpo-black/60 font-inter text-xs sm:text-sm mb-5">
              Dokumentasi foto untuk event ini sedang dalam proses kurasi oleh tim media Sougen.
            </p>
            <Button asChild variant="outlined" size="sm">
              <Link to="/gallery">Kembali ke Daftar Album</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Photo Grid with Controlled Proportions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {photos.map((photo, idx) => (
                <div
                  key={photo.id || idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 border border-rpo-black/10 hover:border-sougen-blue/60 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer select-none"
                >
                  {/* Photo Thumbnail with Skeleton */}
                  <ImageWithSkeleton 
                    src={photo.imageUrlThumb || photo.imageUrlFull}
                    alt={photo.caption || `Foto dokumentasi ${idx + 1} - ${eventData?.name || ''}`}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Dark Vignette Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col justify-between p-3 sm:p-4">
                    {/* Top Right Quick Action Icon */}
                    <div className="flex justify-end">
                      <div className="w-8 h-8 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center text-white shadow-sm transform translate-y-1 group-hover:translate-y-0 transition-transform">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Bottom Caption / Photo Number */}
                    <div>
                      {photo.caption ? (
                        <p className="text-white font-inter text-xs font-medium line-clamp-2 drop-shadow-sm">
                          {photo.caption}
                        </p>
                      ) : (
                        <span className="text-white/80 font-mono text-[10px] uppercase tracking-wider font-bold">
                          Foto #{idx + 1}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cover Badge Indicator */}
                  {photo.isCover && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="px-2 py-0.5 rounded-md bg-sougen-blue/90 text-white font-inter font-bold text-[9px] uppercase tracking-wider shadow-sm">
                        Cover
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ── LOAD MORE BUTTON ── */}
            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={loadMore}
                  disabled={loadingMore}
                  variant="outlined"
                  size="lg"
                  className="px-8 py-3 rounded-xl font-inter font-bold text-xs uppercase tracking-wider gap-2 shadow-sm hover:shadow-md transition-all"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-sougen-blue" />
                      <span>Memuat Foto Berikutnya...</span>
                    </>
                  ) : (
                    <>
                      <Images className="w-4 h-4" />
                      <span>Muat Foto Lainnya</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── PRO LIGHTBOX VIEWER ── */}
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={lightboxSlides}
        plugins={[Zoom, Thumbnails, Counter, Captions]}
        carousel={{ padding: 0, spacing: 0, imageFit: 'contain' }}
        animation={{ fade: 250, swipe: 250 }}
        styles={{
          container: { backgroundColor: 'rgba(5, 11, 20, 0.96)' },
          thumbnail: { borderColor: 'rgba(255, 255, 255, 0.25)' },
        }}
      />
    </div>
  );
}