import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from '@radix-ui/react-switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  CalendarDays, 
  MapPin, 
  Plus, 
  Search, 
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  X,
  Calendar
} from 'lucide-react';
import type { EventBasic } from '../../hooks/useAdminEvents';
import { useAdminEvents } from '../../hooks/useAdminEvents';
import { formatDateShort } from '../../utils/date';
import { getImageUrl } from '../../utils/getImageUrl';

const createSchema = z.object({
  name: z.string().min(3, 'Nama event minimal 3 karakter'),
  startDate: z.string().min(1, 'Pilih tanggal mulai'),
  endDate: z.string().min(1, 'Pilih tanggal selesai'),
  location: z.string().min(3, 'Lokasi wajib diisi'),
});

type CreateValues = z.infer<typeof createSchema>;

export default function AdminEventList() {
  const { events, loading, error, toggleEventStatus, createEvent } = useAdminEvents();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateValues>({
    resolver: zodResolver(createSchema)
  });

  const activeEventCount = events.filter(e => e.isActive).length;

  const handleToggleActive = async (event: EventBasic, checked: boolean) => {
    const success = await toggleEventStatus(event.id, checked);
    if (!success) {
      alert('Gagal mengubah status event. Hanya boleh ada 1 event aktif.');
    }
  };

  const onSubmitCreate = async (data: CreateValues) => {
    setIsCreating(true);
    try {
      const newEvent = await createEvent(data);
      setIsCreateModalOpen(false);
      reset();
      navigate(`/admin/event/${newEvent.slug}`);
    } catch {
      alert('Gagal membuat event baru.');
    } finally {
      setIsCreating(false);
    }
  };

  const filteredEvents = events.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (e.theme && e.theme.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-sougen-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-admin-secondary">
        <AlertCircle className="w-12 h-12 mb-4 text-red-400" />
        <h2 className="text-xl font-poppins font-semibold text-admin-dark">Gagal Memuat Event</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-poppins font-bold text-admin-dark">
            Manajemen Event
          </h1>
          <p className="text-sm text-admin-secondary mt-1">
            Kelola event Sougen, dari jadwal hingga line up talent.
          </p>
        </div>
        
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-sougen-blue text-white text-sm font-medium rounded-lg hover:bg-sougen-blue/90 transition-colors shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Buat Event Baru
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-admin-border shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama event atau tema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-admin-border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
          />
        </div>
        <div className="flex items-center gap-4 px-2 sm:px-4 py-2 bg-gray-50 rounded-lg border border-admin-border text-sm font-medium">
          <span className="text-admin-secondary">Total:</span>
          <span className="text-admin-dark">{events.length}</span>
          <div className="w-px h-4 bg-gray-300 mx-1" />
          <span className="text-admin-secondary">Aktif:</span>
          <span className="text-emerald-600">{activeEventCount}</span>
        </div>
      </div>

      {/* Event Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {filteredEvents.map(event => {
            const isComplete = event._count 
              ? event._count.eventTalents > 0 && event._count.galleryPhotos > 0 
              : false;
            
            return (
              <div 
                key={event.id} 
                className="bg-white border border-admin-border hover:border-sougen-blue/40 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 group flex flex-col"
              >
                {/* Poster Image Area */}
                <div className="relative aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                  {event.posterImageUrl ? (
                    <img 
                      src={getImageUrl(event.posterImageUrl)} 
                      alt={event.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300" />
                  )}
                  
                  {/* Status Badges Overlay */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-1.5 z-10 max-w-[90%]">
                    {event.isActive && (
                      <span className="inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded bg-sougen-blue text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />
                        <span className="truncate">Event Aktif</span>
                      </span>
                    )}
                    {!isComplete && (
                      <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded bg-yellow-400/95 text-yellow-950 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-xs truncate">
                        Belum Lengkap
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-poppins font-bold text-xs sm:text-base md:text-lg text-admin-dark line-clamp-1 group-hover:text-sougen-blue transition-colors" title={event.name}>
                      {event.name}
                    </h3>
                    <p className="text-[11px] sm:text-sm text-admin-secondary mb-2.5 sm:mb-4 line-clamp-1" title={event.theme || undefined}>
                      {event.theme || 'Tidak ada tema'}
                    </p>

                    <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-5 text-[10px] sm:text-sm text-admin-secondary">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4 text-sougen-blue shrink-0" />
                        <span className="truncate">{formatDateShort(event.startDate)} - {formatDateShort(event.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-sougen-blue shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Status Switch & Kelola Button */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2.5 sm:pt-4 border-t border-admin-border/80 mt-auto">
                    <div className="flex items-center justify-between sm:justify-start gap-2">
                      <Switch.Root 
                        checked={event.isActive}
                        onCheckedChange={(c) => handleToggleActive(event, c)}
                        className={`w-8 sm:w-9 h-4 sm:h-5 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-sougen-blue/50 focus:ring-offset-1 shrink-0 ${event.isActive ? 'bg-sougen-blue' : 'bg-gray-300'}`}
                      >
                        <Switch.Thumb className={`block w-3 sm:w-3.5 h-3 sm:h-3.5 bg-white rounded-full transition-transform duration-200 translate-y-[2px] sm:translate-y-[3px] ${event.isActive ? 'translate-x-[18px] sm:translate-x-[20px]' : 'translate-x-[2px] sm:translate-x-[3px]'}`} />
                      </Switch.Root>
                      <span className="text-[10px] sm:text-xs font-semibold text-admin-secondary">
                        {event.isActive ? 'Publik' : 'Draft'}
                      </span>
                    </div>
                    
                    <Link
                      to={`/admin/event/${event.slug}`}
                      className="inline-flex items-center justify-center gap-1 py-1 sm:py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-sm font-semibold text-sougen-blue bg-sougen-blue/10 hover:bg-sougen-blue hover:text-white transition-all duration-200 text-center"
                    >
                      Kelola Event
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center flex flex-col items-center">
          <CalendarDays className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="font-poppins font-semibold text-admin-dark text-lg mb-2">
            Belum ada Event
          </h3>
          <p className="text-sm text-admin-secondary max-w-sm mx-auto mb-6">
            Anda belum membuat satupun event. Klik tombol di bawah untuk membuat event pertama Sougen.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-sougen-blue text-white text-sm font-medium rounded-lg hover:bg-sougen-blue/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Buat Event Baru
          </button>
        </div>
      )}

      {/* Modal Create Event */}
      <Dialog.Root open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[70] w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
            <div className="flex items-center justify-between mb-5">
              <Dialog.Title className="font-poppins font-semibold text-lg text-admin-dark">
                Buat Event Baru
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-1.5 rounded hover:bg-gray-100 text-admin-secondary transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-admin-dark mb-1">
                  Nama Event <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="Contoh: Sougen Matsuri 2026"
                  className="w-full px-3 py-2 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-admin-dark mb-1">
                    Tanggal Mulai <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('startDate')}
                      type="date"
                      className="w-full pl-9 pr-3 py-2 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
                    />
                  </div>
                  {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-admin-dark mb-1">
                    Tanggal Selesai <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('endDate')}
                      type="date"
                      className="w-full pl-9 pr-3 py-2 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
                    />
                  </div>
                  {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-admin-dark mb-1">
                  Lokasi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('location')}
                    type="text"
                    placeholder="Contoh: Celebes Convention Center"
                    className="w-full pl-9 pr-3 py-2 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
                  />
                </div>
                {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location.message}</p>}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Dialog.Close asChild>
                  <button type="button" className="px-4 py-2 text-sm font-medium text-admin-secondary hover:bg-gray-100 rounded-lg transition-colors">
                    Batal
                  </button>
                </Dialog.Close>
                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-sougen-blue text-white text-sm font-medium rounded-lg hover:bg-sougen-blue/90 shadow-sm transition-colors disabled:opacity-70"
                >
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Buat Event'}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
}