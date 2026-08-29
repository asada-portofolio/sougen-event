import { useState, useRef } from 'react';
import { api } from '../../../services/api';
import { 
  Loader2, 
  UploadCloud, 
  Trash2, 
  GripVertical, 
  Star, 
  Eye, 
  X, 
  Image as ImageIcon 
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { getImageUrl } from '../../../utils/getImageUrl';
import type { GalleryPhoto } from '../../../types/gallery';
import { cn } from '../../../lib/utils';

interface TabGalleryProps {
  eventData: any;
  onUpdate: (data: any) => void;
}

export default function TabGallery({ eventData, onUpdate }: TabGalleryProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [settingCoverId, setSettingCoverId] = useState<number | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<GalleryPhoto | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Drag and drop ordering state
  const [draggedItemIdx, setDraggedItemIdx] = useState<number | null>(null);

  const galleryPhotos: GalleryPhoto[] = [...(eventData.galleryPhotos || [])].sort(
    (a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  );

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

    setUploadCount(files.length);
    setUploading(true);
    try {
      await api.post(`/api/events/${eventData.id}/gallery`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const res = await api.get(`/api/events/${eventData.slug}`);
      onUpdate(res.data);
    } catch {
      alert('Gagal mengunggah foto galeri.');
    } finally {
      setUploading(false);
      setUploadCount(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (photoId: number) => {
    if (!confirm('Hapus foto ini dari galeri?')) return;
    try {
      await api.delete(`/api/gallery-photos/${photoId}`);
      const res = await api.get(`/api/events/${eventData.slug}`);
      onUpdate(res.data);
    } catch {
      alert('Gagal menghapus foto.');
    }
  };

  const handleSetCover = async (photoId: number) => {
    setSettingCoverId(photoId);
    try {
      await api.put(`/api/gallery-photos/${photoId}`, { isCover: true });
      const res = await api.get(`/api/events/${eventData.slug}`);
      onUpdate(res.data);
    } catch {
      alert('Gagal menyetel foto sebagai cover.');
    } finally {
      setSettingCoverId(null);
    }
  };

  const handleReorder = async (newPhotos: GalleryPhoto[]) => {
    try {
      const orderedIds = newPhotos.map(p => p.id);
      await api.put(`/api/events/${eventData.id}/gallery/reorder`, { orderedIds });
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

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = async (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIdx === null || draggedItemIdx === index) {
      setDraggedItemIdx(null);
      return;
    }
    
    const newPhotos = [...galleryPhotos];
    const [draggedPhoto] = newPhotos.splice(draggedItemIdx, 1);
    newPhotos.splice(index, 0, draggedPhoto);
    
    setDraggedItemIdx(null);
    await handleReorder(newPhotos);
  };

  return (
    <div id="field-gallery" className="space-y-6 p-1 sm:p-2 rounded-2xl transition-all">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-admin-border">
        <div>
          <h3 className="text-sm font-poppins font-bold text-admin-dark flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-sougen-blue" />
            <span>Galeri Foto Event</span>
            <span className="px-2 py-0.5 rounded-full bg-sougen-blue/10 text-sougen-blue text-xs font-semibold">
              {galleryPhotos.length} Foto
            </span>
          </h3>
          <p className="text-xs text-admin-secondary mt-1">
            Unggah foto dokumentasi acara. Seret ikon untuk mengatur urutan, dan tentukan foto Cover Album.
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "group relative w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 sm:p-10 cursor-pointer transition-all",
          uploading 
            ? "border-sougen-blue bg-sougen-blue/5 pointer-events-none" 
            : "border-gray-300 bg-gray-50/80 hover:bg-sougen-blue/5 hover:border-sougen-blue"
        )}
      >
        {uploading ? (
          <div className="flex flex-col items-center text-admin-secondary">
            <Loader2 className="w-10 h-10 animate-spin mb-3 text-sougen-blue" />
            <span className="text-sm font-bold text-admin-dark">Mengunggah {uploadCount} Foto...</span>
            <span className="text-xs text-gray-500 mt-1">Sedang mengoptimasi ukuran thumbnail & resolusi penuh...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-admin-secondary group-hover:text-sougen-blue transition-colors text-center">
            <div className="w-12 h-12 rounded-2xl bg-sougen-blue/10 flex items-center justify-center text-sougen-blue mb-3 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-admin-dark group-hover:text-sougen-blue">
              Klik atau Seret Foto ke Sini
            </span>
            <span className="text-xs text-gray-500 mt-1">
              Mendukung multi-upload (JPG, PNG, WebP) · Maks. 5MB per file
            </span>
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
      {galleryPhotos.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-admin-secondary font-medium">
            <span>Daftar Foto Dokumentasi (Urutan Tampil):</span>
            <span className="hidden sm:inline">💡 Tarik foto untuk mengatur urutan</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {galleryPhotos.map((photo: any, idx: number) => {
              const photoUrl = getImageUrl(photo.imageUrlThumb || photo.imageUrlFull);
              const isCover = Boolean(photo.isCover);
              const isSettingThisCover = settingCoverId === photo.id;

              return (
                <div 
                  key={photo.id} 
                  draggable
                  onDragStart={(e) => onDragStart(e, idx)}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, idx)}
                  className={cn(
                    "group relative aspect-square bg-gray-100 rounded-2xl overflow-hidden border transition-all shadow-xs",
                    isCover 
                      ? "border-amber-400 ring-2 ring-amber-400/30" 
                      : "border-admin-border hover:border-sougen-blue/60",
                    draggedItemIdx === idx && "opacity-40 scale-95 border-dashed border-sougen-blue"
                  )}
                >
                  {/* Image Preview */}
                  <img 
                    src={photoUrl} 
                    alt={`Dokumentasi ${idx + 1}`} 
                    className="w-full h-full object-cover select-none transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e: any) => {
                      if (photo.imageUrlFull && e.target.src !== getImageUrl(photo.imageUrlFull)) {
                        e.target.src = getImageUrl(photo.imageUrlFull);
                      }
                    }}
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
                    {/* Index Badge */}
                    <span className="px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono font-bold">
                      #{idx + 1}
                    </span>

                    {/* Cover Album Badge */}
                    {isCover && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" />
                        <span>Cover</span>
                      </span>
                    )}
                  </div>

                  {/* Overlay Hover Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5 z-20">
                    <div className="flex justify-between items-center w-full">
                      {/* Drag Handle */}
                      <div 
                        className="p-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-xs rounded-lg cursor-grab active:cursor-grabbing text-white"
                        title="Tarik untuk memindahkan urutan"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>

                      {/* Delete Button */}
                      <button 
                        onClick={() => handleDelete(photo.id)}
                        className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-colors shadow-xs"
                        title="Hapus Foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="flex items-center justify-between gap-1.5 pt-2">
                      {/* Full Preview Lightbox Button */}
                      <button 
                        onClick={() => setPreviewPhoto(photo)}
                        className="flex-1 py-1 px-2 bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                        title="Lihat Ukuran Penuh"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Lihat</span>
                      </button>

                      {/* Set as Cover Button */}
                      {!isCover && (
                        <button 
                          onClick={() => handleSetCover(photo.id)}
                          disabled={isSettingThisCover}
                          className="flex-1 py-1 px-2 bg-amber-500/90 hover:bg-amber-500 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-xs"
                          title="Jadikan Cover Utama Album"
                        >
                          {isSettingThisCover ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Star className="w-3 h-3" />
                          )}
                          <span>Set Cover</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-gray-50 border border-dashed border-admin-border rounded-2xl text-admin-secondary text-xs">
          Belum ada foto galeri yang diunggah untuk event ini.
        </div>
      )}

      {/* ── LIGHTBOX FULL PREVIEW DIALOG ── */}
      <Dialog.Root open={Boolean(previewPhoto)} onOpenChange={(open) => !open && setPreviewPhoto(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-all" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 max-w-4xl max-h-[90vh] w-[95vw] bg-black rounded-2xl overflow-hidden shadow-2xl p-2 sm:p-4 flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-3 px-2 border-b border-gray-800 text-white">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-sougen-blue" />
                <span className="text-xs font-bold font-poppins">
                  Preview Foto {previewPhoto?.width && previewPhoto?.height ? `(${previewPhoto.width} × ${previewPhoto.height} px)` : ''}
                </span>
                {previewPhoto?.isCover && (
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-[10px] font-bold">
                    Cover Album
                  </span>
                )}
              </div>
              <Dialog.Close asChild>
                <button className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            {previewPhoto && (
              <div className="relative flex items-center justify-center p-2 max-h-[75vh] w-full overflow-hidden">
                <img 
                  src={getImageUrl(previewPhoto.imageUrlFull || previewPhoto.imageUrlThumb)} 
                  alt="Full Preview" 
                  className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-lg"
                />
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
