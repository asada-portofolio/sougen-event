import { Outlet } from 'react-router-dom';

import { Navbar } from '../components/public/Navbar';
import { BottomNav } from '../components/public/BottomNav';
import { Footer } from '../components/public/Footer';
import { BackToTop } from '../components/public/BackToTop';

export interface PublicLayoutProps {
  showNavbar?: boolean;
  showFooter?: boolean;
  showBottomNav?: boolean;
}

export default function PublicLayout({ 
  showNavbar = true, 
  showFooter = true,
  showBottomNav = true
}: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA] text-rpo-black">
      {showNavbar && <Navbar />}
      
      <main className="flex-1 pb-24 lg:pb-0">
        <Outlet />
      </main>

      {showFooter && <Footer />}

      {showBottomNav && <BottomNav />}

      <BackToTop />
    </div>
  );
}