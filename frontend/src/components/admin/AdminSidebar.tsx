import { NavLink, useNavigate } from 'react-router-dom';
import { ExternalLink, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { adminNavGroups } from './adminNavData';

export function AdminSidebar() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <aside className="hidden w-64 flex-col border-r border-admin-border bg-admin-surface md:flex shadow-admin z-20">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-admin-border">
        <span className="font-poppins font-bold text-xl text-rpo-red">
          RPO <span className="text-admin-dark">Admin</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {adminNavGroups.map((group) => (
          <div key={group.title}>
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-admin-secondary">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    end={item.href === '/admin'}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-red-50 text-rpo-red'
                          : 'text-admin-dark hover:bg-gray-100'
                      }`
                    }
                  >
                    <item.icon className="w-[18px] h-[18px] shrink-0" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer: View Website + Logout */}
      <div className="border-t border-admin-border p-3 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded text-sm text-admin-secondary hover:bg-gray-100 transition-colors"
        >
          <ExternalLink className="w-[18px] h-[18px] shrink-0" />
          Lihat Website
        </a>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
