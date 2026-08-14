import { useRef, useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithSkeleton } from '../ui/ImageWithSkeleton';
import { cn } from '../../lib/utils';

export interface FilmstripItem {
  id: number | string;
  imageUrl: string;
  title?: string;
  caption?: string;
}

export interface FilmstripCarouselProps {
  items: FilmstripItem[];
  className?: string;
}

export function FilmstripCarousel({ items, className }: FilmstripCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0, isDown: false });

  // --- Scroll state check ---
  const checkScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScrollState();
    el.addEventListener('scroll', checkScrollState, { passive: true });
    window.addEventListener('resize', checkScrollState);
    return () => {
      el.removeEventListener('scroll', checkScrollState);
      window.removeEventListener('resize', checkScrollState);
    };
  }, [checkScrollState, items]);

  // --- Arrow scroll ---
  const scrollBy = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.7;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // --- Drag-to-scroll ---
  const handlePointerDown = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current = { startX: e.clientX, scrollLeft: el.scrollLeft, isDown: true };
    setIsDragging(false);
    el.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.isDown) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 3) setIsDragging(true);
    el.scrollLeft = dragState.current.scrollLeft - dx;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    dragState.current.isDown = false;
    const el = scrollRef.current;
    if (el) el.releasePointerCapture(e.pointerId);
    // Reset drag state after a short delay so clicks on children still work
    setTimeout(() => setIsDragging(false), 50);
  };

  if (!items || items.length === 0) return null;

  return (
    <div className={cn('relative group/carousel', className)}>
      {/* Arrow buttons — visible on hover, desktop only */}
      {canScrollLeft && (
        <button
          onClick={() => scrollBy('left')}
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-rpo-black/80 text-white opacity-0 transition-all duration-300 hover:bg-rpo-black group-hover/carousel:opacity-100 focus:outline-none focus:ring-2 focus:ring-rpo-red hidden md:flex"
          aria-label="Scroll kiri"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scrollBy('right')}
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-rpo-black/80 text-white opacity-0 transition-all duration-300 hover:bg-rpo-black group-hover/carousel:opacity-100 focus:outline-none focus:ring-2 focus:ring-rpo-red hidden md:flex"
          aria-label="Scroll kanan"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Edge fade indicators */}
      {canScrollLeft && (
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-16 bg-gradient-to-r from-[#FAFAFA] to-transparent" />
      )}
      {canScrollRight && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[5] w-16 bg-gradient-to-l from-[#FAFAFA] to-transparent" />
      )}

      {/* Scrollable filmstrip track */}
      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={cn(
          'flex gap-4 overflow-x-auto scroll-smooth pb-4 no-scrollbar',
          isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
        )}
        style={{ touchAction: 'pan-y' }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="shrink-0 snap-start first:ml-0"
          >
            <div className="group/card relative w-[220px] sm:w-[260px] md:w-[280px] overflow-hidden rounded-xl">
              {/* Portrait image */}
              <div className="aspect-[3/4] w-full overflow-hidden bg-[#e8e8e8]">
                <ImageWithSkeleton
                  src={item.imageUrl}
                  alt={item.title || 'Activity photo'}
                  containerClassName="h-full w-full"
                  className="transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/card:scale-105"
                />
              </div>

              {/* Gradient overlay from bottom for text/caption */}
              {(item.title || item.caption) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-16">
                  {item.title && (
                    <h4 className="font-poppins text-sm font-bold text-white leading-tight">
                      {item.title}
                    </h4>
                  )}
                  {item.caption && (
                    <p className="mt-1 text-xs text-white/70 leading-relaxed line-clamp-2">
                      {item.caption}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
