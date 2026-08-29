import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CalendarSearch, UserCircle, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';

export function BottomNav() {
  const location = useLocation();
  
  // Halaman yang menerapkan logika "One-Time Reveal on First Scroll"
  const isHome = location.pathname === '/';
  const isEvent = location.pathname === '/event';
  const isEventDetail = location.pathname.startsWith('/event/');
  
  const isOneTimeRevealPage = isHome || isEvent || isEventDetail;
  
  const [isVisible, setIsVisible] = useState(!isOneTimeRevealPage);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Multi-Layer Virtual Keyboard & Form Focus Detector (Capture Phase + Visual Viewport + Active Element)
  useEffect(() => {
    const isFormElement = (el: Element | null): boolean => {
      if (!el) return false;
      const tag = el.tagName;
      return (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        (el as HTMLElement).isContentEditable
      );
    };

    const updateKeyboardStatus = () => {
      const isFocused = isFormElement(document.activeElement);
      let isViewportShrunk = false;
      if (window.visualViewport) {
        isViewportShrunk = window.innerHeight - window.visualViewport.height > 100;
      }
      setIsKeyboardOpen(isFocused || isViewportShrunk);
    };

    const handleFocus = (e: Event) => {
      if (isFormElement(e.target as Element)) {
        setIsKeyboardOpen(true);
      }
    };

    const handleBlur = () => {
      // Delay sejenak untuk menangani perpindahan antar input
      setTimeout(updateKeyboardStatus, 100);
    };

    // 1. Capture Phase Listeners pada Window (Bekerja di semua browser mobile Android & iOS)
    window.addEventListener('focus', handleFocus, true);
    window.addEventListener('blur', handleBlur, true);
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);

    // 2. Visual Viewport API
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateKeyboardStatus);
      window.visualViewport.addEventListener('scroll', updateKeyboardStatus);
    }
    window.addEventListener('resize', updateKeyboardStatus);

    return () => {
      window.removeEventListener('focus', handleFocus, true);
      window.removeEventListener('blur', handleBlur, true);
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateKeyboardStatus);
        window.visualViewport.removeEventListener('scroll', updateKeyboardStatus);
      }
      window.removeEventListener('resize', updateKeyboardStatus);
    };
  }, []);

  useEffect(() => {
    // Jika BUKAN halaman home, event, atau detail event, langsung tampilkan selalu
    if (!isOneTimeRevealPage) {
      setIsVisible(true);
      return;
    }

    // Jika posisi scroll saat pertama load sudah > 50px, langsung tampilkan
    if (window.scrollY > 50) {
      setIsVisible(true);
      return;
    }

    // Sembunyikan di awal hanya untuk halaman home, event, dan detail event saat di posisi top
    setIsVisible(false);

    const handleFirstScroll = () => {
      if (window.scrollY > 50) {
        setIsVisible(true);
        // Setelah muncul satu kali, lepaskan listener agar terkunci tampil dan tidak pernah goyang/sembunyi lagi
        window.removeEventListener('scroll', handleFirstScroll);
      }
    };

    window.addEventListener('scroll', handleFirstScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleFirstScroll);
  }, [location.pathname, isOneTimeRevealPage]);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Events', path: '/event', icon: CalendarSearch },
    { name: 'About', path: '/about', icon: UserCircle },
    { name: 'Contact', path: '/contact', icon: MessageSquare },
  ];

  // Sembunyikan jika belum terpicu scroll ATAU saat keyboard virtual HP / form input sedang aktif
  const shouldShow = isVisible && !isKeyboardOpen;

  return (
    <nav 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 h-20 items-center justify-around border-t border-black/5 bg-white/95 backdrop-blur-sm lg:hidden transition-all duration-200 ease-in-out",
        shouldShow ? "flex translate-y-0 opacity-100" : "hidden translate-y-full opacity-0 pointer-events-none"
      )}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
        const Icon = item.icon;

        return (
          <Link
            key={item.path}
            to={item.path}
            className="flex-1 flex items-center justify-center h-full"
          >
            <div
              className={cn(
                'flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-300 space-y-1',
                isActive ? 'bg-sougen-blue/10 text-sougen-blue' : 'text-rpo-black/40 hover:text-rpo-black/70'
              )}
            >
              <Icon className={cn('h-6 w-6', isActive ? 'text-sougen-blue' : 'text-rpo-black/40')} />
              <span className="text-[10px] font-inter font-bold uppercase tracking-wider mt-1">
                {item.name}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
