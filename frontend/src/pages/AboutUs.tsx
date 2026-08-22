import { SEO } from '../components/ui/SEO';
import { Trophy, Users, HeartHandshake, Flag } from 'lucide-react';
import { useAbout } from '../hooks/useAbout';
import { SectionHeader } from '../components/shared/SectionHeader';
import { Skeleton } from '../components/ui/Skeleton';
import { ImageWithSkeleton } from '../components/ui/ImageWithSkeleton';
import { TalentCard } from '../components/shared/TalentCard';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  const { content, team, stats, loading, error } = useAbout();

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] text-rpo-black">
      <SEO 
        title="Tentang Kami | Sougen Creative Management" 
        description="Mengenal sejarah, visi, misi, nilai-nilai komunitas, dan profil tim kreatif di balik kesuksesan berbagai perhelatan Sougen Creative Management." 
        canonicalUrl="/about"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Sougen Creative Management",
          "alternateName": ["Sougen", "Reality Project Organizer", "RPO"],
          "url": typeof window !== 'undefined' ? `${window.location.origin}/about` : "https://sougen.id/about",
          "logo": `${typeof window !== 'undefined' ? window.location.origin : "https://sougen.id"}/images/main-logo.png`,
          "description": "Mengenal sejarah, visi, misi, nilai-nilai komunitas, dan profil tim kreatif di balik kesuksesan berbagai perhelatan Sougen Creative Management.",
          "sameAs": [
            "https://www.instagram.com/sougen.id"
          ]
        }}
      />

      {/* Intro Section */}
      <div className="w-full bg-[#00486E] pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
          <SectionHeader 
            as="h1"
            label="GET TO KNOW"
            title="ABOUT US"
            description="Kisah, visi, misi, serta profil tim di balik layar kesuksesan Sougen Creative Management di Makassar."
            theme="dark"
            align="full-center"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-24 py-16 space-y-16 lg:space-y-20">
        
        {/* Kisah Perjalanan (Sejarah) */}
        <section>
          {error ? (
            <div className="text-center py-10">
              <p className="text-sougen-blue font-inter text-lg">Gagal memuat profil. Silakan coba lagi nanti.</p>
            </div>
          ) : loading ? (
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <Skeleton className="w-full md:w-1/2 h-64 bg-black/5 rounded-none" />
              <div className="w-full md:w-1/2 space-y-4">
                <Skeleton className="h-6 w-full bg-black/5" />
                <Skeleton className="h-6 w-5/6 bg-black/5" />
                <Skeleton className="h-6 w-4/5 bg-black/5" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-12 items-center">
              {/* Foto Story */}
              <div className="w-full md:w-1/2">
                {content?.storyImageUrl ? (
                  <div className="relative overflow-hidden border-2 border-rpo-black/10 shadow-elevated aspect-video md:aspect-[4/3] rounded-xl">
                    <ImageWithSkeleton 
                      src={content.storyImageUrl} 
                      alt="Foto Profil Kisah Sougen Creative Management" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 md:h-80 bg-black/5 rounded-xl border border-black/10 flex items-center justify-center">
                    <span className="text-rpo-black/40 font-inter">Belum ada foto profil</span>
                  </div>
                )}
              </div>
              
              {/* Teks Story dengan Aksen Garis Biru Sougen */}
              <div className="w-full md:w-1/2 relative pl-6 border-l-4 border-sougen-blue">
                <h2 className="font-poppins text-3xl md:text-4xl font-black text-rpo-black mb-6 uppercase tracking-tight">
                  Kisah Perjalanan
                </h2>
                <div className="font-inter text-rpo-black/70 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                  {content?.storyText || 'Belum ada cerita yang ditambahkan.'}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Visi & Misi */}
        {!loading && !error && (
          <section className="bg-white rounded-xl border border-rpo-black/5 p-8 md:p-12 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <SectionHeader 
                  label="Tujuan Kami"
                  title="Visi"
                  theme="light"
                  align="full-center"
                  className="mb-8 md:!items-start [&>div]:md:!items-start"
                />
                <p className="font-inter text-rpo-black/70 leading-relaxed text-lg">
                  {content?.visionText || 'Belum ada visi yang ditetapkan.'}
                </p>
              </div>
              <div>
                <SectionHeader 
                  label="Cara Kami"
                  title="Misi"
                  theme="light"
                  align="full-center"
                  className="mb-8 md:!items-start [&>div]:md:!items-start"
                />
                {content?.missionList && content.missionList.length > 0 ? (
                  <ul className="space-y-6">
                    {content.missionList.map((mission, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <span className="shrink-0 flex items-center justify-center w-10 h-10 bg-sougen-blue text-white text-lg font-black font-poppins rounded-sm shadow-sm">
                          {idx + 1}
                        </span>
                        <span className="font-inter text-rpo-black/70 leading-relaxed text-lg pt-1">
                          {mission}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-inter text-rpo-black/70">Belum ada daftar misi.</p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Statistik Pencapaian */}
        <section>
          <SectionHeader 
            label="Pencapaian"
            title="Statistik Kami"
            theme="light"
            align="center"
            className="mb-12"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="flex flex-col items-center justify-center p-6 md:p-8 bg-white border-2 border-sougen-blue/10 rounded-xl text-center shadow-sm hover:border-sougen-blue transition-colors duration-300">
              <Trophy className="w-8 h-8 md:w-10 md:h-10 text-sougen-blue mb-3 md:mb-4" />
              <span className="font-poppins text-4xl md:text-5xl lg:text-6xl font-black text-rpo-black mb-1 md:mb-2">
                {loading ? '-' : stats?.events || 0}
              </span>
              <span className="font-inter text-rpo-black/50 uppercase tracking-[0.05em] md:tracking-[0.1em] text-[10px] md:text-xs lg:text-sm font-bold">
                Event Sukses
              </span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-6 md:p-8 bg-white border-2 border-sougen-blue/10 rounded-xl text-center shadow-sm hover:border-sougen-blue transition-colors duration-300">
              <Users className="w-8 h-8 md:w-10 md:h-10 text-sougen-blue mb-3 md:mb-4" />
              <span className="font-poppins text-4xl md:text-5xl lg:text-6xl font-black text-rpo-black mb-1 md:mb-2">
                {loading ? '-' : stats?.talents || 0}
              </span>
              <span className="font-inter text-rpo-black/50 uppercase tracking-[0.05em] md:tracking-[0.1em] text-[10px] md:text-xs lg:text-sm font-bold">
                Talent Tersalurkan
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-6 md:p-8 bg-white border-2 border-sougen-blue/10 rounded-xl text-center shadow-sm hover:border-sougen-blue transition-colors duration-300">
              <HeartHandshake className="w-8 h-8 md:w-10 md:h-10 text-sougen-blue mb-3 md:mb-4" />
              <span className="font-poppins text-4xl md:text-5xl lg:text-6xl font-black text-rpo-black mb-1 md:mb-2">
                {loading ? '-' : stats?.communities || 0}
              </span>
              <span className="font-inter text-rpo-black/50 uppercase tracking-[0.05em] md:tracking-[0.1em] text-[10px] md:text-xs lg:text-sm font-bold">
                Mitra Komunitas
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-6 md:p-8 bg-white border-2 border-sougen-blue/10 rounded-xl text-center shadow-sm hover:border-sougen-blue transition-colors duration-300">
              <Flag className="w-8 h-8 md:w-10 md:h-10 text-sougen-blue mb-3 md:mb-4" />
              <span className="font-poppins text-4xl md:text-5xl lg:text-6xl font-black text-rpo-black mb-1 md:mb-2">
                2015
              </span>
              <span className="font-inter text-rpo-black/50 uppercase tracking-[0.05em] md:tracking-[0.1em] text-[10px] md:text-xs lg:text-sm font-bold">
                Tahun Berdiri
              </span>
            </div>
          </div>
        </section>

        {/* Tim Kami */}
        <section>
          <SectionHeader 
            label="Di Balik Layar"
            title="Kru RPO"
            description="Merekalah yang bekerja di balik layar, mewujudkan setiap acara menjadi sebuah pengalaman yang berkesan."
            theme="light"
            align="center"
            className="mb-12"
          />

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="w-full aspect-[3/4] bg-black/5 rounded-xl" />
                </div>
              ))}
            </div>
          ) : team.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-rpo-black/50 font-inter">Belum ada data anggota tim.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {team.map((member) => (
                <TalentCard 
                  key={member.id}
                  name={member.name}
                  role={member.role}
                  imageUrl={member.profileImageUrl}
                  showStats={false}
                />
              ))}
            </div>
          )}
        </section>

        {/* CTA Penutup */}
        <section className="bg-[#00486E] rounded-2xl p-8 md:p-12 lg:p-16 text-center shadow-lg relative overflow-hidden">
          {/* Subtle Background Pattern/Gradient */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_100%)] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-poppins text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-wide">
              Mari Berkolaborasi!
            </h2>
            <p className="font-inter text-white/80 text-base md:text-lg mb-8 leading-relaxed">
              Kami selalu terbuka untuk ide-ide baru, kemitraan, dan peluang untuk menciptakan acara budaya pop Jepang yang lebih meriah dan tak terlupakan di Makassar.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/community"
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-sougen-blue hover:text-sougen-green-dark font-poppins font-bold rounded-full shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300 uppercase tracking-wide text-sm"
              >
                Lihat Komunitas Mitra
              </Link>
              <Link 
                to="/contact"
                className="w-full sm:w-auto px-8 py-3.5 bg-transparent border-2 border-white text-white font-poppins font-bold rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-300 uppercase tracking-wide text-sm"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
