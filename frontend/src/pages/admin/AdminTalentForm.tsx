import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
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
  Users, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  Eye, 
  Tag, 
  Clock, 
  Layers, 
  Check, 
  ChevronRight,
  FileText
} from 'lucide-react';
import { getImageUrl } from '../../utils/getImageUrl';
import { cn } from '../../lib/utils';

const talentSchema = z.object({
  stageName: z.string().min(1, 'Nama panggung wajib diisi'),
  tag: z.string().optional(),
  instagramUrl: z.string().optional(),
  followerCount: z.number().min(0).or(z.nan()).optional(),
  postCount: z.number().min(0).or(z.nan()).optional(),
  bio: z.string().optional(),
});
type TalentValues = z.infer<typeof talentSchema>;

const DEFAULT_TAGS = [
  "Cosplayer", 
  "Musisi", 
  "Band", 
  "Influencer", 
  "Juri", 
  "MC / Master of Ceremony", 
  "Guest Star"
];

export default function AdminTalentForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const returnTo = searchParams.get('returnTo') || (location.state as any)?.returnTo;

  const [talent, setTalent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'form' | 'preview' | 'events'>('form');
  
  const [customTagInput, setCustomTagInput] = useState('');
  const [isCustomTagActive, setIsCustomTagActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, watch, reset, setValue, formState: { errors, isDirty } } = useForm<TalentValues>({
    resolver: zodResolver(talentSchema),
  });

  const watchAll = watch();
  const currentTag = watch('tag') || '';

  const handleBack = () => {
    if (returnTo) {
      navigate(returnTo);
    } else {
      navigate('/admin/talent');
    }
  };

  const fetchTalent = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/talents/${id}`);
      setTalent(res.data);
      reset({
        stageName: res.data.stageName || '',
        tag: res.data.tag || '',
        instagramUrl: res.data.instagramUrl || '',
        followerCount: res.data.followerCount ?? undefined,
        postCount: res.data.postCount ?? undefined,
        bio: res.data.bio || '',
      });

      if (res.data.tag && !DEFAULT_TAGS.includes(res.data.tag)) {
        setIsCustomTagActive(true);
        setCustomTagInput(res.data.tag);
      }
    } catch {
      alert('Gagal memuat data talent');
      handleBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchTalent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = async (data: TalentValues) => {
    setSaving(true);
    try {
      // Normalize Instagram URL/handle
      let cleanIg = data.instagramUrl?.trim() || '';
      if (cleanIg && !cleanIg.startsWith('http://') && !cleanIg.startsWith('https://')) {
        cleanIg = cleanIg.replace(/^@/, '');
        cleanIg = `https://instagram.com/${cleanIg}`;
      }

      const payload = {
        ...data,
        instagramUrl: cleanIg || null,
        followerCount: isNaN(Number(data.followerCount)) ? undefined : Number(data.followerCount),
        postCount: isNaN(Number(data.postCount)) ? undefined : Number(data.postCount),
      };

      const res = await api.put(`/api/talents/${id}`, payload);
      setTalent(res.data);
      alert('Berhasil menyimpan perubahan profil talent!');
      handleBack();
    } catch {
      alert('Gagal menyimpan talent.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadPhoto = async (file: File | null) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      await api.post(`/api/talents/${id}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const res = await api.get(`/api/talents/${id}`);
      setTalent(res.data);
    } catch {
      alert('Gagal mengunggah foto');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Quick increment follower count helper
  const handleAddFollowers = (increment: number) => {
    const current = Number(watch('followerCount')) || 0;
    setValue('followerCount', current + increment, { shouldDirty: true });
  };

  // Active / Ongoing Events Calculation
  const activeEvents = useMemo(() => {
    if (!talent?.eventTalents || !Array.isArray(talent.eventTalents)) return [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return talent.eventTalents.filter((et: any) => {
      if (!et.event) return false;
      const dateStr = et.event.endDate || et.event.startDate;
      if (!dateStr) return false;
      const d = new Date(dateStr);
      d.setHours(23, 59, 59, 999);
      return d.getTime() >= now.getTime();
    });
  }, [talent]);

  const isBooked = activeEvents.length > 0;

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

  if (loading || !talent) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-sougen-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 md:pb-16 max-w-7xl mx-auto">
      {/* ── TOP STICKY BAR ── */}
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
              <Link to="/admin/talent" className="hover:text-sougen-blue transition-colors">Talent</Link>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="truncate text-admin-dark font-medium">Edit Profil</span>
            </div>
            <h1 className="text-base sm:text-lg font-poppins font-bold text-admin-dark truncate">
              {watchAll.stageName || talent.stageName}
            </h1>
          </div>
        </div>

        {/* Action Buttons (Desktop & Mobile Sync) */}
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

      {/* ── PROFILE HERO BANNER & AVATAR ── */}
      <div className="bg-gradient-to-r from-sougen-blue/10 via-sougen-blue/5 to-white border border-admin-border rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
        {/* Avatar Container with Interactive Upload */}
        <div className="relative group shrink-0">
          <div className="w-28 h-36 sm:w-32 sm:h-44 rounded-2xl bg-gray-100 border-2 border-white shadow-md overflow-hidden relative">
            {talent.profileImageUrl ? (
              <img 
                src={getImageUrl(talent.profileImageUrl)} 
                alt={talent.stageName} 
                className="w-full h-full object-cover select-none group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                <Users className="w-10 h-10 mb-1 text-gray-300" />
                <span className="text-[10px] font-semibold">Belum Ada Foto</span>
              </div>
            )}

            {/* Upload Overlay */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity p-2 text-center"
            >
              {uploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-white mb-1" />
              ) : (
                <>
                  <UploadCloud className="w-6 h-6 mb-1 text-sougen-blue" />
                  <span className="text-[11px] font-bold">Ganti Foto</span>
                  <span className="text-[9px] text-gray-300">Maks. 5MB</span>
                </>
              )}
            </div>
          </div>

          {/* Upload Button under Avatar for Mobile touch accessibility */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="sm:hidden mt-2 w-full py-1 px-2 text-[11px] font-bold bg-white border border-admin-border rounded-lg text-sougen-blue flex items-center justify-center gap-1 shadow-2xs"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{uploading ? 'Mengunggah...' : 'Ganti Foto'}</span>
          </button>
          
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={(e) => handleUploadPhoto(e.target.files?.[0] || null)}
          />
        </div>

        {/* Profile Hero Metadata */}
        <div className="flex-1 text-center sm:text-left space-y-2.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            {/* Status Badge */}
            {isBooked ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Booked ({activeEvents.length} Event Aktif)</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Free (Tersedia)</span>
              </span>
            )}

            {/* Tag Badge */}
            {currentTag && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sougen-blue/10 text-sougen-blue border border-sougen-blue/20">
                {currentTag}
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-poppins font-bold text-admin-dark leading-tight">
            {watchAll.stageName || talent.stageName}
          </h2>

          {/* Quick Metrics Summary */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-admin-secondary pt-1 font-medium">
            <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-lg border border-gray-200">
              <Users className="w-3.5 h-3.5 text-sougen-blue" />
              <span>
                <strong>{new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(Number(watchAll.followerCount) || 0)}</strong> Pengikut
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-lg border border-gray-200">
              <Layers className="w-3.5 h-3.5 text-sougen-blue" />
              <span>
                <strong>{watchAll.postCount || 0}</strong> Postingan
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

      {/* ── MOBILE SEGMENTED TABS (Only visible on small screens) ── */}
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
          <span>Formulir</span>
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
        <button
          type="button"
          onClick={() => setActiveMobileTab('events')}
          className={cn(
            "flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5",
            activeMobileTab === 'events' 
              ? "bg-white text-sougen-blue shadow-xs" 
              : "text-admin-secondary hover:text-admin-dark"
          )}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Agenda ({talent.eventTalents?.length || 0})</span>
        </button>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── LEFT COLUMN: FORM SECTIONS (Col-span 7 or 8) ── */}
        <div className={cn(
          "lg:col-span-7 xl:col-span-8 space-y-6",
          activeMobileTab !== 'form' && "hidden lg:block"
        )}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* SECTION 1: Identitas Talent & Jenis Tag */}
            <div className="bg-white p-5 sm:p-6 border border-admin-border rounded-2xl shadow-xs space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-admin-border">
                <Tag className="w-4 h-4 text-sougen-blue" />
                <h3 className="text-sm font-poppins font-bold text-admin-dark">Identitas & Kategori Talent</h3>
              </div>

              {/* Nama Panggung */}
              <div>
                <label className="block text-xs font-bold text-admin-dark mb-1.5">
                  Nama Panggung / Cosplayer / Band <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('stageName')}
                  placeholder="Contoh: Clarissa Punipun, The Adams, DJ Kazu..."
                  className="w-full px-3.5 py-2.5 border border-admin-border rounded-xl text-xs sm:text-sm bg-gray-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-colors font-medium"
                />
                {errors.stageName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.stageName.message}</p>}
              </div>

              {/* Tag / Jenis Talent Chips */}
              <div>
                <label className="block text-xs font-bold text-admin-dark mb-2 flex items-center justify-between">
                  <span>Tag / Spesialisasi Talent</span>
                  <span className="text-[10px] text-gray-400 font-normal">Pilih salah satu atau buat kustom</span>
                </label>
                
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_TAGS.map(t => {
                    const isSelected = currentTag === t && !isCustomTagActive;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setIsCustomTagActive(false);
                          setValue('tag', t, { shouldDirty: true });
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border active:scale-95",
                          isSelected
                            ? "bg-sougen-blue text-white border-sougen-blue shadow-xs"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:border-sougen-blue/40 hover:bg-sougen-blue/5"
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                        {t}
                      </button>
                    );
                  })}

                  {/* Custom Tag Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomTagActive(true);
                      setValue('tag', customTagInput, { shouldDirty: true });
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border active:scale-95",
                      isCustomTagActive
                        ? "bg-sougen-blue text-white border-sougen-blue shadow-xs"
                        : "bg-gray-50 text-admin-secondary border-dashed border-gray-300 hover:border-sougen-blue hover:text-sougen-blue"
                    )}
                  >
                    + Custom Tag
                  </button>
                </div>

                {/* Inline Custom Tag Input */}
                {isCustomTagActive && (
                  <div className="mt-3 flex items-center gap-2 p-3 bg-sougen-blue/5 border border-sougen-blue/20 rounded-xl animate-in fade-in">
                    <input 
                      type="text"
                      placeholder="Ketik jenis tag kustom (misal: Voice Actor, Komikus, VTuber)..."
                      value={customTagInput}
                      autoFocus
                      onChange={(e) => {
                        setCustomTagInput(e.target.value);
                        setValue('tag', e.target.value, { shouldDirty: true });
                      }}
                      className="flex-1 px-3 py-1.5 border border-admin-border rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-sougen-blue"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomTagActive(false);
                        setValue('tag', DEFAULT_TAGS[0], { shouldDirty: true });
                      }}
                      className="text-xs text-admin-secondary hover:text-red-500 font-bold px-2 py-1"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>

              {/* Bio / Deskripsi Singkat */}
              <div>
                <label className="block text-xs font-bold text-admin-dark mb-1.5 flex items-center justify-between">
                  <span>Biografi / Deskripsi Singkat</span>
                  <span className="text-[10px] text-gray-400 font-normal">{(watchAll.bio || '').length} Karakter</span>
                </label>
                <textarea
                  {...register('bio')}
                  rows={4}
                  placeholder="Tuliskan perkenalan singkat, portofolio, atau prestasi talent yang menarik pengunjung..."
                  className="w-full px-3.5 py-2.5 border border-admin-border rounded-xl text-xs sm:text-sm bg-gray-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-colors leading-relaxed"
                />
              </div>
            </div>

            {/* SECTION 2: Media Sosial & Statistik Pengikut */}
            <div className="bg-white p-5 sm:p-6 border border-admin-border rounded-2xl shadow-xs space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-admin-border">
                <AtSign className="w-4 h-4 text-pink-600" />
                <h3 className="text-sm font-poppins font-bold text-admin-dark">Sosial Media & Metrik Pengikut</h3>
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
                    placeholder="https://instagram.com/username atau @username"
                    className="w-full pl-10 pr-3.5 py-2.5 border border-admin-border rounded-xl text-xs sm:text-sm bg-gray-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-colors font-mono"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Bisa masukkan username (@nama) atau tautan URL lengkap.</p>
              </div>

              {/* Dual Numbers: Followers & Posts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Followers */}
                <div className="p-3.5 bg-gray-50/80 border border-gray-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-admin-dark flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-sougen-blue" />
                      <span>Jumlah Followers</span>
                    </label>
                    <span className="text-[11px] font-mono font-bold text-sougen-blue bg-sougen-blue/10 px-2 py-0.5 rounded-md">
                      {new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(Number(watchAll.followerCount) || 0)}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    {...register('followerCount', { valueAsNumber: true })}
                    placeholder="Contoh: 25000"
                    className="w-full px-3 py-2 border border-admin-border rounded-lg text-xs sm:text-sm font-mono font-bold bg-white focus:outline-none focus:ring-1 focus:ring-sougen-blue"
                  />
                  {/* Quick Add Presets */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {[1000, 5000, 10000, 50000].map(inc => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => handleAddFollowers(inc)}
                        className="px-2 py-0.5 bg-white hover:bg-sougen-blue/10 text-admin-secondary hover:text-sougen-blue border border-gray-200 rounded-md text-[10px] font-bold transition-all active:scale-95"
                      >
                        +{inc >= 1000 ? `${inc / 1000}K` : inc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Posts Count */}
                <div className="p-3.5 bg-gray-50/80 border border-gray-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-admin-dark flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-sougen-blue" />
                      <span>Jumlah Postingan</span>
                    </label>
                    <span className="text-[11px] font-mono font-bold text-admin-secondary">
                      {watchAll.postCount || 0} Post
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    {...register('postCount', { valueAsNumber: true })}
                    placeholder="Contoh: 120"
                    className="w-full px-3 py-2 border border-admin-border rounded-lg text-xs sm:text-sm font-mono font-bold bg-white focus:outline-none focus:ring-1 focus:ring-sougen-blue"
                  />
                  <p className="text-[10px] text-gray-400 pt-1">Total post konten media di Instagram/portofolio.</p>
                </div>
              </div>
            </div>

            {/* Bottom Save Action Button */}
            <div className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-3">
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

        {/* ── RIGHT COLUMN: STICKY PREVIEW CARD & AGENDA (Col-span 5 or 4) ── */}
        <div className={cn(
          "lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24",
          activeMobileTab === 'form' && "hidden lg:block"
        )}>
          {/* LIVE PREVIEW CARD (Visible on Desktop & Mobile Preview Tab) */}
          <div className={cn(
            "space-y-3",
            activeMobileTab === 'events' && "hidden lg:block"
          )}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-admin-secondary flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-sougen-blue" />
                <span>Pratinjau Publik Kartu</span>
              </h3>
              <span className="text-[10px] font-bold text-sougen-blue bg-sougen-blue/10 px-2 py-0.5 rounded-full">
                Real-time Sync
              </span>
            </div>

            {/* Realistic Public Card */}
            <div className="group relative bg-white border border-admin-border rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col">
              <div className="aspect-[3/4] relative bg-gray-900 overflow-hidden">
                {talent.profileImageUrl ? (
                  <img 
                    src={getImageUrl(talent.profileImageUrl)} 
                    alt="Preview" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gray-900">
                    <Users className="w-12 h-12 mb-2 opacity-30 text-white" />
                    <span className="text-xs font-medium text-gray-400">Belum Ada Foto Profil</span>
                  </div>
                )}

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                {/* Top Badge: Availability */}
                <div className="absolute top-3 left-3 z-10 pointer-events-none">
                  {isBooked ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-md flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Booked</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Free</span>
                    </span>
                  )}
                </div>

                {/* Bottom Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10 space-y-1">
                  {currentTag && (
                    <span className="inline-block px-2.5 py-0.5 bg-sougen-blue text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-xs">
                      {currentTag}
                    </span>
                  )}
                  <h4 className="font-poppins font-bold text-lg sm:text-xl drop-shadow-md leading-tight text-white">
                    {watchAll.stageName || 'Nama Panggung'}
                  </h4>
                  {igHandle && (
                    <div className="flex items-center gap-1 text-pink-300 text-xs font-medium pt-0.5">
                      <AtSign className="w-3 h-3" />
                      <span className="truncate">{igHandle}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="p-4 bg-white space-y-3">
                <div className="flex justify-between items-center text-xs text-admin-secondary font-semibold pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sougen-blue" />
                    <span>
                      {new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(Number(watchAll.followerCount) || 0)} Followers
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-sougen-blue" />
                    <span>{watchAll.postCount || 0} Post</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  {watchAll.bio || 'Biografi singkat talent akan muncul di area ini pada halaman publik...'}
                </p>
              </div>
            </div>
          </div>

          {/* AGENDA & RIWAYAT PENUGASAN EVENT (Visible on Desktop & Mobile Events Tab) */}
          <div className={cn(
            "bg-white p-4 sm:p-5 border border-admin-border rounded-2xl shadow-xs space-y-3",
            activeMobileTab === 'preview' && "hidden lg:block"
          )}>
            <div className="flex items-center justify-between pb-2 border-b border-admin-border">
              <h3 className="text-xs font-bold text-admin-dark flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sougen-blue" />
                <span>Riwayat Penugasan Event ({talent.eventTalents?.length || 0})</span>
              </h3>
            </div>

            {talent.eventTalents && talent.eventTalents.length > 0 ? (
              <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                {talent.eventTalents.map((et: any) => {
                  const eventDateStr = et.event?.endDate || et.event?.startDate;
                  const isEventPast = eventDateStr && new Date(eventDateStr).getTime() < new Date().setHours(0,0,0,0);

                  return (
                    <div 
                      key={et.id} 
                      className="p-3 bg-gray-50 border border-admin-border rounded-xl hover:border-sougen-blue/50 transition-colors space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <Link 
                          to={`/admin/events/${et.event?.id}`}
                          className="font-poppins font-bold text-xs text-admin-dark hover:text-sougen-blue transition-colors line-clamp-1"
                        >
                          {et.event?.name || 'Event Sougen'}
                        </Link>
                        <span className={cn(
                          "px-2 py-0.5 rounded-md text-[9px] font-bold shrink-0",
                          isEventPast
                            ? "bg-gray-200 text-gray-600"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        )}>
                          {isEventPast ? 'Selesai' : 'Aktif / Jadwal'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-admin-secondary">
                        <span className="font-semibold text-sougen-blue">
                          Peran: {et.roleOverride || et.role}
                        </span>
                        {et.performTime && (
                          <span className="flex items-center gap-1 font-mono text-[10px]">
                            <Clock className="w-3 h-3" />
                            {et.performTime}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-admin-secondary bg-gray-50 rounded-xl border border-dashed border-gray-200">
                Talent ini belum ditugaskan ke event mana pun.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}