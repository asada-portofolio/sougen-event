import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../services/api';
import { 
  Loader2, 
  ArrowLeft, 
  Save, 
  UploadCloud, 
  Image as ImageIcon, 
  X, 
  Sparkles, 
  Eye, 
  Check, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Camera, 
  Trash2, 
  ZoomIn, 
  MoveLeft, 
  MoveRight, 
  Layers, 
  FileCheck, 
  Trophy
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import RichTextEditor from '../../components/admin/RichTextEditor';
import { getImageUrl } from '../../utils/getImageUrl';
import { cn } from '../../lib/utils';

const programSchema = z.object({
  name: z.string().min(1, 'Nama program wajib diisi'),
  category: z.string().optional(),
  description: z.string().optional(),
  rulesHtml: z.string().optional(),
});
type ProgramValues = z.infer<typeof programSchema>;

const DEFAULT_PROGRAM_CATEGORIES = [
  "Lomba & Kompetisi",
  "Cosplay & Runway",
  "Workshop & Talkshow",
  "Stage Performance",
  "Exhibition & Bazaar",
  "Community Gathering",
  "Mini Games & Fun",
  "Special Showcase"
];

export default function AdminProgramForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const returnTo = searchParams.get('returnTo') || (location.state as any)?.returnTo;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'form' | 'gallery' | 'preview'>('form');
  
  // Category State
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [isCustomCategoryActive, setIsCustomCategoryActive] = useState(false);

  // Drag & Drop State
  const [dragActive, setDragActive] = useState(false);

  // Lightbox Preview Dialog
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);
  
  const coverInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, control, watch, setValue, formState: { errors, isDirty } } = useForm<ProgramValues>({
    resolver: zodResolver(programSchema),
  });

  const watchAll = watch();
  const currentCategory = watch('category') || '';

  const handleBack = () => {
    if (returnTo) {
      navigate(returnTo);
    } else {
      navigate('/admin/programs');
    }
  };

  const fetchProgram = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/programs/${id}`);
      setProgram(res.data);
      reset({
        name: res.data.name || '',
        category: res.data.category || '',
        description: res.data.description || '',
        rulesHtml: res.data.rulesHtml || '',
      });

      if (res.data.category && !DEFAULT_PROGRAM_CATEGORIES.includes(res.data.category)) {
        setIsCustomCategoryActive(true);
        setCustomCategoryInput(res.data.category);
      }
    } catch {
      alert('Gagal memuat program');
      handleBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProgram();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = async (data: ProgramValues) => {
    setSaving(true);
    try {
      await api.put(`/api/programs/${id}`, data);
      await fetchProgram();
      alert('Berhasil menyimpan data program!');
      handleBack();
    } catch {
      alert('Gagal menyimpan program.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadCover = async (file: File | null) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran cover maksimal 5MB');
      return;
    }
    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      await api.post(`/api/programs/${id}/cover`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchProgram();
    } catch {
      alert('Gagal mengunggah foto cover');
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  // Drag and Drop handlers for documentation photos
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };
  
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleUploadPhotos(Array.from(e.dataTransfer.files));
    }
  };

  const handleUploadPhotos = async (files: File[]) => {
    if (!files.length) return;
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} terlalu besar (Maks 5MB)`);
        return;
      }
    }
    setUploadingPhotos(true);
    try {
      const formData = new FormData();
      files.forEach(f => formData.append('images', f));
      await api.post(`/api/programs/${id}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchProgram();
    } catch {
      alert('Gagal mengunggah foto dokumentasi');
    } finally {
      setUploadingPhotos(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (!confirm('Hapus permanen foto dokumentasi ini?')) return;
    try {
      await api.delete(`/api/program-photos/${photoId}`);
      await fetchProgram();
    } catch {
      alert('Gagal menghapus foto');
    }
  };

  const movePhoto = async (index: number, direction: 'left' | 'right') => {
    if (!program?.photos) return;
    const newPhotos = [...program.photos];
    if (direction === 'left' && index > 0) {
      [newPhotos[index - 1], newPhotos[index]] = [newPhotos[index], newPhotos[index - 1]];
    } else if (direction === 'right' && index < newPhotos.length - 1) {
      [newPhotos[index + 1], newPhotos[index]] = [newPhotos[index], newPhotos[index + 1]];
    } else {
      return;
    }
    
    // Optimistic UI update
    setProgram({ ...program, photos: newPhotos });
    
    try {
      await api.put(`/api/programs/${id}/photos/reorder`, {
        orderedIds: newPhotos.map(p => p.id)
      });
    } catch {
      alert('Gagal mengurutkan foto');
      fetchProgram();
    }
  };

  // Visible Categories Slice
  const visibleCategories = useMemo(() => {
    if (showAllCategories) return DEFAULT_PROGRAM_CATEGORIES;
    return DEFAULT_PROGRAM_CATEGORIES.slice(0, 4);
  }, [showAllCategories]);

  const hasRules = !!watchAll.rulesHtml && watchAll.rulesHtml.trim() !== '<p></p>' && watchAll.rulesHtml.trim() !== '';

  if (loading || !program) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-sougen-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 md:pb-16 max-w-7xl mx-auto">
      {/* ── TOP STICKY NAVIGATION BAR ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md py-3.5 px-4 sm:px-6 rounded-2xl border border-admin-border shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button 
            type="button"
            onClick={handleBack}
            className="p-2 border border-admin-border bg-white rounded-xl hover:bg-gray-50 text-admin-dark transition-all active:scale-95 shadow-2xs shrink-0"
            title="Kembali"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-admin-secondary">
              <Link to="/admin/programs" className="hover:text-sougen-blue transition-colors">Program</Link>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="truncate text-admin-dark font-medium">Edit Program</span>
            </div>
            <h1 className="text-base sm:text-lg font-poppins font-bold text-admin-dark truncate">
              {watchAll.name || program.name}
            </h1>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          {isDirty && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full animate-pulse">
              <Sparkles className="w-3 h-3" />
              Ada Perubahan
            </span>
          )}
          <button 
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-sougen-blue text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-[#0082c4] transition-all shadow-xs disabled:opacity-50 active:scale-95"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan</span>
          </button>
        </div>
      </div>

      {/* ── PROGRAM HERO BANNER & COVER ── */}
      <div className="bg-white border border-admin-border rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row items-center md:items-start gap-5 sm:gap-6">
        {/* Cover 16:9 Container with Quick Upload Overlay */}
        <div className="relative group shrink-0 w-full md:w-64 sm:w-72">
          <div className="aspect-[16/9] w-full rounded-2xl bg-gray-900 border-2 border-white shadow-md overflow-hidden relative flex items-center justify-center">
            {program.coverImageUrl ? (
              <img 
                src={getImageUrl(program.coverImageUrl)} 
                alt={program.name} 
                className="w-full h-full object-cover select-none group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-900 p-2 text-center">
                <ImageIcon className="w-10 h-10 mb-1 text-gray-500" />
                <span className="text-[10px] font-semibold text-gray-400">Belum Ada Cover (16:9)</span>
              </div>
            )}

            {/* Hover Overlay */}
            <div 
              onClick={() => coverInputRef.current?.click()}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity p-2 text-center"
            >
              {uploadingCover ? (
                <Loader2 className="w-6 h-6 animate-spin text-white mb-1" />
              ) : (
                <>
                  <UploadCloud className="w-6 h-6 mb-1 text-sougen-blue" />
                  <span className="text-[11px] font-bold">Ganti Foto Cover</span>
                  <span className="text-[9px] text-gray-300">16:9 (Maks. 5MB)</span>
                </>
              )}
            </div>
          </div>

          {/* Mobile Upload Button */}
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            disabled={uploadingCover}
            className="md:hidden mt-2 w-full py-1.5 px-2 text-[11px] font-bold bg-white border border-admin-border rounded-xl text-sougen-blue flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{uploadingCover ? 'Mengunggah...' : 'Ganti Foto Cover'}</span>
          </button>
          
          <input 
            type="file" 
            accept="image/*" 
            ref={coverInputRef} 
            className="hidden" 
            onChange={(e) => handleUploadCover(e.target.files?.[0] || null)}
          />
        </div>

        {/* Hero Metadata */}
        <div className="flex-1 text-center md:text-left space-y-2.5 w-full">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            {currentCategory ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sougen-blue/10 text-sougen-blue border border-sougen-blue/20">
                {currentCategory}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                Belum Ada Kategori
              </span>
            )}

            {hasRules ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Aturan & Syarat Lengkap</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                Draft (Aturan Belum Diisi)
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-poppins font-bold text-admin-dark leading-tight">
            {watchAll.name || program.name}
          </h2>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-admin-secondary pt-1 font-medium">
            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
              <Camera className="w-3.5 h-3.5 text-sougen-blue" />
              <span>
                <strong>{program.photos?.length || 0}</strong> Foto Dokumentasi
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Program Resmi Sougen</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE SEGMENTED TABS ── */}
      <div className="lg:hidden flex bg-gray-100 p-1 rounded-xl border border-admin-border gap-1">
        <button
          type="button"
          onClick={() => setActiveMobileTab('form')}
          className={cn(
            "flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5",
            activeMobileTab === 'form' 
              ? "bg-white text-sougen-blue shadow-xs" 
              : "text-admin-secondary hover:text-admin-dark"
          )}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Info & Aturan</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveMobileTab('gallery')}
          className={cn(
            "flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5",
            activeMobileTab === 'gallery' 
              ? "bg-white text-sougen-blue shadow-xs" 
              : "text-admin-secondary hover:text-admin-dark"
          )}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Galeri ({program.photos?.length || 0})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveMobileTab('preview')}
          className={cn(
            "flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5",
            activeMobileTab === 'preview' 
              ? "bg-white text-sougen-blue shadow-xs" 
              : "text-admin-secondary hover:text-admin-dark"
          )}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live Preview</span>
        </button>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── LEFT COLUMN: FORM & RULES EDITOR (Col-span 7) ── */}
        <div className={cn(
          "lg:col-span-7 xl:col-span-7 space-y-6",
          activeMobileTab !== 'form' && "hidden lg:block"
        )}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* SECTION 1: Informasi Umum & Kategori */}
            <div className="bg-white p-5 sm:p-6 border border-admin-border rounded-2xl shadow-xs space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-admin-border">
                <Layers className="w-4 h-4 text-sougen-blue" />
                <h3 className="text-sm font-poppins font-bold text-admin-dark">Informasi Umum Program</h3>
              </div>

              {/* Nama Program */}
              <div>
                <label className="block text-xs font-bold text-admin-dark mb-1.5">
                  Nama Program / Kompetisi <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name')}
                  placeholder="Contoh: Cosplay Championship, Anisong Singing Contest..."
                  className="w-full px-3.5 py-2.5 border border-admin-border rounded-xl text-xs sm:text-sm bg-gray-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-colors font-medium"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
              </div>

              {/* Kategori Program Chips (Collapsible) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-admin-dark">
                    Kategori Program
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAllCategories(prev => !prev)}
                    className="text-[11px] font-bold text-sougen-blue hover:underline flex items-center gap-1"
                  >
                    {showAllCategories ? (
                      <>
                        <ChevronUp className="w-3 h-3" />
                        <span>Ciutkan</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        <span>Lihat Semua ({DEFAULT_PROGRAM_CATEGORIES.length})</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {visibleCategories.map(cat => {
                    const isSelected = currentCategory === cat && !isCustomCategoryActive;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setIsCustomCategoryActive(false);
                          setValue('category', cat, { shouldDirty: true });
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border active:scale-95",
                          isSelected
                            ? "bg-sougen-blue text-white border-sougen-blue shadow-xs"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:border-sougen-blue/40 hover:bg-sougen-blue/5"
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                        {cat}
                      </button>
                    );
                  })}

                  {/* Kategori Kustom Button */}
                  {(showAllCategories || isCustomCategoryActive) && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategoryActive(true);
                        setValue('category', customCategoryInput, { shouldDirty: true });
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border active:scale-95",
                        isCustomCategoryActive
                          ? "bg-sougen-blue text-white border-sougen-blue shadow-xs"
                          : "bg-gray-50 text-admin-secondary border-dashed border-gray-300 hover:border-sougen-blue hover:text-sougen-blue"
                      )}
                    >
                      + Kategori Kustom
                    </button>
                  )}
                </div>

                {isCustomCategoryActive && (
                  <div className="mt-3 flex items-center gap-2 p-3 bg-sougen-blue/5 border border-sougen-blue/20 rounded-xl animate-in fade-in">
                    <input 
                      type="text"
                      placeholder="Ketik kategori program kustom..."
                      value={customCategoryInput}
                      autoFocus
                      onChange={(e) => {
                        setCustomCategoryInput(e.target.value);
                        setValue('category', e.target.value, { shouldDirty: true });
                      }}
                      className="flex-1 px-3 py-1.5 border border-admin-border rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-sougen-blue"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategoryActive(false);
                        setValue('category', DEFAULT_PROGRAM_CATEGORIES[0], { shouldDirty: true });
                      }}
                      className="text-xs text-admin-secondary hover:text-red-500 font-bold px-2 py-1"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>

              {/* Deskripsi Singkat */}
              <div>
                <label className="block text-xs font-bold text-admin-dark mb-1.5 flex items-center justify-between">
                  <span>Deskripsi Singkat / Ringkasan</span>
                  <span className="text-[10px] text-gray-400 font-normal">{(watchAll.description || '').length} Karakter</span>
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  placeholder="Ringkasan penjelasan mengenai program ini untuk ditampilkan pada kartu preview..."
                  className="w-full px-3.5 py-2.5 border border-admin-border rounded-xl text-xs sm:text-sm bg-gray-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-colors leading-relaxed"
                />
              </div>
            </div>

            {/* SECTION 2: Aturan Main & Persyaratan (RichTextEditor) */}
            <div className="bg-white p-5 sm:p-6 border border-admin-border rounded-2xl shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-admin-border">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-sougen-blue" />
                  <h3 className="text-sm font-poppins font-bold text-admin-dark">Aturan Main, Syarat & Mekanisme</h3>
                </div>
                <span className="text-[11px] text-gray-400 font-normal">Opsional / Lengkap</span>
              </div>
              <p className="text-xs text-admin-secondary leading-relaxed">
                Tuliskan persyaratan peserta, teknis pendaftaran, jadwal pelaksanaan, serta detail hadiah menggunakan editor di bawah ini:
              </p>
              
              <div className="border border-admin-border rounded-xl overflow-hidden">
                <Controller
                  control={control}
                  name="rulesHtml"
                  render={({ field }) => (
                    <RichTextEditor 
                      content={field.value || ''} 
                      onChange={field.onChange} 
                    />
                  )}
                />
              </div>
            </div>

            {/* Bottom Actions (Thumb-Friendly on Mobile) */}
            <div className="pt-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-3">
              <button 
                type="button"
                onClick={handleBack}
                className="w-full sm:w-auto px-5 py-3 sm:py-2.5 text-xs sm:text-xs font-bold text-admin-secondary hover:bg-gray-100 border border-admin-border sm:border-transparent rounded-xl transition-all active:scale-98 text-center"
              >
                Batal
              </button>
              <button 
                type="submit" 
                disabled={saving}
                className="w-full sm:w-auto px-6 py-3.5 sm:py-2.5 bg-sougen-blue text-white text-sm sm:text-sm font-bold rounded-xl hover:bg-[#0082c4] transition-all shadow-md sm:shadow-xs disabled:opacity-50 active:scale-98 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        </div>

        {/* ── RIGHT COLUMN: DOKUMENTASI & LIVE PREVIEW (Col-span 5) ── */}
        <div className="lg:col-span-5 xl:col-span-5 space-y-6">
          {/* GALERI FOTO DOKUMENTASI */}
          <div className={cn(
            "bg-white p-5 sm:p-6 border border-admin-border rounded-2xl shadow-xs space-y-4",
            activeMobileTab === 'preview' && "hidden lg:block",
            activeMobileTab === 'form' && "hidden lg:block"
          )}>
            <div className="flex items-center justify-between pb-3 border-b border-admin-border">
              <div>
                <h3 className="text-sm font-poppins font-bold text-admin-dark flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-sougen-blue" />
                  <span>Foto Dokumentasi Kegiatan</span>
                </h3>
                <p className="text-xs text-admin-secondary mt-0.5">Maks 5MB per file (Multi-upload).</p>
              </div>
              <span className="px-2.5 py-1 bg-sougen-blue/10 text-sougen-blue rounded-full text-xs font-bold">
                {program.photos?.length || 0} Foto
              </span>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div 
              className={cn(
                "border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer transition-all",
                dragActive 
                  ? "border-sougen-blue bg-sougen-blue/5 scale-[0.99]" 
                  : "border-gray-300 hover:bg-gray-50/80 hover:border-sougen-blue/50"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => photoInputRef.current?.click()}
            >
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                ref={photoInputRef} 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files) handleUploadPhotos(Array.from(e.target.files));
                }}
              />
              {uploadingPhotos ? (
                <div className="flex flex-col items-center text-sougen-blue py-2">
                  <Loader2 className="w-8 h-8 animate-spin mb-2 text-sougen-blue" />
                  <span className="text-xs font-bold">Mengunggah Foto Dokumentasi...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center pointer-events-none space-y-1.5">
                  <div className="p-3 bg-sougen-blue/10 text-sougen-blue rounded-2xl">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-admin-dark">
                    Klik atau Seret Foto Dokumentasi ke Sini
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Mendukung multi-upload sekaligus (JPG, PNG, WebP)
                  </span>
                </div>
              )}
            </div>

            {/* Grid Kartu Foto Dokumentasi */}
            {program.photos && program.photos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {program.photos.map((photo: any, index: number) => (
                  <div 
                    key={photo.id} 
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-admin-border bg-gray-100 shadow-2xs hover:shadow-md transition-all"
                  >
                    <img 
                      src={getImageUrl(photo.imageUrlThumb || photo.imageUrlFull)} 
                      alt={`Dokumentasi ${index + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 select-none"
                    />

                    {/* Order Badge */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className="px-1.5 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono font-bold rounded-md">
                        #{index + 1}
                      </span>
                    </div>

                    {/* Overlay Action Controls */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 z-20">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedPhoto(photo)}
                          className="p-1.5 bg-white text-admin-dark hover:bg-sougen-blue hover:text-white rounded-lg shadow-sm transition-all"
                          title="Lihat Foto Resolusi Penuh"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="p-1.5 bg-red-600 text-white hover:bg-red-700 rounded-lg shadow-sm transition-all"
                          title="Hapus Foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Reorder Arrows */}
                      <div className="flex justify-between items-center bg-black/40 backdrop-blur-xs px-2 py-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => movePhoto(index, 'left')}
                          disabled={index === 0}
                          className="p-1 text-white hover:text-sougen-blue disabled:opacity-30 disabled:hover:text-white"
                          title="Geser ke Kiri"
                        >
                          <MoveLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] text-gray-300 font-mono font-semibold">Urutkan</span>
                        <button
                          type="button"
                          onClick={() => movePhoto(index, 'right')}
                          disabled={index === program.photos.length - 1}
                          className="p-1 text-white hover:text-sougen-blue disabled:opacity-30 disabled:hover:text-white"
                          title="Geser ke Kanan"
                        >
                          <MoveRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 border border-dashed border-gray-200 rounded-xl space-y-1.5">
                <ImageIcon className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-xs font-bold text-gray-600">Belum ada foto dokumentasi</p>
                <p className="text-[11px] text-gray-400">Unggah foto kegiatan program untuk tampil di portal publik.</p>
              </div>
            )}
          </div>

          {/* LIVE PREVIEW CARD PUBLIK */}
          <div className={cn(
            "bg-white p-5 sm:p-6 border border-admin-border rounded-2xl shadow-xs space-y-3",
            activeMobileTab === 'gallery' && "hidden lg:block",
            activeMobileTab === 'form' && "hidden lg:block"
          )}>
            <div className="flex items-center justify-between pb-2 border-b border-admin-border">
              <h3 className="text-xs font-bold uppercase tracking-wider text-admin-secondary flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-sougen-blue" />
                <span>Pratinjau Publik Kartu</span>
              </h3>
              <span className="text-[10px] font-bold text-sougen-blue bg-sougen-blue/10 px-2 py-0.5 rounded-full">
                Real-time Sync
              </span>
            </div>

            {/* Realistic Program Card */}
            <div className="border border-admin-border rounded-2xl overflow-hidden shadow-sm bg-white flex flex-col">
              {/* Cover Aspect 16:9 */}
              <div className="aspect-[16/9] bg-gray-900 overflow-hidden relative">
                {program.coverImageUrl ? (
                  <img 
                    src={getImageUrl(program.coverImageUrl)} 
                    alt={watchAll.name || 'Cover'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                    <ImageIcon className="w-10 h-10 opacity-30 mb-1" />
                    <span className="text-xs text-gray-400">Cover Landscape 16:9</span>
                  </div>
                )}

                {/* Top Badge */}
                {currentCategory && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold bg-sougen-blue text-white rounded-md shadow-xs">
                      {currentCategory}
                    </span>
                  </div>
                )}
              </div>

              {/* Content Body */}
              <div className="p-4 sm:p-5 space-y-2">
                <h4 className="font-poppins font-bold text-base sm:text-lg text-admin-dark leading-tight">
                  {watchAll.name || 'Nama Program'}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {watchAll.description || 'Deskripsi singkat mengenai program akan ditampilkan di area ini...'}
                </p>
              </div>

              {/* Documentation Strip */}
              {program.photos && program.photos.length > 0 && (
                <div className="p-3 bg-gray-50 border-t border-gray-100">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-2">
                    Dokumentasi ({program.photos.length})
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {program.photos.slice(0, 4).map((ph: any) => (
                      <div key={ph.id} className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-200">
                        <img 
                          src={getImageUrl(ph.imageUrlThumb || ph.imageUrlFull)} 
                          alt="Thumbnail" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── PHOTO LIGHTBOX PREVIEW DIALOG ── */}
      <Dialog.Root open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm animate-in fade-in" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] w-[95vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 bg-gray-950 text-white rounded-2xl overflow-hidden shadow-2xl p-0 focus:outline-none animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/90">
              <Dialog.Title className="text-xs sm:text-sm font-poppins font-bold text-gray-200">
                Pratinjau Foto Dokumentasi Program
              </Dialog.Title>
              <Dialog.Close asChild>
                <button type="button" className="p-1.5 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>
            {selectedPhoto && (
              <div className="p-4 flex flex-col items-center justify-center max-h-[75vh]">
                <img 
                  src={getImageUrl(selectedPhoto.imageUrlFull || selectedPhoto.imageUrlThumb)} 
                  alt="Dokumentasi Penuh" 
                  className="max-h-[65vh] max-w-full object-contain rounded-lg"
                />
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}