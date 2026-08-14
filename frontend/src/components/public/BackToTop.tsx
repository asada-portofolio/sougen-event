import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '../../lib/utils';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Tampilkan tombol jika scroll melebihi 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to Top"
      className={cn(
        "fixed z-50 p-3 rounded-full bg-rpo-red text-white shadow-lg",
        "transition-all duration-300 ease-in-out hover:bg-rpo-black hover:scale-110 focus:outline-none focus:ring-4 focus:ring-rpo-red/30",
        "right-4 bottom-28 lg:right-8 lg:bottom-8",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      )}
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
}
