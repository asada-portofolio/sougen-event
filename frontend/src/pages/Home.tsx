import { lazy, Suspense } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { SEO } from '../components/ui/SEO';
import { useActiveEvent } from '../hooks/useActiveEvent';
import { Skeleton } from '../components/ui/Skeleton';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useTalents } from '../hooks/useTalents';

const GuestSection = lazy(() => import('../components/home/GuestSection').then(m => ({ default: m.GuestSection })));
const LineUpSection = lazy(() => import('../components/home/LineUpSection').then(m => ({ default: m.LineUpSection })));
const ActivitySection = lazy(() => import('../components/home/ActivitySection').then(m => ({ default: m.ActivitySection })));
const ProgramRundownSection = lazy(() => import('../components/home/ProgramRundownSection').then(m => ({ default: m.ProgramRundownSection })));
const FaqContactSection = lazy(() => import('../components/home/FaqContactSection').then(m => ({ default: m.FaqContactSection })));

export default function Home() {
  const { event, loading: eventLoading } = useActiveEvent();
  const { settings } = useSiteSettings();
  const { talents } = useTalents({ enabled: !eventLoading && !event });

  // Menggabungkan Guest dan Performer menjadi satu kesatuan (Talents)
  const eventTalents = event?.eventTalents || [];

  // Poin 29 & 30: Cek apakah admin sudah menginput jadwal/rundown untuk event ini
  const hasRundown = event && event.eventDays && event.eventDays.length > 0;

  return (
    <div className="w-full min-h-screen">
      <SEO
        title={event ? `${event.name} | Sougen Creative Management` : 'Beranda | Sougen Creative Management'}
        description={event ? `${event.name}${event.theme ? ` - ${event.theme}` : ''}. Event resmi budaya pop Jepang diselenggarakan oleh Sougen Creative Management di Makassar.` : 'Platform resmi Sougen Creative Management, event organizer kreatif dan komunitas budaya pop Jepang terkemuka di Makassar. Temukan info event terbaru.'}
        ogImage={event?.posterImageUrl || '/og-default.png'}
        canonicalUrl="/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Sougen Creative Management",
          "alternateName": ["Sougen", "Reality Project Organizer", "RPO"],
          "url": typeof window !== 'undefined' ? window.location.origin : "https://sougen.id",
          "logo": `${typeof window !== 'undefined' ? window.location.origin : "https://sougen.id"}/images/main-logo.png`,
          "description": "Platform resmi Sougen Creative Management, event organizer kreatif dan komunitas budaya pop Jepang terkemuka di Makassar.",
          "sameAs": [
            "https://www.instagram.com/sougen.id"
          ]
        }}
      />

      {/* 1. Hero Section (Rendered IMMEDIATELY from frame 1 - eliminates LCP render delay) */}
      <HeroSection event={event} settings={settings} />

      {/* 2. Below-the-fold sections (Tampilkan skeleton bawah layar hanya jika data awal masih dimuat) */}
      {eventLoading && !event ? (
        <div className="max-w-7xl mx-auto py-16 px-4 space-y-16">
          <div className="space-y-4 text-center">
            <Skeleton className="w-32 h-6 mx-auto bg-sougen-blue/10" />
            <Skeleton className="w-64 h-10 mx-auto bg-rpo-black/5" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-xl bg-rpo-black/5" />)}
          </div>
        </div>
      ) : (
        <>
          {/* 2. Lineup/Guest Section (Semua Talent Event Aktif) */}
          {event && (
            <Suspense fallback={<Skeleton className="w-full h-64 bg-[#FAFAFA]" />}>
              <GuestSection guests={eventTalents} eventSlug={event?.slug} />
            </Suspense>
          )}

          {/* 3. Line Up Section (Case 2: Tidak ada event aktif / Mode Standby) */}
          {!event && (
            <Suspense fallback={<Skeleton className="w-full h-64 bg-[#FAFAFA]" />}>
              <LineUpSection performers={talents} />
            </Suspense>
          )}

          {/* 4. Our Activity Section (Case 2: Tampil hanya jika tidak ada jadwal event aktif) */}
          {!hasRundown && (
            <Suspense fallback={<Skeleton className="w-full h-64 bg-rpo-black" />}>
              <ActivitySection />
            </Suspense>
          )}

          {/* 5. Program & Rundown Section (Case 1: Tampil hanya jika ada jadwal event aktif) */}
          {hasRundown && (
            <Suspense fallback={<Skeleton className="w-full h-96 bg-[#FAFAFA]" />}>
              <ProgramRundownSection
                days={event.eventDays || []}
                location={event.location}
              />
            </Suspense>
          )}

          {/* 6. FAQ & Contact Section */}
          <Suspense fallback={<Skeleton className="w-full h-96 bg-[#FAFAFA]" />}>
            <FaqContactSection />
          </Suspense>
        </>
      )}
    </div>
  );
}