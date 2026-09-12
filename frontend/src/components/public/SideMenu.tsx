import { useEffect } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Link, useLocation } from 'react-router-dom';
import { X, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';

export function SideMenu({ open, onOpenChange }: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const location = useLocation();

  // Intercept tombol Back bawaan HP / gesture back browser (Khusus Mobile UX)
  useEffect(() => {
    if (open) {
      window.history.pushState({ sideMenuOpen: true }, '');

      const handlePopState = () => {
        onOpenChange?.(false);
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
        if (window.history.state?.sideMenuOpen) {
          window.history.back();
        }
      };
    }
  }, [open, onOpenChange]);

  const mainLinks = [
    { name: 'HOME', path: '/' },
    { name: 'EVENT', path: '/event' },
    { name: 'NEWS', path: '/news' },
    { name: 'PROGRAMS', path: '/programs' },
    { name: 'LINE UP', path: '/lineup' },
    { name: 'COMMUNITY', path: '/community' },
    { name: 'ABOUT US', path: '/about' },
    { name: 'CONTACT', path: '/contact' },
  ];

  const resourceLinks = [
    { name: 'Gallery', path: '/gallery' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Safety & Rules', path: '/safety' },
  ];

  const contactLinks = [
    { name: 'Email', path: 'mailto:contact@rpo.com', label: 'contact@rpo.com' },
    { name: 'WhatsApp', path: 'https://wa.me/628123456789', label: '+62 812-3456-789' },
  ];

  const socialLinks = [
    { name: 'Instagram', path: 'https://instagram.com/rpo', label: '@sougencreative' },
  ];

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Backdrop Overlay */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-[105] bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        {/* Responsive Drawer: Auto-Height Floating Panel on Mobile (< md), Full-Height on Desktop (>= md) */}
        <DialogPrimitive.Content 
          className={cn(
            "fixed z-[110] top-0 right-0 bg-[#F6FFFF] border-l border-sougen-blue/20 text-rpo-black select-none",
            "transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
            "data-[state=closed]:translate-x-full data-[state=open]:translate-x-0",
            // Mobile styling (< md): Auto-height floating panel to eliminate empty space
            "h-auto max-h-[92vh] border-b rounded-bl-[28px] shadow-[-10px_20px_60px_rgba(0,148,222,0.2)] overflow-y-auto no-scrollbar",
            // Desktop styling (>= md): Full-height zero-scroll clean drawer
            "md:h-screen md:max-h-screen md:rounded-none md:border-b-0 md:shadow-[-20px_0_60px_rgba(0,148,222,0.15)] md:overflow-hidden md:flex md:flex-col md:justify-between",
            // Responsive width & padding
            "w-full sm:w-[490px] md:w-[530px] lg:w-[560px] p-5 sm:p-6 md:p-8"
          )}
        >
          {/* Top Bar: Bold MENU Tag + Distinct Close Pill Button */}
          <div className="flex items-center justify-between pb-3.5 sm:pb-4 border-b border-rpo-black/[0.08]">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 md:w-2.5 md:h-2.5 rounded-[3px] bg-sougen-blue shadow-[0_0_10px_#0094DE]" />
              <span className="font-poppins font-black text-base sm:text-lg md:text-base tracking-wider text-rpo-black uppercase">
                Menu Directory
              </span>
              <span className="hidden sm:inline-flex items-center text-[10px] font-mono font-bold text-rpo-black/40 bg-black/5 px-2 py-0.5 rounded border border-black/5">
                ESC
              </span>
            </div>
            
            <button
              onClick={() => onOpenChange?.(false)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-rpo-black/20 bg-white text-rpo-black font-inter font-bold text-xs sm:text-sm md:text-[13px] transition-all duration-200 hover:bg-[#005A9C] hover:text-white hover:border-[#005A9C] shadow-sm hover:scale-105 active:scale-95 focus:outline-none"
              aria-label="Tutup Menu"
            >
              <span>Tutup</span>
              <X className="h-4 w-4 md:h-4 md:w-4 stroke-[2.5]" />
            </button>
          </div>

          {/* 2-Column Content Layout (Enlarged on Mobile, Preserved on Desktop) */}
          <div className="grid grid-cols-12 gap-3 sm:gap-5 my-auto flex-1 items-start pt-3.5 pb-2 md:pt-3 md:pb-1">
            
            {/* Left Column (Resources, Contact, Socials) - col-span-5 */}
            <div className="col-span-5 flex flex-col gap-4 sm:gap-4 md:gap-3.5 border-r border-rpo-black/[0.08] pr-2.5 sm:pr-3">
              
              {/* Resources */}
              <div className="flex flex-col">
                <p className="text-gray-600 text-[11px] sm:text-xs md:text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                  Resources
                </p>
                <ul className="flex flex-col gap-1 md:gap-1 p-0 m-0 list-none font-inter">
                  {resourceLinks.map((link) => {
                    const isActive = location.pathname.startsWith(link.path);
                    return (
                      <li key={link.name}>
                        <Link 
                          to={link.path}
                          onClick={() => onOpenChange?.(false)}
                          className={cn(
                            "text-sm sm:text-base md:text-[13px] font-semibold transition-colors duration-200 block py-1 md:py-0.5 truncate",
                            isActive ? "text-sougen-blue-dark font-bold" : "text-rpo-black/80 hover:text-sougen-blue-dark"
                          )}
                        >
                          {link.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Get in touch */}
              <div className="flex flex-col">
                <p className="text-gray-600 text-[11px] sm:text-xs md:text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                  Get in touch
                </p>
                <ul className="flex flex-col gap-1 md:gap-1 p-0 m-0 list-none font-inter">
                  {contactLinks.map((link) => (
                    <li key={link.name}>
                      <a 
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm sm:text-base md:text-[13px] font-semibold text-rpo-black/80 hover:text-sougen-blue-dark transition-colors duration-200 flex items-center justify-between group py-1 md:py-0.5"
                      >
                        <span>{link.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 md:w-3 md:h-3 text-rpo-black/30 group-hover:text-sougen-blue-dark transition-colors" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social */}
              <div className="flex flex-col">
                <p className="text-gray-600 text-[11px] sm:text-xs md:text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                  Social Media
                </p>
                <ul className="flex flex-col gap-1 md:gap-1 p-0 m-0 list-none font-inter">
                  {socialLinks.map((link) => (
                    <li key={link.name}>
                      <a 
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm sm:text-base md:text-[13px] font-semibold text-rpo-black/80 hover:text-sougen-blue-dark transition-colors duration-200 flex items-center justify-between group py-1 md:py-0.5"
                      >
                        <span>{link.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 md:w-3 md:h-3 text-rpo-black/30 group-hover:text-sougen-blue-dark transition-colors" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column (Main Navigation Links) - col-span-7 */}
            <div className="col-span-7 flex flex-col pl-2 sm:pl-3">
              <p className="text-gray-600 text-[11px] sm:text-xs md:text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                Main Pages
              </p>
              <ul className="flex flex-col p-0 m-0 list-none">
                {mainLinks.map((link) => {
                  const isActive = link.path === '/' 
                    ? location.pathname === '/' 
                    : location.pathname.startsWith(link.path);

                  return (
                    <li key={link.name} className="border-b border-rpo-black/[0.06] last:border-b-0">
                      <Link
                        to={link.path}
                        onClick={() => onOpenChange?.(false)}
                        className={cn(
                          "flex items-center justify-between py-2 sm:py-2 md:py-1.5 group transition-all duration-200",
                          isActive 
                            ? "text-sougen-blue translate-x-1" 
                            : "text-rpo-black/85 hover:text-sougen-blue hover:translate-x-1.5"
                        )}
                      >
                        <span className="font-poppins font-black text-xl sm:text-2xl md:text-[19px] tracking-tight uppercase leading-snug">
                          {link.name}
                        </span>
                        {isActive ? (
                          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-2 md:h-2 rounded-full bg-sougen-blue shadow-[0_0_8px_#0094DE]" />
                        ) : (
                          <span className="opacity-0 group-hover:opacity-100 text-xs sm:text-sm md:text-xs font-mono text-sougen-blue transition-opacity">
                            ↗
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

          </div>

          {/* Bottom Brand Snapshot */}
          <div className="pt-3 border-t border-rpo-black/[0.08] flex items-center justify-between text-xs md:text-[11px] text-rpo-black/50 font-inter">
            <span>Sougen Creative Hub © 2026</span>
            <span>Makassar, Indonesia</span>
          </div>

        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
