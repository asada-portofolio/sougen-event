import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Loader2, 
  Plus, 
  Search, 
  Trash2, 
  X, 
  UploadCloud, 
  Users, 
  Check, 
  Sparkles,
  UserCheck,
  Star,
  Mic2,
  ExternalLink
} from 'lucide-react';
import { InstagramIcon } from '../../ui/icons';
import { api } from '../../../services/api';
import { getImageUrl } from '../../../utils/getImageUrl';
import { cn } from '../../../lib/utils';

const TAG_OPTIONS = [
  'Cosplayer',
  'Musisi',
  'Band',
  'Influencer',
  'Juri',
  'MC / Master of Ceremony',
  'Guest Star',
  'Lainnya (Kustom)'
];

const quickAddSchema = z.object({
  stageName: z.string().min(1, 'Nama panggung wajib diisi'),
  tag: z.string().optional(),
  customTag: z.string().optional(),
  role: z.enum(['PERFORMER', 'GUEST']),
  instagramUrl: z.string().url('URL Instagram tidak valid').or(z.literal('')).optional(),
  bio: z.string().optional(),
});

type QuickAddValues = z.infer<typeof quickAddSchema>;

interface TabTalentProps {
  eventData: any;
  onUpdate: (data: any) => void;
}

export default function TabTalent({ eventData, onUpdate }: TabTalentProps) {
  const [allTalents, setAllTalents] = useState<any[]>([]);
  const [loadingTalents, setLoadingTalents] = useState(true);
  const [search, setSearch] = useState('');
  const [addingId, setAddingId] = useState<number | null>(null);
  const [selectedRoleForAdd, setSelectedRoleForAdd] = useState<Record<number, 'PERFORMER' | 'GUEST'>>({});

  // Quick Add Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { 
    register, 
    handleSubmit, 
    reset, 
    watch, 
    formState: { errors } 
  } = useForm<QuickAddValues>({
    resolver: zodResolver(quickAddSchema),
    defaultValues: {
      stageName: '',
      tag: 'Guest Star',
      customTag: '',
      role: 'GUEST',
      instagramUrl: '',
      bio: '',
    }
  });

  const selectedTag = watch('tag');
  const isCustomTag = selectedTag === 'Lainnya (Kustom)';

  const fetchTalents = async () => {
    try {
      setLoadingTalents(true);
      const res = await api.get('/api/talents');
      setAllTalents(res.data);
    } catch {
      console.error('Failed to load talents');
    } finally {
      setLoadingTalents(false);
    }
  };

  useEffect(() => {
    fetchTalents();
  }, []);

  // Filter available talents (not yet added to this event)
  const existingTalentIds = eventData.eventTalents?.map((et: any) => et.talentId) || [];
  const availableTalents = allTalents.filter(t => !existingTalentIds.includes(t.id));
  
  const filteredAvailable = availableTalents.filter(t => 
    t.stageName?.toLowerCase().includes(search.toLowerCase()) ||
    t.tag?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddTalent = async (talentId: number) => {
    setAddingId(talentId);
    const role = selectedRoleForAdd[talentId] || 'PERFORMER';
    try {
      await api.post(`/api/events/${eventData.id}/talents`, { talentId, role });
      const res = await api.get(`/api/events/${eventData.slug}`);
      onUpdate(res.data);
    } catch {
      alert('Gagal menambahkan talent ke event.');
    } finally {
      setAddingId(null);
    }
  };

  const handleRemoveTalent = async (eventTalentId: number, stageName: string) => {
    if (!confirm(`Hapus ${stageName} dari event ini?`)) return;
    try {
      await api.delete(`/api/event-talents/${eventTalentId}`);
      const res = await api.get(`/api/events/${eventData.slug}`);
      onUpdate(res.data);
    } catch {
      alert('Gagal menghapus talent.');
    }
  };

  const handleUpdateRole = async (eventTalentId: number, newRole: 'PERFORMER' | 'GUEST') => {
    try {
      await api.put(`/api/event-talents/${eventTalentId}`, { role: newRole });
      const res = await api.get(`/api/events/${eventData.slug}`);
      onUpdate(res.data);
    } catch {
      alert('Gagal memperbarui peran talent.');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Pilih file gambar yang valid.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran foto maksimal 2MB.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImagePreview = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onQuickAddSubmit = async (data: QuickAddValues) => {
    setIsSubmitting(true);
    try {
      const finalTag = isCustomTag ? data.customTag : data.tag;

      // 1. Create Talent in Master Data
      const createRes = await api.post('/api/talents', {
        stageName: data.stageName.trim(),
        tag: finalTag ? finalTag.trim() : undefined,
        instagramUrl: data.instagramUrl ? data.instagramUrl.trim() : undefined,
        bio: data.bio ? data.bio.trim() : undefined,
      });
      const newTalent = createRes.data;

      // 2. Upload photo if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        await api.post(`/api/talents/${newTalent.id}/photo`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      // 3. Link to current event immediately
      await api.post(`/api/events/${eventData.id}/talents`, {
        talentId: newTalent.id,
        role: data.role,
      });

      // 4. Refresh both Event data and Master Talents
      const [updatedEventRes, updatedTalentsRes] = await Promise.all([
        api.get(`/api/events/${eventData.slug}`),
        api.get('/api/talents')
      ]);

      onUpdate(updatedEventRes.data);
      setAllTalents(updatedTalentsRes.data);

      // Close modal and reset
      setIsModalOpen(false);
      reset();
      handleRemoveImagePreview();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menambahkan talent baru.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="field-talent" className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-1 sm:p-2 rounded-2xl transition-all">
      {/* Left: Event Talents List (7 Cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-poppins font-bold text-admin-dark flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-sougen-blue" />
              Talent Terpilih ({eventData.eventTalents?.length || 0})
            </h3>
            <p className="text-xs text-admin-secondary mt-1">
              Daftar talent yang akan tampil pada event {eventData.name}.
            </p>
          </div>
        </div>

        {eventData.eventTalents?.length > 0 ? (
          <div className="space-y-3">
            {eventData.eventTalents.map((et: any) => (
              <div 
                key={et.id} 
                className="flex items-start justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 border border-admin-border rounded-xl bg-white shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200 shadow-sm flex items-center justify-center">
                    {et.talent.profileImageUrl ? (
                      <img 
                        src={getImageUrl(et.talent.profileImageUrl)} 
                        alt={et.talent.stageName} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <Users className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link 
                        to={`/admin/talent/${et.talent.id}?returnTo=${encodeURIComponent(`/admin/event/${eventData.id}?tab=talent`)}`} 
                        state={{ returnTo: `/admin/event/${eventData.id}?tab=talent` }}
                        className="font-poppins font-bold text-admin-dark text-sm sm:text-base hover:text-sougen-blue hover:underline transition-colors inline-flex items-center gap-1.5 group/tname"
                        title="Klik untuk mengedit detail talent ini"
                      >
                        <span>{et.talent.stageName}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover/tname:text-sougen-blue shrink-0 opacity-70" />
                      </Link>
                      {et.talent.tag && (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          {et.talent.tag}
                        </span>
                      )}
                    </div>

                    {/* Role Selector Badge (Clean single-line text, no icons) */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[11px] text-gray-500 font-medium">Peran:</span>
                      <div className="inline-flex rounded-lg border border-admin-border p-0.5 bg-gray-50 text-[10px]">
                        <button
                          type="button"
                          onClick={() => handleUpdateRole(et.id, 'GUEST')}
                          className={cn(
                            "px-2 py-0.5 rounded-md font-semibold text-[10px] whitespace-nowrap transition-colors",
                            et.role === 'GUEST'
                              ? "bg-sougen-blue text-white shadow-sm"
                              : "text-gray-600 hover:text-admin-dark"
                          )}
                        >
                          Guest Star
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateRole(et.id, 'PERFORMER')}
                          className={cn(
                            "px-2 py-0.5 rounded-md font-semibold text-[10px] whitespace-nowrap transition-colors",
                            et.role === 'PERFORMER'
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "text-gray-600 hover:text-admin-dark"
                          )}
                        >
                          Performer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remove Action (aligned to top row) */}
                <button 
                  type="button"
                  onClick={() => handleRemoveTalent(et.id, et.talent.stageName)}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0 -mr-1 -mt-1"
                  title="Hapus dari event ini"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center bg-gray-50/70">
            <Users className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-admin-dark">Belum Ada Talent Terdaftar</p>
            <p className="text-xs text-admin-secondary mt-1 max-w-sm mx-auto">
              Pilih talent dari panel Master Data di sebelah kanan atau klik tombol <strong>"+ Buat Talent Baru"</strong>.
            </p>
          </div>
        )}
      </div>

      {/* Right: Master Data Talent Panel (5 Cols) */}
      <div className="lg:col-span-5 bg-gray-50 border border-admin-border rounded-2xl p-4 sm:p-5 flex flex-col h-[650px] shadow-sm">
        {/* Panel Header */}
        <div className="flex flex-col gap-2.5 mb-3.5 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-poppins font-bold text-admin-dark leading-tight">
                Master Data Talent
              </h3>
              <span className="text-[11px] text-admin-secondary font-medium">
                {availableTalents.length} talent siap ditambahkan
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-sougen-blue text-white text-[11px] font-inter font-bold uppercase tracking-wider rounded-lg hover:bg-[#0082c4] shadow-sm transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Baru</span>
            </button>
          </div>
          
          {/* Search Filter */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs border border-admin-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Role Legend Guide (Desktop Only) */}
          <div className="hidden lg:flex items-center justify-between px-3 py-1.5 bg-white border border-admin-border/70 rounded-lg shadow-2xs">
            <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap">Peran:</span>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1 shrink-0" title="Guest Star (Bintang Tamu)">
                <span className="w-4 h-4 rounded bg-sougen-blue/10 text-sougen-blue flex items-center justify-center">
                  <Star className="w-2.5 h-2.5 fill-sougen-blue text-sougen-blue" />
                </span>
                <span className="text-admin-dark font-semibold text-[10px] whitespace-nowrap">Guest Star</span>
              </div>
              <div className="flex items-center gap-1 shrink-0" title="Performer (Pengisi Acara)">
                <span className="w-4 h-4 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Mic2 className="w-2.5 h-2.5 text-emerald-600" />
                </span>
                <span className="text-admin-dark font-semibold text-[10px] whitespace-nowrap">Performer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Talent List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3 [scrollbar-width:thin]">
          {loadingTalents ? (
            <div className="flex flex-col items-center justify-center h-48 text-admin-secondary">
              <Loader2 className="w-6 h-6 animate-spin text-sougen-blue mb-2" />
              <span className="text-xs">Memuat Master Talent...</span>
            </div>
          ) : filteredAvailable.length > 0 ? (
            filteredAvailable.map(t => {
              const currentRole = selectedRoleForAdd[t.id] || 'PERFORMER';
              return (
                <div 
                  key={t.id} 
                  className="p-3 border border-admin-border/80 rounded-xl bg-white hover:border-sougen-blue/50 hover:shadow-md transition-all flex flex-col gap-2.5"
                >
                  {/* Top Row: Full-width Avatar + Name + Tag */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200 flex items-center justify-center shadow-2xs">
                      {t.profileImageUrl ? (
                        <img 
                          src={getImageUrl(t.profileImageUrl)} 
                          alt={t.stageName} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Users className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <Link 
                        to={`/admin/talent/${t.id}?returnTo=${encodeURIComponent(`/admin/event/${eventData.id}?tab=talent`)}`}
                        state={{ returnTo: `/admin/event/${eventData.id}?tab=talent` }}
                        className="font-poppins font-bold text-admin-dark text-sm leading-snug break-words hover:text-sougen-blue hover:underline transition-colors inline-flex items-center gap-1 group/mname"
                        title="Klik untuk mengedit detail talent ini"
                      >
                        <span>{t.stageName}</span>
                        <ExternalLink className="w-3 h-3 text-gray-400 group-hover/mname:text-sougen-blue shrink-0 opacity-60" />
                      </Link>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        {t.tag && (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                            {t.tag}
                          </span>
                        )}
                        
                        {t.instagramUrl && (
                          <span className="text-[10px] text-pink-600 flex items-center gap-0.5 font-medium">
                            <InstagramIcon className="w-2.5 h-2.5" /> IG
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Role Switcher (Desktop: Icon-Only, Mobile: Text) + Elongated Add Button */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                    {/* Desktop Role Switcher (Icon-Only) */}
                    <div className="hidden lg:inline-flex rounded-lg border border-admin-border p-0.5 bg-gray-50">
                      <button
                        type="button"
                        onClick={() => setSelectedRoleForAdd(prev => ({ ...prev, [t.id]: 'GUEST' }))}
                        className={cn(
                          "p-1.5 rounded-md transition-all flex items-center justify-center",
                          currentRole === 'GUEST'
                            ? "bg-sougen-blue text-white shadow-xs"
                            : "text-gray-400 hover:text-sougen-blue hover:bg-sougen-blue/10"
                        )}
                        title="Pilih sebagai Guest Star"
                      >
                        <Star className={cn("w-3.5 h-3.5", currentRole === 'GUEST' ? "fill-white" : "")} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRoleForAdd(prev => ({ ...prev, [t.id]: 'PERFORMER' }))}
                        className={cn(
                          "p-1.5 rounded-md transition-all flex items-center justify-center",
                          currentRole === 'PERFORMER'
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "text-gray-400 hover:text-emerald-700 hover:bg-emerald-50"
                        )}
                        title="Pilih sebagai Performer"
                      >
                        <Mic2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Mobile Role Switcher (Text-based) */}
                    <div className="inline-flex lg:hidden rounded-lg border border-admin-border p-0.5 bg-gray-50 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setSelectedRoleForAdd(prev => ({ ...prev, [t.id]: 'GUEST' }))}
                        className={cn(
                          "px-2 py-1 rounded-md font-semibold whitespace-nowrap transition-all",
                          currentRole === 'GUEST'
                            ? "bg-sougen-blue text-white shadow-xs"
                            : "text-gray-600 hover:text-admin-dark"
                        )}
                      >
                        Guest Star
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRoleForAdd(prev => ({ ...prev, [t.id]: 'PERFORMER' }))}
                        className={cn(
                          "px-2 py-1 rounded-md font-semibold whitespace-nowrap transition-all",
                          currentRole === 'PERFORMER'
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "text-gray-600 hover:text-admin-dark"
                        )}
                      >
                        Performer
                      </button>
                    </div>

                    {/* Elongated Add Button for Mobile & Desktop */}
                    <button
                      type="button"
                      onClick={() => handleAddTalent(t.id)}
                      disabled={addingId === t.id}
                      className="px-5 py-2 min-w-[85px] lg:min-w-[100px] lg:px-6 lg:py-1.5 bg-sougen-blue hover:bg-[#0082c4] text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50 shrink-0 active:scale-95"
                      title={`Tambahkan ${t.stageName}`}
                    >
                      {addingId === t.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Pilih</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 px-4 bg-white border border-dashed border-gray-200 rounded-xl">
              <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-600">
                {search ? 'Tidak ada talent yang cocok dengan pencarian.' : 'Semua talent sudah ditambahkan ke event ini.'}
              </p>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-sougen-blue hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Buat Talent Baru Sekarang
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Add Talent Modal Dialog */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
          
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-lg bg-white rounded-2xl shadow-2xl border border-rpo-black/10 z-50 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-black/5 bg-gray-50/90 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sougen-blue/10 text-sougen-blue flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <Dialog.Title className="font-poppins font-bold text-base sm:text-lg text-rpo-black">
                    Tambah Talent Cepat
                  </Dialog.Title>
                  <Dialog.Description className="font-inter text-xs text-gray-500 mt-0.5">
                    Talent baru akan otomatis disimpan di Master Data & dihubungkan ke event ini.
                  </Dialog.Description>
                </div>
              </div>

              <Dialog.Close asChild>
                <button 
                  type="button"
                  className="p-2 text-gray-400 hover:text-rpo-black hover:bg-gray-200/60 rounded-xl transition-colors"
                  aria-label="Tutup"
                >
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit(onQuickAddSubmit)} className="p-5 overflow-y-auto space-y-4 [scrollbar-width:thin] text-left">
              {/* Photo Upload Area */}
              <div>
                <label className="block text-xs font-semibold text-admin-dark mb-1.5">
                  Foto Profil Talent (Opsional)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-admin-border overflow-hidden flex items-center justify-center shrink-0 relative">
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-7 h-7 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 border border-admin-border hover:border-sougen-blue bg-white text-xs font-medium text-admin-dark rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <UploadCloud className="w-4 h-4 text-sougen-blue" />
                      <span>{previewImage ? 'Ganti Foto' : 'Unggah Foto'}</span>
                    </button>
                    {previewImage && (
                      <button
                        type="button"
                        onClick={handleRemoveImagePreview}
                        className="px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Hapus
                      </button>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Stage Name */}
              <div>
                <label className="block text-xs font-semibold text-admin-dark mb-1">
                  Nama Panggung / Grup <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('stageName')}
                  type="text"
                  placeholder="Contoh: Sayaka, DJ Kazu, Starry Night"
                  className="w-full px-3.5 py-2 text-xs border border-admin-border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
                />
                {errors.stageName && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.stageName.message}</p>
                )}
              </div>

              {/* Category / Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-admin-dark mb-1">
                    Kategori / Profesi
                  </label>
                  <select
                    {...register('tag')}
                    className="w-full px-3 py-2 text-xs border border-admin-border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
                  >
                    {TAG_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Peran di Event Ini */}
                <div>
                  <label className="block text-xs font-semibold text-admin-dark mb-1">
                    Peran di Event Ini <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('role')}
                    className="w-full px-3 py-2 text-xs border border-admin-border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all font-semibold"
                  >
                    <option value="GUEST">Guest Star (Bintang Tamu)</option>
                    <option value="PERFORMER">Performer (Pengisi Acara)</option>
                  </select>
                </div>
              </div>

              {/* Custom Tag Input if selected */}
              {isCustomTag && (
                <div>
                  <label className="block text-xs font-semibold text-admin-dark mb-1">
                    Tuliskan Kategori Kustom
                  </label>
                  <input
                    {...register('customTag')}
                    type="text"
                    placeholder="Contoh: Standup Comedian, Magician"
                    className="w-full px-3.5 py-2 text-xs border border-admin-border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
                  />
                </div>
              )}

              {/* Instagram URL */}
              <div>
                <label className="block text-xs font-semibold text-admin-dark mb-1">
                  URL Instagram (Opsional)
                </label>
                <div className="relative">
                  <InstagramIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('instagramUrl')}
                    type="url"
                    placeholder="https://instagram.com/username"
                    className="w-full pl-9 pr-3.5 py-2 text-xs border border-admin-border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
                  />
                </div>
                {errors.instagramUrl && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.instagramUrl.message}</p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-admin-dark mb-1">
                  Bio / Deskripsi Singkat (Opsional)
                </label>
                <textarea
                  {...register('bio')}
                  rows={2}
                  placeholder="Deskripsi singkat profil talent..."
                  className="w-full px-3.5 py-2 text-xs border border-admin-border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all resize-none"
                />
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-black/5 flex items-center justify-end gap-2.5">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-admin-border text-xs font-medium text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                </Dialog.Close>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-sougen-blue hover:bg-[#0082c4] text-white text-xs font-inter font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan & Tambahkan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
