import { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { Plus, Edit, Trash2, GripVertical, Loader2, Save, X, Check } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import * as Accordion from '@radix-ui/react-accordion';

const safetySchema = z.object({
  question: z.string().min(1, 'Pertanyaan wajib diisi'),
  answer: z.string().min(1, 'Jawaban wajib diisi'),
});
type SafetyValues = z.infer<typeof safetySchema>;

export default function AdminKebijakan() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [policies, setPolicies] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [safeties, setSafeties] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);

  // Safety Modal State
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [editingSafetyId, setEditingSafetyId] = useState<number | null>(null);
  const [isSavingSafety, setIsSavingSafety] = useState(false);
  
  // Policy Inline Edit State
  const [inlineEditingPolicyId, setInlineEditingPolicyId] = useState<number | null>(null);
  const [inlinePolicyText, setInlinePolicyText] = useState('');
  const [inlinePolicyIcon, setInlinePolicyIcon] = useState('');
  const [isSavingPolicy, setIsSavingPolicy] = useState(false);
  
  // Policy Create State (Inline top)
  const [isCreatingPolicy, setIsCreatingPolicy] = useState(false);
  const [newPolicyText, setNewPolicyText] = useState('');
  const [newPolicyIcon, setNewPolicyIcon] = useState('Shield'); // Default icon

  // Drag and drop refs for Safeties
  const dragItemSafety = useRef<number | null>(null);
  const dragOverItemSafety = useRef<number | null>(null);
  const [isDraggingSafety, setIsDraggingSafety] = useState(false);

  // Drag and drop refs for Policies
  const dragItemPolicy = useRef<number | null>(null);
  const dragOverItemPolicy = useRef<number | null>(null);
  const [isDraggingPolicy, setIsDraggingPolicy] = useState(false);

  const { register: registerSafety, handleSubmit: handleSubmitSafety, reset: resetSafety, formState: { errors: errorsSafety } } = useForm<SafetyValues>({
    resolver: zodResolver(safetySchema),
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resPol, resSaf] = await Promise.all([
        api.get('/api/policies'),
        api.get('/api/safety'),
      ]);
      setPolicies(resPol.data);
      setSafeties(resSaf.data);
    } catch {
      alert('Gagal memuat data Kebijakan & Keamanan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- SAFETY LOGIC ---
  const openCreateSafetyModal = () => {
    setEditingSafetyId(null);
    resetSafety({ question: '', answer: '' });
    setIsSafetyModalOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openEditSafetyModal = (saf: any) => {
    setEditingSafetyId(saf.id);
    resetSafety({ question: saf.question, answer: saf.answer });
    setIsSafetyModalOpen(true);
  };

  const onSubmitSafety = async (data: SafetyValues) => {
    setIsSavingSafety(true);
    try {
      if (editingSafetyId) {
        await api.put(`/api/safety/${editingSafetyId}`, data);
      } else {
        await api.post('/api/safety', {
          ...data,
          displayOrder: safeties.length,
        });
      }
      setIsSafetyModalOpen(false);
      
      const resSaf = await api.get('/api/safety');
      setSafeties(resSaf.data);
    } catch {
      alert('Gagal menyimpan Prosedur Darurat');
    } finally {
      setIsSavingSafety(false);
    }
  };

  const handleDeleteSafety = async (id: number) => {
    if (!confirm('Yakin ingin menghapus Prosedur ini?')) return;
    try {
      await api.delete(`/api/safety/${id}`);
      const resSaf = await api.get('/api/safety');
      setSafeties(resSaf.data);
    } catch {
      alert('Gagal menghapus Prosedur Darurat');
    }
  };

  const handleDragStartSafety = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragItemSafety.current = index;
    setIsDraggingSafety(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget.parentNode as any);
  };
  const handleDragEnterSafety = (_e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragOverItemSafety.current = index;
  };
  const handleDragEndSafety = async () => {
    setIsDraggingSafety(false);
    if (dragItemSafety.current !== null && dragOverItemSafety.current !== null && dragItemSafety.current !== dragOverItemSafety.current) {
      const newList = [...safeties];
      const dragged = newList[dragItemSafety.current];
      newList.splice(dragItemSafety.current, 1);
      newList.splice(dragOverItemSafety.current, 0, dragged);
      
      dragItemSafety.current = null;
      dragOverItemSafety.current = null;
      setSafeties(newList);
      try {
        await api.put('/api/safety/reorder', { orderedIds: newList.map(f => f.id) });
      } catch {
        alert('Gagal mengurutkan Prosedur Darurat');
        const resSaf = await api.get('/api/safety');
        setSafeties(resSaf.data);
      }
    } else {
      dragItemSafety.current = null;
      dragOverItemSafety.current = null;
    }
  };

  // --- POLICY LOGIC ---
  const handleCreatePolicy = async () => {
    if (!newPolicyText.trim()) return;
    setIsSavingPolicy(true);
    try {
      await api.post('/api/policies', {
        ruleText: newPolicyText,
        iconName: newPolicyIcon,
        displayOrder: policies.length,
      });
      setNewPolicyText('');
      setNewPolicyIcon('Shield');
      setIsCreatingPolicy(false);
      
      const resPol = await api.get('/api/policies');
      setPolicies(resPol.data);
    } catch {
      alert('Gagal menambahkan Aturan');
    } finally {
      setIsSavingPolicy(false);
    }
  };

  const startInlineEditPolicy = (id: number, text: string, icon: string) => {
    setInlineEditingPolicyId(id);
    setInlinePolicyText(text);
    setInlinePolicyIcon(icon);
  };

  const cancelInlineEditPolicy = () => {
    setInlineEditingPolicyId(null);
    setInlinePolicyText('');
    setInlinePolicyIcon('');
  };

  const saveInlineEditPolicy = async (id: number) => {
    if (!inlinePolicyText.trim()) return;
    setIsSavingPolicy(true);
    try {
      await api.put(`/api/policies/${id}`, {
        ruleText: inlinePolicyText,
        iconName: inlinePolicyIcon,
      });
      setInlineEditingPolicyId(null);
      const resPol = await api.get('/api/policies');
      setPolicies(resPol.data);
    } catch {
      alert('Gagal mengubah Aturan');
    } finally {
      setIsSavingPolicy(false);
    }
  };

  const handleDeletePolicy = async (id: number) => {
    if (!confirm('Yakin ingin menghapus Aturan ini?')) return;
    try {
      await api.delete(`/api/policies/${id}`);
      const resPol = await api.get('/api/policies');
      setPolicies(resPol.data);
    } catch {
      alert('Gagal menghapus Aturan');
    }
  };

  const handleDragStartPolicy = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragItemPolicy.current = index;
    setIsDraggingPolicy(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget.parentNode as any);
  };
  const handleDragEnterPolicy = (_e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragOverItemPolicy.current = index;
  };
  const handleDragEndPolicy = async () => {
    setIsDraggingPolicy(false);
    if (dragItemPolicy.current !== null && dragOverItemPolicy.current !== null && dragItemPolicy.current !== dragOverItemPolicy.current) {
      const newList = [...policies];
      const dragged = newList[dragItemPolicy.current];
      newList.splice(dragItemPolicy.current, 1);
      newList.splice(dragOverItemPolicy.current, 0, dragged);
      
      dragItemPolicy.current = null;
      dragOverItemPolicy.current = null;
      setPolicies(newList);
      try {
        await api.put('/api/policies/reorder', { orderedIds: newList.map(f => f.id) });
      } catch {
        alert('Gagal mengurutkan Aturan');
        const resPol = await api.get('/api/policies');
        setPolicies(resPol.data);
      }
    } else {
      dragItemPolicy.current = null;
      dragOverItemPolicy.current = null;
    }
  };

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
          <h1 className="text-2xl md:text-3xl font-poppins font-bold text-admin-dark">Kebijakan & Keamanan</h1>
          <p className="text-sm text-admin-secondary mt-1">Kelola Aturan Pengunjung dan Prosedur Darurat event.</p>
        </div>
      </div>

      <Tabs.Root defaultValue="aturan" className="flex flex-col">
        <Tabs.List className="flex shrink-0 border-b border-admin-border mb-6">
          <Tabs.Trigger 
            value="aturan" 
            className="px-5 py-3 font-medium text-sm text-admin-secondary data-[state=active]:text-sougen-blue data-[state=active]:border-b-2 data-[state=active]:border-sougen-blue transition-all outline-none"
          >
            Aturan Pengunjung
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="prosedur" 
            className="px-5 py-3 font-medium text-sm text-admin-secondary data-[state=active]:text-sougen-blue data-[state=active]:border-b-2 data-[state=active]:border-sougen-blue transition-all outline-none"
          >
            Prosedur Darurat
          </Tabs.Trigger>
        </Tabs.List>

        {/* --- ATURAN PENGUNJUNG TAB --- */}
        <Tabs.Content value="aturan" className="outline-none space-y-4">
          
          <div className="bg-white rounded-xl shadow-sm border border-admin-border p-4 mb-4">
            {!isCreatingPolicy ? (
              <button 
                onClick={() => setIsCreatingPolicy(true)}
                className="w-full py-3 flex items-center justify-center gap-2 text-admin-secondary hover:text-admin-dark hover:bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Tambah Aturan Baru
              </button>
            ) : (
              <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                <input 
                  type="text" 
                  value={newPolicyIcon} 
                  onChange={(e) => setNewPolicyIcon(e.target.value)} 
                  placeholder="Ikon (mis: Shield)" 
                  className="w-full md:w-32 px-3 py-2 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
                />
                <input 
                  type="text" 
                  value={newPolicyText} 
                  onChange={(e) => setNewPolicyText(e.target.value)} 
                  placeholder="Masukkan isi aturan pengunjung..." 
                  className="w-full flex-1 px-3 py-2 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
                  autoFocus
                />
                <div className="flex gap-2 w-full md:w-auto">
                  <button 
                    onClick={() => setIsCreatingPolicy(false)}
                    className="flex-1 md:flex-none px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleCreatePolicy}
                    disabled={isSavingPolicy || !newPolicyText.trim()}
                    className="flex-1 md:flex-none px-4 py-2 text-sm bg-sougen-blue text-white rounded-lg hover:bg-sougen-blue/90 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isSavingPolicy ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-admin-border overflow-hidden">
            {policies.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm">Belum ada aturan.</div>
            ) : (
              <div className="divide-y divide-admin-border">
                {policies.map((policy, index) => (
                  <div 
                    key={policy.id}
                    draggable={inlineEditingPolicyId !== policy.id}
                    onDragStart={(e) => handleDragStartPolicy(e, index)}
                    onDragEnter={(e) => handleDragEnterPolicy(e, index)}
                    onDragEnd={handleDragEndPolicy}
                    onDragOver={(e) => e.preventDefault()}
                    className={`flex items-center gap-3 p-3 transition-all ${isDraggingPolicy ? 'opacity-90 bg-gray-50' : 'hover:bg-gray-50 bg-white'}`}
                  >
                    <div className="cursor-move text-gray-400 hover:text-admin-dark shrink-0">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    
                    {inlineEditingPolicyId === policy.id ? (
                      <div className="flex-1 flex flex-col md:flex-row gap-2">
                        <input 
                          type="text" 
                          value={inlinePolicyIcon} 
                          onChange={(e) => setInlinePolicyIcon(e.target.value)} 
                          placeholder="Ikon" 
                          className="w-full md:w-24 px-2 py-1.5 border border-admin-border rounded text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
                        />
                        <input 
                          type="text" 
                          value={inlinePolicyText} 
                          onChange={(e) => setInlinePolicyText(e.target.value)} 
                          className="w-full flex-1 px-2 py-1.5 border border-admin-border rounded text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center gap-3 min-w-0">
                        <div className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-500 shrink-0">
                          {policy.iconName}
                        </div>
                        <span className="text-sm font-medium text-admin-dark truncate">{policy.ruleText}</span>
                      </div>
                    )}

                    <div className="flex gap-1 shrink-0">
                      {inlineEditingPolicyId === policy.id ? (
                        <>
                          <button 
                            onClick={cancelInlineEditPolicy}
                            className="p-1.5 text-gray-400 hover:text-admin-dark hover:bg-gray-200 rounded transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => saveInlineEditPolicy(policy.id)}
                            disabled={isSavingPolicy}
                            className="p-1.5 text-sougen-blue hover:bg-sougen-blue/10 rounded transition-colors"
                          >
                            {isSavingPolicy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => startInlineEditPolicy(policy.id, policy.ruleText, policy.iconName)}
                            className="p-1.5 text-gray-400 hover:text-admin-dark hover:bg-gray-200 rounded transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeletePolicy(policy.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Tabs.Content>

        {/* --- PROSEDUR DARURAT TAB --- */}
        <Tabs.Content value="prosedur" className="outline-none space-y-4">
          <div className="flex justify-end">
            <button 
              onClick={openCreateSafetyModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sougen-blue text-white text-sm font-medium rounded-lg hover:bg-sougen-blue/90 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Tambah Prosedur
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-admin-border p-6">
            {safeties.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm">Belum ada prosedur darurat.</div>
            ) : (
              <Accordion.Root type="multiple" className="space-y-3">
                {safeties.map((saf, index) => (
                  <div 
                    key={saf.id}
                    draggable
                    onDragStart={(e) => handleDragStartSafety(e, index)}
                    onDragEnter={(e) => handleDragEnterSafety(e, index)}
                    onDragEnd={handleDragEndSafety}
                    onDragOver={(e) => e.preventDefault()}
                    className={`group flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-2 transition-all ${isDraggingSafety ? 'opacity-90' : 'hover:border-sougen-blue/40 hover:shadow-sm'}`}
                  >
                    <div className="cursor-move pt-3 pl-2 text-gray-400 hover:text-admin-dark">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1">
                      <Accordion.Item value={`saf-${saf.id}`} className="border-none">
                        <Accordion.Header>
                          <Accordion.Trigger className="w-full text-left py-3 px-2 font-poppins font-medium text-admin-dark focus:outline-none flex justify-between items-center group-data-[state=open]:text-sougen-blue">
                            <span>{saf.question}</span>
                            <div className="text-gray-400 transition-transform duration-200 ease-out group-data-[state=open]:rotate-180">
                              ▼
                            </div>
                          </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Content className="px-2 pb-4 text-sm text-admin-secondary leading-relaxed overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                          <div className="pt-2 border-t border-gray-100 whitespace-pre-wrap">
                            {saf.answer}
                          </div>
                        </Accordion.Content>
                      </Accordion.Item>
                    </div>
                    
                    <div className="flex gap-2 pt-3 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditSafetyModal(saf)}
                        className="p-1.5 text-gray-400 hover:text-admin-dark hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteSafety(saf.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </Accordion.Root>
            )}
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Modal Dialog for Safety Procedures */}
      <Dialog.Root open={isSafetyModalOpen} onOpenChange={setIsSafetyModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[70] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6">
            <Dialog.Title className="text-lg font-poppins font-bold text-admin-dark mb-4">
              {editingSafetyId ? 'Edit Prosedur Darurat' : 'Tambah Prosedur Darurat'}
            </Dialog.Title>
            
            <form onSubmit={handleSubmitSafety(onSubmitSafety)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-admin-dark mb-1">Pertanyaan / Kondisi</label>
                <input 
                  {...registerSafety('question')}
                  className="w-full px-3 py-2 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
                  placeholder="Misal: Apa yang harus dilakukan saat gempa?"
                />
                {errorsSafety.question && <p className="text-red-500 text-xs mt-1">{errorsSafety.question.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-admin-dark mb-1">Jawaban / Instruksi</label>
                <textarea 
                  {...registerSafety('answer')}
                  rows={4}
                  className="w-full px-3 py-2 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue resize-none"
                  placeholder="Isi instruksi evakuasi atau prosedur..."
                />
                {errorsSafety.answer && <p className="text-red-500 text-xs mt-1">{errorsSafety.answer.message}</p>}
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <Dialog.Close asChild>
                  <button type="button" className="px-4 py-2 text-sm font-medium text-admin-secondary hover:bg-gray-100 rounded-lg transition-colors">
                    Batal
                  </button>
                </Dialog.Close>
                <button 
                  type="submit" 
                  disabled={isSavingSafety}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-sougen-blue text-white text-sm font-medium rounded-lg hover:bg-sougen-blue/90 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSavingSafety ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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