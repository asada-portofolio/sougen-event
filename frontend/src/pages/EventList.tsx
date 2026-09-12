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
import { Search, X } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

type FilterType = 'ALL' | 'ACTIVE' | 'COMPLETED';

export default function EventList() {
  const { event: activeEvent, loading: loadingActive } = useActiveEvent();
  const { events, loading: loadingEvents, error } = useEvents();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-rpo-negative font-inter text-lg">Gagal memuat daftar event. Silakan coba lagi nanti.</p>
      </div>
    );
  }

  // Filter and sort events based on active filter and search query
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

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e => 
        e.name.toLowerCase().includes(q) || 
        (e.theme && e.theme.toLowerCase().includes(q)) || 
        (e.location && e.location.toLowerCase().includes(q))
      );
    }
    
    // Sort so active event is first, then reverse chronological
    return [...result].sort((a, b) => {
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
  }, [events, filter, searchQuery]);

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
        title="Jelajahi Event | Sougen Creative Management" 
        description="Jelajahi riwayat dan agenda daftar event kreatif, festival budaya pop Jepang, anime expo, serta kompetisi cosplay dari Sougen Creative Management." 
        canonicalUrl="/event"
      />

      {/* Banner Khusus Event Aktif ATAU Intro Hero saat Tidak Ada Event Aktif */}
      {loadingActive ? (
        <Skeleton className="w-full h-96 bg-black/5 rounded-none" />
      ) : activeEvent?.isActive ? (
        <HighlightBanner event={activeEvent} />
      ) : (
        <div className="w-full bg-[#00486E] pt-24 pb-8 md:pt-36 md:pb-20">
          <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
            <SectionHeader 
              as="h1"
              label="OUR JOURNEY"
              title="EVENT ARCHIVE"
              description="Jelajahi riwayat dan daftar event kreatif budaya pop Jepang dari Sougen Creative Management."
              theme="dark"
              align="full-center"
            />
          </div>
        </div>
      )}

      {/* Daftar Event */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 pb-12 md:py-16">
        {/* Header and Controls Section */}
        <div className="flex flex-col gap-6 mb-8 md:mb-10">
          {activeEvent?.isActive && (
            <SectionHeader 
              label="OUR JOURNEY"
              title="EVENT ARCHIVE"
              description="Rekam jejak perjalanan komunitas dan acara dari tahun ke tahun"
              theme="light"
              align="left"
              className="mb-0"
            />
          )}

          {/* Controls Bar: Search Bar with Clear Outline + Clean Filter Tabs */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 bg-white p-3 rounded-2xl border border-rpo-black/10 shadow-sm">
            {/* Search Input Box with Noticeable Outline & Glow */}
            <div className="relative flex-1 max-w-full md:max-w-md flex items-center bg-gray-50/80 focus-within:bg-white border-2 border-rpo-black/15 focus-within:border-sougen-blue focus-within:ring-4 focus-within:ring-sougen-blue/15 rounded-xl transition-all duration-300">
              <Search className="w-4 h-4 text-sougen-blue absolute left-3.5 top-1/2 -translate-y-1/2 shrink-0 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari nama event, tema, atau lokasi..."
                className="w-full pl-10 pr-9 py-2.5 bg-transparent text-xs sm:text-sm font-inter font-medium text-rpo-black placeholder:text-rpo-black/45 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-rpo-black/40 hover:text-rpo-black hover:bg-black/5 rounded-full transition-colors"
                  aria-label="Hapus pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar shrink-0">
              <button
                onClick={() => handleFilterChange('ALL')}
                className={cn(
                  "px-4 py-2 rounded-xl font-inter text-xs font-bold tracking-wide transition-all duration-200 shrink-0 border-2",
                  filter === 'ALL' 
                    ? "bg-sougen-blue-dark text-white border-sougen-blue-dark shadow-sm" 
                    : "bg-white text-gray-700 border-gray-300 hover:border-sougen-blue-dark hover:text-sougen-blue-dark"
                )}
              >
                Semua Event
              </button>
              <button
                onClick={() => handleFilterChange('ACTIVE')}
                className={cn(
                  "px-4 py-2 rounded-xl font-inter text-xs font-bold tracking-wide transition-all duration-200 shrink-0 border-2",
                  filter === 'ACTIVE' 
                    ? "bg-sougen-blue-dark text-white border-sougen-blue-dark shadow-sm" 
                    : "bg-white text-gray-700 border-gray-300 hover:border-sougen-blue-dark hover:text-sougen-blue-dark"
                )}
              >
                Aktif
              </button>
              <button
                onClick={() => handleFilterChange('COMPLETED')}
                className={cn(
                  "px-4 py-2 rounded-xl font-inter text-xs font-bold tracking-wide transition-all duration-200 shrink-0 border-2",
                  filter === 'COMPLETED' 
                    ? "bg-sougen-blue-dark text-white border-sougen-blue-dark shadow-sm" 
                    : "bg-white text-gray-700 border-gray-300 hover:border-sougen-blue-dark hover:text-sougen-blue-dark"
                )}
              >
                Selesai
              </button>
            </div>
          </div>
        </div>

        {loadingEvents ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Skeleton key={i} className="w-full aspect-[4/5] sm:aspect-[3/4] bg-black/5 rounded-2xl border border-black/5" />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-rpo-black/5">
            <p className="text-rpo-black/50 font-inter text-lg">Tidak ada event yang ditemukan.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
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