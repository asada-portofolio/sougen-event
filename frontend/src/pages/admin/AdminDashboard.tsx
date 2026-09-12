import { Link } from 'react-router-dom';
import { useDashboard } from '../../hooks/useDashboard';
import { 
  CalendarDays, 
  Users, 
  Handshake, 
  MessageSquare, 
  ChevronRight,
  Plus,
  Loader2,
  AlertCircle,
  HelpCircle,
  Settings
} from 'lucide-react';
import { formatDateShort } from '../../utils/date';

export default function AdminDashboard() {
  const { data, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-sougen-blue" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-admin-secondary">
        <AlertCircle className="w-12 h-12 mb-4 text-red-400" />
        <h2 className="text-xl font-poppins font-semibold text-admin-dark">Gagal Memuat Dashboard</h2>
        <p className="mt-2 text-sm text-center max-w-md">
          Terjadi kesalahan saat mengambil data dashboard. Pastikan server backend berjalan dengan baik.
        </p>
      </div>
    );
  }

  const { activeEvent, stats, unreadMessagesCount, recentMessages } = data;

  // Cek kelengkapan data event
  const isEventComplete = activeEvent
    ? activeEvent.eventTalents.length > 0 && activeEvent.galleryPhotos.length > 0
    : false;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-poppins font-bold text-admin-dark">
          Dashboard
        </h1>
        <p className="text-sm text-admin-secondary mt-1">
          Ringkasan aktivitas dan status data website Sougen.
        </p>
      </div>

      {/* Banner Event Aktif */}
      {activeEvent ? (
        <div className="relative overflow-hidden rounded-xl border border-admin-border bg-white shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Event Aktif
                </span>
                {!isEventComplete && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-50 text-yellow-700 border border-yellow-200">
                    Data Belum Lengkap
                  </span>
                )}
              </div>
              <h2 className="text-xl font-poppins font-bold text-admin-dark">
                {activeEvent.name}
              </h2>
              <p className="text-sm text-admin-secondary mt-1 flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4" />
                {formatDateShort(activeEvent.startDate)}
              </p>
            </div>
            
            <Link
              to="/admin/event"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-sougen-blue text-white text-sm font-medium rounded-lg hover:bg-sougen-blue/90 shadow-sm transition-colors"
            >
              Kelola Event
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 opacity-5 pointer-events-none">
            <CalendarDays className="w-64 h-64" />
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center flex flex-col items-center">
          <CalendarDays className="w-10 h-10 text-gray-400 mb-3" />
          <h3 className="font-poppins font-semibold text-admin-dark mb-1">
            Belum Ada Event Aktif
          </h3>
          <p className="text-sm text-admin-secondary max-w-sm mb-4">
            Buat event baru atau atur event yang sudah ada menjadi aktif untuk menampilkannya di halaman utama.
          </p>
          <Link
            to="/admin/event"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-sougen-blue text-white text-sm font-medium rounded-lg hover:bg-sougen-blue/90 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Buat Event Baru
          </Link>
        </div>
      )}

      {/* Statistik Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Event', value: stats.events, icon: CalendarDays, color: 'text-sougen-blue', bg: 'bg-sougen-blue/10' },
          { label: 'Talent', value: stats.talents, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Komunitas', value: stats.communities, icon: Handshake, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pesan Baru', value: unreadMessagesCount, icon: MessageSquare, color: 'text-sougen-blue', bg: 'bg-sougen-blue/10' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white border border-admin-border rounded-xl p-5 shadow-sm flex items-start gap-4">
            <div className={`p-3 rounded-lg shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-poppins font-bold text-admin-dark">
                {stat.value}
              </p>
              <p className="text-xs font-medium text-admin-secondary uppercase tracking-wider mt-1">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pesan Terbaru / Log */}
        <div className="lg:col-span-2 bg-white border border-admin-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-admin-border flex items-center justify-between">
            <h3 className="font-poppins font-semibold text-admin-dark">Pesan Terbaru</h3>
            <Link to="/admin/kontak" className="text-sm font-medium text-sougen-blue hover:underline">
              Lihat Semua
            </Link>
          </div>
          
          <div className="divide-y divide-admin-border flex-1">
            {recentMessages.length > 0 ? (
              recentMessages.map((msg) => (
                <div key={msg.id} className="p-4 px-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm text-admin-dark">{msg.senderName}</p>
                      <p className="text-xs text-admin-secondary mt-0.5">{msg.senderEmail}</p>
                      <p className="text-sm text-admin-dark mt-2 line-clamp-2">
                        {msg.message}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-admin-secondary">
                      {formatDateShort(msg.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-admin-secondary flex flex-col items-center justify-center h-full">
                <MessageSquare className="w-8 h-8 mb-2 text-gray-300" />
                <p className="text-sm">Tidak ada pesan baru.</p>
              </div>
            )}
          </div>
        </div>

        {/* Akses Cepat */}
        <div className="bg-white border border-admin-border rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-admin-border">
            <h3 className="font-poppins font-semibold text-admin-dark">Akses Cepat</h3>
          </div>
          <div className="p-2 space-y-1">
            {[
              { label: 'Kelola Talent', href: '/admin/talent', icon: Users },
              { label: 'Kelola Komunitas', href: '/admin/community', icon: Handshake },
              { label: 'Edit FAQ', href: '/admin/faq', icon: HelpCircle },
              { label: 'Pengaturan Website', href: '/admin/pengaturan', icon: Settings },
            ].map((shortcut, idx) => (
              <Link
                key={idx}
                to={shortcut.href}
                className="flex items-center justify-between p-3 px-4 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <shortcut.icon className="w-5 h-5 text-admin-secondary group-hover:text-admin-dark transition-colors" />
                  <span className="text-sm font-medium text-admin-dark">{shortcut.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-admin-dark transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}