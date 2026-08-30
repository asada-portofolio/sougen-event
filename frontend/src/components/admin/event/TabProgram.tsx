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
  Sparkles, 
  Check, 
  Save, 
  Link as LinkIcon, 
  ExternalLink,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { api } from '../../../services/api';
import { getImageUrl } from '../../../utils/getImageUrl';
import { cn } from '../../../lib/utils';

const CATEGORY_OPTIONS = [
  'Kompetisi',
  'Pertunjukan',
  'Workshop',
  'Talkshow',
  'Games',
  'Parade',
  'Umum'
];

const newProgramSchema = z.object({
  name: z.string().min(1, 'Nama program wajib diisi'),
  category: z.string().optional(),
  description: z.string().optional(),
  registrationUrl: z.string().url('URL tidak valid').or(z.literal('')).optional(),
});

type NewProgramValues = z.infer<typeof newProgramSchema>;

function ProgramRow({ 
  ep, 
  eventId, 
  onRemove, 
  onUpdate 
}: { 
  ep: any; 
  eventId: number; 
  onRemove: (id: number, name: string) => void; 
  onUpdate: (data: any) => void; 
}) {
  const [url, setUrl] = useState(ep.registrationUrl || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveUrl = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await api.put(`/api/event-programs/${ep.id}`, { registrationUrl: url || null });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onUpdate(res.data);
    } catch {
      alert('Gagal menyimpan URL pendaftaran');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-3.5 sm:p-4 border border-admin-border rounded-xl bg-white shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-3 sm:gap-3.5 flex-1 min-w-0">
          <div className="w-14 h-12 sm:w-16 sm:h-12 rounded-xl bg-gray-100 shrink-0 border border-gray-200 overflow-hidden shadow-2xs flex items-center justify-center">
            {ep.program.coverImageUrl ? (
              <img 
                src={getImageUrl(ep.program.coverImageUrl)} 
                alt={ep.program.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                <ImageIcon className="w-5 h-5" />
              </div>
            )}
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Link 
                to={`/admin/programs/${ep.program.id}?returnTo=${encodeURIComponent(`/admin/event/${eventId}?tab=program`)}`}
                state={{ returnTo: `/admin/event/${eventId}?tab=program` }}
                className="font-poppins font-bold text-admin-dark text-sm sm:text-base hover:text-sougen-blue hover:underline transition-colors inline-flex items-center gap-1.5 group/pname"
                title="Klik untuk mengedit data program ini"
              >
                <span>{ep.program.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover/pname:text-sougen-blue shrink-0 opacity-70" />
              </Link>

              {ep.program.category && (
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                  {ep.program.category}
                </span>
              )}
            </div>

            {ep.program.description && (
              <p className="text-xs text-admin-secondary mt-0.5 line-clamp-1">
                {ep.program.description}
              </p>
            )}
          </div>
        </div>

        {/* Remove Action (aligned to top row) */}
        <button 
          type="button"
          onClick={() => onRemove(ep.id, ep.program.name)}
          className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0 -mr-1 -mt-1"
          title="Hapus dari event"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      {/* Input URL Pendaftaran */}
      <div className="pt-2 border-t border-gray-100">
        <label className="block text-[11px] font-medium text-admin-secondary mb-1">
          URL Pendaftaran Spesifik Event Ini (Opsional):
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <LinkIcon className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://forms.gle/... atau https://..."
              className="w-full pl-8 pr-3 py-1.5 border border-admin-border rounded-lg text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
            />
          </div>
          <button
            type="button"
            onClick={handleSaveUrl}
            disabled={saving || url === (ep.registrationUrl || '')}
            className={cn(
              "shrink-0 flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs gap-1",
              saved 
                ? "bg-emerald-100 text-emerald-700"
                : url !== (ep.registrationUrl || '')
                  ? "bg-sougen-blue text-white hover:bg-sougen-blue/90"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
            title="Simpan Tautan"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : saved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Tersimpan</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Simpan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

interface TabProgramProps {
  eventData: any;
  onUpdate: (data: any) => void;
}

export default function TabProgram({ eventData, onUpdate }: TabProgramProps) {
  const [allPrograms, setAllPrograms] = useState<any[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [search, setSearch] = useState('');
  
  const [addingId, setAddingId] = useState<number | null>(null);

  // Quick Add Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset: resetForm, setValue, formState: { errors } } = useForm<NewProgramValues>({
    resolver: zodResolver(newProgramSchema),
    defaultValues: {
      category: 'Kompetisi',
    }
  });

  const existingProgramIds = eventData.eventPrograms?.map((ep: any) => ep.programId) || [];
  const availablePrograms = allPrograms.filter(p => !existingProgramIds.includes(p.id));
  
  const filteredAvailable = availablePrograms.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
  );

  const fetchPrograms = async () => {
    try {
      const res = await api.get('/api/programs');
      setAllPrograms(res.data);
    } catch {
      console.error('Failed to load programs');
    } finally {
      setLoadingPrograms(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleAddProgram = async (programId: number) => {
    setAddingId(programId);
    try {
      await api.post(`/api/events/${eventData.id}/programs`, { programId });
      const res = await api.get(`/api/events/${eventData.slug}`);
      onUpdate(res.data);
    } catch {
      alert('Gagal menambahkan program ke event.');
    } finally {
      setAddingId(null);
    }
  };

  const handleRemoveProgram = async (eventProgramId: number, programName: string) => {
    if (!confirm(`Hapus program "${programName}" dari event ini?`)) return;
    try {
      await api.delete(`/api/event-programs/${eventProgramId}`);
      const res = await api.get(`/api/events/${eventData.slug}`);
      onUpdate(res.data);
    } catch {
      alert('Gagal menghapus program.');
    }
  };

  const handlePhotoSelect = (file: File | null) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran foto cover maksimal 5MB');
      return;
    }
    setSelectedPhoto(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleQuickCreateProgram = async (data: NewProgramValues) => {
    setIsSubmitting(true);
    try {
      // 1. Create Program in Master Data
      const createRes = await api.post('/api/programs', {
        name: data.name,
        category: data.category || 'Umum',
        description: data.description || '',
      });
      const newProgram = createRes.data;

      // 2. Upload Cover if selected
      if (selectedPhoto && newProgram.id) {
        const formData = new FormData();
        formData.append('image', selectedPhoto);
        await api.post(`/api/programs/${newProgram.id}/cover`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      // 3. Attach directly to this event
      await api.post(`/api/events/${eventData.id}/programs`, {
        programId: newProgram.id,
        registrationUrl: data.registrationUrl || null,
      });

      // 4. Refresh both lists
      await fetchPrograms();
      const updatedEvent = await api.get(`/api/events/${eventData.slug}`);
      onUpdate(updatedEvent.data);

      // 5. Close modal & reset
      setIsModalOpen(false);
      resetForm();
      setSelectedPhoto(null);
      setPhotoPreview(null);
      setShowCustomCategory(false);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menambahkan program baru.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="field-program" className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-1 sm:p-2 rounded-2xl transition-all">
      {/* Left: Event Programs List (7 Cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <h3 className="text-base font-poppins font-bold text-admin-dark flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sougen-blue" />
            Program Terpilih ({eventData.eventPrograms?.length || 0})
          </h3>
          <p className="text-xs text-admin-secondary mt-1">
            Program dan aktivitas yang diselenggarakan pada event {eventData.name}.
          </p>
        </div>

        {eventData.eventPrograms?.length > 0 ? (
          <div className="space-y-3">
            {eventData.eventPrograms.map((ep: any) => (
              <ProgramRow 
                key={ep.id} 
                ep={ep} 
                eventId={eventData.id}
                onRemove={handleRemoveProgram} 
                onUpdate={async () => {
                  const res = await api.get(`/api/events/${eventData.slug}`);
                  onUpdate(res.data);
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center bg-gray-50/70">
            <Layers className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-admin-dark">Belum Ada Program Terdaftar</p>
            <p className="text-xs text-admin-secondary mt-1 max-w-sm mx-auto">
              Pilih program dari panel Master Data di sebelah kanan atau klik tombol <strong>"+ Buat Program Baru"</strong>.
            </p>
          </div>
        )}
      </div>

      {/* Right: Master Data Program Panel (5 Cols) */}
      <div className="lg:col-span-5 bg-gray-50 border border-admin-border rounded-2xl p-4 sm:p-5 flex flex-col h-[650px] shadow-sm">
        {/* Panel Header */}
        <div className="flex flex-col gap-2.5 mb-3.5 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-poppins font-bold text-admin-dark leading-tight">
                Master Data Program
              </h3>
              <span className="text-[11px] text-admin-secondary font-medium">
                {availablePrograms.length} program siap ditambahkan
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
        </div>

        {/* Program List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3 [scrollbar-width:thin]">
          {loadingPrograms ? (
            <div className="flex flex-col items-center justify-center h-48 text-admin-secondary">
              <Loader2 className="w-6 h-6 animate-spin text-sougen-blue mb-2" />
              <span className="text-xs">Memuat Master Program...</span>
            </div>
          ) : filteredAvailable.length > 0 ? (
            filteredAvailable.map(p => (
              <div 
                key={p.id} 
                className="p-3 border border-admin-border/80 rounded-xl bg-white hover:border-sougen-blue/50 hover:shadow-md transition-all flex flex-col gap-2.5"
              >
                {/* Top Row: Cover + Name + Category */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-10 sm:w-14 sm:h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200 flex items-center justify-center shadow-2xs">
                    {p.coverImageUrl ? (
                      <img 
                        src={getImageUrl(p.coverImageUrl)} 
                        alt={p.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <Link 
                      to={`/admin/programs/${p.id}?returnTo=${encodeURIComponent(`/admin/event/${eventData.id}?tab=program`)}`}
                      state={{ returnTo: `/admin/event/${eventData.id}?tab=program` }}
                      className="font-poppins font-bold text-admin-dark text-sm leading-snug break-words hover:text-sougen-blue hover:underline transition-colors inline-flex items-center gap-1 group/mname"
                      title="Klik untuk mengedit detail program ini"
                    >
                      <span>{p.name}</span>
                      <ExternalLink className="w-3 h-3 text-gray-400 group-hover/mname:text-sougen-blue shrink-0 opacity-60" />
                    </Link>
                    
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      {p.category && (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                          {p.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Description & Add Action Button */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                  <p className="text-[11px] text-admin-secondary line-clamp-1 flex-1">
                    {p.description || 'Tidak ada deskripsi singkat.'}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleAddProgram(p.id)}
                    disabled={addingId === p.id}
                    className="px-5 py-2 min-w-[85px] lg:min-w-[100px] lg:px-6 lg:py-1.5 bg-sougen-blue hover:bg-[#0082c4] text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50 shrink-0 active:scale-95"
                    title={`Tambahkan ${p.name}`}
                  >
                    {addingId === p.id ? (
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
            ))
          ) : (
            <div className="text-center py-12 px-4 bg-white border border-dashed border-gray-200 rounded-xl">
              <Layers className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-600">
                {search ? 'Tidak ada program yang cocok dengan pencarian.' : 'Semua program sudah ditambahkan ke event ini.'}
              </p>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-sougen-blue hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Buat Program Baru Sekarang
              </button>
            </div>
          )}
        </div>
      </div>

      {/* QUICK ADD PROGRAM MODAL */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 animate-in fade-in" />
          <Dialog.Content className="fixed left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] w-[95vw] max-w-lg max-h-[90vh] bg-white rounded-2xl p-6 shadow-2xl z-50 flex flex-col focus:outline-none overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-admin-border shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sougen-blue/10 text-sougen-blue">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <Dialog.Title className="font-poppins font-bold text-admin-dark text-base">
                    Buat Program Baru
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-admin-secondary">
                    Program akan otomatis dibuat di Master Data & ditambahkan ke event ini.
                  </Dialog.Description>
                </div>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="p-1.5 text-gray-400 hover:text-admin-dark rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit(handleQuickCreateProgram)} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 [scrollbar-width:thin]">
              {/* Cover Photo Upload with Preview */}
              <div>
                <label className="block text-xs font-semibold text-admin-dark mb-1.5">
                  Foto Cover Program (Opsional)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center shrink-0 relative group">
                    {photoPreview ? (
                      <>
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPhoto(null);
                            setPhotoPreview(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(e) => handlePhotoSelect(e.target.files?.[0] || null)}
                      className="hidden"
                      id="quick-program-photo"
                    />
                    <label
                      htmlFor="quick-program-photo"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-admin-border rounded-xl text-xs font-semibold text-admin-dark bg-white hover:bg-gray-50 cursor-pointer shadow-xs transition-all active:scale-95"
                    >
                      <UploadCloud className="w-4 h-4 text-sougen-blue" />
                      <span>{photoPreview ? 'Ganti Foto' : 'Unggah Cover'}</span>
                    </label>
                    <p className="text-[10px] text-admin-secondary mt-1">
                      JPG, PNG, WebP (Maks. 5MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Program Name */}
              <div>
                <label className="block text-xs font-semibold text-admin-dark mb-1">
                  Nama Program <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Cosplay Competition, Idol Performance, Band Live..."
                  {...register('name')}
                  className="w-full px-3 py-2 text-xs border border-admin-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
                />
                {errors.name && (
                  <p className="text-red-500 text-[11px] mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Program Category */}
              <div>
                <label className="block text-xs font-semibold text-admin-dark mb-1">
                  Kategori Program
                </label>
                {!showCustomCategory ? (
                  <select
                    onChange={(e) => {
                      if (e.target.value === 'CUSTOM') {
                        setShowCustomCategory(true);
                        setValue('category', '');
                      } else {
                        setValue('category', e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 text-xs border border-admin-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                    <option value="CUSTOM">+ Kategori Lainnya (Ketik Manual)...</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ketik kategori program..."
                      {...register('category')}
                      autoFocus
                      className="w-full px-3 py-2 text-xs border border-admin-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomCategory(false);
                        setValue('category', 'Kompetisi');
                      }}
                      className="px-3 py-2 text-xs font-medium text-admin-secondary hover:text-admin-dark border border-admin-border rounded-xl bg-gray-50"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-admin-dark mb-1">
                  Deskripsi Singkat (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ringkasan singkat mengenai jalannya program/aktivitas ini..."
                  {...register('description')}
                  className="w-full px-3 py-2 text-xs border border-admin-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all resize-none"
                />
              </div>

              {/* Event Specific Registration URL */}
              <div>
                <label className="block text-xs font-semibold text-admin-dark mb-1">
                  URL Pendaftaran untuk Event Ini (Opsional)
                </label>
                <div className="relative">
                  <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    placeholder="https://forms.gle/... atau tautan pendaftaran lainnya"
                    {...register('registrationUrl')}
                    className="w-full pl-8 pr-3 py-2 text-xs border border-admin-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
                  />
                </div>
                {errors.registrationUrl && (
                  <p className="text-red-500 text-[11px] mt-1">{errors.registrationUrl.message}</p>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-admin-border shrink-0">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-admin-secondary hover:bg-gray-100 transition-colors"
                  >
                    Batal
                  </button>
                </Dialog.Close>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-sougen-blue hover:bg-[#0082c4] text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Buat & Tambahkan ke Event</span>
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
