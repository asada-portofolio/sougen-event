import { SEO } from '../components/ui/SEO';
import { Trophy, Users, HeartHandshake } from 'lucide-react';
import { useAbout } from '../hooks/useAbout';
import { SectionHeader } from '../components/shared/SectionHeader';
import { Skeleton } from '../components/ui/Skeleton';
import { ImageWithSkeleton } from '../components/ui/ImageWithSkeleton';
import { TalentCard } from '../components/shared/TalentCard';

export default function AboutUs() {
  const { content, team, stats, loading, error } = useAbout();

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] text-rpo-black">
      <SEO 
        title="Tentang Kami | Reality Project Organizer" 
        description="Kisah, visi, misi, serta profil tim di balik layar kesuksesan Reality Project Organizer." 
        canonicalUrl="/about"
      />

      {/* Crimson Header Banner */}
      <div className="w-full bg-rpo-red pt-32 pb-12 px-4 text-center">
        <h1 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white mb-4">
          Tentang Kami
        </h1>
        <p className="font-inter text-white/90 max-w-2xl mx-auto text-lg">
          Kisah, visi, misi, serta profil tim di balik layar kesuksesan Reality Project Organizer.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 space-y-24">
        
        {/* Kisah Perjalanan (Sejarah) */}
        <section>
          {error ? (
            <div className="text-center py-10">
              <p className="text-rpo-red font-inter text-lg">Gagal memuat profil. Silakan coba lagi nanti.</p>
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
                      alt="Cerita RPO" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 md:h-80 bg-black/5 rounded-xl border border-black/10 flex items-center justify-center">
                    <span className="text-rpo-black/40 font-inter">Belum ada foto profil</span>
                  </div>
                )}
              </div>
              
              {/* Teks Story dengan Aksen Garis Merah */}
              <div className="w-full md:w-1/2 relative pl-6 border-l-4 border-rpo-red">
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
                  align="left"
                  className="mb-8"
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
                  align="left"
                  className="mb-8"
                />
                {content?.missionList && content.missionList.length > 0 ? (
                  <ul className="space-y-6">
                    {content.missionList.map((mission, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <span className="shrink-0 flex items-center justify-center w-10 h-10 bg-rpo-red text-white text-lg font-black font-poppins rounded-sm shadow-sm">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center justify-center p-8 bg-white border-2 border-rpo-red/10 rounded-xl text-center shadow-sm hover:border-rpo-red transition-colors duration-300">
              <Trophy className="w-10 h-10 text-rpo-red mb-4" />
              <span className="font-poppins text-5xl md:text-6xl font-black text-rpo-black mb-2">
                {loading ? '-' : stats?.events || 0}
              </span>
              <span className="font-inter text-rpo-black/50 uppercase tracking-[0.1em] text-sm font-bold">
                Event Sukses
              </span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-8 bg-white border-2 border-rpo-red/10 rounded-xl text-center shadow-sm hover:border-rpo-red transition-colors duration-300">
              <Users className="w-10 h-10 text-rpo-red mb-4" />
              <span className="font-poppins text-5xl md:text-6xl font-black text-rpo-black mb-2">
                {loading ? '-' : stats?.talents || 0}
              </span>
              <span className="font-inter text-rpo-black/50 uppercase tracking-[0.1em] text-sm font-bold">
                Talent Tersalurkan
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-8 bg-white border-2 border-rpo-red/10 rounded-xl text-center shadow-sm hover:border-rpo-red transition-colors duration-300">
              <HeartHandshake className="w-10 h-10 text-rpo-red mb-4" />
              <span className="font-poppins text-5xl md:text-6xl font-black text-rpo-black mb-2">
                {loading ? '-' : stats?.communities || 0}
              </span>
              <span className="font-inter text-rpo-black/50 uppercase tracking-[0.1em] text-sm font-bold">
                Mitra Komunitas
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
                />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
