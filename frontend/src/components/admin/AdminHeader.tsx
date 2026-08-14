import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, ExternalLink } from 'lucide-react';

const breadcrumbMap: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/event': 'Event',
  '/admin/talent': 'Talent',
  '/admin/community': 'Community',
  '/admin/programs': 'Programs',
  '/admin/faq': 'FAQ',
  '/admin/kebijakan': 'Kebijakan',
  '/admin/kontak': 'Kontak',
  '/admin/about': 'About Us',
  '/admin/pengaturan': 'Pengaturan',
};

export function AdminHeader() {
  const location = useLocation();
  const pathname = location.pathname;

  // Build breadcrumb segments
  const segments: { label: string; href?: string }[] = [{ label: 'Admin', href: '/admin' }];

  // Find the best matching breadcrumb
  const matchedKey = Object.keys(breadcrumbMap)
    .filter((key) => pathname.startsWith(key) && key !== '/admin')
    .sort((a, b) => b.length - a.length)[0];

  if (matchedKey) {
    segments.push({ label: breadcrumbMap[matchedKey], href: matchedKey });

    // If the path has additional segments (e.g., /admin/event/123), show detail
    const remaining = pathname.slice(matchedKey.length);
    if (remaining && remaining !== '/') {
      segments.push({ label: 'Detail' });
    }
  }

  return (
    <header className="hidden md:flex h-14 shrink-0 items-center justify-between border-b border-admin-border bg-admin-surface px-6 shadow-admin z-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm font-inter">
        {segments.map((seg, idx) => {
          const isLast = idx === segments.length - 1;
          return (
            <span key={idx} className="flex items-center gap-1.5">
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-admin-secondary" />}
              {seg.href && !isLast ? (
                <Link
                  to={seg.href}
                  className="text-admin-secondary hover:text-admin-dark transition-colors"
                >
                  {seg.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-admin-dark font-medium' : 'text-admin-secondary'}>
                  {seg.label}
                </span>
              )}
            </span>
          );
        })}
      </nav>

      {/* View Website */}
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-sm text-admin-secondary hover:text-admin-dark transition-colors"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Lihat Website
      </a>
    </header>
  );
}
