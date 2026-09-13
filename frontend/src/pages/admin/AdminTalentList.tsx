import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Plus, 
  Search, 
  Loader2, 
  AlertCircle, 
  Trash2, 
  Edit, 
  Users, 
  Calendar, 
  CheckCircle2, 
  X
} from 'lucide-react';
import { getImageUrl } from '../../utils/getImageUrl';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '../../lib/utils';

const createTalentSchema = z.object({
  stageName: z.string().min(1, 'Nama wajib diisi'),
  tag: z.string().optional(),
});
type CreateTalentValues = z.infer<typeof createTalentSchema>;

export default function AdminTalentList() {
  const navigate = useNavigate();
  const [talents, setTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Status Filter: Semua / Booked / Free
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'BOOKED' | 'FREE'>('ALL');
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateTalentValues>({
    resolver: zodResolver(createTalentSchema),
  });

  const watchTag = watch('tag');
  const defaultTagOptions = ["Cosplayer", "Musisi", "Band", "Influencer", "Juri", "MC / Master of Ceremony", "Guest Star"];
  const isCustomTag = watchTag !== undefined && watchTag !== '' && !defaultTagOptions.includes(watchTag);
  const [showCustom, setShowCustom] = useState(false);

  const fetchTalents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/talents');
      setTalents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTalents();
  }, []);

  const handleCreate = async (data: CreateTalentValues) => {
    setIsCreating(true);
    try {
      const res = await api.post('/api/talents', data);
      setCreateModalOpen(false);
      reset();
      setShowCustom(false);
      navigate(`/admin/talent/${res.data.id}`);
    } catch {
      alert('Gagal membuat talent baru');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus permanen talent ${name}?`)) return;
    try {
      await api.delete(`/api/talents/${id}`);
      fetchTalents();
    } catch {
      alert('Gagal menghapus talent');
    }
  };

  /**
   * Mengambil daftar event aktif / belum selesai untuk talent.
   * Dihitung berdasarkan tanggal selesai (endDate) atau tanggal mulai (startDate) event.
   * Jika event sudah lewat tanggalnya, maka tidak lagi dihitung sebagai Booked.
   */
  const getActiveEvents = (talent: any) => {
    if (!talent.eventTalents || !Array.isArray(talent.eventTalents)) return [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return talent.eventTalents.filter((et: any) => {
      if (!et.event) return false;
      const dateStr = et.event.endDate || et.event.startDate;
      if (!dateStr) return false;
      
      const eventDate = new Date(dateStr);
      eventDate.setHours(23, 59, 59, 999);
      return eventDate.getTime() >= now.getTime();
    });
  };

  // Hitung jumlah talent booked (yang eventnya belum selesai) dan free
  const bookedCount = useMemo(() => {
    return talents.filter(t => getActiveEvents(t).length > 0).length;
  }, [talents]);

  const freeCount = useMemo(() => {
    return talents.length - bookedCount;
  }, [talents, bookedCount]);

  // Filter list
  const filteredTalents = useMemo(() => {
    return talents.filter(t => {
      // Search by stageName or tag
      if (search) {
        const q = search.toLowerCase();
        const matchName = t.stageName?.toLowerCase().includes(q);
        const matchTag = t.tag?.toLowerCase().includes(q);
        if (!matchName && !matchTag) return false;
      }
      
      // Status Filter berdasarkan tanggal event
      const activeEvents = getActiveEvents(t);
      const isBooked = activeEvents.length > 0;
      
      if (statusFilter === 'BOOKED' && !isBooked) return false;
      if (statusFilter === 'FREE' && isBooked) return false;
      
      return true;
    });
  }, [talents, search, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-sougen-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-poppins font-bold text-admin-dark flex items-center gap-2.5">
            <Users className="w-7 h-7 text-sougen-blue" />
            <span>Manajemen Talent</span>
          </h1>
          <p className="text-xs sm:text-sm text-admin-secondary mt-1">
            Kelola data artis, cosplayer, performer, dan pantau status ketersediaan (Booked/Free).
          </p>
        </div>
        <button 
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-sougen-blue text-white text-sm font-bold rounded-xl hover:bg-[#0082c4] transition-all shadow-xs active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Talent</span>
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 border border-admin-border rounded-2xl shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Field */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Cari nama talent atau tag..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 border border-admin-border rounded-xl text-xs sm:text-sm bg-gray-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-colors"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-admin-dark"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Availability Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border",
              statusFilter === 'ALL'
                ? "bg-sougen-blue text-white border-sougen-blue shadow-xs"
                : "bg-white text-admin-secondary border-admin-border hover:bg-gray-50"
            )}
          >
            Semua ({talents.length})
          </button>
          
          <button
            onClick={() => setStatusFilter('BOOKED')}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-1.5",
              statusFilter === 'BOOKED'
                ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                : "bg-white text-admin-secondary border-admin-border hover:bg-amber-50/50 hover:border-amber-300"
            )}
          >
            <span className={cn("w-2 h-2 rounded-full", statusFilter === 'BOOKED' ? "bg-white" : "bg-amber-500")} />
            <span>Booked ({bookedCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('FREE')}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-1.5",
              statusFilter === 'FREE'
                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                : "bg-white text-admin-secondary border-admin-border hover:bg-emerald-50/50 hover:border-emerald-300"
            )}
          >
            <span className={cn("w-2 h-2 rounded-full", statusFilter === 'FREE' ? "bg-white" : "bg-emerald-500")} />
            <span>Free ({freeCount})</span>
          </button>
        </div>
      </div>

      {/* Grid Talent Cards */}
      {filteredTalents.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
          {filteredTalents.map(talent => {
            const activeEvents = getActiveEvents(talent);
            const isBooked = activeEvents.length > 0;

            return (
              <div 
                key={talent.id} 
                className="group relative bg-white border border-admin-border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Talent Photo & Overlay */}
                <div className="aspect-[3/4] relative bg-gray-100 overflow-hidden">
                  {talent.profileImageUrl ? (
                    <img 
                      src={getImageUrl(talent.profileImageUrl)} 
                      alt={talent.stageName} 
                      className="w-full h-full object-cover select-none transition-transform duration-300 group-hover:scale-105" 
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                      <Users className="w-8 h-8 mb-1 text-gray-300" />
                      <span className="text-[10px] font-medium">Tanpa Foto</span>
                    </div>
                  )}

                  {/* Status Badge (Top-Left) */}
                  <div className="absolute top-2 left-2 z-10 pointer-events-none">
                    {isBooked ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Booked</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Free</span>
                      </span>
                    )}
                  </div>

                  {/* Action Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-20">
                    <Link 
                      to={`/admin/talent/${talent.id}`}
                      className="p-2.5 bg-white text-admin-dark rounded-xl hover:bg-sougen-blue hover:text-white transition-all shadow-md active:scale-95"
                      title="Edit Detail Talent"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(talent.id, talent.stageName)}
                      className="p-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-md active:scale-95"
                      title="Hapus Talent"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Info Body */}
                <div className="p-3 border-t border-admin-border bg-white flex flex-col items-center text-center gap-1.5 grow justify-between">
                  <div className="w-full">
                    <h3 
                      className="font-poppins font-bold text-admin-dark text-xs sm:text-sm truncate w-full" 
                      title={talent.stageName}
                    >
                      {talent.stageName}
                    </h3>
                    {talent.tag ? (
                      <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-700 rounded-md truncate max-w-full">
                        {talent.tag}
                      </span>
                    ) : (
                      <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-normal text-gray-400">
                        -
                      </span>
                    )}
                  </div>

                  {/* Active Event Subtitle (Hanya ditampilkan jika Booked / Event belum selesai) */}
                  {isBooked && (
                    <div className="w-full pt-1.5 border-t border-gray-100 flex items-center justify-center">
                      <span 
                        className="text-[10px] sm:text-[11px] font-semibold text-amber-700 truncate max-w-full flex items-center gap-1"
                        title={activeEvents.map((et: any) => et.event?.name || 'Event').join(', ')}
                      >
                        <Calendar className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>{activeEvents.length} Event Terdaftar</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-dashed border-admin-border rounded-2xl text-admin-secondary text-center">
          <AlertCircle className="w-10 h-10 mb-3 text-gray-300" />
          <p className="text-sm font-bold text-admin-dark">Tidak ada talent ditemukan</p>
          <p className="text-xs text-gray-500 mt-1">Coba ubah kata kunci pencarian atau ganti status filter.</p>
        </div>
      )}

      {/* Create Modal */}
      <Dialog.Root open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-xs transition-all" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[70] w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-5 sm:p-6">
            <Dialog.Title className="text-base font-poppins font-bold text-admin-dark mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-sougen-blue" />
              <span>Tambah Talent Baru</span>
            </Dialog.Title>
            <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-admin-dark mb-1">Nama Panggung / Grup</label>
                <input 
                  {...register('stageName')}
                  className="w-full px-3 py-2 border border-admin-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
                  placeholder="Contoh: The Adams"
                />
                {errors.stageName && <p className="text-red-500 text-xs mt-1">{errors.stageName.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-admin-dark mb-1">Tag / Jenis Talent (Opsional)</label>
                {!showCustom && !isCustomTag ? (
                  <select 
                    className="w-full px-3 py-2 border border-admin-border rounded-xl text-xs sm:text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue appearance-none"
                    value={watchTag || ''}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setShowCustom(true);
                        setValue('tag', '');
                      } else {
                        setValue('tag', e.target.value);
                      }
                    }}
                  >
                    <option value="">-- Pilih Tag --</option>
                    {defaultTagOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    <option value="custom">+ Lainnya (Ketik Sendiri)...</option>
                  </select>
                ) : (
                  <div className="flex gap-2 items-center">
                    <input 
                      {...register('tag')}
                      autoFocus
                      placeholder="Ketik tag custom..."
                      className="w-full px-3 py-2 border border-admin-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
                    />
                    <button 
                      type="button" 
                      onClick={() => { 
                        setShowCustom(false); 
                        setValue('tag', ''); 
                      }} 
                      className="text-xs text-admin-secondary hover:text-sougen-blue underline whitespace-nowrap px-1"
                    >
                      Batal
                    </button>
                  </div>
                )}
                {errors.tag && <p className="text-red-500 text-xs mt-1">{errors.tag.message}</p>}
              </div>
              <div className="flex justify-end gap-2.5 pt-4 border-t border-admin-border">
                <Dialog.Close asChild>
                  <button type="button" className="px-4 py-2 text-xs font-bold text-admin-secondary hover:bg-gray-100 rounded-xl transition-colors">
                    Batal
                  </button>
                </Dialog.Close>
                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="px-5 py-2 bg-sougen-blue text-white text-xs font-bold rounded-xl hover:bg-[#0082c4] shadow-xs disabled:opacity-50 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Buat & Lanjut Edit'}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}