import { useContactChannels } from '../../hooks/useContactChannels';
import { Skeleton } from '../ui/Skeleton';
import { cn } from '../../lib/utils';
import { Mail, Phone, MapPin, Link2 } from 'lucide-react';
import { InstagramIcon } from '../ui/icons';

export interface ContactInfoBoxProps {
  className?: string;
}

export function ContactInfoBox({ className }: ContactInfoBoxProps) {
  const { channels, loading } = useContactChannels();

  const sortedChannels = [...channels].sort((a, b) => {
    if (a.isEmergencyContact && !b.isEmergencyContact) return -1;
    if (!a.isEmergencyContact && b.isEmergencyContact) return 1;
    return a.displayOrder - b.displayOrder;
  });

  const getIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('email') || t.includes('mail')) return <Mail className="h-5 w-5" />;
    if (t.includes('phone') || t.includes('wa') || t.includes('whatsapp')) return <Phone className="h-5 w-5" />;
    if (t.includes('ig') || t.includes('instagram')) return <InstagramIcon className="h-5 w-5" />;
    if (t.includes('address') || t.includes('location')) return <MapPin className="h-5 w-5" />;
    return <Link2 className="h-5 w-5" />;
  };

  return (
    <div className={cn("rounded-xl border border-rpo-black/10 bg-white p-6 shadow-sm", className)}>
      <h3 className="mb-6 font-poppins text-xl font-bold text-rpo-black">Informasi Kontak</h3>
      
      {loading ? (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4"><Skeleton className="h-10 w-10 rounded-full bg-black/5" /><Skeleton className="h-6 w-48 bg-black/5" /></div>
          <div className="flex items-center space-x-4"><Skeleton className="h-10 w-10 rounded-full bg-black/5" /><Skeleton className="h-6 w-32 bg-black/5" /></div>
          <div className="flex items-center space-x-4"><Skeleton className="h-10 w-10 rounded-full bg-black/5" /><Skeleton className="h-6 w-40 bg-black/5" /></div>
        </div>
      ) : sortedChannels.length > 0 ? (
        <ul className="flex flex-col space-y-4">
          {sortedChannels.map((channel) => (
            <li 
              key={channel.id} 
              className={cn(
                "flex items-start space-x-4 p-3 rounded-sm border",
                channel.isEmergencyContact 
                  ? "border-rpo-negative bg-rpo-negative/5" 
                  : "border-transparent hover:bg-black/[0.02] transition-colors"
              )}
            >
              <div className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                channel.isEmergencyContact
                  ? "bg-rpo-negative text-white"
                  : "bg-sougen-blue-dark/10 text-sougen-blue-dark"
              )}>
                {getIcon(channel.type)}
              </div>
              <div className="flex flex-col pt-1">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-600">
                  {channel.type}
                  {channel.isEmergencyContact && (
                    <span className="px-1.5 py-0.5 rounded-sm bg-rpo-negative text-white text-[10px] shadow-sm font-bold">
                      Darurat
                    </span>
                  )}
                </span>
                {channel.url ? (
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-rpo-black transition-colors hover:text-sougen-blue-dark"
                  >
                    {channel.label || channel.value}
                  </a>
                ) : (
                  <span className="text-sm font-medium text-rpo-black">
                    {channel.value}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-rpo-black/50">Informasi kontak belum tersedia.</p>
      )}
    </div>
  );
}
