import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../services/api';
import { 
  Loader2, 
  ArrowLeft, 
  Save, 
  UploadCloud, 
  AtSign, 
  Sparkles, 
  ExternalLink, 
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
  X,
  Download,
  Building2,
  ImageIcon
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { downloadImage } from '../../utils/downloadImage';
import { getImageUrl } from '../../utils/getImageUrl';
import { cn } from '../../lib/utils';

const communitySchema = z.object({
  name: z.string().min(1, 'Nama komunitas wajib diisi'),
  category: z.string().optional(),
  establishedYear: z.number().int().min(1900).max(new Date().getFullYear()).or(z.nan()).optional(),
  instagramUrl: z.string().optional(),
  description: z.string().optional(),
});
type CommunityValues = z.infer<typeof communitySchema>;

const DEFAULT_CATEGORIES = [
  "Cosplay & Performance",
  "Seni & Ilustrasi",
  "Gaming & Esports",
  "Anime & Pop Culture",
  "Musik & Band",
  "Komunitas Kreatif",
  "J-Music / Idol",
  "Fotografi & Media"
];

export default function AdminCommunityForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [community, setCommunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'form' | 'gallery' | 'preview'>('form');
  
  // Category State
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [isCustomCategoryActive, setIsCustomCategoryActive] = useState(false);
  
  // Drag & Drop State
  const [dragActive, setDragActive] = useState(false);

  // Lightbox Preview Dialog
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, watch, reset, setValue, formState: { errors, isDirty } } = useForm<CommunityValues>({
    resolver: zodResolver(communitySchema),
  });

  const watchAll = watch();
  const currentCategory = watch('category') || '';

  const fetchCommunity = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/communities/${id}`);
      setCommunity(res.data);
      reset({
        name: res.data.name || '',
        category: res.data.category || '',
        establishedYear: res.data.establishedYear ?? undefined,
        instagramUrl: res.data.instagramUrl || '',
        description: res.data.description || '',
      });

      if (res.data.category && !DEFAULT_CATEGORIES.includes(res.data.category)) {
        setIsCustomCategoryActive(true);
        setCustomCategoryInput(res.data.category);
      }
    } catch {
      alert('Gagal memuat data komunitas');
      navigate('/admin/community');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCommunity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = async (data: CommunityValues) => {
    setSaving(true);
    try {
      // Normalize Instagram URL / handle
      let cleanIg = data.instagramUrl?.trim() || '';
      if (cleanIg && !cleanIg.startsWith('http://') && !cleanIg.startsWith('https://')) {
        cleanIg = cleanIg.replace(/^@/, '');
        cleanIg = `https://instagram.com/${cleanIg}`;
      }

      const payload = {
        ...data,
        instagramUrl: cleanIg || null,
        establishedYear: isNaN(Number(data.establishedYear)) ? undefined : Number(data.establishedYear),
      };

      const res = await api.put(`/api/communities/${id}`, payload);
      setCommunity((prev: any) => ({ ...prev, ...res.data }));
      alert('Berhasil menyimpan data profil komunitas!');
      navigate('/admin/community');
    } catch {
      alert('Gagal menyimpan profil komunitas.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadLogo = async (file: File | null) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran logo maksimal 2MB');
      return;
    }
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      await api.post(`/api/communities/${id}/logo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchCommunity();
    } catch {
      alert('Gagal mengunggah logo');
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  // Drag & Drop Handlers for Photo Gallery
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
      await api.post(`/api/communities/${id}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchCommunity();
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
      await api.delete(`/api/community-photos/${photoId}`);
      await fetchCommunity();
    } catch {
      alert('Gagal menghapus foto');
    }
  };

  const movePhoto = async (index: number, direction: 'left' | 'right') => {
    if (!community?.photos) return;
    const newPhotos = [...community.photos];
    if (direction === 'left' && index > 0) {
      [newPhotos[index - 1], newPhotos[index]] = [newPhotos[index], newPhotos[index - 1]];
    } else if (direction === 'right' && index < newPhotos.length - 1) {
      [newPhotos[index + 1], newPhotos[index]] = [newPhotos[index], newPhotos[index + 1]];
    } else {
      return;
    }
    
    // Optimistic UI Update
    setCommunity({ ...community, photos: newPhotos });
    
    try {
      await api.put(`/api/communities/${id}/photos/reorder`, {
        orderedIds: newPhotos.map(p => p.id)
      });
    } catch {
      alert('Gagal mengurutkan foto');
      fetchCommunity();
    }
  };

  // Format Instagram handle preview
  const igHandle = useMemo(() => {
    const url = watchAll.instagramUrl || '';
    if (!url) return '';
    try {
      const match = url.replace(/\/$/, '').split('/').pop()?.replace(/^@/, '');
      return match ? `@${match}` : url;
    } catch {
      return url;
    }
  }, [watchAll.instagramUrl]);

  // Visible Categories Slice
  const visibleCategories = useMemo(() => {
    if (showAllCategories) return DEFAULT_CATEGORIES;
    return DEFAULT_CATEGORIES.slice(0, 4);
  }, [showAllCategories]);

  if (loading || !community) {
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
            onClick={() => navigate('/admin/community')}
            className="p-2 border border-admin-border bg-white rounded-xl hover:bg-gray-50 text-admin-dark transition-all active:scale-95 shadow-2xs shrink-0"
            title="Kembali"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-admin-secondary">
              <Link to="/admin/community" className="hover:text-sougen-blue transition-colors">Komunitas</Link>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="truncate text-admin-dark font-medium">Edit Profil</span>
            </div>
            <h1 className="text-base sm:text-lg font-poppins font-bold text-admin-dark truncate">
              {watchAll.name || community.name}
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

      {/* ── COMMUNITY HERO BANNER & LOGO ── */}
      <div className="bg-gradient-to-r from-sougen-blue/10 via-sougen-blue/5 to-white border border-admin-border rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
        {/* Logo Container with Quick Upload Overlay */}
        <div className="relative group shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-2 border-white shadow-md overflow-hidden relative flex items-center justify-center">
            {community.logoUrl ? (
              <img 
                src={getImageUrl(community.logoUrl)} 
                alt={community.name} 
                className="w-full h-full object-cover select-none group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 p-2 text-center">
                <Building2 className="w-8 h-8 mb-1 text-gray-300" />
                <span className="text-[9px] font-semibold">Tanpa Logo</span>
              </div>
            )}

            {/* Hover Overlay */}
            <div 
              onClick={() => logoInputRef.current?.click()}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity p-1 text-center"
            >
              {uploadingLogo ? (
                <Loader2 className="w-5 h-5 animate-spin text-white mb-1" />
              ) : (
                <>
                  <UploadCloud className="w-5 h-5 mb-1 text-sougen-blue" />
                  <span className="text-[10px] font-bold">Ganti Logo</span>
                  <span className="text-[8px] text-gray-300">Maks. 2MB</span>
                </>
              )}
            </div>
          </div>

          {/* Mobile Upload Button */}
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            disabled={uploadingLogo}
            className="sm:hidden mt-2 w-full py-1 px-2 text-[10px] font-bold bg-white border border-admin-border rounded-lg text-sougen-blue flex items-center justify-center gap-1 shadow-2xs"
          >
            <UploadCloud className="w-3 h-3" />
            <span>{uploadingLogo ? 'Mengunggah...' : 'Ganti Logo'}</span>
          </button>
          
          <input 
            type="file" 
            accept="image/*" 
            ref={logoInputRef} 
            className="hidden" 
            onChange={(e) => handleUploadLogo(e.target.files?.[0] || null)}
          />
        </div>

        {/* Community Hero Metadata */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            {currentCategory && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sougen-blue/10 text-sougen-blue border border-sougen-blue/20">
                {currentCategory}
              </span>
            )}
            {watchAll.establishedYear && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                Est. {watchAll.establishedYear}
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-poppins font-bold text-admin-dark leading-tight">
            {watchAll.name || community.name}
          </h2>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-admin-secondary pt-1 font-medium">
            <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-lg border border-gray-200">
              <Camera className="w-3.5 h-3.5 text-sougen-blue" />
              <span>
                <strong>{community.photos?.length || 0}</strong> Foto Dokumentasi
              </span>
            </div>
            {igHandle && (
              <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-lg border border-gray-200 text-pink-600 font-semibold">
                <AtSign className="w-3.5 h-3.5" />
                <span>{igHandle}</span>
              </div>
            )}
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
          <span>Profil</span>
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
          <span>Galeri ({community.photos?.length || 0})</span>
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
        {/* ── LEFT COLUMN: PROFIL & INFORMASI FORM ── */}
        <div className={cn(
          "lg:col-span-6 xl:col-span-6 space-y-6",
          activeMobileTab !== 'form' && "hidden lg:block"
        )}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white p-5 sm:p-6 border border-admin-border rounded-2xl shadow-xs space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-admin-border">
                <Building2 className="w-4 h-4 text-sougen-blue" />
                <h3 className="text-sm font-poppins font-bold text-admin-dark">Informasi Komunitas</h3>
              </div>

              {/* Nama Komunitas */}
              <div>
                <label className="block text-xs font-bold text-admin-dark mb-1.5">
                  Nama Komunitas <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name')}
                  placeholder="Contoh: Makassar Cosplay Guild, Ilustrator Celebes..."
                  className="w-full px-3.5 py-2.5 border border-admin-border rounded-xl text-xs sm:text-sm bg-gray-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-colors font-medium"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
              </div>

              {/* Kategori Komunitas Chips dengan Tombol Lihat Semua */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-admin-dark">
                    Kategori Komunitas
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
                        <span>Lihat Semua ({DEFAULT_CATEGORIES.length})</span>
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

                  {/* Kategori Kustom Button (Hanya muncul saat dibuka semua atau jika sedang aktif) */}
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
                      placeholder="Ketik kategori kustom..."
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
                        setValue('category', DEFAULT_CATEGORIES[0], { shouldDirty: true });
                      }}
                      className="text-xs text-admin-secondary hover:text-red-500 font-bold px-2 py-1"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>

              {/* Tahun Berdiri (Input Mandiri) */}
              <div>
                <label className="block text-xs font-bold text-admin-dark mb-1.5">
                  Tahun Berdiri (Est.)
                </label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  {...register('establishedYear', { valueAsNumber: true })}
                  placeholder="Contoh: 2019"
                  className="w-full sm:w-48 px-3.5 py-2.5 border border-admin-border rounded-xl text-xs sm:text-sm bg-gray-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue font-mono font-bold transition-colors"
                />
                {errors.establishedYear && <p className="text-red-500 text-xs mt-1 font-medium">{errors.establishedYear.message}</p>}
              </div>

              {/* Instagram URL */}
              <div>
                <label className="block text-xs font-bold text-admin-dark mb-1.5 flex items-center justify-between">
                  <span>Akun Instagram</span>
                  {watchAll.instagramUrl && (
                    <a 
                      href={watchAll.instagramUrl.startsWith('http') ? watchAll.instagramUrl : `https://instagram.com/${watchAll.instagramUrl.replace(/^@/, '')}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-sougen-blue hover:underline flex items-center gap-1"
                    >
                      <span>Buka Profil</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </label>
                <div className="relative">
                  <AtSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-500" />
                  <input
                    {...register('instagramUrl')}
                    placeholder="https://instagram.com/nama_komunitas atau @nama_komunitas"
                    className="w-full pl-10 pr-3.5 py-2.5 border border-admin-border rounded-xl text-xs sm:text-sm bg-gray-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-bold text-admin-dark mb-1.5 flex items-center justify-between">
                  <span>Deskripsi Profil Komunitas</span>
                  <span className="text-[10px] text-gray-400 font-normal">{(watchAll.description || '').length} Karakter</span>
                </label>
                <textarea
                  {...register('description')}
                  rows={5}
                  placeholder="Jelaskan visi, kegiatan rutin, atau perkenalan komunitas yang akan dibaca oleh pengunjung..."
                  className="w-full px-3.5 py-2.5 border border-admin-border rounded-xl text-xs sm:text-sm bg-gray-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-colors leading-relaxed"
                />
              </div>
            </div>

            {/* Bottom Actions (Prominent & Thumb-Friendly on Mobile) */}
            <div className="pt-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-3">
              <button 
                type="button"
                onClick={() => navigate('/admin/community')}
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

        {/* ── RIGHT COLUMN: FOTO DOKUMENTASI & LIVE PREVIEW ── */}
        <div className="lg:col-span-6 xl:col-span-6 space-y-6">
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
                <p className="text-xs text-admin-secondary mt-0.5">Unggah foto kegiatan komunitas (Maks 5MB per file).</p>
              </div>
              <span className="px-2.5 py-1 bg-sougen-blue/10 text-sougen-blue rounded-full text-xs font-bold">
                {community.photos?.length || 0} Foto
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
            {community.photos && community.photos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {community.photos.map((photo: any, index: number) => (
                  <div 
                    key={photo.id} 
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-admin-border bg-gray-100 shadow-2xs hover:shadow-md transition-all"
                  >
                    <img 
                      src={getImageUrl(photo.imageUrlThumb || photo.imageUrlFull || photo.url)} 
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
                          disabled={index === community.photos.length - 1}
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
                <p className="text-[11px] text-gray-400">Unggah foto kegiatan komunitas untuk tampil di portal publik.</p>
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

            {/* Realistic Community Card */}
            <div className="border border-admin-border rounded-2xl overflow-hidden shadow-sm bg-white flex flex-col">
              <div className="p-4 sm:p-5 flex items-start gap-4">
                {/* Logo */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-admin-border bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                  {community.logoUrl ? (
                    <img 
                      src={getImageUrl(community.logoUrl)} 
                      alt={watchAll.name || 'Logo'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-gray-300" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {currentCategory && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-sougen-blue/10 text-sougen-blue rounded-md">
                        {currentCategory}
                      </span>
                    )}
                    {watchAll.establishedYear && (
                      <span className="text-[11px] text-gray-400 font-medium">
                        • Est. {watchAll.establishedYear}
                      </span>
                    )}
                  </div>
                  <h4 className="font-poppins font-bold text-base sm:text-lg text-admin-dark truncate">
                    {watchAll.name || 'Nama Komunitas'}
                  </h4>
                  {igHandle && (
                    <div className="flex items-center gap-1 text-pink-600 text-xs font-semibold">
                      <AtSign className="w-3 h-3" />
                      <span className="truncate">{igHandle}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio snippet */}
              <div className="px-4 sm:px-5 pb-3">
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {watchAll.description || 'Deskripsi profil komunitas akan tampil di sini...'}
                </p>
              </div>

              {/* Documentation Strip Preview */}
              {community.photos && community.photos.length > 0 && (
                <div className="p-3 bg-gray-50 border-t border-gray-100">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-2">
                    Dokumentasi Kegiatan ({community.photos.length})
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {community.photos.slice(0, 4).map((ph: any) => (
                      <div key={ph.id} className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-200">
                        <img 
                          src={getImageUrl(ph.imageUrlThumb || ph.imageUrlFull || ph.url)} 
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
                Pratinjau Foto Dokumentasi
              </Dialog.Title>
              <div className="flex items-center gap-2">
                {selectedPhoto && (
                  <button 
                    type="button"
                    onClick={() => downloadImage(
                      getImageUrl(selectedPhoto.imageUrlFull || selectedPhoto.imageUrlThumb || selectedPhoto.url),
                      `komunitas-${community?.slug || 'photo'}-${selectedPhoto.id}.webp`
                    )}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-sougen-blue text-white rounded-lg text-xs font-bold transition-colors"
                    title="Unduh Resolusi Penuh"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Gambar</span>
                  </button>
                )}
                <Dialog.Close asChild>
                  <button type="button" className="p-1.5 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </Dialog.Close>
              </div>
            </div>
            {selectedPhoto && (
              <div className="p-4 flex flex-col items-center justify-center max-h-[75vh]">
                <img 
                  src={getImageUrl(selectedPhoto.imageUrlFull || selectedPhoto.imageUrlThumb || selectedPhoto.url)} 
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