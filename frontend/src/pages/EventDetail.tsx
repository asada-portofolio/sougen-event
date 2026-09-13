import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEO } from '../components/ui/SEO';
import { useEventDetail } from '../hooks/useEventDetail';
import { EventHero } from '../components/event/EventHero';
import { EventDescriptionSection } from '../components/event/EventDescriptionSection';
import { EventGuestSection } from '../components/event/EventGuestSection';
import { EventLineUpSection } from '../components/event/EventLineUpSection';
import { EventProgramSection } from '../components/event/EventProgramSection';
import { EventRundownSection } from '../components/event/EventRundownSection';
import { EventLocationSection } from '../components/event/EventLocationSection';
import { FaqContactSection } from '../components/home/FaqContactSection';
import { Skeleton } from '../components/ui/Skeleton';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { event, loading, error } = useEventDetail(slug);
  const [selectedDayId, setSelectedDayId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (event?.eventDays && event.eventDays.length > 0 && selectedDayId === undefined) {
      setSelectedDayId(event.eventDays[0].id);
    }
  }, [event, selectedDayId]);

  const handleSelectDay = (dayId: number) => {
    setSelectedDayId(dayId);
    const el = document.getElementById('rundown');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (event && window.location.hash) {
      const hashId = window.location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(hashId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [event]);

  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center gap-4 text-center px-4">
        <h2 className="text-sougen-blue-dark font-poppins text-2xl font-bold">Event Tidak Ditemukan</h2>
        <p className="text-rpo-black/75 font-inter mb-4">Event yang Anda cari mungkin telah dihapus atau URL tidak valid.</p>
        <Button asChild>
          <Link to="/event" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Arsip Event</span>
          </Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#FAFAFA]">
        <Skeleton className="w-full h-[70vh] bg-black/5 rounded-none" />
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 space-y-12">
          <Skeleton className="w-1/3 h-12 bg-black/5 rounded-sm" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="w-full aspect-[3/4] bg-black/5 rounded-xl" />
            <Skeleton className="w-full aspect-[3/4] bg-black/5 rounded-xl" />
            <Skeleton className="w-full aspect-[3/4] bg-black/5 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  // Filter talents
  const guests = event.eventTalents.filter(et => et.role === 'GUEST');
  const lineup = event.eventTalents.filter(et => et.role === 'PERFORMER');

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sougen.id';

  const eventStructuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.name,
    "description": event.description || (event.theme ? `${event.name} - ${event.theme}` : `Informasi lengkap event ${event.name} oleh Sougen Creative Management.`),
    "startDate": event.startDate,
    "endDate": event.endDate,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": event.location,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Makassar",
        "addressCountry": "ID"
      }
    },
    "image": [
      event.posterImageUrl
        ? (event.posterImageUrl.startsWith('http') ? event.posterImageUrl : `${baseUrl}${event.posterImageUrl}`)
        : `${baseUrl}/og-default.png`
    ],
    "organizer": {
      "@type": "Organization",
      "name": "Sougen Creative Management",
      "url": baseUrl
    },
    ...(event.eventTalents && event.eventTalents.length > 0 && {
      "performer": event.eventTalents.map(et => ({
        "@type": "Person",
        "name": et.talent.stageName
      }))
    })
  };

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen">
      <SEO 
        title={`${event.name} | Sougen Creative Management`}
        description={event.description || `Informasi lengkap event ${event.name}${event.theme ? ` (${event.theme})` : ''} oleh Sougen Creative Management. Lihat jadwal rundown, bintang tamu, dan lokasi acara.`}
        ogImage={event.posterImageUrl || undefined}
        canonicalUrl={`/event/${event.slug}`}
        structuredData={eventStructuredData}
      />

      {/* 1. Hero Header Section */}
      <EventHero event={event} onSelectDay={handleSelectDay} />

      {/* 2. Deskripsi Event Section */}
      <EventDescriptionSection 
        description={event.description} 
        eventName={event.name} 
        theme={event.theme} 
      />

      {/* 3. Bintang Tamu (Guest Stars) Section */}
      <EventGuestSection guests={guests} />

      {/* 4. Penampil / Line-Up Section */}
      <EventLineUpSection lineup={lineup} />

      {/* 5. Program Acara Section */}
      <EventProgramSection eventPrograms={event.eventPrograms} />

      {/* 6. Rundown Acara Section */}
      <EventRundownSection 
        days={event.eventDays} 
        activeDayId={selectedDayId} 
        onDayChange={setSelectedDayId} 
      />

      {/* 7. Detail Lokasi & Peta Section */}
      <EventLocationSection location={event.location} days={event.eventDays} />

      {/* 8. FAQ dan Kontak Section */}
      <FaqContactSection />
    </div>
  );
}