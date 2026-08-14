import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function AdminLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Username dan password wajib diisi.');
      return;
    }

    try {
      setLoading(true);
      await login(username, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setError(axiosErr.response?.data?.error || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FE0000] rounded mb-4">
            <span className="text-white font-poppins font-black text-2xl">R</span>
          </div>
          <h1 className="font-poppins text-2xl font-bold text-[#1A1A2E]">
            Admin Panel
          </h1>
          <p className="font-inter text-sm text-[#6B7280] mt-1">
            Reality Project Organizer
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-[#E5E7EB] rounded p-8 shadow-sm">
          <h2 className="font-poppins text-lg font-semibold text-[#1A1A2E] mb-6">
            Masuk ke Akun Admin
          </h2>

          {error && (
            <div className="mb-5 p-3 rounded bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p className="font-inter text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#1A1A2E] mb-1.5 font-inter">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full border border-[#E5E7EB] text-[#1A1A2E] rounded px-4 py-2.5 focus:outline-none focus:border-[#FE0000] focus:ring-1 focus:ring-[#FE0000] transition-colors font-inter text-sm placeholder:text-[#9CA3AF] disabled:opacity-50 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1A1A2E] mb-1.5 font-inter">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full border border-[#E5E7EB] text-[#1A1A2E] rounded px-4 py-2.5 pr-11 focus:outline-none focus:border-[#FE0000] focus:ring-1 focus:ring-[#FE0000] transition-colors font-inter text-sm placeholder:text-[#9CA3AF] disabled:opacity-50 disabled:bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1A1A2E] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 px-6 py-2.5 bg-[#FE0000] text-white font-inter font-semibold text-sm rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Masuk
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#9CA3AF] font-inter mt-6">
          &copy; {new Date().getFullYear()} Reality Project Organizer
        </p>
      </div>
    </div>
  );
}