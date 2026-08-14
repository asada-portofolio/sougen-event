import { Link } from 'react-router-dom';
import { useContactChannels } from '../../hooks/useContactChannels';
import { Skeleton } from '../ui/Skeleton';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { FaInstagram, FaFacebookF, FaYoutube, FaTwitter, FaTiktok } from 'react-icons/fa6';

export function Footer() {
  const { channels, loading } = useContactChannels();

  // Filter channels
  const socialTypes = ['INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'TWITTER', 'YOUTUBE'];
  const directTypes = ['WHATSAPP', 'EMAIL', 'TELEPHONE', 'TELEGRAM', 'LINE'];

  const socialChannels = channels.filter(c => socialTypes.includes(c.type));
  const directChannels = channels.filter(c => directTypes.includes(c.type));

  const getIcon = (type: string) => {
    switch (type) {
      case 'INSTAGRAM': return <FaInstagram className="w-5 h-5" />;
      case 'FACEBOOK': return <FaFacebookF className="w-5 h-5" />;
      case 'YOUTUBE': return <FaYoutube className="w-5 h-5" />;
      case 'TWITTER': return <FaTwitter className="w-5 h-5" />;
      case 'TIKTOK': return <FaTiktok className="w-5 h-5" />;
      case 'EMAIL': return <Mail className="w-5 h-5" />;
      case 'WHATSAPP': return <MessageCircle className="w-5 h-5" />;
      case 'TELEPHONE': return <Phone className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <footer className="hidden lg:block mt-auto border-t-4 border-rpo-red bg-rpo-black py-16">
      <div className="mx-auto max-w-[1200px] px-8">
        <div className="grid grid-cols-3 gap-12">
          
          {/* Kolom Kiri: Logo + Sosial Media */}
          <div className="flex flex-col space-y-6">
            <div>
              <Link to="/" className="text-3xl font-poppins font-bold tracking-tighter text-rpo-red block">
                RPO<span className="text-white">.</span>
              </Link>
              <p className="text-sm font-poppins text-white/80 mt-1 uppercase tracking-wider">
                Reality Project Organizer
              </p>
            </div>
            
            <div className="w-full h-px bg-white/10" />

            <div>
              <h3 className="font-poppins font-semibold text-white uppercase tracking-wider text-sm mb-4">Follow Us</h3>
              {loading ? (
                <div className="flex space-x-3">
                  <Skeleton className="w-8 h-8 rounded-full bg-white/10" />
                  <Skeleton className="w-8 h-8 rounded-full bg-white/10" />
                </div>
              ) : socialChannels.length > 0 ? (
                <div className="flex items-center space-x-4">
                  {socialChannels.map(channel => (
                    <a 
                      key={channel.id}
                      href={channel.url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-rpo-red transition-colors duration-300"
                      title={channel.label || channel.value}
                    >
                      {getIcon(channel.type) || <span className="text-xs uppercase">{channel.type}</span>}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/60">Sosial media belum tersedia.</p>
              )}
            </div>
          </div>

          {/* Kolom Tengah: Menu Utama & Sampingan */}
          <div className="flex justify-center">
            <div className="flex gap-16">
              {/* Menu Utama */}
              <div className="flex flex-col space-y-3">
                <h3 className="font-poppins font-semibold text-white uppercase tracking-wider text-sm mb-4">Menu Utama</h3>
                <Link to="/" className="text-sm text-white/60 transition-colors duration-300 hover:text-rpo-red w-fit">Home</Link>
                <Link to="/guest" className="text-sm text-white/60 transition-colors duration-300 hover:text-rpo-red w-fit">Guest</Link>
                <Link to="/lineup" className="text-sm text-white/60 transition-colors duration-300 hover:text-rpo-red w-fit">LineUp</Link>
                <Link to="/community" className="text-sm text-white/60 transition-colors duration-300 hover:text-rpo-red w-fit">Community</Link>
                <Link to="/activity" className="text-sm text-white/60 transition-colors duration-300 hover:text-rpo-red w-fit">Activity</Link>
                <Link to="/event" className="text-sm text-white/60 transition-colors duration-300 hover:text-rpo-red w-fit">Event</Link>
                <Link to="/contact" className="text-sm text-white/60 transition-colors duration-300 hover:text-rpo-red w-fit">Contact</Link>
              </div>

              {/* Menu Sampingan */}
              <div className="flex flex-col space-y-3">
                <h3 className="font-poppins font-semibold text-white uppercase tracking-wider text-sm mb-4">Resource</h3>
                <Link to="/gallery" className="text-sm text-white/60 transition-colors duration-300 hover:text-rpo-red w-fit">Gallery</Link>
                <Link to="/faq" className="text-sm text-white/60 transition-colors duration-300 hover:text-rpo-red w-fit">FAQ</Link>
                <Link to="/guidelines" className="text-sm text-white/60 transition-colors duration-300 hover:text-rpo-red w-fit">Event Guidelines</Link>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Kontak Langsung */}
          <div className="flex justify-end">
            <div className="flex flex-col space-y-4">
              <h3 className="font-poppins font-semibold text-white uppercase tracking-wider text-sm mb-4">Hubungi Kami</h3>
              {loading ? (
                <div className="flex flex-col space-y-2">
                  <Skeleton className="h-4 w-32 bg-white/10" />
                  <Skeleton className="h-4 w-40 bg-white/10" />
                </div>
              ) : directChannels.length > 0 ? (
                <ul className="flex flex-col space-y-4">
                  {directChannels.map(channel => (
                    <li key={channel.id}>
                      {channel.url ? (
                        <a 
                          href={channel.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-white/60 hover:text-rpo-red transition-colors duration-300 group"
                        >
                          <div className="p-2 rounded-full bg-white/5 group-hover:bg-rpo-red/10 group-hover:text-rpo-red transition-colors">
                            {getIcon(channel.type)}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white/80 uppercase">{channel.type}</p>
                            <p className="text-sm group-hover:text-rpo-red transition-colors">{channel.label || channel.value}</p>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-center gap-3 text-white/60">
                          <div className="p-2 rounded-full bg-white/5">
                            {getIcon(channel.type)}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white/80 uppercase">{channel.type}</p>
                            <p className="text-sm">{channel.value}</p>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-white/60">Kontak belum tersedia.</p>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-16 pt-8 border-t border-white/10 flex justify-center items-center">
          <p className="text-xs text-white/40">&copy; {new Date().getFullYear()} Reality Project Organizer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
