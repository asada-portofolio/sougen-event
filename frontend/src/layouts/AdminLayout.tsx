import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminBottomNav } from '../components/admin/AdminBottomNav';

export default function AdminLayout() {
  return (
    <div className="admin-theme flex h-screen w-full bg-admin-base text-admin-dark font-inter overflow-hidden">
      {/* Desktop Sidebar */}
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Mobile Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-admin-border bg-admin-surface px-4 md:hidden shadow-admin z-10">
          <span className="font-poppins font-bold text-lg text-rpo-red">
            RPO <span className="text-admin-dark">Admin</span>
          </span>
        </header>

        {/* Desktop Header (Breadcrumb) */}
        <AdminHeader />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-admin-base pb-24 md:pb-8">
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <AdminBottomNav />
      </div>
    </div>
  );
}