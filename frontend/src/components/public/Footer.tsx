import { Link } from 'react-router-dom';
import { useContactChannels } from '../../hooks/useContactChannels';
import { Skeleton } from '../ui/Skeleton';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { FaInstagram, FaFacebookF, FaYoutube, FaTwitter, FaTiktok } from 'react-icons/fa6';

export function Footer() {
  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
  const { channels, loading } = useContactChannels(isDesktop);

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
    <footer className="hidden lg:block mt-auto border-t-2 border-sougen-blue bg-rpo-black py-8">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-3 gap-8 items-start">
          
          {/* Kolom Kiri: Logo + Sosial Media */}
          <div className="flex flex-col space-y-4">
            <div>
              <Link to="/" className="inline-block">
                <img 
                  src="/images/main-logo.png" 
                  alt="Sougen Logo" 
                  width="43"
                  height="32"
                  loading="lazy"
                  decoding="async"
                  className="h-8 w-auto object-contain" 
                />
              </Link>
              <p className="text-xs font-poppins text-white/70 mt-1.5 uppercase tracking-wider">
                Sougen Creative Management
              </p>
            </div>
            
            <div className="w-full h-px bg-white/10" />

            <div>
              <h3 className="font-poppins font-semibold text-white uppercase tracking-wider text-xs mb-2.5">Follow Us</h3>
              {loading ? (
                <div className="flex space-x-3">
                  <Skeleton className="w-7 h-7 rounded-full bg-white/10" />
                  <Skeleton className="w-7 h-7 rounded-full bg-white/10" />
                </div>
              ) : socialChannels.length > 0 ? (
                <div className="flex items-center space-x-3.5">
                  {socialChannels.map(channel => (
                    <a 
                      key={channel.id}
                      href={channel.url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-sougen-blue transition-colors duration-300"
                      title={channel.label || channel.value}
                    >
                      {getIcon(channel.type) || <span className="text-xs uppercase">{channel.type}</span>}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-white/60">Sosial media belum tersedia.</p>
              )}
            </div>
          </div>

          {/* Kolom Tengah: Menu Utama & Sampingan */}
          <div className="flex justify-center">
            <div className="flex gap-12">
              {/* Menu Utama */}
              <div className="flex flex-col space-y-2">
                <h3 className="font-poppins font-semibold text-white uppercase tracking-wider text-xs mb-2">Menu</h3>
                <Link to="/" className="text-xs text-white/60 transition-colors duration-300 hover:text-sougen-blue w-fit">Home</Link>
                <Link to="/event" className="text-xs text-white/60 transition-colors duration-300 hover:text-sougen-blue w-fit">Event</Link>
                <Link to="/lineup" className="text-xs text-white/60 transition-colors duration-300 hover:text-sougen-blue w-fit">LineUp</Link>
                <Link to="/community" className="text-xs text-white/60 transition-colors duration-300 hover:text-sougen-blue w-fit">Community</Link>
                <Link to="/about" className="text-xs text-white/60 transition-colors duration-300 hover:text-sougen-blue w-fit">About</Link>
                <Link to="/contact" className="text-xs text-white/60 transition-colors duration-300 hover:text-sougen-blue w-fit">Contact</Link>
              </div>

              {/* Menu Sampingan */}
              <div className="flex flex-col space-y-2">
                <h3 className="font-poppins font-semibold text-white uppercase tracking-wider text-xs mb-2">Resource</h3>
                <Link to="/gallery" className="text-xs text-white/60 transition-colors duration-300 hover:text-sougen-blue w-fit">Gallery</Link>
                <Link to="/faq" className="text-xs text-white/60 transition-colors duration-300 hover:text-sougen-blue w-fit">FAQ</Link>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Kontak Langsung */}
          <div className="flex justify-end">
            <div className="flex flex-col space-y-3">
              <h3 className="font-poppins font-semibold text-white uppercase tracking-wider text-xs mb-2">Hubungi Kami</h3>
              {loading ? (
                <div className="flex flex-col space-y-2">
                  <Skeleton className="h-3.5 w-28 bg-white/10" />
                  <Skeleton className="h-3.5 w-36 bg-white/10" />
                </div>
              ) : directChannels.length > 0 ? (
                <ul className="flex flex-col space-y-2.5">
                  {directChannels.map(channel => (
                    <li key={channel.id}>
                      {channel.url ? (
                        <a 
                          href={channel.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 text-white/60 hover:text-sougen-blue transition-colors duration-300 group"
                        >
                          <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-sougen-blue/10 group-hover:text-sougen-blue transition-colors">
                            {getIcon(channel.type)}
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-white/70 uppercase">{channel.type}</p>
                            <p className="text-xs group-hover:text-sougen-blue transition-colors">{channel.label || channel.value}</p>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-center gap-2.5 text-white/60">
                          <div className="p-1.5 rounded-full bg-white/5">
                            {getIcon(channel.type)}
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-white/70 uppercase">{channel.type}</p>
                            <p className="text-xs">{channel.value}</p>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-white/60">Kontak belum tersedia.</p>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 pt-4 border-t border-white/10 flex justify-center items-center">
          <p className="text-xs text-white/70">&copy; {new Date().getFullYear()} Sougen Creative Management. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
