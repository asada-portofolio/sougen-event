import { useState, useEffect, useRef } from 'react';
import { Save, Loader2, Globe, LayoutTemplate, Image as ImageIcon } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { api } from '../../services/api';
import { getImageUrl } from '../../utils/getImageUrl';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);

  const heroInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState({
    heroImageUrl: '',
    siteTitle: 'Sougen',
    siteDescription: 'Platform kreatif dan event pop culture di Makassar.',
    footerDescription: 'Sougen adalah platform manajemen acara dan komunitas pop culture terkemuka di Makassar.',
    footerCopyright: '© 2026 Sougen. All rights reserved.'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/api/settings');
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTextSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/api/settings', {
        siteTitle: settings.siteTitle,
        siteDescription: settings.siteDescription,
        footerDescription: settings.footerDescription,
        footerCopyright: settings.footerCopyright,
      });
      alert('Pengaturan teks berhasil disimpan!');
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan pengaturan.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadHero = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setIsUploadingHero(true);
    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    try {
      const { data } = await api.post('/api/settings/hero', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSettings(prev => ({ ...prev, heroImageUrl: data.heroImageUrl }));
      alert('Hero image berhasil diunggah!');
    } catch (error) {
      console.error(error);
      alert('Gagal mengunggah hero image.');
    } finally {
      setIsUploadingHero(false);
      if (heroInputRef.current) heroInputRef.current.value = '';
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
      <div>
        <h1 className="text-2xl md:text-3xl font-poppins font-bold text-admin-dark">Pengaturan</h1>
        <p className="text-sm text-admin-secondary mt-1">Kelola metadata global website dan konten footer.</p>
      </div>

      <Tabs.Root defaultValue="general" className="flex flex-col">
        <Tabs.List className="flex shrink-0 border-b border-admin-border mb-6">
          <Tabs.Trigger 
            value="general" 
            className="px-5 py-3 font-medium text-sm text-admin-secondary data-[state=active]:text-sougen-blue data-[state=active]:border-b-2 data-[state=active]:border-sougen-blue transition-all outline-none flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            Pengaturan Umum (SEO)
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="footer" 
            className="px-5 py-3 font-medium text-sm text-admin-secondary data-[state=active]:text-sougen-blue data-[state=active]:border-b-2 data-[state=active]:border-sougen-blue transition-all outline-none flex items-center gap-2"
          >
            <LayoutTemplate className="w-4 h-4" />
            Pengaturan Footer
          </Tabs.Trigger>
        </Tabs.List>

        {/* --- PENGATURAN UMUM TAB --- */}
        <Tabs.Content value="general" className="outline-none space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-admin-border p-6 max-w-3xl">
            <h2 className="text-lg font-poppins font-bold text-admin-dark mb-4 border-b border-admin-border pb-2">Gambar Latar Hero (Beranda)</h2>
            <p className="text-sm text-admin-secondary mb-6">Latar belakang saat tidak ada event aktif (Template Mode).</p>
            
            <div>
              {settings.heroImageUrl && (
                <div className="mb-4 w-full max-w-md aspect-video bg-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                  <img src={getImageUrl(settings.heroImageUrl)} alt="Hero" className="w-full h-full object-cover" />
                </div>
              )}
              
              <div>
                <input type="file" accept="image/*" className="hidden" ref={heroInputRef} onChange={handleUploadHero} />
                <button 
                  type="button" 
                  onClick={() => heroInputRef.current?.click()}
                  disabled={isUploadingHero}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm font-medium text-admin-dark border border-gray-300 rounded-lg transition-colors cursor-pointer"
                >
                  {isUploadingHero ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                  {settings.heroImageUrl ? 'Ganti Gambar Hero' : 'Unggah Gambar Hero'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-admin-border p-6 max-w-3xl">
            <h2 className="text-lg font-poppins font-bold text-admin-dark mb-4 border-b border-admin-border pb-2">Metadata Global</h2>
            <p className="text-sm text-admin-secondary mb-6">Pengaturan ini akan memengaruhi SEO (Search Engine Optimization) dari situs web Anda.</p>
            
            <form onSubmit={handleSaveTextSettings} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-admin-dark mb-1">Judul Situs (Site Title)</label>
                <input 
                  value={settings.siteTitle}
                  onChange={(e) => setSettings({...settings, siteTitle: e.target.value})}
                  className="w-full px-4 py-2 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-colors"
                  placeholder="Contoh: Sougen Makassar"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-admin-dark mb-1">Deskripsi Situs (Meta Description)</label>
                <textarea 
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-colors resize-none"
                  placeholder="Deskripsi singkat yang muncul di Google..."
                  required
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-sougen-blue text-white text-sm font-medium rounded-lg hover:bg-sougen-blue/90 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan Teks Pengaturan
                </button>
              </div>
            </form>
          </div>
        </Tabs.Content>

        {/* --- PENGATURAN FOOTER TAB --- */}
        <Tabs.Content value="footer" className="outline-none space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-admin-border p-6 max-w-3xl">
            <h2 className="text-lg font-poppins font-bold text-admin-dark mb-4 border-b border-admin-border pb-2">Konten Footer</h2>
            
            <form onSubmit={handleSaveTextSettings} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-admin-dark mb-1">Deskripsi Singkat Footer</label>
                <textarea 
                  value={settings.footerDescription}
                  onChange={(e) => setSettings({...settings, footerDescription: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-colors resize-none"
                  placeholder="Tuliskan deskripsi Sougen yang tampil di Footer..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-admin-dark mb-1">Teks Hak Cipta (Copyright)</label>
                <input 
                  value={settings.footerCopyright}
                  onChange={(e) => setSettings({...settings, footerCopyright: e.target.value})}
                  className="w-full px-4 py-2 border border-admin-border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-colors"
                  placeholder="© 2026 Sougen..."
                  required
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-sougen-blue text-white text-sm font-medium rounded-lg hover:bg-sougen-blue/90 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan Footer
                </button>
              </div>
            </form>
          </div>

          {/* Preview Footer */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Live Preview (Bagian Bawah Footer)</h3>
            <div className="border border-admin-border rounded-xl overflow-hidden shadow-sm">
              <footer className="bg-[#111111] text-gray-300 py-12 px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
                  
                  {/* Left Column */}
                  <div className="max-w-sm">
                    <h2 className="text-2xl font-bold font-poppins text-white mb-4">SOUGEN.</h2>
                    <p className="text-sm leading-relaxed opacity-80">
                      {settings.footerDescription}
                    </p>
                  </div>

                  {/* Mock Links Column */}
                  <div className="flex gap-16">
                    <div>
                      <h4 className="text-white font-semibold mb-4">Links</h4>
                      <ul className="space-y-2 text-sm opacity-80">
                        <li><span className="hover:text-white cursor-pointer">Home</span></li>
                        <li><span className="hover:text-white cursor-pointer">Events</span></li>
                        <li><span className="hover:text-white cursor-pointer">Gallery</span></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-sm opacity-60 text-center md:text-left">
                  {settings.footerCopyright}
                </div>
              </footer>
            </div>
          </div>

        </Tabs.Content>
      </Tabs.Root>

    </div>
  );
}