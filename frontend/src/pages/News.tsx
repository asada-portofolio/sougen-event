import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InstagramIcon } from '../components/ui/icons';

export default function News() {
  return (
    <div className="min-h-screen bg-[#F6FFFF] text-rpo-black pt-28 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background radial pattern & glow accents */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0094DE 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-sougen-blue/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl mx-auto text-center relative z-10 flex flex-col items-center">
        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-poppins tracking-tight text-rpo-black mb-3">
          News & Updates
        </h1>
        <p className="text-sm sm:text-base text-rpo-black/60 max-w-lg mb-10 font-inter">
          Dapatkan berita terbaru, pengumuman event, dan kabar terkini seputar Sougen Creative.
        </p>

        {/* Mockup Card Container */}
        <div className="w-full max-w-md bg-white border border-sougen-blue/15 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,148,222,0.1)] relative mb-8">
          {/* Top Bar with 3 Dots & Coming Soon Badge */}
          <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] mb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
            </div>
            <span className="text-[11px] font-mono font-bold tracking-wider text-sougen-blue bg-sougen-blue/10 px-2.5 py-0.5 rounded-full border border-sougen-blue/20">
              Coming Soon
            </span>
          </div>

          {/* Skeleton Illustration Preview */}
          <div className="space-y-3 py-2 text-left">
            <div className="h-4 bg-rpo-black/10 rounded-md w-3/4 animate-pulse" />
            <div className="h-3 bg-rpo-black/5 rounded-md w-full" />
            <div className="h-3 bg-rpo-black/5 rounded-md w-5/6" />
            <div className="grid grid-cols-2 gap-3 pt-3">
              <div className="h-16 bg-[#F6FFFF] border border-sougen-blue/15 rounded-xl flex items-center justify-center">
                <div className="w-10 h-2 bg-rpo-black/10 rounded" />
              </div>
              <div className="h-16 bg-[#F6FFFF] border border-sougen-blue/15 rounded-xl flex items-center justify-center">
                <div className="w-10 h-2 bg-rpo-black/10 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <h2 className="text-lg sm:text-xl font-bold font-poppins text-rpo-black mb-2">
          Berita segera hadir
        </h2>
        <p className="text-xs sm:text-sm text-rpo-black/60 mb-6 max-w-sm font-inter">
          Konten berita dan artikel masih kami susun. Cek lagi nanti, ya.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href="https://instagram.com/rpo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-sougen-blue hover:bg-[#007cb8] text-white text-xs sm:text-sm font-bold font-inter shadow-md shadow-sougen-blue/20 transition-all duration-300 hover:scale-105"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Ikuti kami di Instagram</span>
          </a>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-rpo-black/70 hover:text-sougen-blue text-xs sm:text-sm font-semibold font-inter transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
