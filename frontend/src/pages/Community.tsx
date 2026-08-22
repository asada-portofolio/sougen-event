import { useState } from 'react';
import { SEO } from '../components/ui/SEO';
import { useCommunities } from '../hooks/useCommunities';
import { CommunityCard } from '../components/community/CommunityCard';
import { Pagination } from '../components/shared/Pagination';
import { Skeleton } from '../components/ui/Skeleton';
import { SectionHeader } from '../components/shared/SectionHeader';

const ITEMS_PER_PAGE = 10;

export default function Community() {
  const { communities, loading, error } = useCommunities();
  const [currentPage, setCurrentPage] = useState(1);

  if (error) {
    return (
      <div className="w-full min-h-[70vh] bg-[#FAFAFA] flex items-center justify-center pt-24">
        <p className="text-sougen-blue font-inter text-lg">Gagal memuat daftar komunitas. Silakan coba lagi nanti.</p>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(communities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCommunities = communities.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA]">
      <SEO 
        title="Komunitas & Partner | Sougen Creative Management"
        description="Eksplorasi ragam komunitas pop-kultur, hobi, dan partner yang tergabung di dalam ekosistem Sougen Creative Management."
        canonicalUrl="/community"
      />

      {/* Intro Section */}
      <div className="w-full bg-[#00486E] pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
          <SectionHeader 
            as="h1"
            label="OUR PARTNERS"
            title="COMMUNITY"
            description="Eksplorasi keragaman komunitas penggiat hobi dan seni pop-kultur yang berkolaborasi dalam panggung karya kami."
            theme="dark"
            align="full-center"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="w-full h-80 bg-black/5 rounded-xl border border-black/10" />
            ))}
          </div>
        ) : communities.length === 0 ? (
          <div className="text-center py-20 bg-white border border-rpo-black/5 rounded-xl">
            <p className="text-rpo-black/50 font-inter text-lg">Belum ada data komunitas saat ini.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {currentCommunities.map(community => (
                <CommunityCard 
                  key={community.id}
                  community={community}
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