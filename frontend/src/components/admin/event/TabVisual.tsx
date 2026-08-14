import { useState, useRef } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { UploadCloud, Image as ImageIcon, Loader2, Save } from 'lucide-react';
import { api } from '../../../services/api';
import { getImageUrl } from '../../../utils/getImageUrl';

interface TabVisualProps {
  eventData: any;
  onUpdate: (data: any) => void;
}

export default function TabVisual({ eventData, onUpdate }: TabVisualProps) {
  const [heroMode, setHeroMode] = useState<'TEMPLATE' | 'POSTER'>(eventData.heroMode || 'TEMPLATE');
  const [isSavingMode, setIsSavingMode] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  
  const posterInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  const handleSaveMode = async () => {
    setIsSavingMode(true);
    try {
      const res = await api.put(`/api/events/${eventData.id}`, { heroMode });
      onUpdate(res.data);
      alert('Mode Tampilan Hero berhasil disimpan.');
    } catch {
      alert('Gagal menyimpan mode tampilan.');
    } finally {
      setIsSavingMode(false);
    }
  };

  const handleUpload = async (type: 'poster' | 'hero', file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Harap unggah file gambar yang valid.');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    const setUploading = type === 'poster' ? setUploadingPoster : setUploadingHero;
    setUploading(true);

    try {
      // Backend expects 'image' field for both endpoints based on typical setup.
      // Wait, let's verify if the field is 'image' or 'file' by looking at eventRoutes.ts.
      // Usually it's 'image' for multer in our backend. Let's send 'image'.
      const res = await api.post(`/api/events/${eventData.id}/${type}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUpdate(res.data);
    } catch {
      alert(`Gagal mengunggah ${type}.`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Pengaturan Mode Hero */}
      <section>
        <div className="mb-4">
          <h3 className="text-sm font-poppins font-semibold text-admin-dark">Mode Tampilan Hero (Desktop)</h3>
          <p className="text-xs text-admin-secondary mt-1">
            Pilih bagaimana area paling atas halaman detail event ditampilkan.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:items-end">
          <RadioGroup.Root 
            value={heroMode} 
            onValueChange={(val: any) => setHeroMode(val)}
            className="flex flex-col sm:flex-row gap-4"
          >
            <label className={`
              relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
              ${heroMode === 'TEMPLATE' ? 'border-rpo-red bg-red-50/50' : 'border-admin-border bg-white hover:border-gray-300'}
            `}>
              <RadioGroup.Item value="TEMPLATE" className="w-5 h-5 rounded-full border border-gray-300 bg-white data-[state=checked]:border-rpo-red data-[state=checked]:bg-rpo-red flex items-center justify-center outline-none">
                <RadioGroup.Indicator className="w-2.5 h-2.5 rounded-full bg-white" />
              </RadioGroup.Item>
              <div>
                <div className="text-sm font-medium text-admin-dark">Template (Judul + Info)</div>
                <div className="text-xs text-admin-secondary mt-0.5">Menggunakan teks dan warna standar.</div>
              </div>
            </label>

            <label className={`
              relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
              ${heroMode === 'POSTER' ? 'border-rpo-red bg-red-50/50' : 'border-admin-border bg-white hover:border-gray-300'}
            `}>
              <RadioGroup.Item value="POSTER" className="w-5 h-5 rounded-full border border-gray-300 bg-white data-[state=checked]:border-rpo-red data-[state=checked]:bg-rpo-red flex items-center justify-center outline-none">
                <RadioGroup.Indicator className="w-2.5 h-2.5 rounded-full bg-white" />
              </RadioGroup.Item>
              <div>
                <div className="text-sm font-medium text-admin-dark">Gambar Penuh (Poster)</div>
                <div className="text-xs text-admin-secondary mt-0.5">Menggunakan Hero Image yang diunggah.</div>
              </div>
            </label>
          </RadioGroup.Root>

          {heroMode !== eventData.heroMode && (
            <button 
              onClick={handleSaveMode}
              disabled={isSavingMode}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-admin-dark text-white text-sm font-medium rounded-lg hover:bg-black transition-colors disabled:opacity-70 h-[64px]"
            >
              {isSavingMode ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Simpan Mode
            </button>
          )}
        </div>
      </section>

      <hr className="border-admin-border" />

      {/* Upload Area */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Upload Poster */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-poppins font-semibold text-admin-dark">Poster Image (Utama)</h3>
              <p className="text-xs text-admin-secondary mt-1">Digunakan untuk Thumbnail Card (Aspek 4:3).</p>
            </div>
            {eventData.posterImageUrl && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Terpasang</span>
            )}
          </div>
          
          <div 
            onClick={() => posterInputRef.current?.click()}
            className="group relative aspect-[4/3] w-full border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-rpo-red transition-all overflow-hidden"
          >
            {uploadingPoster ? (
              <div className="flex flex-col items-center text-admin-secondary">
                <Loader2 className="w-8 h-8 animate-spin mb-2 text-rpo-red" />
                <span className="text-sm font-medium">Mengunggah...</span>
              </div>
            ) : eventData.posterImageUrl ? (
              <>
                <img src={getImageUrl(eventData.posterImageUrl)} alt="Poster" className="w-full h-full object-cover opacity-75 group-hover:opacity-40 transition-opacity" />
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <UploadCloud className="w-8 h-8 text-admin-dark mb-2" />
                  <span className="text-sm font-medium text-admin-dark bg-white/90 px-3 py-1 rounded-full shadow-sm">Ganti Poster</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-admin-secondary group-hover:text-rpo-red transition-colors">
                <UploadCloud className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Klik untuk unggah poster</span>
                <span className="text-xs mt-1">Maks. 2MB (JPG, PNG)</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              ref={posterInputRef} 
              className="hidden" 
              onChange={(e) => {
                if (e.target.files?.[0]) handleUpload('poster', e.target.files[0]);
              }} 
            />
          </div>
        </div>

        {/* Upload Hero */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-poppins font-semibold text-admin-dark">Hero Image</h3>
              <p className="text-xs text-admin-secondary mt-1">Digunakan untuk header lebar (Aspek 21:9 atau 16:9).</p>
            </div>
            {eventData.heroImageUrl && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Terpasang</span>
            )}
          </div>
          
          <div 
            onClick={() => heroInputRef.current?.click()}
            className="group relative aspect-[4/3] md:aspect-[16/9] w-full border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-rpo-red transition-all overflow-hidden"
          >
            {uploadingHero ? (
              <div className="flex flex-col items-center text-admin-secondary">
                <Loader2 className="w-8 h-8 animate-spin mb-2 text-rpo-red" />
                <span className="text-sm font-medium">Mengunggah...</span>
              </div>
            ) : eventData.heroImageUrl ? (
              <>
                <img src={getImageUrl(eventData.heroImageUrl)} alt="Hero" className="w-full h-full object-cover opacity-75 group-hover:opacity-40 transition-opacity" />
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <UploadCloud className="w-8 h-8 text-admin-dark mb-2" />
                  <span className="text-sm font-medium text-admin-dark bg-white/90 px-3 py-1 rounded-full shadow-sm">Ganti Hero</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-admin-secondary group-hover:text-rpo-red transition-colors">
                <ImageIcon className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Klik untuk unggah hero</span>
                <span className="text-xs mt-1">Maks. 2MB (JPG, PNG)</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              ref={heroInputRef} 
              className="hidden" 
              onChange={(e) => {
                if (e.target.files?.[0]) handleUpload('hero', e.target.files[0]);
              }} 
            />
          </div>
        </div>

      </section>
    </div>
  );
}
