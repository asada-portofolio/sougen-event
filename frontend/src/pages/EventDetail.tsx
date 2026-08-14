import { useParams, Link } from 'react-router-dom';
import { SEO } from '../components/ui/SEO';
import { useEventDetail } from '../hooks/useEventDetail';
import { EventHero } from '../components/event/EventHero';
import { EventInfoSection } from '../components/event/EventInfoSection';
import { EventGuestSection } from '../components/event/EventGuestSection';
import { EventLineUpSection } from '../components/event/EventLineUpSection';
import { EventProgramSection } from '../components/event/EventProgramSection';
import { EventRundownSection } from '../components/event/EventRundownSection';
import { Skeleton } from '../components/ui/Skeleton';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { event, loading, error } = useEventDetail(slug);

  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center gap-4 text-center px-4">
        <h2 className="text-rpo-red font-poppins text-2xl font-bold">Event Tidak Ditemukan</h2>
        <p className="text-rpo-black/60 font-inter mb-4">Event yang Anda cari mungkin telah dihapus atau URL tidak valid.</p>
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

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen">
      <SEO 
        title={`${event.name} | Reality Project Organizer`}
        description={`Detail event ${event.name} oleh Reality Project Organizer. Tema: ${event.theme || '-'}.`}
        ogImage={event.posterImageUrl || undefined}
        canonicalUrl={`/event/${event.slug}`}
      />

      {/* Hero Header */}
      <EventHero event={event} />

      {/* Date & Location Info (Per Day) */}
      <EventInfoSection days={event.eventDays} defaultLocation={event.location} />

      {/* Main Content Sections */}
      <div className="py-8">
        <EventGuestSection guests={guests} />
        <EventLineUpSection lineup={lineup} />
        <EventProgramSection eventPrograms={event.eventPrograms} />
        <EventRundownSection days={event.eventDays} />
      </div>
    </div>
  );
}