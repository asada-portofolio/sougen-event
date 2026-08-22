import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Plus, Search, Loader2, AlertCircle, Trash2, Edit, Image as ImageIcon } from 'lucide-react';
import { getImageUrl } from '../../utils/getImageUrl';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';

const createCommunitySchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  category: z.string().optional(),
});
type CreateCommunityValues = z.infer<typeof createCommunitySchema>;

export default function AdminCommunityList() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateCommunityValues>({
    resolver: zodResolver(createCommunitySchema),
  });

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/communities');
      setCommunities(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/set-state-in-effect
    fetchCommunities();
  }, []);

  const handleCreate = async (data: CreateCommunityValues) => {
    setIsCreating(true);
    try {
      const res = await api.post('/api/communities', data);
      setCreateModalOpen(false);
      reset();
      navigate(`/admin/community/${res.data.id}`);
    } catch {
      alert('Gagal membuat komunitas baru');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus permanen komunitas ${name}?`)) return;
    try {
      await api.delete(`/api/communities/${id}`);
      fetchCommunities();
    } catch {
      alert('Gagal menghapus komunitas');
    }
  };

  const filteredCommunities = communities.filter(c => 
    !search || c.name.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-2xl md:text-3xl font-poppins font-bold text-admin-dark">Manajemen Komunitas</h1>
          <p className="text-sm text-admin-secondary mt-1">Kelola data komunitas dan foto dokumentasinya.</p>
        </div>
        <button 
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sougen-blue text-white font-medium rounded-lg hover:bg-sougen-blue/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Tambah Komunitas
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 border border-admin-border rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari nama komunitas..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
          />
        </div>
      </div>

      {/* Card List */}
      {filteredCommunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map(community => (
            <div key={community.id} className="bg-white border border-admin-border rounded-xl shadow-sm hover:shadow-md hover:border-sougen-blue/30 transition-all overflow-hidden flex flex-col">
              {/* Card Header (Logo & Info) */}
              <div className="p-5 flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0 border border-admin-border overflow-hidden flex items-center justify-center">
                  {community.logoUrl ? (
                    <img src={getImageUrl(community.logoUrl)} alt={community.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-poppins font-bold text-admin-dark text-lg truncate" title={community.name}>
                    {community.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-admin-secondary">
                    <span className="px-2 py-0.5 bg-gray-100 rounded-md font-medium truncate">
                      {community.category || 'Belum Kategori'}
                    </span>
                    {community.establishedYear && (
                      <span className="text-gray-400">• Est. {community.establishedYear}</span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {community.description || 'Belum ada deskripsi.'}
                  </p>
                </div>
              </div>

              {/* Strip Foto Dokumentasi */}
              <div className="px-5 pb-5">
                <h4 className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-2">Dokumentasi ({community.photos?.length || 0})</h4>
                <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                  {community.photos && community.photos.length > 0 ? (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    community.photos.map((photo: any) => (
                      <div key={photo.id} className="w-12 h-12 rounded-lg bg-gray-100 shrink-0 overflow-hidden border border-admin-border">
                        <img src={getImageUrl(photo.url)} alt={`Dokumentasi ${community.name}`} className="w-full h-full object-cover" />
                      </div>
                    ))
                  ) : (
                    <div className="w-full h-12 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-400">Belum ada foto</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-auto border-t border-admin-border bg-gray-50 p-3 flex justify-end gap-2">
                <button 
                  onClick={() => handleDelete(community.id, community.name)}
                  className="p-2 text-admin-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <Link 
                  to={`/admin/community/${community.id}`}
                  className="px-4 py-2 bg-white border border-admin-border text-admin-dark text-sm font-medium rounded-lg hover:bg-sougen-blue/5 hover:border-sougen-blue/40 hover:text-sougen-blue transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Komunitas
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-dashed border-gray-300 rounded-xl text-admin-secondary">
          <AlertCircle className="w-12 h-12 mb-3 text-gray-300" />
          <p className="text-sm font-medium">Tidak ada komunitas ditemukan</p>
        </div>
      )}

      {/* Create Modal */}
      <Dialog.Root open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[70] w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6">
            <Dialog.Title className="text-lg font-poppins font-bold text-admin-dark mb-4">Tambah Komunitas Baru</Dialog.Title>
            <form onSubmit={handleSubmit(handleCreate)}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-admin-dark mb-1">Nama Komunitas</label>
                  <input 
                    {...register('name')}
                    className="w-full px-3 py-2 border border-admin-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
                    placeholder="Contoh: Street Fighter Club"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-admin-dark mb-1">Kategori (Opsional)</label>
                  <input 
                    {...register('category')}
                    className="w-full px-3 py-2 border border-admin-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
                    placeholder="Contoh: Otomotif"
                  />
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