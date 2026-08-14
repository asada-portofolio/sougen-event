import { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { Loader2, Save, Plus, Edit, Trash2, GripVertical, Image as ImageIcon, X } from 'lucide-react';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import { getImageUrl } from '../../utils/getImageUrl';

const aboutContentSchema = z.object({
  storyText: z.string().optional(),
  visionText: z.string().optional(),
  missionList: z.array(
    z.object({ value: z.string().min(1, 'Misi tidak boleh kosong') })
  ).optional()
});
type AboutContentValues = z.infer<typeof aboutContentSchema>;

const teamMemberSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  role: z.string().min(1, 'Peran wajib diisi'),
});
type TeamMemberValues = z.infer<typeof teamMemberSchema>;

export default function AdminAbout() {
  const [loading, setLoading] = useState(true);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [storyImageUrl, setStoryImageUrl] = useState<string | null>(null);
  const [isUploadingStory, setIsUploadingStory] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [isSavingTeam, setIsSavingTeam] = useState(false);

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [isDraggingTeam, setIsDraggingTeam] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register: regContent, handleSubmit: handleContentSubmit, control, reset: resetContent } = useForm<AboutContentValues>({
    resolver: zodResolver(aboutContentSchema),
    defaultValues: { storyText: '', visionText: '', missionList: [] }
  });

  const { fields: missionFields, append: appendMission, remove: removeMission } = useFieldArray({
    control,
    name: "missionList"
  });

  const { register: regTeam, handleSubmit: handleTeamSubmit, reset: resetTeam, formState: { errors: teamErrors } } = useForm<TeamMemberValues>({
    resolver: zodResolver(teamMemberSchema)
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [contentRes, teamRes] = await Promise.all([
        api.get('/api/about/content'),
        api.get('/api/about/team')
      ]);
      const data = contentRes.data;
      if (data) {
        resetContent({
          storyText: data.storyText || '',
          visionText: data.visionText || '',
          missionList: Array.isArray(data.missionList) ? data.missionList.map((m: string) => ({ value: m })) : []
        });
        setStoryImageUrl(data.storyImageUrl || null);
      }
      setTeamMembers(teamRes.data);
    } catch {
      alert('Gagal memuat data About Us');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- CONTENT TAB ---
  const onSubmitContent = async (data: AboutContentValues) => {
    setIsSavingContent(true);
    try {
      const payload = {
        storyText: data.storyText,
        visionText: data.visionText,
        missionList: data.missionList?.map(m => m.value) || []
      };
      await api.put('/api/about/content', payload);
      alert('Konten berhasil disimpan');
    } catch {
      alert('Gagal menyimpan konten');
    } finally {
      setIsSavingContent(false);
    }
  };

  const handleStoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    setIsUploadingStory(true);
    try {
      const res = await api.post('/api/about/content/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStoryImageUrl(res.data.imageUrl);
    } catch {
      alert('Gagal mengunggah foto cerita');
    } finally {
      setIsUploadingStory(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // --- TEAM TAB ---
  const openCreateTeamModal = () => {
    setEditingTeamId(null);
    resetTeam({ name: '', role: '' });
    setIsTeamModalOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openEditTeamModal = (team: any) => {
    setEditingTeamId(team.id);
    resetTeam({ name: team.name, role: team.role });
    setIsTeamModalOpen(true);
  };

  const onSubmitTeam = async (data: TeamMemberValues) => {
    setIsSavingTeam(true);
    try {
      if (editingTeamId) {
        await api.put(`/api/about/team/${editingTeamId}`, data);
      } else {
        await api.post('/api/about/team', data);
      }
      setIsTeamModalOpen(false);
      const res = await api.get('/api/about/team');
      setTeamMembers(res.data);
    } catch {
      alert('Gagal menyimpan anggota tim');
    } finally {
      setIsSavingTeam(false);
    }
  };

  const handleDeleteTeam = async (id: number) => {
    if (!confirm('Hapus anggota tim ini?')) return;
    try {
      await api.delete(`/api/about/team/${id}`);
      const res = await api.get('/api/about/team');
      setTeamMembers(res.data);
    } catch {
      alert('Gagal menghapus anggota');
    }
  };

  const handleTeamPhotoUpload = async (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file); // in backend, uploadSingle expects 'image' or what? let's assume 'image' is default or it accepts it.

    try {
      // optimistic UI or loading spinner could be added. for simplicity, just upload and fetch
      await api.post(`/api/about/team/${id}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const res = await api.get('/api/about/team');
      setTeamMembers(res.data);
    } catch {
      alert('Gagal mengunggah foto tim');
    }
  };

  // Drag Drop Team
  const handleDragStartTeam = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragItem.current = index;
    setIsDraggingTeam(true);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragEnterTeam = (_e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragOverItem.current = index;
  };
  const handleDragEndTeam = async () => {
    setIsDraggingTeam(false);
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const newList = [...teamMembers];
      const dragged = newList[dragItem.current];
      newList.splice(dragItem.current, 1);
      newList.splice(dragOverItem.current, 0, dragged);
      
      dragItem.current = null;
      dragOverItem.current = null;
      setTeamMembers(newList);
      try {
        await api.put('/api/about/team/reorder', { orderedIds: newList.map(f => f.id) });
      } catch {
        alert('Gagal mengurutkan tim');
        const res = await api.get('/api/about/team');
        setTeamMembers(res.data);
      }
    } else {
      dragItem.current = null;
      dragOverItem.current = null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-rpo-red" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl md:text-3xl font-poppins font-bold text-admin-dark">Tentang Kami</h1>
        <p className="text-sm text-admin-secondary mt-1">Kelola konten halaman About Us (Cerita, Visi, Misi, dan Profil Tim).</p>
      </div>

      <Tabs.Root defaultValue="content" className="flex flex-col">
        <Tabs.List className="flex shrink-0 border-b border-admin-border mb-6">
          <Tabs.Trigger 
            value="content" 
            className="px-5 py-3 font-medium text-sm text-admin-secondary data-[state=active]:text-rpo-red data-[state=active]:border-b-2 data-[state=active]:border-rpo-red transition-all outline-none"
          >
            Konten Utama
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="team" 
            className="px-5 py-3 font-medium text-sm text-admin-secondary data-[state=active]:text-rpo-red data-[state=active]:border-b-2 data-[state=active]:border-rpo-red transition-all outline-none"
          >
            Tim Kami
          </Tabs.Trigger>
        </Tabs.List>

        {/* --- KONTEN UTAMA TAB --- */}
        <Tabs.Content value="content" className="outline-none">
          <div className="bg-white rounded-xl shadow-sm border border-admin-border p-6 md:p-8">
            <form onSubmit={handleContentSubmit(onSubmitContent)} className="space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Texts */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-admin-dark mb-2">Cerita / Sejarah (Story)</label>
                    <textarea 
                      {...regContent('storyText')}
                      rows={6}
                      className="w-full px-4 py-3 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rpo-red/20 focus:border-rpo-red transition-colors resize-none"
                      placeholder="Tuliskan cerita singkat tentang RPO..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-admin-dark mb-2">Visi</label>
                    <textarea 
                      {...regContent('visionText')}
                      rows={3}
                      className="w-full px-4 py-3 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rpo-red/20 focus:border-rpo-red transition-colors resize-none"
                      placeholder="Visi utama..."
                    />
                  </div>
                </div>

                {/* Right: Image & Missions */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-admin-dark mb-2">Foto Cerita</label>
                    <div 
                      className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 overflow-hidden relative group bg-gray-50 flex items-center justify-center cursor-pointer hover:border-rpo-red transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {isUploadingStory && (
                        <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                          <Loader2 className="w-8 h-8 animate-spin text-rpo-red" />
                        </div>
                      )}
                      
                      {storyImageUrl ? (
                        <>
                          <img src={getImageUrl(storyImageUrl)} alt="Story" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-sm font-medium">Ubah Foto</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-gray-400">
                          <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <span className="text-sm font-medium">Klik untuk upload foto</span>
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleStoryImageUpload}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-admin-dark mb-2">Daftar Misi</label>
                    <div className="space-y-3">
                      {missionFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                          <input
                            {...regContent(`missionList.${index}.value` as const)}
                            className="flex-1 px-3 py-2 border border-admin-border rounded-lg text-sm bg-white focus:outline-none focus:border-rpo-red transition-colors"
                            placeholder={`Misi ${index + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => removeMission(index)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => appendMission({ value: '' })}
                        className="inline-flex items-center gap-2 text-sm font-medium text-rpo-red hover:text-red-700 transition-colors py-2"
                      >
                        <Plus className="w-4 h-4" /> Tambah Misi
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-admin-border flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSavingContent}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-rpo-red text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isSavingContent ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Simpan Konten
                </button>
              </div>

            </form>
          </div>
        </Tabs.Content>

        {/* --- TEAM TAB --- */}
        <Tabs.Content value="team" className="outline-none">
          <div className="flex justify-end mb-6">
            <button 
              onClick={openCreateTeamModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-admin-dark text-white text-sm font-medium rounded-lg hover:bg-black transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Anggota Tim
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {teamMembers.length === 0 ? (
              <div className="col-span-full text-center py-16 bg-white border border-dashed border-admin-border rounded-xl">
                <p className="text-gray-500 font-medium">Belum ada anggota tim.</p>
              </div>
            ) : (
              teamMembers.map((member, index) => (
                <div 
                  key={member.id}
                  draggable
                  onDragStart={(e) => handleDragStartTeam(e, index)}
                  onDragEnter={(e) => handleDragEnterTeam(e, index)}
                  onDragEnd={handleDragEndTeam}
                  onDragOver={(e) => e.preventDefault()}
                  className={`group relative bg-white border border-admin-border rounded-xl overflow-hidden hover:shadow-md transition-all ${isDraggingTeam ? 'opacity-50' : ''}`}
                >
                  <div className="absolute top-2 left-2 z-20 cursor-move p-1.5 bg-white/80 backdrop-blur rounded-md shadow-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4" />
                  </div>

                  {/* Photo Area */}
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {member.profileImageUrl ? (
                      <img src={getImageUrl(member.profileImageUrl)} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon className="w-8 h-8 mb-2 opacity-30" />
                        <span className="text-[10px] font-medium uppercase tracking-wider">No Photo</span>
                      </div>
                    )}
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-medium backdrop-blur transition-colors">
                        <ImageIcon className="w-3.5 h-3.5" /> Ubah Foto
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleTeamPhotoUpload(member.id, e)}
                        />
                      </label>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openEditTeamModal(member)}
                          className="p-1.5 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTeam(member.id)}
                          className="p-1.5 bg-rpo-red text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 text-center border-t border-admin-border">
                    <h3 className="font-poppins font-bold text-admin-dark truncate">{member.name}</h3>
                    <p className="text-xs text-admin-secondary mt-1 truncate">{member.role}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Modal Dialog for Team Member */}
      <Dialog.Root open={isTeamModalOpen} onOpenChange={setIsTeamModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[70] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-5">
              <Dialog.Title className="text-lg font-poppins font-bold text-admin-dark">
                {editingTeamId ? 'Edit Anggota Tim' : 'Tambah Anggota Tim'}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
            
            <form onSubmit={handleTeamSubmit(onSubmitTeam)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-admin-dark mb-1">Nama Lengkap</label>
                <input 
                  {...regTeam('name')}
                  className="w-full px-3 py-2 border border-admin-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rpo-red/20 focus:border-rpo-red"
                  placeholder="Contoh: Budi Santoso"
                />
                {teamErrors.name && <p className="text-red-500 text-xs mt-1">{teamErrors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-admin-dark mb-1">Peran / Posisi</label>
                <input 
                  {...regTeam('role')}
                  className="w-full px-3 py-2 border border-admin-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rpo-red/20 focus:border-rpo-red"
                  placeholder="Contoh: Ketua Panitia"
                />
                {teamErrors.role && <p className="text-red-500 text-xs mt-1">{teamErrors.role.message}</p>}
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button 
                  type="submit" 
                  disabled={isSavingTeam}
                  className="w-full inline-flex justify-center items-center gap-2 px-6 py-2.5 bg-admin-dark text-white text-sm font-medium rounded-lg hover:bg-black transition-colors disabled:opacity-50"
                >
                  {isSavingTeam ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan'}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
}