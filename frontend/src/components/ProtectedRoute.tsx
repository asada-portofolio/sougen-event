import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute() {
  const navigate = useNavigate();
  const { isLoggedIn, isChecking, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isChecking && !isLoggedIn) {
      navigate('/admin/login', { replace: true });
    }
  }, [isChecking, isLoggedIn, navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-sougen-blue" />
          <p className="font-inter text-sm text-[#6B7280]">Memverifikasi sesi...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return <Outlet />;
}