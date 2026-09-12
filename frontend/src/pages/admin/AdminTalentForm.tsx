import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../services/api';
import { Loader2, ArrowLeft, Save, UploadCloud, AtSign, Image as ImageIcon, Users } from 'lucide-react';
import { getImageUrl } from '../../utils/getImageUrl';

const talentSchema = z.object({
  stageName: z.string().min(1, 'Nama wajib diisi'),
  tag: z.string().optional(),
  instagramUrl: z.string().url('URL tidak valid').or(z.literal('')).optional(),
  followerCount: z.number().min(0).or(z.nan()).optional(),
  postCount: z.number().min(0).or(z.nan()).optional(),
  bio: z.string().optional(),
});
type TalentValues = z.infer<typeof talentSchema>;

export default function AdminTalentForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [talent, setTalent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<TalentValues>({
    resolver: zodResolver(talentSchema),
  });

  const watchAll = watch();
  const watchTag = watch('tag');
  const tagOptions = ["Cosplayer", "Musisi", "Band", "Influencer", "Juri", "MC / Master of Ceremony", "Guest Star"];
  const isCustomTag = watchTag !== undefined && watchTag !== '' && !tagOptions.includes(watchTag);
  const [showCustom, setShowCustom] = useState(false);

  useEffect(() => {
    const fetchTalent = async () => {
      try {
        const res = await api.get(`/api/talents/${id}`);
        setTalent(res.data);
        reset({
          stageName: res.data.stageName,
          tag: res.data.tag || '',
          instagramUrl: res.data.instagramUrl || '',
          followerCount: res.data.followerCount || undefined,
          postCount: res.data.postCount || undefined,
          bio: res.data.bio || '',
        });
      } catch (err) {
        alert('Gagal memuat talent');
        navigate('/admin/talent');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTalent();
  }, [id, reset, navigate]);

  const onSubmit = async (data: TalentValues) => {
    setSaving(true);
    try {
      const res = await api.put(`/api/talents/${id}`, {
        ...data,
        followerCount: isNaN(Number(data.followerCount)) ? undefined : Number(data.followerCount),
        postCount: isNaN(Number(data.postCount)) ? undefined : Number(data.postCount),
      });
      setTalent(res.data);
      alert('Berhasil menyimpan perubahan!');
      navigate('/admin/talent');
    } catch (err) {
      alert('Gagal menyimpan talent');
    } finally {
      setSaving(false);
    }
  };


  const handleUploadPhoto = async (file: File | null) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB');
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
    } catch (err) {
      alert('Gagal mengunggah foto');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading || !talent) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-sougen-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/admin/talent')}
          className="p-2 border border-admin-border bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-admin-dark" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-poppins font-bold text-admin-dark">
            Edit: {talent.stageName}
          </h1>
          <p className="text-sm text-admin-secondary mt-1">Lengkapi informasi profil talent.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left: Form Area */}
        <div className="w-full lg:flex-1 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 border border-admin-border rounded-xl shadow-sm space-y-6">
            <h2 className="text-lg font-poppins font-semibold text-admin-dark mb-4">Informasi Profil</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-admin-dark mb-1">Nama Panggung / Grup</label>
                <input
                  {...register('stageName')}
                  className="w-full px-3 py-2.5 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
                />
                {errors.stageName && <p className="text-red-500 text-xs mt-1">{errors.stageName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-admin-dark mb-1">Tag / Jenis Talent</label>
                {!showCustom && !isCustomTag ? (
                  <select 
                    className="w-full px-3 py-2.5 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue appearance-none"
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
                    {tagOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    <option value="custom">+ Lainnya (Ketik Sendiri)...</option>
                  </select>
                ) : (
                  <div className="flex gap-2 items-center">
                    <input 
                      {...register('tag')}
                      autoFocus
                      placeholder="Ketik tag custom..."
                      className="w-full px-3 py-2.5 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
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
            </div>

            <div>
              <label className="block text-sm font-medium text-admin-dark mb-1">Bio / Deskripsi</label>
              <textarea
                {...register('bio')}
                rows={4}
                className="w-full px-3 py-2.5 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
              />
            </div>

            <div className="pt-4 border-t border-admin-border">
              <h3 className="text-sm font-poppins font-semibold text-admin-dark mb-4">Sosial Media & Statistik</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-admin-dark mb-1">Instagram URL</label>
                  <div className="relative">
                    <AtSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('instagramUrl')}
                      placeholder="https://instagram.com/..."
                      className="w-full pl-10 pr-3 py-2.5 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
                    />
                  </div>
                  {errors.instagramUrl && <p className="text-red-500 text-xs mt-1">{errors.instagramUrl.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-admin-dark mb-1">Jumlah Followers</label>
                    <input
                      type="number"
                      {...register('followerCount', { valueAsNumber: true })}
                      placeholder="Contoh: 15000"
                      className="w-full px-3 py-2.5 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-admin-dark mb-1">Jumlah Postingan</label>
                    <input
                      type="number"
                      {...register('postCount', { valueAsNumber: true })}
                      placeholder="Contoh: 120"
                      className="w-full px-3 py-2.5 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-admin-border flex justify-end">
              <button 
                type="submit" 
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-sougen-blue text-white font-medium rounded-lg hover:bg-sougen-blue/90 transition-colors shadow-sm disabled:opacity-70"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan Perubahan
              </button>
            </div>
          </form>

          {/* Photo Upload Area */}
          <div className="bg-white p-6 border border-admin-border rounded-xl shadow-sm">
            <h2 className="text-lg font-poppins font-semibold text-admin-dark mb-2">Foto Profil</h2>
            <p className="text-xs text-admin-secondary mb-4">Resolusi yang disarankan: 800x1200px (Portrait 2:3). Maksimal 2MB.</p>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-admin-secondary hover:bg-gray-50 hover:border-sougen-blue hover:text-sougen-blue cursor-pointer transition-all group"
            >
              {uploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-8 h-8 animate-spin mb-3 text-sougen-blue" />
                  <span className="text-sm font-medium">Mengunggah...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadCloud className="w-10 h-10 mb-3" />
                  <span className="text-sm font-medium">Pilih file foto dari perangkat</span>
                  <span className="text-xs mt-1 text-gray-400 group-hover:text-sougen-blue/70">JPG, JPEG, PNG</span>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={(e) => handleUploadPhoto(e.target.files?.[0] || null)}
              />
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="w-full lg:w-80 shrink-0 relative">
          <div className="sticky top-8">
            <h2 className="text-sm font-poppins font-semibold text-admin-dark mb-3">Live Preview Kartu</h2>
            
            <div className="group relative bg-white border border-admin-border rounded-xl overflow-hidden shadow-lg flex flex-col">
              <div className="aspect-[3/4] relative bg-gray-100 overflow-hidden">
              {talent.profileImageUrl ? (
                <img src={getImageUrl(talent.profileImageUrl)} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                  <span className="text-sm font-medium">No Image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {watchAll.tag && (
                  <span className="inline-block px-2 py-0.5 bg-sougen-blue text-white text-[10px] font-bold uppercase tracking-wider rounded-sm mb-1">
                    {watchAll.tag}
                  </span>
                )}
                <h3 className="text-white font-poppins font-bold text-xl drop-shadow-md leading-tight">
                  {watchAll.stageName || 'Nama Talent'}
                </h3>
                {watchAll.instagramUrl && (
                  <div className="flex items-center gap-1.5 text-white/90 text-xs mt-1.5 font-medium">
                    <AtSign className="w-3.5 h-3.5" />
                    <span className="truncate">Instagram</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 bg-white">
              <div className="flex justify-between items-center text-xs text-admin-secondary font-medium">
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>
                    {watchAll.followerCount 
                      ? new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(watchAll.followerCount) 
                      : '0'} Followers
                  </span>
                </div>
                <div>
                  {watchAll.postCount || 0} Posts
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-600 line-clamp-3 leading-relaxed">
                {watchAll.bio || 'Bio singkat talent akan tampil di sini sebagai preview...'}
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}