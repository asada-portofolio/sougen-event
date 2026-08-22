import { useNavigate, useLocation } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { adminNavGroups } from './adminNavData';

interface AdminContentSheetProps {
  open: boolean;
  onClose: () => void;
}

export function AdminContentSheet({ open, onClose }: AdminContentSheetProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (href: string) => {
    navigate(href);
    onClose();
  };

  // Filter out Dashboard from the groups since it's already in BottomNav
  const contentGroups = adminNavGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => item.href !== '/admin' && item.href !== '/admin/pengaturan'
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed bottom-0 left-0 right-0 z-[70] bg-admin-surface border-t border-admin-border rounded-t-lg shadow-[0_-8px_24px_rgba(0,0,0,0.12)] max-h-[75vh] overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom">
          {/* Handle Bar */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-gray-300" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-3 border-b border-admin-border">
            <Dialog.Title className="font-poppins font-semibold text-base text-admin-dark">
              Modul Konten
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1.5 rounded hover:bg-gray-100 text-admin-secondary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Navigation Groups */}
          <div className="px-4 py-4 space-y-5 pb-20">
            {contentGroups.map((group) => (
              <div key={group.title}>
                <p className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wider text-admin-secondary">
                  {group.title}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.href || 
                      (item.href !== '/admin' && location.pathname.startsWith(item.href));
                    return (
                      <li key={item.href}>
                        <button
                          onClick={() => handleNavigate(item.href)}
                          className={`flex w-full items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-sougen-blue/10 text-sougen-blue'
                              : 'text-admin-dark hover:bg-gray-100'
                          }`}
                        >
                          <item.icon className="w-[18px] h-[18px] shrink-0" />
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
