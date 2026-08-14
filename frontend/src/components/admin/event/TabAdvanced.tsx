import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../../services/api';
import * as Dialog from '@radix-ui/react-dialog';
import { HardDrive, Loader2, Save, AlertTriangle, Trash2 } from 'lucide-react';



const advancedSchema = z.object({
  googleDriveUrl: z.string().url('URL tidak valid').or(z.literal('')),
});

type AdvancedValues = z.infer<typeof advancedSchema>;

interface TabAdvancedProps {
  eventData: any;
  onUpdate: (data: any) => void;
}

export default function TabAdvanced({ eventData, onUpdate }: TabAdvancedProps) {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<AdvancedValues>({
    resolver: zodResolver(advancedSchema),
    defaultValues: {
      googleDriveUrl: eventData.googleDriveUrl || '',
    }
  });

  const onSubmit = async (data: AdvancedValues) => {
    setIsSaving(true);
    setMessage(null);
    try {
      const payload = {
        googleDriveUrl: data.googleDriveUrl || null,
      };
      const res = await api.put(`/api/events/${eventData.id}`, payload);
      onUpdate(res.data);
      setMessage({ type: 'success', text: 'Pengaturan lanjutan berhasil disimpan.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Gagal menyimpan pengaturan.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmText !== eventData.name) {
      alert('Nama event yang diketik tidak sesuai.');
      return;
    }
    
    setIsDeleting(true);
    try {
      await api.delete(`/api/events/${eventData.id}`);
      setDeleteModalOpen(false);
      navigate('/admin/event', { replace: true });
    } catch {
      alert('Gagal menghapus event.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-12 max-w-3xl">
      <section>
        <div className="mb-6">
          <h3 className="text-sm font-poppins font-semibold text-admin-dark">Tautan Eksternal</h3>
          <p className="text-xs text-admin-secondary mt-1">
            Pengaturan URL untuk pendaftaran dan dokumentasi.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-admin-dark mb-1">
              URL Google Drive (Kepanitiaan)
            </label>
            <div className="relative">
              <HardDrive className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register('googleDriveUrl')}
                type="text"
                placeholder="https://drive.google.com/..."
                className="w-full pl-10 pr-4 py-2.5 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rpo-red/20 focus:border-rpo-red transition-all"
              />
            </div>
            {errors.googleDriveUrl && <p className="mt-1 text-xs text-red-500">{errors.googleDriveUrl.message}</p>}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-admin-border">
            <div>
              {message && (
                <span className={`text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {message.text}
                </span>
              )}
            </div>
            <button 
              type="submit" 
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-admin-dark text-white text-sm font-medium rounded-lg hover:bg-black transition-colors shadow-sm disabled:opacity-70"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Simpan Tautan
            </button>
          </div>
        </form>
      </section>

      <hr className="border-admin-border" />

      <section>
        <div className="mb-6">
          <h3 className="text-sm font-poppins font-semibold text-red-600 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Danger Zone
          </h3>
          <p className="text-xs text-admin-secondary mt-1">
            Tindakan di area ini tidak dapat dibatalkan. Pastikan Anda berhati-hati.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-red-200 bg-red-50 rounded-xl gap-4">
          <div>
            <h4 className="font-semibold text-admin-dark text-sm">Hapus Event</h4>
            <p className="text-xs text-admin-secondary mt-1 max-w-sm">
              Menghapus event akan menghapus semua relasi, rundown, dan foto galeri terkait event ini dari sistem secara permanen.
            </p>
          </div>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="shrink-0 px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors shadow-sm"
          >
            Hapus Event
          </button>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      <Dialog.Root open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[70] w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6">
            <div className="flex items-center gap-4 mb-5 text-red-600">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <Dialog.Title className="font-poppins font-bold text-lg text-admin-dark">
                Hapus Permanen?
              </Dialog.Title>
            </div>

            <p className="text-sm text-admin-secondary mb-4">
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus permanen 
              event <span className="font-semibold text-admin-dark">{eventData.name}</span> beserta seluruh datanya.
            </p>

            <div className="mb-6">
              <label className="block text-xs font-medium text-admin-dark mb-2">
                Ketik <span className="font-bold select-all">{eventData.name}</span> untuk mengonfirmasi.
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full px-3 py-2 border border-admin-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Dialog.Close asChild>
                <button 
                  type="button" 
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-admin-secondary hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
              </Dialog.Close>
              <button 
                onClick={handleDelete}
                disabled={isDeleting || deleteConfirmText !== eventData.name}
                className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Ya, Hapus
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
}
