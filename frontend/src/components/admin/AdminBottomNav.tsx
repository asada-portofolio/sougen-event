import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  LayoutGrid,
  MessageSquare,
  Settings,
} from 'lucide-react';
import { AdminContentSheet } from './AdminContentSheet';

interface BottomNavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  action?: 'sheet';
}

const bottomNavItems: BottomNavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Event', href: '/admin/event', icon: CalendarDays },
  { label: 'Konten', icon: LayoutGrid, action: 'sheet' },
  { label: 'Pesan', href: '/admin/kontak', icon: MessageSquare },
  { label: 'Pengaturan', href: '/admin/pengaturan', icon: Settings },
];

export function AdminBottomNav() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-admin-border bg-admin-surface md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {bottomNavItems.map((item) => {
          if (item.action === 'sheet') {
            return (
              <button
                key={item.label}
                onClick={() => setSheetOpen(true)}
                className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 text-[11px] font-medium transition-colors ${
                  sheetOpen ? 'text-sougen-blue' : 'text-admin-secondary'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.href!}
              end={item.href === '/admin'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 py-1 px-2 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-sougen-blue' : 'text-admin-secondary'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <AdminContentSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}
