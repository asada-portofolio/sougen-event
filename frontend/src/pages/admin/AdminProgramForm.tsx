import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../services/api';
import { Loader2, ArrowLeft, Save, UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import RichTextEditor from '../../components/admin/RichTextEditor';
import { getImageUrl } from '../../utils/getImageUrl';

const programSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  description: z.string().optional(),
  rulesHtml: z.string().optional(),
});
type ProgramValues = z.infer<typeof programSchema>;

export default function AdminProgramForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  
  const coverInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ProgramValues>({
    resolver: zodResolver(programSchema),
  });

  const fetchProgram = async () => {
    try {
      const res = await api.get(`/api/programs/${id}`);
      setProgram(res.data);
      reset({
        name: res.data.name,
        description: res.data.description || '',
        rulesHtml: res.data.rulesHtml || '',
      });
    } catch {
      alert('Gagal memuat program');
      navigate('/admin/programs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProgram();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, reset, navigate]);

  const onSubmit = async (data: ProgramValues) => {
    setSaving(true);
    try {
      await api.put(`/api/programs/${id}`, data);
      fetchProgram();
      alert('Berhasil menyimpan data program');
    } catch {
      alert('Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadCover = async (file: File | null) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }
    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      await api.post(`/api/programs/${id}/cover`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchProgram();
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
      fetchProgram();
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
      await api.delete(`/api/program-photos/${photoId}`);
      fetchProgram();
    } catch {
      alert('Gagal menghapus foto');
    }
  };

  const movePhoto = async (index: number, direction: 'up' | 'down') => {
    if (!program.photos) return;
    const newPhotos = [...program.photos];
    if (direction === 'up' && index > 0) {
      [newPhotos[index - 1], newPhotos[index]] = [newPhotos[index], newPhotos[index - 1]];
    } else if (direction === 'down' && index < newPhotos.length - 1) {
      [newPhotos[index + 1], newPhotos[index]] = [newPhotos[index], newPhotos[index + 1]];
    } else {
      return;
    }
    
    // Optimistic UI update
    setProgram({ ...program, photos: newPhotos });
    
    // Save to server
    try {
      await api.put(`/api/programs/${id}/photos/reorder`, {
        orderedIds: newPhotos.map(p => p.id)
      });
    } catch {
      alert('Gagal mengurutkan');
      fetchProgram();
    }
  };

  if (loading || !program) {
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
          onClick={() => navigate('/admin/programs')}
          className="p-2 border border-admin-border bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-admin-dark" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-poppins font-bold text-admin-dark">
            Edit Program: {program.name}
          </h1>
          <p className="text-sm text-admin-secondary mt-1">Lengkapi informasi profil, aturan main, dan dokumentasi.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left: Form Area */}
        <div className="w-full lg:w-[60%] space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="bg-white p-6 border border-admin-border rounded-xl shadow-sm space-y-5">
              <h2 className="text-lg font-poppins font-semibold text-admin-dark mb-2">Informasi Umum</h2>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-admin-dark mb-1">Nama Program</label>
                  <input
                    {...register('name')}
                    className="w-full px-3 py-2.5 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rpo-red/20 focus:border-rpo-red"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-admin-dark mb-1">Deskripsi Singkat</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  placeholder="Penjelasan singkat mengenai program ini..."
                  className="w-full px-3 py-2.5 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rpo-red/20 focus:border-rpo-red"
                />
              </div>
            </div>

            <div className="bg-white p-6 border border-admin-border rounded-xl shadow-sm space-y-5">
              <h2 className="text-lg font-poppins font-semibold text-admin-dark mb-2">Aturan Main & Persyaratan (Opsional)</h2>
              <p className="text-sm text-gray-500 mb-4">
                Tambahkan aturan, syarat peserta, atau mekanisme program menggunakan editor di bawah ini.
              </p>
              
              <div>
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

            <div className="flex justify-end sticky lg:static bottom-6 z-10 bg-white lg:bg-transparent p-4 lg:p-0 border border-admin-border lg:border-none rounded-xl shadow-lg lg:shadow-none mt-6">
              <button 
                type="submit" 
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-3 bg-admin-dark text-white font-medium rounded-lg hover:bg-black transition-colors disabled:opacity-70 w-full md:w-auto justify-center"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>

        {/* Right: Cover & Documentation Photos */}
        <div className="w-full lg:w-[40%] space-y-6">
          
          {/* Cover Photo Upload */}
          <div className="bg-white p-6 border border-admin-border rounded-xl shadow-sm">
            <h2 className="text-lg font-poppins font-semibold text-admin-dark mb-2">Cover Program</h2>
            <p className="text-xs text-admin-secondary mb-4">Resolusi yang disarankan: 1920x1080px (Landscape 16:9). Maks 5MB.</p>
            
            <div className="rounded-xl overflow-hidden bg-gray-100 border border-admin-border relative mb-4">
              <div className="aspect-[16/9] w-full flex items-center justify-center">
                {program.coverImageUrl ? (
                  <img src={getImageUrl(program.coverImageUrl)} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-300" />
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <input 
                type="file" 
                accept="image/*" 
                ref={coverInputRef} 
                className="hidden" 
                onChange={(e) => handleUploadCover(e.target.files?.[0] || null)}
              />
              <button
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingCover}
                className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 text-admin-dark text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-rpo-red hover:text-rpo-red transition-all disabled:opacity-50"
              >
                {uploadingCover ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                Ganti Foto Cover
              </button>
            </div>
          </div>

          {/* Documentation Photos (Drag and Drop Multi Upload) */}
          <div className="bg-white p-6 border border-admin-border rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-poppins font-semibold text-admin-dark">Foto Dokumentasi</h2>
                <p className="text-xs text-admin-secondary mt-0.5">Maks 5MB per file.</p>
              </div>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                {program.photos?.length || 0} Foto
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
                <div className="flex flex-col items-center text-admin-secondary pointer-events-none text-center">
                  <div className="p-3 bg-gray-100 rounded-full mb-3">
                    <UploadCloud className="w-6 h-6 text-gray-500" />
                  </div>
                  <span className="text-sm font-bold text-admin-dark mb-1">Drag & Drop ke sini</span>
                  <span className="text-[10px]">atau klik untuk memilih file</span>
                </div>
              )}
            </div>

            {/* Photo List */}
            <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {program.photos?.map((photo: any, index: number) => (
                <div key={photo.id} className="flex items-center gap-3 p-2 bg-gray-50 border border-admin-border rounded-lg group">
                  <div className="flex flex-col gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                    <button 
                      type="button"
                      onClick={() => movePhoto(index, 'up')} 
                      disabled={index === 0}
                      className="p-1 hover:bg-gray-200 rounded text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      ▲
                    </button>
                    <button 
                      type="button"
                      onClick={() => movePhoto(index, 'down')} 
                      disabled={index === program.photos.length - 1}
                      className="p-1 hover:bg-gray-200 rounded text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      ▼
                    </button>
                  </div>
                  
                  <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden shrink-0">
                    <img src={getImageUrl(photo.imageUrlThumb || photo.imageUrlFull)} alt="Dokumentasi" className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-400">Urutan {index + 1}</p>
                  </div>

                  <button 
                    type="button"
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {(!program.photos || program.photos.length === 0) && (
                <div className="text-center py-6 text-sm text-gray-400 font-medium">
                  Belum ada foto dokumentasi.
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}