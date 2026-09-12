import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, MapPin, Loader2, Save } from 'lucide-react';
import { api } from '../../../services/api';

const updateSchema = z.object({
  name: z.string().min(3, 'Nama event minimal 3 karakter'),
  theme: z.string().optional(),
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

  const { register, handleSubmit, formState: { errors } } = useForm<UpdateValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      name: eventData.name,
      theme: eventData.theme || '',
      startDate: eventData.startDate.split('T')[0],
      endDate: eventData.endDate.split('T')[0],
      location: eventData.location,
    }
  });

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
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 pb-4 border-b border-admin-border">
        <h2 className="text-xl font-poppins font-bold text-admin-dark">Informasi Dasar Event</h2>
        <p className="text-sm text-admin-secondary mt-0.5">
          Perbarui nama event, tema, jadwal pelaksanaan, dan lokasi utama acara.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-admin-dark mb-1.5">
              Nama Event <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name')}
              type="text"
              placeholder="Contoh: Sougen Cosplay Festival 2026"
              className="w-full px-4 py-2.5 border border-admin-border rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
            />
            {errors.name && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.name.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-admin-dark mb-1.5">
              Tema / Tagline
            </label>
            <input
              {...register('theme')}
              type="text"
              placeholder="Contoh: The Ultimate Pop Culture Gathering"
              className="w-full px-4 py-2.5 border border-admin-border rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
            />
            {errors.theme && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.theme.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-admin-dark mb-1.5">
              Tanggal Mulai <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sougen-blue" />
              <input
                {...register('startDate')}
                type="date"
                className="w-full pl-10 pr-4 py-2.5 border border-admin-border rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
              />
            </div>
            {errors.startDate && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.startDate.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-admin-dark mb-1.5">
              Tanggal Selesai <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sougen-blue" />
              <input
                {...register('endDate')}
                type="date"
                className="w-full pl-10 pr-4 py-2.5 border border-admin-border rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
              />
            </div>
            {errors.endDate && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.endDate.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-admin-dark mb-1.5">
              Lokasi / Venue Acara <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sougen-blue" />
              <input
                {...register('location')}
                type="text"
                placeholder="Contoh: Phinisi Point Mall, Makassar"
                className="w-full pl-10 pr-4 py-2.5 border border-admin-border rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
              />
            </div>
            {errors.location && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.location.message}</p>}
          </div>
        </div>

        <div className="pt-6 border-t border-admin-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {message && (
              <span className={`text-sm font-semibold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 ${
                message.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message.text}
              </span>
            )}
          </div>
          <button 
            type="submit" 
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-sougen-blue text-white text-sm font-semibold rounded-xl hover:bg-sougen-blue/90 transition-all shadow-md shadow-sougen-blue/25 disabled:opacity-70 active:scale-95"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan Informasi
          </button>
        </div>
      </form>
    </div>
  );
}
