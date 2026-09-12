import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function SideMenu({ open, onOpenChange }: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const location = useLocation();

  const mainLinks = [
    { name: 'Home', path: '/' },
    { name: 'Event', path: '/event' },
    { name: 'Line Up', path: '/lineup' },
    { name: 'Community', path: '/community' },
    { name: 'About Us', path: '/about' },
    { name: 'Program', path: '/programs' },
    { name: 'Contact', path: '/contact' },
  ];

  const resourceLinks = [
    { name: 'Gallery', path: '/gallery' },
    { name: 'FAQ', path: '/faq' },
  ];

  const contactLinks = [
    { name: 'Email', path: 'mailto:contact@rpo.com' },
    { name: 'WhatsApp', path: 'https://wa.me/628123456789' },
  ];

  const socialLinks = [
    { name: 'Instagram', path: 'https://instagram.com/rpo' },
  ];

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[80] bg-black/20 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        <DialogPrimitive.Content 
          className={cn(
            "fixed z-[90] top-16 right-0 bg-white shadow-[-7px_0_20px_rgba(0,0,0,0.1)] flex flex-col overflow-y-auto",
            "transition-all duration-400 ease-[cubic-bezier(0.77,0,0.175,1)]",
            "data-[state=closed]:translate-x-full data-[state=open]:translate-x-0",
            // Desktop dimensions
            "w-1/2 h-[calc(100vh-4rem)] p-[34px_40px]",
            // Mobile dimensions
            "max-[686px]:w-[70%]",
            "max-[515px]:w-full max-[515px]:p-[27px_20px]"
          )}
        >
          <div className="grid grid-cols-2 gap-[27px] max-[515px]:gap-[15px] h-full overflow-x-hidden">
            {/* Left Column */}
            <div className="flex flex-col gap-[27px]">
              {/* Resources */}
              <div className="flex flex-col">
                <p className="text-[#777777] text-xs font-semibold mb-[10px] uppercase">Resources</p>
                <ul className="flex flex-col gap-[8px] p-0 m-0 list-none">
                  {resourceLinks.map(link => (
                    <li key={link.name}>
                      <Link 
                        to={link.path}
                        onClick={() => onOpenChange?.(false)}
                        className="text-[#111111] text-base font-medium transition-colors duration-200 hover:text-sougen-blue"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Get in touch */}
              <div className="flex flex-col">
                <p className="text-[#777777] text-xs font-semibold mb-[10px] uppercase">Get in touch</p>
                <ul className="flex flex-col gap-[8px] p-0 m-0 list-none">
                  {contactLinks.map(link => (
                    <li key={link.name}>
                      <a 
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#111111] text-base font-medium transition-colors duration-200 hover:text-sougen-blue"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social */}
              <div className="flex flex-col">
                <p className="text-[#777777] text-xs font-semibold mb-[10px] uppercase">Social</p>
                <ul className="flex flex-col gap-[8px] p-0 m-0 list-none">
                  {socialLinks.map(link => (
                    <li key={link.name}>
                      <a 
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#111111] text-base font-medium transition-colors duration-200 hover:text-sougen-blue"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col">
              <p className="text-[#777777] text-xs font-semibold mb-[10px] pl-[10px] uppercase">Menu</p>
              <ul className="flex flex-col gap-[3px] p-0 m-0 list-none">
                {mainLinks.map(link => {
                  const isActive = link.path === '/' 
                    ? location.pathname === '/' && location.hash === ''
                    : (location.pathname === link.path || (link.path.startsWith('/#') && location.hash === link.path.substring(1)));
                    
                  return (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        onClick={() => onOpenChange?.(false)}
                        className={cn(
                          "block text-[#111111] text-3xl font-bold py-[8px] px-[13px] rounded-[8px] transition-all duration-200",
                          isActive 
                            ? "bg-sougen-blue/10 text-sougen-blue translate-x-[3px]"
                            : "hover:bg-[#fafafa] hover:text-sougen-blue hover:translate-x-[3px]"
                        )}
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
