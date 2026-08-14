import { useState } from 'react';
import { SEO } from '../components/ui/SEO';
import { useTalents } from '../hooks/useTalents';
import { TalentCard } from '../components/shared/TalentCard';
import { Pagination } from '../components/shared/Pagination';
import { Skeleton } from '../components/ui/Skeleton';
import { SectionHeader } from '../components/shared/SectionHeader';

const ITEMS_PER_PAGE = 12;

export default function LineUp() {
  const { talents, loading, error } = useTalents();
  const [currentPage, setCurrentPage] = useState(1);

  if (error) {
    return (
      <div className="w-full min-h-[70vh] bg-[#FAFAFA] flex items-center justify-center pt-24">
        <p className="text-rpo-red font-inter text-lg">Gagal memuat katalog talent. Silakan coba lagi nanti.</p>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(talents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTalents = talents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] pt-24 md:pt-32 pb-16">
      <SEO 
        title="Katalog Talent & Line Up | Reality Project Organizer"
        description="Jelajahi galeri bintang tamu, cosplayer, idol, dan performer berbakat yang pernah atau akan meramaikan panggung RPO."
        canonicalUrl="/line-up"
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <SectionHeader 
          label="Hall of Fame"
          title="Katalog Talent & Line Up"
          description="Galeri bintang tamu dan performer berbakat yang turut meramaikan sejarah panggung RPO"
          theme="light"
          className="mb-12"
        />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Skeleton key={i} className="w-full aspect-[3/4] bg-black/5 rounded-sm" />
            ))}
          </div>
        ) : talents.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-rpo-black/70 font-inter text-lg">Belum ada data talent saat ini.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {currentTalents.map(talent => (
                <TalentCard 
                  key={talent.id}
                  name={talent.stageName}
                  role={talent.bio || ''}
                  imageUrl={talent.profileImageUrl || ''}
                  instagramUrl={talent.instagramUrl || ''}
                />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center">
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}