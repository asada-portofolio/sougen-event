import { lazy, Suspense } from 'react';
import { SEO } from '../components/ui/SEO';
import { Skeleton } from '../components/ui/Skeleton';
import { useHomeBootstrap } from '../hooks/useHomeBootstrap';

import { HeroSection } from '../components/home/HeroSection';
const GuestSection = lazy(() => import('../components/home/GuestSection').then(m => ({ default: m.GuestSection })));
const LineUpSection = lazy(() => import('../components/home/LineUpSection').then(m => ({ default: m.LineUpSection })));
const ActivitySection = lazy(() => import('../components/home/ActivitySection').then(m => ({ default: m.ActivitySection })));
const ProgramRundownSection = lazy(() => import('../components/home/ProgramRundownSection').then(m => ({ default: m.ProgramRundownSection })));
const FaqContactSection = lazy(() => import('../components/home/FaqContactSection').then(m => ({ default: m.FaqContactSection })));

export default function Home() {
  const { data, loading } = useHomeBootstrap();

  const event = data?.activeEvent ?? null;
  const settings = data?.settings ?? null;
  const talents = data?.talents ?? [];
  const faqs = data?.faqs ?? [];

  // Menggabungkan Guest dan Performer menjadi satu kesatuan (Talents)
  const eventTalents = event?.eventTalents || [];

  // Poin 29 & 30: Cek apakah admin sudah menginput jadwal/rundown untuk event ini
  const hasRundown = event && event.eventDays && event.eventDays.length > 0;

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#FAFAFA]">
        <SEO title="Memuat... | Sougen Creative Management" description="Memuat data..." />
        <Skeleton className="w-full h-[85vh] min-h-[600px] rounded-none bg-rpo-black/10" />
        <Skeleton className="w-full h-14 rounded-none bg-sougen-blue/20" />
        <div className="max-w-7xl mx-auto py-20 px-4 space-y-24">
          <div className="space-y-6">
            <Skeleton className="w-32 h-6 mx-auto bg-sougen-blue/10" />
            <Skeleton className="w-64 h-10 mx-auto bg-rpo-black/5" />
            <Skeleton className="w-96 h-4 mx-auto bg-rpo-black/5" />
            <div className="flex gap-6 mt-12 justify-center">
              {[1, 2, 3].map(i => <Skeleton key={i} className="w-[280px] h-[420px] rounded-xl bg-rpo-black/5" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      {/* 1. Hero Section (Directly rendered above-the-fold for optimal LCP) */}
      <HeroSection event={event} settings={settings} />

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
        <FaqContactSection initialFaqs={faqs} />
      </Suspense>
    </div>
  );
}