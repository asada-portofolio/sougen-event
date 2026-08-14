import { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { Plus, Edit, Trash2, GripVertical, Loader2, Save, Mail, MessageSquare, AtSign, Globe, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import * as Switch from '@radix-ui/react-switch';

const channelSchema = z.object({
  type: z.enum(['WA', 'EMAIL', 'IG', 'OTHER']),
  label: z.string().min(1, 'Label wajib diisi'),
  value: z.string().min(1, 'Nilai kontak wajib diisi'),
  url: z.string().optional(),
});
type ChannelValues = z.infer<typeof channelSchema>;

export default function AdminKontak() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [channels, setChannels] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);

  // Channels Modal State
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [editingChannelId, setEditingChannelId] = useState<number | null>(null);
  const [isSavingChannel, setIsSavingChannel] = useState(false);
  
  // Messages State
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);

  // Drag and drop refs for Channels
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ChannelValues>({
    resolver: zodResolver(channelSchema),
    defaultValues: {
      type: 'WA'
    }
  });
  const watchType = watch('type');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resChan, resMsg] = await Promise.all([
        api.get('/api/contact/channels'),
        api.get('/api/contact/messages'),
      ]);
      setChannels(resChan.data);
      setMessages(resMsg.data);
    } catch {
      alert('Gagal memuat data Kontak');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- CHANNELS LOGIC ---
  const openCreateChannelModal = () => {
    setEditingChannelId(null);
    reset({ type: 'WA', label: '', value: '', url: '' });
    setIsChannelModalOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openEditChannelModal = (chan: any) => {
    setEditingChannelId(chan.id);
    reset({ type: chan.type, label: chan.label, value: chan.value, url: chan.url || '' });
    setIsChannelModalOpen(true);
  };

  const onSubmitChannel = async (data: ChannelValues) => {
    setIsSavingChannel(true);
    try {
      if (editingChannelId) {
        await api.put(`/api/contact/channels/${editingChannelId}`, data);
      } else {
        await api.post('/api/contact/channels', {
          ...data,
          displayOrder: channels.length,
          isEmergencyContact: false,
        });
      }
      setIsChannelModalOpen(false);
      const res = await api.get('/api/contact/channels');
      setChannels(res.data);
    } catch {
      alert('Gagal menyimpan Kanal');
    } finally {
      setIsSavingChannel(false);
    }
  };

  const handleDeleteChannel = async (id: number) => {
    if (!confirm('Yakin ingin menghapus kanal kontak ini?')) return;
    try {
      await api.delete(`/api/contact/channels/${id}`);
      const res = await api.get('/api/contact/channels');
      setChannels(res.data);
    } catch {
      alert('Gagal menghapus kanal');
    }
  };

  const toggleEmergencyContact = async (id: number, currentVal: boolean) => {
    try {
      const newChannels = channels.map(c => c.id === id ? { ...c, isEmergencyContact: !currentVal } : c);
      setChannels(newChannels); // optimistic
      await api.put(`/api/contact/channels/${id}`, { isEmergencyContact: !currentVal });
    } catch {
      alert('Gagal mengubah status emergency');
      const res = await api.get('/api/contact/channels');
      setChannels(res.data);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragItem.current = index;
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget.parentNode as any);
  };
  const handleDragEnter = (_e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragOverItem.current = index;
  };
  const handleDragEnd = async () => {
    setIsDragging(false);
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const newList = [...channels];
      const dragged = newList[dragItem.current];
      newList.splice(dragItem.current, 1);
      newList.splice(dragOverItem.current, 0, dragged);
      
      dragItem.current = null;
      dragOverItem.current = null;
      setChannels(newList);
      try {
        await api.put('/api/contact/channels/reorder', { orderedIds: newList.map(f => f.id) });
      } catch {
        alert('Gagal mengurutkan Kanal');
        const res = await api.get('/api/contact/channels');
        setChannels(res.data);
      }
    } else {
      dragItem.current = null;
      dragOverItem.current = null;
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'WA': return <MessageSquare className="w-5 h-5 text-green-600" />;
      case 'EMAIL': return <Mail className="w-5 h-5 text-blue-600" />;
      case 'IG': return <AtSign className="w-5 h-5 text-pink-600" />;
      default: return <Globe className="w-5 h-5 text-gray-600" />;
    }
  };

  // --- MESSAGES LOGIC ---
  const selectedMessage = messages.find(m => m.id === selectedMessageId);

  const markAsRead = async (id: number) => {
    try {
      const newMsgs = messages.map(m => m.id === id ? { ...m, isRead: true } : m);
      setMessages(newMsgs);
      await api.put(`/api/contact/messages/${id}/read`);
    } catch {
      // ignore
    }
  };

  const handleSelectMessage = (msg: any) => {
    setSelectedMessageId(msg.id);
    if (!msg.isRead) {
      markAsRead(msg.id);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!confirm('Hapus pesan ini permanen?')) return;
    try {
      await api.delete(`/api/contact/messages/${id}`);
      if (selectedMessageId === id) setSelectedMessageId(null);
      const res = await api.get('/api/contact/messages');
      setMessages(res.data);
    } catch {
      alert('Gagal menghapus pesan');
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(d);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-rpo-red" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-poppins font-bold text-admin-dark">Kontak & Pesan</h1>
          <p className="text-sm text-admin-secondary mt-1">Kelola kanal komunikasi publik dan pesan masuk dari form hubungi kami.</p>
        </div>
      </div>

      <Tabs.Root defaultValue="channels" className="flex flex-col flex-1 min-h-0">
        <Tabs.List className="flex shrink-0 border-b border-admin-border mb-6">
          <Tabs.Trigger 
            value="channels" 
            className="px-5 py-3 font-medium text-sm text-admin-secondary data-[state=active]:text-rpo-red data-[state=active]:border-b-2 data-[state=active]:border-rpo-red transition-all outline-none"
          >
            Kanal Komunikasi
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="messages" 
            className="px-5 py-3 font-medium text-sm text-admin-secondary data-[state=active]:text-rpo-red data-[state=active]:border-b-2 data-[state=active]:border-rpo-red transition-all outline-none flex items-center gap-2"
          >
            Pesan Masuk
            {messages.filter(m => !m.isRead).length > 0 && (
              <span className="bg-rpo-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {messages.filter(m => !m.isRead).length}
              </span>
            )}
          </Tabs.Trigger>
        </Tabs.List>

        {/* --- CHANNELS TAB --- */}
        <Tabs.Content value="channels" className="outline-none flex-1">
          <div className="flex justify-end mb-4">
            <button 
              onClick={openCreateChannelModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-admin-dark text-white text-sm font-medium rounded-lg hover:bg-black transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Kanal
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {channels.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500 text-sm bg-white rounded-xl border border-dashed border-admin-border">
                Belum ada kanal komunikasi.
              </div>
            ) : (
              channels.map((chan, index) => (
                <div 
                  key={chan.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className={`bg-white border border-admin-border rounded-xl p-4 flex flex-col md:flex-row gap-4 transition-all ${isDragging ? 'opacity-90 shadow-lg scale-[1.02] z-10 relative' : 'hover:shadow-md'}`}
                >
                  <div className="cursor-move text-gray-400 hover:text-admin-dark self-center md:self-start pt-1 hidden md:block">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-gray-50 rounded-lg shrink-0">
                        {getIconForType(chan.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-poppins font-semibold text-admin-dark">{chan.label}</h3>
                          {chan.isEmergencyContact && (
                            <span className="flex items-center gap-1 text-[10px] font-bold bg-red-50 text-rpo-red px-2 py-0.5 rounded-full uppercase tracking-wider">
                              <AlertCircle className="w-3 h-3" /> Darurat
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-admin-dark mt-1">{chan.value}</p>
                        {chan.url && (
                          <a href={chan.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mt-1 truncate block max-w-[250px]">
                            {chan.url}
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch.Root
                          checked={chan.isEmergencyContact}
                          onCheckedChange={() => toggleEmergencyContact(chan.id, chan.isEmergencyContact)}
                          className="w-[36px] h-[20px] bg-gray-200 rounded-full relative data-[state=checked]:bg-rpo-red outline-none cursor-pointer transition-colors"
                        >
                          <Switch.Thumb className="block w-[16px] h-[16px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[18px]" />
                        </Switch.Root>
                        <span className="text-xs text-gray-500 font-medium cursor-default">Set as Emergency</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openEditChannelModal(chan)}
                          className="p-1.5 text-gray-400 hover:text-admin-dark hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteChannel(chan.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Tabs.Content>

        {/* --- MESSAGES TAB --- */}
        <Tabs.Content value="messages" className="outline-none flex-1 min-h-[500px]">
          <div className="bg-white rounded-xl shadow-sm border border-admin-border overflow-hidden flex h-full min-h-[500px]">
            
            {/* Inbox List (Left Panel) */}
            <div className={`w-full md:w-[35%] lg:w-[30%] border-r border-admin-border flex flex-col ${selectedMessageId ? 'hidden md:flex' : 'flex'}`}>
              <div className="p-4 border-b border-admin-border bg-gray-50 shrink-0">
                <h2 className="font-poppins font-semibold text-admin-dark">Kotak Masuk</h2>
                <p className="text-xs text-admin-secondary">{messages.length} Pesan</p>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                {messages.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-sm">Tidak ada pesan.</div>
                ) : (
                  messages.map(msg => (
                    <div 
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`p-4 border-b border-admin-border cursor-pointer transition-colors relative ${selectedMessageId === msg.id ? 'bg-red-50/50' : 'hover:bg-gray-50'} ${!msg.isRead ? 'bg-white' : 'bg-gray-50/30'}`}
                    >
                      {!msg.isRead && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-rpo-red"></div>
                      )}
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <h4 className={`text-sm truncate ${!msg.isRead ? 'font-bold text-admin-dark' : 'font-medium text-gray-700'}`}>
                          {msg.senderName}
                        </h4>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0 mt-0.5">
                          {new Date(msg.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${!msg.isRead ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                        {msg.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Message Detail (Right Panel) */}
            <div className={`flex-1 bg-white flex flex-col ${!selectedMessageId ? 'hidden md:flex' : 'flex'}`}>
              {!selectedMessage ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                  <Mail className="w-12 h-12 mb-3 text-gray-200" />
                  <p className="font-medium text-sm">Pilih pesan untuk membaca</p>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-admin-border shrink-0">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-xl font-poppins font-bold text-admin-dark mb-1">{selectedMessage.senderName}</h2>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-admin-secondary">
                          <a href={`mailto:${selectedMessage.senderEmail}`} className="hover:text-blue-600 hover:underline flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {selectedMessage.senderEmail}
                          </a>
                          {selectedMessage.senderPhone && (
                            <a href={`https://wa.me/${selectedMessage.senderPhone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="hover:text-green-600 hover:underline flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" /> {selectedMessage.senderPhone}
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-xs text-gray-400 text-right">
                          {formatDate(selectedMessage.createdAt)}
                        </div>
                        <button 
                          onClick={() => handleDeleteMessage(selectedMessage.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Pesan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 overflow-y-auto custom-scrollbar text-admin-dark text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Modal Dialog for Channels */}
      <Dialog.Root open={isChannelModalOpen} onOpenChange={setIsChannelModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[70] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <Dialog.Title className="text-lg font-poppins font-bold text-admin-dark mb-4">
              {editingChannelId ? 'Edit Kanal Kontak' : 'Tambah Kanal Baru'}
            </Dialog.Title>
            
            <form onSubmit={handleSubmit(onSubmitChannel)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-admin-dark mb-1">Tipe Kanal</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(['WA', 'EMAIL', 'IG', 'OTHER'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setValue('type', type)}
                      className={`py-2 px-3 flex flex-col items-center gap-2 rounded-lg border text-xs font-medium transition-colors ${
                        watchType === type ? 'border-rpo-red bg-red-50 text-rpo-red' : 'border-admin-border bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {getIconForType(type)}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-admin-dark mb-1">Label (Contoh: Sponsorship, General Inquiries)</label>
                <input 
                  {...register('label')}
                  className="w-full px-3 py-2 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rpo-red/20 focus:border-rpo-red"
                  placeholder="Contoh: Media Partner"
                />
                {errors.label && <p className="text-red-500 text-xs mt-1">{errors.label.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-admin-dark mb-1">Nilai / Teks (Contoh: 08123456789, email@domain.com)</label>
                <input 
                  {...register('value')}
                  className="w-full px-3 py-2 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rpo-red/20 focus:border-rpo-red"
                  placeholder="Isi teks yang akan ditampilkan..."
                />
                {errors.value && <p className="text-red-500 text-xs mt-1">{errors.value.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-admin-dark mb-1">URL / Link Tujuan (Opsional)</label>
                <input 
                  {...register('url')}
                  className="w-full px-3 py-2 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rpo-red/20 focus:border-rpo-red"
                  placeholder="Contoh: https://wa.me/628123456789"
                />
                {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url.message}</p>}
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <Dialog.Close asChild>
                  <button type="button" className="px-4 py-2 text-sm font-medium text-admin-secondary hover:bg-gray-100 rounded-lg transition-colors">
                    Batal
                  </button>
                </Dialog.Close>
                <button 
                  type="submit" 
                  disabled={isSavingChannel}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-rpo-red text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isSavingChannel ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
}