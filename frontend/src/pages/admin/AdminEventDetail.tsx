import { useState, useEffect } from 'react';
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
  AlertCircle,
  Calendar,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';
import { formatDateShort } from '../../utils/date';

import TabBasicInfo from '../../components/admin/event/TabBasicInfo';
import TabVisual from '../../components/admin/event/TabVisual';
import TabTalent from '../../components/admin/event/TabTalent';
import TabProgram from '../../components/admin/event/TabProgram';
import TabRundown from '../../components/admin/event/TabRundown';
import TabGallery from '../../components/admin/event/TabGallery';
import TabAdvanced from '../../components/admin/event/TabAdvanced';

const TABS = [
  { id: 'basic', label: 'Info Dasar', icon: Info, countKey: null },
  { id: 'visual', label: 'Hero & Visual', icon: ImageIcon, countKey: null },
  { id: 'talent', label: 'Line Up Talent', icon: Users, countKey: 'eventTalents' },
  { id: 'program', label: 'Program & Acara', icon: Sparkles, countKey: 'eventPrograms' },
  { id: 'rundown', label: 'Jadwal & Rundown', icon: CalendarDays, countKey: 'eventDays' },
  { id: 'gallery', label: 'Galeri Foto', icon: LayoutGrid, countKey: 'galleryPhotos' },
  { id: 'advanced', label: 'Pengaturan Lanjut', icon: Settings, countKey: null },
];

export default function AdminEventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [eventData, setEventData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-9 h-9 animate-spin text-sougen-blue" />
        <p className="text-sm font-medium text-admin-secondary">Memuat data event...</p>
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
          className="mt-4 px-5 py-2.5 bg-sougen-blue text-white rounded-xl text-sm font-medium hover:bg-sougen-blue/90 transition-colors shadow-sm"
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
    <div className="space-y-6 pb-24">
      {/* Event Command Center Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 md:p-8 text-white shadow-lg border border-slate-700/60">
        {/* Glow backdrop decorative lighting */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-sougen-blue/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 md:gap-5">
            <button 
              onClick={() => navigate('/admin/event')}
              className="mt-1 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15 shadow-sm shrink-0 active:scale-95"
              title="Kembali ke Manajemen Event"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-xs ${
                  eventData.isActive 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${eventData.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  {eventData.isActive ? 'Event Publik' : 'Draft / Nonaktif'}
                </span>

                {eventData.theme && (
                  <span className="text-xs text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10 truncate max-w-[280px]">
                    {eventData.theme}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-poppins font-black text-white tracking-tight drop-shadow-sm truncate">
                {eventData.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs md:text-sm text-slate-300 font-inter">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-sougen-blue shrink-0" />
                  <span>{formatDateShort(eventData.startDate)} - {formatDateShort(eventData.endDate)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-sougen-blue shrink-0" />
                  <span className="truncate max-w-[300px]">{eventData.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-center">
            <a
              href={`/event/${eventData.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sougen-blue text-white text-xs sm:text-sm font-semibold hover:bg-sougen-blue/90 transition-all shadow-md shadow-sougen-blue/30 active:scale-95"
            >
              <span>Lihat Halaman Publik</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Mini Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
            <Users className="w-4 h-4 text-sougen-blue" />
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Talent</p>
              <p className="font-bold text-white text-sm">{eventData.eventTalents?.length || 0} Terdaftar</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Program</p>
              <p className="font-bold text-white text-sm">{eventData.eventPrograms?.length || 0} Aktivitas</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
            <CalendarDays className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Hari & Rundown</p>
              <p className="font-bold text-white text-sm">{eventData.eventDays?.length || 0} Hari</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
            <LayoutGrid className="w-4 h-4 text-purple-400" />
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Foto Galeri</p>
              <p className="font-bold text-white text-sm">{eventData.galleryPhotos?.length || 0} Foto</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation & Workspace */}
      <Tabs.Root defaultValue="basic" className="space-y-6">
        {/* Horizontal Navigation Tabs Pill Bar */}
        <div className="sticky top-2 z-20 bg-admin-base/90 backdrop-blur-md py-1">
          <Tabs.List className="flex items-center gap-1.5 p-1.5 bg-white border border-admin-border rounded-2xl shadow-xs overflow-x-auto hide-scrollbar">
            {TABS.map((tab) => {
              const count = tab.countKey ? eventData[tab.countKey]?.length : null;
              return (
                <Tabs.Trigger
                  key={tab.id}
                  value={tab.id}
                  className="group inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap text-admin-secondary hover:text-admin-dark hover:bg-gray-100/70 data-[state=active]:bg-sougen-blue data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-sougen-blue/25 transition-all duration-200 outline-none shrink-0"
                >
                  <tab.icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                  {count !== null && count > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 data-[state=active]:bg-white data-[state=active]:text-sougen-blue text-admin-secondary">
                      {count}
                    </span>
                  )}
                </Tabs.Trigger>
              );
            })}
          </Tabs.List>
        </div>

        {/* Tab Contents Card */}
        <div className="w-full bg-white border border-admin-border rounded-2xl shadow-xs overflow-hidden">
          <Tabs.Content value="basic" className="p-6 md:p-8 lg:p-10 focus:outline-none">
            <TabBasicInfo eventData={eventData} onUpdate={handleUpdate} />
          </Tabs.Content>
          
          <Tabs.Content value="visual" className="p-6 md:p-8 lg:p-10 focus:outline-none">
            <TabVisual eventData={eventData} onUpdate={handleUpdate} />
          </Tabs.Content>
          
          <Tabs.Content value="talent" className="p-6 md:p-8 lg:p-10 focus:outline-none">
            <TabTalent eventData={eventData} onUpdate={handleUpdate} />
          </Tabs.Content>
          
          <Tabs.Content value="program" className="p-6 md:p-8 lg:p-10 focus:outline-none">
            <TabProgram eventData={eventData} onUpdate={handleUpdate} />
          </Tabs.Content>
          
          <Tabs.Content value="rundown" className="p-6 md:p-8 lg:p-10 focus:outline-none">
            <TabRundown eventData={eventData} onUpdate={handleUpdate} />
          </Tabs.Content>
          
          <Tabs.Content value="gallery" className="p-6 md:p-8 lg:p-10 focus:outline-none">
            <TabGallery eventData={eventData} onUpdate={handleUpdate} />
          </Tabs.Content>

          <Tabs.Content value="advanced" className="p-6 md:p-8 lg:p-10 focus:outline-none">
            <TabAdvanced eventData={eventData} onUpdate={handleUpdate} />
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
}