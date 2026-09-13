import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import { 
  ArrowLeft,
  Info,
  Image as ImageIcon,
  Users,
  Sparkles,
  CalendarDays,
  LayoutGrid,
  Settings,
  Loader2,
  AlertCircle,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { api } from '../../services/api';
import { formatDateShort } from '../../utils/date';
import { getImageUrl } from '../../utils/getImageUrl';
import { EventCompletenessBadge } from '../../components/admin/event/EventCompletenessBadge';

import TabBasicInfo from '../../components/admin/event/TabBasicInfo';
import TabVisual from '../../components/admin/event/TabVisual';
import TabTalent from '../../components/admin/event/TabTalent';
import TabProgram from '../../components/admin/event/TabProgram';
import TabRundown from '../../components/admin/event/TabRundown';
import TabGallery from '../../components/admin/event/TabGallery';
import TabAdvanced from '../../components/admin/event/TabAdvanced';

const TABS = [
  { id: 'basic', label: 'Info Dasar', desc: 'Identitas, waktu & venue', icon: Info },
  { id: 'visual', label: 'Hero & Visual', desc: 'Poster & gambar header', icon: ImageIcon },
  { id: 'talent', label: 'Line Up Talent', desc: 'Bintang tamu & performer', icon: Users },
  { id: 'program', label: 'Program Acara', desc: 'Aktivitas & pendaftaran', icon: Sparkles },
  { id: 'rundown', label: 'Jadwal Rundown', desc: 'Agenda per hari acara', icon: CalendarDays },
  { id: 'gallery', label: 'Galeri Foto', desc: 'Dokumentasi festival', icon: LayoutGrid },
  { id: 'advanced', label: 'Pengaturan Lanjut', desc: 'Drive & tindakan lanjutan', icon: Settings },
];

export default function AdminEventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [eventData, setEventData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const initialTab = searchParams.get('tab') || 'basic';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [highlightedFieldId, setHighlightedFieldId] = useState<string | null>(searchParams.get('highlight'));



  // Sync tab & highlight from URL params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
    const hl = searchParams.get('highlight');
    if (hl) {
      setHighlightedFieldId(hl);
    }
  }, [searchParams]);

  // Apply smooth scroll & highlight class when target is present
  useEffect(() => {
    if (!highlightedFieldId || loading) return;

    const timer = setTimeout(() => {
      const el = document.getElementById(highlightedFieldId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('animate-field-highlight');
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [highlightedFieldId, activeTab, loading]);

  // Dismiss highlight when user interacts with target element
  useEffect(() => {
    if (!highlightedFieldId) return;

    const handleInteraction = (e: Event) => {
      const target = e.target as HTMLElement | null;
      const el = document.getElementById(highlightedFieldId);
      if (el && (el.contains(target) || el === target)) {
        el.classList.remove('animate-field-highlight');
        setHighlightedFieldId(null);
        
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('highlight');
        setSearchParams(newParams, { replace: true });
      }
    };

    document.addEventListener('click', handleInteraction, true);
    document.addEventListener('focusin', handleInteraction, true);
    document.addEventListener('keydown', handleInteraction, true);

    return () => {
      document.removeEventListener('click', handleInteraction, true);
      document.removeEventListener('focusin', handleInteraction, true);
      document.removeEventListener('keydown', handleInteraction, true);
      const el = document.getElementById(highlightedFieldId);
      if (el) el.classList.remove('animate-field-highlight');
    };
  }, [highlightedFieldId, searchParams, setSearchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', value);
    newParams.delete('highlight');
    setSearchParams(newParams);
  };
  
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/events/${id}`);
        setEventData(res.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Gagal memuat detail event'));
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-sougen-blue" />
      </div>
    );
  }

  if (error || !eventData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-admin-secondary">
        <AlertCircle className="w-12 h-12 mb-4 text-red-400" />
        <h2 className="text-xl font-poppins font-semibold text-admin-dark">Event Tidak Ditemukan</h2>
        <button 
          onClick={() => navigate('/admin/event')}
          className="mt-4 px-4 py-2 border border-admin-border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Kembali ke Daftar Event
        </button>
      </div>
    );
  }

  const handleUpdate = (updatedData: any) => {
    setEventData((prev: any) => ({ ...prev, ...updatedData }));
  };

  const currentTabObj = TABS.find(t => t.id === activeTab) || TABS[0];
  const CurrentTabIcon = currentTabObj.icon;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Executive Event Header Card */}
      <div 
        className="bg-white border border-admin-border/80 rounded-2xl p-5 sm:p-6 shadow-xs"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          {/* Left Side: Back button, Poster preview & Event Info */}
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            <button 
              onClick={() => navigate('/admin/event')}
              className="p-2.5 border border-admin-border/80 bg-gray-50 hover:bg-white text-admin-secondary hover:text-admin-dark rounded-xl transition-all shadow-2xs shrink-0 cursor-pointer"
              title="Kembali ke Daftar Event"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Poster Thumbnail */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-gray-100 border border-admin-border/80 shrink-0 shadow-2xs flex items-center justify-center">
              {eventData.posterImageUrl ? (
                <img 
                  src={getImageUrl(eventData.posterImageUrl)} 
                  alt={eventData.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-6 h-6 text-gray-400" />
              )}
            </div>

            {/* Titles, Theme, and Status Badges */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[11px] font-mono font-bold text-sougen-blue uppercase tracking-wider">
                  Pengelolaan Event
                </span>
                <span className="text-gray-300">•</span>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-inter font-bold uppercase tracking-wider ${eventData.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${eventData.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                  {eventData.isActive ? 'Publik' : 'Draft'}
                </span>
                <EventCompletenessBadge event={eventData} />
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-poppins font-bold text-admin-dark truncate tracking-tight">
                {eventData.name}
              </h1>
              {eventData.theme && (
                <p className="text-xs sm:text-sm text-admin-secondary line-clamp-1 mt-0.5">
                  {eventData.theme}
                </p>
              )}
            </div>
          </div>

          {/* Right Side: Quick Meta & External Link */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-admin-border/60">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-admin-border/60 text-xs text-admin-secondary">
              <CalendarDays className="w-4 h-4 text-sougen-blue shrink-0" />
              <span className="font-medium text-admin-dark">
                {formatDateShort(eventData.startDate)} - {formatDateShort(eventData.endDate)}
              </span>
            </div>
            {eventData.location && (
              <div className="hidden xl:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-admin-border/60 text-xs text-admin-secondary max-w-[200px]">
                <MapPin className="w-4 h-4 text-sougen-blue shrink-0" />
                <span className="font-medium text-admin-dark truncate">
                  {eventData.location}
                </span>
              </div>
            )}
            
            <a
              href={`/event/${eventData.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sougen-blue/10 hover:bg-sougen-blue hover:text-white text-sougen-blue rounded-xl border border-sougen-blue/20 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
              title="Buka halaman event di web publik"
            >
              <span>Web Publik</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </div>

      {/* Main Workspace (Tabs Layout) */}
      <Tabs.Root value={activeTab} onValueChange={handleTabChange} className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Navigation Sidebar: Sticky on Mobile (horizontal slider) & Sticky on Desktop (fixed sidebar) */}
        <div className="sticky top-0 lg:top-4 z-20 w-full lg:w-72 shrink-0 bg-admin-base/95 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none py-1.5 lg:py-0">
          <Tabs.List 
            className="bg-white border border-admin-border/80 rounded-2xl p-2 sm:p-2.5 shadow-sm lg:shadow-xs w-full flex flex-col gap-1.5"
          >
            {/* Keterangan Teks Menu Pengaturan (Visible on Mobile & Desktop) */}
            <div className="flex items-center justify-between px-2.5 sm:px-3 py-1 border-b border-gray-100 lg:border-none lg:pb-0.5">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <Settings className="w-3.5 h-3.5 text-sougen-blue" />
                <span>Menu Pengaturan</span>
              </div>
              <span className="block lg:hidden text-[10px] text-gray-400 font-sans">
                Geser horizontal &rarr;
              </span>
            </div>

            {/* Tab Items: Horizontal Scroll on Mobile, Vertical Stack on Desktop */}
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5 hide-scrollbar">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const badgeCount = 
                  tab.id === 'talent' ? (eventData._count?.eventTalents ?? eventData.eventTalents?.length ?? 0) :
                  tab.id === 'program' ? (eventData._count?.eventPrograms ?? eventData.eventPrograms?.length ?? 0) :
                  tab.id === 'rundown' ? (eventData._count?.eventDays ?? eventData.eventDays?.length ?? 0) :
                  tab.id === 'gallery' ? (eventData._count?.galleryPhotos ?? eventData.galleryPhotos?.length ?? 0) : null;

                return (
                  <Tabs.Trigger
                    key={tab.id}
                    value={tab.id}
                    className="group flex items-center justify-between shrink-0 lg:shrink px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap text-gray-600 hover:text-admin-dark hover:bg-gray-50/80 data-[state=active]:bg-sougen-blue data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-sm data-[state=active]:shadow-sougen-blue/20 transition-all cursor-pointer outline-none select-none text-left"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                      <div>
                        <div>{tab.label}</div>
                        <div className="hidden lg:block text-[11px] font-normal text-gray-400 group-data-[state=active]:text-white/80 transition-colors">
                          {tab.desc}
                        </div>
                      </div>
                    </div>

                    {badgeCount !== null && badgeCount > 0 && (
                      <span className="hidden sm:inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-gray-100 group-data-[state=active]:bg-white/20 text-gray-600 group-data-[state=active]:text-white transition-colors ml-2">
                        {badgeCount}
                      </span>
                    )}
                  </Tabs.Trigger>
                );
              })}
            </div>
          </Tabs.List>
        </div>

        {/* Tab Contents Panel */}
        <div className="flex-1 w-full min-w-0 bg-white border border-admin-border/80 rounded-2xl shadow-xs overflow-hidden">
          
          {/* Header Bar inside Tab */}
          <div className="p-5 sm:p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-sougen-blue/10 text-sougen-blue flex items-center justify-center shrink-0 shadow-2xs">
                <CurrentTabIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-poppins font-bold text-admin-dark leading-tight">
                  {currentTabObj.label}
                </h2>
                <p className="text-xs text-admin-secondary mt-0.5">
                  {currentTabObj.desc}
                </p>
              </div>
            </div>
          </div>

          {/* Tab Contents Body */}
          <div className="p-6 md:p-8">
            <Tabs.Content value="basic" className="focus:outline-none">
              <TabBasicInfo eventData={eventData} onUpdate={handleUpdate} />
            </Tabs.Content>
            
            <Tabs.Content value="visual" className="focus:outline-none">
              <TabVisual eventData={eventData} onUpdate={handleUpdate} />
            </Tabs.Content>
            
            <Tabs.Content value="talent" className="focus:outline-none">
              <TabTalent eventData={eventData} onUpdate={handleUpdate} />
            </Tabs.Content>
            
            <Tabs.Content value="program" className="focus:outline-none">
              <TabProgram eventData={eventData} onUpdate={handleUpdate} />
            </Tabs.Content>
            
            <Tabs.Content value="rundown" className="focus:outline-none">
              <TabRundown eventData={eventData} onUpdate={handleUpdate} />
            </Tabs.Content>
            
            <Tabs.Content value="gallery" className="focus:outline-none">
              <TabGallery eventData={eventData} onUpdate={handleUpdate} />
            </Tabs.Content>

            <Tabs.Content value="advanced" className="focus:outline-none">
              <TabAdvanced eventData={eventData} onUpdate={handleUpdate} />
            </Tabs.Content>
          </div>

        </div>
      </Tabs.Root>
    </div>
  );
}