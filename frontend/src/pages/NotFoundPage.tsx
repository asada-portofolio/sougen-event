import { Link } from 'react-router-dom';
import { Home, Calendar, Users, Image, HelpCircle, ArrowLeft } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  const quickLinks = [
    { to: '/event', label: 'Jelajahi Event', icon: Calendar, desc: 'Lihat daftar acara mendatang & arsip event kami' },
    { to: '/lineup', label: 'Our Line-Up', icon: Users, desc: 'Bintang tamu dan talent performer' },
    { to: '/gallery', label: 'Galeri Foto', icon: Image, desc: 'Koleksi dokumentasi visual acara' },
    { to: '/faq', label: 'Pusat Bantuan / FAQ', icon: HelpCircle, desc: 'Pertanyaan yang sering diajukan' },
  ];

  return (
    <>
      <SEO 
        title="404: Halaman Tidak Ditemukan | Sougen Creative Management" 
        description="Maaf, halaman yang Anda cari tidak dapat ditemukan. Silakan kembali ke beranda atau jelajahi halaman acara dan informasi lainnya di website resmi Sougen Creative Management."
      />

      <div className="min-h-[80vh] flex items-center justify-center pt-28 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#ffffff]">
        <div className="max-w-3xl w-full text-center">
          {/* Badge & Decorative 404 Number */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sougen-blue/10 text-sougen-blue-dark border border-sougen-blue/30 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            Error 404
          </div>

          <div className="relative mb-6">
            <span className="font-poppins text-8xl sm:text-9xl md:text-[11rem] font-black text-sougen-blue/15 select-none leading-none tracking-tighter">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-sougen-blue text-white w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-lg shadow-sougen-blue/30 transform -rotate-6">
                <ArrowLeft className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Heading (1 h1 per page) */}
          <h1 className="font-poppins text-3xl sm:text-4xl md:text-5xl font-black text-rpo-black uppercase tracking-tight mb-4">
            Halaman Tidak Ditemukan
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-rpo-black/80 font-inter leading-relaxed mb-8">
            Tautan yang Anda tuju mungkin salah ketik, telah dipindahkan, atau sudah tidak tersedia lagi di website Sougen Creative Management.
          </p>

          {/* Primary & Secondary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Button asChild size="lg" variant="primary" className="h-12 px-8 text-sm font-bold uppercase tracking-wider shadow-md shadow-sougen-blue/20">
              <Link to="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Kembali ke Beranda
              </Link>
            </Button>
            <Button asChild size="lg" variant="outlined" className="h-12 px-8 text-sm font-bold uppercase tracking-wider">
              <Link to="/event" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Jelajahi Event
              </Link>
            </Button>
          </div>

          {/* Quick Links Suggestions */}
          <div className="pt-8 border-t border-rpo-black/10">
            <p className="text-xs uppercase font-bold tracking-widest text-rpo-black/75 mb-6">
              Atau kunjungi halaman populer berikut
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {quickLinks.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="p-4 rounded-xl bg-white border border-rpo-black/10 hover:border-sougen-blue/40 hover:shadow-md transition-all duration-300 group flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-sougen-blue/10 text-sougen-blue-dark flex items-center justify-center shrink-0 group-hover:bg-sougen-blue group-hover:text-white transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-poppins font-bold text-sm text-rpo-black group-hover:text-sougen-blue transition-colors">
                        {item.label}
                      </h3>
                      <p className="font-inter text-xs text-rpo-black/75 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
