import { cn } from '../../lib/utils';

export interface AnimationTextProps {
  text: string;
  className?: string;
}

export function AnimationText({ text, className }: AnimationTextProps) {
  // SVG circular text logic
  // The text is placed along a circular path
  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden rounded-full", className)}>
      <div className="animate-spin-slow w-full h-full">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <path
            id="circlePath"
            d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
            fill="transparent"
          />
          <text className="font-poppins text-[10px] font-bold uppercase tracking-[0.2em] text-rpo-white/70">
            <textPath href="#circlePath" startOffset="0%">
              {text} • {text} • {text} • 
            </textPath>
          </text>
        </svg>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-sougen-blue shadow-[0_0_10px_rgba(0,148,222,0.8)]" />
    </div>
  );
}
