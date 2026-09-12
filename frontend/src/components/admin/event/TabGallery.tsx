import { useState, useRef } from 'react';
import { api } from '../../../services/api';
import { Loader2, UploadCloud, Trash2, GripVertical } from 'lucide-react';
import { getImageUrl } from '../../../utils/getImageUrl';

interface TabGalleryProps {
  eventData: any;
  onUpdate: (data: any) => void;
}

export default function TabGallery({ eventData, onUpdate }: TabGalleryProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Drag and drop ordering state
  const [draggedItemIdx, setDraggedItemIdx] = useState<number | null>(null);

  const galleryPhotos = [...(eventData.galleryPhotos || [])].sort((a, b) => a.orderIndex - b.orderIndex);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 5 * 1024 * 1024) {
        alert(`File ${files[i].name} terlalu besar. Maks 5MB.`);
        return;
      }
      formData.append('images', files[i]);
    }

    setUploading(true);
    try {
      await api.post(`/api/events/${eventData.id}/gallery`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const res = await api.get(`/api/events/${eventData.slug}`);
      onUpdate(res.data);
    } catch {
      alert('Gagal mengunggah foto.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (photoId: number) => {
    if (!confirm('Hapus foto ini?')) return;
    try {
      await api.delete(`/api/gallery-photos/${photoId}`);
      const res = await api.get(`/api/events/${eventData.slug}`);
      onUpdate(res.data);
    } catch {
      alert('Gagal menghapus foto.');
    }
  };

  const handleReorder = async (newPhotos: any[]) => {
    try {
      const updates = newPhotos.map((p, idx) => ({ id: p.id, orderIndex: idx }));
      await api.put(`/api/events/${eventData.id}/gallery/reorder`, { photos: updates });
      const res = await api.get(`/api/events/${eventData.slug}`);
      onUpdate(res.data);
    } catch {
      alert('Gagal menyimpan urutan baru.');
    }
  };

  const onDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIdx === null || draggedItemIdx === index) return;
    
    // Live preview reorder
    const newPhotos = [...galleryPhotos];
    const draggedPhoto = newPhotos[draggedItemIdx];
    
    newPhotos.splice(draggedItemIdx, 1);
    newPhotos.splice(index, 0, draggedPhoto);
    
    setDraggedItemIdx(index);
    // Update temporary state via prop callback trick or local state. 
    // Since we rely on eventData from parent, it's safer to just set local state, 
    // but here we can mutate a copy and pass to parent temporarily if we want live feedback.
    // For simplicity, we just rely on drop event to trigger api.
  };

  const onDrop = async (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIdx === null) return;
    
    const newPhotos = [...galleryPhotos];
    const draggedPhoto = newPhotos[draggedItemIdx];
    newPhotos.splice(draggedItemIdx, 1);
    newPhotos.splice(index, 0, draggedPhoto);
    
    setDraggedItemIdx(null);
    await handleReorder(newPhotos);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-poppins font-semibold text-admin-dark">Unggah Foto Galeri</h3>
        <p className="text-xs text-admin-secondary mt-1">
          Unggah banyak foto sekaligus. Tarik dan lepas ikon titik enam untuk mengubah urutan.
        </p>
      </div>

      {/* Upload Area */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="group relative w-full border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center p-12 cursor-pointer hover:bg-gray-100 hover:border-sougen-blue transition-all"
      >
        {uploading ? (
          <div className="flex flex-col items-center text-admin-secondary">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-sougen-blue" />
            <span className="text-sm font-medium">Mengunggah...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-admin-secondary group-hover:text-sougen-blue transition-colors">
            <UploadCloud className="w-10 h-10 mb-4" />
            <span className="text-sm font-medium">Klik untuk memilih beberapa foto</span>
            <span className="text-xs mt-1">Maks. 5MB per file (JPG, PNG)</span>
          </div>
        )}
        <input 
          type="file" 
          accept="image/*" 
          multiple
          ref={fileInputRef} 
          className="hidden" 
          onChange={(e) => handleUpload(e.target.files)} 
        />
      </div>

      {/* Grid Foto */}
      {galleryPhotos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryPhotos.map((photo: any, idx: number) => (
            <div 
              key={photo.id} 
              draggable
              onDragStart={(e) => onDragStart(e, idx)}
              onDragOver={(e) => onDragOver(e, idx)}
              onDrop={(e) => onDrop(e, idx)}
              className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-admin-border"
            >
              <img src={getImageUrl(photo.imageUrl)} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-between items-center w-full">
                  <div className="p-1 bg-white/20 backdrop-blur-sm rounded cursor-move hover:bg-white/40">
                    <GripVertical className="w-4 h-4 text-white" />
                  </div>
                  <button 
                    onClick={() => handleDelete(photo.id)}
                    className="p-1 bg-red-500/80 hover:bg-red-500 rounded text-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
