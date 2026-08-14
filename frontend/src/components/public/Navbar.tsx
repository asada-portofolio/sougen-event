import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowLeft } from 'lucide-react';

import { cn } from '../../lib/utils';
import { SideMenu } from './SideMenu';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { getImageUrl } from '../../utils/getImageUrl';

export function Navbar() {
  const location = useLocation();
  const { settings } = useSiteSettings();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinksLeft = [
    { name: 'Home', path: '/' },
    { name: 'Event', path: '/event' },
    { name: 'Community', path: '/community' },
    { name: 'About', path: '/about' },
  ];

  const resourceLinks = [
    { name: 'Gallery', path: '/gallery' },
    { name: 'FAQ', path: '/faq' },
  ];

  let leftNav = { type: 'logo', to: '/', label: '' };
  
  if (location.pathname.startsWith('/event/')) {
    leftNav = { type: 'back', to: '/event', label: 'Kembali' };
  } else if (location.pathname.startsWith('/gallery/')) {
    leftNav = { type: 'back', to: '/gallery', label: 'Kembali' };
  } else if (location.pathname === '/lineup' || location.pathname === '/talents') {
    leftNav = { type: 'back', to: '/', label: 'Kembali' };
  }

  return (
    <>
      <header
        style={{ paddingRight: 'var(--removed-body-scroll-bar-size)' }}
        className={cn(
          'fixed top-0 z-[100] w-full transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]'
            : 'bg-gradient-to-b from-black/60 to-transparent'
        )}
      >
        <div className="flex h-16 lg:h-14 w-full items-center justify-between px-6 md:px-10 lg:px-12">
          
          {/* Sisi Kiri: Logo & Teks RPO / Tombol Kembali */}
          <div className="flex items-center w-[200px] lg:w-[170px]">
            {leftNav.type === 'back' ? (
              <Link 
                to={leftNav.to} 
                className={cn(
                  "flex items-center gap-2 transition-colors duration-300",
                  isScrolled ? "text-rpo-black hover:text-rpo-red" : "text-white hover:text-rpo-red"
                )}
              >
                <ArrowLeft className="w-5 h-5 lg:w-4 lg:h-4" />
                <span className="font-inter font-bold text-sm lg:text-[12px] uppercase tracking-wide">
                  {leftNav.label}
                </span>
              </Link>
            ) : (
              <Link to="/" className="flex items-center gap-3">
                {settings?.logoUrl ? (
                  <img 
                    src={getImageUrl(settings.logoUrl)} 
                    alt="RPO Logo" 
                    className="h-8 lg:h-7 object-contain"
                  />
                ) : (
                  <div className="flex h-8 w-8 lg:h-7 lg:w-7 shrink-0 items-center justify-center rounded-sm bg-rpo-red text-white font-poppins font-black text-lg lg:text-base leading-none shadow-sm">
                    RP
                  </div>
                )}
                {!settings?.logoUrl && (
                  <div className={cn(
                    "hidden sm:flex flex-col font-poppins font-bold leading-[1.15] tracking-tight transition-colors duration-500",
                    isScrolled ? 'text-rpo-black' : 'text-white'
                  )}>
                    <span className="text-[10px] md:text-[11px] lg:text-[9.5px] uppercase">Reality</span>
                    <span className="text-[10px] md:text-[11px] lg:text-[9.5px] uppercase">Project</span>
                    <span className="text-[10px] md:text-[11px] lg:text-[9.5px] uppercase">Organizer</span>
                  </div>
                )}
              </Link>
            )}
          </div>

          {/* Sisi Tengah: Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 justify-center items-center space-x-6">
            {navLinksLeft.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'text-sm lg:text-[12px] font-inter font-bold transition-colors duration-300',
                    isActive
                      ? 'text-rpo-red'
                      : isScrolled
                        ? 'text-rpo-black/80 hover:text-rpo-red'
                        : 'text-white hover:text-rpo-red'
                  )}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Hover Dropdown for Resources */}
            <div className="group relative flex items-center h-16 lg:h-14 cursor-pointer">
              <button className={cn(
                "flex items-center space-x-1 text-sm lg:text-[12px] font-inter font-bold group-hover:text-rpo-red transition-colors duration-300 focus:outline-none",
                isScrolled ? 'text-rpo-black/80' : 'text-white'
              )}>
                <span>Resources</span>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              
              {/* Dropdown Window */}
              <div className="absolute top-14 left-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-2">
                <div className="z-50 min-w-[10rem] overflow-hidden rounded-xl border border-black/5 bg-white p-2 shadow-xl">
                  {resourceLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="relative flex cursor-pointer select-none items-center rounded-lg px-4 py-2 text-sm lg:text-xs font-inter font-bold text-rpo-black/70 outline-none transition-colors hover:bg-rpo-red hover:text-white"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact */}
            <Link
              to="/contact"
              className={cn(
                'text-sm lg:text-[12px] font-inter font-bold transition-colors duration-300',
                location.pathname === '/contact'
                  ? 'text-rpo-red'
                  : isScrolled
                    ? 'text-rpo-black/80 hover:text-rpo-red'
                    : 'text-white hover:text-rpo-red'
              )}
            >
              Contact
            </Link>
          </nav>

          {/* Sisi Kanan: Hamburger Menu Toggle (Desktop & Mobile) */}
          <div className="flex items-center justify-end w-[200px] lg:w-[170px]">
            <button
              className={cn(
                'flex h-12 w-12 lg:h-10 lg:w-10 items-center justify-center rounded-full transition-all duration-300 focus:outline-none',
                isSideMenuOpen 
                  ? 'bg-transparent text-white rotate-90 scale-110' // SideMenu overlay handles this visually
                  : isScrolled
                    ? 'text-rpo-black hover:bg-rpo-black/5'
                    : 'text-white hover:bg-white/10'
              )}
              onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
            >
              {isSideMenuOpen ? <X className="h-6 w-6 lg:h-5 lg:w-5 transition-transform" /> : <Menu className="h-6 w-6 lg:h-5 lg:w-5 transition-transform" />}
              <span className="sr-only">{isSideMenuOpen ? 'Tutup menu' : 'Buka menu'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* SideMenu for Mobile & Fullscreen */}
      <SideMenu open={isSideMenuOpen} onOpenChange={setIsSideMenuOpen} />
    </>
  );
}
