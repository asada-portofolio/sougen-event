import { useState, useEffect, lazy, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowLeft, Image as ImageIcon, HelpCircle } from 'lucide-react';

import { cn } from '../../lib/utils';

const SideMenu = lazy(() => import('./SideMenu').then(m => ({ default: m.SideMenu })));

export function Navbar() {
  const location = useLocation();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsSideMenuOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsSideMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navLinksLeft = [
    { name: 'Home', path: '/' },
    { name: 'Event', path: '/event' },
  ];

  const resourceLinks = [
    { name: 'Gallery', path: '/gallery', icon: ImageIcon, desc: 'Dokumentasi foto event' },
    { name: 'FAQ', path: '/faq', icon: HelpCircle, desc: 'Tanya jawab & bantuan' },
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
            ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.08)] border-b border-black/[0.04]'
            : 'bg-gradient-to-b from-black/60 to-transparent'
        )}
      >
        <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6 md:px-10 lg:px-12">
          
          {/* Sisi Kiri: Logo & Teks RPO / Tombol Kembali */}
          <div className="flex items-center w-auto md:w-[170px]">
            {leftNav.type === 'back' ? (
              <Link 
                to={leftNav.to} 
                className={cn(
                  "flex items-center gap-2 transition-colors duration-300",
                  isScrolled ? "text-rpo-black hover:text-sougen-blue" : "text-white hover:text-sougen-blue"
                )}
              >
                <ArrowLeft className="w-4 h-4 lg:w-4 lg:h-4" />
                <span className="font-inter font-bold text-xs lg:text-[12px] uppercase tracking-wide">
                  {leftNav.label}
                </span>
              </Link>
            ) : (
              <Link to="/" className="relative flex items-center h-8 lg:h-9">
                {/* Logo Putih (Original) saat Navbar transparan / di atas */}
                <img 
                  src="/images/main-logo.png" 
                  alt="Sougen Logo" 
                  width={320}
                  height={240}
                  className={cn(
                    "h-8 lg:h-9 w-auto object-contain transition-opacity duration-500",
                    isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"
                  )}
                />
                {/* Logo Abu-abu saat Navbar putih / setelah di-scroll */}
                <img 
                  src="/images/logo-ver2.png" 
                  alt="Sougen Logo" 
                  width={320}
                  height={240}
                  className={cn(
                    "h-8 lg:h-9 w-auto object-contain absolute left-0 top-0 transition-opacity duration-500",
                    isScrolled ? "opacity-100" : "opacity-0 pointer-events-none"
                  )}
                />
              </Link>
            )}
          </div>

          {/* Sisi Tengah: Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 justify-center items-center gap-1.5">
            {navLinksLeft.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-xs lg:text-[13px] font-inter transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] select-none hover:scale-[1.03] active:scale-[0.97]',
                    isActive
                      ? isScrolled
                        ? 'bg-[#005A9C] text-white font-bold ring-1 ring-[#005A9C]/40 shadow-md shadow-[#005A9C]/20'
                        : 'bg-[#003B66]/65 backdrop-blur-md text-white font-bold ring-1 ring-white/40 shadow-[0_2px_10px_rgba(0,0,0,0.2)]'
                      : isScrolled
                        ? 'text-rpo-black/75 font-semibold hover:text-rpo-black hover:bg-black/5'
                        : 'text-white/90 font-semibold hover:text-white hover:bg-white/15'
                  )}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Hover Dropdown for Resources */}
            {(() => {
              const isResourcesActive = location.pathname.startsWith('/gallery') || location.pathname.startsWith('/faq');
              return (
                <div className="group relative flex items-center h-16 lg:h-14 cursor-pointer">
                  <button
                    className={cn(
                      "flex items-center space-x-1 px-3.5 py-1.5 rounded-full text-xs lg:text-[13px] font-inter transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus:outline-none select-none hover:scale-[1.03] active:scale-[0.97]",
                      isResourcesActive
                        ? isScrolled
                          ? 'bg-[#005A9C] text-white font-bold ring-1 ring-[#005A9C]/40 shadow-md shadow-[#005A9C]/20'
                          : 'bg-[#003B66]/65 backdrop-blur-md text-white font-bold ring-1 ring-white/40 shadow-[0_2px_10px_rgba(0,0,0,0.2)]'
                        : isScrolled
                          ? 'text-rpo-black/75 font-semibold hover:text-rpo-black hover:bg-black/5'
                          : 'text-white/90 font-semibold hover:text-white hover:bg-white/15'
                    )}
                  >
                    <span>Resources</span>
                    <ChevronDown className={cn(
                      "h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-180",
                      isResourcesActive ? "text-white" : isScrolled ? "text-rpo-black/70" : "text-white/80"
                    )} />
                  </button>
                  
                  {/* Dropdown Window - Positioned snug with seamless hover bridge */}
                  <div className="absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] pt-1.5 z-50 transform group-hover:translate-y-0 translate-y-1 pointer-events-none group-hover:pointer-events-auto">
                    <div className="min-w-[10.5rem] overflow-hidden rounded-xl border border-black/[0.08] bg-white p-1 shadow-[0_12px_28px_rgba(0,0,0,0.12)] space-y-0.5">
                      {resourceLinks.map((link) => {
                        const isSubActive = location.pathname.startsWith(link.path);
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.path}
                            to={link.path}
                            className={cn(
                              "relative flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-inter transition-all duration-200",
                              isSubActive
                                ? "bg-[#005A9C] text-white font-bold shadow-sm"
                                : "text-rpo-black/75 font-semibold hover:bg-sougen-blue/10 hover:text-sougen-blue"
                            )}
                          >
                            <Icon className={cn("h-3.5 w-3.5 shrink-0", isSubActive ? "text-white" : "text-sougen-blue")} />
                            <span className="leading-tight">{link.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Contact */}
            {(() => {
              const isContactActive = location.pathname === '/contact';
              return (
                <Link
                  to="/contact"
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-xs lg:text-[13px] font-inter transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] select-none hover:scale-[1.03] active:scale-[0.97]',
                    isContactActive
                      ? isScrolled
                        ? 'bg-[#005A9C] text-white font-bold ring-1 ring-[#005A9C]/40 shadow-md shadow-[#005A9C]/20'
                        : 'bg-[#003B66]/65 backdrop-blur-md text-white font-bold ring-1 ring-white/40 shadow-[0_2px_10px_rgba(0,0,0,0.2)]'
                      : isScrolled
                        ? 'text-rpo-black/75 font-semibold hover:text-rpo-black hover:bg-black/5'
                        : 'text-white/90 font-semibold hover:text-white hover:bg-white/15'
                  )}
                >
                  Contact
                </Link>
              );
            })()}
          </nav>

          {/* Sisi Kanan: Hamburger Menu Toggle (Desktop & Mobile) */}
          <div className="flex items-center justify-end w-auto md:w-[170px]">
            <button
              className={cn(
                'flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs lg:text-[13px] font-inter font-semibold transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus:outline-none select-none hover:scale-[1.03] active:scale-[0.97]',
                isSideMenuOpen
                  ? 'bg-[#005A9C] text-white font-bold ring-1 ring-[#005A9C]/40 shadow-md shadow-[#005A9C]/20'
                  : isScrolled
                    ? 'bg-black/5 hover:bg-black/10 text-rpo-black/80 hover:text-rpo-black ring-1 ring-black/10 shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 backdrop-blur-[4px] text-white/90 hover:text-white ring-1 ring-white/15 shadow-none hover:shadow-sm'
              )}
              onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
              aria-expanded={isSideMenuOpen}
              aria-label={isSideMenuOpen ? 'Tutup menu samping' : 'Buka menu samping'}
            >
              <span className="transition-opacity duration-300">{isSideMenuOpen ? 'Tutup' : 'Menu'}</span>
              <span className="relative flex items-center justify-center w-4 h-4 overflow-hidden">
                <Menu className={cn(
                  "h-4 w-4 absolute transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                  isSideMenuOpen ? "opacity-0 rotate-90 scale-50 pointer-events-none" : "opacity-100 rotate-0 scale-100"
                )} />
                <X className={cn(
                  "h-4 w-4 absolute transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                  isSideMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50 pointer-events-none"
                )} />
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* SideMenu for Mobile & Fullscreen (Loaded on demand) */}
      {isSideMenuOpen && (
        <Suspense fallback={null}>
          <SideMenu open={isSideMenuOpen} onOpenChange={setIsSideMenuOpen} />
        </Suspense>
      )}
    </>
  );
}
