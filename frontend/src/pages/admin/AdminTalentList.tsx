import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Plus, Search, Loader2, AlertCircle, Trash2, Edit } from 'lucide-react';
import { getImageUrl } from '../../utils/getImageUrl';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';

const createTalentSchema = z.object({
  stageName: z.string().min(1, 'Nama wajib diisi'),
  tag: z.string().optional(),
});
type CreateTalentValues = z.infer<typeof createTalentSchema>;

export default function AdminTalentList() {
  const navigate = useNavigate();
  const [talents, setTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<'ALL' | 'GUEST' | 'PERFORMER' | 'UNASSIGNED'>('ALL');
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateTalentValues>({
    resolver: zodResolver(createTalentSchema),
  });

  const watchTag = watch('tag');
  const tagOptions = ["Cosplayer", "Musisi", "Band", "Influencer", "Juri", "MC / Master of Ceremony", "Guest Star"];
  const isCustomTag = watchTag !== undefined && watchTag !== '' && !tagOptions.includes(watchTag);
  const [showCustom, setShowCustom] = useState(false);

  const fetchTalents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/talents');
      setTalents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    fetchTalents();
  }, []);

  const handleCreate = async (data: CreateTalentValues) => {
    setIsCreating(true);
    try {
      const res = await api.post('/api/talents', data);
      setCreateModalOpen(false);
      reset();
      setShowCustom(false);
      navigate(`/admin/talent/${res.data.id}`);
    } catch (err) {
      alert('Gagal membuat talent baru');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus permanen talent ${name}?`)) return;
    try {
      await api.delete(`/api/talents/${id}`);
      fetchTalents();
    } catch (err) {
      alert('Gagal menghapus talent');
    }
  };

  const filteredTalents = talents.filter(t => {
    if (search && !t.stageName.toLowerCase().includes(search.toLowerCase())) return false;
    
    if (filterRole === 'ALL') return true;
    if (filterRole === 'UNASSIGNED') return !t.eventTalents || t.eventTalents.length === 0;
    
    // Check if talent has specific role in ANY event (since we just want a simple filter)
    return t.eventTalents?.some((et: any) => et.role === filterRole);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-rpo-red" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-poppins font-bold text-admin-dark">Manajemen Talent</h1>
          <p className="text-sm text-admin-secondary mt-1">Kelola data artis, guest star, dan performer.</p>
        </div>
        <button 
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-admin-dark text-white font-medium rounded-lg hover:bg-black transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Tambah Talent
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 border border-admin-border rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari nama talent..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rpo-red/20 focus:border-rpo-red"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto hide-scrollbar pb-1 md:pb-0">
          {(['ALL', 'GUEST', 'PERFORMER', 'UNASSIGNED'] as const).map(role => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                filterRole === role 
                  ? 'bg-red-50 text-rpo-red border-rpo-red border'
                  : 'bg-white text-admin-secondary border border-admin-border hover:bg-gray-50'
              }`}
            >
              {role === 'ALL' ? 'Semua' : role === 'UNASSIGNED' ? 'Belum Ada Event' : role}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredTalents.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {filteredTalents.map(talent => (
            <div key={talent.id} className="group relative bg-white border border-admin-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="aspect-[3/4] relative bg-gray-100 overflow-hidden">
                {talent.profileImageUrl ? (
                  <img src={getImageUrl(talent.profileImageUrl)} alt={talent.stageName} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    No Photo
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Link 
                    to={`/admin/talent/${talent.id}`}
                    className="p-2 bg-white rounded-full hover:scale-110 transition-transform text-admin-dark"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => handleDelete(talent.id, talent.stageName)}
                    className="p-2 bg-red-600 rounded-full hover:scale-110 transition-transform text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-3 border-t border-admin-border bg-white flex flex-col items-center text-center">
                <h3 className="font-poppins font-semibold text-admin-dark text-sm truncate w-full">{talent.stageName}</h3>
                {talent.tag && (
                  <span className="mt-1 px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded-md truncate w-full">
                    {talent.tag}
                  </span>
                )}
                <div className="mt-1.5 flex flex-wrap justify-center gap-1">
                  {talent.eventTalents?.length > 0 ? (
                    talent.eventTalents.slice(0, 2).map((et: any, idx: number) => (
                      <span key={idx} className="px-1.5 py-0.5 text-[10px] font-medium bg-red-50 text-rpo-red rounded-full">
                        {et.role}
                      </span>
                    ))
                  ) : (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-500 rounded-full">
                      Unassigned
                    </span>
                  )}
                  {(talent.eventTalents?.length || 0) > 2 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded-full">
                      +{talent.eventTalents.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-dashed border-gray-300 rounded-xl text-admin-secondary">
          <AlertCircle className="w-12 h-12 mb-3 text-gray-300" />
          <p className="text-sm font-medium">Tidak ada talent ditemukan</p>
        </div>
      )}

      {/* Create Modal */}
      <Dialog.Root open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[70] w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6">
            <Dialog.Title className="text-lg font-poppins font-bold text-admin-dark mb-4">Tambah Talent Baru</Dialog.Title>
            <form onSubmit={handleSubmit(handleCreate)}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-admin-dark mb-1">Nama Panggung / Grup</label>
                <input 
                  {...register('stageName')}
                  className="w-full px-3 py-2 border border-admin-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rpo-red/20 focus:border-rpo-red"
                  placeholder="Contoh: The Adams"
                />
                {errors.stageName && <p className="text-red-500 text-xs mt-1">{errors.stageName.message}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-admin-dark mb-1">Tag / Jenis Talent (Opsional)</label>
                {!showCustom && !isCustomTag ? (
                  <select 
                    className="w-full px-3 py-2 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rpo-red/20 focus:border-rpo-red appearance-none"
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
                      className="w-full px-3 py-2 border border-admin-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rpo-red/20 focus:border-rpo-red"
                    />
                    <button 
                      type="button" 
                      onClick={() => { 
                        setShowCustom(false); 
                        setValue('tag', ''); 
                      }} 
                      className="text-xs text-admin-secondary hover:text-rpo-red underline whitespace-nowrap px-1"
                    >
                      Batal
                    </button>
                  </div>
                )}
                {errors.tag && <p className="text-red-500 text-xs mt-1">{errors.tag.message}</p>}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Dialog.Close asChild>
                  <button type="button" className="px-4 py-2 text-sm font-medium text-admin-secondary hover:bg-gray-100 rounded-lg">Batal</button>
                </Dialog.Close>
                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="px-5 py-2 bg-rpo-red text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
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