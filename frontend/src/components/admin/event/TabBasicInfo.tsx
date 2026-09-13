import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, MapPin, Loader2, Save } from 'lucide-react';
import { api } from '../../../services/api';
import { getImageUrl } from '../../../utils/getImageUrl';

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

function formatDDMMYY(dateStrOrObj: string | Date): string {
  if (!dateStrOrObj) return '';
  const d = new Date(dateStrOrObj);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

export default function TabBasicInfo({ eventData, onUpdate }: TabBasicInfoProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<UpdateValues>({
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

  // Watch for live preview
  const wName = watch('name');
  const wTheme = watch('theme');
  const wStartDate = watch('startDate');
  const wEndDate = watch('endDate');
  const wLocation = watch('location');

  const onSubmit = async (data: UpdateValues) => {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await api.put(`/api/events/${eventData.id}`, data);
      onUpdate(res.data);
      setMessage({ type: 'success', text: 'Informasi berhasil disimpan.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Gagal menyimpan perubahan.' });
    } finally {
      setIsSaving(false);
      // clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Form Kiri */}
      <div className="xl:col-span-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div id="field-name" className="md:col-span-2 p-2 rounded-xl transition-all">
              <label className="block text-sm font-medium text-admin-dark mb-1">
                Nama Event <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-4 py-2.5 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div id="field-theme" className="md:col-span-2 p-2 rounded-xl transition-all">
              <label className="block text-sm font-medium text-admin-dark mb-1">
                Tema / Tagline
              </label>
              <input
                {...register('theme')}
                type="text"
                placeholder="Contoh: Bersama Membangun Negeri"
                className="w-full px-4 py-2.5 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
              />
              {errors.theme && <p className="mt-1 text-xs text-red-500">{errors.theme.message}</p>}
            </div>

            <div id="field-description" className="md:col-span-2 p-2 rounded-xl transition-all">
              <label className="block text-sm font-medium text-admin-dark mb-1">
                Deskripsi Event
              </label>
              <textarea
                {...register('description')}
                rows={4}
                placeholder="Tuliskan deskripsi lengkap atau gambaran umum mengenai event ini..."
                className="w-full px-4 py-2.5 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all resize-y"
              />
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <div id="field-dates" className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-2 rounded-xl transition-all">
              <div>
                <label className="block text-sm font-medium text-admin-dark mb-1">
                  Tanggal Mulai <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('startDate')}
                    type="date"
                    className="w-full pl-10 pr-4 py-2.5 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
                  />
                </div>
                {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-admin-dark mb-1">
                  Tanggal Selesai <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('endDate')}
                    type="date"
                    className="w-full pl-10 pr-4 py-2.5 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
                  />
                </div>
                {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate.message}</p>}
              </div>
            </div>

            <div id="field-location" className="md:col-span-2 p-2 rounded-xl transition-all">
              <label className="block text-sm font-medium text-admin-dark mb-1">
                Lokasi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('location')}
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
                />
              </div>
              {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location.message}</p>}
            </div>
          </div>

          <div className="pt-4 border-t border-admin-border flex items-center justify-between">
            <div>
              {message && (
                <span className={`text-sm font-medium ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {message.text}
                </span>
              )}
            </div>
            <button 
              type="submit" 
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-sougen-blue text-white text-sm font-medium rounded-lg hover:bg-sougen-blue/90 transition-colors shadow-sm disabled:opacity-70"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>

      {/* Preview Kanan */}
      <div className="hidden xl:block">
        <h3 className="text-sm font-poppins font-semibold text-admin-dark mb-4">Live Preview (Card)</h3>
        <div className="bg-white border border-admin-border rounded-xl overflow-hidden shadow-sm pointer-events-none opacity-90 scale-95 origin-top">
          <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
             {eventData.posterImageUrl ? (
                <img 
                  src={getImageUrl(eventData.posterImageUrl)} 
                  alt="Poster" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-gray-400">Belum ada poster</span>
              )}
          </div>
          <div className="p-5">
            <h4 className="font-poppins font-bold text-lg text-admin-dark mb-1 line-clamp-1">
              {wName || 'Nama Event'}
            </h4>
            <p className="text-sm text-admin-secondary mb-4 line-clamp-1">
              {wTheme || 'Tidak ada tema'}
            </p>
            <div className="space-y-2 mt-auto text-sm text-admin-secondary">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>
                  {wStartDate ? formatDDMMYY(wStartDate) : 'Mulai'} - {wEndDate ? formatDDMMYY(wEndDate) : 'Selesai'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="line-clamp-1">{wLocation || 'Lokasi'}</span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-admin-secondary text-center mt-4">
          Tampilan ini mensimulasikan kartu event yang muncul di halaman utama.
        </p>
      </div>
    </div>
  );
}
