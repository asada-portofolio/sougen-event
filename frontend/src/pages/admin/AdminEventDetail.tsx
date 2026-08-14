import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';

import TabBasicInfo from '../../components/admin/event/TabBasicInfo';
import TabVisual from '../../components/admin/event/TabVisual';
import TabTalent from '../../components/admin/event/TabTalent';
import TabProgram from '../../components/admin/event/TabProgram';
import TabRundown from '../../components/admin/event/TabRundown';
import TabGallery from '../../components/admin/event/TabGallery';
import TabAdvanced from '../../components/admin/event/TabAdvanced';

const TABS = [
  { id: 'basic', label: 'Info Dasar', icon: Info },
  { id: 'visual', label: 'Visual', icon: ImageIcon },
  { id: 'talent', label: 'Talent', icon: Users },
  { id: 'program', label: 'Program', icon: Sparkles },
  { id: 'rundown', label: 'Rundown', icon: CalendarDays },
  { id: 'gallery', label: 'Gallery', icon: LayoutGrid },
  { id: 'advanced', label: 'Pengaturan Lanjut', icon: Settings },
];

export default function AdminEventDetail() {
  const { id } = useParams<{ id: string }>(); // Ini bisa slug atau id, kita sesuaikan dengan route
  const navigate = useNavigate();
  
  const [eventData, setEventData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(70);
  const [paddingOffset, setPaddingOffset] = useState(16);

  useEffect(() => {
    const measureHeader = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
      setPaddingOffset(window.innerWidth >= 768 ? 32 : 16);
    };
    measureHeader();
    window.addEventListener('resize', measureHeader);
    return () => window.removeEventListener('resize', measureHeader);
  }, [eventData]);
  
  // Karena param bisa id atau slug, API getBySlug bisa dipakai untuk dua-duanya (tergantung backend)
  // Backend kita punya /api/events/:slug. 
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
        <Loader2 className="w-8 h-8 animate-spin text-rpo-red" />
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

  return (
    <div className="space-y-0 lg:space-y-6 pb-20">
      {/* Header */}
      <div 
        ref={headerRef}
        className="sticky -top-4 md:-top-8 z-20 bg-admin-base -mx-4 px-4 pt-4 pb-6 md:-mx-8 md:px-8 md:pt-8 lg:static lg:mx-0 lg:px-0 lg:pt-0 lg:pb-0"
      >
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/event')}
            className="p-2 border border-admin-border bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-admin-dark" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl md:text-3xl font-poppins font-bold text-admin-dark truncate">
              Edit: {eventData.name}
            </h1>
            <p className="text-xs md:text-sm text-admin-secondary mt-0.5">
              {eventData.isActive ? 'Status: Publik' : 'Status: Draft'}
            </p>
          </div>
        </div>
      </div>

      <Tabs.Root defaultValue="basic" className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Navigation Sidebar */}
        <Tabs.List 
          style={{ top: `${headerHeight - paddingOffset}px` }}
          className="sticky z-10 bg-admin-base -mx-4 px-4 pb-3 md:-mx-8 md:px-8 w-[calc(100%+2rem)] md:w-[calc(100%+4rem)] lg:static lg:mx-0 lg:px-0 lg:pb-0 lg:w-64 shrink-0 flex lg:flex-col overflow-x-auto lg:overflow-visible border-b lg:border-b-0 lg:border-r border-admin-border pr-0 lg:pr-4 gap-1 hide-scrollbar"
        >
          {TABS.map((tab) => (
            <Tabs.Trigger
              key={tab.id}
              value={tab.id}
              className="group flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap text-admin-secondary hover:text-admin-dark hover:bg-gray-50 data-[state=active]:bg-rpo-red data-[state=active]:text-white transition-all outline-none"
            >
              <tab.icon className="w-[18px] h-[18px] shrink-0" />
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* Tab Contents */}
        <div className="flex-1 w-full min-w-0 bg-white border border-admin-border rounded-xl shadow-sm">
          <Tabs.Content value="basic" className="p-6 md:p-8 focus:outline-none">
            <h2 className="text-lg font-poppins font-semibold text-admin-dark mb-6">Informasi Dasar</h2>
            <TabBasicInfo eventData={eventData} onUpdate={handleUpdate} />
          </Tabs.Content>
          
          <Tabs.Content value="visual" className="p-6 md:p-8 focus:outline-none">
            <h2 className="text-lg font-poppins font-semibold text-admin-dark mb-6">Hero & Visual</h2>
            <TabVisual eventData={eventData} onUpdate={handleUpdate} />
          </Tabs.Content>
          
          <Tabs.Content value="talent" className="p-6 md:p-8 focus:outline-none">
            <h2 className="text-lg font-poppins font-semibold text-admin-dark mb-6">Line Up Talent</h2>
            <TabTalent eventData={eventData} onUpdate={handleUpdate} />
          </Tabs.Content>
          
          <Tabs.Content value="program" className="p-6 md:p-8 focus:outline-none">
            <h2 className="text-lg font-poppins font-semibold text-admin-dark mb-6">Program & Aktivitas</h2>
            <TabProgram eventData={eventData} onUpdate={handleUpdate} />
          </Tabs.Content>
          
          <Tabs.Content value="rundown" className="p-6 md:p-8 focus:outline-none">
            <h2 className="text-lg font-poppins font-semibold text-admin-dark mb-6">Jadwal & Rundown</h2>
            <TabRundown eventData={eventData} onUpdate={handleUpdate} />
          </Tabs.Content>
          
          <Tabs.Content value="gallery" className="p-6 md:p-8 focus:outline-none">
            <h2 className="text-lg font-poppins font-semibold text-admin-dark mb-6">Galeri Foto</h2>
            <TabGallery eventData={eventData} onUpdate={handleUpdate} />
          </Tabs.Content>

          <Tabs.Content value="advanced" className="p-6 md:p-8 focus:outline-none">
            <h2 className="text-lg font-poppins font-semibold text-admin-dark mb-6">Pengaturan Lanjut</h2>
            <TabAdvanced eventData={eventData} onUpdate={handleUpdate} />
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
}