import { useState, useMemo } from 'react';
import { SEO } from '../components/ui/SEO';
import { useActiveEvent } from '../hooks/useActiveEvent';
import { useEvents } from '../hooks/useEvents';
import { HighlightBanner } from '../components/event/HighlightBanner';
import { EventCard } from '../components/event/EventCard';
import { Pagination } from '../components/shared/Pagination';
import { Skeleton } from '../components/ui/Skeleton';
import { SectionHeader } from '../components/shared/SectionHeader';
import { cn } from '../lib/utils';

const ITEMS_PER_PAGE = 10;

type FilterType = 'ALL' | 'ACTIVE' | 'COMPLETED';

export default function EventList() {
  const { event: activeEvent, loading: loadingActive } = useActiveEvent();
  const { events, loading: loadingEvents, error } = useEvents();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<FilterType>('ALL');

  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-rpo-red font-inter text-lg">Gagal memuat daftar event. Silakan coba lagi nanti.</p>
      </div>
    );
  }

  // Filter and sort events based on active filter
  const filteredEvents = useMemo(() => {
    let result = events;
    switch (filter) {
      case 'ACTIVE':
        result = events.filter(e => e.isActive);
        break;
      case 'COMPLETED':
        result = events.filter(e => !e.isActive);
        break;
      default:
        result = events;
    }
    
    // Sort so active event is first, then reverse chronological
    return [...result].sort((a, b) => {
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
  }, [events, filter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentEvents = filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page when filtering
  };

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA]">
      <SEO 
        title="Jelajahi Event | Reality Project Organizer" 
        description="Jelajahi riwayat dan daftar event kreatif budaya pop Jepang dari RPO." 
        canonicalUrl="/event"
      />

      {/* Banner Khusus Event Aktif */}
      {loadingActive ? (
        <Skeleton className="w-full h-96 bg-black/5 rounded-none" />
      ) : (
        <HighlightBanner event={activeEvent} />
      )}

      {/* Daftar Event */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <SectionHeader 
            label="OUR JOURNEY"
            title="EVENT ARCHIVE"
            description="Rekam jejak perjalanan komunitas dan acara dari tahun ke tahun"
            theme="light"
            align="left"
            className="mb-0"
          />

          {/* Pill Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <button
              onClick={() => handleFilterChange('ALL')}
              className={cn(
                "px-5 py-2 rounded-full font-inter text-sm font-bold tracking-wide transition-all duration-300 shrink-0 border-2",
                filter === 'ALL' 
                  ? "bg-rpo-red text-white border-rpo-red" 
                  : "bg-white text-rpo-black/50 border-rpo-black/10 hover:border-rpo-red hover:text-rpo-red"
              )}
            >
              Semua Event
            </button>
            <button
              onClick={() => handleFilterChange('ACTIVE')}
              className={cn(
                "px-5 py-2 rounded-full font-inter text-sm font-bold tracking-wide transition-all duration-300 shrink-0 border-2",
                filter === 'ACTIVE' 
                  ? "bg-rpo-red text-white border-rpo-red" 
                  : "bg-white text-rpo-black/50 border-rpo-black/10 hover:border-rpo-red hover:text-rpo-red"
              )}
            >
              Aktif
            </button>
            <button
              onClick={() => handleFilterChange('COMPLETED')}
              className={cn(
                "px-5 py-2 rounded-full font-inter text-sm font-bold tracking-wide transition-all duration-300 shrink-0 border-2",
                filter === 'COMPLETED' 
                  ? "bg-rpo-red text-white border-rpo-red" 
                  : "bg-white text-rpo-black/50 border-rpo-black/10 hover:border-rpo-red hover:text-rpo-red"
              )}
            >
              Selesai
            </button>
          </div>
        </div>

        {loadingEvents ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Skeleton key={i} className="w-full aspect-[3/4] bg-black/5 rounded-xl border border-black/10" />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-rpo-black/5">
            <p className="text-rpo-black/50 font-inter text-lg">Tidak ada event yang ditemukan untuk kategori ini.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {currentEvents.map(event => (
                <EventCard key={event.id} event={event} />
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