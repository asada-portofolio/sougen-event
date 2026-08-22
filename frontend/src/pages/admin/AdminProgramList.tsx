import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Plus, Search, Loader2, AlertCircle, Trash2, Edit, Image as ImageIcon } from 'lucide-react';
import { getImageUrl } from '../../utils/getImageUrl';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';

const createProgramSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
});
type CreateProgramValues = z.infer<typeof createProgramSchema>;

export default function AdminProgramList() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateProgramValues>({
    resolver: zodResolver(createProgramSchema),
  });

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/programs');
      setPrograms(res.data);
    } catch {
      console.error('Failed to fetch programs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/set-state-in-effect
    fetchPrograms();
  }, []);

  const handleCreate = async (data: CreateProgramValues) => {
    setIsCreating(true);
    try {
      const res = await api.post('/api/programs', data);
      setCreateModalOpen(false);
      reset();
      navigate(`/admin/programs/${res.data.id}`);
    } catch {
      alert('Gagal membuat program baru');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus permanen program ${name}?`)) return;
    try {
      await api.delete(`/api/programs/${id}`);
      fetchPrograms();
    } catch {
      alert('Gagal menghapus program');
    }
  };

  const filteredPrograms = programs.filter(p => 
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-sougen-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-poppins font-bold text-admin-dark">Manajemen Program</h1>
          <p className="text-sm text-admin-secondary mt-1">Kelola data program kegiatan Sougen.</p>
        </div>
        <button 
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sougen-blue text-white font-medium rounded-lg hover:bg-sougen-blue/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Tambah Program
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 border border-admin-border rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari nama program..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
          />
        </div>
      </div>

      {/* Card List */}
      {filteredPrograms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPrograms.map(program => (
            <div key={program.id} className="bg-white border border-admin-border rounded-xl shadow-sm hover:shadow-md hover:border-sougen-blue/30 transition-all overflow-hidden flex flex-col">
              {/* Cover Photo */}
              <div className="h-40 relative bg-gray-100 flex items-center justify-center overflow-hidden border-b border-admin-border">
                {program.coverImageUrl ? (
                  <img src={getImageUrl(program.coverImageUrl)} alt={program.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-gray-300" />
                )}
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-poppins font-bold text-admin-dark text-lg line-clamp-2" title={program.name}>
                  {program.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500 line-clamp-3 flex-1">
                  {program.description || 'Belum ada deskripsi.'}
                </p>
                <div className="mt-4 flex items-center justify-end text-xs text-gray-400">
                  <span>{program.photos?.length || 0} Foto Docs</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="border-t border-admin-border bg-gray-50 p-3 flex justify-between gap-2">
                <button 
                  onClick={() => handleDelete(program.id, program.name)}
                  className="p-2 text-admin-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <Link 
                  to={`/admin/programs/${program.id}`}
                  className="px-4 py-2 bg-white border border-admin-border text-admin-dark text-sm font-medium rounded-lg hover:bg-sougen-blue/5 hover:border-sougen-blue/40 hover:text-sougen-blue transition-colors flex items-center gap-2 flex-1 justify-center"
                >
                  <Edit className="w-4 h-4" />
                  Edit Program
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-dashed border-gray-300 rounded-xl text-admin-secondary">
          <AlertCircle className="w-12 h-12 mb-3 text-gray-300" />
          <p className="text-sm font-medium">Tidak ada program ditemukan</p>
        </div>
      )}

      {/* Create Modal */}
      <Dialog.Root open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[70] w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6">
            <Dialog.Title className="text-lg font-poppins font-bold text-admin-dark mb-4">Tambah Program Baru</Dialog.Title>
            <form onSubmit={handleSubmit(handleCreate)}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-admin-dark mb-1">Nama Program</label>
                  <input 
                    {...register('name')}
                    className="w-full px-3 py-2 border border-admin-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
                    placeholder="Contoh: Sougen Mini Competition"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Dialog.Close asChild>
                  <button type="button" className="px-4 py-2 text-sm font-medium text-admin-secondary hover:bg-gray-100 rounded-lg">Batal</button>
                </Dialog.Close>
                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="px-5 py-2 bg-sougen-blue text-white text-sm font-medium rounded-lg hover:bg-sougen-blue/90 shadow-sm disabled:opacity-50"
                >
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Buat & Lanjut Edit'}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
}