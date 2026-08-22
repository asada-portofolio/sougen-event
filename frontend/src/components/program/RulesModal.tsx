import { useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import DOMPurify from 'dompurify';

export interface RulesModalProps {
  title: string;
  rulesHtml: string;
  isOpen: boolean;
  onClose: () => void;
}

export function RulesModal({ title, rulesHtml, isOpen, onClose }: RulesModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Sanitize the HTML string to prevent XSS attacks
  const safeHtml = DOMPurify.sanitize(rulesHtml);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-3xl bg-white border border-black/10 rounded-xl shadow-sm max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-black/10 bg-white sticky top-0 z-10 rounded-t-xl">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-sougen-blue" />
            <h3 className="font-poppins text-lg sm:text-xl font-bold text-rpo-black">
              Aturan Main: {title}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-rpo-black/50 hover:text-sougen-blue hover:bg-sougen-blue/10 rounded-md transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          <div 
            className="prose prose-rpo max-w-none prose-p:text-rpo-black/70 prose-a:text-sougen-blue hover:prose-a:text-sougen-green-dark prose-headings:text-rpo-black font-inter"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-black/10 bg-[#FAFAFA] flex justify-end rounded-b-xl">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-sougen-blue hover:bg-sougen-green-dark text-white font-inter font-semibold rounded-md transition-all duration-300 shadow-sm"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
