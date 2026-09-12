import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, MapPin, Loader2, Save, FileText, CheckCircle2 } from 'lucide-react';
import { api } from '../../../services/api';

const updateSchema = z.object({
  name: z.string().min(3, 'Nama event minimal 3 karakter'),
  theme: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Pilih tanggal mulai'),
  endDate: z.string().min(1, 'Pilih tanggal selesai'),
  location: z.string().min(3, 'Lokasi wajib diisi'),
});

type UpdateValues = z.infer<typeof updateSchema>;

interface TabBasicInfoProps {
  eventData: any;
  onUpdate: (data: any) => void;
}

export default function TabBasicInfo({ eventData, onUpdate }: TabBasicInfoProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<UpdateValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      name: eventData?.name || '',
      theme: eventData?.theme || '',
      description: eventData?.description || '',
      startDate: eventData?.startDate ? eventData.startDate.split('T')[0] : '',
      endDate: eventData?.endDate ? eventData.endDate.split('T')[0] : '',
      location: eventData?.location || '',
    }
  });

  useEffect(() => {
    if (eventData) {
      reset({
        name: eventData.name || '',
        theme: eventData.theme || '',
        description: eventData.description || '',
        startDate: eventData.startDate ? eventData.startDate.split('T')[0] : '',
        endDate: eventData.endDate ? eventData.endDate.split('T')[0] : '',
        location: eventData.location || '',
      });
    }
  }, [eventData, reset]);

  const onSubmit = async (data: UpdateValues) => {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await api.put(`/api/events/${eventData.id}`, data);
      onUpdate(res.data);
      setMessage({ type: 'success', text: 'Informasi event berhasil disimpan.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Gagal menyimpan perubahan.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3500);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
      
      {/* Section 1: Identitas & Tema Acara */}
      <div className="bg-gray-50/50 border border-admin-border/80 rounded-2xl p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-admin-border/60">
          <FileText className="w-4 h-4 text-sougen-blue" />
          <h3 className="font-poppins font-bold text-sm sm:text-base text-admin-dark">
            Identitas & Narasi Acara
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div id="field-name" className="md:col-span-2 rounded-xl transition-all">
            <label className="block text-xs font-semibold text-admin-dark uppercase tracking-wider mb-1.5">
              Nama Event <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name')}
              type="text"
              placeholder="Contoh: Sougen Matsuri 2026"
              className="w-full px-4 py-2.5 border border-admin-border rounded-xl text-sm bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all font-medium"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div id="field-theme" className="md:col-span-2 rounded-xl transition-all">
            <label className="block text-xs font-semibold text-admin-dark uppercase tracking-wider mb-1.5">
              Tema / Tagline Event
            </label>
            <input
              {...register('theme')}
              type="text"
              placeholder="Contoh: The Ultimate Pop-Culture Festival"
              className="w-full px-4 py-2.5 border border-admin-border rounded-xl text-sm bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
            />
            {errors.theme && <p className="mt-1 text-xs text-red-500">{errors.theme.message}</p>}
          </div>

          <div id="field-description" className="md:col-span-2 rounded-xl transition-all">
            <label className="block text-xs font-semibold text-admin-dark uppercase tracking-wider mb-1.5">
              Deskripsi Lengkap Event
            </label>
            <textarea
              {...register('description')}
              rows={5}
              placeholder="Tuliskan deskripsi lengkap atau gambaran umum mengenai festival ini..."
              className="w-full px-4 py-3 border border-admin-border rounded-xl text-sm bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all resize-y leading-relaxed font-inter"
            />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
          </div>
        </div>
      </div>

      {/* Section 2: Jadwal & Lokasi */}
      <div className="bg-gray-50/50 border border-admin-border/80 rounded-2xl p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-admin-border/60">
          <MapPin className="w-4 h-4 text-sougen-blue" />
          <h3 className="font-poppins font-bold text-sm sm:text-base text-admin-dark">
            Waktu & Tempat Pelaksanaan
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div id="field-dates" className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 rounded-xl transition-all">
            <div>
              <label className="block text-xs font-semibold text-admin-dark uppercase tracking-wider mb-1.5">
                Tanggal Mulai <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('startDate')}
                  type="date"
                  className="w-full pl-10 pr-4 py-2.5 border border-admin-border rounded-xl text-sm bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all font-medium"
                />
              </div>
              {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-admin-dark uppercase tracking-wider mb-1.5">
                Tanggal Selesai <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('endDate')}
                  type="date"
                  className="w-full pl-10 pr-4 py-2.5 border border-admin-border rounded-xl text-sm bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all font-medium"
                />
              </div>
              {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate.message}</p>}
            </div>
          </div>

          <div id="field-location" className="md:col-span-2 rounded-xl transition-all">
            <label className="block text-xs font-semibold text-admin-dark uppercase tracking-wider mb-1.5">
              Lokasi / Venue Acara <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register('location')}
                type="text"
                placeholder="Contoh: Celebes Convention Center, Makassar"
                className="w-full pl-10 pr-4 py-2.5 border border-admin-border rounded-xl text-sm bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all font-medium"
              />
            </div>
            {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location.message}</p>}
          </div>
        </div>
      </div>

      {/* Save Action Bar */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          {message && (
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              {message.text}
            </span>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-sougen-blue text-white text-sm font-semibold rounded-xl hover:bg-sougen-blue/90 active:scale-[0.98] transition-all shadow-sm disabled:opacity-70 cursor-pointer"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan Perubahan
        </button>
      </div>
    </form>
  );
}
