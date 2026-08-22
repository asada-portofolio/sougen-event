import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { Loader2, Plus, Search, Trash2, AlertCircle, Link as LinkIcon, Save, Check } from 'lucide-react';
import { getImageUrl } from '../../../utils/getImageUrl';

function ProgramRow({ ep, onRemove, onUpdate }: { ep: any, onRemove: (id: number) => void, onUpdate: (data: any) => void }) {
  const [url, setUrl] = useState(ep.registrationUrl || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveUrl = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await api.put(`/api/event-programs/${ep.id}`, { registrationUrl: url || null });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onUpdate(res.data);
    } catch {
      alert('Gagal menyimpan URL pendaftaran');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 border border-admin-border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="w-16 h-12 rounded bg-gray-100 shrink-0 border border-gray-200 overflow-hidden">
            {ep.program.coverImageUrl ? (
              <img src={getImageUrl(ep.program.coverImageUrl)} alt={ep.program.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-400">No Img</div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-poppins font-semibold text-admin-dark text-sm truncate">{ep.program.name}</h4>
            <p className="text-xs text-admin-secondary mt-0.5 truncate">{ep.program.description}</p>
          </div>
        </div>

        <div className="shrink-0">
          <button 
            onClick={() => onRemove(ep.id)}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
            title="Hapus dari event"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Input URL Pendaftaran */}
      <div className="pl-0 sm:pl-[76px] mt-1">
        <label className="block text-[11px] font-medium text-admin-secondary mb-1">
          URL Pendaftaran Spesifik (Opsional)
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <LinkIcon className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://forms.gle/..."
              className="w-full pl-8 pr-3 py-1.5 border border-admin-border rounded-lg text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
            />
          </div>
          <button
            onClick={handleSaveUrl}
            disabled={saving || url === ep.registrationUrl}
            className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
              saved 
                ? 'bg-emerald-100 text-emerald-700'
                : url !== ep.registrationUrl
                  ? 'bg-sougen-blue text-white hover:bg-sougen-blue/90 shadow-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            title="Simpan Tautan"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

interface TabProgramProps {
  eventData: any;
  onUpdate: (data: any) => void;
}

export default function TabProgram({ eventData, onUpdate }: TabProgramProps) {
  const [allPrograms, setAllPrograms] = useState<any[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [search, setSearch] = useState('');
  
  const [addingId, setAddingId] = useState<number | null>(null);

  const existingProgramIds = eventData.eventPrograms?.map((ep: any) => ep.programId) || [];
  const availablePrograms = allPrograms.filter(p => !existingProgramIds.includes(p.id));
  
  const filteredAvailable = availablePrograms.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await api.get('/api/programs');
        setAllPrograms(res.data);
      } catch {
        console.error('Failed to load programs');
      } finally {
        setLoadingPrograms(false);
      }
    };
    fetchPrograms();
  }, []);

  const handleAddProgram = async (programId: number) => {
    setAddingId(programId);
    try {
      await api.post(`/api/events/${eventData.id}/programs`, { programId });
      
      const res = await api.get(`/api/events/${eventData.slug}`);
      onUpdate(res.data);
    } catch {
      alert('Gagal menambahkan program ke event.');
    } finally {
      setAddingId(null);
    }
  };

  const handleRemoveProgram = async (eventProgramId: number) => {
    if (!confirm('Hapus program ini dari event?')) return;
    try {
      await api.delete(`/api/event-programs/${eventProgramId}`);
      
      const res = await api.get(`/api/events/${eventData.slug}`);
      onUpdate(res.data);
    } catch {
      alert('Gagal menghapus program.');
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Left: Event Programs List */}
      <div className="xl:col-span-2 space-y-6">
        <div>
          <h3 className="text-sm font-poppins font-semibold text-admin-dark">Program Terpilih</h3>
          <p className="text-xs text-admin-secondary mt-1">Program/aktivitas yang akan diselenggarakan pada event ini.</p>
        </div>

        {eventData.eventPrograms?.length > 0 ? (
          <div className="space-y-3">
            {eventData.eventPrograms.map((ep: any) => (
              <ProgramRow 
                key={ep.id} 
                ep={ep} 
                onRemove={handleRemoveProgram} 
                onUpdate={async () => {
                  const res = await api.get(`/api/events/${eventData.slug}`);
                  onUpdate(res.data);
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
            <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-admin-dark">Belum ada program yang ditambahkan</p>
            <p className="text-xs text-admin-secondary mt-1">Pilih program dari panel di sebelah kanan.</p>
          </div>
        )}
      </div>

      {/* Right: Available Programs */}
      <div className="bg-gray-50 border border-admin-border rounded-xl p-5 h-[600px] flex flex-col">
        <h3 className="text-sm font-poppins font-semibold text-admin-dark mb-4">Master Data Program</h3>
        
        <div className="relative mb-4 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari program..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-admin-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-2">
          {loadingPrograms ? (
            <div className="flex items-center justify-center h-20">
              <Loader2 className="w-5 h-5 animate-spin text-admin-secondary" />
            </div>
          ) : filteredAvailable.length > 0 ? (
            filteredAvailable.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 border border-admin-border rounded-lg bg-white hover:border-sougen-blue/40 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 shrink-0">
                    {p.coverImageUrl ? (
                      <img src={getImageUrl(p.coverImageUrl)} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-medium text-admin-dark text-sm leading-tight truncate">{p.name}</h5>
                  </div>
                </div>
                <button
                  onClick={() => handleAddProgram(p.id)}
                  disabled={addingId === p.id}
                  className="p-1.5 bg-sougen-blue text-white rounded hover:bg-sougen-blue/90 shadow-sm transition-colors disabled:opacity-50 shrink-0 ml-2"
                >
                  {addingId === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-admin-secondary">
              Tidak ada program ditemukan. Pastikan program sudah dibuat di Modul Program.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
