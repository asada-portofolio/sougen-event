
import { cn } from '../../lib/utils';

export interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  className?: string;
  align?: 'left' | 'center' | 'right';
  /** Gunakan 'dark' jika SectionHeader berada di atas background gelap (Hero, Footer) */
  theme?: 'light' | 'dark';
}

export function SectionHeader({
  label,
  title,
  description,
  className,
  align = 'left',
  theme = 'light',
}: SectionHeaderProps) {
  const isDark = theme === 'dark';

  return (
    <div
      className={cn(
        'flex flex-col',
        {
          'items-start text-left': align === 'left',
          'items-center text-center': align === 'center',
          'items-end text-right': align === 'right',
        },
        className
      )}
    >
      <div className={cn(
        "flex flex-col",
        {
          'items-start': align === 'left' || align === 'center', // Tetap rata kiri untuk title/badge walau di-center
          'items-end': align === 'right'
        }
      )}>
        {/* Kicker Label */}
        <div className="bg-rpo-red text-white text-[10px] sm:text-[11px] font-extrabold px-2 py-1 tracking-[0.5px] mb-1">
          {label}
        </div>
        
        {/* Heading */}
        <h2 className={cn(
          'font-poppins text-[2.5rem] sm:text-[3.8rem] font-black leading-none tracking-[-1.5px] m-0 uppercase',
          isDark ? 'text-white' : 'text-rpo-black'
        )}>
          {title}
        </h2>
        
        {/* Underline */}
        <div className="w-full h-[3px] bg-rpo-red mt-2 mb-4"></div>
      </div>
      {description && (
        <p className={cn(
          "max-w-[85%] sm:max-w-lg font-inter text-[13px] sm:text-[15px] font-semibold leading-[1.6] mt-2",
          isDark ? 'text-white/80' : 'text-rpo-black/80',
          {
            'text-center mx-auto': align === 'center'
          }
        )}>
          {description}
        </p>
      )}
    </div>
  );
}
