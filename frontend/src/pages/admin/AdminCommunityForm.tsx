import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../services/api';
import { Loader2, ArrowLeft, Save, UploadCloud, AtSign, Image as ImageIcon, X } from 'lucide-react';
import { getImageUrl } from '../../utils/getImageUrl';

const communitySchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  category: z.string().optional(),
  establishedYear: z.number().int().min(1900).max(new Date().getFullYear()).or(z.nan()).optional(),
  instagramUrl: z.string().url('URL tidak valid').or(z.literal('')).optional(),
  description: z.string().optional(),
});
type CommunityValues = z.infer<typeof communitySchema>;

export default function AdminCommunityForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [community, setCommunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommunityValues>({
    resolver: zodResolver(communitySchema),
  });

  const fetchCommunity = async () => {
    try {
      const res = await api.get(`/api/communities/${id}`);
      setCommunity(res.data);
      reset({
        name: res.data.name,
        category: res.data.category || '',
        establishedYear: res.data.establishedYear || undefined,
        instagramUrl: res.data.instagramUrl || '',
        description: res.data.description || '',
      });
    } catch (err) {
      alert('Gagal memuat komunitas');
      navigate('/admin/community');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCommunity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, reset, navigate]);

  const onSubmit = async (data: CommunityValues) => {
    setSaving(true);
    try {
      const res = await api.put(`/api/communities/${id}`, {
        ...data,
        establishedYear: isNaN(Number(data.establishedYear)) ? undefined : Number(data.establishedYear),
      });
      setCommunity(res.data);
      alert('Berhasil menyimpan data profil');
    } catch (err) {
      alert('Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadLogo = async (file: File | null) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB');
      return;
    }
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      await api.post(`/api/communities/${id}/logo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchCommunity();
    } catch {
      alert('Gagal mengunggah logo');
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  // Drag and Drop handlers
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
    // Validate sizes
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
      fetchCommunity();
    } catch {
      alert('Gagal mengunggah foto dokumentasi');
    } finally {
      setUploadingPhotos(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (!confirm('Hapus foto ini?')) return;
    try {
      await api.delete(`/api/community-photos/${photoId}`);
      fetchCommunity();
    } catch {
      alert('Gagal menghapus foto');
    }
  };

  // Simple reordering via up/down buttons for now (Drag & Drop sorting is complex)
  const movePhoto = async (index: number, direction: 'up' | 'down') => {
    if (!community.photos) return;
    const newPhotos = [...community.photos];
    if (direction === 'up' && index > 0) {
      [newPhotos[index - 1], newPhotos[index]] = [newPhotos[index], newPhotos[index - 1]];
    } else if (direction === 'down' && index < newPhotos.length - 1) {
      [newPhotos[index + 1], newPhotos[index]] = [newPhotos[index], newPhotos[index + 1]];
    } else {
      return; // Invalid move
    }
    
    // Optimistic UI update
    setCommunity({ ...community, photos: newPhotos });
    
    // Save to server
    try {
      await api.put(`/api/communities/${id}/photos/reorder`, {
        orderedIds: newPhotos.map(p => p.id)
      });
    } catch {
      alert('Gagal mengurutkan');
      fetchCommunity(); // Revert
    }
  };

  if (loading || !community) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-rpo-red" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/admin/community')}
          className="p-2 border border-admin-border bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-admin-dark" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-poppins font-bold text-admin-dark">
            Edit Komunitas: {community.name}
          </h1>
          <p className="text-sm text-admin-secondary mt-1">Lengkapi informasi profil dan dokumentasi komunitas.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left: Form Area & Logo */}
        <div className="w-full lg:w-1/2 space-y-6">
          {/* Logo Upload */}
          <div className="bg-white p-6 border border-admin-border rounded-xl shadow-sm">
            <h2 className="text-lg font-poppins font-semibold text-admin-dark mb-4">Logo Komunitas</h2>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-xl border border-admin-border bg-gray-100 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                {community.logoUrl ? (
                  <img src={getImageUrl(community.logoUrl)} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs text-admin-secondary mb-3 leading-relaxed">
                  Resolusi yang disarankan: 500x500px (Persegi 1:1).<br/>
                  Format yang didukung: JPG, PNG. Maksimal 2MB.
                </p>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={logoInputRef} 
                  className="hidden" 
                  onChange={(e) => handleUploadLogo(e.target.files?.[0] || null)}
                />
                <button
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-admin-border bg-white text-admin-dark text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  {uploadingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                  Unggah Logo
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 border border-admin-border rounded-xl shadow-sm space-y-5">
            <h2 className="text-lg font-poppins font-semibold text-admin-dark mb-2">Informasi Profil</h2>
            
            <div>
              <label className="block text-sm font-medium text-admin-dark mb-1">Nama Komunitas</label>
              <input
                {...register('name')}
                className="w-full px-3 py-2.5 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rpo-red/20 focus:border-rpo-red"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-admin-dark mb-1">Kategori</label>
                <input
                  {...register('category')}
                  placeholder="Contoh: Seni & Budaya"
                  className="w-full px-3 py-2.5 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rpo-red/20 focus:border-rpo-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-admin-dark mb-1">Tahun Berdiri</label>
                <input
                  type="number"
                  {...register('establishedYear', { valueAsNumber: true })}
                  placeholder="Contoh: 2018"
                  className="w-full px-3 py-2.5 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rpo-red/20 focus:border-rpo-red"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-admin-dark mb-1">Instagram URL</label>
              <div className="relative">
                <AtSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('instagramUrl')}
                  placeholder="https://instagram.com/..."
                  className="w-full pl-10 pr-3 py-2.5 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rpo-red/20 focus:border-rpo-red"
                />
              </div>
              {errors.instagramUrl && <p className="text-red-500 text-xs mt-1">{errors.instagramUrl.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-admin-dark mb-1">Deskripsi</label>
              <textarea
                {...register('description')}
                rows={5}
                className="w-full px-3 py-2.5 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rpo-red/20 focus:border-rpo-red"
              />
            </div>

            <div className="pt-4 border-t border-admin-border flex justify-end">
              <button 
                type="submit" 
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-admin-dark text-white font-medium rounded-lg hover:bg-black transition-colors disabled:opacity-70"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan Profil
              </button>
            </div>
          </form>
        </div>

        {/* Right: Documentation Photos (Drag and Drop Multi Upload) */}
        <div className="w-full lg:w-1/2 bg-white p-6 border border-admin-border rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-poppins font-semibold text-admin-dark">Foto Dokumentasi</h2>
              <p className="text-xs text-admin-secondary mt-0.5">Unggah foto-foto kegiatan (Maks 5MB per file).</p>
            </div>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
              {community.photos?.length || 0} Foto
            </span>
          </div>

          {/* Drag & Drop Area */}
          <div 
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              dragActive ? 'border-rpo-red bg-red-50' : 'border-gray-300 hover:bg-gray-50'
            }`}
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
              <div className="flex flex-col items-center text-rpo-red">
                <Loader2 className="w-10 h-10 animate-spin mb-3" />
                <span className="text-sm font-medium">Mengunggah Foto...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-admin-secondary pointer-events-none">
                <div className="p-3 bg-gray-100 rounded-full mb-3">
                  <UploadCloud className="w-8 h-8 text-gray-500" />
                </div>
                <span className="text-sm font-bold text-admin-dark mb-1">Klik atau Drag & Drop file ke sini</span>
                <span className="text-xs">Mendukung unggah banyak file sekaligus (JPG, PNG)</span>
              </div>
            )}
          </div>

          {/* Photo List (Draggable conceptually, implemented with up/down for simplicity) */}
          <div className="mt-6 space-y-3">
            {community.photos?.map((photo: any, index: number) => (
              <div key={photo.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-admin-border rounded-lg group">
                <div className="flex flex-col gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => movePhoto(index, 'up')} 
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-200 rounded text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    ▲
                  </button>
                  <button 
                    onClick={() => movePhoto(index, 'down')} 
                    disabled={index === community.photos.length - 1}
                    className="p-1 hover:bg-gray-200 rounded text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    ▼
                  </button>
                </div>
                
                <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden shrink-0">
                  <img src={getImageUrl(photo.url)} alt="Dokumentasi" className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-admin-dark truncate">
                    Foto Dokumentasi {index + 1}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">ID: {photo.id}</p>
                </div>

                <button 
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {(!community.photos || community.photos.length === 0) && (
              <div className="text-center py-6 text-sm text-gray-400 font-medium">
                Belum ada foto dokumentasi yang diunggah.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}