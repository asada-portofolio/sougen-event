import { useState } from 'react';
import { api } from '../../../services/api';
import { Loader2, Plus, Trash2, CalendarDays, Clock, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

interface TabRundownProps {
  eventData: any;
  onUpdate: (data: any) => void;
}

export default function TabRundown({ eventData, onUpdate }: TabRundownProps) {
  const [loading, setLoading] = useState(false);
  const [dayModalOpen, setDayModalOpen] = useState(false);
  const [newDayData, setNewDayData] = useState({ dayNumber: 1, date: '', locationOverride: '' });

  const [rundownModalOpen, setRundownModalOpen] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null);
  const [newRundown, setNewRundown] = useState({
    timeStart: '',
    timeEnd: '',
    activityType: 'manual',
    activityName: '',
  });

  const eventDays = eventData.eventDays || [];

  const handleAddDay = async () => {
    if (!newDayData.date) {
      alert('Tanggal wajib diisi.');
      return;
    }
    setLoading(true);
    try {
      await api.post(`/api/events/${eventData.id}/days`, {
        dayNumber: Number(newDayData.dayNumber),
        date: newDayData.date,
        locationOverride: newDayData.locationOverride || undefined
      });
      const res = await api.get(`/api/events/${eventData.slug}`);
      onUpdate(res.data);
      setDayModalOpen(false);
      setNewDayData({ dayNumber: eventDays.length + 2, date: '', locationOverride: '' });
    } catch {
      alert('Gagal menambah hari.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDay = async (dayId: number) => {
    if (!confirm('Hapus hari ini beserta semua rundown di dalamnya?')) return;
    try {
      await api.delete(`/api/event-days/${dayId}`);
      const res = await api.get(`/api/events/${eventData.slug}`);
      onUpdate(res.data);
    } catch {
      alert('Gagal menghapus hari.');
    }
  };

  const openRundownModal = (dayId: number) => {
    setSelectedDayId(dayId);
    setNewRundown({
      timeStart: '',
      timeEnd: '',
      activityType: 'manual',
      activityName: '',
    });
    setRundownModalOpen(true);
  };

  const handleSubmitRundown = async () => {
    if (!selectedDayId) return;
    if (!newRundown.timeStart || !newRundown.timeEnd) {
      alert('Waktu mulai dan selesai wajib diisi.');
      return;
    }
    if (!newRundown.activityName) {
      alert('Nama aktivitas / pengisi acara wajib diisi.');
      return;
    }

    const time = `${newRundown.timeStart} - ${newRundown.timeEnd}`;
    setLoading(true);
    try {
      await api.post(`/api/event-days/${selectedDayId}/rundown`, { time, activityName: newRundown.activityName });
      const res = await api.get(`/api/events/${eventData.slug}`);
      onUpdate(res.data);
      setRundownModalOpen(false);
    } catch {
      alert('Gagal menambah rundown.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRundown = async (rundownId: number) => {
    if (!confirm('Hapus rundown ini?')) return;
    try {
      await api.delete(`/api/rundown/${rundownId}`);
      const res = await api.get(`/api/events/${eventData.slug}`);
      onUpdate(res.data);
    } catch {
      alert('Gagal menghapus rundown.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-poppins font-semibold text-admin-dark">Manajemen Rundown</h3>
          <p className="text-xs text-admin-secondary mt-1">Atur jadwal kegiatan per hari.</p>
        </div>
        <button
          onClick={() => {
            setNewDayData(prev => ({ ...prev, dayNumber: eventDays.length + 1 }));
            setDayModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sougen-blue text-white text-sm font-medium rounded-lg hover:bg-sougen-blue/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Hari
        </button>
      </div>

      {eventDays.length > 0 ? (
        <div className="space-y-6">
          {eventDays.map((day: any) => (
            <div key={day.id} className="border border-admin-border rounded-xl bg-gray-50 overflow-hidden">
              {/* Day Header */}
              <div className="flex items-center justify-between bg-white border-b border-admin-border p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sougen-blue/10 flex items-center justify-center text-sougen-blue font-bold font-poppins shrink-0">
                    H{day.dayNumber}
                  </div>
                  <div>
                    <h4 className="font-semibold text-admin-dark text-sm">
                      {new Date(day.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </h4>
                    {day.locationOverride && (
                      <p className="text-xs text-admin-secondary mt-0.5">📍 {day.locationOverride}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openRundownModal(day.id)}
                    className="p-1.5 text-sougen-blue hover:bg-sougen-blue/10 rounded font-medium text-xs flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Item
                  </button>
                  <button
                    onClick={() => handleDeleteDay(day.id)}
                    className="p-1.5 text-admin-secondary hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Rundown Items */}
              <div className="p-4 space-y-2">
                {day.rundownItems?.length > 0 ? (
                  day.rundownItems.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-admin-border rounded-lg shadow-sm group">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-admin-dark font-mono font-medium text-sm bg-gray-100 px-2 py-1 rounded">
                          <Clock className="w-3.5 h-3.5 text-admin-secondary" />
                          {item.time}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-admin-dark">{item.activityName}</p>
                          {item.location && <p className="text-[10px] text-admin-secondary mt-0.5">{item.location}</p>}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteRundown(item.id)}
                        className="p-1.5 text-admin-secondary hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-admin-secondary text-center py-4">Belum ada rundown untuk hari ini.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50">
          <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-poppins font-semibold text-admin-dark text-lg mb-2">Belum ada Jadwal</h3>
          <p className="text-sm text-admin-secondary max-w-sm mx-auto">
            Klik tombol "Tambah Hari" di kanan atas untuk mulai membuat jadwal kegiatan event.
          </p>
        </div>
      )}

      <Dialog.Root open={dayModalOpen} onOpenChange={setDayModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-all" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[70] w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <Dialog.Title className="font-poppins font-semibold text-lg text-admin-dark">Tambah Hari</Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-1.5 rounded hover:bg-gray-100"><X className="w-5 h-5 text-admin-secondary" /></button>
              </Dialog.Close>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-admin-dark">Hari Ke-</label>
                <input 
                  type="number" 
                  value={newDayData.dayNumber}
                  onChange={e => setNewDayData({...newDayData, dayNumber: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-admin-border rounded-lg bg-gray-50 text-admin-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-admin-dark">Tanggal</label>
                <input 
                  type="date" 
                  value={newDayData.date}
                  onChange={e => setNewDayData({...newDayData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-admin-border rounded-lg bg-gray-50 text-admin-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-admin-dark">Lokasi Khusus (Opsional)</label>
                <input 
                  type="text" 
                  value={newDayData.locationOverride}
                  onChange={e => setNewDayData({...newDayData, locationOverride: e.target.value})}
                  placeholder="Isi jika berbeda dari lokasi utama event"
                  className="w-full px-3 py-2 border border-admin-border rounded-lg bg-gray-50 text-admin-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue text-sm"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 text-sm font-medium text-admin-secondary hover:bg-gray-100 rounded-lg">Batal</button>
                </Dialog.Close>
                <button 
                  onClick={handleAddDay}
                  disabled={loading}
                  className="px-5 py-2 bg-sougen-blue text-white text-sm font-medium rounded-lg hover:bg-sougen-blue/90 shadow-sm disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan'}
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Modal Tambah Rundown Item */}
      <Dialog.Root open={rundownModalOpen} onOpenChange={setRundownModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-all" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[70] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <Dialog.Title className="font-poppins font-semibold text-lg text-admin-dark">Tambah Rundown</Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-1.5 rounded hover:bg-gray-100"><X className="w-5 h-5 text-admin-secondary" /></button>
              </Dialog.Close>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-admin-dark">Waktu Mulai</label>
                  <input 
                    type="time" 
                    value={newRundown.timeStart}
                    onChange={e => setNewRundown({...newRundown, timeStart: e.target.value})}
                    className="w-full px-3 py-2 border border-admin-border rounded-lg bg-gray-50 text-admin-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-admin-dark">Waktu Selesai</label>
                  <input 
                    type="time" 
                    value={newRundown.timeEnd}
                    onChange={e => setNewRundown({...newRundown, timeEnd: e.target.value})}
                    className="w-full px-3 py-2 border border-admin-border rounded-lg bg-gray-50 text-admin-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-admin-dark">Jenis Aktivitas</label>
                <select 
                  value={newRundown.activityType}
                  onChange={e => setNewRundown({...newRundown, activityType: e.target.value, activityName: ''})}
                  className="w-full px-3 py-2 border border-admin-border rounded-lg bg-gray-50 text-admin-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue text-sm"
                >
                  <option value="manual">Ketik Manual</option>
                  {eventData.eventPrograms?.length > 0 && <option value="program">Program Event Terpilih</option>}
                  {eventData.eventTalents?.length > 0 && <option value="talent">Talent / Pengisi Acara</option>}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-admin-dark">Nama Aktivitas</label>
                {newRundown.activityType === 'manual' && (
                  <input 
                    type="text" 
                    placeholder="Contoh: Registrasi Ulang"
                    value={newRundown.activityName}
                    onChange={e => setNewRundown({...newRundown, activityName: e.target.value})}
                    className="w-full px-3 py-2 border border-admin-border rounded-lg bg-gray-50 text-admin-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue text-sm"
                  />
                )}
                {newRundown.activityType === 'program' && (
                  <select 
                    value={newRundown.activityName}
                    onChange={e => setNewRundown({...newRundown, activityName: e.target.value})}
                    className="w-full px-3 py-2 border border-admin-border rounded-lg bg-gray-50 text-admin-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue text-sm"
                  >
                    <option value="" disabled>-- Pilih Program --</option>
                    {eventData.eventPrograms.map((ep: any) => (
                      <option key={ep.id} value={ep.program.name}>{ep.program.name}</option>
                    ))}
                  </select>
                )}
                {newRundown.activityType === 'talent' && (
                  <select 
                    value={newRundown.activityName}
                    onChange={e => setNewRundown({...newRundown, activityName: e.target.value})}
                    className="w-full px-3 py-2 border border-admin-border rounded-lg bg-gray-50 text-admin-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue text-sm"
                  >
                    <option value="" disabled>-- Pilih Talent --</option>
                    {eventData.eventTalents.map((et: any) => (
                      <option key={et.id} value={`Penampilan: ${et.talent.stageName}`}>
                        {et.talent.stageName} {et.roleOverride || et.role ? `(${et.roleOverride || et.role})` : ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 text-sm font-medium text-admin-secondary hover:bg-gray-100 rounded-lg">Batal</button>
                </Dialog.Close>
                <button 
                  onClick={handleSubmitRundown}
                  disabled={loading}
                  className="px-5 py-2 bg-sougen-blue text-white text-sm font-medium rounded-lg hover:bg-sougen-blue/90 shadow-sm disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Rundown'}
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
