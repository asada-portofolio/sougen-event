import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const createPageArray = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push('ellipsis');
    }

    // Show pages around current
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis');
    }

    // Always show last page
    pages.push(totalPages);

    return pages;
  };

  const pages = createPageArray();

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={cn('flex items-center justify-center space-x-2', className)}
    >
      <Button
        variant="outlined"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-2 hover:border-sougen-blue hover:text-sougen-blue transition-colors"
        aria-label="Previous Page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <ul className="flex items-center space-x-1">
        {pages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <li key={`ellipsis-${index}`} className="flex h-9 w-9 items-center justify-center text-rpo-black/50">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Lebih banyak halaman</span>
              </li>
            );
          }

          const isActive = currentPage === page;

          return (
            <li key={page}>
              <Button
                variant={isActive ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onPageChange(page)}
                className={cn(
                  'h-9 w-9 p-0 font-bold transition-colors',
                  isActive
                    ? 'bg-sougen-blue text-white hover:bg-sougen-blue/90 border border-sougen-blue shadow-sm'
                    : 'text-rpo-black/60 hover:text-sougen-blue hover:bg-sougen-blue/10'
                )}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Page ${page}`}
              >
                {page}
              </Button>
            </li>
          );
        })}
      </ul>

      <Button
        variant="outlined"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-2 hover:border-sougen-blue hover:text-sougen-blue transition-colors"
        aria-label="Next Page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
