import { useState } from 'react';
import { SEO } from '../components/ui/SEO';
import { usePrograms } from '../hooks/usePrograms';
import { ProgramCard } from '../components/program/ProgramCard';
import { Pagination } from '../components/shared/Pagination';
import { Skeleton } from '../components/ui/Skeleton';
import { SectionHeader } from '../components/shared/SectionHeader';

const ITEMS_PER_PAGE = 6; // Set to 6 since cards are large

export default function Programs() {
  const { programs, loading, error } = usePrograms();
  const [currentPage, setCurrentPage] = useState(1);

  if (error) {
    return (
      <div className="w-full min-h-[70vh] bg-[#FAFAFA] flex items-center justify-center pt-24">
        <p className="text-rpo-red font-inter text-lg">Gagal memuat daftar program. Silakan coba lagi nanti.</p>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(programs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPrograms = programs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] pt-24 md:pt-32 pb-16">
      <SEO 
        title="Program & Kegiatan | Reality Project Organizer"
        description="Temukan berbagai program, kompetisi, dan kegiatan seru yang rutin digelar di setiap event Reality Project Organizer."
        canonicalUrl="/programs"
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <SectionHeader 
          label="Aktivitas Acara"
          title="Program & Kegiatan"
          description="Eksplorasi lini program reguler, kompetisi cosplay, hingga kegiatan seru komunitas yang menjadi denyut nadi di setiap perhelatan kami."
          theme="light"
          align="left"
          className="mb-12"
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="w-full h-[500px] bg-black/5 rounded-xl border border-black/10" />
            ))}
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-20 bg-white border border-rpo-black/5 rounded-xl">
            <p className="text-rpo-black/50 font-inter text-lg">Belum ada data program saat ini.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPrograms.map(program => (
                <ProgramCard 
                  key={program.id}
                  program={program}
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