import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { Loader2, Plus, Search, Trash2, AlertCircle } from 'lucide-react';
import { getImageUrl } from '../../../utils/getImageUrl';

interface TabTalentProps {
  eventData: any;
  onUpdate: (data: any) => void;
}

export default function TabTalent({ eventData, onUpdate }: TabTalentProps) {
  const [allTalents, setAllTalents] = useState<any[]>([]);
  const [loadingTalents, setLoadingTalents] = useState(true);
  const [search, setSearch] = useState('');
  

  const [addingId, setAddingId] = useState<number | null>(null);

  // Dapatkan daftar talent yang belum ditambahkan
  const existingTalentIds = eventData.eventTalents?.map((et: any) => et.talentId) || [];
  const availableTalents = allTalents.filter(t => !existingTalentIds.includes(t.id));
  
  const filteredAvailable = availableTalents.filter(t => 
    t.stageName?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        const res = await api.get('/api/talents');
        setAllTalents(res.data);
      } catch {
        console.error('Failed to load talents');
      } finally {
        setLoadingTalents(false);
      }
    };
    fetchTalents();
  }, []);

  const handleAddTalent = async (talentId: number) => {
    setAddingId(talentId);
    try {
      // POST /api/events/:eventId/talents -> requireAuth
      // Tunggu, route nya di index.ts: app.post('/api/events/:eventId/talents', requireAuth, talentController.linkToEvent);
      await api.post(`/api/events/${eventData.id}/talents`, { talentId, role: 'PERFORMER' });
      
      // Refresh event data to get updated eventTalents
      const res = await api.get(`/api/events/${eventData.slug}`);
      onUpdate(res.data);
    } catch {
      alert('Gagal menambahkan talent ke event.');
    } finally {
      setAddingId(null);
    }
  };

  const handleRemoveTalent = async (eventTalentId: number) => {
    if (!confirm('Hapus talent ini dari event?')) return;
    try {
      // DELETE /api/event-talents/:id
      await api.delete(`/api/event-talents/${eventTalentId}`);
      
      // Refresh event data
      const res = await api.get(`/api/events/${eventData.slug}`);
      onUpdate(res.data);
    } catch {
      alert('Gagal menghapus talent.');
    }
  };

  const handleUpdateRole = async (eventTalentId: number, roleOverride: string) => {
    try {
      await api.put(`/api/event-talents/${eventTalentId}`, { roleOverride });
      // Update local state is easier or fetch again
      const res = await api.get(`/api/events/${eventData.slug}`);
      onUpdate(res.data);
    } catch {
      alert('Gagal update peran.');
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Left: Event Talents List */}
      <div className="xl:col-span-2 space-y-6">
        <div>
          <h3 className="text-sm font-poppins font-semibold text-admin-dark">Talent Terpilih</h3>
          <p className="text-xs text-admin-secondary mt-1">Daftar talent yang akan tampil pada event ini.</p>
        </div>

        {eventData.eventTalents?.length > 0 ? (
          <div className="space-y-3">
            {eventData.eventTalents.map((et: any) => (
              <div key={et.id} className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 p-4 border border-admin-border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 order-1">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                    {et.talent.profileImageUrl ? (
                      <img src={getImageUrl(et.talent.profileImageUrl)} alt={et.talent.stageName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-poppins font-semibold text-admin-dark text-sm truncate">{et.talent.stageName}</h4>
                    <p className="text-xs text-admin-secondary truncate">{et.role}</p>
                  </div>
                </div>

                <div className="shrink-0 order-2 sm:order-3">
                  <button 
                    onClick={() => handleRemoveTalent(et.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    title="Hapus dari event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-full sm:w-auto order-3 sm:order-2 mt-1 sm:mt-0">
                  <input 
                    type="text" 
                    placeholder="Override Peran (Opsional)" 
                    defaultValue={et.roleOverride || ''}
                    onBlur={(e) => handleUpdateRole(et.id, e.target.value)}
                    className="w-full sm:w-auto px-3 py-1.5 text-xs border border-admin-border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rpo-red/20 focus:border-rpo-red"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
            <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-admin-dark">Belum ada talent yang ditambahkan</p>
            <p className="text-xs text-admin-secondary mt-1">Pilih talent dari panel di sebelah kanan.</p>
          </div>
        )}
      </div>

      {/* Right: Available Talents */}
      <div className="bg-gray-50 border border-admin-border rounded-xl p-5 h-[600px] flex flex-col">
        <h3 className="text-sm font-poppins font-semibold text-admin-dark mb-4">Master Data Talent</h3>
        
        <div className="relative mb-4 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari talent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-admin-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-rpo-red/20 focus:border-rpo-red"
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-2">
          {loadingTalents ? (
            <div className="flex items-center justify-center h-20">
              <Loader2 className="w-5 h-5 animate-spin text-admin-secondary" />
            </div>
          ) : filteredAvailable.length > 0 ? (
            filteredAvailable.map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 border border-admin-border rounded-lg bg-white hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0">
                    {t.profileImageUrl ? (
                      <img src={getImageUrl(t.profileImageUrl)} alt={t.stageName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-medium text-admin-dark text-sm leading-tight truncate">{t.stageName}</h5>
                  </div>
                </div>
                <button
                  onClick={() => handleAddTalent(t.id)}
                  disabled={addingId === t.id}
                  className="p-1.5 bg-admin-dark text-white rounded hover:bg-black transition-colors disabled:opacity-50 shrink-0 ml-2"
                >
                  {addingId === t.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-admin-secondary">
              Tidak ada talent ditemukan. Pastikan talent sudah dibuat di Modul Talent.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
