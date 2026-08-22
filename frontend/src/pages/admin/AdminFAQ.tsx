import { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { Plus, Edit, Trash2, GripVertical, Loader2, Save } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import * as Accordion from '@radix-ui/react-accordion';

const faqSchema = z.object({
  question: z.string().min(1, 'Pertanyaan wajib diisi'),
  answer: z.string().min(1, 'Jawaban wajib diisi'),
});
type FaqValues = z.infer<typeof faqSchema>;

export default function AdminFAQ() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Drag and drop state
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FaqValues>({
    resolver: zodResolver(faqSchema),
  });

  const fetchFaqs = async () => {
    try {
      const res = await api.get('/api/faqs');
      setFaqs(res.data);
    } catch {
      alert('Gagal memuat data FAQ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    reset({ question: '', answer: '' });
    setIsModalOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openEditModal = (faq: any) => {
    setEditingId(faq.id);
    reset({ question: faq.question, answer: faq.answer });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: FaqValues) => {
    setIsSaving(true);
    try {
      if (editingId) {
        await api.put(`/api/faqs/${editingId}`, data);
      } else {
        await api.post('/api/faqs', {
          ...data,
          displayOrder: faqs.length,
        });
      }
      setIsModalOpen(false);
      fetchFaqs();
    } catch {
      alert('Gagal menyimpan FAQ');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus FAQ ini?')) return;
    try {
      await api.delete(`/api/faqs/${id}`);
      fetchFaqs();
    } catch {
      alert('Gagal menghapus FAQ');
    }
  };

  // --- Drag and Drop Logic ---
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragItem.current = index;
    setIsDragging(true);
    // Needed for Firefox
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget.parentNode as any);
  };

  const handleDragEnter = (_e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragOverItem.current = index;
    // Optional: visual feedback by swapping instantly or keeping track of over index
  };

  const handleDragEnd = async () => {
    setIsDragging(false);
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const newFaqs = [...faqs];
      const draggedItemContent = newFaqs[dragItem.current];
      newFaqs.splice(dragItem.current, 1);
      newFaqs.splice(dragOverItem.current, 0, draggedItemContent);
      
      dragItem.current = null;
      dragOverItem.current = null;
      
      setFaqs(newFaqs); // Optimistic UI

      try {
        await api.put('/api/faqs/reorder', {
          orderedIds: newFaqs.map(f => f.id)
        });
      } catch {
        alert('Gagal mengurutkan FAQ');
        fetchFaqs();
      }
    } else {
      dragItem.current = null;
      dragOverItem.current = null;
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
          <h1 className="text-2xl md:text-3xl font-poppins font-bold text-admin-dark">FAQ</h1>
          <p className="text-sm text-admin-secondary mt-1">Kelola pertanyaan yang sering diajukan. Drag & drop untuk mengatur urutan.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-sougen-blue text-white text-sm font-medium rounded-lg hover:bg-sougen-blue/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Pertanyaan
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-admin-border p-6">
        {faqs.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm">
            Belum ada FAQ. Klik "Tambah Pertanyaan" untuk memulai.
          </div>
        ) : (
          <Accordion.Root type="multiple" className="space-y-3">
            {faqs.map((faq, index) => (
              <div 
                key={faq.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={`group flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-2 transition-all ${isDragging ? 'opacity-90' : 'hover:border-sougen-blue/40 hover:shadow-sm'}`}
              >
                {/* Drag Handle */}
                <div className="cursor-move pt-3 pl-2 text-gray-400 hover:text-admin-dark">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <Accordion.Item value={`faq-${faq.id}`} className="border-none">
                    <Accordion.Header>
                      <Accordion.Trigger className="w-full text-left py-3 px-2 font-poppins font-medium text-admin-dark focus:outline-none flex justify-between items-center group-data-[state=open]:text-sougen-blue">
                        <span>{faq.question}</span>
                        <div className="text-gray-400 transition-transform duration-200 ease-out group-data-[state=open]:rotate-180">
                          ▼
                        </div>
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="px-2 pb-4 text-sm text-admin-secondary leading-relaxed overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                      <div className="pt-2 border-t border-gray-100 whitespace-pre-wrap">
                        {faq.answer}
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 pt-3 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openEditModal(faq)}
                    className="p-1.5 text-gray-400 hover:text-admin-dark hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(faq.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </Accordion.Root>
        )}
      </div>

      {/* Modal Dialog for Create/Edit */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[70] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6">
            <Dialog.Title className="text-lg font-poppins font-bold text-admin-dark mb-4">
              {editingId ? 'Edit Pertanyaan' : 'Tambah Pertanyaan Baru'}
            </Dialog.Title>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-admin-dark mb-1">Pertanyaan</label>
                <input 
                  {...register('question')}
                  className="w-full px-3 py-2 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
                  placeholder="Contoh: Kapan acara Sougen diselenggarakan?"
                />
                {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-admin-dark mb-1">Jawaban</label>
                <textarea 
                  {...register('answer')}
                  rows={4}
                  className="w-full px-3 py-2 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue resize-none"
                  placeholder="Isi jawaban di sini..."
                />
                {errors.answer && <p className="text-red-500 text-xs mt-1">{errors.answer.message}</p>}
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <Dialog.Close asChild>
                  <button type="button" className="px-4 py-2 text-sm font-medium text-admin-secondary hover:bg-gray-100 rounded-lg transition-colors">
                    Batal
                  </button>
                </Dialog.Close>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-sougen-blue text-white text-sm font-medium rounded-lg hover:bg-sougen-blue/90 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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