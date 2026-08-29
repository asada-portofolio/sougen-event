import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { CheckCircle2, AlertTriangle, Info, X, Sparkles, ArrowUpRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface EventCompletenessData {
  id?: number;
  slug?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  posterImageUrl?: string | null;
  description?: string | null;
  _count?: {
    eventDays?: number;
    eventTalents?: number;
    eventPrograms?: number;
    galleryPhotos?: number;
  };
  eventDays?: any[];
  eventTalents?: any[];
  eventPrograms?: any[];
  galleryPhotos?: any[];
}

export interface EventCompletenessBadgeProps {
  event: EventCompletenessData;
  className?: string;
  showWhenComplete?: boolean;
}

export function EventCompletenessBadge({ 
  event, 
  className,
  showWhenComplete = true 
}: EventCompletenessBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Compute completeness criteria
  const hasBasicInfo = Boolean(event.name && event.startDate && event.endDate && event.location);
  const hasPoster = Boolean(event.posterImageUrl);
  const hasDescription = Boolean(event.description && event.description.trim() !== '');
  
  const daysCount = event._count?.eventDays ?? event.eventDays?.length ?? 0;
  const hasRundown = daysCount > 0;
  
  const talentsCount = event._count?.eventTalents ?? event.eventTalents?.length ?? 0;
  const programsCount = event._count?.eventPrograms ?? event.eventPrograms?.length ?? 0;
  const photosCount = event._count?.galleryPhotos ?? event.galleryPhotos?.length ?? 0;

  const isComplete = hasBasicInfo && hasPoster && hasDescription && hasRundown;

  const checklist = [
    { 
      label: 'Info Dasar & Lokasi', 
      isReady: hasBasicInfo, 
      required: true, 
      desc: hasBasicInfo ? 'Nama, tanggal, dan lokasi sudah terisi' : 'Tanggal atau lokasi belum lengkap',
      tab: 'basic',
      highlight: 'field-location',
    },
    { 
      label: 'Poster Utama Event', 
      isReady: hasPoster, 
      required: true, 
      desc: hasPoster ? 'Gambar poster resmi sudah diunggah' : 'Gambar poster utama belum diunggah',
      tab: 'visual',
      highlight: 'field-poster',
    },
    { 
      label: 'Deskripsi / Narasi Event', 
      isReady: hasDescription, 
      required: true, 
      desc: hasDescription ? 'Narasi event sudah ditulis' : 'Belum ada deskripsi tentang event',
      tab: 'basic',
      highlight: 'field-description',
    },
    { 
      label: 'Jadwal & Rundown Acara', 
      isReady: hasRundown, 
      required: true, 
      desc: hasRundown ? `${daysCount} Hari acara sudah tersusun` : 'Belum ada hari atau rundown acara',
      tab: 'rundown',
      highlight: 'field-rundown',
    },
    { 
      label: 'Bintang Tamu / Talent', 
      isReady: talentsCount > 0, 
      required: false, 
      desc: talentsCount > 0 ? `${talentsCount} Talent terdaftar` : 'Opsional (Belum ada talent)',
      tab: 'talent',
      highlight: 'field-talent',
    },
    { 
      label: 'Program Acara', 
      isReady: programsCount > 0, 
      required: false, 
      desc: programsCount > 0 ? `${programsCount} Program terdaftar` : 'Opsional (Belum ada program)',
      tab: 'program',
      highlight: 'field-program',
    },
    { 
      label: 'Dokumentasi Galeri', 
      isReady: photosCount > 0, 
      required: false, 
      desc: photosCount > 0 ? `${photosCount} Foto dokumentasi` : 'Opsional (Belum ada foto galeri)',
      tab: 'gallery',
      highlight: 'field-gallery',
    },
  ];

  const missingRequired = checklist.filter(item => item.required && !item.isReady);

  if (isComplete && !showWhenComplete) {
    return null;
  }

  const handleItemClick = (item: typeof checklist[0]) => {
    setIsOpen(false);
    const targetIdentifier = event.slug || event.id;
    if (targetIdentifier) {
      navigate(`/admin/event/${targetIdentifier}?tab=${item.tab}&highlight=${item.highlight}`);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger Badge Button */}
      <Dialog.Trigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-inter font-bold uppercase tracking-wider transition-all duration-200 shadow-sm cursor-pointer border select-none",
            isComplete 
              ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100" 
              : "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 hover:border-amber-400",
            className
          )}
          title="Klik untuk melihat checklist kelengkapan data event"
        >
          {isComplete ? (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Data Lengkap</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
              <span>Data Belum Lengkap ({missingRequired.length})</span>
            </>
          )}
        </button>
      </Dialog.Trigger>

      {/* Fullscreen Portal Modal (100% Anti-Clipping / Bebas Terpotong) */}
      <Dialog.Portal>
        <Dialog.Overlay 
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200" 
        />
        
        <Dialog.Content 
          onClick={(e) => e.stopPropagation()}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-md bg-white rounded-2xl shadow-2xl border border-rpo-black/10 z-50 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-black/5 bg-gray-50/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                isComplete ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"
              )}>
                {isComplete ? <Sparkles className="w-5 h-5" /> : <Info className="w-5 h-5" />}
              </div>
              <div>
                <Dialog.Title className="font-poppins font-bold text-base sm:text-lg text-rpo-black leading-tight">
                  Status Kelengkapan Event
                </Dialog.Title>
                <Dialog.Description className="font-inter text-xs text-gray-500 line-clamp-1 mt-0.5">
                  {event.name || 'Event Sougen'}
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button 
                type="button"
                className="p-2 text-gray-400 hover:text-rpo-black hover:bg-gray-200/60 rounded-xl transition-colors shrink-0"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Checklist Items Body */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 [scrollbar-width:thin]">
            <p className="text-[11px] font-inter text-gray-500 mb-1">
              Klik pada salah satu bagian di bawah untuk langsung menuju formulir pengisian:
            </p>

            {checklist.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleItemClick(item)}
                className={cn(
                  "w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 group cursor-pointer active:scale-[0.99]",
                  item.isReady 
                    ? "bg-emerald-50/40 border-emerald-200/70 hover:bg-emerald-50 hover:border-emerald-400" 
                    : item.required 
                      ? "bg-amber-50/70 border-amber-300 hover:bg-amber-100 hover:border-amber-400" 
                      : "bg-gray-50/80 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                )}
              >
                {item.isReady ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : item.required ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center shrink-0 mt-0.5 text-[10px] text-gray-400 font-bold">
                    -
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn(
                      "font-inter font-bold text-xs sm:text-sm group-hover:text-sougen-blue transition-colors",
                      item.isReady ? "text-emerald-950" : item.required ? "text-amber-950" : "text-gray-700"
                    )}>
                      {item.label}
                    </span>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.required ? (
                        <span className={cn(
                          "text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded",
                          item.isReady ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        )}>
                          Wajib
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-gray-400 uppercase">Opsional</span>
                      )}
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-sougen-blue group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 font-inter">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Footer Summary */}
          <div className="p-4 sm:p-5 border-t border-black/5 bg-gray-50/80 flex items-center justify-between shrink-0">
            <div className="text-xs font-inter text-gray-600">
              {isComplete ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Semua data wajib lengkap.
                </span>
              ) : (
                <span className="text-amber-800 font-medium">
                  <strong>{missingRequired.length}</strong> data wajib perlu dilengkapi.
                </span>
              )}
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                className="px-4 py-2 bg-sougen-blue hover:bg-[#0082c4] text-white text-xs font-inter font-bold uppercase tracking-wider rounded-xl shadow-sm transition-colors"
              >
                Tutup
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
