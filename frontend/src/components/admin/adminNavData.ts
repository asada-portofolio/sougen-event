import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Handshake,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  MessageSquare,
  Info,
  Settings,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const adminNavGroups: NavGroup[] = [
  {
    title: 'Utama',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Event', href: '/admin/event', icon: CalendarDays },
    ],
  },
  {
    title: 'Konten',
    items: [
      { label: 'Talent', href: '/admin/talent', icon: Users },
      { label: 'Community', href: '/admin/community', icon: Handshake },
      { label: 'Programs', href: '/admin/programs', icon: Sparkles },
      { label: 'FAQ', href: '/admin/faq', icon: HelpCircle },
      { label: 'Safety & Policy', href: '/admin/safety', icon: ShieldCheck },
    ],
  },
  {
    title: 'Komunikasi',
    items: [
      { label: 'Kontak', href: '/admin/kontak', icon: MessageSquare },
      { label: 'About Us', href: '/admin/about', icon: Info },
    ],
  },
  {
    title: 'Sistem',
    items: [
      { label: 'Pengaturan', href: '/admin/pengaturan', icon: Settings },
    ],
  },
];
