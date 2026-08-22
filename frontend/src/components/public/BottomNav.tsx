import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CalendarSearch, UserCircle, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';

export function BottomNav() {
  const location = useLocation();
  
  // Jika rute saat ini adalah event detail atau halaman line-up
  const isEventDetail = location.pathname.startsWith('/event/') && location.pathname !== '/event';
  const isLineUp = location.pathname === '/lineup' || location.pathname === '/line-up';
  const isAbout = location.pathname === '/about';
  
  const alwaysVisiblePages = isEventDetail || isLineUp || isAbout;
  
  const [isVisible, setIsVisible] = useState(alwaysVisiblePages);

  useEffect(() => {
    // Jika berada di halaman yang diatur selalu terlihat, pastikan muncul
    if (alwaysVisiblePages) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      // Muncul setelah user melakukan scroll lebih dari 50px
      if (window.scrollY > 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Cek inisial saat pertama render (jika di-refresh saat posisi sudah di bawah)
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isEventDetail]);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Events', path: '/event', icon: CalendarSearch },
    { name: 'About', path: '/about', icon: UserCircle },
    { name: 'Contact', path: '/contact', icon: MessageSquare },
  ];

  return (
    <nav 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 flex h-20 items-center justify-around border-t border-black/5 bg-white/95 backdrop-blur-sm lg:hidden transition-transform duration-500 ease-in-out",
        isVisible ? "translate-y-0" : "translate-y-full"
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
